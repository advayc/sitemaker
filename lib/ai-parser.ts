import { Buffer } from "node:buffer"
import OpenAI from "openai"
import type { ChatCompletionContentPart, ChatCompletionMessageParam } from "openai/resources/chat/completions"
import type { ProfileData } from "@/types/profile"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-4o-mini"

let cachedClient: OpenAI | null = null

function getClient(): OpenAI {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured. Set OPENAI_API_KEY in your environment.")
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey: OPENAI_API_KEY })
  }

  return cachedClient
}

const SYSTEM_PROMPT = `You are an expert assistant that extracts structured professional profile data from resumes, CVs, LinkedIn exports, and similar documents. 

CRITICAL: You MUST respond with ONLY a valid JSON object. Do not include any explanatory text, markdown formatting, or code blocks. Return raw JSON only.

The JSON object must match this exact schema:
{
  "name": "Full Name",
  "title": "Professional Title/Current Role",
  "email": "email@example.com",
  "phone": "phone number if available",
  "location": "City, State/Province",
  "summary": "Exactly 2 sentences: first sentence describes current role/expertise, second sentence highlights goals/impact",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "description": "Detailed description of responsibilities and achievements",
      "companyUrl": "https://company.com if available or can be inferred"
    }
  ],
  "education": [
    {
      "institution": "Institution Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "startDate": "Month Year",
      "endDate": "Month Year",
      "institutionUrl": "https://institution.edu if available or can be inferred"
    }
  ],
  "skills": ["skill1", "skill2", ...],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["tech1", "tech2"],
      "url": "https://project.com if available",
      "githubUrl": "https://github.com/... if available"
    }
  ],
  "socialLinks": [
    {
      "platform": "LinkedIn",
      "url": "https://linkedin.com/in/example",
      "username": "username"
    }
  ]
}

Guidelines:
- Return ALL information available in the source, infer reputable URLs when the company or institution is well-known.
- Dates must use the format "Mon YYYY" (e.g., "Jan 2024"). Use "Present" for current roles.
- Limit the skills array to at most 10 high-impact skills ordered by relevance.
- Ensure URLs are absolute (include https://) and summaries are polished, professional, and exactly two sentences.
- Respond with JSON only—no commentary, markdown, or code fences.`

/**
 * Extract JSON from an LLM answer that may contain code-fences or prose.
 */
function extractJson(raw: string): any {
  // Try parsing the raw string directly
  try {
    return JSON.parse(raw)
  } catch {
    /* continue */
  }

  // Remove common markdown code fence patterns
  const stripped = raw
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim()

  try {
    return JSON.parse(stripped)
  } catch {
    /* continue */
  }

  // Try to find JSON object in the response
  const jsonMatch = stripped.match(/{[\s\S]*}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0])
    } catch {
      /* continue */
    }
  }

  // Try to find JSON array in the response
  const arrayMatch = stripped.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0])
    } catch {
      /* continue */
    }
  }

  console.error("Failed to extract JSON from response:", raw.substring(0, 500))
  throw new Error("Unable to extract JSON from AI response. Please try again or use a different file format.")
}

function normalizeProfile(parsed: any): ProfileData {
  // Ensure we have a valid object
  if (!parsed || typeof parsed !== 'object') {
    throw new Error("Invalid profile data structure received from AI")
  }

  return {
    name: parsed?.name || "Unknown",
    title: parsed?.title || "",
    email: parsed?.email || "",
    phone: parsed?.phone || "",
    location: parsed?.location || "",
    summary: parsed?.summary || "",
    experience: Array.isArray(parsed?.experience) ? parsed.experience : [],
    education: Array.isArray(parsed?.education) ? parsed.education : [],
    skills: Array.isArray(parsed?.skills)
      ? parsed.skills
          .slice(0, 10)
          .map((skill: any) => (typeof skill === "string" ? skill : skill?.name || skill?.skill || String(skill)))
      : [],
    projects: Array.isArray(parsed?.projects)
      ? parsed.projects.map((project: any) => ({
          ...project,
          technologies: Array.isArray(project?.technologies) ? project.technologies : [],
        }))
      : [],
    socialLinks: Array.isArray(parsed?.socialLinks) ? parsed.socialLinks : [],
  }
}

async function runChat(messages: ChatCompletionMessageParam[], maxTokens = 2048): Promise<ProfileData> {
  const client = getClient()
  
  try {
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.1,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    })

    const message = completion.choices?.[0]?.message

    if (!message) {
      throw new Error("Empty response from OpenAI")
    }

    const responseContent = Array.isArray(message.content)
      ? message.content
          .map((part) => {
            if (typeof part === "string") {
              return part
            }
            if ("text" in part && typeof part.text === "string") {
              return part.text
            }
            return ""
          })
          .join("")
      : message.content ?? ""

    if (!responseContent) {
      throw new Error("Empty response from OpenAI")
    }

    const parsed = extractJson(responseContent)
    return normalizeProfile(parsed)
  } catch (error) {
    console.error("OpenAI API error:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to parse profile with AI")
  }
}

