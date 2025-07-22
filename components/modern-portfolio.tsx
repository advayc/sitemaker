"use client"

import { useState } from "react"
import type { ProfileData } from "@/types/profile"
import { Button } from "@/components/ui/button"

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
            <Button variant="silver" size="sm">
              Download HTML
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[700px] mx-auto px-6 py-6 leading-relaxed text-[15px]">
        
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
          </div>
        </div>

        {/* Header with decorative square */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-4 h-4 bg-purple-600 mt-1 flex-shrink-0"></div>
          <div className="flex-1">
            <h1 className="text-[22px] font-bold uppercase mb-4">
              HEY, I&apos;M {safeString(profileData.name).toUpperCase()}.
            </h1>
            
            <p className="mb-4 text-black">
              {safeString(profileData.summary).toLowerCase()}
              {profileData.location && (
                <> currently based in <a 
                  href="#" 
                  className="text-blue-600 underline hover:no-underline"
                >
                  {safeString(profileData.location).toLowerCase()}
                </a></>
              )}
            </p>
          </div>
        </div>

        {/* Education Section */}
        {safeArray(profileData.education).length > 0 && (
          <section className="mt-8">
            <h2 className="text-[13px] font-bold uppercase mb-4">
              EDUCATION:
            </h2>
            <ul className="pl-6 list-disc space-y-2">
              {safeArray(profileData.education).map((edu, index) => (
                <li key={index}>
                  {safeString(edu.degree).toLowerCase()} in {safeString(edu.field).toLowerCase()} from{' '}
                  <a 
                    href={edu.institutionUrl || '#'} 
                    className="text-blue-600 underline hover:no-underline"
                  >
                    {safeString(edu.institution).toLowerCase()}
                  </a>
                  {' '}({safeString(edu.startDate)} - {safeString(edu.endDate)})
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Experience Section */}
        {safeArray(profileData.experience).length > 0 && (
          <section className="mt-8">
            <h2 className="text-[13px] font-bold uppercase mb-4">
              EXPERIENCE:
            </h2>
            <ul className="pl-6 list-disc space-y-2">
              {safeArray(profileData.experience).map((exp, index) => (
                <li key={index}>
                  {safeString(exp.position).toLowerCase()} at{' '}
                  <a 
                    href={exp.companyUrl || '#'} 
                    className="text-blue-600 underline hover:no-underline"
                  >
                    {safeString(exp.company).toLowerCase()}
                  </a>
                  {' '}({safeString(exp.startDate)} - {safeString(exp.endDate)})
                  {exp.description && (
                    <div className="mt-1 text-sm">
                      {safeString(exp.description).toLowerCase()}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Projects Section */}
        {safeArray(profileData.projects).length > 0 && (
          <section className="mt-8">
            <h2 className="text-[13px] font-bold uppercase mb-4">
              SOME PROJECTS I&apos;M WORKING ON:
            </h2>
            <ul className="pl-6 list-disc space-y-2">
              {safeArray(profileData.projects).map((project, index) => (
                <li key={index}>
                  <a 
                    href={project.url || project.githubUrl || '#'} 
                    className="text-blue-600 underline hover:no-underline"
                  >
                    {safeString(project.name).toLowerCase()}
                  </a>
                  {' '}- {safeString(project.description).toLowerCase()}
                  {safeArray(project.technologies).length > 0 && (
                    <span>
                      {' '}built with {safeArray(project.technologies).map((tech, techIndex) => (
                        <span key={techIndex}>
                          <a href="#" className="text-blue-600 underline hover:no-underline">
                            {safeString(tech).toLowerCase()}
                          </a>
                          {techIndex < safeArray(project.technologies).length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills Section */}
        {safeArray(profileData.skills).length > 0 && (
          <section className="mt-8">
            <h2 className="text-[13px] font-bold uppercase mb-4">
              SKILLS:
            </h2>
            <ul className="pl-6 list-disc space-y-1">
              {safeArray(profileData.skills).map((skill, index) => (
                <li key={index}>
                  <a href="#" className="text-blue-600 underline hover:no-underline">
                    {safeString(skill).toLowerCase()}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* TL;DR Section */}
        <section className="mt-12">
          <h2 className="text-[15px] font-bold mb-2">
            TL;DR:
          </h2>
        </section>

      </main>
    </div>
  )
}
