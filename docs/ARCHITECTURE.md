# KMRL Document Assistant - System Architecture

## Overview

The KMRL Smart Document Assistant is built as a modern, scalable web application with microservices architecture, designed to handle bilingual document processing with AI-powered features.

## High-Level Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Web Client (Next.js)  │  Mobile PWA  │  External Integrations  │
│  - Dashboard UI         │  - Camera    │  - Email APIs           │
│  - Document Management  │  - Offline   │  - WhatsApp Business    │
│  - Analytics           │  - Sync      │  - SharePoint           │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Load Balancer / CDN                        │
│                        (Nginx/Cloudflare)                      │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer                           │
├─────────────────────────────────────────────────────────────────┤
│              Next.js Application Server                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   API Routes    │  │   Server Side   │  │   Static Site   │ │
│  │   - REST APIs   │  │   - SSR Pages   │  │   - Assets      │ │
│  │   - GraphQL     │  │   - Auth        │  │   - PWA         │ │
│  │   - WebSockets  │  │   - Middleware  │  │   - Manifest    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Service Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   AI/ML     │  │  Document   │  │   Search    │  │  Auth   │ │
│  │  Services   │  │  Processing │  │   Engine    │  │ Service │ │
│  │  - OCR      │  │  - Upload   │  │  - Full-text│  │ - JWT   │ │
│  │  - NLP      │  │  - Convert  │  │  - Vector   │  │ - RBAC  │ │
│  │  - Translate│  │  - Metadata │  │  - Semantic │  │ - OAuth │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ PostgreSQL  │  │    Redis    │  │ File Storage│  │ Vector  │ │
│  │ - Documents │  │  - Cache    │  │ - Documents │  │   DB    │ │
│  │ - Users     │  │  - Sessions │  │ - Images    │  │ - Search│ │
│  │ - Audit     │  │  - Queue    │  │ - Backups   │  │ - ML    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Component Architecture

### Frontend Architecture

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Main dashboard
│   ├── documents/         # Document management
│   ├── mobile/           # Mobile-optimized pages
│   ├── analytics/        # Analytics dashboard
│   └── api/              # API routes
├── components/           # Reusable components
│   ├── ui/              # Base UI components
│   ├── forms/           # Form components
│   ├── charts/          # Chart components
│   └── mobile/          # Mobile-specific components
├── lib/                 # Utility libraries
│   ├── auth.ts          # Authentication logic
│   ├── database.ts      # Database connections
│   ├── ai-services.ts   # AI service integrations
│   └── utils.ts         # Helper functions
└── hooks/               # Custom React hooks
    ├── use-documents.ts
    ├── use-auth.ts
    └── use-mobile.ts