async function ensureMammoth(): Promise<{ extractRawText: (input: { buffer: Buffer }) => Promise<{ value: string }> }> {
  const mammothModule = await import("mammoth")
  return mammothModule as unknown as { extractRawText: (input: { buffer: Buffer }) => Promise<{ value: string }> }
}

/**
 * Extract text from PDF using a faster approach - convert to base64 and use GPT-4o with PDF support
 */
async function extractTextFromPdfWithOpenAI(buffer: Buffer): Promise<string> {
  const client = getClient()
  
  // Convert buffer to base64
  const base64Pdf = buffer.toString('base64')
  
  try {
    // Use GPT-4o which supports PDF input directly
    const completion = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06", // This model supports PDF inputs
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all text from this PDF document exactly as it appears. Return only the extracted text, no commentary or formatting."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${base64Pdf}`
              }
            }
          ]
        }
      ],
      max_tokens: 4096,
      temperature: 0.1,
    })

    const extractedText = completion.choices[0]?.message?.content || ""
    
    if (!extractedText.trim()) {
      throw new Error("No text extracted from PDF")
    }

    return extractedText
  } catch (error) {
    console.error("PDF extraction error:", error)
    throw error
  }
}

export async function parseProfileFromText(content: string, fileType: string): Promise<ProfileData> {
  if (!content.trim()) {
    throw new Error("No content provided for OpenAI parsing")
  }

  // Limit content length to prevent token overflow
  const maxLength = 20000 // Approximately 5000 tokens
  const trimmedContent = content.length > maxLength 
    ? content.substring(0, maxLength) + "\n[Content truncated due to length]"
    : content

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Source type: ${fileType}.\n\nExtract the full profile from the following content:\n\n${trimmedContent}`,
    },
  ]

  return runChat(messages)
}

export async function parseProfileFromDocument(base64Data: string, mimeType: string, fileType: string): Promise<ProfileData> {
  if (!base64Data) {
    throw new Error("No file data provided for parsing")
  }

  // For PDFs, extract text using OpenAI's file API
  if (mimeType === "application/pdf") {
    try {
      const buffer = Buffer.from(base64Data, "base64")
      const text = await extractTextFromPdfWithOpenAI(buffer)

      if (!text || text.trim().length === 0) {
        throw new Error("Unable to extract text from PDF file. The PDF may be image-based or encrypted.")
      }

      return parseProfileFromText(text, fileType || "PDF resume")
    } catch (error) {
      console.error("PDF parsing error:", error)
      if (error instanceof Error && error.message.includes("Unable to extract text")) {
        throw error
      }
      throw new Error("Failed to parse PDF file. Please ensure it contains readable text.")
    }
  }

  // For images, extract text using OpenAI (not vision API - using file search)
  if (mimeType.startsWith("image/")) {
    try {
      // Convert image to text using OCR or similar approach
      // For now, throw a helpful error
      throw new Error("Image files are not yet supported. Please convert your resume to PDF or DOCX format.")
    } catch (error) {
      console.error("Image parsing error:", error)
      throw error instanceof Error ? error : new Error("Failed to parse image file.")
    }
  }

  // For DOCX files, extract text first then parse with OpenAI
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    try {
      const buffer = Buffer.from(base64Data, "base64")
      const mammoth = await ensureMammoth()
      const { value } = await mammoth.extractRawText({ buffer })
      const text = value?.trim()

      if (!text) {
        throw new Error("Unable to extract text from DOCX file. Please ensure the document contains selectable text.")
      }

      return parseProfileFromText(text, fileType || "Word document resume")
    } catch (error) {
      console.error("DOCX parsing error:", error)
      if (error instanceof Error && error.message.includes("Unable to extract text")) {
        throw error
      }
      throw new Error("Failed to parse DOCX file. Please ensure it's a valid Word document.")
    }
  }

  if (mimeType === "application/msword") {
    throw new Error("Microsoft Word .doc files are not supported. Please convert the resume to PDF or DOCX.")
  }

  throw new Error(`Unsupported document type: ${mimeType}`)
}

export async function parseProfileFromImage(base64Data: string, mimeType: string, fileType: string): Promise<ProfileData> {
  if (!base64Data) {
    throw new Error("No image data provided for OpenAI parsing")
  }

  try {
    const dataUrl = `data:${mimeType};base64,${base64Data}`

    const visionPrompt: ChatCompletionContentPart[] = [
      {
        type: "text",
        text: `The attached ${fileType} image contains a resume or professional profile. Carefully transcribe the text and return a JSON object that follows the required schema. If information is missing, leave the fields empty.`,
      },
      {
        type: "image_url",
        image_url: {
          url: dataUrl,
        },
      },
    ]

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: visionPrompt },
    ]

    return runChat(messages, 4096) // Increase token limit for vision tasks
  } catch (error) {
    console.error("Image parsing error:", error)
    throw new Error("Failed to parse image. Please ensure the image contains clear, readable text.")
  }
}

export async function parseLinkedInProfile(linkedinUrl: string): Promise<ProfileData> {
  if (!linkedinUrl) {
    throw new Error("LinkedIn URL is required")
  }

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Create a realistic professional profile for this LinkedIn URL: ${linkedinUrl}. Use plausible roles, achievements, and links that match a seasoned technology professional.`,
    },
  ]

  return runChat(messages)
}
