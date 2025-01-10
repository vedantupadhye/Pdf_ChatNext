
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
  
      const notesContent = editor.getHTML();
      if (!notesContent || !notesContent.trim()) {
        toast.error('Editor content is empty. Cannot save.');
        return;
      }
  
      await saveNotes({
        notes: notesContent,
        fileId,
        createdBy: user?.primaryEmailAddress?.emailAddress || 'Unknown User',
      });
  
      toast.success('Changes saved successfully');
    } catch (error) {
      console.error('Error saving notes:', { error, fileId, notes: editor?.getHTML() });
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const onAiClick = async (query) => {
    if (!editor) return;
    
    try {
      toast('AI is thinking...');
      
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        ' '
      );
  
      if (!selectedText) {
        toast.error('Please select some text first');
        return;
      }
  
      console.log('Selected text:', selectedText); // Debug log
  
      const result = await SearchAi({
        query: selectedText,
        fileId: fileId
      });
  
      console.log('Raw AI response:', result); // Debug log
  
      let unformattedAnswers;
      try {
        // Check if result is already an object/array
        if (typeof result === 'object' && result !== null) {
          unformattedAnswers = result;
        } else {
          unformattedAnswers = JSON.parse(result);
        }
        console.log('Parsed answers:', unformattedAnswers); // Debug log
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.log('Raw response that failed parsing:', result);
        toast.error('Invalid response format from AI');
        return;
      }
  
      // Handle different response formats
      let combinedContent = '';
      if (Array.isArray(unformattedAnswers)) {
        combinedContent = unformattedAnswers
          .filter(item => item && item.pageContent) // Add null check
          .map(item => item.pageContent)
          .join(' ');
      } else if (typeof unformattedAnswers === 'object' && unformattedAnswers !== null) {
        // If it's a single object
        if (unformattedAnswers.pageContent) {
          combinedContent = unformattedAnswers.pageContent;
        } else if (unformattedAnswers.text) {
          combinedContent = unformattedAnswers.text;
        } else if (unformattedAnswers.content) {
          combinedContent = unformattedAnswers.content;
        } else {
          combinedContent = JSON.stringify(unformattedAnswers);
        }
      } else {
        // If it's a string or other format
        combinedContent = String(unformattedAnswers);
      }
  
      console.log('Combined content:', combinedContent); // Debug log
  
      if (!combinedContent.trim()) {
        console.error('Empty content after processing', { 
          original: result,
          parsed: unformattedAnswers 
        });
        toast.error('No valid content received from AI');
        return;
      }
  
      const prompt = `
        For the question: "${selectedText}"
        and the following content as the answer:
        "${combinedContent}"
        Your task:
            - Provide a direct and concise answer to the question.
            - Format the response in valid HTML.
            - do not give any answer by yourself
            - Use <h3> for headings instead of <h1> or any other level.
            - Avoid excessive spacing or unnecessary tags.
            - Keep the response clean and professional.
      `;
  
      console.log('Sending prompt to AI:', prompt); // Debug log
  
      const aiModelResult = await chatSession.sendMessage(prompt);
      const formattedAnswer = aiModelResult.response
        .text()
        .replace(/```(html)?/g, '')
        .trim();
  
      console.log('Formatted answer:', formattedAnswer); // Debug log
  
      if (!formattedAnswer) {
        toast.error('No formatted response received from AI');
        return;
      }
  
      const currentContent = editor.getHTML();
      editor.commands.setContent(
        currentContent + 
        '<p><strong>Answer: </strong>' + 
        formattedAnswer + 
        '</p>'
      );
  
      toast.success('AI response added successfully');
    } catch (error) {
      console.error('Error processing AI request:', error);
      toast.error('Failed to process AI request. Please try again.');
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





// code of video, better ai feature  




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