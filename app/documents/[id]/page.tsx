"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout-new"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, Download, Share2, Clock, User, Tag, TrendingUp, 
  CheckCircle, AlertTriangle, Eye, History, MessageSquare 
} from "lucide-react"

export default function DocumentDetailPage() {
  const params = useParams()
  const [language, setLanguage] = useState<"en" | "ml">("en")
  const [selectedTab, setSelectedTab] = useState("document")

  const handleDownload = () => {
    window.open(document.file_path, "_blank")
  }

  const handleViewOriginal = () => {
    window.open(document.file_path, "_blank")
  }

  const handleShowSource = (page: number) => {
    setSelectedTab("document")
  }

  const document = {
    id: params.id,
    title: "Safety Protocol Update - Platform Operations",
    malayalam_title: "സുരക്ഷാ പ്രോട്ടോക്കോൾ അപ്ഡേറ്റ് - പ്ലാറ്റ്ഫോം പ്രവർത്തനങ്ങൾ",
    description: "Updated safety protocols for platform operations during peak hours",
    file_name: "safety-protocol-001.pdf",
    file_path: "/documents/safety-protocol-001.pdf",
    status: "approved",
    priority: "high",
    category: "Safety",
    department: "Operations",
    source_type: "upload",
    uploaded_by: "Rajesh Kumar",
    uploaded_at: "2024-01-15T10:30:00Z",
    processed_at: "2024-01-15T10:32:45Z",
    language: "en",
    file_size: "2.5 MB",
  }

  const aiSummary = {
    summary: "This document outlines updated safety protocols for platform operations, focusing on crowd management during peak hours, emergency evacuation procedures, and staff coordination protocols. Key changes include new signage requirements, enhanced CCTV monitoring, and updated communication procedures.",
    malayalam_summary: "ഈ രേഖ പ്ലാറ്റ്ഫോം പ്രവർത്തനങ്ങൾക്കായുള്ള അപ്ഡേറ്റ് ചെയ്ത സുരക്ഷാ പ്രോട്ടോക്കോളുകൾ വിശദീകരിക്കുന്നു",
    confidence_score: 0.94,
    keywords: ["safety", "platform operations", "crowd management", "emergency procedures"],
    urgency_score: 0.82,
    sentiment: "neutral",
    key_points: [
      "Enhanced crowd management protocols for peak hours",
      "New emergency evacuation procedures implemented",
      "Updated staff coordination requirements",
      "Improved signage and visual indicators",
      "CCTV monitoring enhancement"
    ],
  }

  const highlightedExcerpts = [
    {
      id: 1,
      text: "All platform staff must maintain visual contact with designated safety zones during peak hours (7-9 AM and 5-7 PM)",
      page: 3,
      line: 15,
      confidence: 0.96,
      category: "Safety Protocol"
    },
    {
      id: 2,
      text: "Emergency evacuation must be initiated within 90 seconds of alarm activation",
      page: 5,
      line: 22,
      confidence: 0.94,
      category: "Emergency Procedure"
    },
    {
      id: 3,
      text: "CCTV monitoring stations must be staffed 24/7 with at least two operators per shift",
      page: 7,
      line: 8,
      confidence: 0.91,
      category: "Monitoring Requirement"
    },
  ]

  const versionHistory = [
    {
      version: "2.1",
      date: "2024-01-15T10:30:00Z",
      author: "Rajesh Kumar",
      changes: "Updated emergency procedures and CCTV requirements",
      status: "current"
    },
    {
      version: "2.0",
      date: "2024-01-01T14:20:00Z",
      author: "Safety Officer",
      changes: "Major revision - added crowd management protocols",
      status: "archived"
    },
    {
      version: "1.5",
      date: "2023-11-15T09:15:00Z",
      author: "Operations Manager",
      changes: "Minor updates to signage requirements",
      status: "archived"
    },
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
        {/* Document Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{language === "en" ? document.title : document.malayalam_title}</h1>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(document.status)} variant="secondary">
                {document.status}
              </Badge>
              <Badge className={getPriorityColor(document.priority)} variant="secondary">
                {document.priority}
              </Badge>
              <Badge variant="outline">{document.category}</Badge>
              <Badge variant="outline">{document.department}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              {language === "en" ? "Download" : "ഡൗൺലോഡ്"}
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              {language === "en" ? "Share" : "പങ്കിടുക"}
            </Button>
            <Button onClick={handleViewOriginal}>
              <Eye className="mr-2 h-4 w-4" />
              {language === "en" ? "View Original" : "യഥാർത്ഥം കാണുക"}
            </Button>
          </div>
        </div>

        {/* AI Summary Card */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {language === "en" ? "AI-Generated Summary" : "AI സംഗ്രഹം"}
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">{language === "en" ? "Confidence:" : "ആത്മവിശ്വാസം:"} </span>
                  <span className="font-medium">{(aiSummary.confidence_score * 100).toFixed(0)}%</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">{language === "en" ? "Urgency:" : "അത്യാവശ്യത:"} </span>
                  <span className="font-medium">{(aiSummary.urgency_score * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-pretty">
              {language === "en" ? aiSummary.summary : aiSummary.malayalam_summary}
            </p>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">{language === "en" ? "Key Points:" : "പ്രധാന പോയിന്റുകൾ:"}</h4>
              <ul className="space-y-1">
                {aiSummary.key_points.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiSummary.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="document">{language === "en" ? "Document" : "രേഖ"}</TabsTrigger>
            <TabsTrigger value="excerpts">{language === "en" ? "Highlighted Excerpts" : "പ്രധാന ഭാഗങ്ങൾ"}</TabsTrigger>
            <TabsTrigger value="metadata">{language === "en" ? "Metadata" : "മെറ്റാഡാറ്റ"}</TabsTrigger>
            <TabsTrigger value="history">{language === "en" ? "Version History" : "പതിപ്പ് ചരിത്രം"}</TabsTrigger>
          </TabsList>

          {/* Document Viewer */}
          <TabsContent value="document">
            <Card>
              <CardContent className="p-6">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 min-h-[600px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      {language === "en" 
                        ? "PDF document viewer would be embedded here" 
                        : "PDF രേഖ കാഴ്ചക്കാരൻ ഇവിടെ ഉൾച്ചേർക്കും"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {document.file_name} • {document.file_size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Highlighted Excerpts */}
          <TabsContent value="excerpts">
            <div className="space-y-4">
              {highlightedExcerpts.map((excerpt) => (
                <Card key={excerpt.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline">{excerpt.category}</Badge>
                        <div className="text-sm text-muted-foreground">
                          {language === "en" ? "Confidence:" : "ആത്മവിശ്വാസം:"} {(excerpt.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                      <p className="text-pretty bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border-l-4 border-yellow-400">
                        "{excerpt.text}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {language === "en" ? "Page" : "പേജ്"} {excerpt.page}, {language === "en" ? "Line" : "ലൈൻ"} {excerpt.line}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleShowSource(excerpt.page)}>
                          {language === "en" ? "Show Source" : "ഉറവിടം കാണിക്കുക"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Metadata */}
          <TabsContent value="metadata">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {language === "en" ? "Uploaded By" : "അപ്‌ലോഡ് ചെയ്തത്"}
                      </h4>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{document.uploaded_by}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {language === "en" ? "Upload Date" : "അപ്‌ലോഡ് തീയതി"}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(document.uploaded_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {language === "en" ? "Processed Date" : "പ്രോസസ്സ് ചെയ്ത തീയതി"}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(document.processed_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {language === "en" ? "Source Type" : "ഉറവിട തരം"}
                      </h4>
                      <Badge variant="outline">{document.source_type}</Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {language === "en" ? "Language" : "ഭാഷ"}
                      </h4>
                      <Badge variant="outline">{document.language === "en" ? "English" : "Malayalam"}</Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {language === "en" ? "File Size" : "ഫയൽ വലുപ്പം"}
                      </h4>
                      <span>{document.file_size}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Version History */}
          <TabsContent value="history">
            <div className="space-y-4">
              {versionHistory.map((version, index) => (
                <Card key={version.version} className={index === 0 ? "border-l-4 border-l-primary" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4" />
                          <h4 className="font-semibold">Version {version.version}</h4>
                          {version.status === "current" && (
                            <Badge variant="default" className="text-xs">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{version.changes}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{version.author}</span>
                          <span>•</span>
                          <span>{new Date(version.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {version.status === "archived" && (
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          {language === "en" ? "View" : "കാണുക"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Actions" : "പ്രവർത്തനങ്ങൾ"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                {language === "en" ? "Acknowledge" : "അംഗീകരിക്കുക"}
              </Button>
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" />
                {language === "en" ? "Assign Task" : "ടാസ്ക് അസൈൻ ചെയ്യുക"}
              </Button>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                {language === "en" ? "Add Comment" : "അഭിപ്രായം ചേർക്കുക"}
              </Button>
              <Button variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {language === "en" ? "Report Issue" : "പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക"}
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
