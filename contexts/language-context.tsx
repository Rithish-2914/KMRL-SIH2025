"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Language = "en" | "ml"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<string, Record<Language, string>> = {
  "app.title": { en: "KMRL Document Assistant", ml: "KMRL ഡോക്യുമെന്റ് അസിസ്റ്റന്റ്" },
  "nav.dashboard": { en: "Dashboard", ml: "ഡാഷ്ബോർഡ്" },
  "nav.documents": { en: "Documents", ml: "രേഖകൾ" },
  "nav.upload": { en: "Upload", ml: "അപ്‌ലോഡ്" },
  "nav.search": { en: "Search", ml: "തിരയൽ" },
  "nav.compliance": { en: "Compliance", ml: "അനുസരണം" },
  "nav.tasks": { en: "Tasks", ml: "ടാസ്‌ക്കുകൾ" },
  "nav.analytics": { en: "Analytics", ml: "അനലിറ്റിക്‌സ്" },
  "nav.workflow": { en: "Workflow", ml: "വർക്ക്ഫ്ലോ" },
  "nav.users": { en: "Users", ml: "ഉപയോക്താക്കൾ" },
  "nav.settings": { en: "Settings", ml: "ക്രമീകരണങ്ങൾ" },
  "nav.notifications": { en: "Notifications", ml: "അറിയിപ്പുകൾ" },
  "nav.archive": { en: "Archive", ml: "ആർക്കൈവ്" },
  "nav.admin": { en: "Admin", ml: "അഡ്മിൻ" },
  "nav.audit": { en: "Audit Logs", ml: "ഓഡിറ്റ് ലോഗുകൾ" },
  "nav.ai_chat": { en: "AI Chat", ml: "AI ചാറ്റ്" },
  
  "search.placeholder": { en: "Search documents...", ml: "രേഖകൾ തിരയുക..." },
  "filter.all": { en: "All", ml: "എല്ലാം" },
  "filter.department": { en: "Department", ml: "വകുപ്പ്" },
  "filter.date": { en: "Date", ml: "തീയതി" },
  "filter.source": { en: "Source", ml: "ഉറവിടം" },
  "filter.language": { en: "Language", ml: "ഭാഷ" },
  "filter.actionable": { en: "Actionable", ml: "നടപടി വേണ്ടത്" },
  
  "upload.title": { en: "Upload Documents", ml: "രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക" },
  "upload.drag_drop": { en: "Drop files here or click to browse", ml: "ഫയലുകൾ ഇവിടെ ഡ്രോപ്പ് ചെയ്യുക അല്ലെങ്കിൽ ബ്രൗസ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക" },
  "upload.uploading": { en: "Uploading...", ml: "അപ്‌ലോഡ് ചെയ്യുന്നു..." },
  "upload.success": { en: "Upload completed successfully!", ml: "അപ്‌ലോഡ് വിജയകരമായി പൂർത്തിയായി!" },
  "upload.process": { en: "Process Document", ml: "രേഖ പ്രോസസ്സ് ചെയ്യുക" },
  
  "doc.title": { en: "Document Title", ml: "രേഖയുടെ ശീർഷകം" },
  "doc.description": { en: "Description", ml: "വിവരണം" },
  "doc.category": { en: "Category", ml: "വിഭാഗം" },
  "doc.priority": { en: "Priority", ml: "മുൻഗണന" },
  "doc.department": { en: "Department", ml: "വകുപ്പ്" },
  "doc.status": { en: "Status", ml: "സ്റ്റാറ്റസ്" },
  "doc.deadline": { en: "Deadline", ml: "സമയപരിധി" },
  
  "priority.low": { en: "Low", ml: "കുറഞ്ഞത്" },
  "priority.medium": { en: "Medium", ml: "ഇടത്തരം" },
  "priority.high": { en: "High", ml: "ഉയർന്നത്" },
  "priority.urgent": { en: "Urgent", ml: "അടിയന്തിരം" },
  
  "status.pending": { en: "Pending", ml: "തീർപ്പാക്കാത്ത" },
  "status.processing": { en: "Processing", ml: "പ്രോസസ്സിംഗ്" },
  "status.approved": { en: "Approved", ml: "അംഗീകരിച്ചത്" },
  "status.rejected": { en: "Rejected", ml: "നിരസിച്ചത്" },
  
  "dept.operations": { en: "Operations", ml: "പ്രവർത്തനങ്ങൾ" },
  "dept.maintenance": { en: "Maintenance", ml: "അറ്റകുറ്റപ്പണി" },
  "dept.safety": { en: "Safety", ml: "സുരക്ഷ" },
  "dept.hr": { en: "Human Resources", ml: "മാനവ വിഭവശേഷി" },
  "dept.finance": { en: "Finance", ml: "ധനകാര്യം" },
  "dept.engineering": { en: "Engineering", ml: "എഞ്ചിനീയറിംഗ്" },
  
  "button.upload": { en: "Upload Document", ml: "രേഖ അപ്‌ലോഡ് ചെയ്യുക" },
  "button.save": { en: "Save", ml: "സേവ് ചെയ്യുക" },
  "button.cancel": { en: "Cancel", ml: "റദ്ദാക്കുക" },
  "button.accept": { en: "Accept", ml: "സ്വീകരിക്കുക" },
  "button.decline": { en: "Decline", ml: "നിരസിക്കുക" },
  "button.export": { en: "Export", ml: "എക്സ്പോർട്ട്" },
  "button.download": { en: "Download", ml: "ഡൗൺലോഡ്" },
  "button.view": { en: "View", ml: "കാണുക" },
  "button.edit": { en: "Edit", ml: "എഡിറ്റ് ചെയ്യുക" },
  "button.delete": { en: "Delete", ml: "ഡിലീറ്റ് ചെയ്യുക" },
  
  "ai.summarizing": { en: "Summarizing document...", ml: "രേഖ സംഗ്രഹിക്കുന്നു..." },
  "ai.summary": { en: "AI Summary", ml: "AI സംഗ്രഹം" },
  "ai.chat": { en: "AI Assistant", ml: "AI അസിസ്റ്റന്റ്" },
  "ai.ask": { en: "Ask a question...", ml: "ഒരു ചോദ്യം ചോദിക്കുക..." },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("kmrl-language") as Language
    if (savedLang && (savedLang === "en" || savedLang === "ml")) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("kmrl-language", lang)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
