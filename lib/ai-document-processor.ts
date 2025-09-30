"use client"

export interface ProcessedDocument {
  summary_en: string
  summary_ml: string
  department: string
  priority: "low" | "medium" | "high" | "urgent"
  is_actionable: boolean
  deadline?: string
  keywords: string[]
  confidence_score: number
}

export interface AIExcerpt {
  text: string
  confidence: number
  page?: number
  relevance: string
}

export async function processDocumentWithAI(
  fileName: string,
  fileContent: string,
  fileType: string
): Promise<ProcessedDocument> {
  try {
    const response = await fetch("/api/ai/process-document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, fileContent, fileType }),
    })

    if (!response.ok) throw new Error("AI processing failed")
    
    return await response.json()
  } catch (error) {
    console.error("AI processing error:", error)
    return generateFallbackProcessing(fileName)
  }
}

export async function summarizeDocument(text: string, language: "en" | "ml"): Promise<string> {
  try {
    const response = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage: language }),
    })

    if (!response.ok) throw new Error("Summarization failed")
    
    const data = await response.json()
    return data.summary
  } catch (error) {
    console.error("Summarization error:", error)
    return language === "en" 
      ? "Summary generation failed. Please try again."
      : "സംഗ്രഹം സൃഷ്ടിക്കൽ പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക."
  }
}

export async function extractKeywords(text: string): Promise<string[]> {
  try {
    const response = await fetch("/api/ai/extract-keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) throw new Error("Keyword extraction failed")
    
    const data = await response.json()
    return data.keywords
  } catch (error) {
    console.error("Keyword extraction error:", error)
    return []
  }
}

export async function classifyDocument(text: string): Promise<{
  department: string
  confidence: number
  priority: string
}> {
  try {
    const response = await fetch("/api/ai/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) throw new Error("Classification failed")
    
    return await response.json()
  } catch (error) {
    console.error("Classification error:", error)
    return { department: "General", confidence: 0.5, priority: "medium" }
  }
}

export async function generateDeadline(text: string, priority: string): Promise<string | undefined> {
  const days = priority === "urgent" ? 3 : priority === "high" ? 7 : priority === "medium" ? 14 : 30
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + days)
  return deadline.toISOString().split('T')[0]
}

export async function findHighlightedExcerpts(
  text: string,
  summary: string
): Promise<AIExcerpt[]> {
  try {
    const response = await fetch("/api/ai/find-excerpts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, summary }),
    })

    if (!response.ok) throw new Error("Excerpt finding failed")
    
    const data = await response.json()
    return data.excerpts
  } catch (error) {
    console.error("Excerpt finding error:", error)
    return []
  }
}

function generateFallbackProcessing(fileName: string): ProcessedDocument {
  const lowerFileName = fileName.toLowerCase()
  
  let department = "General"
  let priority: "low" | "medium" | "high" | "urgent" = "medium"
  let is_actionable = false
  
  if (lowerFileName.includes("safety") || lowerFileName.includes("security")) {
    department = "Safety"
    priority = "high"
    is_actionable = true
  } else if (lowerFileName.includes("hr") || lowerFileName.includes("employee")) {
    department = "Human Resources"
    priority = "medium"
  } else if (lowerFileName.includes("finance") || lowerFileName.includes("budget")) {
    department = "Finance"
    priority = "high"
    is_actionable = true
  } else if (lowerFileName.includes("maintenance") || lowerFileName.includes("repair")) {
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
  
  if (lowerFileName.includes("urgent") || lowerFileName.includes("immediate")) {
    priority = "urgent"
    is_actionable = true
  }

  const deadline = new Date()
  const days = priority === "urgent" ? 3 : priority === "high" ? 7 : priority === "medium" ? 14 : 30
  deadline.setDate(deadline.getDate() + days)

  return {
    summary_en: `This document appears to be related to ${department} matters. Automatic processing determined it has ${priority} priority.`,
    summary_ml: `ഈ രേഖ ${department} കാര്യങ്ങളുമായി ബന്ധപ്പെട്ടതാണെന്ന് തോന്നുന്നു. ഓട്ടോമാറ്റിക് പ്രോസസ്സിംഗ് ${priority} മുൻഗണനയുള്ളതായി നിർണ്ണയിച്ചു.`,
    department,
    priority,
    is_actionable,
    deadline: is_actionable ? deadline.toISOString().split('T')[0] : undefined,
    keywords: [department.toLowerCase(), priority],
    confidence_score: 0.7,
  }
}

export async function ocrDocument(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/ai/ocr", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("OCR failed")
    
    const data = await response.json()
    return data.text
  } catch (error) {
    console.error("OCR error:", error)
    return ""
  }
}

export async function translateText(text: string, targetLang: "en" | "ml"): Promise<string> {
  try {
    const response = await fetch("/api/ai/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang }),
    })

    if (!response.ok) throw new Error("Translation failed")
    
    const data = await response.json()
    return data.translatedText
  } catch (error) {
    console.error("Translation error:", error)
    return text
  }
}
