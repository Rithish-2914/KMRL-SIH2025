"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"

export interface Document {
  id: string
  title: string
  malayalam_title?: string
  description: string
  malayalam_description?: string
  file_path: string
  file_name: string
  file_type: string
  file_size: number
  language: "en" | "ml" | "both"
  source_type: "upload" | "email" | "sharepoint" | "url" | "mobile_camera"
  uploaded_by: string
  assigned_to?: string
  status: "pending" | "processing" | "approved" | "rejected" | "classified"
  priority: "low" | "medium" | "high" | "urgent"
  department?: string
  is_actionable: boolean
  deadline?: string
  ai_summary?: string
  ai_summary_ml?: string
  keywords?: string[]
  confidence_score?: number
  created_at: string
  updated_at: string
  version: number
  metadata?: Record<string, any>
  audit_trail?: AuditEntry[]
}

export interface AuditEntry {
  id: string
  document_id: string
  action: string
  performed_by: string
  timestamp: string
  changes?: Record<string, any>
  notes?: string
}

interface DocumentContextType {
  documents: Document[]
  addDocument: (doc: Omit<Document, "id" | "created_at" | "updated_at" | "version">) => Promise<Document>
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  getDocument: (id: string) => Document | undefined
  getActionableDocuments: () => Document[]
  addAuditEntry: (documentId: string, entry: Omit<AuditEntry, "id" | "timestamp">) => void
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([])

  const addDocument = useCallback(async (docData: Omit<Document, "id" | "created_at" | "updated_at" | "version">): Promise<Document> => {
    const auditEntry: AuditEntry = {
      id: `audit_${Date.now()}`,
      document_id: "",
      action: "created",
      performed_by: docData.uploaded_by,
      timestamp: new Date().toISOString(),
      notes: "Document uploaded and created",
    }

    const newDoc: Document = {
      ...docData,
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      audit_trail: [{ ...auditEntry, document_id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }],
    }

    auditEntry.document_id = newDoc.id
    newDoc.audit_trail = [auditEntry]

    setDocuments(prev => [newDoc, ...prev])

    return newDoc
  }, [])

  const updateDocument = useCallback(async (id: string, updates: Partial<Document>, performedBy?: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        const auditEntry: AuditEntry = {
          id: `audit_${Date.now()}`,
          document_id: id,
          action: "updated",
          performed_by: performedBy || "system",
          timestamp: new Date().toISOString(),
          changes: updates,
        }

        return {
          ...doc,
          ...updates,
          updated_at: new Date().toISOString(),
          version: doc.version + 1,
          audit_trail: [...(doc.audit_trail || []), auditEntry],
        }
      }
      return doc
    }))
  }, [])

  const deleteDocument = useCallback(async (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }, [])

  const getDocument = useCallback((id: string) => {
    return documents.find(doc => doc.id === id)
  }, [documents])

  const getActionableDocuments = useCallback(() => {
    return documents
      .filter(doc => doc.is_actionable && doc.status === "pending")
      .sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
      .slice(0, 3)
  }, [documents])

  const addAuditEntry = useCallback((documentId: string, entry: Omit<AuditEntry, "id" | "timestamp">) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === documentId) {
        const auditEntry: AuditEntry = {
          ...entry,
          id: `audit_${Date.now()}`,
          timestamp: new Date().toISOString(),
        }
        return {
          ...doc,
          audit_trail: [...(doc.audit_trail || []), auditEntry],
        }
      }
      return doc
    }))
  }, [])

  return (
    <DocumentContext.Provider value={{
      documents,
      addDocument,
      updateDocument,
      deleteDocument,
      getDocument,
      getActionableDocuments,
      addAuditEntry,
    }}>
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error("useDocuments must be used within DocumentProvider")
  }
  return context
}
