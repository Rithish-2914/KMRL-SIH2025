# KMRL Smart Document Assistant - Replit Configuration

## Overview
A comprehensive bilingual (English/Malayalam) document management system for Kochi Metro Rail Limited (KMRL) with AI-powered features including OCR, summarization, translation, and intelligent routing.

## Project Type
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React with Tailwind CSS
- **AI Services**: OpenAI GPT-4, Google Vision API, Google Translate API

## Recent Changes
- **2025-09-30 (Document Management Implementation - Current Session)**: Implemented complete database-backed document workflow system
  - ✅ **Database Setup**:
    * Created PostgreSQL database with Replit's built-in database tool
    * Created tables: users, departments, documents, document_analysis, document_routes, audit_logs
    * Seeded 6 departments (Operations, Safety, Maintenance, Finance, HR, Engineering)
    * Seeded 6 demo users with different roles
  - ✅ **Database Service** (lib/db.ts):
    * Implemented comprehensive database connection using @neondatabase/serverless
    * Created query functions for documents, analysis, routes, users, departments, audit logs
    * Supports filtering by department, status, and user
  - ✅ **API Endpoints**:
    * `/api/upload` - Multi-file upload to disk storage
    * `/api/ai/process-document` - AI processing with automatic database saving, department tagging, and routing
    * `/api/documents` - GET (list with filters), POST (create)
    * `/api/documents/[id]` - GET (with analysis, routes, audit logs), PATCH (update status), POST (approve/decline/comment)
    * `/api/analytics` - Real document counts from database by status and department
    * `/api/users` - GET all users for authentication
  - ✅ **Upload Workflow**:
    * Multi-file drag-and-drop upload working
    * Automatic AI summarization for each file
    * Automatic department tagging based on content analysis
    * Documents saved to database with full metadata
    * Document analysis saved (summary, keywords, sentiment, urgency)
    * Document routes created to tagged departments
    * Audit logs created for all actions
  - ✅ **Department-Specific Features**:
    * Documents tagged to specific departments based on AI classification
    * API supports filtering documents by department
    * Department stats in analytics showing real counts
  - ✅ **Approve/Decline Workflow**:
    * POST endpoint for approve, decline, review, comment actions
    * Status transitions (pending → classified → approved/rejected)
    * Comments and audit trail for all actions
  - ✅ **Dashboard Integration**:
    * Analytics API shows real document counts from database
    * Document stats by status (total, pending, processed, overdue)
    * Department stats with pending counts and SLA compliance
  - 📝 **Still TODO**:
    * Camera capture integration (UI exists, needs backend)
    * Email integration (UI exists, needs IMAP/POP3 setup)
    * SharePoint integration (UI exists, needs Microsoft Graph API)
    * PDF parsing for better text extraction
    * OCR for image-based documents

- **2025-09-30 (Fresh GitHub Import)**: Successfully set up fresh GitHub clone in Replit environment
  - ✅ Installed all npm dependencies (now 290 packages including @neondatabase/serverless, drizzle-orm, drizzle-kit)
  - ✅ Updated NEXTAUTH_URL in .env.local to match current Replit domain (kirk.replit.dev)
  - ✅ Verified Next.js config has proper settings (CORS, Cache-Control, Host configuration)
  - ✅ Configured and tested Server workflow on port 5000 with host 0.0.0.0
  - ✅ Set up deployment configuration for Replit Autoscale
  - ✅ Verified .gitignore is properly configured for Node.js/Next.js

- **2025-09-30 (Previous Session)**: Implemented full AI-powered document upload and processing workflow with intelligent fallback
  - ✅ Created functional multi-file upload system with drag-and-drop support
  - ✅ Implemented hybrid AI document processing pipeline:
    * **Primary Mode**: Uses OpenAI GPT-4 when API key is available
    * **Fallback Mode**: Intelligent keyword-based processing works without any paid API
    * Automatic document summarization (English & Malayalam)
    * Intelligent document classification into categories (HR, Safety, Engineering, etc.)
    * Smart department routing based on content analysis
    * Automatic deadline assignment based on priority and document type
    * Keyword extraction and tagging
  - ✅ Created `/api/upload` endpoint for file handling and storage
  - ✅ Enhanced `/api/ai/process-document` with comprehensive AI analysis and fallback processor
  - ✅ Updated upload page with real-time processing status and results display
  - ✅ AI chat assistant with OpenAI integration AND fallback responses for common questions
  - ✅ Full bilingual support (English/Malayalam) in both AI and fallback modes
  - All features tested and working with or without OpenAI API key

