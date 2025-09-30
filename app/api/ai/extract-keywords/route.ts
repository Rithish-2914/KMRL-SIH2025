import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being'])
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word: string) => word.length > 3 && !commonWords.has(word))
    
    const wordCounts = words.reduce((acc: Record<string, number>, word: string) => {
      acc[word] = (acc[word] || 0) + 1
      return acc
    }, {})
    
    const keywords = Object.entries(wordCounts)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 10)
      .map(([word]) => word)

    return NextResponse.json({ keywords })
  } catch (error) {
    console.error("Keyword extraction error:", error)
    return NextResponse.json(
      { error: "Failed to extract keywords" },
      { status: 500 }
    )
  }
}
