"use client"

import { useState } from "react"
import type { ProfileData, Experience } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditableField } from "@/components/editable-field"
import { ExternalLink, Github, Twitter, Globe, Mail, Phone, MapPin } from "lucide-react"

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
            <Button variant="minimal" size="sm" onClick={onEdit}>
              Back to Upload
            </Button>
            <Button variant="silver" size="sm">
              Download HTML
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Clean Layout */}
      <main className="px-8 py-8 max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <EditableField
            value={safeString(profileData.name)}
            onSave={(value) => updateField("name", value)}
            className="text-3xl font-bold text-black mb-3"
            placeholder="Your Name"
          />

          <EditableField
            value={safeString(profileData.summary)}
            onSave={(value) => updateField("summary", value)}
            multiline
            className="text-gray-600 leading-relaxed mb-4"
            placeholder="Professional summary about yourself"
          />

          <div className="flex items-center gap-1 text-gray-600 mb-6">
            <MapPin className="w-4 h-4" />
            <EditableField
              value={safeString(profileData.location)}
              onSave={(value) => updateField("location", value)}
              className=""
              placeholder="Your Location"
            />
          </div>

          {/* Social Links - Clean Icons */}
          <div className="flex gap-3 mb-8">
            {safeArray(profileData.socialLinks).map((social, index) => (
              <a
                key={index}
                href={safeString(social.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title={safeString(social.platform)}
              >
                {getSocialIcon(safeString(social.platform))}
              </a>
            ))}
          </div>
        </div>

        {/* About Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4">About</h2>
          <EditableField
            value={safeString(profileData.summary)}
            onSave={(value) => updateField("summary", value)}
            multiline
            className="text-gray-600 leading-relaxed"
            placeholder="Detailed description about your background and expertise"
          />
        </section>

        {/* Work Experience Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-6">Work Experience</h2>
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
                        className="font-medium"
                        placeholder="Company Name"
                      />
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">Full-Time</span>
                      {safeString(exp.company).toLowerCase().includes("remote") && (
                        <Badge variant="silver" className="text-xs px-2 py-0">
                          Remote
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-gray-500 ml-4">
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
                  className="text-gray-500 leading-relaxed"
                  placeholder="Job description and achievements"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-6">Education</h2>
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
                <span className="text-gray-500 ml-4">
                  {safeString(edu.startDate)} - {safeString(edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-6">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {safeArray(profileData.skills).map((skill, index) => (
              <Badge key={index} variant="silver" className="text-sm px-3 py-1">
                {safeString(skill)}
              </Badge>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section>
          <h2 className="text-xl font-bold text-black mb-6">Projects</h2>
          <div className="space-y-4">
            {safeArray(profileData.projects).map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-black">{safeString(project.name)}</h3>
                  <div className="flex gap-2">
                    {project.url && (
                      <a
                        href={safeString(project.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                        title="View Project"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={safeString(project.githubUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-700"
                        title="View on GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-gray-500">{safeString(project.description)}</p>
                <div className="flex flex-wrap gap-2">
                  {safeArray(project.technologies).map((tech, techIndex) => (
                    <Badge key={techIndex} variant="silver" className="text-xs px-2 py-1">
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
