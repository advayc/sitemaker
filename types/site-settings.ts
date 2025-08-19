export interface SiteSettings {
  fontFamily: string
  theme: 'light' | 'dark'
  primaryColor: string
  backgroundColor: string
  textColor: string
  sectionTitles: {
    about: string
    experience: string
    education: string
    skills: string
    projects: string
  }
}

export const defaultSiteSettings: SiteSettings = {
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  theme: 'light',
  primaryColor: '#2563eb',
  backgroundColor: '#ffffff',
  textColor: '#374151',
  sectionTitles: {
    about: 'About',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects'
  }
}
