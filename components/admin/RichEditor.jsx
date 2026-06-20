'use client'

import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export default function RichEditor({ value, onChange }) {
  const editorRef = useRef(null)

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={(newValue) => onChange(newValue)}
      init={{
        height: 450,
        menubar: false,
        directionality: 'rtl',
        language: 'ar',
        language_url: '/tinymce/langs/ar.js',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'preview', 'wordcount',
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic underline strikethrough | forecolor backcolor | ' +
          'alignright aligncenter alignleft alignjustify | ' +
          'bullist numlist outdent indent | ' +
          'link image table | removeformat code fullscreen',
        content_style: `
          body {
            font-family: 'Tajawal', Tahoma, Arial, sans-serif;
            font-size: 16px;
            direction: rtl;
            text-align: right;
            padding: 12px 16px;
            color: #374151;
            line-height: 1.8;
          }
        `,
        skin: 'oxide',
        content_css: 'default',
        branding: false,
        promotion: false,
        resize: true,
        statusbar: true,
        elementpath: false,
      }}
    />
  )
}
