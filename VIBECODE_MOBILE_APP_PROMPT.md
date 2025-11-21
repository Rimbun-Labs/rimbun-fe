# 📱 Vibecode Mobile App Development Prompt

## InvestLearn Compass - Mobile Application Recreation

This document provides a comprehensive guide for recreating the InvestLearn Compass web application as a native mobile app using Vibecode.

### ⚠️ CRITICAL: Backend Connection

**The mobile app connects to the SAME backend API as the web application.** 

- **Backend URL**: 
  - **Development**: `http://localhost:3001/api/v1` (use `10.0.2.2` for Android emulator)
  - **Production**: Set via environment variable (e.g., `https://api.investlearn.com/api/v1`)
- **Authentication**: Firebase JWT tokens (same authentication system as web)
- **API Endpoints**: All endpoints prefixed with `/api/v1/`
- **No separate backend needed**: Both web and mobile apps share the same REST API infrastructure
- **Same database**: User data, assessments, and learning progress are shared between web and mobile

**Key Points:**
- Users logged in on web can use the same account on mobile (and vice versa)
- Assessment results sync across platforms
- Learning progress is shared between web and mobile
- All data is stored in the same backend database

See the [API Integration](#-api-integration) section below for detailed endpoint documentation.

---

## 🎯 Application Overview

**InvestLearn Compass** is an investment education platform that helps users build investment confidence through:
- Personalized investment assessments
- Interactive learning modules and paths
- Portfolio insights and analytics
- Scenario-based learning
- Financial planning tools

### Core Value Proposition
A comprehensive investment education platform combining personalized assessments, scenario-based learning, and portfolio insights to develop financial literacy and investment confidence.

---

## 🏗️ Architecture & Technology Stack

### Current Web Stack (Reference)
- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM v6
- **State Management**: 
  - React Query (TanStack Query) for server state
  - Context API for global state (Auth, Session, Theme, Subscription)
- **Authentication**: Firebase Authentication
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts + Chart.js
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod validation

### Mobile App Recommendations
- **Framework**: React Native (via Vibecode)
- **Navigation**: React Navigation v6
- **State Management**: 
  - React Query (TanStack Query) - same as web
  - Context API for global state
  - AsyncStorage for local persistence
- **Authentication**: Firebase Authentication SDK for React Native
- **Styling**: React Native StyleSheet or styled-components
- **Charts**: react-native-chart-kit or Victory Native
- **UI Components**: React Native Paper or NativeBase
- **HTTP Client**: Axios (same as web)

---

## 📱 Application Structure & Navigation

### Navigation Hierarchy

```
App Navigation (Stack Navigator)
│
├── Auth Stack (for unauthenticated users)
│   ├── Landing Page (/)
│   ├── Login (/login)
│   ├── Signup (/signup)
│   ├── Email Confirmation (/signup/check-email)
│   ├── Forgot Password (/forgot-password)
│   └── Reset Password (/reset-password)
│
└── Main App (Tab Navigator + Stack Navigator for authenticated users)
    │
    ├── Home Tab (Dashboard)
    │   └── Dashboard Stack
    │       ├── Dashboard Home (/dashboard)
    │       ├── Dashboard with Session (/dashboard/:sessionId)
    │       └── Assessment Results (/assessment-results)
    │
    ├── Assessment Tab
    │   └── Assessment Flow (/assessment)
    │
    ├── Learning Tab
    │   └── Learning Stack
    │       ├── Learning Library (/learning)
    │       ├── Folder View (/learning/:folderId)
    │       ├── Content Detail (/learning/asset-classes/:assetClass)
    │       ├── Metric Detail (/learning/metrics/:metricId)
    │       ├── Learning Paths (/learning-path/:sessionId)
    │       └── Learning Path Detail (/learning-path/:sessionId/:assetClass)
    │
    ├── Explorer Tab
    │   └── Investment Explorer (/investment-explorer/:sessionId)
    │
    └── Profile Tab
        └── Profile Stack
            ├── Profile (/profile)
            ├── Spending Analysis (/spending-analysis)
            ├── Cash Flow Projections (/cash-flow-projections)
            └── Bank Analytics (/analytics) - conditional
```

---

## 🔑 Core Features & Functionality

### 1. Authentication System

#### Pages Required
1. **Landing Page** (`/`)
   - Hero section with value proposition
   - Features showcase
   - Dashboard preview
   - CTA buttons (Sign Up / Login)
   - Navigation to Login/Signup

2. **Login Page** (`/login`)
   - Email and password input fields
   - "Forgot Password?" link
   - "Sign in with Google" button
   - "Don't have an account? Sign up" link
   - Form validation with error messages
   - Loading states during authentication

3. **Signup Page** (`/signup`)
   - Full name input
   - Email input
   - Password input (with strength indicator)
   - "Sign up with Google" button
   - Terms of Service and Privacy Policy checkboxes
   - Form validation
   - Redirect to email confirmation page on success

4. **Email Confirmation Page** (`/signup/check-email`)
   - Instruction to check email
   - Resend verification email button
   - Link back to login

5. **Forgot Password Page** (`/forgot-password`)
   - Email input
   - Submit button
   - Success message display
   - Link back to login

6. **Reset Password Page** (`/reset-password`)
   - New password input
   - Confirm password input
   - Submit button
   - Success message and redirect to login

#### Authentication Flow
```
1. User signs up → Firebase creates account
2. Backend registration (ensure user exists in database)
3. Email verification sent
4. User verifies email → Full access granted
5. Session created on backend
6. User data loaded into app state
```

#### Key Components Needed
- Email input with validation
- Password input with visibility toggle
- Google OAuth button
- Form validation with Zod schema
- Error message display
- Loading indicators
- Email verification banner (shown in app after login if unverified)

---

### 2. Assessment System

#### Assessment Flow
1. **Assessment Start Page**
   - Welcome message
   - Assessment overview/instructions
   - "Start Assessment" button
   - Resume option if incomplete assessment exists

2. **Assessment Questions**
   - Question-by-question display
   - Progress indicator (progress bar)
   - Category-based organization (Risk, Knowledge, Goals, etc.)
   - Multiple answer types:
     - Radio buttons (single choice)
     - Checkboxes (multiple choice)
     - Sliders (numeric ranges)
     - Text inputs
     - Number inputs
   - Previous/Next navigation
   - Save progress functionality

3. **Assessment Complete**
   - Completion message
   - Results loading indicator
   - Navigate to results page

#### Key Features
- Progress persistence (auto-save)
- Resume incomplete assessments
- Retake assessment option
- Progress tracking across categories
- Answer validation
- Session management

#### Components Required
- `QuestionCard` - Display individual question
- `AnswerInputs` - Dynamic input components based on question type
- `ProgressBar` - Visual progress indicator
- `AssessmentContainer` - Main wrapper
- `AssessmentStartPage` - Initial screen
- `AssessmentComplete` - Completion screen

---

### 3. Dashboard

#### Dashboard Sections

1. **Welcome Section** (Collapsible)
   - Personalized greeting
   - Assessment completion status
   - Quick actions (Start Assessment, View Results)

2. **Risk Profile Section** (Collapsible)
   - Risk score visualization (chart)
   - Risk level badge (Conservative, Moderate, Aggressive)
   - Risk style explanation
   - Knowledge level indicator
   - Decision style categorization

3. **Portfolio Allocation Section** (Collapsible)
   - Interactive pie chart showing asset allocation
   - Asset breakdown:
     - Equities percentage
     - Bonds percentage
     - Real Estate percentage
     - Cash percentage
   - Direct input controls (adjustable percentages)
   - Asset class explanations (on tap)
   - Allocation strategy explanation

4. **Investment Insights Section** (Collapsible)
   - Recommended metrics with weights
   - Diversification analysis
   - Investment scenarios (What-if calculator)
   - Correlation insights

5. **Spending Analysis Section** (Collapsible)
   - Spending overview chart
   - Emergency fund analysis
   - Spending recommendations
   - Monthly spending breakdown

6. **Cash Flow Projections Section** (Collapsible)
   - Cash flow summary chart
   - Income vs expenses visualization
   - Projection timeline

7. **Learning Progress Section**
   - Progress indicators for learning paths
   - Recommended learning modules
   - Quick access to learning content

#### Components Required
- `DashboardHeader` - User info and navigation
- `PortfolioAllocation` - Pie chart with interactive controls
- `RiskProfileChart` - Risk visualization
- `DirectInputs` - Asset allocation input controls
- `RecommendedMetrics` - Metrics grid display
- `DiversificationAnalysis` - Diversification insights
- `InvestmentScenarios` - Scenario calculator
- `SpendingOverview` - Spending charts
- `EmergencyFundAnalysis` - Emergency fund metrics
- `CashFlowSummary` - Cash flow visualization
- Collapsible section components with expand/collapse

#### Charts Needed
- Pie/Doughnut chart (Portfolio allocation)
- Bar chart (Risk profile)
- Line chart (Cash flow projections)
- Progress indicators

---

### 4. Learning System

#### Learning Library Structure

**Main Learning Page** (`/learning`)
- Folder grid/list view
- Search functionality
- Categories:
  1. Asset Classes (4 modules: Equities, Bonds, Real Estate, Cash)
  2. Investment Metrics (extensive metric library)
  3. Risk Management (6 modules)
  4. Market Analysis (8 modules)
  5. Portfolio Optimization (5 modules)
  6. Islamic Finance (6 modules)
  7. ESG Investing (7 modules)
  8. Retirement Planning (6 modules)
  9. Financial Planning (6 modules)
  10. Value & Growth Investing (5 modules)
  11. Economic Fundamentals (6 modules)
  12. Behavioral Finance (4 modules)

**Folder View** (`/learning/:folderId`)
- Module list within folder
- Module cards with:
  - Title and description
  - Estimated time
  - Completion status
  - Progress indicator

**Content Detail** (`/learning/*/:moduleId`)
- Content display:
  - Introduction section
  - Key concepts
  - Detailed explanations
  - Examples and scenarios
  - Interactive quizzes (optional)
- Navigation:
  - Previous/Next module
  - Back to folder
- Progress tracking
- Bookmark functionality

**Learning Paths** (`/learning-path/:sessionId`)
- Personalized learning paths based on assessment
- Asset class-specific paths
- Progress tracking
- Completion certificates

#### Components Required
- `LearningFolderGrid` - Folder display
- `ModuleCard` - Individual module display
- `ContentViewer` - Content display with formatting
- `QuizSection` - Interactive quizzes
- `ProgressTracker` - Learning progress
- `BookmarkButton` - Save content
- Search bar component

---

### 5. Investment Explorer

#### Features
- Asset analyzer with search
- Comparison view between assets
- Educational mode with explanations
- Score cards showing metrics
- Metrics grid visualization
- Filter and sort options

#### Components Required
- `AssetSearch` - Search functionality
- `AssetAnalysis` - Asset detail view
- `ComparisonView` - Side-by-side comparison
- `ScoreCards` - Metrics display
- `MetricsGrid` - Metrics visualization
- `EducationalMode` - Explanatory content

---

### 6. Profile & Settings

#### Profile Page Sections
1. **User Information**
   - Display name
   - Email address
   - Email verification status
   - Profile picture

2. **Account Management**
   - Change password
   - Update email
   - Delete account

3. **Preferences**
   - Theme toggle (Light/Dark)
   - Notification settings
   - Language preferences

4. **Subscription Management** (if applicable)
   - Current plan
   - Upgrade/downgrade options
   - Billing information

5. **Data Management**
   - Export data
   - Delete all data
   - Assessment history

6. **About**
   - App version
   - Terms of Service link
   - Privacy Policy link
   - Logout button

---

### 7. Spending Analysis

#### Features
- Spending overview with charts
- Category breakdown
- Monthly trends
- Emergency fund analysis
- Spending recommendations
- Budget planning tools

---

### 8. Cash Flow Projections

#### Features
- Income vs expenses chart
- Projection timeline
- Cash flow summary
- Adjustable projections
- Visualizations (line charts, bar charts)

---

## 🎨 Design System & UI Components

### Color Scheme
- **Primary Colors**: Based on brand identity (check existing app)
- **Semantic Colors**:
  - Success: Green
  - Warning: Yellow/Orange
  - Error: Red
  - Info: Blue
- **Neutral Colors**: Gray scale for text and backgrounds
- **Dark Mode**: Full dark mode support

### Typography
- **Headings**: Bold, various sizes (H1-H4)
- **Body**: Regular weight, readable sizes
- **Labels**: Medium weight, smaller sizes
- **Captions**: Light weight, smallest sizes

### Component Library Needed
Based on shadcn/ui (mobile equivalents):
- Button (primary, secondary, outline, ghost variants)
- Card (with header, content, footer)
- Input (text, number, email, password)
- Select/Dropdown
- Checkbox
- Radio buttons
- Slider
- Progress bar
- Badge
- Toast notifications
- Dialog/Modal
- Sheet/Drawer
- Tabs
- Accordion/Collapsible
- Loading spinner
- Skeleton loader
- Avatar
- Tooltip
- Switch/Toggle

### Layout Components
- Container/View wrapper
- Header with navigation
- Bottom tab bar
- Sidebar (if needed for tablet)
- Screen wrapper with safe area handling

### Charts & Visualizations
- Pie/Doughnut chart
- Bar chart (horizontal and vertical)
- Line chart
- Area chart
- Progress indicators
- Gauge charts

---

## 🔄 State Management Architecture

### Global State (Context API)

1. **AuthContext**
   - `user`: Firebase user object
   - `loading`: Authentication loading state
   - `userRegistrationComplete`: Registration status
   - Functions:
     - `signInWithEmail(email, password)`
     - `signInWithGoogle()`
     - `signUp(email, password, fullName)`
     - `signOut()`

2. **SessionContext**
   - `session`: Current assessment session
   - `sessionId`: Active session ID
   - `hasCompletedAssessment()`: Check completion status
   - Functions:
     - `setSession(session)`
     - `setSessionId(id)`
     - `createSession()`

3. **ThemeContext**
   - `theme`: 'light' | 'dark'
   - `toggleTheme()`

4. **SubscriptionContext**
   - `subscription`: User subscription data
   - `isPremium`: Boolean
   - Functions:
     - `checkSubscription()`
     - `updateSubscription()`

### Server State (React Query)

Query Keys Structure:
```
['assessment-questions']
['user-assessment', userId]
['assessment-results', sessionId]
['learning-paths', assetClass]
['user-progress', userId]
['metric-content', metricId]
['user-profile', userId]
['user-achievements', userId]
['recommendations', sessionId]
['spending-data', userId]
['cash-flow-data', userId]
```

Mutations:
- `submitAnswer(answer)`
- `createSession()`
- `updateProfile(data)`
- `updateSpending(data)`
- `updateCashFlow(data)`

---

## 🌐 API Integration

### ⚠️ IMPORTANT: Backend Connection

**The mobile app connects to the SAME backend as the web application.** No separate backend is needed. Both web and mobile apps share the same REST API.

### Base API Configuration

**Backend Base URL Structure:**
- **Development**: `http://localhost:3001/api/v1`
- **Production**: Set via environment variable (e.g., `https://api.investlearn.com/api/v1`)

**Authentication Method:**
- Firebase JWT tokens passed as Bearer tokens in Authorization header
- Token format: `Authorization: Bearer <firebase-id-token>`
- Tokens auto-refresh via Firebase SDK

**API Path Structure:**
All endpoints are prefixed with `/api/v1/` (e.g., `/api/v1/users/register`)

### Actual API Endpoints (From Codebase)

#### Authentication & User Management
```
POST   /api/v1/users/register
       Body: { authProviderId, displayName, email, username, authProviderType: 'firebase' }
       Response: { data: { id: string, displayName, email, authProviderId } }

GET    /api/v1/users/me/{firebaseUid}
       Headers: Authorization: Bearer <token>
       Response: User profile data

PUT    /api/v1/users/me/{firebaseUid}
       Headers: Authorization: Bearer <token>
       Body: { displayName?, email? }
       Response: Updated user profile

GET    /api/v1/users/me
       Headers: Authorization: Bearer <token>
       Response: Current user profile

GET    /api/v1/users/me/export
       Headers: Authorization: Bearer <token>
       Response: User data export (JSON file download)

GET    /api/v1/users/profile-picture
       Headers: Authorization: Bearer <token>
       Response: Profile picture URL

GET    /api/v1/users/{userId}/assessments
       Response: User's assessment history
```

#### Assessment APIs
```
GET    /api/v1/questionnaire/questions
       Response: Array of assessment questions

POST   /api/v1/user-responses/answer
       Body: { sessionId, questionId, answer, userId }
       Response: Success confirmation

GET    /api/v1/user-responses/session/{sessionId}/questions-answers
       Response: Session questions and answers

GET    /api/v1/user-responses/session/{sessionId}/resume
       Response: Resume data for incomplete assessment

GET    /api/v1/user-responses/user/{databaseUserId}/sessions
       Response: Array of user sessions

POST   /api/v1/user-responses/session
       Body: { userId }
       Response: { sessionId: string }

GET    /api/v1/assessment/response-group/{sessionId}/score
       Response: { scoreData: { riskProfile, knowledgeLevel, portfolioAllocation, ... } }

GET    /api/v1/recommendations/{sessionId}
       Response: { data: { recommendations: Recommendation[] } }
```

#### Learning & Content APIs
```
GET    /api/v1/quiz/progress?userId={firebaseUid}
       Response: Quiz progress data

GET    /api/v1/quiz/{assetClass}/history
       Response: Quiz attempt history

GET    /api/v1/quiz/questions?assetClass={assetClass}&profile={profile}
       Response: { questions: Question[], profile?: string }

POST   /api/v1/quiz/submit
       Body: { userId, assetClass, answers, score }
       Response: Quiz progress data
```

**Note:** Learning paths and content are currently stored client-side in TypeScript files:
- `src/lib/api/types/learningPaths.ts` - Learning path definitions
- `src/lib/api/types/metricContent.ts` - Metric content definitions

For mobile app, these can either be:
1. Loaded from the same TypeScript files (if bundled)
2. Served via API endpoints (recommended for mobile)

#### Spending Analysis APIs
```
GET    /api/v1/spending/analysis?userId={firebaseUid}
       Response: { data: SpendingAnalysisDto }

POST   /api/v1/spending/analysis
       Body: { userId, monthlyIncome, monthlyExpenses, emergencyFund, ... }
       Response: Updated spending analysis

GET    /api/v1/spending/categories?userId={firebaseUid}
       Response: { data: SpendingCategoryDto[] }

POST   /api/v1/spending/categories
       Body: { userId, name, amount, ... }
       Response: Created category

PUT    /api/v1/spending/categories/{id}
       Body: { name?, amount?, ... }
       Response: Updated category

DELETE /api/v1/spending/categories/{id}?userId={firebaseUid}
       Response: Success confirmation

GET    /api/v1/spending/recommendations?userId={firebaseUid}
       Response: { data: SpendingRecommendationDto }
```

#### Cash Flow APIs
```
GET    /api/v1/cash-flow/projections?userId={firebaseUid}
       Response: { data: CashFlowProjectionsDto }

POST   /api/v1/cash-flow/projections
       Body: { userId, income, expenses, projections }
       Response: Updated cash flow data
```

#### Subscription APIs
```
GET    /api/v1/subscription/me
       Headers: Authorization: Bearer <token>
       Response: { subscription: SubscriptionData, isPremium: boolean }
```

#### Bank Analytics APIs (Conditional - requires permissions)
```
GET    /api/v1/bank/permissions/check
       Response: { hasPermission: boolean }

GET    /api/v1/bank/customers/insights
       Response: Bank customer insights data
```

#### Chat APIs (Enhanced Chat Feature)
```
POST   /api/v1/chat/{userId}/send
       Body: { message, context? }
       Response: { response: string, insights? }

GET    /api/v1/chat/{userId}/messages
       Response: { data: ChatMessageDto[] }

GET    /api/v1/chat/{userId}/conversation
       Response: { data: ConversationSummary }

DELETE /api/v1/chat/{userId}/conversation
       Response: Success confirmation

POST   /api/v1/chat/test
       Body: { message }
       Response: Test chat response
```

#### Asset Analyzer APIs
```
GET    /api/v1/asset-analyzer/search?query={query}
       Response: { results: AssetSearchResult[] }

GET    /api/v1/asset-analyzer/{assetId}
       Response: Asset analysis data

POST   /api/v1/asset-analyzer/compare
       Body: { assetIds: string[] }
       Response: Comparison data
```

### API Client Setup for React Native

```typescript
// services/apiClient.ts
import axios from 'axios';
import auth from '@react-native-firebase/auth'; // or Firebase JS SDK

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api/v1'  // Development
  : 'https://api.investlearn.com/api/v1'; // Production

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request Interceptor - Add Firebase JWT token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get current Firebase user
      const user = auth().currentUser;
      
      if (user) {
        // Get fresh token (Firebase SDK auto-refreshes if needed)
        const idToken = await user.getIdToken();
        config.headers.Authorization = `Bearer ${idToken}`;
      } else {
        // Check for stored token as fallback
        const storedToken = await AsyncStorage.getItem('firebaseIdToken');
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
      }
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response) {
      // Handle 401 Unauthorized - Token expired or invalid
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // Try to refresh token
        try {
          const user = auth().currentUser;
          if (user) {
            const newToken = await user.getIdToken(true); // Force refresh
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Token refresh failed - redirect to login
          // Navigate to login screen
          return Promise.reject(refreshError);
        }
      }
      
      // Handle 422 Validation Errors
      if (error.response.status === 422) {
        // Return validation errors to caller
        return Promise.reject({
          ...error,
          validationErrors: error.response.data.errors,
        });
      }
      
      // Handle 500 Server Errors
      if (error.response.status >= 500) {
        // Show user-friendly error message
        return Promise.reject({
          ...error,
          message: 'Server error. Please try again later.',
        });
      }
    }
    
    // Network errors
    if (!error.response) {
      return Promise.reject({
        ...error,
        message: 'Network error. Please check your connection.',
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Environment Configuration

Create environment-specific config files:

```typescript
// config/env.ts

// NOTE: For mobile simulators/emulators, localhost connections differ:
// - iOS Simulator: Use 'localhost' or '127.0.0.1'
// - Android Emulator: Use '10.0.2.2' (special alias to host machine's localhost)
// - Physical device: Use your computer's local IP address (e.g., '192.168.1.100')

const getLocalhostUrl = () => {
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to reach host machine
    return 'http://10.0.2.2:3001/api/v1';
  }
  // iOS simulator can use localhost
  return 'http://localhost:3001/api/v1';
};

