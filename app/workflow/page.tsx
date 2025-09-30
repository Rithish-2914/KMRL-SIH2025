"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, CheckCircle, AlertTriangle, ArrowRight, FileText, MessageSquare } from "lucide-react"

export default function WorkflowPage() {
  const [language, setLanguage] = useState<"en" | "ml">("en")
  const [workflows, setWorkflows] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, overdue: 0, completed: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows')
      const data = await response.json()
      
      if (data.success) {
        setWorkflows(data.data.workflows)
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Error fetching workflows:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const translateStepName = (name: string) => {
    const translations: Record<string, string> = {
      'Document Upload': 'രേഖ അപ്‌ലോഡ്',
      'AI Classification': 'AI വർഗ്ഗീകരണം',
      'Department Review': 'വകുപ്പ് അവലോകനം',
      'Approval': 'അംഗീകാരം'
    }
    return language === "ml" && translations[name] ? translations[name] : name
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      en: { pending: "Pending", in_progress: "In Progress", completed: "Completed" },
      ml: { pending: "തീർപ്പാക്കാത്ത", in_progress: "പുരോഗതിയിൽ", completed: "പൂർത്തിയായി" },
    }
    return statusMap[language][status as keyof typeof statusMap.en] || status
  }

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <DashboardLayout language={language} onLanguageChange={setLanguage}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{language === "en" ? "Workflow Management" : "വർക്ക്ഫ്ലോ മാനേജ്മെന്റ്"}</h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? "Track document processing workflows and approvals"
              : "രേഖ പ്രോസസ്സിംഗ് വർക്ക്ഫ്ലോകളും അംഗീകാരങ്ങളും ട്രാക്ക് ചെയ്യുക"}
          </p>
        </div>

        {/* Workflow Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Active Workflows" : "സജീവ വർക്ക്ഫ്ലോകൾ"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Pending Approval" : "അംഗീകാരത്തിനായി"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.overdue}</p>
                  <p className="text-sm text-muted-foreground">{language === "en" ? "Overdue" : "കാലാവധി കഴിഞ്ഞത്"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">{language === "en" ? "Completed" : "പൂർത്തിയായി"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Workflows */}
        <div className="space-y-4">
          {isLoading && (
            <Card>
              <CardContent className="p-6 text-center">
                <p>{language === "en" ? "Loading workflows..." : "വർക്ക്ഫ്ലോകൾ ലോഡ് ചെയ്യുന്നു..."}</p>
              </CardContent>
            </Card>
          )}
          {!isLoading && workflows.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p>{language === "en" ? "No workflows found" : "വർക്ക്ഫ്ലോകൾ കണ്ടെത്തിയില്ല"}</p>
              </CardContent>
            </Card>
          )}
          {workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{language === "ml" && workflow.malayalam_title ? workflow.malayalam_title : workflow.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{workflow.document}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(workflow.priority)} variant="secondary">
                      {workflow.priority.charAt(0).toUpperCase() + workflow.priority.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(workflow.status)} variant="secondary">
                      {getStatusText(workflow.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{language === "en" ? "Progress" : "പുരോഗതി"}</span>
                    <span>{workflow.progress}%</span>
                  </div>
                  <Progress value={workflow.progress} className="h-2" />
                </div>

                {/* Workflow Steps */}
                <div className="space-y-3">
                  <h4 className="font-medium">{language === "en" ? "Workflow Steps" : "വർക്ക്ഫ്ലോ ഘട്ടങ്ങൾ"}</h4>
                  <div className="space-y-2">
                    {workflow.steps.map((step: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        {getStepStatusIcon(step.status)}
                        <span
                          className={`text-sm ${step.status === "completed" ? "text-muted-foreground line-through" : ""}`}
                        >
                          {translateStepName(step.name)}
                        </span>
                        {index < workflow.steps.length - 1 && step.status === "completed" && (
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignee and Due Date */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {workflow.assignee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{workflow.assignee}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {language === "en" ? "Due:" : "അവസാന തീയതി:"} {new Date(workflow.dueDate).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {language === "en" ? "Comment" : "അഭിപ്രായം"}
                      </Button>
                      <Button size="sm">{language === "en" ? "View Details" : "വിശദാംശങ്ങൾ കാണുക"}</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
