"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  Upload,
  Search,
  BarChart3,
  Settings,
  Users,
  Bell,
  Archive,
  Workflow,
  Brain,
  Menu,
  LogOut,
  User,
  Shield,
  AlertTriangle,
  ClipboardCheck,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [language, setLanguage] = useState<"en" | "ml">("en")

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navigationItems = [
    { name: "Dashboard", nameML: "ഡാഷ്ബോർഡ്", href: user ? getRoleDashboardPath(user.role) : "/", icon: LayoutDashboard },
    { name: "Documents", nameML: "രേഖകൾ", href: "/documents", icon: FileText, badge: "12" },
    { name: "Upload", nameML: "അപ്‌ലോഡ്", href: "/upload", icon: Upload },
    { name: "Search", nameML: "തിരയൽ", href: "/search", icon: Search },
    { name: "Compliance", nameML: "അനുസരണം", href: "/compliance", icon: Shield },
    { name: "Tasks", nameML: "ജോലികൾ", href: "/tasks", icon: ClipboardCheck, badge: "5" },
    { name: "AI Chat", nameML: "AI ചാറ്റ്", href: "/ai-chat", icon: Brain },
    { name: "Analytics", nameML: "അനലിറ്റിക്സ്", href: "/analytics", icon: BarChart3 },
    { name: "Notifications", nameML: "അറിയിപ്പുകൾ", href: "/notifications", icon: Bell, badge: "3" },
  ]

  const adminItems = [
    { name: "Admin Dashboard", nameML: "അഡ്മിൻ ഡാഷ്ബോർഡ്", href: "/admin", icon: Shield },
    { name: "Ingestion Monitor", nameML: "ഇൻജെസ്ഷൻ മോണിറ്റർ", href: "/admin/ingestion", icon: Upload },
    { name: "Users & Roles", nameML: "ഉപയോക്താക്കൾ", href: "/admin/users", icon: Users },
    { name: "Audit Logs", nameML: "ഓഡിറ്റ് ലോഗുകൾ", href: "/admin/audit", icon: AlertTriangle },
    { name: "Settings", nameML: "ക്രമീകരണങ്ങൾ", href: "/admin/settings", icon: Settings },
  ]

  const displayItems = user?.role === "admin" ? [...navigationItems, ...adminItems] : navigationItems

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 p-4 border-b">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold">KMRL</h1>
              <p className="text-xs text-muted-foreground">Document Assistant</p>
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {displayItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn("w-full justify-start gap-3", isActive && "bg-blue-50 dark:bg-blue-950")}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{language === "en" ? item.name : item.nameML}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.role.replace("_", " ")}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1">
              <Input placeholder={language === "en" ? "Search documents..." : "രേഖകൾ തിരയുക..."} className="max-w-md" />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "ml" : "en")}
              >
                {language === "en" ? "മലയാളം" : "English"}
              </Button>
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute top-1 right-1 h-2 w-2 p-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-auto">
                    <DropdownMenuItem>
                      <div>
                        <p className="text-sm font-medium">New document assigned</p>
                        <p className="text-xs text-muted-foreground">Safety Protocol Update - 2 mins ago</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Avatar>
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
