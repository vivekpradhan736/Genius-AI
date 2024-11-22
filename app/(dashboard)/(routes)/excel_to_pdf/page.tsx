// pages/excel-to-pdf.tsx
"use client";

import React, { useState } from 'react';
import axios from 'axios';

const ExcelToPdf: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const uploadAndDownloadPdf = async () => {
    if (!selectedFile) {
      alert('Please select an Excel file first.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('/api/excelToPdf', formData, {
        responseType: 'arraybuffer', // Important for handling binary data
        headers: {
          'Content-Type': 'multipart/form-data', // For file uploads
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'output.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Conversion failed. Please try again.');
    }
  };

  return (
    <div>
      <h1>Excel to PDF Converter</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={uploadAndDownloadPdf} disabled={!selectedFile}>
        Convert and Download PDF
      </button>
    </div>
  );
};

export default ExcelToPdf;
