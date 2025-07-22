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
  showEditIcon?: boolean
  editIconPosition?: string
}

export function EditableField({ value, onSave, multiline = false, className = "", placeholder, showEditIcon = true, editIconPosition = "-right-8" }: EditableFieldProps) {
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
          <Button size="sm" variant="minimal" onClick={handleSave} className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <Check className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="minimal" onClick={handleCancel} className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative hover:bg-gray-50 rounded px-1 -mx-1">
      <div className={`${className} relative z-10`}>{value || placeholder}</div>
      {showEditIcon && (
        <Button
          size="sm"
          variant="minimal"
          className={`absolute ${editIconPosition} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm hover:shadow-md p-1`}
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  )
}
