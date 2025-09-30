"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, UserPlus, MoreVertical, Shield, User, Mail, Phone } from "lucide-react"

export default function UsersPage() {
  const [language, setLanguage] = useState<"en" | "ml">("en")
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      user: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    }
    return colors[role as keyof typeof colors] || colors.user
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    }
    return colors[status as keyof typeof colors] || colors.inactive
  }

  const getRoleText = (role: string) => {
    const roleMap = {
      en: { admin: "Admin", manager: "Manager", user: "User" },
      ml: { admin: "അഡ്മിൻ", manager: "മാനേജർ", user: "ഉപയോക്താവ്" },
    }
    return roleMap[language][role as keyof typeof roleMap.en] || role
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      en: { active: "Active", inactive: "Inactive" },
      ml: { active: "സജീവം", inactive: "നിഷ്ക്രിയം" },
    }
    return statusMap[language][status as keyof typeof statusMap.en] || status
  }

  return (
    <DashboardLayout language={language} onLanguageChange={setLanguage}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{language === "en" ? "User Management" : "ഉപയോക്തൃ മാനേജ്മെന്റ്"}</h1>
            <p className="text-muted-foreground">
              {language === "en" ? "Manage user accounts and permissions" : "ഉപയോക്തൃ അക്കൗണ്ടുകളും അനുമതികളും കൈകാര്യം ചെയ്യുക"}
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            {language === "en" ? "Add User" : "ഉപയോക്താവിനെ ചേർക്കുക"}
          </Button>
        </div>

        {/* User Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Total Users" : "മൊത്തം ഉപയോക്താക്കൾ"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Active Users" : "സജീവ ഉപയോക്താക്കൾ"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.role.toLowerCase() === 'admin').length}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Administrators" : "അഡ്മിനിസ്ട്രേറ്റർമാർ"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <UserPlus className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.role.toLowerCase() !== 'admin').length}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Other Roles" : "മറ്റ് റോളുകൾ"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Search Users" : "ഉപയോക്താക്കളെ തിരയുക"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === "en" ? "Search users..." : "ഉപയോക്താക്കളെ തിരയുക..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={language === "en" ? "Role" : "റോൾ"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "en" ? "All Roles" : "എല്ലാ റോളുകളും"}</SelectItem>
                  <SelectItem value="admin">{language === "en" ? "Admin" : "അഡ്മിൻ"}</SelectItem>
                  <SelectItem value="manager">{language === "en" ? "Manager" : "മാനേജർ"}</SelectItem>
                  <SelectItem value="user">{language === "en" ? "User" : "ഉപയോക്താവ്"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {isLoading && (
            <Card>
              <CardContent className="p-6 text-center">
                <p>{language === "en" ? "Loading users..." : "ഉപയോക്താക്കളെ ലോഡ് ചെയ്യുന്നു..."}</p>
              </CardContent>
            </Card>
          )}
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{language === "ml" && user.malayalam_name ? user.malayalam_name : user.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(user.role.toLowerCase())} variant="secondary">
                      {getRoleText(user.role.toLowerCase())}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" variant="secondary">
                      {language === "en" ? "Active" : "സജീവം"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {language === "en" ? "No users found" : "ഉപയോക്താക്കളെ കണ്ടെത്തിയില്ല"}
              </h3>
              <p className="text-muted-foreground text-center">
                {language === "en" ? "Try adjusting your search criteria" : "നിങ്ങളുടെ തിരയൽ മാനദണ്ഡങ്ങൾ ക്രമീകരിക്കാൻ ശ്രമിക്കുക"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
