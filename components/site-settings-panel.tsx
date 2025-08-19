"use client"

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { defaultSiteSettings, SiteSettings } from '@/types/site-settings'

interface SiteSettingsPanelProps {
  value: SiteSettings
  onChange: (value: SiteSettings) => void
}

// Minimal font options; could be expanded
const FONT_OPTIONS = [
  { label: 'Inter', stack: 'Inter, system-ui, sans-serif' },
  { label: 'System', stack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  { label: 'Serif', stack: 'Georgia, "Times New Roman", serif' },
  { label: 'Mono', stack: 'ui-monospace, SFMono-Regular, Menlo, monospace' }
]

export function SiteSettingsPanel({ value, onChange }: SiteSettingsPanelProps) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState<SiteSettings>(value || defaultSiteSettings)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const apply = () => {
    onChange(local)
    setOpen(false)
  }

  const update = <K extends keyof SiteSettings>(key: K, v: SiteSettings[K]) => {
    setLocal(prev => ({ ...prev, [key]: v }))
  }

  const updateTitle = (section: keyof SiteSettings['sectionTitles'], v: string) => {
    setLocal(prev => ({ ...prev, sectionTitles: { ...prev.sectionTitles, [section]: v } }))
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="minimal" size="sm">Customize</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <div className="space-y-6 pr-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Site Settings</h2>
            <Button variant="silver" size="sm" onClick={apply}>Apply</Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1">Dark Mode</label>
              <div className="flex items-center gap-3">
                <Switch checked={local.theme === 'dark'} onCheckedChange={c => update('theme', c ? 'dark' : 'light')} />
                <span className="text-sm text-gray-600">{local.theme === 'dark' ? 'Dark' : 'Light'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Font Family</label>
              <select
                className="w-full border rounded px-2 py-1 text-sm bg-white"
                value={local.fontFamily}
                aria-label="Font Family"
                title="Font Family"
                onChange={e => update('fontFamily', e.target.value)}
              >
                {FONT_OPTIONS.map(f => (
                  <option key={f.label} value={f.stack}>{f.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Primary Color</label>
                <input type="color" className="w-full h-9 p-0" value={local.primaryColor} aria-label="Primary color" title="Primary color" onChange={e => update('primaryColor', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Text Color</label>
                <input type="color" className="w-full h-9 p-0" value={local.textColor} aria-label="Text color" title="Text color" onChange={e => update('textColor', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Background</label>
                <input type="color" className="w-full h-9 p-0" value={local.backgroundColor} aria-label="Background color" title="Background color" onChange={e => update('backgroundColor', e.target.value)} />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Section Titles</h3>
              {Object.entries(local.sectionTitles).map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-wide text-gray-500">{k}</label>
                  <Input value={v} onChange={e => updateTitle(k as any, e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t flex gap-2">
            <Button size="sm" className="flex-1" onClick={apply}>Save & Apply</Button>
            <Button size="sm" variant="minimal" className="flex-1" onClick={() => setLocal(defaultSiteSettings)}>Reset</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
