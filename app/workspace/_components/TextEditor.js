import React from 'react'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import EditorExtension from './EditorExtension'

const TextEditor = () => {
    const editor = useEditor({
        extensions: [StarterKit ,Placeholder.configure({
            placeholder: 'Taking your notes here...',
        })],
      
        editorProps:{
            attributes:{
                class:'focus:outline-none h-screen p-5'
            }
        }
      })
  return (        
    <div>
        <EditorExtension editor={editor} />
        <div>
            <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default TextEditor