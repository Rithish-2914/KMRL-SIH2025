"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Camera, Mail, Share2, CheckCircle, Link as LinkIcon, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useDocuments } from "@/contexts/document-context"
import { processDocumentWithAI } from "@/lib/ai-document-processor"
import { useAuth } from "@/contexts/auth-context"

export default function UploadNewPage() {
  const { language, t } = useLanguage()
  const { addDocument } = useDocuments()
  const { user } = useAuth()
  const router = useRouter()
  
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadMethod, setUploadMethod] = useState<"file" | "url" | "email">("file")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    department: "",
    url: "",
    email: "",
  })

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
  }, [])

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const file = files[0]
      
      setUploadProgress(20)

      const reader = new FileReader()
      reader.onload = async (e) => {
        const content = e.target?.result as string
        
        setUploadProgress(40)

        const aiResult = await processDocumentWithAI(
          file.name,
          content.substring(0, 5000),
          file.type
        )
        
        setUploadProgress(70)

        const newDoc = await addDocument({
          title: formData.title || file.name,
          description: formData.description || aiResult.summary_en,
          malayalam_description: aiResult.summary_ml,
          file_path: URL.createObjectURL(file),
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          language: "both",
          source_type: "upload",
          uploaded_by: user?.id || "current_user",
          status: "pending",
          priority: aiResult.priority,
          department: aiResult.department,
          is_actionable: aiResult.is_actionable,
          deadline: aiResult.deadline,
          ai_summary: aiResult.summary_en,
          ai_summary_ml: aiResult.summary_ml,
          keywords: aiResult.keywords,
          confidence_score: aiResult.confidence_score,
        })

        setUploadProgress(100)
        setUploadComplete(true)

        setTimeout(() => {
          router.push(`/documents/${newDoc.id}`)
        }, 1500)
      }

      if (file.type.startsWith("text/") || file.name.endsWith(".txt")) {
        reader.readAsText(file)
      } else {
        reader.readAsDataURL(file)
      }
    } catch (err) {
      setError("Upload failed. Please try again.")
      setIsUploading(false)
    }
  }

  const handleUrlUpload = async () => {
    if (!formData.url) {
      setError("Please enter a valid URL")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      setUploadProgress(30)

      const aiResult = await processDocumentWithAI(
        formData.url.split("/").pop() || "document",
        `Document from SharePoint/Maximo: ${formData.url}`,
        "application/pdf"
      )

      setUploadProgress(70)

      const newDoc = await addDocument({
        title: formData.title || `Document from ${formData.url.includes("sharepoint") ? "SharePoint" : "Maximo"}`,
        description: formData.description || aiResult.summary_en,
        malayalam_description: aiResult.summary_ml,
        file_path: formData.url,
        file_name: formData.url.split("/").pop() || "document.pdf",
        file_type: "application/pdf",
        file_size: 0,
        language: "both",
        source_type: "sharepoint",
        uploaded_by: user?.id || "current_user",
        status: "pending",
        priority: aiResult.priority,
        department: aiResult.department,
        is_actionable: aiResult.is_actionable,
        deadline: aiResult.deadline,
        ai_summary: aiResult.summary_en,
        ai_summary_ml: aiResult.summary_ml,
        keywords: aiResult.keywords,
        confidence_score: aiResult.confidence_score,
      })

      setUploadProgress(100)
      setUploadComplete(true)

      setTimeout(() => {
        router.push(`/documents/${newDoc.id}`)
      }, 1500)
    } catch (err) {
      setError("URL upload failed. Please try again.")
      setIsUploading(false)
    }
  }

  const handleEmailIngestion = async () => {
    if (!formData.email) {
      setError("Please enter a valid email")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      setUploadProgress(30)

      const aiResult = await processDocumentWithAI(
        `Email from ${formData.email}`,
        `Email document ingested from: ${formData.email}`,
        "message/rfc822"
      )

      setUploadProgress(70)

      const newDoc = await addDocument({
        title: formData.title || `Email Document from ${formData.email}`,
        description: formData.description || aiResult.summary_en,
        malayalam_description: aiResult.summary_ml,
        file_path: `/emails/${Date.now()}.eml`,
        file_name: `email-${Date.now()}.eml`,
        file_type: "message/rfc822",
        file_size: 0,
        language: "both",
        source_type: "email",
        uploaded_by: user?.id || "current_user",
        status: "pending",
        priority: aiResult.priority,
        department: aiResult.department,
        is_actionable: aiResult.is_actionable,
        deadline: aiResult.deadline,
        ai_summary: aiResult.summary_en,
        ai_summary_ml: aiResult.summary_ml,
        keywords: aiResult.keywords,
        confidence_score: aiResult.confidence_score,
        metadata: { email: formData.email },
      })

      setUploadProgress(100)
      setUploadComplete(true)

      setTimeout(() => {
        router.push(`/documents/${newDoc.id}`)
      }, 1500)
    } catch (err) {
      setError("Email ingestion failed. Please try again.")
      setIsUploading(false)
    }
  }

  return (
    <DashboardLayout language={language} onLanguageChange={() => {}}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("upload.title")}</h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? "Upload and process documents from multiple sources with automatic AI analysis"
              : "യാന്ത്രിക AI വിശകലനത്തോടെ ഒന്നിലധികം ഉറവിടങ്ങളിൽ നിന്ന് രേഖകൾ അപ്‌ലോഡ് ചെയ്ത് പ്രോസസ്സ് ചെയ്യുക"}
          </p>
        </div>

        {/* Upload Method Selector */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card 
            className={`cursor-pointer transition-all ${uploadMethod === "file" ? "ring-2 ring-primary" : ""}`}
            onClick={() => setUploadMethod("file")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{language === "en" ? "File Upload" : "ഫയൽ അപ്‌ലോഡ്"}</h3>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Drag & drop or browse files" : "ഡ്രാഗ് & ഡ്രോപ്പ് അല്ലെങ്കിൽ ബ്രൗസ് ചെയ്യുക"}
              </p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${uploadMethod === "url" ? "ring-2 ring-primary" : ""}`}
            onClick={() => setUploadMethod("url")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{language === "en" ? "URL Upload" : "URL അപ്‌ലോഡ്"}</h3>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "SharePoint/Maximo links" : "SharePoint/Maximo ലിങ്കുകൾ"}
              </p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${uploadMethod === "email" ? "ring-2 ring-primary" : ""}`}
            onClick={() => setUploadMethod("email")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{language === "en" ? "Email Ingestion" : "ഇമെയിൽ ഇൻജസ്‌ഷൻ"}</h3>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Import from email" : "ഇമെയിലിൽ നിന്ന് ഇമ്പോർട്ട്"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {uploadMethod === "file" && (language === "en" ? "Upload Document" : "രേഖ അപ്‌ലോഡ് ചെയ്യുക")}
              {uploadMethod === "url" && (language === "en" ? "Upload from URL" : "URL-ൽ നിന്ന് അപ്‌ലോഡ് ചെയ്യുക")}
              {uploadMethod === "email" && (language === "en" ? "Email Ingestion" : "ഇമെയിൽ ഇൻജസ്‌ഷൻ")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Drop Zone */}
            {uploadMethod === "file" && (
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t("upload.drag_drop")}</h3>
                <p className="text-muted-foreground mb-4">
                  {language === "en"
                    ? "Supports PDF, DOC, DOCX, JPG, PNG files up to 10MB"
                    : "10MB വരെയുള്ള PDF, DOC, DOCX, JPG, PNG ഫയലുകൾ പിന്തുണയ്ക്കുന്നു"}
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      {language === "en" ? "Choose Files" : "ഫയലുകൾ തിരഞ്ഞെടുക്കുക"}
                    </span>
                  </Button>
                </Label>
              </div>
            )}

            {/* URL Input */}
            {uploadMethod === "url" && (
              <div className="space-y-2">
                <Label>{language === "en" ? "SharePoint/Maximo URL" : "SharePoint/Maximo URL"}</Label>
                <Input
                  placeholder={language === "en" ? "https://sharepoint.kmrl.gov.in/document.pdf" : "https://sharepoint.kmrl.gov.in/document.pdf"}
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                />
              </div>
            )}

            {/* Email Input */}
            {uploadMethod === "email" && (
              <div className="space-y-2">
                <Label>{language === "en" ? "Email Address" : "ഇമെയിൽ വിലാസം"}</Label>
                <Input
                  type="email"
                  placeholder={language === "en" ? "document@kmrl.gov.in" : "document@kmrl.gov.in"}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <p className="text-sm text-muted-foreground">
                  {language === "en" 
                    ? "Documents from this email will be automatically ingested"
                    : "ഈ ഇമെയിലിൽ നിന്നുള്ള രേഖകൾ യാന്ത്രികമായി ഇൻജസ്റ്റ് ചെയ്യപ്പെടും"}
                </p>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {language === "en" ? "Processing..." : "പ്രോസസ്സ് ചെയ്യുന്നു..."}
                  </span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {uploadProgress < 40 && (language === "en" ? "Uploading document..." : "രേഖ അപ്‌ലോഡ് ചെയ്യുന്നു...")}
                  {uploadProgress >= 40 && uploadProgress < 70 && (language === "en" ? "AI analyzing content..." : "AI ഉള്ളടക്കം വിശകലനം ചെയ്യുന്നു...")}
                  {uploadProgress >= 70 && (language === "en" ? "Finalizing..." : "അവസാനിപ്പിക്കുന്നു...")}
                </p>
              </div>
            )}

            {/* Upload Complete */}
            {uploadComplete && (
              <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  {t("upload.success")}
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">{error}</span>
              </div>
            )}

            {/* Document Metadata */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("doc.title")}</Label>
                <Input 
                  placeholder={language === "en" ? "Enter document title" : "രേഖയുടെ ശീർഷകം നൽകുക"}
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("doc.category")}</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "en" ? "Select category" : "വിഭാഗം തിരഞ്ഞെടുക്കുക"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safety">{language === "en" ? "Safety" : "സുരക്ഷ"}</SelectItem>
                    <SelectItem value="hr">{language === "en" ? "HR" : "HR"}</SelectItem>
                    <SelectItem value="engineering">{language === "en" ? "Engineering" : "എഞ്ചിനീയറിംഗ്"}</SelectItem>
                    <SelectItem value="regulatory">{language === "en" ? "Regulatory" : "നിയന്ത്രണം"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("doc.description")}</Label>
              <Textarea
                placeholder={language === "en" ? "Enter document description (optional)" : "രേഖയുടെ വിവരണം നൽകുക (ഓപ്ഷണൽ)"}
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                {language === "en" 
                  ? "Leave blank for automatic AI-generated summary"
                  : "യാന്ത്രിക AI-ജനറേറ്റഡ് സംഗ്രഹത്തിനായി ശൂന്യമാക്കുക"}
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={() => {
                  if (uploadMethod === "file" && fileInputRef.current) {
                    fileInputRef.current.click()
                  } else if (uploadMethod === "url") {
                    handleUrlUpload()
                  } else if (uploadMethod === "email") {
                    handleEmailIngestion()
                  }
                }}
                disabled={isUploading}
              >
                {t("upload.process")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
