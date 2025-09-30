import { type NextRequest, NextResponse } from "next/server"
import { aiServices } from "@/lib/ai-services"

// Free fallback processor for when OpenAI is unavailable
function processFallback(text: string, title: string, language: "en" | "ml") {
  const lowerText = text.toLowerCase()
  const lowerTitle = title.toLowerCase()
  const combined = `${lowerTitle} ${lowerText}`

  // Classify by keywords
  const categories: Record<string, string[]> = {
    SAFETY_RPT: ["safety", "security", "incident", "accident", "hazard"],
    EMP_REC: ["employee", "hr", "staff", "personnel", "hiring"],
    FIN_RPT: ["finance", "budget", "payment", "invoice", "cost"],
    TECH_SPEC: ["technical", "engineering", "specification", "design"],
    MAINT_LOG: ["maintenance", "repair", "service", "breakdown"],
    COMPLIANCE: ["compliance", "regulatory", "legal", "audit"],
    POLICY: ["policy", "procedure", "guideline", "protocol"],
  }

  let category = "CORRESP"
  let maxMatches = 0

  for (const [cat, keywords] of Object.entries(categories)) {
    const matches = keywords.filter(kw => combined.includes(kw)).length
    if (matches > maxMatches) {
      maxMatches = matches
      category = cat
    }
  }

  // Determine priority
  let priority: "low" | "medium" | "high" | "urgent" = "medium"
  if (combined.includes("urgent") || combined.includes("critical")) priority = "urgent"
  else if (combined.includes("high priority") || category === "SAFETY_RPT") priority = "high"
  else if (combined.includes("low priority")) priority = "low"

  // Department mapping
  const deptMap: Record<string, string> = {
    SAFETY_RPT: "safety", EMP_REC: "hr", FIN_RPT: "finance",
    TECH_SPEC: "maintenance", MAINT_LOG: "maintenance", 
    COMPLIANCE: "operations", POLICY: "operations", CORRESP: "operations"
  }

  // Extract keywords
  const keywords: string[] = []
  for (const kws of Object.values(categories)) {
    for (const kw of kws) {
      if (combined.includes(kw) && !keywords.includes(kw)) keywords.push(kw)
    }
  }

  // Generate summary
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 10).slice(0, 3)
  const summary = sentences.join(". ").trim() + "." || 
    `${title} has been classified as ${category} with ${priority} priority.`

  // Basic Malayalam translations
  const mlTranslations: Record<string, string> = {
    "safety": "സുരക്ഷ", "urgent": "അടിയന്തിരം", "high": "ഉയർന്നത്",
    "medium": "ഇടത്തരം", "low": "കുറഞ്ഞത്", "priority": "മുൻഗണന",
    "classified": "വർഗ്ഗീകരിച്ചു", "has been": "ആയി", "with": "ഉള്ള"
  }
  
  let malayalam_summary = summary
  for (const [en, ml] of Object.entries(mlTranslations)) {
    malayalam_summary = malayalam_summary.replace(new RegExp(en, "gi"), ml)
  }

  // Add Malayalam keywords
  const malayalam_keywords = keywords.map(kw => {
    return mlTranslations[kw.toLowerCase()] || kw
  })

  return {
    summary, keywords, category, priority,
    suggested_department: deptMap[category],
    urgency_score: priority === "urgent" ? 0.9 : priority === "high" ? 0.75 : 0.5,
    key_points: sentences,
    malayalam_summary: language === "ml" ? malayalam_summary : undefined,
    malayalam_keywords: language === "ml" ? malayalam_keywords : undefined
  }
}

