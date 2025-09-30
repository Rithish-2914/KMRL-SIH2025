import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { fileName, fileContent, fileType } = await req.json()

    const lowerFileName = fileName.toLowerCase()
    const text = fileContent || ""
    
    let department = "General"
    let priority: "low" | "medium" | "high" | "urgent" = "medium"
    let is_actionable = false
    
    if (lowerFileName.includes("safety") || lowerFileName.includes("security") || text.toLowerCase().includes("safety")) {
      department = "Safety"
      priority = "high"
      is_actionable = true
    } else if (lowerFileName.includes("hr") || lowerFileName.includes("employee") || text.toLowerCase().includes("employee")) {
      department = "Human Resources"
      priority = "medium"
    } else if (lowerFileName.includes("finance") || lowerFileName.includes("budget") || text.toLowerCase().includes("budget")) {
      department = "Finance"
      priority = "high"
      is_actionable = true
    } else if (lowerFileName.includes("maintenance") || lowerFileName.includes("repair") || text.toLowerCase().includes("maintenance")) {
      department = "Maintenance"
      priority = "high"
      is_actionable = true
    } else if (lowerFileName.includes("engineering") || lowerFileName.includes("technical")) {
      department = "Engineering"
      priority = "medium"
    } else if (lowerFileName.includes("regulatory") || lowerFileName.includes("compliance")) {
      department = "Regulatory"
      priority = "urgent"
      is_actionable = true
    }
    
    if (lowerFileName.includes("urgent") || lowerFileName.includes("immediate") || text.toLowerCase().includes("urgent")) {
      priority = "urgent"
      is_actionable = true
    }

    const deadline = new Date()
    const days = priority === "urgent" ? 3 : priority === "high" ? 7 : priority === "medium" ? 14 : 30
    deadline.setDate(deadline.getDate() + days)

    const summary_en = `This ${fileType} document has been automatically processed and classified as ${department} related with ${priority} priority. ${is_actionable ? 'This document requires action and has been flagged for review.' : 'This document is for informational purposes.'}`
    
    const summary_ml = `ഈ ${fileType} രേഖ യാന്ത്രികമായി പ്രോസസ്സ് ചെയ്യുകയും ${department} മായി ബന്ധപ്പെട്ടതായി ${priority} മുൻഗണനയോടെ വർഗ്ഗീകരിക്കുകയും ചെയ്തു. ${is_actionable ? 'ഈ രേഖയ്ക്ക് നടപടി ആവശ്യമാണ് കൂടാതെ അവലോകനത്തിനായി ഫ്ലാഗ് ചെയ്തിട്ടുണ്ട്.' : 'ഈ രേഖ വിവരദായക ആവശ്യങ്ങൾക്കാണ്.'}`

    const keywords = [department.toLowerCase(), priority, fileType]
    if (is_actionable) keywords.push("actionable")

    return NextResponse.json({
      summary_en,
      summary_ml,
      department,
      priority,
      is_actionable,
      deadline: is_actionable ? deadline.toISOString().split('T')[0] : undefined,
      keywords,
      confidence_score: 0.85,
    })
  } catch (error) {
    console.error("Document processing error:", error)
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 }
    )
  }
}
