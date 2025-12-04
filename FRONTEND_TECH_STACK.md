# InvestLearn Frontend Technology Stack

**Last Updated:** 2024  
**Purpose:** Comprehensive overview of all technologies, frameworks, and tools used in the InvestLearn frontend

---

## Core Runtime & Language

### **TypeScript**
- **Version:** ^5.5.3
- **Purpose:** Type-safe JavaScript with static typing
- **Configuration:** 
  - `tsconfig.json` with path aliases (`@/*` for `src/*`)
  - `tsconfig.app.json` for application code
  - `tsconfig.node.json` for build tooling
- **Features Used:**
  - Strict type checking (relaxed for rapid development)
  - Path aliases for cleaner imports
  - ES modules

---

## Build Tool & Development Server

### **Vite**
- **Version:** ^5.4.1
- **Purpose:** Next-generation frontend build tool
- **Features:**
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Native ES modules support
  - Plugin ecosystem
- **Configuration:**
  - React SWC plugin for faster compilation
  - Path aliases (`@/` → `./src/`)
  - Development server on port 8080

### **React SWC Plugin**
- **Version:** ^3.5.0 (@vitejs/plugin-react-swc)
- **Purpose:** Fast React refresh using SWC compiler
- **Benefits:** Significantly faster than Babel-based alternatives

---

## UI Framework

### **React**
- **Version:** ^18.3.1
- **Purpose:** Component-based UI library
- **Features Used:**
  - Functional components with hooks
  - Context API for global state
  - React Router for navigation
  - React Query for server state

### **React DOM**
- **Version:** ^18.3.1
- **Purpose:** React rendering for web

---

## Routing

### **React Router DOM**
- **Version:** ^6.26.2
- **Purpose:** Client-side routing and navigation
- **Features:**
  - Declarative routing
  - Protected routes
  - Nested routing
  - Route-based code splitting
- **Usage:**
  - Public routes (landing, auth, legal pages)
  - Protected routes (dashboard, learning, profile)
  - Dynamic routes with parameters

---

## State Management

### **TanStack Query (React Query)**
- **Version:** ^5.56.2
- **Purpose:** Server state management and data fetching
- **Features:**
  - Automatic caching and background refetching
  - Optimistic updates
  - Request deduplication
  - Retry logic with exponential backoff
- **Usage:**
  - API data fetching
  - Cache management
  - Mutation handling
  - Query invalidation

### **React Context API**
- **Purpose:** Global client-side state management
- **Contexts:**
  - `AuthContext` - User authentication state
  - `SessionContext` - Assessment session management
  - `SubscriptionContext` - Subscription status
  - `ProfileContext` - User profile data
  - `ThemeProvider` - Theme management

### **React Hooks**
- **Custom Hooks:**
  - `useAuth` - Authentication operations
  - `useSession` - Session management
  - `useGoals` - Goals data and mutations
  - `useSpendingData` - Spending analytics
  - `useCashFlowData` - Cash flow projections
  - `useAssessmentSession` - Assessment flow
  - `useLearningProgress` - Learning tracking
  - `useNotifications` - Notification management

---

## UI Component Library

### **Radix UI**
- **Purpose:** Unstyled, accessible component primitives
- **Components Used:**
  - `@radix-ui/react-accordion` - Collapsible content
  - `@radix-ui/react-alert-dialog` - Modal dialogs
  - `@radix-ui/react-avatar` - User avatars
  - `@radix-ui/react-checkbox` - Checkboxes
  - `@radix-ui/react-dialog` - Modal dialogs
  - `@radix-ui/react-dropdown-menu` - Dropdown menus
  - `@radix-ui/react-label` - Form labels
  - `@radix-ui/react-popover` - Popover components
  - `@radix-ui/react-progress` - Progress indicators
  - `@radix-ui/react-radio-group` - Radio buttons
  - `@radix-ui/react-select` - Select dropdowns
  - `@radix-ui/react-slider` - Range sliders
  - `@radix-ui/react-switch` - Toggle switches
  - `@radix-ui/react-tabs` - Tab navigation
  - `@radix-ui/react-toast` - Toast notifications
  - `@radix-ui/react-tooltip` - Tooltips
  - And more...
- **Benefits:**
  - Fully accessible (WCAG compliant)
  - Unstyled (full design control)
  - Keyboard navigation
  - Focus management

### **shadcn/ui**
- **Purpose:** Pre-built component system built on Radix UI
- **Configuration:** `components.json`
- **Style:** Default (slate-based color scheme)
- **Features:**
  - Copy-paste components (not a package)
  - Fully customizable
  - TypeScript support
  - Tailwind CSS styling

---

## Styling

### **Tailwind CSS**
- **Version:** ^3.4.11
- **Purpose:** Utility-first CSS framework
- **Configuration:**
  - Custom color palette (brand, finance, sidebar)
  - Custom animations (fade, slide, accordion)
  - Dark mode support (class-based)
  - Custom radius variables