export const ENV = {
  API_BASE_URL: __DEV__
    ? getLocalhostUrl() // Use platform-specific localhost
    : process.env.API_BASE_URL || 'https://api.investlearn.com/api/v1',
  
  FIREBASE_CONFIG: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    // ... other Firebase config
  },
};
```

**Important Notes for Local Development:**
- **Physical Device Testing**: Use your computer's local IP address (find via `ifconfig` on Mac/Linux or `ipconfig` on Windows)
- **Example**: `http://192.168.1.100:3001/api/v1`
- **Production**: Always use HTTPS endpoints

### Error Handling Pattern

```typescript
// Example API call with error handling
try {
  const response = await apiClient.get('/users/me');
  return response.data;
} catch (error: any) {
  if (error.response?.status === 401) {
    // Handle authentication error - redirect to login
    navigation.navigate('Login');
  } else if (error.validationErrors) {
    // Handle validation errors
    showValidationErrors(error.validationErrors);
  } else {
    // Handle generic error
    showErrorToast(error.message || 'An error occurred');
  }
  throw error;
}
```

---

## 📱 Mobile-Specific Considerations

### 1. Navigation
- **Bottom Tab Navigator**: For main sections (Dashboard, Learning, Explorer, Profile)
- **Stack Navigator**: For nested screens within each tab
- **Deep Linking**: Support app links for sharing content

