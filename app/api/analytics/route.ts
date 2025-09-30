import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "30d"

    // Get real document counts from database
    const [
      totalDocs,
      pendingDocs,
      classifiedDocs,
      approvedDocs,
      rejectedDocs
    ] = await Promise.all([
      db.getDocumentCount(),
      db.getDocumentCount({ status: 'pending' }),
      db.getDocumentCount({ status: 'classified' }),
      db.getDocumentCount({ status: 'approved' }),
      db.getDocumentCount({ status: 'rejected' })
    ])

    // Get department stats
    const departments = await db.getDepartments()
    const departmentStatsPromises = departments.map(async (dept) => {
      const total = await db.getDocumentCount({ department_id: dept.id })
      const pending = await db.getDocumentCount({ 
        department_id: dept.id, 
        status: 'classified' 
      })
      
      return {
        name: dept.name,
        documents: total,
        pending: pending,
        slaCompliance: total > 0 ? Math.round(((total - pending) / total) * 100) : 100,
      }
    })
    
    const departmentStats = await Promise.all(departmentStatsPromises)

    const analyticsData = {
      documentStats: {
        total: totalDocs,
        pending: pendingDocs + classifiedDocs,
        processed: approvedDocs + rejectedDocs,
        overdue: 0,
      },
      departmentStats: departmentStats.length > 0 ? departmentStats : [
        {
          name: "No departments",
          documents: totalDocs,
          pending: pendingDocs + classifiedDocs,
          slaCompliance: 0,
        }
      ],
      monthlyTrends: [],
      categoryDistribution: [],
      slaMetrics: {
        averageProcessingTime: 0,
        onTimeCompletion: totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0,
        overdueDocuments: 0,
      },
    }

    return NextResponse.json({
      success: true,
      data: analyticsData,
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
