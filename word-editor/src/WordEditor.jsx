import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import beautify from 'js-beautify';

function removePInLi(html) {
  // Ganti <li><p>...</p></li> menjadi <li>...</li>
  return html.replace(/<li>\s*<p>(.*?)<\/p>\s*<\/li>/gis, '<li>$1</li>');
}

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        autolink: false,
        linkOnPaste: true,
        openOnClick: true,
        protocols: ['http', 'https', 'mailto'],
      }),
    ],
    content: 'ayo coba paste disini',
  });

  if (!editor) return null;

  // Ambil HTML, beautify, lalu hapus <p> di dalam <li>
  const htmlOutput = removePInLi(
    beautify.html(editor.getHTML(), {
      indent_size: 2,
      wrap_line_length: 80,
    })
  );

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
        {htmlOutput}
      </pre>
    </div>
  );
}