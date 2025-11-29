const fs = require('fs');
const { marked } = require('marked');
const htmlPdf = require('html-pdf-node');

console.log('📄 Converting INTERFACE-WIREFRAMES.md to PDF...\n');

// Read the markdown file
const markdown = fs.readFileSync('./INTERFACE-WIREFRAMES.md', 'utf-8');

// Convert markdown to HTML
const htmlContent = marked.parse(markdown);

// Create full HTML document with styling
const fullHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Interface Wireframes - URly Scanner</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1F2937;
            max-width: 100%;
            padding: 0;
            background: white;
        }
        
        h1 {
            color: #3B82F6;
            border-bottom: 4px solid #3B82F6;
            padding-bottom: 12px;
            font-size: 28px;
            text-align: center;
            margin: 20px 0 30px 0;
            page-break-after: avoid;
        }
        
        h2 {
            color: #1F2937;
            margin-top: 35px;
            margin-bottom: 15px;
            font-size: 20px;
            border-left: 5px solid #3B82F6;
            padding-left: 15px;
            page-break-after: avoid;
        }
        
        h3 {
            color: #4B5563;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        pre {
            background: #F9FAFB;
            border: 1px solid #D1D5DB;
            border-radius: 6px;
            padding: 15px;
            overflow-x: auto;
            font-family: 'Courier New', 'Consolas', monospace;
            font-size: 9px;
            line-height: 1.3;
            page-break-inside: avoid;
            margin: 15px 0;
        }
        
        code {
            background: #F3F4F6;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }
        
        p {
            margin: 10px 0;
            text-align: justify;
        }
        
        strong {
            color: #111827;
            font-weight: 600;
        }
        
        ul, ol {
            margin: 10px 0;
            padding-left: 25px;
        }
        
        li {
            margin: 6px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        th, td {
            border: 1px solid #D1D5DB;
            padding: 10px;
            text-align: left;
        }
        
        th {
            background: #F3F4F6;
            font-weight: 600;
            color: #111827;
        }
        
        tr:nth-child(even) {
            background: #F9FAFB;
        }
        
        hr {
            border: none;
            border-top: 2px solid #E5E7EB;
            margin: 25px 0;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        blockquote {
            border-left: 4px solid #3B82F6;
            padding-left: 15px;
            margin: 15px 0;
            color: #4B5563;
            background: #EFF6FF;
            padding: 15px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>
`;

// Configure PDF options
const options = {
    format: 'A4',
    margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
    },
    printBackground: true,
    preferCSSPageSize: true
};

const file = { content: fullHtml };

// Generate PDF
htmlPdf.generatePdf(file, options).then(pdfBuffer => {
    fs.writeFileSync('./INTERFACE-WIREFRAMES.pdf', pdfBuffer);
    console.log('✅ PDF created successfully!');
    console.log('📁 Location: ./INTERFACE-WIREFRAMES.pdf\n');
    console.log('🎉 Your wireframe documentation is ready for submission!');
}).catch(err => {
    console.error('❌ Error generating PDF:', err.message);
    console.log('\n📝 Alternative method:');
    console.log('1. Open INTERFACE-WIREFRAMES.md in VS Code');
    console.log('2. Press Ctrl+Shift+P');
    console.log('3. Type "Markdown PDF: Export (pdf)"');
    console.log('4. Press Enter');
});
