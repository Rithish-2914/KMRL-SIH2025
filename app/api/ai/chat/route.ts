import { type NextRequest, NextResponse } from "next/server"
import { aiServices } from "@/lib/ai-services"
import { DatabaseService } from "@/lib/database"

// Fallback chat responses when AI is unavailable
function getFallbackResponse(query: string, language: "en" | "ml") {
  const lowerQuery = query.toLowerCase()

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

// POST /api/ai/chat - AI chatbot for document Q&A
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, language = "en", document_ids = [] } = body

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })
    }

    // Get relevant document context
    let documentContext: string[] = []

    if (document_ids.length > 0) {
      // Fetch specific documents
      for (const docId of document_ids) {
        const document = await DatabaseService.getDocumentById(docId)
        if (document) {
          const title = language === "ml" && document.malayalam_title ? document.malayalam_title : document.title
          const description =
            language === "ml" && document.malayalam_description
              ? document.malayalam_description
              : document.description || ""

          documentContext.push(`${title}\n${description}`)
        }
      }
    } else {
      // Search for relevant documents based on query
      const searchResults = await DatabaseService.searchDocuments(query, language)
      documentContext = searchResults.slice(0, 3).map((doc) => {
        const title = language === "ml" && doc.malayalam_title ? doc.malayalam_title : doc.title
        const description =
          language === "ml" && doc.malayalam_description ? doc.malayalam_description : doc.description || ""

        return `${title}\n${description}`
      })
    }

    let chatResponse
    try {
      chatResponse = await aiServices.chatWithDocuments(query, documentContext, language)
    } catch (aiError) {
      console.log("AI chat unavailable, using fallback responses")
      const fallbackResponse = getFallbackResponse(query, language)
      chatResponse = {
        response: fallbackResponse,
        malayalam_response: language === "ml" ? fallbackResponse : undefined,
        sources: [],
        confidence_score: 0.7
      }
    }

    return NextResponse.json({
      success: true,
      data: chatResponse,
    })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json({ success: false, error: "AI chat failed" }, { status: 500 })
  }
}