## Project Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS 4.x with shadcn/ui components
- **Features**:
  - **Authentication**: Role-based login with 6 user roles (Station Controller, Engineer, Finance, HR, Executive, Admin)
  - **Dashboards**: 
    - Role-specific dashboards with actionable items
    - Station Controller dashboard with top 3 priority items
    - General dashboard for other roles with KPI cards
  - **Document Management**: 
    - Multi-source upload (file, camera, email, SharePoint)
    - Document listing with grid/list views
    - Document detail page with PDF viewer placeholder, AI summary, and traceability
    - Advanced search and filters
    - Document classification and status tracking
  - **Compliance & Alerts**: Regulatory document tracking with deadlines
  - **Tasks & Assignments**: Task board with due dates and priorities
  - **AI Features**:
    - AI-powered chat widget
    - Document summarization
    - OCR and text extraction
    - English ↔ Malayalam translation
  - **Analytics**: Dashboard metrics and knowledge graph visualization
  - **Admin Features**:
    - User and role management
    - Audit logs with comprehensive event tracking
    - Ingestion monitor (workflow management)
    - System settings
  - **Notifications**: In-app notification system
  - **Mobile Support**: PWA with camera integration for document capture
  - **Bilingual**: Full English/Malayalam support throughout

### Backend (API Routes)
- **AI Services** (`/api/ai/*`):
  - OCR text extraction
  - Document summarization
  - EN↔ML translation
  - Document classification
  - Chat interface
  - Voice query processing
  - Knowledge graph generation

- **Document APIs** (`/api/documents/*`):
  - Document CRUD operations
  - Search functionality

- **Analytics** (`/api/analytics`):
  - Dashboard metrics and reporting

### Database
- **Type**: PostgreSQL (configured for Supabase)
- **Schema**: Full schema available in `/scripts/01-create-database-schema.sql`
- **Key Tables**: users, departments, documents, document_routes, notifications, audit_logs, knowledge_graph

### Environment Variables
Required variables in `.env.local`:
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: For AI features
- `GOOGLE_VISION_API_KEY`: For OCR
- `GOOGLE_TRANSLATE_API_KEY`: For translation
- `NEXTAUTH_SECRET`: For authentication
- `NEXTAUTH_URL`: Application URL

## Development

### Running Locally
The development server runs automatically via the "Server" workflow:
- **Port**: 5000
- **Host**: 0.0.0.0 (required for Replit proxy)
- **Command**: `npm run dev -- -H 0.0.0.0 -p 5000`

### Key Files & Directories
- `/app/*`: Next.js pages and API routes
- `/components/*`: React components (UI and feature components)
- `/lib/*`: Utility libraries (database, AI services, helpers)
- `/public/*`: Static assets and PWA manifest
- `/scripts/*`: Database migration scripts

### Technology Stack
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: React hooks
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)

## Deployment
Configured for Replit Autoscale deployment:
- **Build**: `npm run build`
- **Start**: `npm run start -- -H 0.0.0.0 -p 5000`
- **Type**: Autoscale (stateless web app)

## User Preferences
- None set yet

## Known Issues
- **Security**: Document files currently use mock public paths - in production, these should be served via authenticated API routes with permission checks to prevent unauthorized access
- **PDF Viewer**: Document detail page has PDF viewer placeholder - production implementation should use PDF.js or react-pdf for embedded viewing
- Minor React ref warnings in Button component (non-blocking)
- TypeScript errors in `lib/ai-services.ts` are suppressed in build config
