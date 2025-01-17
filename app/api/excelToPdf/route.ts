// import { NextRequest, NextResponse } from 'next/server';
// import * as XLSX from 'xlsx';
// import puppeteer from 'puppeteer';
// import formidable, { File, Fields, Files } from 'formidable';
// import fs from 'fs';
// import { promisify } from 'util';

// const unlinkFile = promisify(fs.unlink);

// async function parseForm(req: NextRequest): Promise<{ fields: Fields; files: Files }> {
//   const form = new formidable.IncomingForm();
//   const reqBody = await req.blob();

//   return new Promise((resolve, reject) => {
//     form.parse(reqBody.stream() as unknown as NodeJS.ReadableStream, (err, fields, files) => {
//       if (err) reject(err);
//       else resolve({ fields, files });
//     });
//   });
// }

export async function POST() {
  // try {
  //   const { files } = await parseForm(req);
  //   const file = files.file as File;
  //   const filePath = file.filepath;

  //   const workbook = XLSX.readFile(filePath);
  //   const sheet = workbook.Sheets[workbook.SheetNames[0]];
  //   const html = XLSX.utils.sheet_to_html(sheet);

  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   await page.setContent(html);
  //   const pdfBuffer = await page.pdf({ format: 'A4' });
  //   await browser.close();

  //   const response = new NextResponse(pdfBuffer, {
  //     headers: {
  //       'Content-Type': 'application/pdf',
  //       'Content-Disposition': 'attachment; filename=output.pdf',
  //     },
  //   });

  //   await unlinkFile(filePath);

  //   return response;
  // } catch (error) {
  //   console.error('Error converting Excel to PDF:', error);
  //   return new NextResponse('Failed to convert Excel to PDF', { status: 500 });
  // }
}

export const runtime = 'nodejs';
