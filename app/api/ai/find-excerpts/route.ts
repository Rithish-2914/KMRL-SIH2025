import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { text, summary } = await req.json()

    const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 20)
    
    const summaryWords = new Set(
      summary.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((w: string) => w.length > 3)
    )
    
    const excerpts = sentences
      .map((sentence: string, index: number) => {
        const sentenceWords = new Set(
          sentence.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
        )
        
        const overlap = Array.from(summaryWords)
          .filter((word: string) => sentenceWords.has(word))
          .length
        
        const confidence = overlap / Math.max(summaryWords.size, 1)
        
        return {
          text: sentence.trim(),
          confidence: Math.min(confidence * 1.5, 0.95),
          page: Math.floor(index / 10) + 1,
          relevance: confidence > 0.3 ? "high" : confidence > 0.15 ? "medium" : "low"
        }
      })
      .filter((e: any) => e.confidence > 0.2)
      .sort((a: any, b: any) => b.confidence - a.confidence)
      .slice(0, 5)

    return NextResponse.json({ excerpts })
  } catch (error) {
    console.error("Excerpt finding error:", error)
    return NextResponse.json(
      { error: "Failed to find excerpts" },
      { status: 500 }
    )
  }
}
