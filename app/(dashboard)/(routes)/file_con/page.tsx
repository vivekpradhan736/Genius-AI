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

const FileCon = () => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileItem[] = Array.from(selectedFiles)
      .filter(file => file.name.endsWith('.doc') || file.name.endsWith('.docx'))
      .map(file => ({
        id: Math.random().toString(36).substring(7),
        file, // keep the original File object
        name: file.name,
        size: formatFileSize(file.size),
        status: 'uploading',
        progress: 0,
      }));

    if (newFiles.length === 0) {
      setError('Please select only Word documents (.doc or .docx)');
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
    setError(null);

    const formData = new FormData();
    newFiles.forEach(fileItem => formData.append('upfiles', fileItem.file)); // Use the original File

    try {
      const res = await axios.post('/api/convertWordToPdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


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
      icon: "/excel.svg"
    },
    {
      id: "png-to-pdf",
      name: "PNG to PDF",
      description: "Convert any PNG file to PDF instantly",
      icon: "/png.svg"
    },
    {
      id: "word-to-pdf",
      name: "Word to PDF",
      description: "Convert any Word file to PDF instantly",
      icon: "/word.svg"
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
          title="File Converter"
          describtion="The ultimate online tool for unlimited and free multimedia conversion."
          icon={VscFiles}
          iconColor="text-yellow-400"
          bgColor="bg-yellow-400/20"
        />
        <h2 className="text-lg font-semibold p-2 lg:px-8">Word to PDF</h2>
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
                  Drag and drop your Word documents here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supported formats: .doc, .docx
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                name="upfiles"
                multiple
                accept=".doc,.docx"
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
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">{file.size}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          getStatusConfig(file.status).color
                        }`}
                      >
                        {getStatusConfig(file.status).text}
                      </span>
                    </div>
                    
                    {file.status !== 'completed' && (
                      <Progress value={file.progress} className="h-1" />
                    )}
                  </div>

                  {file.status === 'completed' && file.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 mt-2 sm:mt-0"
                      onClick={() => {
                        if (file.url) {  // Type check to ensure file.url is a string
                          const link = document.createElement('a');
                          link.href = file.url;
                          link.download = file.name.replace(/\.(doc|docx)$/, '.pdf');
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full xl:w-[40%] xl:border-l bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Recommended Tools</h2>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
          {tools.map((tool) => (
            <div key={tool.id} className="flex items-start gap-3 p-4 rounded-xl bg-[#e9e9e974]">
              <Image
                src={tool.icon}
                alt={tool.name}
                width={70}
                height={70}
                className="w-10 h-10"
              />
              <div>
                <p className="text-sm font-medium">{tool.name}</p>
                <p className="text-xs text-gray-500">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default FileCon;
