# KMRL Document Assistant API Documentation

## Authentication

All API endpoints require authentication via JWT tokens. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Base URL

\`\`\`
Development: http://localhost:3000/api
Production: https://your-domain.com/api
\`\`\`

## Document Management

### Upload Document

\`\`\`http
POST /api/documents
Content-Type: multipart/form-data

{
  "file": <file>,
  "title": "Document Title",
  "description": "Document description",
  "category": "HR|Safety|Engineering|Regulatory|Operations",
  "language": "en|ml",
  "department": "department-id"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "doc-123",
    "title": "Document Title",
    "status": "processing",
    "uploadedAt": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

### Get Documents

\`\`\`http
GET /api/documents?page=1&limit=20&category=HR&status=processed&search=query
\`\`\`

**Query Parameters:**
- \`page\`: Page number (default: 1)
- \`limit\`: Items per page (default: 20, max: 100)
- \`category\`: Filter by category
- \`status\`: Filter by status (pending|processing|processed|failed)
- \`search\`: Search in title and content
- \`language\`: Filter by language (en|ml)
- \`department\`: Filter by department

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "documents": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
\`\`\`

### Get Document Details

\`\`\`http
GET /api/documents/[id]
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "doc-123",
    "title": "Document Title",
    "description": "Document description",
    "content": "Extracted text content",
    "summary": "AI-generated summary",
    "keywords": ["keyword1", "keyword2"],
    "category": "HR",
    "language": "en",
    "status": "processed",
    "uploadedBy": "user-123",
    "uploadedAt": "2024-01-01T00:00:00Z",
    "processedAt": "2024-01-01T00:05:00Z",
    "fileUrl": "/uploads/doc-123.pdf",
    "thumbnailUrl": "/uploads/doc-123-thumb.jpg"
  }
}
\`\`\`

## AI Services

### OCR Text Extraction

\`\`\`http
POST /api/ai/ocr
Content-Type: multipart/form-data

{
  "image": <image-file>,
  "language": "en|ml"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "text": "Extracted text content",
    "confidence": 0.95,
    "language": "en",
    "blocks": [
      {
        "text": "Block text",
        "confidence": 0.98,
        "boundingBox": {...}
      }
    ]
  }
}
\`\`\`

### Document Summarization

\`\`\`http
POST /api/ai/summarize
Content-Type: application/json

{
  "text": "Long document content...",
  "language": "en|ml",
  "maxLength": 200
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "summary": "Generated summary",
    "keywords": ["keyword1", "keyword2"],
    "language": "en"
  }
}
\`\`\`

### Translation

\`\`\`http
POST /api/ai/translate
Content-Type: application/json

{
  "text": "Text to translate",
  "from": "en",
  "to": "ml"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "translatedText": "Translated content",
    "originalLanguage": "en",
    "targetLanguage": "ml",
    "confidence": 0.92
  }
}
\`\`\`

### Document Classification

\`\`\`http
POST /api/ai/classify
Content-Type: application/json

{
  "text": "Document content",
  "title": "Document title"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "category": "HR",
    "confidence": 0.89,
    "suggestedDepartment": "Human Resources",
    "tags": ["policy", "employee", "benefits"]
  }
}
\`\`\`

### AI Chat

\`\`\`http
POST /api/ai/chat
Content-Type: application/json

{
  "query": "What are the safety protocols?",
  "language": "en|ml",
  "context": "optional-document-id"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "response": "AI response",
    "sources": [
      {
        "document_id": "doc-123",
        "title": "Safety Manual",
        "relevance_score": 0.95,
        "excerpt": "Relevant excerpt..."
      }
    ]
  }
}
\`\`\`

## Search

### Full-Text Search

\`\`\`http
GET /api/search?q=query&language=en&category=HR&limit=20
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "doc-123",
        "title": "Document Title",
        "excerpt": "Highlighted excerpt...",
        "score": 0.95,
        "category": "HR"
      }
    ],
    "total": 45,
    "query": "search query"
  }
}
\`\`\`

## Analytics

### Dashboard Metrics

\`\`\`http
GET /api/analytics?range=30d
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "documentStats": {...},
    "departmentStats": [...],
    "monthlyTrends": [...],
    "categoryDistribution": [...],
    "slaMetrics": {...}
  }
}
\`\`\`

### Knowledge Graph

\`\`\`http
GET /api/ai/knowledge-graph?filter=document&limit=100
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "node-1",
        "type": "document|person|department|keyword",
        "label": "Node Label",
        "metadata": {...}
      }
    ],
    "edges": [
      {
        "source": "node-1",
        "target": "node-2",
        "type": "authored|reviewed|related|mentions",
        "weight": 0.8
      }
    ]
  }
}
\`\`\`

## Error Responses

All endpoints return errors in the following format:

\`\`\`json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {...}
}
\`\`\`

### Common Error Codes

- \`UNAUTHORIZED\`: Invalid or missing authentication
- \`FORBIDDEN\`: Insufficient permissions
- \`NOT_FOUND\`: Resource not found
- \`VALIDATION_ERROR\`: Invalid request data
- \`RATE_LIMIT_EXCEEDED\`: Too many requests
- \`INTERNAL_ERROR\`: Server error

## Rate Limiting

API endpoints are rate-limited:
- Authentication: 5 requests per minute
- File uploads: 10 requests per minute
- AI services: 20 requests per minute
- General APIs: 100 requests per minute

Rate limit headers are included in responses:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
\`\`\`
