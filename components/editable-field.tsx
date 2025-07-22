"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Edit2, Check, X } from "lucide-react"

interface EditableFieldProps {
  value: string
  onSave: (value: string) => void
  multiline?: boolean
  className?: string
  placeholder?: string
}

export function EditableField({ value, onSave, multiline = false, className = "", placeholder }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-start gap-2">
        {multiline ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`${className} min-h-[100px]`}
            placeholder={placeholder}
            autoFocus
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={className}
            placeholder={placeholder}
            autoFocus
          />
        )}
        <div className="flex gap-1">
          <Button size="sm" variant="default" onClick={handleSave}>
            <Check className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative">
      <div className={className}>{value}</div>
      <Button
        size="sm"
        variant="ghost"
        className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsEditing(true)}
      >
        <Edit2 className="w-3 h-3" />
      </Button>
    </div>
  )
}
