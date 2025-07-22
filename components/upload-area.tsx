"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Loader2, Link } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadAreaProps {
  onFileUpload: (file: File) => void
  onLinkedInUpload: (url: string) => void
  isUploading: boolean
  uploadProgress: number
}

export function UploadArea({ onFileUpload, onLinkedInUpload, isUploading, uploadProgress }: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false)
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [uploadMode, setUploadMode] = useState<"file" | "linkedin">("file")

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

  const handleLinkedInSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (linkedinUrl.trim()) {
      onLinkedInUpload(linkedinUrl.trim())
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setUploadMode("file")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              uploadMode === "file" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900",
            )}
          >
            Upload File
          </button>
          <button
            onClick={() => setUploadMode("linkedin")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              uploadMode === "linkedin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900",
            )}
          >
            LinkedIn URL
          </button>
        </div>
      </div>

      {uploadMode === "file" ? (
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
                <h3 className="text-xl font-semibold text-gray-900">Upload your resume or LinkedIn export</h3>
                <p className="text-gray-600">Drag and drop your file here, or click to browse</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  JSON
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  XML
                </span>
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
              </div>

              <Button variant="default" size="lg" className="mt-4">
                Choose File
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-3 bg-white rounded-full shadow-sm border border-gray-200">
                <Link className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Enter your LinkedIn profile URL</h3>
            <p className="text-gray-600">We'll extract your professional information automatically</p>
          </div>

          <form onSubmit={handleLinkedInSubmit} className="space-y-4">
            <Input
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="text-center"
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="w-8 h-8 mx-auto text-gray-400 animate-spin" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">Analyzing your LinkedIn profile...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                  <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <Button type="submit" variant="default" size="lg" className="w-full" disabled={!linkedinUrl.trim()}>
                Generate Website
              </Button>
            )}
          </form>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          {uploadMode === "file"
            ? "Supported formats: LinkedIn JSON/XML export, PDF resume, DOCX resume, Images (JPG, PNG)"
            : "We'll analyze your public LinkedIn profile information"}
        </p>
        <p className="mt-1">Your data is processed securely and never stored permanently</p>
      </div>
    </div>
  )
}
