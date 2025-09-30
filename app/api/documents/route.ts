import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/documents - Retrieve documents with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const department_id = searchParams.get("department_id") || undefined
    const uploaded_by = searchParams.get("uploaded_by") || undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 100

    const documents = await db.getDocuments({
      status,
      department_id,
      uploaded_by,
      limit
    })

    // Get departments for display
    const departments = await db.getDepartments()
    const deptMap = new Map(departments.map(d => [d.id, d]))

    // Enrich documents with department info
    const enrichedDocs = documents.map(doc => ({
      ...doc,
      department: doc.department_id ? deptMap.get(doc.department_id) : null
    }))

    return NextResponse.json({
      success: true,
      data: enrichedDocs,
      count: enrichedDocs.length,
    })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch documents",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

// POST /api/documents - Create a new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["title", "file_path", "file_name", "source_type", "uploaded_by"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          success: false, 
          error: `Missing required field: ${field}` 
        }, { status: 400 })
      }
    }

    const document = await db.createDocument({
      title: body.title,
      malayalam_title: body.malayalam_title,
      description: body.description,
      file_path: body.file_path,
      file_name: body.file_name,
      file_size: body.file_size,
      mime_type: body.mime_type,
      language: body.language || "en",
      source_type: body.source_type,
      category_code: body.category_code,
      department_id: body.department_id,
      uploaded_by: body.uploaded_by,
      status: "pending",
      priority: body.priority || "medium",
      due_date: body.due_date,
    })

    // Create audit log
    await db.createAuditLog({
      user_id: body.uploaded_by,
      document_id: document.id,
      action: "document_created",
      details: { source_type: body.source_type, file_name: body.file_name },
    })

    return NextResponse.json(
      {
        success: true,
        data: document,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating document:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create document",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
