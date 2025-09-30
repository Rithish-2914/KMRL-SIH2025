"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout-new"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, FileText, User, Clock, Shield, Eye, Database } from "lucide-react"

export default function AuditLogsPage() {
  const [language, setLanguage] = useState<"en" | "ml">("en")
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  const auditLogs = [
    {
      id: "1",
      timestamp: "2024-01-15T10:32:45Z",
      user_id: "user-001",
      user_name: "Rajesh Kumar",
      user_role: "station_controller",
      action: "document_uploaded",
      document_id: "DOC-2024-001",
      document_title: "Safety Protocol Update",
      details: {
        source_type: "upload",
        file_name: "safety-protocol-001.pdf",
        file_size: "2.5 MB",
      },
      ip_address: "192.168.1.45",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      status: "success",
    },
    {
      id: "2",
      timestamp: "2024-01-15T10:33:12Z",
      user_id: "system",
      user_name: "AI Service",
      user_role: "system",
      action: "document_classified",
      document_id: "DOC-2024-001",
      document_title: "Safety Protocol Update",
      details: {
        model_id: "gpt-4o-mini",
        category: "Safety",
        confidence: 0.94,
        processing_time: "27.5s",
      },
      ip_address: "internal",
      status: "success",
    },
    {
      id: "3",
      timestamp: "2024-01-15T10:33:45Z",
      user_id: "system",
      user_name: "AI Service",
      user_role: "system",
      action: "summary_generated",
      document_id: "DOC-2024-001",
      document_title: "Safety Protocol Update",
      details: {
        model_id: "gpt-4o-mini",
        summary_length: 156,
        confidence: 0.94,
        key_points_count: 5,
      },
      ip_address: "internal",
      status: "success",
    },
    {
      id: "4",
      timestamp: "2024-01-15T10:35:20Z",
      user_id: "user-002",
      user_name: "Priya Menon",
      user_role: "engineer",
      action: "document_viewed",
      document_id: "DOC-2024-001",
      document_title: "Safety Protocol Update",
      details: {
        view_duration: "2m 45s",
        pages_viewed: 8,
      },
      ip_address: "192.168.1.67",
      user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      status: "success",
    },
    {
      id: "5",
      timestamp: "2024-01-15T10:40:15Z",
      user_id: "user-003",
      user_name: "Anand Nair",
      user_role: "finance",
      action: "document_approved",
      document_id: "DOC-2024-001",
      document_title: "Safety Protocol Update",
      details: {
        approval_comments: "Approved for implementation",
        previous_status: "pending",
        new_status: "approved",
      },
      ip_address: "192.168.1.89",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      status: "success",
    },
    {
      id: "6",
      timestamp: "2024-01-15T11:15:32Z",
      user_id: "user-004",
      user_name: "Lakshmi Pillai",
      user_role: "hr",
      action: "document_upload_failed",
      document_id: null,
      document_title: "Training Schedule Q1",
      details: {
        error: "File size exceeds 10MB limit",
        file_name: "training-schedule-large.xlsx",
        file_size: "12.3 MB",
      },
      ip_address: "192.168.1.102",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      status: "failed",
    },
    {
      id: "7",
      timestamp: "2024-01-15T11:30:45Z",
      user_id: "user-001",
      user_name: "Rajesh Kumar",
      user_role: "station_controller",
      action: "task_created",
      document_id: "DOC-2024-001",
      document_title: "Safety Protocol Update",
      details: {
        task_title: "Implement new safety protocols",
        assigned_to: "Safety Officer",
        due_date: "2024-01-20",
        priority: "high",
      },
      ip_address: "192.168.1.45",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      status: "success",
    },
  ]

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.document_title && log.document_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action.includes(actionFilter)
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && new Date(log.timestamp).toDateString() === new Date().toDateString()) ||
      (dateFilter === "week" &&
        new Date(log.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    return matchesSearch && matchesAction && matchesDate
  })

  const getActionColor = (action: string) => {
    if (action.includes("upload")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    if (action.includes("approved")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (action.includes("rejected")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    if (action.includes("viewed")) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    if (action.includes("failed")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    }
    return colors[status as keyof typeof colors] || colors.success
  }

  const getActionIcon = (action: string) => {
    if (action.includes("upload")) return <FileText className="h-4 w-4" />
    if (action.includes("viewed")) return <Eye className="h-4 w-4" />
    if (action.includes("classified") || action.includes("summary")) return <Database className="h-4 w-4" />
    if (action.includes("approved") || action.includes("rejected")) return <Shield className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const formatActionText = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{language === "en" ? "Audit Logs" : "ഓഡിറ്റ് ലോഗുകൾ"}</h1>
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "Immutable audit trail of all system activities" 
                  : "എല്ലാ സിസ്റ്റം പ്രവർത്തനങ്ങളുടെയും മാറ്റമില്ലാത്ത ഓഡിറ്റ് ട്രയൽ"}
              </p>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              {language === "en" ? "Export Logs" : "ലോഗുകൾ എക്സ്പോർട്ട് ചെയ്യുക"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{auditLogs.length}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Total Events" : "മൊത്തം സംഭവങ്ങൾ"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {auditLogs.filter((log) => log.status === "success").length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Successful" : "വിജയകരം"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {auditLogs.filter((log) => log.status === "failed").length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Failed" : "പരാജയപ്പെട്ടത്"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {new Set(auditLogs.map((log) => log.user_id)).size}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Unique Users" : "അദ്വിതീയ ഉപയോക്താക്കൾ"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Filter Logs" : "ലോഗുകൾ ഫിൽട്ടർ ചെയ്യുക"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === "en" ? "Search logs..." : "ലോഗുകൾ തിരയുക..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={language === "en" ? "Action" : "പ്രവർത്തനം"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === "en" ? "All Actions" : "എല്ലാ പ്രവർത്തനങ്ങളും"}</SelectItem>
                    <SelectItem value="upload">{language === "en" ? "Upload" : "അപ്‌ലോഡ്"}</SelectItem>
                    <SelectItem value="viewed">{language === "en" ? "Viewed" : "കണ്ടത്"}</SelectItem>
                    <SelectItem value="approved">{language === "en" ? "Approved" : "അംഗീകരിച്ചത്"}</SelectItem>
                    <SelectItem value="classified">{language === "en" ? "Classified" : "വർഗ്ഗീകരിച്ചത്"}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={language === "en" ? "Date" : "തീയതി"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === "en" ? "All Time" : "എല്ലാ സമയവും"}</SelectItem>
                    <SelectItem value="today">{language === "en" ? "Today" : "ഇന്ന്"}</SelectItem>
                    <SelectItem value="week">{language === "en" ? "Last 7 Days" : "കഴിഞ്ഞ 7 ദിവസം"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs List */}
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 bg-muted rounded-lg mt-1">
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getActionColor(log.action)} variant="secondary">
                            {formatActionText(log.action)}
                          </Badge>
                          <Badge className={getStatusColor(log.status)} variant="secondary">
                            {log.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium">
                            {log.user_name} {language === "en" ? "performed" : "നടപ്പിലാക്കി"}{" "}
                            {formatActionText(log.action).toLowerCase()}
                          </p>
                          {log.document_title && (
                            <p className="text-sm text-muted-foreground">
                              {language === "en" ? "Document:" : "രേഖ:"} {log.document_title}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{log.user_role}</span>
                          </div>
                          <span>IP: {log.ip_address}</span>
                        </div>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              {language === "en" ? "Show details" : "വിശദാംശങ്ങൾ കാണിക്കുക"}
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Database className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === "en" ? "No logs found" : "ലോഗുകൾ കണ്ടെത്തിയില്ല"}
                </h3>
                <p className="text-muted-foreground text-center">
                  {language === "en" ? "Try adjusting your filters" : "നിങ്ങളുടെ ഫിൽട്ടറുകൾ ക്രമീകരിക്കാൻ ശ്രമിക്കുക"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