\`\`\`

### Backend Services

#### Document Processing Pipeline

\`\`\`
Document Upload → Validation → OCR → AI Processing → Storage → Indexing
      │              │         │         │           │         │
      ▼              ▼         ▼         ▼           ▼         ▼
   File Check    Format      Text     Summary    Database   Search
   Size Limit    Support   Extract   Generate     Store     Index
   Type Check    Convert   ML/EN     Keywords    Metadata   Vector
\`\`\`

#### AI Service Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    AI Service Layer                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    OCR      │  │     NLP     │  │ Translation │        │
│  │  Service    │  │   Service   │  │   Service   │        │
│  │             │  │             │  │             │        │
│  │ Google      │  │ OpenAI      │  │ Google      │        │
│  │ Vision API  │  │ GPT-4       │  │ Translate   │        │
│  │             │  │             │  │             │        │
│  │ Malayalam   │  │ Summarize   │  │ EN ↔ ML     │        │
│  │ Support     │  │ Keywords    │  │ Bidirectional│       │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Knowledge Graph Engine                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Entity    │  │ Relationship│  │   Graph     │        │
│  │ Extraction  │  │  Detection  │  │ Visualization│       │
│  │             │  │             │  │             │        │
│  │ - People    │  │ - Authored  │  │ - D3.js     │        │
│  │ - Places    │  │ - References│  │ - Force     │        │
│  │ - Concepts  │  │ - Related   │  │ - Layout    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Database Schema

### Core Tables

\`\`\`sql
-- Users and Authentication
users (
  id, email, password_hash, role, department_id,
  created_at, updated_at, last_login, preferences
)

-- Document Management
documents (
  id, title, description, content, summary, keywords,
  category, language, status, file_path, thumbnail_path,
  uploaded_by, uploaded_at, processed_at, file_size, mime_type
)

-- Organizational Structure
departments (
  id, name, description, parent_id, manager_id,
  created_at, updated_at
)

-- Workflow and Routing
document_routes (
  id, document_id, from_user, to_user, action,
  status, comments, created_at, completed_at
)

-- Audit and Compliance
audit_logs (
  id, user_id, action, resource_type, resource_id,
  old_values, new_values, ip_address, user_agent,
  created_at
)

-- Knowledge Graph
knowledge_graph (
  id, source_id, source_type, target_id, target_type,
  relationship_type, weight, metadata, created_at
)
\`\`\`

### Indexing Strategy

\`\`\`sql
-- Full-text search indexes
CREATE INDEX idx_documents_content_fts ON documents 
USING gin(to_tsvector('english', content));

CREATE INDEX idx_documents_content_ml_fts ON documents 
USING gin(to_tsvector('malayalam', content));

-- Performance indexes
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_uploaded_at ON documents(uploaded_at);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
\`\`\`

## Security Architecture

### Authentication Flow

\`\`\`
User Login → Credentials → JWT Token → API Access
     │           │            │           │
     ▼           ▼            ▼           ▼
  Username    Validate     Generate    Authorize
  Password    Against      Token       Requests
             Database     (24h TTL)    (RBAC)
\`\`\`

### Authorization Matrix

| Role      | Upload | View Own | View All | Approve | Admin |
|-----------|--------|----------|----------|---------|-------|
| Employee  | ✓      | ✓        | ✗        | ✗       | ✗     |
| Manager   | ✓      | ✓        | ✓ (Dept) | ✓       | ✗     |
| Admin     | ✓      | ✓        | ✓        | ✓       | ✓     |

### Data Protection

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                         │
├─────────────────────────────────────────────────────────────┤
│  1. Transport Security (HTTPS/TLS 1.3)                    │
│  2. Authentication (JWT + Refresh Tokens)                  │
│  3. Authorization (Role-Based Access Control)              │
│  4. Input Validation (Zod Schemas)                        │
│  5. SQL Injection Prevention (Parameterized Queries)       │
│  6. XSS Protection (Content Security Policy)              │
│  7. File Upload Security (Type/Size Validation)           │
│  8. Rate Limiting (Redis-based)                           │
│  9. Audit Logging (All Actions Tracked)                   │
│ 10. Data Encryption (AES-256 for sensitive data)          │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Scalability Considerations

### Horizontal Scaling

\`\`\`
Load Balancer
     │
     ├── App Server 1 ──┐
     ├── App Server 2 ──┼── Shared Database
     └── App Server N ──┘
\`\`\`

### Caching Strategy

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Caching Layers                          │
├─────────────────────────────────────────────────────────────┤
│  1. Browser Cache (Static Assets)                          │
│  2. CDN Cache (Global Distribution)                        │
│  3. Application Cache (Redis)                              │
│     - Session Data                                         │
│     - API Responses                                        │
│     - Search Results                                       │
│  4. Database Query Cache                                   │
│  5. File System Cache (Processed Documents)               │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Performance Optimization

- **Database**: Connection pooling, query optimization, read replicas
- **API**: Response compression, pagination, field selection
- **Frontend**: Code splitting, lazy loading, image optimization
- **Files**: CDN distribution, thumbnail generation, compression

## Monitoring and Observability

### Metrics Collection

\`\`\`
Application Metrics → Prometheus → Grafana Dashboard
     │
     ├── Request Rate/Latency
     ├── Error Rates
     ├── Database Performance
     ├── AI Service Usage
     └── User Activity

System Metrics → Node Exporter → Alerting
     │
     ├── CPU/Memory Usage
     ├── Disk I/O
     ├── Network Traffic
     └── Container Health
\`\`\`

### Logging Strategy

\`\`\`
Application Logs → Structured JSON → ELK Stack
     │
     ├── Request/Response Logs
     ├── Error Logs with Stack Traces
     ├── Audit Logs (User Actions)
     ├── Performance Logs
     └── Security Events

Log Levels: ERROR → WARN → INFO → DEBUG
Retention: 90 days (compressed), 7 days (live)
\`\`\`

## Deployment Architecture

### Container Strategy

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Docker Containers                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Web App   │  │  Database   │  │    Redis    │        │
│  │  (Next.js)  │  │(PostgreSQL) │  │   (Cache)   │        │
│  │             │  │             │  │             │        │
│  │ Port: 3000  │  │ Port: 5432  │  │ Port: 6379  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Nginx     │  │  AI Service │  │ Monitoring  │        │
│  │ (Proxy/SSL) │  │  (FastAPI)  │  │(Prometheus) │        │
│  │             │  │             │  │             │        │
│  │ Port: 80/443│  │ Port: 8000  │  │ Port: 9090  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### CI/CD Pipeline

\`\`\`
Code Push → GitHub Actions → Build → Test → Deploy
     │            │           │       │       │
     ▼            ▼           ▼       ▼       ▼
  Git Repo    Automated    Docker   Unit    Production
  Changes     Triggers     Build    Tests   Environment
              Workflow     Image    Pass    Update
\`\`\`

This architecture ensures scalability, security, and maintainability while supporting the complex requirements of bilingual document processing and AI-powered features for KMRL.
