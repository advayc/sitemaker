"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Loader2, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from "@/lib/utils"

interface UploadAreaProps {
  onFileUpload: (file: File) => void
  isUploading: boolean
  uploadProgress: number
}

export function UploadArea({ onFileUpload, isUploading, uploadProgress }: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0])
      }
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
      "application/xml": [".xml"],
      "text/xml": [".xml"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
      "image/bmp": [".bmp"],
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    disabled: isUploading,
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 cursor-pointer",
          isDragActive || dragActive
            ? "border-cyan-300 bg-cyan-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100",
          isUploading && "pointer-events-none opacity-75",
        )}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-gray-400 animate-spin" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">Processing your file...</p>
              <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
              <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-white rounded-full shadow-sm border border-gray-200">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Upload your resume or CV</h3>
              <p className="text-gray-600">Drag and drop your file here, or click to browse</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                PDF
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                DOCX
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Images
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                JSON/XML
              </span>
            </div>

            <Button variant="silver" size="lg" className="mt-4">
              Choose File
            </Button>
          </div>
        )}
      </div>

      {/* LinkedIn Help */}
      <div className="mt-4 flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="flex items-center gap-2 border rounded-md px-4 py-2 text-sm hover:bg-gray-50 transition shadow-sm group"
              style={{ cursor: 'help' }}
              aria-label="How to upload LinkedIn profile"
            >
              <Info className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
              <span>How to upload LinkedIn</span>
            </button>
          </DialogTrigger>
          <DialogContent className="w-[60%] max-w-3xl sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Go to your profile → Click on “Resources” → Then “Save to PDF”</DialogTitle>
            </DialogHeader>
            <div className="mt-2 flex justify-center">
              <img src="/linkedin-demo.png" alt="LinkedIn download steps" className="rounded border max-w-full" style={{ width: '100%', maxWidth: 900, height: 'auto' }} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Supported formats: PDF resume, DOCX resume, Images (JPG, PNG), LinkedIn JSON/XML export</p>
        <p className="mt-1">Your data is processed securely and never stored permanently</p>
      </div>
    </div>
  )
}