- **Plugins:**
  - `tailwindcss-animate` - Animation utilities
  - `@tailwindcss/typography` - Typography plugin

### **PostCSS**
- **Version:** ^8.4.47
- **Purpose:** CSS processing
- **Plugins:**
  - Autoprefixer - Vendor prefixing

### **CSS Variables**
- **Purpose:** Dynamic theming
- **Usage:**
  - HSL color system
  - Theme switching (light/dark)
  - Component-level customization

---

## Form Management

### **React Hook Form**
- **Version:** ^7.53.0
- **Purpose:** Performant form library
- **Features:**
  - Minimal re-renders
  - Built-in validation
  - TypeScript support
  - Easy integration with validation libraries

### **Zod**
- **Version:** ^3.23.8
- **Purpose:** Schema validation
- **Integration:** `@hookform/resolvers` (^3.9.0)
- **Usage:**
  - Form schema validation
  - Type inference
  - Runtime type checking

### **Class Variance Authority**
- **Version:** ^0.7.1
- **Purpose:** Component variant management
- **Usage:** Consistent component styling variants

---

## HTTP Client

### **Axios**
- **Version:** ^1.9.0
- **Purpose:** HTTP client for API requests
- **Features:**
  - Request/response interceptors
  - Automatic token injection (Firebase Auth)
  - Error handling
  - Request/response transformation
- **Configuration:**
  - Base URL from environment config
  - Automatic Authorization header injection
  - Centralized error handling

---

## Authentication

### **Firebase SDK**
- **Version:** ^11.9.1
- **Purpose:** Client-side Firebase integration
- **Features:**
  - Email/password authentication
  - Google OAuth
  - Token management
  - Auth state persistence
- **Usage:**
  - User sign-in/sign-up
  - Token refresh
  - Protected route authentication

---

## Data Visualization

### **Chart.js**
- **Version:** ^4.4.9
- **Purpose:** Charting library
- **Integration:** `react-chartjs-2` (^5.3.0)
- **Usage:**
  - Financial charts
  - Data visualization
  - Interactive graphs

### **Recharts**
- **Version:** ^2.12.7
- **Purpose:** Composable charting library for React
- **Usage:**
  - Financial dashboards
  - Progress visualizations
  - Custom chart components

---

## Animation & Interactions

### **Framer Motion**
- **Version:** ^12.19.1
- **Purpose:** Production-ready motion library
- **Usage:**
  - Page transitions
  - Component animations
  - Gesture handling
  - Layout animations

### **Embla Carousel**
- **Version:** ^8.3.0 (embla-carousel-react)
- **Purpose:** Carousel/slider component
- **Usage:**
  - Image galleries
  - Content carousels
  - Touch/swipe support

---

## Date & Time

### **date-fns**
- **Version:** ^3.6.0
- **Purpose:** Date utility library
- **Usage:**
  - Date formatting
  - Date calculations
  - Relative time display

### **React Day Picker**
- **Version:** ^8.10.1
- **Purpose:** Date picker component
- **Usage:**
  - Date selection in forms
  - Calendar UI

---

## UI Utilities

### **Lucide React**
- **Version:** ^0.462.0
- **Purpose:** Icon library
- **Features:**
  - 1000+ icons
  - Tree-shakeable
  - Customizable (size, color, stroke)

### **Sonner**
- **Version:** ^1.5.0
- **Purpose:** Toast notification library
- **Features:**
  - Beautiful toast notifications
  - Promise-based toasts
  - Customizable styling

### **CMDK (Command Menu)**
- **Version:** ^1.0.0
- **Purpose:** Command palette component
- **Usage:**
  - Keyboard shortcuts
  - Quick actions menu

### **Vaul**
- **Version:** ^0.9.3
- **Purpose:** Drawer component
- **Usage:**
  - Mobile-friendly drawers
  - Bottom sheets

### **React Resizable Panels**
- **Version:** ^2.1.3
- **Purpose:** Resizable panel layouts
- **Usage:**
  - Dashboard layouts
  - Split views

### **Input OTP**
- **Version:** ^1.2.4
- **Purpose:** OTP input component
- **Usage:**
  - Email verification codes
  - Two-factor authentication

---

## Theme Management

### **next-themes**
- **Version:** ^0.3.0
- **Purpose:** Theme switching (light/dark mode)
- **Features:**
  - System preference detection
  - Persistent theme selection
  - Smooth transitions

---

## Utility Libraries

### **clsx**
- **Version:** ^2.1.1
- **Purpose:** Conditional className utility
- **Usage:** Dynamic class name composition

### **tailwind-merge**
- **Version:** ^2.5.2
- **Purpose:** Merge Tailwind CSS classes intelligently
- **Usage:** Resolve class conflicts

---

## Testing

### **Vitest**
- **Version:** ^1.3.1
- **Purpose:** Fast unit test framework
- **Features:**
  - Vite-native
  - Jest-compatible API
  - Fast execution
  - UI mode for debugging

