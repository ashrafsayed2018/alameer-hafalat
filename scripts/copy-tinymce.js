// Cross-platform replacement for `cp -r node_modules/tinymce public/tinymce`.
// Works the same in PowerShell, cmd, and POSIX shells.
const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '..', 'node_modules', 'tinymce')
const dest = path.join(__dirname, '..', 'public', 'tinymce')

fs.cpSync(src, dest, { recursive: true })