### 2. Responsive Design
- **Small screens** (iPhone SE): Optimized layouts, scrollable content
- **Large screens** (iPhone Pro Max, iPad): Utilize extra space efficiently
- **Orientation**: Support both portrait and landscape (where appropriate)

### 3. Touch Interactions
- **Swipe gestures**: Navigate between questions in assessment
- **Pull to refresh**: Refresh dashboard data
- **Long press**: Context menus
- **Swipeable cards**: For lists

### 4. Performance
- **Lazy loading**: Load images and heavy components on demand
- **Image optimization**: Compress and cache images
- **List virtualization**: For long lists (FlatList with virtualization)
- **Code splitting**: Load screens on demand

### 5. Offline Support
- **Cache API responses**: Store recent data locally
- **Offline queue**: Queue API calls when offline
- **Sync on reconnect**: Sync pending changes when back online
- **Local storage**: Persist user preferences and progress

### 6. Push Notifications
- **Assessment reminders**: Remind users to complete assessments
- **Learning updates**: New content notifications
- **Progress milestones**: Celebrate achievements

### 7. Platform-Specific Features
- **iOS**: Haptic feedback, Face ID/Touch ID
- **Android**: Material Design guidelines, Android back button handling
- **Biometric auth**: Quick login option

---

## 🎯 Key User Flows

