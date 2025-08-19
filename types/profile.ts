export interface ProfileData {
  name: string
  title: string
  email: string
  phone?: string
  location: string
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  projects: Project[]
  socialLinks: SocialLink[]
}

export interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  companyUrl?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  institutionUrl?: string
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  url?: string
  githubUrl?: string
  links?: { label: string; url: string }[]
}

export interface SocialLink {
  platform: string
  url: string
  username: string
}
