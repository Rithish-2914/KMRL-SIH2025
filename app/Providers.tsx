"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { DocumentProvider } from "@/contexts/document-context"
import { AuthProvider } from "@/contexts/auth-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <DocumentProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </DocumentProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
