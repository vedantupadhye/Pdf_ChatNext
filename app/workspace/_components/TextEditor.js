

// working code

import React, { useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import Highlight from '@tiptap/extension-highlight';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useEditor, EditorContent } from '@tiptap/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import EditorExtension from './EditorExtension'

const TextEditor = ({ fileId }) => {
  const notes = useQuery(api.notes.GetNotes, {
    fileId: fileId
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      BulletList,
      ListItem,
      TaskList,
      TaskItem,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none h-screen p-5'
      }
    }
  });

  useEffect(() => {
    if (editor && notes) {
      editor.commands.setContent(notes);
    }
  }, [notes, editor]);

  return (
    <div>
      <EditorExtension editor={editor} />
      <div className='overflow-scroll h-[88vh]'>
      <EditorContent editor={editor} />
      </div>
      
    </div>
  );
};

export default TextEditor;













// import React, { useEffect } from 'react'
// import StarterKit from '@tiptap/starter-kit'
// import { useEditor, EditorContent } from '@tiptap/react'
// import EditorExtension from './EditorExtension'
// import { useQuery } from 'convex/react'
// import { api } from '@/convex/_generated/api'

// const TextEditor = ({fileId}) => {

//     const notes=useQuery(api.notes.GetNotes,{
//         fileId:fileId
//     })
//     console.log(notes)
//     const editor = useEditor({
//         extensions: [StarterKit], // Remove Placeholder extension here
//         editorProps: {
//             attributes: {
//                 class: 'focus:outline-none h-screen p-5'
//             }
//         }
//     })

//     useEffect(() =>{
//         editor&&editor.commands.setContent(notes)

//     },[notes&&editor])
    
//     return (
//         <div>
//             <EditorExtension editor={editor} />
          
//             <EditorContent editor={editor} /> 
//              {/* can not edit new data - can see old data  is at the right place*/}
             
//         </div>
//     )
// }

// export default TextEditor