// POST /api/ai/process-document - Comprehensive AI document processing
// Includes: OCR, summarization, classification, department routing, deadline suggestion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      text, 
      title, 
      fileName,
      fileContent,
      fileType,
      language = "en", 
      document_id 
    } = body

    const documentText = text || fileContent || ""
    const documentTitle = title || fileName || "Untitled Document"

    if (!documentText || !documentTitle) {
      return NextResponse.json({ 
        success: false, 
        error: "Text content and title are required" 
      }, { status: 400 })
    }

    let summaryResult, classificationResult

    // Try AI processing, fall back to rule-based if it fails
    try {
      [summaryResult, classificationResult] = await Promise.all([
        aiServices.generateSummary(documentText, language),
        aiServices.classifyDocument(documentText, documentTitle)
      ])
    } catch (aiError) {
      console.log("OpenAI unavailable, using fallback processor")
      const fallback = processFallback(documentText, documentTitle, language)
      summaryResult = {
        summary: fallback.summary,
        malayalam_summary: fallback.malayalam_summary,
        keywords: fallback.keywords,
        malayalam_keywords: fallback.malayalam_keywords,
        key_points: fallback.key_points,
        sentiment: "neutral" as const,
        urgency_score: fallback.urgency_score,
        confidence_score: 0.75
      }
      classificationResult = {
        suggested_category: fallback.category,
        suggested_department: fallback.suggested_department,
        priority_suggestion: fallback.priority,
        confidence_score: 0.75,
        reasoning: "Classified using keyword analysis",
        tags: fallback.keywords.slice(0, 5)
      }
    }

    // Map categories to departments
    const departmentMapping: Record<string, string> = {
      "POLICY": "operations",
      "SAFETY_RPT": "safety",
      "TECH_SPEC": "maintenance",
      "FIN_RPT": "finance",
      "COMPLIANCE": "operations",
      "EMP_REC": "hr",
      "MAINT_LOG": "maintenance",
      "CORRESP": "operations"
    }

    // Assign deadline based on priority and category
    const getDeadlineDays = (priority: string, category: string): number => {
      const priorityDays = {
        "urgent": 1,
        "high": 3,
        "medium": 7,
        "low": 14
      }
      
      // Safety and compliance documents get shorter deadlines
      if (category === "SAFETY_RPT" || category === "COMPLIANCE") {
        return Math.min(priorityDays[priority as keyof typeof priorityDays] || 7, 3)
      }
      
      return priorityDays[priority as keyof typeof priorityDays] || 7
    }

    const suggestedDepartment = departmentMapping[classificationResult.suggested_category] || 
                                classificationResult.suggested_department || 
                                "operations"
    
    const priority = classificationResult.priority_suggestion || "medium"
    const deadlineDays = getDeadlineDays(priority, classificationResult.suggested_category)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + deadlineDays)

    // Prepare comprehensive response (supporting both old and new format)
    const processedData = {
      // New format
      summary: summaryResult.summary,
      malayalam_summary: summaryResult.malayalam_summary,
      keywords: summaryResult.keywords,
      malayalam_keywords: summaryResult.malayalam_keywords,
      sentiment: summaryResult.sentiment,
      urgency_score: summaryResult.urgency_score,
      key_points: summaryResult.key_points,
      
      category: classificationResult.suggested_category,
      category_confidence: classificationResult.confidence_score,
      classification_reasoning: classificationResult.reasoning,
      tags: classificationResult.tags,
      
      suggested_department: suggestedDepartment,
      suggested_priority: priority,
      suggested_due_date: dueDate.toISOString(),
      deadline_days: deadlineDays,
      
      // Old format (for backwards compatibility)
      summary_en: summaryResult.summary,
      summary_ml: summaryResult.malayalam_summary || summaryResult.summary,
      department: suggestedDepartment.charAt(0).toUpperCase() + suggestedDepartment.slice(1),
      priority: priority,
      is_actionable: priority === "urgent" || priority === "high",
      deadline: dueDate.toISOString().split('T')[0],
      confidence_score: classificationResult.confidence_score,
      
      processing_metadata: {
        processed_at: new Date().toISOString(),
        language,
        document_id,
        processing_steps: [
          "text_extraction",
          "summarization",
          "keyword_extraction",
          "classification",
          "department_routing",
          "deadline_assignment"
        ]
      }
    }

    return NextResponse.json({
      success: true,
      data: processedData,
      ...processedData,
      message: language === "ml" 
        ? "രേഖ വിജയകരമായി പ്രോസസ്സ് ചെയ്തു" 
        : "Document processed successfully"
    })
  } catch (error) {
    console.error("Error in document processing:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Document processing failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
