import { type NextRequest, NextResponse } from "next/server"
import { aiServices } from "@/lib/ai-services"
import { db } from "@/lib/db"

// Fallback chat responses when AI is unavailable
function getFallbackResponse(query: string, language: "en" | "ml", relevantDocs: any[] = []) {
  const lowerQuery = query.toLowerCase()

  // If we have relevant documents, provide specific information
  if (relevantDocs.length > 0) {
    const doc = relevantDocs[0]
    const title = language === "ml" && doc.malayalam_title ? doc.malayalam_title : doc.title
    const summary = doc.description || "No summary available"
    
    let response = `Found document: "${title}".`
    
    if (doc.status) {
      response += ` Status: ${doc.status}.`
    }
    if (doc.priority) {
      response += ` Priority: ${doc.priority}.`
    }
    if (doc.due_date) {
      const dueDate = new Date(doc.due_date).toLocaleDateString()
      response += ` Deadline: ${dueDate}.`
    }
    if (doc.department_id) {
      response += ` Assigned to department.`
    }
    if (summary) {
      response += ` ${summary}`
    }
    
    return response
  }

  if (lowerQuery.includes("safety") || lowerQuery.includes("സുരക്ഷ")) {
    return language === "ml"
      ? "സുരക്ഷാ പ്രോട്ടോക്കോളുകൾ KMRL-ൽ വളരെ പ്രധാനമാണ്. എല്ലാ സുരക്ഷാ സംഭവങ്ങളും ഉടൻ റിപ്പോർട്ട് ചെയ്യണം."
      : "Safety protocols are critical at KMRL. All safety incidents must be reported immediately to the safety department."
  }

  if (lowerQuery.includes("deadline") || lowerQuery.includes("due")) {
    return language === "ml"
      ? "രേഖകളുടെ ഡെഡ്‌ലൈനുകൾ മുൻഗണനയുടെ അടിസ്ഥാനത്തിൽ നിശ്ചയിക്കുന്നു. അടിയന്തിര: 1-3 ദിവസം, ഉയർന്ന: 3-7 ദിവസം."
      : "Document deadlines are assigned based on priority. Urgent: 1-3 days, High: 3-7 days, Medium: 7-14 days."
  }

  if (lowerQuery.includes("upload") || lowerQuery.includes("submit")) {
    return language === "ml"
      ? "അപ്‌ലോഡ് പേജിലൂടെ ഒന്നിലധികം ഫയലുകൾ സമർപ്പിക്കാം. AI യാന്ത്രികമായി പ്രോസസ്സ് ചെയ്യുകയും വകുപ്പുകളിലേക്ക് റൂട്ട് ചെയ്യുകയും ചെയ്യും."
      : "Upload multiple files through the Upload page. AI will automatically process and route them to the appropriate departments."
  }

  if (lowerQuery.includes("department")) {
    return language === "ml"
      ? "രേഖകൾ സ്വയമേവ വിവിധ വകുപ്പുകളിലേക്ക് റൂട്ട് ചെയ്യുന്നു: Safety, HR, Finance, Maintenance, Operations."
      : "Documents are automatically routed to departments: Safety, HR, Finance, Maintenance, and Operations based on content."
  }

  return language === "ml"
    ? "KMRL രേഖ സഹായകനാണ് ഞാൻ. രേഖകൾ, നയങ്ങൾ, നടപടിക്രമങ്ങൾ എന്നിവയെക്കുറിച്ച് സഹായിക്കാൻ കഴിയും."
    : "I'm the KMRL Document Assistant. I can help with documents, policies, procedures, uploads, and departmental routing."
}

// POST /api/ai/chat - AI chatbot for document Q&A with real database integration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, language = "en", document_ids = [] } = body

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })
    }

    // Get relevant document context from real database
    let documentContext: string[] = []
    let sources: any[] = []
    let relevantDocs: any[] = []

    if (document_ids.length > 0) {
      // Fetch specific documents
      for (const docId of document_ids) {
        const document = await db.getDocumentById(docId)
        if (document) {
          const analysis = await db.getDocumentAnalysis(docId)
          const routes = await db.getDocumentRoutes(docId)
          
          const title = language === "ml" && document.malayalam_title ? document.malayalam_title : document.title
          const summary = analysis?.summary || document.description || ""
          const malayalamSummary = analysis?.malayalam_summary || ""
          
          const deptInfo = routes.length > 0 ? `Routed to department. ` : ""
          const deadlineInfo = document.due_date ? `Deadline: ${new Date(document.due_date).toLocaleDateString()}. ` : ""
          const priorityInfo = document.priority ? `Priority: ${document.priority}. ` : ""
          
          const contextText = `Document: ${title}\n${deptInfo}${deadlineInfo}${priorityInfo}${language === "ml" && malayalamSummary ? malayalamSummary : summary}`
          documentContext.push(contextText)
          
          relevantDocs.push(document)
          sources.push({
            document_id: document.id,
            title: title,
            relevance_score: 1.0,
            excerpt: summary.substring(0, 150) + "..."
          })
        }
      }
    } else {
      // Search for relevant documents based on query keywords
      const searchKeywords = query.toLowerCase().split(' ').filter(word => word.length > 3)
      const allDocs = await db.getDocuments({ limit: 50 })
      
      // Simple keyword matching for document search
      const scoredDocs = allDocs.map(doc => {
        const docText = `${doc.title} ${doc.description || ''}`.toLowerCase()
        const score = searchKeywords.reduce((acc, keyword) => {
          return acc + (docText.includes(keyword) ? 1 : 0)
        }, 0)
        return { doc, score }
      }).filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
      
      for (const { doc } of scoredDocs) {
        const analysis = await db.getDocumentAnalysis(doc.id)
        const routes = await db.getDocumentRoutes(doc.id)
        
        const title = language === "ml" && doc.malayalam_title ? doc.malayalam_title : doc.title
        const summary = analysis?.summary || doc.description || ""
        const malayalamSummary = analysis?.malayalam_summary || ""
        
        const deptInfo = routes.length > 0 ? `Routed to department. ` : ""
        const deadlineInfo = doc.due_date ? `Deadline: ${new Date(doc.due_date).toLocaleDateString()}. ` : ""
        const priorityInfo = doc.priority ? `Priority: ${doc.priority}. ` : ""
        
        const contextText = `Document: ${title}\n${deptInfo}${deadlineInfo}${priorityInfo}${language === "ml" && malayalamSummary ? malayalamSummary : summary}`
        documentContext.push(contextText)
        
        relevantDocs.push(doc)
        sources.push({
          document_id: doc.id,
          title: title,
          relevance_score: 0.8,
          excerpt: summary.substring(0, 150) + "..."
        })
      }
    }

    let chatResponse
    try {
      chatResponse = await aiServices.chatWithDocuments(query, documentContext, language)
      chatResponse.sources = sources
    } catch (aiError) {
      console.log("AI chat unavailable, using fallback responses with real document data")
      const fallbackResponse = getFallbackResponse(query, language, relevantDocs)
      chatResponse = {
        response: fallbackResponse,
        malayalam_response: language === "ml" ? fallbackResponse : undefined,
        sources: sources,
        confidence_score: 0.7
      }
    }

    return NextResponse.json({
      success: true,
      data: chatResponse,
    })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json({ 
      success: false, 
      error: "AI chat failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
