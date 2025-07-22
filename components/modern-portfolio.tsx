"use client"

import { useState } from "react"
import type { ProfileData } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { generateWebsiteHTML } from "@/lib/html-generator"

interface ModernPortfolioProps {
  profileData: ProfileData
  onEdit: () => void
}

export function ModernPortfolio({ profileData, onEdit }: ModernPortfolioProps) {
  const safeArray = <T,>(val: T[] | undefined | null): T[] => (Array.isArray(val) ? val : [])
  const safeString = (val: any): string => {
    if (typeof val === "string") return val
    if (typeof val === "object" && val !== null) {
      return val.name || val.title || val.value || JSON.stringify(val)
    }
    return String(val || "")
  }

  // Download HTML functionality
  const handleDownloadHTML = () => {
    try {
      const htmlContent = generateWebsiteHTML(profileData)
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${profileData.name.replace(/[^a-zA-Z0-9]/g, '_')}_portfolio.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading HTML:', error)
      alert('Error generating HTML file. Please try again.')
    }
  }

  // Get GitHub URL from social links
  const githubLink = safeArray(profileData.socialLinks).find(link => 
    safeString(link.platform).toLowerCase().includes('github')
  )

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">{safeString(profileData.name)}</h1>
          <div className="flex items-center gap-3">
            <Button variant="minimal" size="sm" onClick={onEdit}>
              Back to Upload
            </Button>
            <Button variant="silver" size="sm" onClick={handleDownloadHTML}>
              Download HTML
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[700px] mx-auto px-6 py-8 leading-relaxed text-[15px]">
        
        {/* Top Navigation */}
        <div className="text-right mb-8">
          <div className="text-xs uppercase flex gap-6 justify-end">
            {profileData.email && (
              <a 
                href={`mailto:${profileData.email}`}
                className="text-blue-600 underline font-normal hover:no-underline"
              >
                CONTACT
              </a>
            )}
            {safeArray(profileData.socialLinks).map((social, index) => (
              <a
                key={index}
                href={safeString(social.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-normal hover:no-underline"
              >
                {safeString(social.platform).toUpperCase()}
              </a>
            ))}
            {githubLink && (
              <a
                href={safeString(githubLink.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-normal hover:no-underline"
              >
                GITHUB
              </a>
            )}
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-black">
            {safeString(profileData.name)}
          </h1>
          
          <p className="text-gray-600 mb-4 leading-relaxed">
            {safeString(profileData.summary)}
          </p>

          {profileData.location && (
            <p className="text-gray-600 mb-4">
              📍 {safeString(profileData.location)}
            </p>
          )}
        </div>

        {/* About Section */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-black mb-4">About</h2>
          <p className="text-gray-600 leading-relaxed">
            {safeString(profileData.summary)}
          </p>
        </section>

        {/* Work Experience Section */}
        {safeArray(profileData.experience).length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-black mb-4">Work Experience</h2>
            <div className="space-y-6">
              {safeArray(profileData.experience).map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-black text-base">
                        {safeString(exp.position)}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>{safeString(exp.company)}</span>
                        <span>•</span>
                        <span>Full-Time</span>
                      </div>
                    </div>
                    <div className="text-right text-gray-600 ml-4">
                      <div className="whitespace-nowrap">
                        {safeString(exp.startDate)} - {safeString(exp.endDate)}
                      </div>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 leading-relaxed">
                      {safeString(exp.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {safeArray(profileData.education).length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-black mb-4">Education</h2>
            <div className="space-y-4">
              {safeArray(profileData.education).map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-black">
                      {safeString(edu.institution)}
                    </h3>
                    <p className="text-gray-600">
                      {safeString(edu.degree)} in {safeString(edu.field)}
                    </p>
                  </div>
                  <span className="text-gray-600 ml-4">
                    {safeString(edu.startDate)} - {safeString(edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {safeArray(profileData.skills).length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-black mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {safeArray(profileData.skills).map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium"
                >
                  {safeString(skill)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {safeArray(profileData.projects).length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-black mb-4">Projects</h2>
            <div className="space-y-6">
              {safeArray(profileData.projects).map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-black text-base">
                        {safeString(project.name)}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-2">
                        {safeString(project.description)}
                      </p>
                      
                      {/* Technologies */}
                      {safeArray(project.technologies).length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {safeArray(project.technologies).map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs font-medium border"
                            >
                              {safeString(tech)}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Project Links */}
                      <div className="flex gap-4 text-sm">
                        {project.url && (
                          <a 
                            href={safeString(project.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline font-normal hover:no-underline"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a 
                            href={safeString(project.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline font-normal hover:no-underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  )
}
