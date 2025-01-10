
import {React,useState} from 'react';
import { Bold, Italic, HighlighterIcon, List, AlignJustify, AlignCenter, ListCheck, ListChecksIcon, BookXIcon, SparkleIcon, Save } from 'lucide-react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { chatSession } from '@/config/AIModel';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

const EditorExtension = ({ editor }) => {
  const [isSaving, setIsSaving] = useState(false);
  // if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleHighlight = () => editor.chain().focus().toggleHighlight({ color: '#FFEB3B' }).run();
  const unsetHighlight = () => editor.chain().focus().unsetHighlight().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleTaskList = () => editor.chain().focus().toggleTaskList().run();
  const splitListItem = () => editor.chain().focus().splitListItem('taskItem').run();
  const toggleTextAlign = (alignment) => editor.chain().focus().setTextAlign(alignment).run();

  const { fileId } = useParams();
  const SearchAi = useAction(api.myActions.search);
  const saveNotes = useMutation(api.notes.AddNotes);
  const { user } = useUser();

  const handleSave = async () => {
    if (!editor) return;
    
    try {
      setIsSaving(true);
      await saveNotes({
        notes: editor.getHTML(),
        fileId: fileId,
        createdBy: user?.primaryEmailAddress?.emailAddress
      });
      toast.success('Changes saved successfully');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };
  const MAX_RETRIES = 3;  // Set a limit on how many times to retry

  const fetchAiResponseWithRetry = async (PROMPT, attempt = 1) => {
    try {
      const AiModelResult = await chatSession.sendMessage(PROMPT);
      return AiModelResult;
    } catch (error) {
      if (attempt <= MAX_RETRIES && error.message.includes('503')) {
        // Retry the request if it's a 503 error
        toast.info(`AI is overloaded. Retrying... (Attempt ${attempt} of ${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 3000));  // Wait for 3 seconds
        return fetchAiResponseWithRetry(PROMPT, attempt + 1);
      } else {
        throw new Error('AI request failed after multiple attempts');
      }
    }
  };
  
  const onAiClick = async (query) => {
    try {
      toast('AI is thinking ...');
  
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        ' '
      );
  
      const result = await SearchAi({
        query: selectedText,
        fileId: fileId
      });
  
      if (!result || result.error) {
        toast.error('Failed to fetch relevant content. Please try again.');
        return;
      }
  
      const UnformattedAns = JSON.parse(result);
      let AllUnformattedAns = '';
      UnformattedAns?.forEach(item => {
        AllUnformattedAns += item.pageContent;
      });
  
      const chunkSize = 3000;
      const chunks = [];
      for (let i = 0; i < AllUnformattedAns.length; i += chunkSize) {
        chunks.push(AllUnformattedAns.slice(i, i + chunkSize));
      }
  
      let completeAnswer = '';
      for (const chunk of chunks) {
        try {
          const PROMPT = `
            Based on the provided question and content:
            Question: "${selectedText}"
            Content: "${chunk}"
  
            Your task:
            - Provide a direct and concise answer to the question.
            - Format the response in valid HTML.
            - do not give any answer by yourself
            - Use <h3> for headings instead of <h1> or any other level.
            - Avoid excessive spacing or unnecessary tags.
            - Keep the response clean and professional.
            
          `;
  
          // Use the retry function to handle 503 errors
          const AiModelResult = await fetchAiResponseWithRetry(PROMPT);
          const partialAnswer = AiModelResult.response.text()
            .replace(/```html|```/g, '')
            .trim();
  
          if (!partialAnswer) {
            toast.error('AI failed to generate a response for this chunk.');
            return;
          }
  
          completeAnswer += partialAnswer + ' ';
        } catch (error) {
          toast.error('AI request failed during chunk processing. Please try again later.');
          console.error('Error during chunk processing:', error);
          return;
        }
      }
  
      if (!completeAnswer.trim()) {
        toast.error('AI could not generate a valid response. Please try again.');
        return;
      }
  
      const FINAL_PROMPT = `
        Based on the following consolidated answer, refine and expand it into a single, cohesive, and well-structured response:
        "${completeAnswer}"
        - Ensure that the response is complete, well-formatted, and directly answers the question.
        - Format the response in valid HTML and ensure readability.
      `;
  
      const finalResponse = await chatSession.sendMessage(FINAL_PROMPT);
      const refinedAnswer = finalResponse.response.text()
        .replace(/```html|```/g, '')
        .trim();
  
      if (!refinedAnswer.trim()) {
        toast.error('AI could not generate a valid refined response. Please try again.');
        return;
      }
  
      const AllText = editor.getHTML();
      editor.commands.setContent(AllText + `<p><strong>Answer:</strong> ${refinedAnswer}</p>`);
  
      await saveNotes({
        notes: editor.getHTML(),
        fileId: fileId,
        createdBy: user?.primaryEmailAddress?.emailAddress
      });
  
      toast.success('AI response added to your document successfully!');
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('AI Error:', error);
    }
  };
  
  
  return editor&&(
    <div className="p-5">
      <div className="control-group">
        <div className="button-group flex justify-between mr-5">
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'text-blue-500' : ''}
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'text-blue-500' : ''}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'text-blue-500' : ''}
          >
            H3
          </button>

          {/* Bold */}
          <button
            onClick={toggleBold}
            className={editor.isActive('bold') ? 'text-blue-500' : ''}
          >
            <Bold />
          </button>

          {/* Italic */}
          <button
            onClick={toggleItalic}
            className={editor.isActive('italic') ? 'text-blue-500' : ''}
          >
            <Italic />
          </button>

          {/* Underline */}
          <button
            onClick={toggleUnderline}
            className={editor.isActive('underline') ? 'text-blue-500' : ''}
          >
            U
          </button>

          {/* Highlight */}
          <button
            onClick={toggleHighlight}
            className={editor.isActive('highlight') ? 'text-blue-500' : ''}
          >
            <HighlighterIcon />
          </button>

          {/* Unset Highlight */}
          <button
            onClick={unsetHighlight}
            disabled={!editor.isActive('highlight')}
            className={!editor.isActive('highlight') ? 'opacity-50' : ''}
          >
            <BookXIcon />
          </button>

          {/* Bullet Points */}
          <button
            onClick={toggleBulletList}
            className={editor.isActive('bulletList') ? 'text-blue-500' : ''}
          >
            <List />
          </button>

          {/* Task List Toggle */}
          <button
            onClick={toggleTaskList}
            className={editor.isActive('taskList') ? 'text-blue-500' : ''}
          >
            <ListCheck />
          </button>

          {/* Split List Item */}
          <button
            onClick={splitListItem}
            disabled={!editor.can().splitListItem('taskItem')}
          >
            <ListChecksIcon />
          </button>

          {/* Justify Content */}
          <button
            onClick={() => toggleTextAlign('justify')}
            className={editor.isActive({ textAlign: 'justify' }) ? 'text-blue-500' : ''}
          >
            <AlignJustify />
          </button>

          {/* Center Content */}
          <button
            onClick={() => toggleTextAlign('center')}
            className={editor.isActive({ textAlign: 'center' }) ? 'text-blue-500' : ''}
          >
            <AlignCenter />
          </button>
          <div className="flex items-center space-x-2 relative group">
            <span className=" text-purple-500 font-semibold">Try AI Feature</span>
            
            <button
              onClick={() => onAiClick()}
              className="relative hover:text-blue-500 transition-all duration-300"
            >
              <SparkleIcon className="w-6 h-6" />
              
              {/* Tooltip on hover */}
              <span className=" absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm px-3 py-1 rounded-lg bg-gray-700 text-white shadow-md whitespace-nowrap">
                Select the text and click on the button
              </span>
            </button>
          </div>


          <Button 
            onClick={handleSave}
            disabled={isSaving}
            variant="outline"
            size="sm"
            className="flex items-center bg-black text-white gap-2 ml-4"
          >
            <Save className="w-4 h-4 " />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};


export default EditorExtension;




// import React, { useState,useEffect } from 'react';
// import { Bold, Italic, HighlighterIcon, List, AlignJustify, AlignCenter, ListCheck, ListChecksIcon, BookXIcon, SparkleIcon } from 'lucide-react';
// import BulletList from '@tiptap/extension-bullet-list';
// import Highlight from '@tiptap/extension-highlight';
// import ListItem from '@tiptap/extension-list-item';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import TaskList from '@tiptap/extension-task-list'; // Import TaskList
// import TaskItem from '@tiptap/extension-task-item'; // Import TaskItem
// import { useAction, useMutation, useQuery } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { useParams } from 'next/navigation';
// import { chatSession } from '@/config/AIModel';
// import { toast } from 'sonner';
// import { useUser } from '@clerk/nextjs';


// const EditorExtension = ({ editor }) => {
//   if (!editor) return null;

//   const toggleBold = () => editor.chain().focus().toggleBold().run();
//   const toggleItalic = () => editor.chain().focus().toggleItalic().run();
//   const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
//   const toggleHighlight = () => editor.chain().focus().toggleHighlight({ color: '#FFEB3B' }).run();
//   const unsetHighlight = () => editor.chain().focus().unsetHighlight().run();
//   const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
//   const toggleTaskList = () => editor.chain().focus().toggleTaskList().run(); // Toggle Task List
//   const splitListItem = () => editor.chain().focus().splitListItem('taskItem').run(); // Split list item
//   const toggleTextAlign = (alignment) => editor.chain().focus().setTextAlign(alignment).run();

//     const {fileId} = useParams()
//     const SearchAi= useAction(api.myActions.search)
//     const saveNotes = useMutation(api.notes.AddNotes)
//     const {user} = useUser()

//     const onAiClick = async(query) =>{
//         toast('AI is thinking ...')
//         const selectedText = editor.state.doc.textBetween(
//             editor.state.selection.from,
//             editor.state.selection.to,
//             ' '
//         )       
//         console.log(selectedText) 

//         const result = await SearchAi({
//             query:selectedText,
//             fileId:fileId
//         })

//         console.log("result" ,result)
//         const UnformattedAns= JSON.parse(result)
//         let AllUnformattedAns = ' '

//         UnformattedAns&&UnformattedAns.forEach(item => {
//             AllUnformattedAns = AllUnformattedAns+item.pageContent
//         });

//         const PROMPT = `
//         For the question: "${selectedText}"
//         and the following content as the answer:
//         "${AllUnformattedAns}"
//         Please format the entire response in HTML. Do not add any content by yourself 
//       `;

//         const AiModelResult = await chatSession.sendMessage(PROMPT)
//         const FinalAns = AiModelResult.response.text().replace('```','').replace('html','').replace('```','')
//         console.log(FinalAns)
//         const AllText = editor.getHTML();
//         editor.commands.setContent(AllText+'<p><strong>Answer: </strong>'+FinalAns+'</p>')

//         saveNotes({
//           notes: editor.getHTML(),
//           fileId: fileId,
//           createdBy:user?.primaryEmailAddress?.emailAddress

//         })

//     }

//   return editor&&(
//     <div className="p-5">
//       <div className="control-group">
//         <div className="button-group flex justify-between mr-48">
          
//           <button
//             onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//             className={editor.isActive('heading', { level: 1 }) ? 'text-blue-500' : ''}
//           >
//             H1
//           </button>
//           <button
//             onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//             className={editor.isActive('heading', { level: 2 }) ? 'text-blue-500' : ''}
//           >
//             H2
//           </button>
//           <button
//             onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//             className={editor.isActive('heading', { level: 3 }) ? 'text-blue-500' : ''}
//           >
//             H3
//           </button>

//           {/* Bold */}
//           <button
//             onClick={toggleBold}
//             className={editor.isActive('bold') ? 'text-blue-500' : ''}
//           >
//             <Bold />
//           </button>

//           {/* Italic */}
//           <button
//             onClick={toggleItalic}
//             className={editor.isActive('italic') ? 'text-blue-500' : ''}
//           >
//             <Italic />
//           </button>

//           {/* Underline */}
//           <button
//             onClick={toggleUnderline}
//             className={editor.isActive('underline') ? 'text-blue-500' : ''}
//           >
//             U
//           </button>

//           {/* Highlight */}
//           <button
//             onClick={toggleHighlight}
//             className={editor.isActive('highlight') ? 'text-blue-500' : ''}
//           >
//             <HighlighterIcon />
//           </button>

//           {/* Unset Highlight */}
//           <button
//             onClick={unsetHighlight}
//             disabled={!editor.isActive('highlight')}
//             className={!editor.isActive('highlight') ? 'opacity-50' : ''}
//           >
//             <BookXIcon />
//           </button>

//           {/* Bullet Points */}
//           <button
//             onClick={toggleBulletList}
//             className={editor.isActive('bulletList') ? 'text-blue-500' : ''}
//           >
//             <List />
//           </button>

//           {/* Task List Toggle */}
//           <button
//             onClick={toggleTaskList}
//             className={editor.isActive('taskList') ? 'text-blue-500' : ''}
//           >
//             <ListCheck />
//           </button>

//           {/* Split List Item */}
//           <button
//             onClick={splitListItem}
//             disabled={!editor.can().splitListItem('taskItem')}
//           >
//             <ListChecksIcon />
//           </button>

//           {/* Justify Content */}
//           <button
//             onClick={() => toggleTextAlign('justify')}
//             className={editor.isActive({ textAlign: 'justify' }) ? 'text-blue-500' : ''}
//           >
//             <AlignJustify />
//           </button>

//           {/* Center Content */}
//           <button
//             onClick={() => toggleTextAlign('center')}
//             className={editor.isActive({ textAlign: 'center' }) ? 'text-blue-500' : ''}
//           >
//             <AlignCenter />
//           </button>
//           <button
//             onClick={() => onAiClick()}
//             className={'hover:text-blue-500'}
//           >
//             <SparkleIcon />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// const TextEditor = () => {
//   const [showEditor, setShowEditor] = useState(true);

//   const editor = useEditor({
//     extensions: [
//       StarterKit, // Includes Bold, Italic, and Headings
//       Underline, // Add underline functionality
//       Highlight, // Add highlight functionality
//       BulletList, // Add bullet list functionality
//       ListItem, // Add list item functionality
//       TaskList, // Add task list functionality
//       TaskItem, // Add task item functionality
//       TextAlign.configure({ types: ['heading', 'paragraph'] }), // Add text alignment functionality
//     ],
//     editorProps: {
//       attributes: {
//         class: 'focus:outline-none h-screen p-5',
//       },
//     },
//   });

//   return (
//    <div>
//       <EditorExtension editor={editor}/>
//       <div className=' '>
//       {/* overflow-scroll h-[88vh] */}
//          {/* <EditorContent editor={editor} />   */}
//          {/* can see the old data but cant edit   */}
//       </div>
      
//    </div>
//   );
// };

// export default TextEditor;

{/* <div className="w-full h-screen flex flex-col bg-white">
<div className="border-b">
  <EditorExtension editor={editor} />
</div>
<div className="flex-grow overflow-y-auto">
  <div className="max-w-screen-lg mx-auto px-4">
    <EditorContent 
      editor={editor} 
      // className="min-h-full py-8"
    />
  </div>
</div>
</div> */}