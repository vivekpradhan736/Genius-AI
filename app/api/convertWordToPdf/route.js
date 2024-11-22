import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import mammoth from 'mammoth';

export async function POST(req) {
  const formData = await req.formData();
  const files = formData.getAll('upfiles');

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const downloadUrls = [];

  for (const file of files) {
    const name = file.name;
    const fileExtension = path.extname(name).toLowerCase();
    const fileName = path.basename(name, fileExtension);
    const docxPath = path.join(uploadDir, `${fileName}.docx`);
    const pdfPath = path.join(uploadDir, `${fileName}.pdf`);

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(docxPath, buffer);

      // Convert DOCX to HTML
      const result = await mammoth.convertToHtml({ path: docxPath });
      const htmlContent = result.value;

      // Start Puppeteer to create a PDF
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set content with optional styles
      await page.setContent(`
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 20px; /* Adjust as needed */
                font-family: Arial, sans-serif; /* Match the font if needed */
              }
              h1, h2, h3, p {
                margin: 0 0 15px;
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `, { waitUntil: 'networkidle0' });

      // Specify PDF options including margins
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });

      await browser.close();

      // Add the PDF URL to the list
      downloadUrls.push(`/uploads/${fileName}.pdf`);
    } catch (error) {
      console.error(`Conversion error for file ${name}:`, error);
      return NextResponse.json({ error: `Conversion failed for ${name}` }, { status: 500 });
    }
  }

  // Return all download URLs for the converted PDFs
  return NextResponse.json({ downloadUrls }, { status: 200 });
}
