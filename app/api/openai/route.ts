import { NextResponse } from "next/server"
import type { ProfileData } from "@/types/profile"
import {
  parseLinkedInProfile,
  parseProfileFromDocument,
  parseProfileFromImage,
  parseProfileFromText,
} from "@/lib/ai-parser"

export const runtime = "nodejs"

interface ParseRequestBody {
  content?: string
  base64Data?: string
  mimeType?: string
  fileType?: string
  linkedinUrl?: string
}

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
    if (!apiKey) {
      console.error("OpenAI API key is not configured")
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment." },
        { status: 500 }
      )
    }

    const body = (await request.json()) as ParseRequestBody
    const { content, base64Data, mimeType, fileType, linkedinUrl } = body

    let profile: ProfileData

    if (linkedinUrl) {
      profile = await parseLinkedInProfile(linkedinUrl)
    } else if (content) {
      profile = await parseProfileFromText(content, fileType || "text file")
    } else if (base64Data && mimeType) {
      // Handle text files by converting base64 to text
      if (mimeType === "text/plain" || fileType?.toLowerCase().endsWith(".txt") || fileType?.toLowerCase().endsWith(".md")) {
        const text = Buffer.from(base64Data, "base64").toString("utf-8")
        profile = await parseProfileFromText(text, fileType || "text file")
      } else if (mimeType.startsWith("image/")) {
        profile = await parseProfileFromImage(base64Data, mimeType, fileType || "resume image")
      } else {
        profile = await parseProfileFromDocument(base64Data, mimeType, fileType || "document")
      }
    } else {
      throw new Error("Invalid request. Provide content, base64Data, or linkedinUrl.")
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("OpenAI parsing error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    const status = message.includes("not configured") ? 500 : 400

    return NextResponse.json({ error: message }, { status })
  }
}