### Flow 1: New User Onboarding
```
1. Launch app → Landing page
2. Tap "Sign Up" → Signup page
3. Fill form → Submit
4. Email verification page → Verify email
5. Auto login → Assessment prompt
6. Start assessment → Complete questions
7. View results → Dashboard
8. Explore learning content
```

### Flow 2: Returning User
```
1. Launch app → Check auth
2. Auto login → Dashboard (if completed assessment)
3. Or → Assessment (if incomplete)
4. Navigate to Learning tab
5. Explore content → View details
6. Track progress
```

### Flow 3: Assessment Retake
```
1. Profile → Assessment history
2. Tap "Retake Assessment"
3. Confirm → Start new assessment
4. Complete → New results
5. Compare with previous results
```

### Flow 4: Learning Path
```
1. Dashboard → View recommended learning path
2. Tap "Start Learning Path"
3. Learning tab → Asset class module
4. Read content → Complete module
5. Next module → Continue path
6. Complete path → Certificate/achievement
```

---

## 🔐 Security Considerations

1. **Authentication**
   - Secure token storage (use secure storage APIs)
   - Token refresh mechanism
   - Biometric authentication option

2. **Data Protection**
   - Encrypt sensitive data in local storage
   - Secure API communication (HTTPS only)
   - Input validation and sanitization

