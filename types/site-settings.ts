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

export interface SiteSettingsPreset {
  id: string
  name: string
  description?: string
  settings: Partial<SiteSettings>
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

// Curated visual presets (do not override section titles so user custom labels persist)
export const siteSettingsPresets: SiteSettingsPreset[] = [
  {
    id: 'classic-light',
    name: 'classic light',
    description: 'clean white with blue accents',
    settings: {
      theme: 'light',
      backgroundColor: '#ffffff',
      textColor: '#374151',
      primaryColor: '#2563eb',
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  },
  {
    id: 'minimal-mono',
    name: 'minimal mono',
    description: 'subtle gray + monospace',
    settings: {
      theme: 'light',
      backgroundColor: '#fafafa',
      textColor: '#1f2937',
      primaryColor: '#111827',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
    }
  },
  {
    id: 'midnight',
    name: 'midnight',
    description: 'dark github style',
    settings: {
      theme: 'dark',
      backgroundColor: '#0d1117',
      textColor: '#d1d5db',
      primaryColor: '#3b82f6',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
    }
  },
  {
    id: 'solar',
    name: 'solar',
    description: 'warm parchment + amber',
    settings: {
      theme: 'light',
      backgroundColor: '#fff8e1',
      textColor: '#4a3423',
      primaryColor: '#f59e0b',
      fontFamily: 'Georgia, "Times New Roman", serif'
    }
  },
  {
    id: 'emerald',
    name: 'emerald',
    description: 'soft green palette',
    settings: {
      theme: 'light',
      backgroundColor: '#f0fdf4',
      textColor: '#064e3b',
      primaryColor: '#059669',
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  },
  {
    id: 'neon-dark',
    name: 'neon dark',
    description: 'deep slate + indigo glow',
    settings: {
      theme: 'dark',
      backgroundColor: '#0f172a',
      textColor: '#e5e7eb',
      primaryColor: '#6366f1',
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  },
  {
    id: 'onyx-yellow',
    name: 'onyx yellow',
    description: 'pure black with warm yellow accent',
    settings: {
      theme: 'dark',
      backgroundColor: '#000000',
      textColor: '#fefce8',
      primaryColor: '#facc15',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
    }
  },
  {
    id: 'matrix-mono',
    name: 'matrix mono',
    description: 'green phosphor terminal feel',
    settings: {
      theme: 'dark',
      backgroundColor: '#000000',
      textColor: '#22c55e',
      primaryColor: '#16a34a',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
    }
  },
  {
    id: 'terminal',
    name: 'terminal',
    description: 'soft dark with retro green',
    settings: {
      theme: 'dark',
      backgroundColor: '#1e1e1e',
      textColor: '#d4d4d4',
      primaryColor: '#0dbc79',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
    }
  },
  {
    id: 'amber-dark',
    name: 'amber dark',
    description: 'warm amber on near-black',
    settings: {
      theme: 'dark',
      backgroundColor: '#000000ff',
      textColor: '#f5f5f4',
      primaryColor: '#f59e0b',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
    }
  },
  {
    id: 'slate-mono',
    name: 'slate mono',
    description: 'cool slate with cyan accents',
    settings: {
      theme: 'dark',
      backgroundColor: '#000610ff',
      textColor: '#cbd5e1',
      primaryColor: '#38bdf8',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
    }
  },
  {
    id: 'grid-carbon',
    name: 'grid carbon',
    description: 'gray with subtle dotted grid and warm highlights',
    settings: {
      theme: 'dark',
      backgroundColor: '#1b1917',
      textColor: '#e5e5e5',
      primaryColor: '#f5f2d0',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
    }
  }
]
