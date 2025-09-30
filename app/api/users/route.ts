import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/users - Fetch all users
export async function GET(request: NextRequest) {
  try {
    const users = await db.getUsers()
    
    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch users",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
