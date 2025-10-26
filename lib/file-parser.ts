import type { ProfileData } from "@/types/profile"

/**
 * Main function to parse a file and extract profile data using OpenAI via API route
 */
export async function parseFile(file: File): Promise<ProfileData> {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  // Convert file to base64
  const base64Data = await fileToBase64(file)

  // Call the API route to parse the file
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base64Data,
      mimeType: fileType,
      fileType: file.name,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to parse file' }))
    throw new Error(errorData.error || `Failed to parse file: ${response.statusText}`)
  }

  const result = await response.json()
  return result.profile
}

/**
 * Convert a File to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(",")[1]
        resolve(base64)
      } else {
        reject(new Error("Failed to read file as base64"))
      }
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}