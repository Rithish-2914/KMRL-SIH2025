"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout-new"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, CheckCircle, Clock, FileText, User, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TasksPage() {
  const tasks = [
    {
      id: 1,
      title: "Review Safety Protocol Update",
      malayalamTitle: "സുരക്ഷാ പ്രോട്ടോക്കോൾ അപ്ഡേറ്റ് അവലോകനം ചെയ്യുക",
      description: "Review and approve updated safety protocols for platform operations",
      documentId: "DOC-2024-001",
      assignedTo: "Rajesh Kumar",
      assignedBy: "Safety Officer",
      dueDate: "2024-02-15",
      priority: "high",
      status: "pending",
      createdFrom: "Safety Protocol Update - Platform Operations",
    },
    {
      id: 2,
      title: "Acknowledge Maintenance Report",
      malayalamTitle: "അറ്റകുറ്റപ്പണി റിപ്പോർട്ട് അംഗീകരിക്കുക",
      description: "Review monthly maintenance report and acknowledge completion",
      documentId: "DOC-2024-002",
      assignedTo: "Rajesh Kumar",
      assignedBy: "Maintenance Head",
      dueDate: "2024-02-18",
      priority: "medium",
      status: "in_progress",
      createdFrom: "Monthly Maintenance Report - December 2023",
    },
    {
      id: 3,
      title: "Assign Training Schedule",
      malayalamTitle: "പരിശീലന ഷെഡ്യൂൾ നൽകുക",
      description: "Assign staff for upcoming training sessions",
      documentId: "DOC-2024-003",
      assignedTo: "Rajesh Kumar",
      assignedBy: "HR Department",
      dueDate: "2024-02-20",
      priority: "low",
      status: "pending",
      createdFrom: "Employee Training Schedule - Q1 2024",
    },
    {
      id: 4,
      title: "Compliance Directive Implementation",
      malayalamTitle: "അനുസരണം നിർദ്ദേശം നടപ്പിലാക്കൽ",
      description: "Implement new CMRS safety directive at station",
      documentId: "DOC-2024-004",
      assignedTo: "Rajesh Kumar",
      assignedBy: "Compliance Officer",
      dueDate: "2024-02-16",
      priority: "urgent",
      status: "pending",
      createdFrom: "CMRS Safety Directive 2024-01",
    },
    {
      id: 5,
      title: "Incident Report Follow-up",
      malayalamTitle: "സംഭവ റിപ്പോർട്ട് ഫോളോ-അപ്പ്",
      description: "Follow up on yesterday's platform incident and submit action taken",
      documentId: "DOC-2024-005",
      assignedTo: "Rajesh Kumar",
      assignedBy: "Operations Manager",
      dueDate: "Today",
      priority: "urgent",
      status: "completed",
      createdFrom: "Platform Incident Report - Aluva",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return null
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Tasks & Assignments</h1>
            <p className="text-muted-foreground">ജോലികളും അസൈൻമെന്റുകളും</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Assigned to you</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Awaiting action</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Currently working on</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(task.status)}
                          <div>
                            <CardTitle className="text-lg">{task.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{task.malayalamTitle}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{task.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Due Date</p>
                            <p className="font-medium">{task.dueDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Assigned By</p>
                            <p className="font-medium">{task.assignedBy}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Document</p>
                            <p className="font-medium">{task.documentId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{task.assignedTo.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs text-muted-foreground">Assigned To</p>
                            <p className="font-medium text-xs">{task.assignedTo}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">Created from document:</p>
                        <p className="text-sm font-medium">{task.createdFrom}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Document
                        </Button>
                        {task.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Start Task
                            </Button>
                            <Button size="sm" variant="outline">
                              Reassign
                            </Button>
                          </>
                        )}
                        {task.status === "in_progress" && (
                          <>
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Complete
                            </Button>
                            <Button size="sm" variant="outline">
                              Add Comment
                            </Button>
                          </>
                        )}
                        {task.status === "completed" && (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Task Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="pending">
              <div className="text-center py-8 text-muted-foreground">
                Showing pending tasks only
              </div>
            </TabsContent>

            <TabsContent value="in_progress">
              <div className="text-center py-8 text-muted-foreground">
                Showing in-progress tasks only
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="text-center py-8 text-muted-foreground">
                Showing completed tasks only
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