### **Testing Library**
- **Versions:**
  - `@testing-library/react`: ^14.2.1
  - `@testing-library/jest-dom`: ^6.4.2
  - `@testing-library/user-event`: ^14.5.2
- **Purpose:** React component testing
- **Features:**
  - User-centric testing
  - Accessibility testing
  - DOM queries

### **jsdom**
- **Version:** ^24.0.0
- **Purpose:** DOM implementation for Node.js
- **Usage:** Browser environment simulation in tests

---

## Code Quality

### **ESLint**
- **Version:** ^9.9.0
- **Configuration:**
  - `@eslint/js`: ^9.9.0
  - `typescript-eslint`: ^8.0.1
  - `eslint-plugin-react-hooks`: ^5.1.0-rc.0
  - `eslint-plugin-react-refresh`: ^0.4.9
- **Purpose:** Code linting and quality checks

### **TypeScript**
- **Purpose:** Static type checking
- **Configuration:** Multiple tsconfig files for different contexts

---

## Development Tools

### **Lovable Tagger**
- **Version:** ^1.1.7
- **Purpose:** Component tagging for development
- **Usage:** Development-only component identification

---

## Project Structure

```
src/
├── components/        # React components
│   ├── ui/           # shadcn/ui components
│   ├── dashboard/    # Dashboard components
│   ├── assessment/   # Assessment flow components
│   ├── learning/     # Learning library components
│   ├── goals/        # Goals management
│   ├── spending/     # Spending analysis
│   ├── cashflow/     # Cash flow components
│   ├── auth/         # Authentication components
│   └── layout/       # Layout components
├── pages/            # Route pages
├── contexts/         # React Context providers
├── hooks/            # Custom React hooks
├── lib/              # Utilities and services
│   ├── api/          # API client and endpoints
│   ├── auth/         # Authentication utilities
│   ├── firebase/     # Firebase configuration
│   ├── storage/      # Local storage utilities
│   └── utils/        # General utilities
├── styles/           # Global styles
└── utils/            # Helper functions
```

---

## Development Workflow

### **Scripts**
- `npm run dev` - Start development server (Vite)
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (Vitest)
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

---

## Architecture Patterns

### **Component Architecture**
- **Pattern:** Functional components with hooks
- **Benefits:**
  - Reusable components
  - Clear separation of concerns
  - Easy testing

### **State Management Strategy**
- **Server State:** TanStack Query (React Query)
- **Global Client State:** React Context API
- **Local State:** React useState/useReducer
- **Benefits:**
  - Optimal data fetching
  - Minimal re-renders
  - Clear state boundaries

### **API Integration Pattern**
- **Pattern:** Centralized API client with interceptors
- **Features:**
  - Automatic authentication
  - Error handling
  - Request/response transformation
- **Benefits:**
  - Consistent API calls
  - Centralized error handling
  - Token management

### **Route Protection Pattern**
- **Pattern:** ProtectedRoute component wrapper
- **Features:**
  - Authentication checks
  - Redirect handling
  - Loading states

### **Form Handling Pattern**
- **Pattern:** React Hook Form + Zod validation
- **Benefits:**
  - Type-safe forms
  - Minimal re-renders
  - Built-in validation

---

## Key Integrations

1. **Firebase** - Authentication
2. **Backend API** - RESTful API integration
3. **OpenAI** - AI chat (via backend)
4. **Alpha Vantage** - Market data (via backend)

---

## Technology Highlights

### **Type Safety**
- Full TypeScript coverage
- Zod schema validation
- Type-safe API clients
- Type inference from schemas

### **Performance**
- Vite for fast builds
- React Query for efficient data fetching
- Code splitting
- Optimized bundle size

### **Developer Experience**
- Hot Module Replacement (HMR)
- Path aliases for clean imports
- Component-based architecture
- Comprehensive tooling

### **Accessibility**
- Radix UI primitives (WCAG compliant)
- Keyboard navigation
- Screen reader support
- Focus management

### **Modern Patterns**
- Hooks-based architecture
- Functional components
- Composition over inheritance
- Declarative routing

---

## Deployment

### **Environment**
- **Platform:** Vercel (based on project structure)
- **Build:** Vite production build
- **Environment Variables:** Configured via Vite

### **Build Output**
- Static assets
- Code splitting
- Optimized bundles
- Source maps (optional)

---

## Summary

**Core Stack:**
- **Runtime:** Browser (ES modules)
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State:** TanStack Query + Context API
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios
- **Auth:** Firebase SDK
- **Charts:** Chart.js + Recharts
- **Testing:** Vitest + Testing Library

**Architecture Style:**
- Component-based
- Hooks-first
- Type-safe
- Server/client state separation
- Declarative routing

**Key Strengths:**
- ✅ Modern React patterns
- ✅ Type-safe end-to-end
- ✅ Excellent developer experience
- ✅ Accessible components
- ✅ Performance optimized
- ✅ Comprehensive testing setup

---

**End of Frontend Tech Stack Documentation**

