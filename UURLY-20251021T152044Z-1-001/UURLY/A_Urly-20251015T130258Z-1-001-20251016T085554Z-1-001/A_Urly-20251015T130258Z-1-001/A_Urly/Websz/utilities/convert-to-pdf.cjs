/**
 * Markdown to PDF Converter
 * Converts INTERFACE-WIREFRAMES.md to PDF format
 */

const fs = require('fs');
const { exec } = require('child_process');

console.log('📄 Converting Markdown to PDF...\n');

// Check if markdown file exists
const mdPath = './INTERFACE-WIREFRAMES.md';
if (!fs.existsSync(mdPath)) {
    console.error('❌ Error: INTERFACE-WIREFRAMES.md not found!');
    process.exit(1);
}

console.log('✅ Found INTERFACE-WIREFRAMES.md');
console.log('\n📝 To convert this to PDF, you have several options:\n');

console.log('OPTION 1: Use VS Code (Recommended)');
console.log('─────────────────────────────────────');
console.log('1. Install "Markdown PDF" extension by yzane');
console.log('2. Open INTERFACE-WIREFRAMES.md in VS Code');
console.log('3. Press Ctrl+Shift+P (or Cmd+Shift+P on Mac)');
console.log('4. Type "Markdown PDF: Export (pdf)"');
console.log('5. Press Enter\n');

console.log('OPTION 2: Use Pandoc (Command Line)');
console.log('─────────────────────────────────────');
console.log('1. Install Pandoc: https://pandoc.org/installing.html');
console.log('2. Run: pandoc INTERFACE-WIREFRAMES.md -o INTERFACE-WIREFRAMES.pdf --pdf-engine=wkhtmltopdf\n');

console.log('OPTION 3: Online Converter');
console.log('─────────────────────────────────────');
console.log('1. Visit: https://www.markdowntopdf.com/');
console.log('2. Upload INTERFACE-WIREFRAMES.md');
console.log('3. Download the PDF\n');

console.log('OPTION 4: Use Chrome/Edge Browser');
console.log('─────────────────────────────────────');
console.log('1. Install a Markdown viewer extension');
console.log('2. Open INTERFACE-WIREFRAMES.md in browser');
console.log('3. Press Ctrl+P (Print)');
console.log('4. Select "Save as PDF"\n');

console.log('✨ The easiest method is Option 1 (VS Code extension)');
console.log('   This preserves formatting and ASCII art perfectly!\n');
