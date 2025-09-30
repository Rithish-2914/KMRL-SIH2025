import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/documents/[id] - Get a specific document with full details
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const document = await db.getDocumentById(params.id)

    if (!document) {
      return NextResponse.json({ 
        success: false, 
        error: "Document not found" 
      }, { status: 404 })
    }

    // Get related data
    const [analysis, routes, auditLogs, departments] = await Promise.all([
      db.getDocumentAnalysis(params.id),
      db.getDocumentRoutes(params.id),
      db.getAuditLogs(params.id),
      db.getDepartments()
    ])

    // Get department info
    const department = departments.find(d => d.id === document.department_id)

    return NextResponse.json({
      success: true,
      data: {
        ...document,
        department,
        analysis,
        routes,
        audit_logs: auditLogs
      },
    })
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch document",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

// PATCH /api/documents/[id] - Update document status
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, user_id } = body

    if (!status) {
      return NextResponse.json({ 
        success: false, 
        error: "Status is required" 
      }, { status: 400 })
    }

    await db.updateDocumentStatus(params.id, status)

    // Create audit log
    if (user_id) {
      await db.createAuditLog({
        user_id,
        document_id: params.id,
        action: "document_status_updated",
        details: { new_status: status },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Document status updated successfully",
    })
  } catch (error) {
    console.error("Error updating document:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to update document",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

// POST /api/documents/[id] - Document workflow actions (approve, decline, comment)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { action, user_id, comments, malayalam_comments } = body

    if (!action || !user_id) {
      return NextResponse.json({ 
        success: false, 
        error: "Action and user_id are required" 
      }, { status: 400 })
    }

    // Validate action
    const validActions = ['approve', 'decline', 'review', 'comment']
    if (!validActions.includes(action)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid action. Must be: approve, decline, review, or comment" 
      }, { status: 400 })
    }

    // Get document to check if it exists
    const document = await db.getDocumentById(params.id)
    if (!document) {
      return NextResponse.json({ 
        success: false, 
        error: "Document not found" 
      }, { status: 404 })
    }

    // Create document route for the action
    const route = await db.createDocumentRoute({
      document_id: params.id,
      from_user_id: user_id,
      to_department_id: document.department_id,
      action,
      comments,
      malayalam_comments,
      status: 'completed'
    })

    // Update document status based on action
    let newStatus = document.status
    if (action === 'approve') {
      newStatus = 'approved'
    } else if (action === 'decline') {
      newStatus = 'rejected'
    }
    
    if (newStatus !== document.status) {
      await db.updateDocumentStatus(params.id, newStatus, user_id)
    }

    // Create audit log
    await db.createAuditLog({
      user_id,
      document_id: params.id,
      action: `document_${action}`,
      details: { 
        action, 
        comments, 
        old_status: document.status,
        new_status: newStatus
      }
    })

    return NextResponse.json({
      success: true,
      message: `Document ${action} successful`,
      data: { route, new_status: newStatus }
    })
  } catch (error) {
    console.error("Error processing document action:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process action",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
