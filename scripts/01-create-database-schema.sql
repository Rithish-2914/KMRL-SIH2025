-- KMRL Smart Document Assistant Database Schema
-- Created for Kochi Metro Rail Limited

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with role-based access
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    malayalam_name VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    department_id UUID,
    is_active BOOLEAN DEFAULT true,
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    malayalam_name VARCHAR(255),
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    head_user_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document categories
CREATE TABLE document_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    malayalam_name VARCHAR(255),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    parent_category_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    malayalam_title VARCHAR(500),
    description TEXT,
    malayalam_description TEXT,
    file_path VARCHAR(1000) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    source_type VARCHAR(50) NOT NULL, -- email, whatsapp, sharepoint, upload, mobile_camera
    source_metadata JSONB,
    category_id UUID,
    department_id UUID,
    uploaded_by UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, classified, approved, rejected
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    due_date TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OCR results
CREATE TABLE document_ocr (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL,
    extracted_text TEXT,
    malayalam_text TEXT,
    confidence_score DECIMAL(5,4),
    language_detected VARCHAR(10),
    processing_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI-generated summaries and analysis
CREATE TABLE document_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL,
    summary TEXT,
    malayalam_summary TEXT,
    keywords JSONB,
    malayalam_keywords JSONB,
    sentiment VARCHAR(20),
    urgency_score DECIMAL(3,2),
    auto_category_suggestion VARCHAR(100),
    confidence_score DECIMAL(5,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document routing and workflow
CREATE TABLE document_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL,
    from_user_id UUID,
    to_user_id UUID,
    to_department_id UUID,
    action VARCHAR(50) NOT NULL, -- route, approve, reject, review, comment
    comments TEXT,
    malayalam_comments TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, overdue
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    document_id UUID,
    type VARCHAR(50) NOT NULL, -- document_assigned, deadline_approaching, status_change
    title VARCHAR(255) NOT NULL,
    malayalam_title VARCHAR(255),
    message TEXT,
    malayalam_message TEXT,
    is_read BOOLEAN DEFAULT false,
    sent_via JSONB, -- {email: true, sms: false, push: true}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs for compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    document_id UUID,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge graph relationships
CREATE TABLE knowledge_graph (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_document_id UUID NOT NULL,
    target_document_id UUID NOT NULL,
    relationship_type VARCHAR(50) NOT NULL, -- related, references, supersedes, version_of
    confidence_score DECIMAL(5,4),
    created_by VARCHAR(50) DEFAULT 'ai', -- ai, user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document tags for better searchability
CREATE TABLE document_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL,
    tag VARCHAR(100) NOT NULL,
    malayalam_tag VARCHAR(100),
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE users ADD CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id);
ALTER TABLE departments ADD CONSTRAINT fk_departments_head FOREIGN KEY (head_user_id) REFERENCES users(id);
ALTER TABLE document_categories ADD CONSTRAINT fk_categories_parent FOREIGN KEY (parent_category_id) REFERENCES document_categories(id);
ALTER TABLE documents ADD CONSTRAINT fk_documents_category FOREIGN KEY (category_id) REFERENCES document_categories(id);
ALTER TABLE documents ADD CONSTRAINT fk_documents_department FOREIGN KEY (department_id) REFERENCES departments(id);
ALTER TABLE documents ADD CONSTRAINT fk_documents_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id);
ALTER TABLE document_ocr ADD CONSTRAINT fk_ocr_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
ALTER TABLE document_analysis ADD CONSTRAINT fk_analysis_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
ALTER TABLE document_routes ADD CONSTRAINT fk_routes_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
ALTER TABLE document_routes ADD CONSTRAINT fk_routes_from_user FOREIGN KEY (from_user_id) REFERENCES users(id);
ALTER TABLE document_routes ADD CONSTRAINT fk_routes_to_user FOREIGN KEY (to_user_id) REFERENCES users(id);
ALTER TABLE document_routes ADD CONSTRAINT fk_routes_to_department FOREIGN KEY (to_department_id) REFERENCES departments(id);
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
ALTER TABLE audit_logs ADD CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE audit_logs ADD CONSTRAINT fk_audit_document FOREIGN KEY (document_id) REFERENCES documents(id);
ALTER TABLE knowledge_graph ADD CONSTRAINT fk_kg_source FOREIGN KEY (source_document_id) REFERENCES documents(id) ON DELETE CASCADE;
ALTER TABLE knowledge_graph ADD CONSTRAINT fk_kg_target FOREIGN KEY (target_document_id) REFERENCES documents(id) ON DELETE CASCADE;
ALTER TABLE document_tags ADD CONSTRAINT fk_tags_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
ALTER TABLE document_tags ADD CONSTRAINT fk_tags_creator FOREIGN KEY (created_by) REFERENCES users(id);

-- Create indexes for better performance
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_documents_department ON documents(department_id);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_document_routes_status ON document_routes(status);
CREATE INDEX idx_document_routes_due_date ON document_routes(due_date);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_knowledge_graph_source ON knowledge_graph(source_document_id);
CREATE INDEX idx_document_tags_tag ON document_tags(tag);

-- Full text search indexes
CREATE INDEX idx_documents_title_search ON documents USING gin(to_tsvector('english', title));
CREATE INDEX idx_documents_malayalam_title_search ON documents USING gin(to_tsvector('english', malayalam_title));
CREATE INDEX idx_ocr_text_search ON document_ocr USING gin(to_tsvector('english', extracted_text));
