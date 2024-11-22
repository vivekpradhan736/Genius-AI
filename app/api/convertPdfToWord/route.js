import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';  // Import pdf-parse for text extraction
import { Document, Packer, Paragraph } from 'docx';

export async function POST(req) {
  console.log("test 1")
  const formData = await req.formData();
  const files = formData.getAll('upfiles');

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }
  console.log("test 2")

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  console.log("test 3")

  const downloadUrls = [];

  for (const file of files) {
    const name = file.name;
    const fileExtension = path.extname(name).toLowerCase();
    const fileName = path.basename(name, fileExtension);
    const pdfPath = path.join(uploadDir, `${fileName}.pdf`);
    const docxPath = path.join(uploadDir, `${fileName}.docx`);

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(pdfPath, buffer);

      // Extract text from the PDF using pdf-parse
      const data = await pdfParse(buffer);
      const fullText = data.text;

      // Create a DOCX document
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph(fullText)
            ],
          },
        ],
      });

      // Write DOCX to file
      const docBuffer = await Packer.toBuffer(doc);
      fs.writeFileSync(docxPath, docBuffer);

      // Add the DOCX URL to the list
      downloadUrls.push(`/uploads/${fileName}.docx`);
    } catch (error) {
      console.error(`Conversion error for file ${name}:`, error);
      return NextResponse.json({ error: `Conversion failed for ${name}` }, { status: 500 });
    }
  }

  // Return all download URLs for the converted DOCX files
  return NextResponse.json({ downloadUrls }, { status: 200 });
}
