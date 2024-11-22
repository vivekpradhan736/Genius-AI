'use client';

import axios from 'axios';
import { useRef, useState } from 'react';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, File, X, AlertCircle, MoreHorizontal } from "lucide-react"
import Heading from '@/components/myComps/Heading';
import { VscFiles } from "react-icons/vsc";
import Image from "next/image"

interface Tool {
  id: string
  name: string
  description: string
  icon: string
}

interface FileItem {
  id: string
  file: File
  name: string
  size: string
  status: 'uploading' | 'converting' | 'completed' | 'error'
  progress: number
  url?: string
}

const PdfToWordCon = () => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileItem[] = Array.from(selectedFiles)
      .filter(file => file.name.endsWith('.pdf'))
      .map(file => ({
        id: Math.random().toString(36).substring(7),
        file, // keep the original File object
        name: file.name,
        size: formatFileSize(file.size),
        status: 'uploading',
        progress: 0,
      }));

    if (newFiles.length === 0) {
      setError('Please select only PDF documents (.pdf)');
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
    setError(null);

    const formData = new FormData();
    newFiles.forEach(fileItem => formData.append('upfiles', fileItem.file)); // Use the original File
    console.log("test 1")

    try {
        console.log("test 2")
      const res = await axios.post('http://localhost:3000/api/convertPdfToWord', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("test 3")

      console.log("res", res.data)

      if (res.data.downloadUrls) {
        // Process each file to update its progress and download URL
        res.data.downloadUrls.forEach((url: string, index: number) => {
          const fileId = newFiles[index].id;
          processFile(fileId, url);
        });
      } else {
        alert('File conversion failed');
      }
    } catch (err) {
      console.error('Error uploading files:', err);
    }
  };

  // Simulate file processing with progress update
  const processFile = async (fileId: string, downloadUrl: string) => {
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setFiles(prev =>
        prev.map(file =>
          file.id === fileId
            ? { ...file, progress, status: progress < 100 ? 'uploading' : 'converting' }
            : file
        )
      );
    }

    // Simulate conversion delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Complete the conversion with download URL
    setFiles(prev =>
      prev.map(file =>
        file.id === fileId
          ? {
              ...file,
              status: 'completed',
              progress: 100,
              url: downloadUrl
            }
          : file
      )
    );
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Handle drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileSelect(e.dataTransfer.files)
  }

  // Handle file removal
  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  // Get status text and color
  const getStatusConfig = (status: FileItem['status']) => {
    switch (status) {
      case 'uploading':
        return { text: 'Uploading...', color: 'text-blue-600 bg-blue-100' }
      case 'converting':
        return { text: 'Converting...', color: 'text-yellow-600 bg-yellow-100' }
      case 'completed':
        return { text: 'Completed', color: 'text-green-600 bg-green-100' }
      case 'error':
        return { text: 'Error', color: 'text-red-600 bg-red-100' }
    }
  }

  const tools: Tool[] = [
    {
        id: "word-to-excel",
        name: "Word to Excel",
        description: "Convert any Word file to Excel instantly",
        icon: "/placeholder.svg"
      },
      {
        id: "png-to-pdf",
        name: "PNG to PDF",
        description: "Convert any PNG file to PDF instantly",
        icon: "/placeholder.svg"
      },
      {
        id: "word-to-pdf",
        name: "Word to PDF",
        description: "Convert any Word file to PDF instantly",
        icon: "/placeholder.svg"
      },
      {
        id: "ai-to-svg",
        name: "AI to SVG",
        description: "Convert any AI file to SVG instantly",
        icon: "/placeholder.svg"
      },
      {
        id: "png-to-svg",
        name: "PNG to SVG",
        description: "Convert any PNG file to SVG instantly",
        icon: "/placeholder.svg"
      },
      {
        id: "excel-to-pdf",
        name: "Excel to PDF",
        description: "Convert any Excel file to PDF instantly",
        icon: "/placeholder.svg"
      },
  ]

  return (
    <main className="lg:ml-[240px] flex flex-col xl:flex-row w-full lg:w-[80%] max-w-[84vw] mx-auto px-4 lg:py-4 gap-6">
      <div className='w-full lg:w-[80%]'>
        <Heading
          title="PDF to Word Converter"
          describtion="Convert your PDF files to Word documents instantly."
          icon={VscFiles}
          iconColor="text-yellow-400"
          bgColor="bg-yellow-400/20"
        />
        <h2 className="text-lg font-semibold p-2 lg:px-8">PDF to Word</h2>
        <div className="mt-6 lg:px-8">
          <Card
            className={`border-2 border-dashed p-8 ${
              dragActive ? 'border-primary bg-primary/5' : 'border-gray-200'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <Upload className="h-12 w-12 text-primary" />
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Drag and drop your PDF documents here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supported format: .pdf
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                name="upfiles"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={e => handleFileSelect(e.target.files)}
              />
            </div>
          </Card>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {files.length > 0 && (
            <div className="space-y-4 mt-6">
              {files.map(file => (
                <div
                  key={file.id}
                  className="bg-white rounded-lg border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <File className="h-8 w-8 text-primary flex-shrink-0" />
                  
                  <div className="flex-grow min-w-0 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-sm text-gray-500 hover:text-gray-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>

                  <div className="w-full sm:w-1/3">
                    <Progress
                      value={file.progress}
                      className={`h-2 ${
                        getStatusConfig(file.status).color
                      }`}
                    />
                    <p className={`text-xs ${getStatusConfig(file.status).color}`}>
                      {getStatusConfig(file.status).text}
                    </p>
                    {file.status === 'completed' && (
                      <a
                        href={file.url}
                        download
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default PdfToWordCon;