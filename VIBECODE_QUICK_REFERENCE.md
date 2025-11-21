# 📱 Vibecode Quick Reference Guide

## InvestLearn Compass Mobile App - Quick Implementation Guide

---

## 🎯 Core Pages (Priority Order)

### 1. Authentication Flow (Start Here)
- ✅ Landing Page → Login/Signup
- ✅ Login Screen
- ✅ Signup Screen
- ✅ Email Verification Screen
- ✅ Forgot Password Flow

### 2. Main App Tabs
- ✅ Dashboard Tab (Home)
- ✅ Assessment Tab
- ✅ Learning Tab
- ✅ Profile Tab

---

## 🔑 Key Features Per Tab

### Dashboard Tab
- Welcome section with assessment prompt
- Risk profile chart
- Portfolio allocation (Pie chart + inputs)
- Recommendations section
- Spending overview
- Cash flow summary

### Assessment Tab
- Start page with instructions
- Question-by-question flow
- Progress bar
- Multiple answer types (radio, checkbox, slider, text)
- Results page

### Learning Tab
- Library browser (folder grid)
- Module content viewer
- Learning paths
- Progress tracking
- Search functionality

### Profile Tab
- User information
- Settings
- Account management
- Assessment history
- Logout

---

## 📊 Required Charts

1. **Pie Chart** - Portfolio allocation
2. **Bar Chart** - Risk profile
3. **Line Chart** - Cash flow projections
4. **Progress Bars** - Assessment & learning progress

---

## 🎨 Essential UI Components

- Button (multiple variants)
- Card
- Input (text, password, number)
- Select/Dropdown
- Checkbox
- Radio buttons
- Slider
- Progress bar
- Badge
- Toast notifications
- Modal/Dialog
- Tabs
- Accordion/Collapsible

---

## 🔄 State Management Setup

### Contexts Needed
1. **AuthContext** - User authentication
2. **SessionContext** - Assessment session
3. **ThemeContext** - Dark/light mode
4. **SubscriptionContext** - User subscription

### React Query Setup
- Query client configuration
- Query keys structure
- Mutations for data updates

---

## 🌐 Backend Connection

### ⚠️ IMPORTANT
**The mobile app connects to the SAME backend as the web app.**

- **Backend Base URL**: `http://localhost:3001/api/v1` (dev) or production URL
- **Authentication**: Firebase JWT tokens (Bearer token in Authorization header)
- **All endpoints prefixed with**: `/api/v1/`

### API Endpoints Required (All prefixed with /api/v1/)

```
Authentication & Users:
POST   /users/register              # Register new user
GET    /users/me/{firebaseUid}       # Get user profile
PUT    /users/me/{firebaseUid}       # Update profile

Assessment:
GET    /questionnaire/questions      # Get assessment questions
POST   /user-responses/answer        # Submit answer
GET    /assessment/response-group/{sessionId}/score  # Get results
POST   /user-responses/session       # Create session

Learning:
GET    /quiz/progress?userId={uid}   # Quiz progress
POST   /quiz/submit                  # Submit quiz

Recommendations:
GET    /recommendations/{sessionId}  # Get recommendations

Spending:
GET    /spending/analysis?userId={uid}
POST   /spending/analysis

Cash Flow:
GET    /cash-flow/projections?userId={uid}
POST   /cash-flow/projections
```

---

## 📱 Navigation Structure

```
Bottom Tabs:
├── Dashboard
├── Assessment  
├── Learning
└── Profile

Each Tab has Stack Navigator:
├── Dashboard Stack (Dashboard → Results)
├── Assessment Stack (Assessment Flow)
├── Learning Stack (Library → Folders → Content)
└── Profile Stack (Profile → Settings)
```

---

## 🚀 Implementation Steps

1. **Setup**
   - Configure React Native project
   - Setup navigation
   - Configure Firebase
   - Setup API client

2. **Authentication**
   - Landing page
   - Login/Signup screens
   - Auth context
   - Protected routes

3. **Assessment**
   - Question components
   - Answer inputs
   - Progress tracking
   - Results display

4. **Dashboard**
   - Layout structure
   - Charts integration
   - Data fetching
   - Interactive controls

5. **Learning**
   - Library browser
   - Content viewer
   - Progress tracking
   - Search

6. **Polish**
   - Error handling
   - Loading states
   - Animations
   - Testing

---

## 🎨 Design Notes

- **Primary Color**: Use brand color from web app
- **Dark Mode**: Full support required
- **Typography**: Clear hierarchy (H1-H4, body, caption)
- **Spacing**: Consistent padding/margins
- **Touch Targets**: Minimum 44x44pt
- **Safe Areas**: Handle notches and system UI

---

## ⚠️ Important Considerations

1. **Authentication**: Use Firebase SDK for React Native
2. **Storage**: Use AsyncStorage for local data
3. **Charts**: Use react-native-chart-kit or Victory Native
4. **Navigation**: React Navigation v6
5. **Forms**: React Hook Form + Zod validation
6. **HTTP**: Axios with interceptors
7. **State**: React Query + Context API

---

## ✅ Testing Checklist

- [ ] Login/Signup works
- [ ] Assessment flow completes
- [ ] Dashboard loads data
- [ ] Charts render correctly
- [ ] Learning content displays
- [ ] Navigation works smoothly
- [ ] Offline handling works
- [ ] Error states handled
- [ ] Loading states shown
- [ ] Forms validate correctly

---

**Quick Start Command**: Use the full `VIBECODE_MOBILE_APP_PROMPT.md` for detailed specifications when building each feature in Vibecode.

