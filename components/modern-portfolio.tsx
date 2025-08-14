"use client"

import { useState } from "react"
import type { ProfileData, Experience } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [newSkillInput, setNewSkillInput] = useState("")
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null)
  const [editingSkillValue, setEditingSkillValue] = useState("")
  
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

  // Skill management functions
  const addSkill = () => {
    if (newSkillInput.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...safeArray(prev.skills), newSkillInput.trim()]
      }));
      setNewSkillInput("");
      setIsAddingSkill(false);
    }
  }

  const startEditingSkill = (index: number, currentValue: string) => {
    setEditingSkillIndex(index);
    setEditingSkillValue(currentValue);
  }

  const saveEditingSkill = () => {
    if (editingSkillIndex !== null) {
      if (editingSkillValue.trim()) {
        updateSkill(editingSkillIndex, editingSkillValue.trim());
      } else {
        // Remove skill if empty
        setProfileData(prev => ({
          ...prev,
          skills: safeArray(prev.skills).filter((_, i) => i !== editingSkillIndex)
        }));
      }
      setEditingSkillIndex(null);
      setEditingSkillValue("");
    }
  }

  const cancelEditingSkill = () => {
    setEditingSkillIndex(null);
    setEditingSkillValue("");
  }

  const removeSkill = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      skills: safeArray(prev.skills).filter((_, i) => i !== index)
    }));
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
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4">Work Experience</h2>
          {safeArray(profileData.experience).length > 0 ? (
            <div className="space-y-6">
              {safeArray(profileData.experience).map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="relative">
                        <EditableField
                          value={safeString(exp.position)}
                          onSave={(value) => updateExperience(index, "position", value)}
                          className="font-semibold text-black text-base pr-8"
                          placeholder="Job Title"
                          editIconPosition="right-0"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <EditableField
                          value={safeString(exp.company)}
                          onSave={(value) => updateExperience(index, "company", value)}
                          className=""
                          editIconPosition="-right-40"
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
          ) : (
            <p className="text-gray-500 italic">No work experience added yet.</p>
          )}
        </section>

        {/* Education Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4">Education</h2>
          {safeArray(profileData.education).length > 0 ? (
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
          ) : (
            <p className="text-gray-500 italic">No education added yet.</p>
          )}
        </section>

        {/* Skills Section */}
        <section className="mb-8 group relative">
          <h2 className="text-xl font-bold text-black mb-4">Skills</h2>
          <Button
            variant="minimal"
            size="sm"
            className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsAddingSkill(true)}
          >
            <span className="text-xs">Add</span>
          </Button>
          
          {/* Add new skill input */}
          {isAddingSkill && (
            <div className="mb-4 flex gap-2 items-center">
              <Input
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Enter a new skill"
                className="flex-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addSkill();
                  if (e.key === 'Escape') {
                    setIsAddingSkill(false);
                    setNewSkillInput("");
                  }
                }}
              />
              <Button
                variant="minimal"
                size="sm"
                onClick={addSkill}
                disabled={!newSkillInput.trim()}
              >
                Add
              </Button>
              <Button
                variant="minimal"
                size="sm"
                onClick={() => {
                  setIsAddingSkill(false);
                  setNewSkillInput("");
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          {safeArray(profileData.skills).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {safeArray(profileData.skills).map((skill, index) => (
                <div key={index} className="relative group">
                  {editingSkillIndex === index ? (
                    <div className="flex gap-1 items-center">
                      <Input
                        value={editingSkillValue}
                        onChange={(e) => setEditingSkillValue(e.target.value)}
                        className="w-24 h-8 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditingSkill();
                          if (e.key === 'Escape') cancelEditingSkill();
                        }}
                      />
                      <Button
                        variant="minimal"
                        size="sm"
                        onClick={saveEditingSkill}
                        className="h-6 w-6 p-0"
                      >
                        ✓
                      </Button>
                      <Button
                        variant="minimal"
                        size="sm"
                        onClick={cancelEditingSkill}
                        className="h-6 w-6 p-0"
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <span 
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 cursor-pointer inline-block"
                      onClick={() => startEditingSkill(index, safeString(skill))}
                    >
                      {safeString(skill)}
                      <Button
                        variant="minimal"
                        size="sm"
                        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 hover:bg-red-200 text-red-600 w-4 h-4 p-0 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSkill(index);
                        }}
                      >
                        ×
                      </Button>
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No skills added yet. Click "Add" to add your first skill.</p>
          )}
        </section>

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

        {/* Languages Section */}
        {profileData.languages && safeArray(profileData.languages).length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4">Languages</h2>
            <div className="space-y-2">
              {safeArray(profileData.languages).map((language, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{safeString(language.name)}</span>
                  <span className="text-gray-600">{safeString(language.proficiency)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {profileData.certifications && safeArray(profileData.certifications).length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4">Certifications</h2>
            <div className="space-y-4">
              {safeArray(profileData.certifications).map((cert, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-black">{safeString(cert.name)}</h3>
                      <p className="text-gray-600">{safeString(cert.issuer)}</p>
                    </div>
                    <span className="text-gray-600 ml-4">{safeString(cert.date)}</span>
                  </div>
                  {cert.url && (
                    <a 
                      href={safeString(cert.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm hover:no-underline"
                    >
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {profileData.achievements && safeArray(profileData.achievements).length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4">Achievements</h2>
            <ul className="space-y-2">
              {safeArray(profileData.achievements).map((achievement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-cyan-600 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{safeString(achievement)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

      </main>
    </div>
  )
}
