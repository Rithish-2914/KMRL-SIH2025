"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout-new"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, FileText, TrendingUp, AlertCircle } from "lucide-react"

export default function ControllerDashboard() {
  const actionableItems = [
    {
      id: 1,
      title: "Platform Incident Report - Aluva",
      type: "Safety Alert",
      priority: "high",
      dueDate: "Today, 4:00 PM",
      description: "Incident report requiring immediate review and acknowledgment"
    },
    {
      id: 2,
      title: "Crowd Management Protocol Update",
      type: "Compliance",
      priority: "medium",
      dueDate: "Tomorrow",
      description: "Updated protocols for peak hour operations"
    },
    {
      id: 3,
      title: "Staff Shift Schedule Changes",
      type: "Operations",
      priority: "medium",
      dueDate: "In 2 days",
      description: "Review and approve revised shift schedules"
    }
  ]

  const recentActivity = [
    { action: "Acknowledged", document: "Morning Safety Briefing", time: "30 min ago", user: "You" },
    { action: "Uploaded", document: "Platform CCTV Report", time: "1 hour ago", user: "Security Team" },
    { action: "Approved", document: "Emergency Protocol V2.1", time: "2 hours ago", user: "You" },
  ]

  return (
    <ProtectedRoute allowedRoles={["station_controller"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Station Controller Dashboard</h1>
            <p className="text-muted-foreground">സ്റ്റേഷൻ കൺട്രോളർ ഡാഷ്ബോർഡ്</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Require immediate action</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Documents awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Status</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Operational</div>
                <p className="text-xs text-muted-foreground">All systems normal</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Top 3 Actionable Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {actionableItems.map((item) => (
                <div key={item.id} className="border-l-4 border-l-primary pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge variant={item.priority === "high" ? "destructive" : "default"}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {item.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due: {item.dueDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Review</Button>
                      <Button size="sm" variant="outline">Acknowledge</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()} 
                        <span className="font-medium"> {activity.document}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
