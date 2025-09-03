import React, { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import beautify from 'js-beautify';

function removePInLi(html) {
  return html.replace(/<li>\s*<p>(.*?)<\/p>\s*<\/li>/gis, '<li>$1</li>');
}

function cleanEmptyPTagsInTable(html) {
  return html.replace(/<(td|th)>\s*<p>\s*<\/p>\s*<\/(td|th)>/gis, '<$1></$1>');
}

function removeEmptyTd(html) {
  return html.replace(/<td\s+colspan="1"\s+rowspan="1">\s*<p>\s*<\/p>\s*<\/td>/gis, '');
}

function removeEmptyTr(html) {
  return html.replace(/<tr>\s*<\/tr>/gis, '');
}

function removeExtraNewlines(html) {
  return html.replace(/(\r?\n){2,}/g, '\n');
}

function addStyleToAllFirstRowTdAndTh(html) {
  const styleStr = 'text-align: center;background: rgb(1,101,177);color: rgb(255,255,255);vertical-align: middle;width: 50.0%;';
  return html.replace(/(<table[\s\S]*?>[\s\S]*?<tr[^>]*>)([\s\S]*?)(<\/tr>)/gi, (match, startTr, inner, endTr) => {
    const styledInner = inner
      .replace(/<td\b([^>]*)>/gi, `<td$1 style="${styleStr}">`)
      .replace(/<th\b([^>]*)>/gi, `<th$1 style="${styleStr}">`);
    return `${startTr}${styledInner}${endTr}`;
  });
}

/**
 * Aman: hanya mengganti <p>accordion</p> (+ optional <br/>) menjadi panel.
 * Tidak akan menyentuh '#accordion' dalam atribut data-parent pada panel yang sudah disisipkan.
 */
function replaceAccordion(html) {
  return html.replace(
    /<p>\s*accordion(?:<br\s*\/?>|\s)*(-title:\s*([^<]+))?(?:<br\s*\/?>|\s)*(-isi:\s*([^<]+))?\s*<\/p>/gi,
    (match, _tBlock, title, _iBlock, isi) => {
      return `<p>
<div class="panel panel-default">
  <div class="panel-heading" role="tab" id="heading9">
    <a data-toggle="collapse" data-parent="#accordion" aria-expanded="true" href="#collapse9" aria-controls="collapse9">
      <div class="row">
        <div class="col col-md-10 col-xs-10 col-sm-10">
          <div class="panel-title">
            <h3>${title ? title.replace(/^-title:\s*/, '').trim() : ''}</h3>
          </div>
        </div>
        <div class="col col-md-2 col-xs-2 col-sm-2">
          <div class="panel-arrow pull-right">
            <i class="fa fa-chevron-down" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </a>
  </div>
  <div role="tabpanel" class="panel-collapse collapse" id="collapse9" aria-labelledby="heading9">
    <div class="panel-body">
${isi ? isi.replace(/^-isi:\s*/, '').trim() : ''}
    </div>
  </div>
</div>
</p>`;
    }
  );
}


/**
 * Merge panel + paragraf -title / -isi setelahnya.
 * Pola:  <p>[panel]</p> [opsional <p>-title: ...</p>] [opsional <p>-isi: ...</p>]
 * Global (g) agar bisa banyak panel sekaligus.
 */
function mergeAccordionPanels(html) {
  const re = new RegExp(
    '(<p>\\s*)(<div class="panel panel-default"[\\s\\S]*?<\\/div>\\s*<\\/div>\\s*<\\/div>)(\\s*<\\/p>)' +
    '(?:\\s*<p>\\s*-title:\\s*([^<]+?)\\s*<\\/p>)?' +
    '(?:\\s*<p>\\s*-isi:\\s*([^<]+?)\\s*<\\/p>)?',
    'gi'
  );

  return html.replace(re, (_m, pOpen, panelHtml, pClose, title, isi) => {
    let result = panelHtml;

    if (typeof title === 'string') {
      result = result.replace(/<h3[^>]*>[\s\S]*?<\/h3>/i, `<h3>${title.trim()}</h3>`);
    }
    if (typeof isi === 'string') {
      result = result.replace(
        /<div class="panel-body">[\s\S]*?<\/div>/i,
        `<div class="panel-body">\n${isi.trim()}\n    </div>`
      );
    }

    // Tetap dibungkus <p>... </p> sesuai ekspektasi
    return `${pOpen}${result}${pClose}`;
  });
}

/** Sapu sisa paragraf -title / -isi kalau masih ada */
function stripTitleIsiParas(html) {
  return html
    .replace(/\s*<p>\s*-title:\s*[^<]*<\/p>/gi, '')
    .replace(/\s*<p>\s*-isi:\s*[^<]*<\/p>/gi, '');
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
      Table.configure({ resizable: true, HTMLAttributes: { class: 'table table-bordered' } }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: 'ayo coba paste disini',
  });

  const outputRef = useRef(null);

  if (!editor) return null;

  // Urutan penting:
  // 1) replaceAccordion -> 2) beautify & pembersihan lain -> 3) mergeAccordionPanels -> 4) stripTitleIsiParas
  const htmlOutput = stripTitleIsiParas(
    mergeAccordionPanels(
      addStyleToAllFirstRowTdAndTh(
        removeExtraNewlines(
          beautify.html(
            removeEmptyTr(
              removeEmptyTd(
                cleanEmptyPTagsInTable(
                  removePInLi(
                    replaceAccordion(editor.getHTML())
                  )
                )
              )
            ),
            { indent_size: 2, wrap_line_length: 80 }
          )
        )
      )
    )
  );

  const cleanedHtmlOutput = htmlOutput;

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanedHtmlOutput);
  };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'Arial, sans-serif', display: 'flex', gap: 24 }}>
      <div style={{ flex: 2 }}>
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
        <button
          onClick={handleCopy}
          style={{
            marginBottom: 10,
            padding: '6px 16px',
            background: '#0165b1',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Salin Output
        </button>
        <pre
          ref={outputRef}
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
          {cleanedHtmlOutput}
        </pre>
      </div>
      <div style={{
        flex: 1,
        background: '#f4f8ff',
        border: '1px solid #cce0ff',
        borderRadius: 6,
        padding: 18,
        fontSize: 15,
        color: '#002561',
        marginTop: 38,
        height: 'fit-content'
      }}>
        <strong>Tips Accordion:</strong>
        <div style={{ marginTop: 10 }}>
          Jika ingin membuat <b>accordion</b> pada output, gunakan format berikut:<br /><br />
          <code style={{
            background: '#eaf4ff',
            padding: '6px 10px',
            borderRadius: 4,
            display: 'block',
            fontSize: 14,
            color: '#0165b1'
          }}>
            accordion<br />
            -title: Judul Accordion<br />
            -isi: Kontennya
          </code>
          <br />
          <span style={{ fontSize: 13, color: '#444' }}>
            <b>accordion</b> akan diganti dengan panel; baris <b>-title:</b> dan <b>-isi:</b> akan otomatis di-merge ke dalam panel.
          </span>
        </div>
      </div>
    </div>
  );
}
