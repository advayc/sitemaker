declare module "pdf-parse" {
  interface PDFParseOptions {
    pagerender?: (pageData: unknown) => string | Promise<string>
    max?: number
    version?: string
  }

  interface PDFParseResult {
    numpages: number
    numrender: number
    info: Record<string, unknown>
    metadata: unknown
    text: string
    version: string
  }

  export default function pdfParse(
    data: Buffer | Uint8Array | ArrayBuffer,
    options?: PDFParseOptions,
  ): Promise<PDFParseResult>
}