3. **Privacy**
   - Clear privacy policy
   - User data export
   - Account deletion option
   - GDPR compliance considerations

---

## 📊 Data Models

### User Model
```typescript
{
  id: string;
  authProviderId: string; // Firebase UID
  email: string;
  displayName: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Assessment Session Model
```typescript
{
  id: string;
  userId: string;
  status: 'in_progress' | 'completed';
  startedAt: string;
  completedAt?: string;
  answers: Record<string, any>;
}
```

### Assessment Results Model
```typescript
{
  sessionId: string;
  riskProfile: {
    score: number;
    level: string;
    style: string;
  };
  portfolioAllocation: {
    equities: number;
    bonds: number;
    realEstate: number;
    cash: number;
  };
  recommendations: Recommendation[];
}
```

### Learning Progress Model
```typescript
{
  userId: string;
  moduleId: string;
  completed: boolean;
  progress: number; // 0-100
  lastAccessed: string;
}
```

---

## 🚀 Implementation Priority

### Phase 1: Core Features (MVP)
1. ✅ Authentication (Login, Signup, Password Reset)
2. ✅ Assessment flow (Questions, Progress, Results)
3. ✅ Basic Dashboard (Risk Profile, Portfolio Allocation)
4. ✅ Navigation structure
5. ✅ Profile page

### Phase 2: Enhanced Features
1. ✅ Learning Library (Browse, View Content)
2. ✅ Learning Paths (Personalized paths)
3. ✅ Investment Explorer
4. ✅ Spending Analysis
5. ✅ Cash Flow Projections

### Phase 3: Polish & Optimization
1. ✅ Animations and transitions
2. ✅ Offline support
3. ✅ Push notifications
4. ✅ Performance optimization
5. ✅ Advanced charts and visualizations

---

## 📝 Development Guidelines

### Code Structure
```
src/
├── components/        # Reusable components
│   ├── ui/          # Base UI components
│   ├── auth/        # Auth components
│   ├── assessment/  # Assessment components
│   ├── dashboard/   # Dashboard components
│   └── learning/    # Learning components
├── screens/         # Screen components (pages)
├── navigation/      # Navigation setup
├── contexts/        # Context providers
├── hooks/           # Custom hooks
├── services/        # API services
├── utils/           # Utility functions
├── types/           # TypeScript types
└── constants/       # App constants
```

### Naming Conventions
- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase starting with "use" (`useAuth.ts`)
- Services: camelCase (`authService.ts`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Types: PascalCase (`User`, `AssessmentResult`)

### Best Practices
- Use TypeScript for type safety
- Implement error boundaries
- Add loading states for async operations
- Handle edge cases and errors gracefully
- Optimize images and assets
- Test on multiple device sizes
- Follow platform-specific design guidelines

---

## 🧪 Testing Checklist

### Authentication
- [ ] Login with email/password
- [ ] Sign up with email/password
- [ ] Google OAuth login
- [ ] Password reset flow
- [ ] Email verification
- [ ] Logout functionality
- [ ] Session persistence

### Assessment
- [ ] Start new assessment
- [ ] Answer all question types
- [ ] Progress persistence
- [ ] Resume incomplete assessment
- [ ] Retake assessment
- [ ] View results

### Dashboard
- [ ] Load dashboard data
- [ ] Display risk profile
- [ ] Display portfolio allocation
- [ ] Adjust portfolio percentages
- [ ] View recommendations
- [ ] Collapse/expand sections

### Learning
- [ ] Browse learning library
- [ ] View module content
- [ ] Track progress
- [ ] Complete modules
- [ ] Navigate learning paths
- [ ] Search functionality

### Navigation
- [ ] Bottom tab navigation
- [ ] Stack navigation within tabs
- [ ] Deep linking
- [ ] Back button handling

### Performance
- [ ] App launch time
- [ ] Screen transition smoothness
- [ ] Image loading optimization
- [ ] List scrolling performance
- [ ] Memory usage

---

## 📚 Additional Resources

### Design References
- Check existing web app for design patterns
- Material Design guidelines (Android)
- Human Interface Guidelines (iOS)

### API Documentation
- Refer to existing API documentation
- Backend API endpoints reference
- Authentication flow documentation

### Component Examples
- Review web app components for behavior reference
- Check shadcn/ui documentation for component patterns

---

## 🎯 Success Criteria

The mobile app should:
1. ✅ Provide all core features from web app
2. ✅ Maintain consistent user experience
3. ✅ Perform well on mobile devices
4. ✅ Support offline functionality
5. ✅ Handle errors gracefully
6. ✅ Provide intuitive navigation
7. ✅ Maintain brand consistency
8. ✅ Support both iOS and Android
9. ✅ Handle authentication securely
10. ✅ Sync data with backend API

---

## 📞 Integration Notes

### Backend API
- Use same API endpoints as web app
- Maintain consistent request/response formats
- Handle authentication tokens properly
- Implement proper error handling

### Firebase
- Configure Firebase for React Native
- Set up Firebase Authentication
- Configure project settings for mobile

### Environment Variables
```
API_BASE_URL=https://api.investlearn.com
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id
```

---

## 🔄 Migration Considerations

When recreating in Vibecode:
1. **Start with authentication** - Foundation for everything else
2. **Build navigation structure** - Establish app flow
3. **Implement core screens** - Dashboard, Assessment, Learning
4. **Add API integration** - Connect to existing backend
5. **Polish UI/UX** - Make it mobile-native
6. **Add advanced features** - Spending, Cash Flow, Explorer
7. **Optimize performance** - Ensure smooth experience
8. **Test thoroughly** - All user flows and edge cases

---

## 💡 Tips for Vibecode Implementation

1. **Reuse Logic**: Where possible, reuse business logic from web app (API calls, data transformations)
2. **Mobile-First UI**: Redesign UI components for mobile, don't just shrink web components
3. **Touch Optimization**: Ensure all interactive elements are touch-friendly (minimum 44x44pt)
4. **Loading States**: Show loading indicators for all async operations
5. **Error Handling**: Display user-friendly error messages
6. **Accessibility**: Follow mobile accessibility guidelines
7. **Performance**: Profile and optimize slow screens
8. **Testing**: Test on real devices, not just simulators

---

**End of Prompt Document**

---

*This prompt provides comprehensive guidance for recreating the InvestLearn Compass web application as a mobile app. Use this as a reference during development in Vibecode.*
