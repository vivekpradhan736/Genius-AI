// app/api/excelToPdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import puppeteer from 'puppeteer';
import formidable, { File } from 'formidable';
import fs from 'fs';
import { promisify } from 'util';

const unlinkFile = promisify(fs.unlink);

// Helper function to parse form data in the app route
async function parseForm(req: NextRequest): Promise<{ fields: formidable.Fields, files: formidable.Files }> {
  const form = new formidable.IncomingForm();
  const reqBody = await req.blob();
  return new Promise((resolve, reject) => {
    form.parse(reqBody.stream() as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseForm(req);
    const file = files.file as File;
    const filePath = file.filepath;

    // Read and process the uploaded Excel file
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const html = XLSX.utils.sheet_to_html(sheet);

    // Generate PDF from HTML using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Set response headers and send the PDF buffer
    const response = new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=output.pdf',
      },
    });

    // Clean up the temporary uploaded file
    await unlinkFile(filePath);

    return response;
  } catch (error) {
    console.error('Error converting Excel to PDF:', error);
    return new NextResponse('Failed to convert Excel to PDF', { status: 500 });
  }
}

// Optional runtime configuration
export const runtime = 'nodejs'; // Ensures the route runs in Node.js
