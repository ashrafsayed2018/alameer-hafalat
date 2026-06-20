'use client'

import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export default function RichEditor({ value, onChange }) {
  const editorRef = useRef(null)

  return (
    <Editor
      apiKey="ccgla7ohunwe2tytetrl8zns3ccb529r88v7pi8g194gvdar"
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={(newValue) => onChange(newValue)}
      init={{
        height: 450,
        menubar: false,
        directionality: 'rtl',
        language: 'ar',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
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
        branding: false,
        promotion: false,
        resize: true,
        statusbar: true,
        elementpath: false,
      }}
    />
  )
}
