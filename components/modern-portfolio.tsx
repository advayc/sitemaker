"use client"

import { useState } from "react"
import type { ProfileData, Experience } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditableField } from "@/components/editable-field"
import { generateWebsiteHTML } from "@/lib/html-generator"
import { SiteSettings, defaultSiteSettings } from "@/types/site-settings"
import { SiteSettingsPanel } from "@/components/site-settings-panel"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from 'lucide-react'

// Helper function to format URLs without http/https prefix
const formatUrl = (url: string): string => {
  return url.replace(/^https?:\/\//, '')
}

interface ModernPortfolioProps {
  profileData: ProfileData
  onEdit: () => void
  initialSiteSettings?: SiteSettings
}

export function ModernPortfolio({ profileData: initialData, onEdit, initialSiteSettings }: ModernPortfolioProps) {
  const [profileData, setProfileData] = useState(initialData)
  const [history, setHistory] = useState<ProfileData[]>([initialData])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [newSkillInput, setNewSkillInput] = useState("")
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null)
  const [editingSkillValue, setEditingSkillValue] = useState("")
  const [editingProjectTechIndex, setEditingProjectTechIndex] = useState<{projIndex: number, techIndex: number} | null>(null)
  const [editingProjectTechValue, setEditingProjectTechValue] = useState("")
  const [isAddingProjectTech, setIsAddingProjectTech] = useState<number | null>(null)
  const [newProjectTechValue, setNewProjectTechValue] = useState("")
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    ...(initialSiteSettings || defaultSiteSettings),
    fontFamily: initialSiteSettings?.fontFamily || 'ui-monospace, SFMono-Regular, Menlo, monospace'
  })
  const [addingExperience, setAddingExperience] = useState(false)
  const [addingEducation, setAddingEducation] = useState(false)
  const [addingProject, setAddingProject] = useState(false)
  const [addingSocial, setAddingSocial] = useState(false)
  
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

  // History helpers
  const pushHistory = (next: ProfileData) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), next])
    setHistoryIndex(i => i + 1)
  }
  const updateProfile = (transform: (prev: ProfileData) => ProfileData) => {
    setProfileData(prev => {
      const next = transform(prev)
      pushHistory(next)
      return next
    })
  }
  const undo = () => {
    if (historyIndex === 0) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    setProfileData(history[newIndex])
  }
  const redo = () => {
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    setProfileData(history[newIndex])
  }

  // Update functions for editing
  const updateField = (field: string, value: string) => {
    updateProfile(prev => ({ ...prev, [field]: value }))
  }

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    updateProfile(prev => ({
      ...prev,
      experience: safeArray(prev.experience).map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }))
  }

  const updateSkill = (index: number, value: string) => {
    updateProfile(prev => ({
      ...prev,
      skills: safeArray(prev.skills).map((skill, i) => (i === index ? value : skill)),
    }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    updateProfile(prev => ({
      ...prev,
      education: safeArray(prev.education).map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))
  }

  const updateProject = (index: number, field: string, value: any) => {
    updateProfile(prev => ({
      ...prev,
      projects: safeArray(prev.projects).map((proj, i) => (i === index ? { ...proj, [field]: value } : proj)),
    }))
  }

  const updateProjectTechnology = (projIndex: number, techIndex: number, value: string) => {
    updateProfile(prev => ({
      ...prev,
      projects: safeArray(prev.projects).map((proj, i) =>
        i === projIndex
          ? {
              ...proj,
              technologies: safeArray(proj.technologies).map((tech, j) => (j === techIndex ? value : tech)),
            }
          : proj
      ),
    }))
  }

  const addProjectTechnology = (projIndex: number) => {
    if (!newProjectTechValue.trim()) return
    updateProfile(prev => ({
      ...prev,
      projects: safeArray(prev.projects).map((proj, i) => i === projIndex ? { 
        ...proj, 
        technologies: [...safeArray(proj.technologies), newProjectTechValue.trim()] 
      } : proj)
    }))
    setNewProjectTechValue('')
    setIsAddingProjectTech(null)
  }

  const removeProjectTechnology = (projIndex: number, techIndex: number) => {
    updateProfile(prev => ({
      ...prev,
      projects: safeArray(prev.projects).map((proj, i) => i === projIndex ? { 
        ...proj, 
        technologies: safeArray(proj.technologies).filter((_, j) => j !== techIndex) 
      } : proj)
    }))
  }
  
  const startEditingProjectTech = (projIndex: number, techIndex: number, currentValue: string) => {
    setEditingProjectTechIndex({ projIndex, techIndex })
    setEditingProjectTechValue(currentValue)
  }
  
  const saveEditingProjectTech = () => {
    if (editingProjectTechIndex !== null) {
      if (editingProjectTechValue.trim()) {
        updateProjectTechnology(
          editingProjectTechIndex.projIndex, 
          editingProjectTechIndex.techIndex, 
          editingProjectTechValue.trim()
        )
      } else {
        // Remove tech if empty
        removeProjectTechnology(editingProjectTechIndex.projIndex, editingProjectTechIndex.techIndex)
      }
      setEditingProjectTechIndex(null)
      setEditingProjectTechValue("")
    }
  }
  
  const cancelEditingProjectTech = () => {
    setEditingProjectTechIndex(null)
    setEditingProjectTechValue("")
  }

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    updateProfile(prev => ({
      ...prev,
      socialLinks: safeArray(prev.socialLinks).map((social, i) => (i === index ? { ...social, [field]: value } : social)),
    }))
  }

  // Skill management functions
  const addSkill = () => {
    if (newSkillInput.trim()) {
      updateProfile(prev => ({
        ...prev,
        skills: [...safeArray(prev.skills), newSkillInput.trim()],
      }))
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
        updateProfile(prev => ({
          ...prev,
          skills: safeArray(prev.skills).filter((_, i) => i !== editingSkillIndex),
        }))
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
    updateProfile(prev => ({
      ...prev,
      skills: safeArray(prev.skills).filter((_, i) => i !== index),
    }))
  }

  // Download HTML functionality
  const handleDownloadHTML = () => {
    try {
  const htmlContent = generateWebsiteHTML(profileData, siteSettings)
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
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        ['--site-bg' as any]: siteSettings.backgroundColor,
        ['--site-text' as any]: siteSettings.textColor,
        ['--site-font' as any]: siteSettings.fontFamily,
      }}
    >
      <style>{`:root {}`}</style>
      <div className="min-h-screen" style={{ background: 'var(--site-bg)', color: 'var(--site-text)', fontFamily: 'var(--site-font)' }}>
      {/* Header */}
  <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20 supports-[backdrop-filter]:bg-white/60">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">{safeString(profileData.name)}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1">
              <Button variant="minimal" size="sm" onClick={undo} disabled={historyIndex===0}>Undo</Button>
              <Button variant="minimal" size="sm" onClick={redo} disabled={historyIndex===history.length-1}>Redo</Button>
            </div>
            <SiteSettingsPanel value={siteSettings} onChange={setSiteSettings} />
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
          <h2 className="text-xl font-bold mb-4">{siteSettings.sectionTitles.about}</h2>
          <EditableField
            value={safeString(profileData.summary)}
            onSave={(value) => updateField("summary", value)}
            multiline
            className="leading-relaxed"
            placeholder="Your professional summary"
          />
        </section>

        {/* Work Experience Section */}
        <section className="mb-8 group">
          <div className="flex items-center justify-between mb-4 relative">
            <h2 className="text-xl font-bold flex items-center gap-2">{siteSettings.sectionTitles.experience}
              <Button variant="minimal" size="icon" aria-label="Add experience" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition" onClick={() => {
                setAddingExperience(true)
                updateProfile(prev => ({ ...prev, experience: [...safeArray(prev.experience), { company: '', position: '', startDate: '', endDate: '', description: '' }] }))
              }}>
                <Plus className="h-3 w-3" />
              </Button>
            </h2>
          </div>
          {safeArray(profileData.experience).length > 0 ? (
            <div className="space-y-6">
              {safeArray(profileData.experience).map((exp, index) => (
                <div key={index} className="space-y-2 relative group/exp border border-transparent hover:border-gray-200 rounded-md p-2">
                  <Button variant="minimal" size="icon" aria-label="Remove experience" className="h-6 w-6 absolute -top-2 -right-2 bg-white shadow rounded-full opacity-0 group-hover/exp:opacity-100 transition" onClick={() => updateProfile(prev => ({ ...prev, experience: safeArray(prev.experience).filter((_, i) => i !== index) }))}>
                    <X className="h-3 w-3" />
                  </Button>
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
                    <div className="text-right text-gray-600 ml-4 flex flex-col items-end gap-1">
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
                      className="leading-relaxed"
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
        <section className="mb-8 group">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">{siteSettings.sectionTitles.education}
              <Button variant="minimal" size="icon" aria-label="Add education" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition" onClick={()=> updateProfile(prev => ({...prev, education: [...safeArray(prev.education), {institution:'', degree:'', field:'', startDate:'', endDate:''}]}))}>
                <Plus className="h-3 w-3" />
              </Button>
            </h2>
          </div>
          {safeArray(profileData.education).length > 0 ? (
            <div className="space-y-4">
              {safeArray(profileData.education).map((edu, index) => (
                <div key={index} className="flex justify-between items-start relative group/edu border border-transparent hover:border-gray-200 rounded-md p-2">
                  <Button variant="minimal" size="icon" aria-label="Remove education" className="h-6 w-6 absolute -top-2 -right-2 bg-white shadow rounded-full opacity-0 group-hover/edu:opacity-100 transition" onClick={() => updateProfile(prev => ({...prev, education: safeArray(prev.education).filter((_,i)=> i!== index)}))}>
                    <X className="h-3 w-3" />
                  </Button>
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
                  <div className="flex flex-col items-end gap-1">
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
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No education added yet.</p>
          )}
        </section>

        {/* Skills Section */}
        <section className="mb-8 group relative">
          <h2 className="text-xl font-bold mb-4">{siteSettings.sectionTitles.skills}</h2>
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
            <p className="text-gray-500 italic">No skills added yet. Click &quot;Add&quot; to add your first skill.</p>
          )}
        </section>

        {/* Projects Section */}
        <section className="mb-8 group">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">{siteSettings.sectionTitles.projects}
              <Button variant="minimal" size="icon" aria-label="Add project" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition" onClick={() => updateProfile(prev => ({...prev, projects: [...safeArray(prev.projects), {name:'', description:'', technologies:[], links: []}]}))}>
                <Plus className="h-3 w-3" />
              </Button>
            </h2>
          </div>
          {safeArray(profileData.projects).length === 0 && (
            <p className="text-gray-500 italic">No projects yet. Use the + icon to add one.</p>
          )}
          {safeArray(profileData.projects).length > 0 && (
            <div className="space-y-6">
              {safeArray(profileData.projects).map((project, index) => (
                <div key={index} className="space-y-2 group/project border border-transparent hover:border-gray-200 rounded-md p-4 relative">
                  <Button variant="minimal" size="icon" aria-label="Remove project" className="h-6 w-6 absolute -top-2 -right-2 bg-white shadow rounded-full opacity-0 group-hover/project:opacity-100 transition" onClick={() => updateProfile(prev => ({...prev, projects: safeArray(prev.projects).filter((_,i)=> i!== index)}))}>
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
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
                      <div className="mb-3 group/techwrap">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Tech</span>
                          <Button 
                            variant="minimal" 
                            size="icon" 
                            aria-label="Add technology" 
                            className="h-6 w-6 opacity-0 group-hover/techwrap:opacity-100 transition" 
                            onClick={() => setIsAddingProjectTech(index)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {isAddingProjectTech === index && (
                          <div className="mb-2 flex gap-2 items-center">
                            <Input
                              value={newProjectTechValue}
                              onChange={(e) => setNewProjectTechValue(e.target.value)}
                              placeholder="Enter technology"
                              className="h-7 text-xs"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') addProjectTechnology(index);
                                if (e.key === 'Escape') {
                                  setIsAddingProjectTech(null);
                                  setNewProjectTechValue("");
                                }
                              }}
                            />
                            <Button
                              variant="minimal"
                              size="sm"
                              onClick={() => addProjectTechnology(index)}
                              className="h-7 text-xs"
                            >
                              Add
                            </Button>
                            <Button
                              variant="minimal"
                              size="sm"
                              onClick={() => {
                                setIsAddingProjectTech(null);
                                setNewProjectTechValue("");
                              }}
                              className="h-7 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {safeArray(project.technologies).map((tech, techIndex) => (
                            <div key={techIndex} className="relative group/projtech">
                              {editingProjectTechIndex?.projIndex === index && editingProjectTechIndex?.techIndex === techIndex ? (
                                <div className="flex gap-1 items-center">
                                  <Input
                                    value={editingProjectTechValue}
                                    onChange={(e) => setEditingProjectTechValue(e.target.value)}
                                    className="w-24 h-7 text-xs"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') saveEditingProjectTech();
                                      if (e.key === 'Escape') cancelEditingProjectTech();
                                    }}
                                  />
                                  <Button
                                    variant="minimal"
                                    size="sm"
                                    onClick={saveEditingProjectTech}
                                    className="h-5 w-5 p-0"
                                  >
                                    ✓
                                  </Button>
                                  <Button
                                    variant="minimal"
                                    size="sm"
                                    onClick={cancelEditingProjectTech}
                                    className="h-5 w-5 p-0"
                                  >
                                    ✕
                                  </Button>
                                </div>
                              ) : (
                                <span 
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-[11px] font-medium hover:bg-gray-200 cursor-pointer inline-block"
                                  onClick={() => startEditingProjectTech(index, techIndex, safeString(tech))}
                                >
                                  {safeString(tech)}
                                  <Button
                                    variant="minimal"
                                    size="sm"
                                    aria-label="Remove tech"
                                    className="absolute -top-1 -right-1 opacity-0 group-hover/projtech:opacity-100 transition-opacity bg-red-100 hover:bg-red-200 text-red-600 w-4 h-4 p-0 rounded-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeProjectTechnology(index, techIndex);
                                    }}
                                  >
                                    ×
                                  </Button>
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Links</span>
                          <Button variant="minimal" size="icon" aria-label="Add link" className="h-5 w-5" onClick={()=> updateProject(index,'links', [...((project as any).links||[]), {label:'Link', url:''}])}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2">
                            <Input value={project.githubUrl || ''} placeholder="GitHub URL" onChange={e => updateProject(index,'githubUrl', e.target.value)} />
                            <Input value={project.url || ''} placeholder="Live URL" onChange={e => updateProject(index,'url', e.target.value)} />
                          </div>
                          {Array.isArray((project as any).links) && (project as any).links.map((l: any, li: number) => (
                            <div key={li} className="flex gap-2 items-center group/link">
                              <Input className="w-32" value={l.label} placeholder="Label" onChange={e => updateProject(index,'links', (project as any).links.map((x: any,xi:number)=> xi===li?{...x,label:e.target.value}:x))} />
                              <Input className="flex-1" value={l.url} placeholder="URL" onChange={e => updateProject(index,'links', (project as any).links.map((x: any,xi:number)=> xi===li?{...x,url:e.target.value}:x))} />
                              <Button variant="minimal" size="icon" aria-label="Remove link" className="h-6 w-6 opacity-0 group-hover/link:opacity-100 transition" onClick={()=> updateProject(index,'links', (project as any).links.filter((_:any,xi:number)=> xi!==li))}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Social Links Editing */}
        <section className="mb-16 group">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">Social Links
              <Button variant="minimal" size="icon" aria-label="Add social link" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition" onClick={() => updateProfile(prev => ({...prev, socialLinks: [...safeArray(prev.socialLinks), {platform:'', url:'', username:''}]}))}>
                <Plus className="h-3 w-3" />
              </Button>
            </h2>
          </div>
          <div className="space-y-3">
            {safeArray(profileData.socialLinks).map((link, i) => (
              <div key={i} className="flex items-center gap-2 flex-wrap relative group/social border border-transparent hover:border-gray-200 rounded-md p-2">
                <Button variant="minimal" size="icon" aria-label="Remove social link" className="h-6 w-6 absolute -top-2 -right-2 bg-white shadow rounded-full opacity-0 group-hover/social:opacity-100 transition" onClick={() => updateProfile(prev => ({...prev, socialLinks: safeArray(prev.socialLinks).filter((_,idx)=> idx!== i)}))}>
                  <X className="h-3 w-3" />
                </Button>
                <Input className="w-32" value={safeString(link.platform)} placeholder="Platform" onChange={e => updateSocialLink(i,'platform', e.target.value)} />
                <Input className="flex-1" value={safeString(link.url)} placeholder="URL" onChange={e => updateSocialLink(i,'url', e.target.value)} />
              </div>
            ))}
          </div>
        </section>

      </main>
      </div>
    </div>
  )
}
