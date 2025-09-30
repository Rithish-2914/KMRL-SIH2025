import { Pool } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface DBDocument {
  id: string;
  title: string;
  malayalam_title?: string;
  description?: string;
  file_path: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  language: string;
  source_type: string;
  category_code?: string;
  department_id?: string;
  uploaded_by: string;
  status: string;
  priority: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DBDocumentAnalysis {
  id: string;
  document_id: string;
  summary?: string;
  malayalam_summary?: string;
  keywords?: any;
  malayalam_keywords?: any;
  sentiment?: string;
  urgency_score?: number;
  auto_category_suggestion?: string;
  confidence_score?: number;
  created_at: string;
}

export interface DBDocumentRoute {
  id: string;
  document_id: string;
  from_user_id?: string;
  to_user_id?: string;
  to_department_id?: string;
  action: string;
  comments?: string;
  malayalam_comments?: string;
  status: string;
  created_at: string;
  completed_at?: string;
}

export interface DBUser {
  id: string;
  email: string;
  name: string;
  malayalam_name?: string;
  role: string;
  department_id?: string;
  preferred_language: string;
}

export interface DBDepartment {
  id: string;
  name: string;
  malayalam_name?: string;
  code: string;
  description?: string;
}

export const db = {
  // Document operations
  async createDocument(doc: Omit<DBDocument, 'id' | 'created_at' | 'updated_at'>): Promise<DBDocument> {
    const result = await pool.query(
      `INSERT INTO documents (
        title, malayalam_title, description, file_path, file_name, file_size, 
        mime_type, language, source_type, category_code, department_id, 
        uploaded_by, status, priority, due_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        doc.title, doc.malayalam_title, doc.description, doc.file_path, doc.file_name,
        doc.file_size, doc.mime_type, doc.language, doc.source_type, doc.category_code,
        doc.department_id, doc.uploaded_by, doc.status, doc.priority, doc.due_date
      ]
    );
    return result.rows[0];
  },

  async getDocuments(filters?: {
    status?: string;
    department_id?: string;
    uploaded_by?: string;
    limit?: number;
  }): Promise<DBDocument[]> {
    let query = 'SELECT * FROM documents WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }
    if (filters?.department_id) {
      query += ` AND department_id = $${paramCount}`;
      params.push(filters.department_id);
      paramCount++;
    }
    if (filters?.uploaded_by) {
      query += ` AND uploaded_by = $${paramCount}`;
      params.push(filters.uploaded_by);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';
    
    if (filters?.limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  async getDocumentById(id: string): Promise<DBDocument | null> {
    const result = await pool.query('SELECT * FROM documents WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async updateDocumentStatus(id: string, status: string, completedBy?: string): Promise<void> {
    await pool.query(
      'UPDATE documents SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, id]
    );
  },

  async getDocumentCount(filters?: { status?: string; department_id?: string }): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM documents WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }
    if (filters?.department_id) {
      query += ` AND department_id = $${paramCount}`;
      params.push(filters.department_id);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  },

  // Document analysis operations
  async createDocumentAnalysis(analysis: Omit<DBDocumentAnalysis, 'id' | 'created_at'>): Promise<DBDocumentAnalysis> {
    const result = await pool.query(
      `INSERT INTO document_analysis (
        document_id, summary, malayalam_summary, keywords, malayalam_keywords,
        sentiment, urgency_score, auto_category_suggestion, confidence_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        analysis.document_id, analysis.summary, analysis.malayalam_summary,
        JSON.stringify(analysis.keywords), JSON.stringify(analysis.malayalam_keywords),
        analysis.sentiment, analysis.urgency_score, analysis.auto_category_suggestion,
        analysis.confidence_score
      ]
    );
    return result.rows[0];
  },

  async getDocumentAnalysis(documentId: string): Promise<DBDocumentAnalysis | null> {
    const result = await pool.query(
      'SELECT * FROM document_analysis WHERE document_id = $1',
      [documentId]
    );
    return result.rows[0] || null;
  },

  // Document routes operations
  async createDocumentRoute(route: Omit<DBDocumentRoute, 'id' | 'created_at'>): Promise<DBDocumentRoute> {
    const result = await pool.query(
      `INSERT INTO document_routes (
        document_id, from_user_id, to_user_id, to_department_id, 
        action, comments, malayalam_comments, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        route.document_id, route.from_user_id, route.to_user_id, route.to_department_id,
        route.action, route.comments, route.malayalam_comments, route.status
      ]
    );
    return result.rows[0];
  },

  async getDocumentRoutes(documentId: string): Promise<DBDocumentRoute[]> {
    const result = await pool.query(
      'SELECT * FROM document_routes WHERE document_id = $1 ORDER BY created_at DESC',
      [documentId]
    );
    return result.rows;
  },

  async updateDocumentRoute(id: string, status: string, comments?: string): Promise<void> {
    await pool.query(
      `UPDATE document_routes 
       SET status = $1, comments = COALESCE($2, comments), completed_at = NOW() 
       WHERE id = $3`,
      [status, comments, id]
    );
  },

  // User operations
  async getUsers(): Promise<DBUser[]> {
    const result = await pool.query('SELECT * FROM users WHERE is_active = true');
    return result.rows;
  },

  async getUserByEmail(email: string): Promise<DBUser | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  // Department operations
  async getDepartments(): Promise<DBDepartment[]> {
    const result = await pool.query('SELECT * FROM departments WHERE is_active = true');
    return result.rows;
  },

  async getDepartmentByCode(code: string): Promise<DBDepartment | null> {
    const result = await pool.query('SELECT * FROM departments WHERE code = $1', [code]);
    return result.rows[0] || null;
  },

  // Audit log
  async createAuditLog(log: {
    user_id?: string;
    document_id?: string;
    action: string;
    details?: any;
  }): Promise<void> {
    await pool.query(
      'INSERT INTO audit_logs (user_id, document_id, action, details) VALUES ($1, $2, $3, $4)',
      [log.user_id, log.document_id, log.action, JSON.stringify(log.details)]
    );
  },

  async getAuditLogs(documentId: string): Promise<any[]> {
    const result = await pool.query(
      'SELECT * FROM audit_logs WHERE document_id = $1 ORDER BY created_at DESC',
      [documentId]
    );
    return result.rows;
  }
};
