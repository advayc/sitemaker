"use client"

import { useState, useCallback, memo, lazy, Suspense } from "react"
import { UploadArea } from "@/components/upload-area"
import { defaultSiteSettings } from "@/types/site-settings"
import { parseFile } from "@/lib/file-parser"
import type { ProfileData } from "@/types/profile"

// Lazy load the ModernPortfolio component to reduce initial bundle size
const ModernPortfolio = lazy(() => import("@/components/modern-portfolio").then(module => ({ default: module.ModernPortfolio })))

// Simple loading component
const PortfolioLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
)

// Memoized component for upload view
const UploadView = memo(({ 
  onFileUpload, 
  isUploading, 
  uploadProgress, 
  error 
}: {
  onFileUpload: (file: File) => Promise<void>
  isUploading: boolean
  uploadProgress: number
  error: string | null
}) => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Personal Website</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Upload your resume or CV to instantly generate a modern, website that showcases your experience, skills, projects and more!
      </p>
    </div>

    {error && (
      <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    )}

    <UploadArea
      onFileUpload={onFileUpload}
      isUploading={isUploading}
      uploadProgress={uploadProgress}
    />
  </div>
))

UploadView.displayName = 'UploadView'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"upload" | "preview">("upload")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings)
  const [error, setError] = useState<string | null>(null)

  const simulateProgress = useCallback(() => {
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
  }, [])

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true)
    setError(null)

    const progressInterval = simulateProgress()

    try {
      const data = await parseFile(file)
      setProfileData(data)
      setSiteSettings({ 
        ...defaultSiteSettings, 
        fontFamily: 'var(--font-inter)' // Use system font for better performance
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
  }, [simulateProgress])

  const handleEdit = useCallback(() => {
    setCurrentStep("upload")
    setProfileData(null)
    setError(null)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {currentStep === "upload" ? (
        <UploadView
          onFileUpload={handleFileUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          error={error}
        />
      ) : (
        <div className="min-h-screen">
          {profileData && (
            <Suspense fallback={<PortfolioLoading />}>
              <ModernPortfolio 
                profileData={profileData} 
                onEdit={handleEdit} 
                initialSiteSettings={siteSettings} 
              />
            </Suspense>
          )}
        </div>
      )}
    </div>
  )
}
