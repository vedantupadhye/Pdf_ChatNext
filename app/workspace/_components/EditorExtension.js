import React, { useState,useEffect } from 'react';
import { Bold, Italic, HighlighterIcon, List, AlignJustify, AlignCenter, ListCheck, ListChecksIcon, BookXIcon, SparkleIcon } from 'lucide-react';
import BulletList from '@tiptap/extension-bullet-list';
import Highlight from '@tiptap/extension-highlight';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list'; // Import TaskList
import TaskItem from '@tiptap/extension-task-item'; // Import TaskItem
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { chatSession } from '@/config/AIModel';
import { toast } from 'sonner';


const EditorExtension = ({ editor }) => {
  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleHighlight = () => editor.chain().focus().toggleHighlight({ color: '#FFEB3B' }).run();
  const unsetHighlight = () => editor.chain().focus().unsetHighlight().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleTaskList = () => editor.chain().focus().toggleTaskList().run(); // Toggle Task List
  const splitListItem = () => editor.chain().focus().splitListItem('taskItem').run(); // Split list item
  const toggleTextAlign = (alignment) => editor.chain().focus().setTextAlign(alignment).run();

    const {fileId} = useParams()
    const SearchAi= useAction(api.myActions.search)
    
    const onAiClick = async(query) =>{
        toast('AI is thinking ...')
        const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
        )       
        console.log(selectedText) 

        const result = await SearchAi({
            query:selectedText,
            fileId:fileId
        })

        console.log("result" ,result)
        const UnformattedAns= JSON.parse(result)
        let AllUnformattedAns = ' '

        UnformattedAns&&UnformattedAns.forEach(item => {
            AllUnformattedAns = AllUnformattedAns+item.pageContent
        });

        const PROMPT = `
        For the question: "${selectedText}"
        and the following content as the answer:
        "${AllUnformattedAns}"
        Please format the entire response in HTML. Do not add any content by yourself 
      `;

        const AiModelResult = await chatSession.sendMessage(PROMPT)
        const FinalAns = AiModelResult.response.text().replace('```','').replace('html','').replace('```','')
        console.log(FinalAns)
        const AllText = editor.getHTML();
        editor.commands.setContent(AllText+'<p><strong>Answer: </strong>'+FinalAns+'</p>')


    }

  return (
    <div className="p-5">
      <div className="control-group">
        <div className="button-group flex justify-between mr-48">
          
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
          <button
            onClick={() => onAiClick()}
            className={'hover:text-blue-500'}
          >
            <SparkleIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
const TextChanger = () => {
  const [showEditor, setShowEditor] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit, // Includes Bold, Italic, and Headings
      Underline, // Add underline functionality
      Highlight, // Add highlight functionality
      BulletList, // Add bullet list functionality
      ListItem, // Add list item functionality
      TaskList, // Add task list functionality
      TaskItem, // Add task item functionality
      TextAlign.configure({ types: ['heading', 'paragraph'] }), // Add text alignment functionality
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none h-screen p-5',
      },
    },
  });

  return (
   <div>
      <EditorExtension editor={editor}/>
      <div className='overflow-scroll h-[88vh]'>
         <EditorContent editor={editor} />  
         {/* cant see the old data but can edit new  */}
      </div>
      
   </div>
  );
};

export default TextChanger;

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