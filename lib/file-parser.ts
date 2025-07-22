import type { ProfileData } from "@/types/profile"
import { parseWithAI } from "./ai-parser"

export async function parseFile(file: File): Promise<ProfileData> {
  try {
    let content = ""
    let fileType = ""

    if (file.type === "application/json") {
      content = await file.text()
      fileType = "LinkedIn JSON export"
    } else if (file.type === "application/xml" || file.type === "text/xml") {
      content = await file.text()
      fileType = "LinkedIn XML export"
    } else if (file.type === "application/pdf") {
      // For PDF parsing, we'd need a PDF parser library
      // For now, we'll simulate with a placeholder
      content = "PDF content would be extracted here using a PDF parser library"
      fileType = "PDF resume"
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      // For DOCX parsing, we'd need a DOCX parser library
      content = "DOCX content would be extracted here using a DOCX parser library"
      fileType = "Word document resume"
    } else if (file.type.startsWith("text/")) {
      content = await file.text()
      fileType = "text file"
    } else {
      throw new Error("Unsupported file type")
    }

    if (!content.trim()) {
      throw new Error("File appears to be empty")
    }

    // Use AI to parse the content
    return await parseWithAI(content, fileType)
  } catch (error) {
    console.error("File parsing error:", error)
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function parseLinkedInUrl(url: string): Promise<ProfileData> {
  if (!url.includes("linkedin.com")) {
    throw new Error("Please provide a valid LinkedIn profile URL")
  }

  const { parseLinkedInProfile } = await import("./ai-parser")
  return await parseLinkedInProfile(url)
}
