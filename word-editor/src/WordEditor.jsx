import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import beautify from 'js-beautify';

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        autolink: false,        // Jangan auto-link saat ngetik
        linkOnPaste: true,      // Buat link hanya saat paste
        openOnClick: true,
        protocols: ['http', 'https', 'mailto'],
      }),
    ],
    content: '<p>Coba paste link di sini...</p>',
  });

  if (!editor) return null;

  return (
    <div style={{ maxWidth: 700, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>TipTap React Editor</h2>

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
        {beautify.html(editor.getHTML(), {
          indent_size: 2,
          wrap_line_length: 80,
        })}
      </pre>
    </div>
  );
}