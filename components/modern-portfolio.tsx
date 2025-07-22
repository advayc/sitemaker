"use client"

import { useState } from "react"
import type { ProfileData, Experience } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { EditableField } from "@/components/editable-field"
import { generateWebsiteHTML } from "@/lib/html-generator"

// Helper function to format URLs without http/https prefix
const formatUrl = (url: string): string => {
  return url.replace(/^https?:\/\//, '')
}

interface ModernPortfolioProps {
  profileData: ProfileData
  onEdit: () => void
}

export function ModernPortfolio({ profileData: initialData, onEdit }: ModernPortfolioProps) {
  const [profileData, setProfileData] = useState(initialData)
  
  const safeArray = <T,>(val: T[] | undefined | null): T[] => (Array.isArray(val) ? val : [])
  const safeString = (val: any): string => {
    if (typeof val === "string") return val
    if (typeof val === "object" && val !== null) {
      return val.name || val.title || val.value || JSON.stringify(val)
    }
    return String(val || "")
  }

    const githubLink = safeArray(profileData.socialLinks).find(link => 
    safeString(link.platform).toLowerCase().includes('github')
  )

  // Update functions for editing
  const updateField = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      experience: safeArray(prev.experience).map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }))
  }

  const updateSkill = (index: number, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: safeArray(prev.skills).map((skill, i) => (i === index ? value : skill)),
    }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      education: safeArray(prev.education).map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))
  }

  const updateProject = (index: number, field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      projects: safeArray(prev.projects).map((proj, i) => (i === index ? { ...proj, [field]: value } : proj)),
    }))
  }

  const updateProjectTechnology = (projIndex: number, techIndex: number, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      projects: safeArray(prev.projects).map((proj, i) => 
        i === projIndex 
          ? { 
              ...proj, 
              technologies: safeArray(proj.technologies).map((tech, j) => j === techIndex ? value : tech)
            } 
          : proj
      ),
    }))
  }

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: safeArray(prev.socialLinks).map((social, i) => (i === index ? { ...social, [field]: value } : social)),
    }))
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

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">{safeString(profileData.name)}</h1>
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
            {safeArray(profileData.socialLinks).map((social, index) => {
              let url = safeString(social.url)
              // Fix URL if it doesn't start with http/https
              if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url
              }
              return (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-normal hover:no-underline"
                >
                  {safeString(social.platform).toUpperCase()}
                </a>
              )
            })}
            {githubLink && (() => {
              let url = safeString(githubLink.url)
              if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url
              }
              return (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-normal hover:no-underline"
                >
                  GITHUB
                </a>
              )
            })()}
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <EditableField
            value={safeString(profileData.name)}
            onSave={(value) => updateField("name", value)}
            className="text-2xl font-bold mb-2 text-black"
            placeholder="Your Name"
          />
          
          {profileData.location && (
            <div className="text-gray-600 mb-4 flex items-center gap-1">
              <span>📍</span>
              <EditableField
                value={safeString(profileData.location)}
                onSave={(value) => updateField("location", value)}
                className=""
                placeholder="Your Location"
              />
            </div>
          )}
        </div>

        {/* About Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4">About</h2>
          <EditableField
            value={safeString(profileData.summary)}
            onSave={(value) => updateField("summary", value)}
            multiline
            className="text-gray-600 leading-relaxed"
            placeholder="Your professional summary"
          />
        </section>

        {/* Work Experience Section */}
        {safeArray(profileData.experience).length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4">Work Experience</h2>
            <div className="space-y-6">
              {safeArray(profileData.experience).map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <EditableField
                        value={safeString(exp.position)}
                        onSave={(value) => updateExperience(index, "position", value)}
                        className="font-semibold text-black text-base"
                        placeholder="Job Title"
                      />
                      <div className="flex items-center gap-2 text-gray-600">
                        <EditableField
                          value={safeString(exp.company)}
                          onSave={(value) => updateExperience(index, "company", value)}
                          className=""
                          placeholder="Company Name"
                        />
                        <span>•</span>
                        <span>Full-Time</span>
                      </div>
                    </div>
                    <div className="text-right text-gray-600 ml-4">
                      <EditableField
                        value={`${safeString(exp.startDate)} - ${safeString(exp.endDate)}`}
                        onSave={(value) => {
                          const [start, end] = value.split(" - ")
                          updateExperience(index, "startDate", start || safeString(exp.startDate))
                          updateExperience(index, "endDate", end || safeString(exp.endDate))
                        }}
                        className="whitespace-nowrap"
                        placeholder="Start Date - End Date"
                      />
                    </div>
                  </div>
                  {exp.description && (
                    <EditableField
                      value={safeString(exp.description)}
                      onSave={(value) => updateExperience(index, "description", value)}
                      multiline
                      className="text-gray-600 leading-relaxed"
                      placeholder="Job description and achievements"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {safeArray(profileData.education).length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4">Education</h2>
            <div className="space-y-4">
              {safeArray(profileData.education).map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <EditableField
                      value={safeString(edu.institution)}
                      onSave={(value) => updateEducation(index, "institution", value)}
                      className="font-semibold text-black"
                      placeholder="Institution Name"
                    />
                    <div className="text-gray-600 flex gap-2">
                      <EditableField
                        value={safeString(edu.degree)}
                        onSave={(value) => updateEducation(index, "degree", value)}
                        className=""
                        placeholder="Degree"
                      />
                      <span>in</span>
                      <EditableField
                        value={safeString(edu.field)}
                        onSave={(value) => updateEducation(index, "field", value)}
                        className=""
                        placeholder="Field of Study"
                      />
                    </div>
                  </div>
                  <EditableField
                    value={`${safeString(edu.startDate)} - ${safeString(edu.endDate)}`}
                    onSave={(value) => {
                      const [start, end] = value.split(" - ")
                      updateEducation(index, "startDate", start || safeString(edu.startDate))
                      updateEducation(index, "endDate", end || safeString(edu.endDate))
                    }}
                    className="text-gray-600 ml-4"
                    placeholder="Start - End"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {safeArray(profileData.skills).length > 0 && (
          <section className="mb-8 group relative">
            <h2 className="text-xl font-bold text-black mb-4">Skills</h2>
            <Button
              variant="minimal"
              size="sm"
              className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                // Container-level editing for skills section
                alert("Edit Skills section")
              }}
            >
              <span className="text-xs">Edit</span>
            </Button>
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
            <h2 className="text-xl font-bold text-black mb-4">Projects</h2>
            <div className="space-y-6">
              {safeArray(profileData.projects).map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <EditableField
                        value={safeString(project.name)}
                        onSave={(value) => updateProject(index, "name", value)}
                        className="font-semibold text-black text-base"
                        placeholder="Project Name"
                      />
                      <EditableField
                        value={safeString(project.description)}
                        onSave={(value) => updateProject(index, "description", value)}
                        multiline
                        className="text-gray-600 leading-relaxed mb-2"
                        placeholder="Project description"
                      />
                      
                      {/* Technologies */}
                      {safeArray(project.technologies).length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {safeArray(project.technologies).map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs font-medium border group relative"
                            >
                              <EditableField
                                value={safeString(tech)}
                                onSave={(value) => updateProjectTechnology(index, techIndex, value)}
                                className="text-inherit"
                                placeholder="Technology"
                                showEditIcon={false}
                              />
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Project Links */}
                      <div className="flex gap-4 text-sm">
                        {project.githubUrl && (
                          <a 
                            href={safeString(project.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline font-normal hover:no-underline"
                          >
                            {formatUrl(safeString(project.githubUrl))}
                          </a>
                        )}
                        {project.url && (
                          <a 
                            href={safeString(project.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline font-normal hover:no-underline"
                          >
                            {formatUrl(safeString(project.url))}
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
