# 🏗️ Architecture Guide

> **System design and technical architecture of InvestLearn Compass**

This document provides a comprehensive overview of the application's architecture, design patterns, and technical decisions.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Architecture Patterns](#architecture-patterns)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Authentication & Security](#authentication--security)
- [API Integration](#api-integration)
- [Performance Considerations](#performance-considerations)
- [Error Handling](#error-handling)
- [Deployment Architecture](#deployment-architecture)

---

## 🎯 System Overview

### **High-Level Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Firebase      │
│   (React App)   │◄──►│   (Separate)    │◄──►│   (Auth)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local Storage │    │   Database      │    │   File Storage  │
│   (Persistence) │    │   (User Data)   │    │   (Assets)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Technology Stack**

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend Framework** | React 18 + TypeScript | Modern UI with type safety |
| **Build Tool** | Vite | Fast development and optimized builds |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS with component library |
| **State Management** | React Query + Context API | Server state + global app state |
| **Authentication** | Firebase Auth | User management and OAuth |
| **HTTP Client** | Axios | API communication |
| **Charts** | Recharts + Chart.js | Data visualization |
| **Animations** | Framer Motion | Smooth user interactions |

---

## 🏛️ Architecture Patterns

### **1. Component-Based Architecture**

The application follows a hierarchical component structure:

```
App (Root)
├── GlobalErrorBoundary
├── QueryClientProvider
├── SessionProvider
├── AuthProvider
├── ThemeProvider
├── TooltipProvider
├── AssessmentPersistenceProvider
└── AppRoutes
    ├── Public Routes (Login, Signup, Landing)
    └── Protected Routes
        ├── AppLayout
        │   ├── AppHeader
        │   ├── AppSidebar
        │   └── Main Content
        └── Page Components
            ├── Dashboard
            ├── Assessment
            ├── Learning
            └── Profile
```

### **2. Custom Hook Pattern**

Business logic is encapsulated in custom hooks:

```typescript
// Example: useAssessmentProgress
export const useAssessmentProgress = (questions: Question[]) => {
  const [progressState, setProgressState] = useState<AssessmentProgressState>({...});
  
  const handleNext = () => { /* Navigation logic */ };
  const setCurrentQuestionIndex = (index: number) => { /* Progress logic */ };
  
  return { progressState, handleNext, setCurrentQuestionIndex };
};
```

**Benefits:**
- Reusable logic across components
- Easier testing and debugging
- Clear separation of concerns
- Consistent state management

### **3. Context Provider Pattern**

Global state is managed through React Context:

```typescript
// AuthContext - User authentication state
// SessionContext - Assessment session data
// ThemeContext - UI theme preferences
```

**Usage Pattern:**
```typescript
const { user, signInWithEmail } = useAuth();
const { session, setSession } = useSession();
const { theme, toggleTheme } = useTheme();
```

---

## 🔄 Data Flow

### **1. Assessment Flow**

```
User Input → QuestionCard → AnswerInputs → Validation → API Call → State Update
     ↓
Progress Update → Navigation → Next Question → Repeat
```

**Data Flow Details:**
1. **User Interaction**: User selects/enters answer
2. **Validation**: Client-side validation with immediate feedback
3. **API Submission**: Answer sent to backend via React Query
4. **State Update**: Local state updated with new answer
5. **Progress Update**: Progress bar and navigation updated
6. **Navigation**: Move to next question or complete assessment

### **2. Authentication Flow**

```
Login/Signup → Firebase Auth → User Object → Backend Registration → Session Creation
     ↓
Protected Route Access → User Context → App State
```

**Flow Steps:**
1. **User Authentication**: Firebase handles OAuth/email login
2. **Backend Sync**: Ensure user exists in backend database
3. **Session Management**: Create or restore user session
4. **Route Protection**: Guard protected routes
5. **State Initialization**: Load user data and preferences

### **3. Learning Content Flow**

```
Assessment Results → Learning Path Generation → Content Filtering → Module Display
     ↓
Progress Tracking → Achievement Updates → Recommendation Engine
```

---

## 🎛️ State Management

### **1. State Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Application State                        │
├─────────────────────────────────────────────────────────────┤
│  Global State (Context)  │  Server State (React Query)    │
│  ├── Auth State          │  ├── Assessment Data           │
│  ├── Session State       │  ├── Learning Content          │
│  ├── Theme State         │  ├── User Profile              │
│  └── UI State            │  └── Portfolio Data            │
├─────────────────────────────────────────────────────────────┤
│                    Local State (useState)                  │
│  ├── Form Inputs         │  ├── Component State           │
│  ├── UI Interactions     │  └── Temporary Data            │
└─────────────────────────────────────────────────────────────┘
```

### **2. React Query Integration**

**Query Keys Structure:**
```typescript
// Assessment queries
['assessment-questions']
['user-assessment', userId]
['assessment-results', sessionId]

// Learning queries
['learning-paths', assetClass]
['user-progress', userId]
['metric-content', metricId]

// User queries
['user-profile', userId]
['user-achievements', userId]
```

**Mutation Patterns:**
```typescript
const submitAnswer = useMutation({
  mutationFn: (answer: UserAnswer) => assessmentApi.submitAnswer(answer),
  onSuccess: (data) => {
    // Update local state
    // Navigate to next question
    // Update progress
  },
  onError: (error) => {
    // Handle error state
    // Show error message
  }
});
```

### **3. Local Storage Strategy**

**Persistence Layer:**
```typescript
// Custom hook with debouncing and cross-tab sync
const [data, setData, removeData] = useLocalStorage('key', initialValue, {
  debounceMs: 500
});

// Batch operations for performance
const { batchSet, batchRemove } = useLocalStorageBatch();
```

---

## 🔐 Authentication & Security

### **1. Firebase Authentication**

**Provider Configuration:**
```typescript
// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... other config
};
```

**Authentication Methods:**
- Email/Password authentication
- Google OAuth integration
- Anonymous authentication (for guest users)

### **2. Security Measures**

**Frontend Security:**
- Environment variables for sensitive data
- Input validation and sanitization
- XSS prevention through React's built-in protection
- CSRF protection via proper API design

**API Security:**
- JWT token validation
- Rate limiting
- Input validation
- SQL injection prevention

---

## 🌐 API Integration

### **1. API Client Architecture**

```typescript
// Centralized API client
export const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request/Response interceptors
apiClient.interceptors.request.use(/* Auth token injection */);
apiClient.interceptors.response.use(/* Error handling */);
```

**API Organization:**
```
src/lib/api/
├── client.ts              # Base HTTP client
├── config.ts              # API configuration
├── assessmentApi.ts       # Assessment endpoints
├── learningApi.ts         # Learning content endpoints
├── userApi.ts            # User management endpoints
└── types/                # API type definitions
```

### **2. Error Handling Strategy**

**Error Categories:**
1. **Network Errors** - Connection issues, timeouts
2. **Authentication Errors** - Invalid tokens, expired sessions
3. **Validation Errors** - Invalid input data
4. **Server Errors** - Backend processing failures

**Error Handling Pattern:**
```typescript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  if (error.response?.status === 401) {
    // Handle authentication error
    await handleAuthError();
  } else if (error.response?.status === 422) {
    // Handle validation error
    return { error: error.response.data.errors };
  } else {
    // Handle generic error
    throw new Error('An unexpected error occurred');
  }
}
```

---

## ⚡ Performance Considerations

### **1. Code Splitting Strategy**

**Route-Based Splitting:**
```typescript
// Lazy load heavy components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Learning = lazy(() => import('./pages/Learning'));
const Assessment = lazy(() => import('./pages/Assessment'));
```

**Component-Based Splitting:**
```typescript
// Lazy load chart components
const PortfolioChart = lazy(() => import('./components/PortfolioChart'));
const RiskProfileChart = lazy(() => import('./components/RiskProfileChart'));
```

### **2. Caching Strategy**

**React Query Caching:**
- **Stale Time**: How long data is considered fresh
- **Cache Time**: How long data stays in cache
- **Background Updates**: Automatic data refresh
- **Optimistic Updates**: Immediate UI updates

**Local Storage Caching:**
- User preferences and settings
- Assessment progress
- Learning content cache
- Offline capability support

### **3. Bundle Optimization**

**Vite Configuration:**
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts', 'chart.js'],
          ui: ['@radix-ui/react-*']
        }
      }
    }
  }
});
```

---

## 🚨 Error Handling

### **1. Error Boundary Strategy**

**Global Error Boundary:**
```typescript
<GlobalErrorBoundary>
  <App />
</GlobalErrorBoundary>
```

**Component Error Boundaries:**
```typescript
<ComponentErrorBoundary context="Assessment">
  <AssessmentContainer />
</ComponentErrorBoundary>
```

### **2. Error Recovery**

**Recovery Strategies:**
1. **Automatic Retry** - For transient errors
2. **Graceful Degradation** - Show fallback UI
3. **User Notification** - Clear error messages
4. **Logging & Monitoring** - Error tracking

---

## 🚀 Deployment Architecture

### **1. Build Process**

```bash
# Development build
npm run build:dev

# Production build
npm run build

# Preview build
npm run preview
```

### **2. Environment Configuration**

**Environment Variables:**
```env
# Development
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=dev_key

# Production
VITE_API_BASE_URL=https://api.investlearn.com
VITE_FIREBASE_API_KEY=prod_key
```

### **3. Deployment Options**

**Vercel (Recommended):**
- Automatic deployments from Git
- Edge functions support
- Global CDN
- Built-in analytics

**Other Platforms:**
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Custom hosting

---

## 📊 Monitoring & Analytics

### **1. Performance Monitoring**

**Web Vitals:**
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

**Custom Metrics:**
- Assessment completion time
- Learning module engagement
- API response times
- Error rates

### **2. User Analytics**

**User Behavior:**
- Feature usage patterns
- Learning path completion rates
- Assessment retake frequency
- Session duration

---

## 🔮 Future Considerations

### **1. Scalability Improvements**

- **Micro-frontend Architecture** - Independent deployment of features
- **Service Worker** - Offline capability and caching
- **WebAssembly** - Performance-critical calculations
- **Edge Computing** - Global performance optimization

### **2. Advanced Features**

- **Real-time Collaboration** - Multi-user learning sessions
- **AI-Powered Recommendations** - Machine learning insights
- **Mobile App** - React Native or PWA
- **Internationalization** - Multi-language support

---

## 📚 Additional Resources

- [Component Library](./COMPONENTS.md) - Detailed component documentation
- [Loading States Guide](./LOADING_STATES.md) - Loading component system
- [React Query Documentation](https://tanstack.com/query/latest) - Server state management
- [Firebase Documentation](https://firebase.google.com/docs) - Authentication and backend services
- [Vite Documentation](https://vitejs.dev/) - Build tool and development server

---

*Last updated: [Current Date]*
*Maintained by: InvestLearn Compass Development Team* 