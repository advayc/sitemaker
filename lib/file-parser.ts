import type { ProfileData } from "@/types/profile"
import { parseWithAI, parseWithAIFromFile } from "./ai-parser"

// Convert file to base64 for binary file processing
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64 string
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export async function parseFile(file: File): Promise<ProfileData> {
  try {
    let content = ""
    let fileType = ""
    let base64Data = ""

    // Handle text-based files
    if (file.type === "application/json") {
      content = await file.text()
  fileType = "JSON export"
    } else if (file.type === "application/xml" || file.type === "text/xml") {
      content = await file.text()
  fileType = "XML export"
    } else if (file.type.startsWith("text/")) {
      content = await file.text()
      fileType = "text file"
    } 
    // Handle binary files (PDF, images, DOCX) with Gemini Vision API
    else if (
      file.type === "application/pdf" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword" ||
      file.type.startsWith("image/")
    ) {
      base64Data = await fileToBase64(file)
      fileType = file.type === "application/pdf" ? "PDF resume" : 
                 file.type.includes("word") ? "Word document resume" :
                 file.type.startsWith("image/") ? "resume image" : "document"
      
      // Use AI parser with file data for binary files
      return await parseWithAIFromFile(base64Data, file.type, fileType)
    } else {
      throw new Error("Unsupported file type. Please upload a PDF, Word document, image, or text file.")
    }

    // For text-based files, check if content is available
    if (!content.trim() && !base64Data) {
      throw new Error("File appears to be empty")
    }

    // Use AI to parse text content
    return await parseWithAI(content, fileType)
  } catch (error) {
    console.error("File parsing error:", error)
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
