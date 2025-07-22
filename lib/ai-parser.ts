import type { ProfileData } from "@/types/profile"

// Try environment variable first, then fallback to the provided key
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

/**
 * Extract JSON from an LLM answer that may contain code-fences or prose.
 */
function extractJson(raw: string): any {
  // If the model respected response_format we already have JSON.
  try {
    return JSON.parse(raw)
  } catch {
    /* continue */
  }

  // Remove common code-fence markers
  const stripped = raw.replace(/```json|```/g, "").trim()

  try {
    return JSON.parse(stripped)
  } catch {
    /* continue */
  }

  // Fallback: locate the first { ... } block
  const match = stripped.match(/{[\s\S]*}/)
  if (match) {
    try {
      return JSON.parse(match[0])
    } catch {
      /* continue */
    }
  }

  throw new Error("Unable to extract JSON from AI response")
}

export async function parseWithAI(content: string, fileType: string): Promise<ProfileData> {
  // Debug API key (don't log full key in production)
  console.log("Using API key:", GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : "NOT SET")
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your-actual-api-key-here") {
    throw new Error("Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local")
  }

  const prompt = `
You are an expert at parsing professional profiles and resumes. Extract the following information from the provided ${fileType} content and return it as a JSON object with this exact structure:

{
  "name": "Full Name",
  "title": "Professional Title/Current Role",
  "email": "email@example.com",
  "phone": "phone number if available",
  "location": "City, State/Province",
  "summary": "Professional summary or bio",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "description": "Job description and achievements",
      "companyUrl": "company website if mentioned or can be inferred"
    }
  ],
  "education": [
    {
      "institution": "School Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "startDate": "Month Year",
      "endDate": "Month Year",
      "institutionUrl": "school website if can be inferred"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["tech1", "tech2"],
      "url": "project url if available",
      "githubUrl": "github url if available"
    }
  ],
  "socialLinks": [
    {
      "platform": "LinkedIn",
      "url": "profile url",
      "username": "username"
    }
  ]
}

Important guidelines:
- Extract ALL available information, don't leave fields empty unless truly not available
- For dates, use "Month Year" format (e.g., "Jan 2023")
- If current position, use "Present" for endDate
- Infer company/institution URLs when possible (e.g., microsoft.com for Microsoft)
- Extract skills as simple strings, not objects
- Create a professional summary that is EXACTLY 2 sentences: first sentence about current role/expertise, second sentence about goals/impact
- For social links, extract LinkedIn, GitHub, Twitter, personal websites, etc. - ensure URLs are complete and properly formatted
- Return only valid JSON, no markdown formatting

IMPORTANT: The summary field must be exactly 2 concise sentences that sound professional and engaging.

Content to parse:
${content}
`

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
        topP: 0.8,
        topK: 10
      }
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Gemini AI request failed: ${res.status} ${res.statusText} - ${errorText}`)
  }

  const data = await res.json()
  const responseContent = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

  if (!responseContent) {
    throw new Error("Empty response from AI")
  }

  const parsed = extractJson(responseContent)

  // Normalize the data to ensure arrays are properly formatted
  const normalized = {
    name: parsed.name || "Unknown",
    title: parsed.title || "",
    email: parsed.email || "",
    phone: parsed.phone || "",
    location: parsed.location || "",
    summary: parsed.summary || "",
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    skills: Array.isArray(parsed.skills)
      ? parsed.skills.map((skill: any) =>
          typeof skill === "string" ? skill : skill.name || skill.skill || String(skill),
        )
      : [],
    projects: Array.isArray(parsed.projects)
      ? parsed.projects.map((project: any) => ({
          ...project,
          technologies: Array.isArray(project.technologies) ? project.technologies : [],
        }))
      : [],
    socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : [],
  }

  return normalized as ProfileData
}

export async function parseWithAIFromFile(base64Data: string, mimeType: string, fileType: string): Promise<ProfileData> {
  // Debug API key (don't log full key in production)
  console.log("Using API key:", GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : "NOT SET")
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your-actual-api-key-here") {
    throw new Error("Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local")
  }

  const prompt = `
Analyze this ${fileType} and extract the following information in JSON format. Be thorough and accurate:

