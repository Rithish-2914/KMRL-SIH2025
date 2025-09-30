import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/workflows - Get all documents with their routes and status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50

    // Get documents
    const filters: any = { limit }
    if (status) {
      filters.status = status
    }

    const documents = await db.getDocuments(filters)

    // Enhance documents with routes and analysis
    const enhancedDocs = await Promise.all(
      documents.map(async (doc) => {
        const [analysis, routes, departments] = await Promise.all([
          db.getDocumentAnalysis(doc.id),
          db.getDocumentRoutes(doc.id),
          db.getDepartments()
        ])

        // Find department info
        const dept = departments.find(d => d.id === doc.department_id)

        return {
          id: doc.id,
          title: doc.title,
          malayalam_title: doc.malayalam_title,
          document: doc.file_name,
          status: doc.status,
          priority: doc.priority,
          department: dept?.name || 'Operations',
          assignee: `${dept?.name || 'Operations'} Team`,
          dueDate: doc.due_date,
          progress: getProgressFromStatus(doc.status),
          steps: getStepsFromRoutes(routes, doc.status),
          summary: analysis?.summary || doc.description,
          created_at: doc.created_at
        }
      })
    )

    // Calculate stats
    const stats = {
      total: enhancedDocs.length,
      active: enhancedDocs.filter(d => d.status === 'classified' || d.status === 'pending').length,
      pending: enhancedDocs.filter(d => d.status === 'pending').length,
      overdue: enhancedDocs.filter(d => {
        if (!d.dueDate) return false
        return new Date(d.dueDate) < new Date() && d.status !== 'approved'
      }).length,
      completed: enhancedDocs.filter(d => d.status === 'approved').length
    }

    return NextResponse.json({
      success: true,
      data: {
        workflows: enhancedDocs,
        stats
      }
    })
  } catch (error) {
    console.error("Error fetching workflows:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch workflows",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

function getProgressFromStatus(status: string): number {
  const progressMap: Record<string, number> = {
    'pending': 25,
    'classified': 50,
    'approved': 100,
    'rejected': 100
  }
  return progressMap[status] || 0
}

function getStepsFromRoutes(routes: any[], status: string) {
  const baseSteps = [
    { name: 'Document Upload', status: 'completed' },
    { name: 'AI Classification', status: status === 'pending' ? 'in_progress' : 'completed' },
    { name: 'Department Review', status: status === 'classified' ? 'in_progress' : status === 'pending' ? 'pending' : 'completed' },
    { name: 'Approval', status: status === 'approved' ? 'completed' : status === 'rejected' ? 'completed' : 'pending' }
  ]

  return baseSteps
}
