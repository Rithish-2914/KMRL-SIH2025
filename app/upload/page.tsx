"use client"

import { useState, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Camera, Mail, Share2, CheckCircle, X, Loader2 } from "lucide-react"

interface UploadedFile {
  file: File
  progress: number
  status: "pending" | "uploading" | "processing" | "complete" | "error"
  result?: {
    summary: string
    department: string
    priority: string
    deadline: string
    keywords: string[]
  }
  error?: string
}

export default function UploadPage() {
  const [language, setLanguage] = useState<"en" | "ml">("en")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelection = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      file,
      progress: 0,
      status: "pending"
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const processFiles = async () => {
    if (files.length === 0) return

    setIsProcessing(true)

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i]
      
      if (fileData.status !== "pending") continue

      try {
        // Update status to uploading
        setFiles((prev) => {
          const updated = [...prev]
          updated[i].status = "uploading"
          updated[i].progress = 10
          return updated
        })

        // Upload file
        const formData = new FormData()
        formData.append("files", fileData.file)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) throw new Error("Upload failed")

        const uploadData = await uploadResponse.json()
        const uploadedFile = uploadData.data.files[0]

        setFiles((prev) => {
          const updated = [...prev]
          updated[i].progress = 50
          updated[i].status = "processing"
          return updated
        })

        // Read file content for AI processing
        let textContent = ""
        if (fileData.file.type.includes("text")) {
          textContent = await fileData.file.text()
        } else {
          // For non-text files, use filename and type as context
          textContent = `Document type: ${fileData.file.type}, Name: ${fileData.file.name}`
        }

        // Process with AI
        const processResponse = await fetch("/api/ai/process-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: textContent,
            title: fileData.file.name,
            fileType: fileData.file.type,
            language,
          }),
        })

        if (!processResponse.ok) throw new Error("AI processing failed")

        const processData = await processResponse.json()

        setFiles((prev) => {
          const updated = [...prev]
          updated[i].progress = 100
          updated[i].status = "complete"
          updated[i].result = {
            summary: language === "ml" ? processData.summary_ml : processData.summary_en,
            department: processData.department,
            priority: processData.priority,
            deadline: processData.deadline,
            keywords: processData.keywords,
          }
          return updated
        })
      } catch (error) {
        console.error("Error processing file:", error)
        setFiles((prev) => {
          const updated = [...prev]
          updated[i].status = "error"
          updated[i].error = error instanceof Error ? error.message : "Processing failed"
          return updated
        })
      }
    }

    setIsProcessing(false)
  }

  const uploadMethods = {
    en: [
      { title: "File Upload", description: "Upload documents from your device", icon: Upload, color: "bg-blue-500" },
      { title: "Camera Capture", description: "Take photos of documents", icon: Camera, color: "bg-green-500" },
      { title: "Email Integration", description: "Import from email attachments", icon: Mail, color: "bg-orange-500" },
      { title: "SharePoint", description: "Connect to SharePoint documents", icon: Share2, color: "bg-purple-500" },
    ],
    ml: [
      {
        title: "ഫയൽ അപ്‌ലോഡ്",
        description: "നിങ്ങളുടെ ഉപകരണത്തിൽ നിന്ന് രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക",
        icon: Upload,
        color: "bg-blue-500",
      },
      { title: "ക്യാമറ ക്യാപ്ചർ", description: "രേഖകളുടെ ഫോട്ടോകൾ എടുക്കുക", icon: Camera, color: "bg-green-500" },
      {
        title: "ഇമെയിൽ ഇന്റഗ്രേഷൻ",
        description: "ഇമെയിൽ അറ്റാച്ച്മെന്റുകളിൽ നിന്ന് ഇമ്പോർട്ട് ചെയ്യുക",
        icon: Mail,
        color: "bg-orange-500",
      },
      { title: "ഷെയർപോയിന്റ്", description: "ഷെയർപോയിന്റ് രേഖകളിലേക്ക് കണക്റ്റ് ചെയ്യുക", icon: Share2, color: "bg-purple-500" },
    ],
  }

  return (
    <DashboardLayout language={language} onLanguageChange={setLanguage}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{language === "en" ? "Upload Documents" : "രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക"}</h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? "Upload multiple documents for automatic AI processing, classification, and routing"
              : "യാന്ത്രിക AI പ്രോസസ്സിംഗ്, വർഗ്ഗീകരണം, റൂട്ടിംഗ് എന്നിവയ്ക്കായി ഒന്നിലധികം രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക"}
          </p>
        </div>

        {/* Upload Methods */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {uploadMethods[language].map((method, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <method.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{method.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* File Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Upload Documents" : "രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Drop Zone */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {language === "en"
                  ? "Drop multiple files here or click to browse"
                  : "ഒന്നിലധികം ഫയലുകൾ ഇവിടെ ഡ്രോപ്പ് ചെയ്യുക അല്ലെങ്കിൽ ബ്രൗസ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === "en"
                  ? "Supports PDF, DOC, DOCX, TXT, JPG, PNG files up to 10MB each"
                  : "10MB വരെയുള്ള PDF, DOC, DOCX, TXT, JPG, PNG ഫയലുകൾ പിന്തുണയ്ക്കുന്നു"}
              </p>
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                onChange={(e) => handleFileSelection(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer bg-transparent">
                  <Upload className="mr-2 h-4 w-4" />
                  {language === "en" ? "Choose Files" : "ഫയലുകൾ തിരഞ്ഞെടുക്കുക"}
                </Button>
              </Label>
            </div>

            {/* Selected Files List */}
            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {language === "en" ? `Selected Files (${files.length})` : `തിരഞ്ഞെടുത്ത ഫയലുകൾ (${files.length})`}
                  </h3>
                  {!isProcessing && (
                    <Button onClick={() => setFiles([])} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      {language === "en" ? "Clear All" : "എല്ലാം മായ്ക്കുക"}
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {files.map((fileData, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm">{fileData.file.name}</span>
                                {fileData.status === "complete" && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {fileData.status === "processing" && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {(fileData.file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                            {fileData.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                disabled={isProcessing}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {fileData.status !== "pending" && (
                            <div className="space-y-2">
                              <Progress value={fileData.progress} className="h-2" />
                              <p className="text-xs text-muted-foreground">
                                {fileData.status === "uploading" && (language === "en" ? "Uploading..." : "അപ്‌ലോഡ് ചെയ്യുന്നു...")}
                                {fileData.status === "processing" && (language === "en" ? "AI Processing..." : "AI പ്രോസസ്സിംഗ്...")}
                                {fileData.status === "complete" && (language === "en" ? "Complete!" : "പൂർത്തിയായി!")}
                                {fileData.status === "error" && (language === "en" ? `Error: ${fileData.error}` : `പിശക്: ${fileData.error}`)}
                              </p>
                            </div>
                          )}

                          {fileData.result && (
                            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                              <div className="flex gap-2 flex-wrap">
                                <Badge variant="outline">{fileData.result.department}</Badge>
                                <Badge variant={
                                  fileData.result.priority === "urgent" ? "destructive" :
                                  fileData.result.priority === "high" ? "default" : "secondary"
                                }>
                                  {fileData.result.priority}
                                </Badge>
                                <Badge variant="secondary">Due: {fileData.result.deadline}</Badge>
                              </div>
                              <p className="text-sm">{fileData.result.summary}</p>
                              {fileData.result.keywords && fileData.result.keywords.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                  {fileData.result.keywords.map((keyword, i) => (
                                    <span key={i} className="text-xs bg-background px-2 py-1 rounded">
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    onClick={processFiles}
                    disabled={isProcessing || files.every(f => f.status !== "pending")}
                  >
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {language === "en" ? "Process All Documents" : "എല്ലാ രേഖകളും പ്രോസസ്സ് ചെയ്യുക"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
