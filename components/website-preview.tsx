"use client"

import { useState } from "react"
import type { ProfileData, Experience } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditableField } from "@/components/editable-field"
import { ExternalLink, Github, Linkedin, Twitter, Globe, Mail, Phone, MapPin } from "lucide-react"

interface WebsitePreviewProps {
  profileData: ProfileData
  onEdit: () => void
}

export function WebsitePreview({ profileData: initialData, onEdit }: WebsitePreviewProps) {
  const [profileData, setProfileData] = useState(initialData)

  // Ensure we never try to map over undefined and handle nested objects
  const safeArray = <T,>(val: T[] | undefined | null): T[] => (Array.isArray(val) ? val : [])
  const safeString = (val: any): string => {
    if (typeof val === "string") return val
    if (typeof val === "object" && val !== null) {
      return val.name || val.title || val.value || JSON.stringify(val)
    }
    return String(val || "")
  }

  const updateField = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      experience: safeArray(prev.experience).map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }))
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <Linkedin className="w-4 h-4" />
      case "github":
        return <Github className="w-4 h-4" />
      case "twitter":
        return <Twitter className="w-4 h-4" />
      case "website":
      case "portfolio":
        return <Globe className="w-4 h-4" />
      case "email":
        return <Mail className="w-4 h-4" />
      case "phone":
        return <Phone className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">{safeString(profileData.name)}</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onEdit}>
              Back to Upload
            </Button>
            <Button variant="default" size="sm">
              Download HTML
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Compressed Layout */}
      <main className="px-8 py-6 max-w-4xl mx-auto">
        {/* Header Section - Compressed */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 pr-8">
            <EditableField
              value={safeString(profileData.name)}
              onSave={(value) => updateField("name", value)}
              className="text-2xl font-bold text-gray-900 mb-2"
              placeholder="Your Name"
            />

            <EditableField
              value={safeString(profileData.summary)}
              onSave={(value) => updateField("summary", value)}
              multiline
              className="text-gray-700 leading-relaxed mb-3 text-sm"
              placeholder="Brief summary about yourself"
            />

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <EditableField
                  value={safeString(profileData.location)}
                  onSave={(value) => updateField("location", value)}
                  className=""
                  placeholder="Your Location"
                />
              </div>
            </div>

            {/* Social Links - Horizontal */}
            <div className="flex gap-2">
              {safeArray(profileData.socialLinks).map((social, index) => (
                <a
                  key={index}
                  href={safeString(social.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  title={safeString(social.platform)}
                >
                  {getSocialIcon(safeString(social.platform))}
                </a>
              ))}
            </div>
          </div>

          {/* Profile Photo - Smaller */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
              <img src="/default-avatar.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* About Section - Compressed */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">About</h2>
          <EditableField
            value={safeString(profileData.summary)}
            onSave={(value) => updateField("summary", value)}
            multiline
            className="text-gray-700 leading-relaxed text-sm"
            placeholder="Detailed description about your background and expertise"
          />
        </section>

        {/* Work Experience Section - Compressed */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Work Experience</h2>
          <div className="space-y-4">
            {safeArray(profileData.experience).map((exp, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <EditableField
                        value={safeString(exp.position)}
                        onSave={(value) => updateExperience(index, "position", value)}
                        className="font-semibold text-gray-900"
                        placeholder="Job Title"
                      />
                      {safeString(exp.company).toLowerCase().includes("remote") && (
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          Remote
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <EditableField
                        value={safeString(exp.company)}
                        onSave={(value) => updateExperience(index, "company", value)}
                        className="font-medium text-gray-700"
                        placeholder="Company Name"
                      />
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">Full-Time</span>
                    </div>
                  </div>

                  <div className="text-right text-sm text-gray-600 ml-4">
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

                <EditableField
                  value={safeString(exp.description)}
                  onSave={(value) => updateExperience(index, "description", value)}
                  multiline
                  className="text-gray-700 leading-relaxed text-sm"
                  placeholder="Job description and achievements"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section - Compressed */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {safeArray(profileData.skills).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                {safeString(skill)}
              </Badge>
            ))}
          </div>
        </section>

        {/* Education Section - Compressed */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Education</h2>
          <div className="space-y-3">
            {safeArray(profileData.education).map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {safeString(edu.degree)} in {safeString(edu.field)}
                  </h3>
                  <p className="text-gray-700 text-sm">{safeString(edu.institution)}</p>
                </div>
                <span className="text-xs text-gray-600 ml-4">
                  {safeString(edu.startDate)} - {safeString(edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section - Compressed */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Projects</h2>
          <div className="space-y-3">
            {safeArray(profileData.projects).map((project, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm">{safeString(project.name)}</h3>
                  <div className="flex gap-1">
                    {project.url && (
                      <a
                        href={safeString(project.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={safeString(project.githubUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Github className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 text-xs">{safeString(project.description)}</p>
                <div className="flex flex-wrap gap-1">
                  {safeArray(project.technologies).map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs px-1 py-0">
                      {safeString(tech)}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
