"use client"

import { useState } from "react"
import { UploadArea } from "@/components/upload-area"
import { ModernPortfolio } from "@/components/modern-portfolio"
import { defaultSiteSettings } from "@/types/site-settings"
import { parseFile } from "@/lib/file-parser"
import type { ProfileData } from "@/types/profile"

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"upload" | "preview">("upload")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings)
  const [error, setError] = useState<string | null>(null)

  const simulateProgress = () => {
    setUploadProgress(0)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 300)
    return progressInterval
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setError(null)

    const progressInterval = simulateProgress()

    try {
      const data = await parseFile(file)
      setProfileData(data)
      setSiteSettings({ 
        ...defaultSiteSettings, 
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' 
      })
      setUploadProgress(100)

      setTimeout(() => {
        setCurrentStep("preview")
        setIsUploading(false)
        setUploadProgress(0)
        clearInterval(progressInterval)
      }, 500)
    } catch (error) {
      console.error("Error parsing file:", error)
      setError(error instanceof Error ? error.message : "Failed to parse file")
      setIsUploading(false)
      setUploadProgress(0)
      clearInterval(progressInterval)
    }
  }

  const handleEdit = () => {
    setCurrentStep("upload")
    setProfileData(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {currentStep === "upload" ? (
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Personal Website</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your resume or CV to instantly generate a modern, professional website that showcases your experience and skills.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Upload Area */}
          <UploadArea
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />

        </div>
      ) : (
        <div className="min-h-screen">
          {profileData && <ModernPortfolio profileData={profileData} onEdit={handleEdit} initialSiteSettings={siteSettings} />}
        </div>
      )}
    </div>
  )
}
