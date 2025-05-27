import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: '<p>Mulai ketik di sini...</p>',
  });

  if (!editor) {
    return null;
  }

  return (
    <div style={{ maxWidth: 700, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>TipTap React Editor</h2>

      {/* Toolbar */}
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={{ fontWeight: editor.isActive('bold') ? 'bold' : 'normal', marginRight: 8 }}
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={{ fontStyle: editor.isActive('italic') ? 'italic' : 'normal', marginRight: 8 }}
        >
          Italic
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          style={{ textDecoration: editor.isActive('underline') ? 'underline' : 'none', marginRight: 8 }}
        >
          Underline
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={{ fontWeight: editor.isActive('bulletList') ? 'bold' : 'normal', marginRight: 8 }}
        >
          Bullet List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={{ fontWeight: editor.isActive('orderedList') ? 'bold' : 'normal' }}
        >
          Ordered List
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        style={{
          minHeight: 150,
          border: '1px solid #ccc',
          padding: 10,
          color: 'black',
          fontSize: 16,
          borderRadius: 4,
          backgroundColor: 'white',
        }}
      />

      {/* Output HTML */}
      <h3>Output HTML:</h3>
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          border: '1px solid #ccc',
          padding: 10,
          minHeight: 150,
          backgroundColor: '#f9f9f9',
          marginTop: 10,
          color: 'black',
          fontSize: 14,
          borderRadius: 4,
        }}
      >
        {editor.getHTML()}
      </pre>
    </div>
  );
}
