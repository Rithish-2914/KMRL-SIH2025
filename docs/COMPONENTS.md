# Component Documentation

## Design System

### Color Tokens

\`\`\`css
:root {
  /* Primary Colors - KMRL Brand */
  --primary: #1e40af;           /* KMRL Blue */
  --primary-foreground: #ffffff;
  --primary-hover: #1d4ed8;
  
  /* Secondary Colors */
  --secondary: #f1f5f9;         /* Light Gray */
  --secondary-foreground: #0f172a;
  --secondary-hover: #e2e8f0;
  
  /* Accent Colors */
  --accent: #059669;            /* Success Green */
  --accent-foreground: #ffffff;
  --destructive: #dc2626;       /* Error Red */
  --destructive-foreground: #ffffff;
  --warning: #d97706;           /* Warning Orange */
  --warning-foreground: #ffffff;
  
  /* Neutral Colors */
  --background: #ffffff;
  --foreground: #0f172a;
  --muted: #f8fafc;
  --muted-foreground: #64748b;
  --border: #e2e8f0;
  --input: #ffffff;
  --ring: #3b82f6;
  
  /* Dark Mode */
  --dark-background: #0f172a;
  --dark-foreground: #f8fafc;
  --dark-muted: #1e293b;
  --dark-muted-foreground: #94a3b8;
  --dark-border: #334155;
}
\`\`\`

### Typography Scale

\`\`\`css
/* Font Families */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
\`\`\`

### Spacing Scale

\`\`\`css
/* Spacing Units */
--space-1: 0.25rem;      /* 4px */
--space-2: 0.5rem;       /* 8px */
--space-3: 0.75rem;      /* 12px */
--space-4: 1rem;         /* 16px */
--space-6: 1.5rem;       /* 24px */
--space-8: 2rem;         /* 32px */
--space-12: 3rem;        /* 48px */
--space-16: 4rem;        /* 64px */
\`\`\`

## Core Components

### Layout Components

#### DashboardLayout
\`\`\`tsx
interface DashboardLayoutProps {
  children: React.ReactNode
  language: "en" | "ml"
  onLanguageChange: (lang: "en" | "ml") => void
}
\`\`\`

**Features:**
- Responsive sidebar navigation
- Header with user menu and language toggle
- Breadcrumb navigation
- Mobile-optimized drawer

#### MobileLayout
\`\`\`tsx
interface MobileLayoutProps {
  children: React.ReactNode
  title: string
  showBack?: boolean
  actions?: React.ReactNode
}
\`\`\`

**Features:**
- Touch-friendly navigation
- Bottom tab bar
- Swipe gestures
- Offline indicator

### Document Components

#### DocumentCard
\`\`\`tsx
interface DocumentCardProps {
  document: Document
  language: "en" | "ml"
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}
\`\`\`

**Features:**
- Document preview thumbnail
- Status indicators
- Action menu
- Bilingual metadata display

#### DocumentUpload
\`\`\`tsx
interface DocumentUploadProps {
  onUpload: (files: File[]) => void
  maxSize?: number
  acceptedTypes?: string[]
  multiple?: boolean
}
\`\`\`

**Features:**
- Drag and drop interface
- File type validation
- Progress indicators
- Batch upload support

#### DocumentViewer
\`\`\`tsx
interface DocumentViewerProps {
  document: Document
  language: "en" | "ml"
  showSummary?: boolean
  showTranslation?: boolean
}
\`\`\`

**Features:**
- PDF/image viewer
- Text overlay for OCR results
- Summary panel
- Translation toggle

### AI Components

#### AIChatWidget
\`\`\`tsx
interface AIChatWidgetProps {
  language: "en" | "ml"
  className?: string
}
\`\`\`

**Features:**
- Real-time chat interface
- Voice input support
- Source citations
- Bilingual responses

#### VoiceRecorder
\`\`\`tsx
interface VoiceRecorderProps {
  onRecording: (blob: Blob) => void
  language: "en" | "ml"
  maxDuration?: number
}
\`\`\`

**Features:**
- Audio recording
- Waveform visualization
- Language detection
- Transcription display

### Analytics Components

#### AnalyticsDashboard
\`\`\`tsx
interface AnalyticsDashboardProps {
  language: "en" | "ml"
  timeRange?: "7d" | "30d" | "90d"
}
\`\`\`

**Features:**
- Key metrics cards
- Interactive charts
- Department performance
- SLA tracking

#### KnowledgeGraph
\`\`\`tsx
interface KnowledgeGraphProps {
  language: "en" | "ml"
  selectedNodeId?: string
  onNodeSelect?: (node: GraphNode) => void
}
\`\`\`

**Features:**
- Interactive graph visualization
- Node filtering
- Relationship exploration
- Export capabilities

### Form Components

#### SearchBar
\`\`\`tsx
interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  filters?: FilterOption[]
  language: "en" | "ml"
}
\`\`\`

**Features:**
- Auto-complete suggestions
- Advanced filters
- Search history
- Voice search

#### LanguageToggle
\`\`\`tsx
interface LanguageToggleProps {
  language: "en" | "ml"
  onChange: (lang: "en" | "ml") => void
  className?: string
}
\`\`\`

**Features:**
- Smooth transition
- Keyboard accessible
- Visual feedback
- Persistent preference

## UI Components (shadcn/ui)

### Base Components

- **Button**: Primary, secondary, outline, ghost variants
- **Input**: Text, email, password, search types
- **Card**: Container with header, content, footer
- **Badge**: Status indicators and tags
- **Progress**: Linear progress bars
- **Tabs**: Horizontal and vertical tab navigation
- **Dialog**: Modal dialogs and confirmations
- **Dropdown**: Menu and select components
- **Toast**: Notification system
- **Tooltip**: Contextual help text

### Data Display

- **Table**: Sortable, filterable data tables
- **Avatar**: User profile images
- **Separator**: Visual content dividers
- **Accordion**: Collapsible content sections
- **Scroll Area**: Custom scrollbars

### Navigation

- **Breadcrumb**: Hierarchical navigation
- **Pagination**: Page navigation controls
- **Command**: Command palette interface

## Responsive Design

### Breakpoints

\`\`\`css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
\`\`\`

### Grid System

\`\`\`css
/* Responsive Grid Classes */
.grid-cols-1        /* 1 column */
.md:grid-cols-2     /* 2 columns on medium+ */
.lg:grid-cols-3     /* 3 columns on large+ */
.xl:grid-cols-4     /* 4 columns on extra large+ */

/* Gap Utilities */
.gap-4              /* 16px gap */
.gap-6              /* 24px gap */
.gap-8              /* 32px gap */
\`\`\`

## Accessibility Features

### ARIA Support

- Semantic HTML elements
- ARIA labels and descriptions
- Role attributes
- Live regions for dynamic content

### Keyboard Navigation

- Tab order management
- Focus indicators
- Keyboard shortcuts
- Skip links

### Screen Reader Support

- Alternative text for images
- Descriptive link text
- Form labels and instructions
- Status announcements

## Performance Optimizations

### Code Splitting

\`\`\`tsx
// Lazy load heavy components
const AnalyticsDashboard = lazy(() => import('./analytics-dashboard'))
const KnowledgeGraph = lazy(() => import('./knowledge-graph'))
\`\`\`

### Image Optimization

\`\`\`tsx
// Next.js Image component with optimization
<Image
  src="/document-thumbnail.jpg"
  alt="Document preview"
  width={200}
  height={150}
  placeholder="blur"
  priority={false}
/>
\`\`\`

### Bundle Analysis

- Tree shaking for unused code
- Dynamic imports for route-based splitting
- Webpack bundle analyzer integration
- Critical CSS extraction

## Testing Strategy

### Component Testing

\`\`\`tsx
// Jest + React Testing Library
describe('DocumentCard', () => {
  it('renders document information', () => {
    render(<DocumentCard document={mockDocument} />)
    expect(screen.getByText(mockDocument.title)).toBeInTheDocument()
  })
})
\`\`\`

### Accessibility Testing

- axe-core integration
- Keyboard navigation tests
- Screen reader compatibility
- Color contrast validation

### Visual Regression Testing

- Storybook integration
- Chromatic visual testing
- Cross-browser compatibility
- Mobile responsiveness validation