{
  "name": "Full name of the person",
  "title": "Professional title or desired position",
  "email": "email address if found",
  "phone": "phone number if found",
  "location": "City, State/Province/Country",
  "summary": "Brief professional summary (2-3 sentences)",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "description": "Detailed description of responsibilities and achievements",
      "companyUrl": "company website if can be inferred"
    }
  ],
  "education": [
    {
      "institution": "School/University name",
      "degree": "Degree Type",
      "field": "Field of study",
      "startDate": "Month Year",
      "endDate": "Month Year",
      "institutionUrl": "school website if can be inferred"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["tech1", "tech2"],
      "url": "project url if available",
      "githubUrl": "github url if available"
    }
  ],
  "socialLinks": [
    {
      "platform": "Platform Name",
      "url": "profile url",
      "username": "username"
    }
  ]
}

IMPORTANT: 
- Limit the skills array to a maximum of 10 skills. Choose the most relevant and important skills.
- Extract all information accurately from the resume. If some information is not available, use reasonable defaults or leave empty.
- Make sure the JSON is valid and complete.
- For dates, use "Month Year" format (e.g., "Jan 2023")
- If current position, use "Present" for endDate
- The summary field must be exactly 2 concise sentences: first sentence about current role/expertise, second sentence about goals/impact
- For social links, ensure URLs are complete and properly formatted (include https:// if missing)

Please extract all information accurately from the file.
`

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    }
  }

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Gemini AI request failed: ${res.status} ${res.statusText} - ${errorText}`)
  }

  const data = await res.json()
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API')
  }

  const responseContent = data.candidates[0].content.parts[0].text

  if (!responseContent) {
    throw new Error("Empty response from AI")
  }

  const parsed = extractJson(responseContent)

  // Normalize the data to ensure arrays are properly formatted and match ProfileData interface
  const normalized = {
    name: parsed.name || "Unknown",
    title: parsed.title || "",
    email: parsed.email || "",
    phone: parsed.phone || "",
    location: parsed.location || "",
    summary: parsed.summary || "",
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    skills: Array.isArray(parsed.skills)
      ? parsed.skills.slice(0, 10).map((skill: any) =>
          typeof skill === "string" ? skill : skill.name || skill.skill || String(skill),
        )
      : [],
    projects: Array.isArray(parsed.projects)
      ? parsed.projects.map((project: any) => ({
          ...project,
          technologies: Array.isArray(project.technologies) ? project.technologies : [],
        }))
      : [],
    socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : [],
  }

  return normalized as ProfileData
}

export async function parseLinkedInProfile(linkedinUrl: string): Promise<ProfileData> {
  // Debug API key (don't log full key in production)
  console.log("Using API key:", GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : "NOT SET")
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your-actual-api-key-here") {
    throw new Error("Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local")
  }

  const prompt = `
Based on this LinkedIn profile URL: ${linkedinUrl}

Create a realistic professional profile with the following JSON structure:

{
  "name": "Professional Name",
  "title": "Current Job Title",
  "email": "email@example.com",
  "phone": "+1234567890",
  "location": "City, State",
  "summary": "Professional summary paragraph",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Jan 2023",
      "endDate": "Present",
      "description": "Job responsibilities and achievements",
      "companyUrl": "https://company.com"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor's",
      "field": "Computer Science",
      "startDate": "Sep 2019",
      "endDate": "May 2023",
      "institutionUrl": "https://university.edu"
    }
  ],
  "skills": ["JavaScript", "React", "Node.js"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["React", "TypeScript"],
      "url": "https://project.com",
      "githubUrl": "https://github.com/user/project"
    }
  ],
  "socialLinks": [
    {
      "platform": "LinkedIn",
      "url": "${linkedinUrl}",
      "username": "username"
    }
  ]
}

Make it realistic for a professional in tech/business. Return only the JSON object.
`

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
        topP: 0.8,
        topK: 10
      }
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Gemini AI request failed: ${res.status} ${res.statusText} - ${errorText}`)
  }

  const data = await res.json()
  const responseContent = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

  if (!responseContent) {
    throw new Error("Empty response from AI")
  }

  const parsed = extractJson(responseContent)

  // Normalize the data to ensure arrays are properly formatted
  const normalized = {
    name: parsed.name || "Professional Name",
    title: parsed.title || "Software Developer",
    email: parsed.email || "contact@example.com",
    phone: parsed.phone || "",
    location: parsed.location || "San Francisco, CA",
    summary: parsed.summary || "Experienced professional with expertise in technology and innovation.",
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    skills: Array.isArray(parsed.skills)
      ? parsed.skills.map((skill: any) =>
          typeof skill === "string" ? skill : skill.name || skill.skill || String(skill),
        )
      : [],
    projects: Array.isArray(parsed.projects)
      ? parsed.projects.map((project: any) => ({
          ...project,
          technologies: Array.isArray(project.technologies) ? project.technologies : [],
        }))
      : [],
    socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : [],
  }

  return normalized as ProfileData
}
