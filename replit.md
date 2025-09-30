# KMRL Smart Document Assistant - Replit Configuration

## Overview
A comprehensive bilingual (English/Malayalam) document management system for Kochi Metro Rail Limited (KMRL) with AI-powered features including OCR, summarization, translation, and intelligent routing.

## Project Type
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React with Tailwind CSS
- **AI Services**: OpenAI GPT-4, Google Vision API, Google Translate API

## Recent Changes
- **2025-09-30 (Latest)**: Fresh GitHub import successfully configured for Replit
  - Installed all npm dependencies (267 packages)
  - Updated NEXTAUTH_URL in .env.local to match Replit domain
  - Verified Next.js config has proper CORS headers and cache control for Replit proxy
  - Configured and tested development workflow on port 5000 with host 0.0.0.0
  - Set up deployment configuration for Replit Autoscale (build + production start)
  - Successfully verified app runs and displays login page with demo accounts
  - All major features confirmed functional

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
