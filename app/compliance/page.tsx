"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout-new"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Calendar, CheckCircle, Clock, FileText, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CompliancePage() {
  const complianceItems = [
    {
      id: 1,
      title: "CMRS Safety Directive 2024-01",
      malayalamTitle: "CMRS സുരക്ഷാ നിർദ്ദേശം 2024-01",
      department: "Safety & Security",
      deadline: "2024-02-15",
      priority: "high",
      status: "pending",
      description: "New safety protocols for platform operations during monsoon season",
      impactedDepartments: ["Operations", "Safety", "Maintenance"],
    },
    {
      id: 2,
      title: "Updated Fire Safety Compliance",
      malayalamTitle: "അപ്ഡേറ്റ് ചെയ്ത അഗ്നി സുരക്ഷ അനുസരണം",
      department: "Safety & Security",
      deadline: "2024-02-20",
      priority: "medium",
      status: "acknowledged",
      description: "Annual fire safety drill and equipment inspection requirements",
      impactedDepartments: ["All Stations"],
    },
    {
      id: 3,
      title: "Metro Railway Act Amendment 2024",
      malayalamTitle: "മെട്രോ റെയിൽവേ നിയമം ഭേദഗതി 2024",
      department: "Legal & Compliance",
      deadline: "2024-03-01",
      priority: "urgent",
      status: "pending",
      description: "Amendments to operational procedures as per new act",
      impactedDepartments: ["Operations", "HR", "Legal"],
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-blue-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "acknowledged":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Compliance & Alerts</h1>
            <p className="text-muted-foreground">അനുസരണം & മുന്നറിയിപ്പുകൾ</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No overdue items</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {complianceItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-1 h-8 ${getPriorityColor(item.priority)} rounded`} />
                          <div>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{item.malayalamTitle}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge variant={item.status === "pending" ? "destructive" : "default"}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Deadline
                          </p>
                          <p className="text-sm text-muted-foreground">{item.deadline}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Department</p>
                          <p className="text-sm text-muted-foreground">{item.department}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Impacted Departments</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.impactedDepartments.map((dept) => (
                              <Badge key={dept} variant="outline" className="text-xs">
                                {dept}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Document
                        </Button>
                        {item.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Acknowledge
                            </Button>
                            <Button size="sm" variant="outline">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Escalate
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="pending">
              <div className="text-center py-8 text-muted-foreground">
                Filter showing pending items only
              </div>
            </TabsContent>

            <TabsContent value="acknowledged">
              <div className="text-center py-8 text-muted-foreground">
                Filter showing acknowledged items only
              </div>
            </TabsContent>

            <TabsContent value="overdue">
              <div className="text-center py-8 text-green-600">
                No overdue compliance items
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
