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
  languages?: Language[]
  certifications?: Certification[]
  achievements?: string[]
}

export interface Language {
  name: string
  proficiency: string
}

export interface Certification {
  name: string
  issuer: string
  date: string
  url?: string
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
}

export interface SocialLink {
  platform: string
  url: string
  username: string
}
