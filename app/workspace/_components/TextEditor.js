
import React, { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/react'
import EditorExtension from './EditorExtension'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

const TextEditor = ({fileId}) => {

    const notes=useQuery(api.notes.GetNotes,{
        fileId:fileId
    })
    console.log(notes)
    const editor = useEditor({
        extensions: [StarterKit], // Remove Placeholder extension here
        editorProps: {
            attributes: {
                class: 'focus:outline-none h-screen p-5'
            }
        }
    })

    useEffect(() =>{
        editor&&editor.commands.setContent(notes)

    },[notes&&editor])
    
    return (
        <div>
            <EditorExtension editor={editor} />
          
             {/* <EditorContent editor={editor} /> */}
             {/* can not edit new data - can see old data  is at the right place*/}
             
        </div>
    )
}

export default TextEditor
