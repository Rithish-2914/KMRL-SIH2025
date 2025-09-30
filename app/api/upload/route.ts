import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "No files provided" 
      }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const uploadedFiles = []

    for (const file of files) {
      // Validate file
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return NextResponse.json({ 
          success: false, 
          error: `File ${file.name} exceeds 10MB limit` 
        }, { status: 400 })
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(7)
      const fileExtension = file.name.split('.').pop()
      const safeFileName = `${timestamp}_${randomString}.${fileExtension}`
      const filePath = join(uploadsDir, safeFileName)

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Extract text content for AI processing
      let textContent = ""
      const fileType = file.type
      
      // For text files, read content directly
      if (fileType.includes("text")) {
        textContent = buffer.toString("utf-8")
      } else if (fileType.includes("pdf")) {
        // For PDFs, you'd use a PDF parser library
        // For now, we'll use a placeholder
        textContent = `[PDF content from ${file.name}]`
      } else if (fileType.includes("image")) {
        // For images, you'd use OCR
        textContent = `[Image content from ${file.name} - OCR processing needed]`
      } else {
        textContent = `[Content from ${file.name}]`
      }

      uploadedFiles.push({
        original_name: file.name,
        stored_name: safeFileName,
        file_path: `/uploads/${safeFileName}`,
        file_size: file.size,
        mime_type: file.type,
        text_content: textContent,
        uploaded_at: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        files: uploadedFiles,
        count: uploadedFiles.length
      },
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`
    })
  } catch (error) {
    console.error("Error uploading files:", error)
    return NextResponse.json({ 
      success: false, 
      error: "File upload failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
