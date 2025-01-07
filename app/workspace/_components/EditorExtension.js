import React, { useState } from 'react';
import { Bold, Italic, HighlighterIcon, List, AlignJustify, AlignCenter, ListCheck, ListChecksIcon, BookXIcon } from 'lucide-react';
import BulletList from '@tiptap/extension-bullet-list';
import Highlight from '@tiptap/extension-highlight';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list'; // Import TaskList
import TaskItem from '@tiptap/extension-task-item'; // Import TaskItem

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

  return (
    <div className="p-5">
      <div className="control-group">
        <div className="button-group flex gap-4">
          {/* Headings */}
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
        </div>
      </div>
    </div>
  );
};

const TextEditor = () => {
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
    <div className="editor-wrapper">
      <EditorExtension editor={editor} />
      
      {/* Conditional rendering based on `showEditor` state */}
      {showEditor && (
        <div className="editor-content-wrapper">
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
};

export default TextEditor;

