declare module "mammoth" {
  interface ExtractRawTextResult {
    value: string
    messages: Array<{ type: string; message: string }>
  }

  export function extractRawText(input: { buffer: Buffer }): Promise<ExtractRawTextResult>
}
