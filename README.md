# 🧭 InvestLearn Compass - Investment Education Platform

> **Build Investment Confidence Through Interactive Learning**

A comprehensive investment education platform that combines personalized assessments, scenario-based learning, and portfolio insights to help users develop financial literacy and investment confidence.

## ✨ Features

### 🎯 **Personalized Investment Assessment**
- Interactive questionnaire covering risk tolerance, knowledge level, and investment goals
- Real-time progress tracking with category-based organization
- Adaptive question flow based on user responses
- Comprehensive scoring across multiple investment dimensions

### 📚 **Dynamic Learning System**
- Personalized learning paths based on assessment results
- Asset class-specific educational content (Equities, Bonds, Real Estate, Cash)
- Interactive scenarios and real-world examples
- Progress tracking and achievement system

### 📊 **Portfolio Insights & Analytics**
- Visual portfolio allocation charts
- Risk profile analysis and recommendations
- Investment style categorization
- Confidence scoring and improvement suggestions

### 🔐 **User Management & Persistence**
- Firebase authentication with Google OAuth
- Assessment progress persistence
- Learning history and achievements
- Personalized dashboard experience

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd investlearn-compass-project

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 🏗️ Architecture

### **Frontend Stack**
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components

### **State Management**
- **React Query** - Server state management and caching
- **Context API** - Global state (auth, session, theme)
- **Custom Hooks** - Reusable business logic

### **Authentication & Backend**
- **Firebase Auth** - User authentication and management
- **REST API** - Backend communication (separate service)
- **Local Storage** - Client-side persistence with cross-tab sync

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── assessment/      # Assessment flow components
│   ├── dashboard/       # Dashboard and analytics
│   ├── learning/        # Educational content components
│   ├── layout/          # App layout and navigation
│   └── ui/              # Base UI components (shadcn/ui)
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── contexts/            # React contexts
├── lib/                 # Utilities and API clients
│   ├── api/            # API integration
│   ├── auth/           # Authentication utilities
│   ├── storage/        # Local storage management
│   └── utils/          # Helper functions
├── types/               # TypeScript type definitions
└── styles/              # Global styles and themes
```

## 🎮 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 🔧 Development Workflow

### **Component Development**
1. Create components in appropriate directories
2. Use TypeScript interfaces for props
3. Implement error boundaries for critical components
4. Add loading states and error handling

### **State Management**
1. Use React Query for server state
2. Context API for global app state
3. Local state for component-specific data
4. Custom hooks for complex logic

### **Styling Guidelines**
1. Use Tailwind CSS utility classes
2. Leverage shadcn/ui components
3. Follow design system color tokens
4. Ensure responsive design

## 🧪 Testing

*Testing setup coming soon - will include:*
- Unit tests for components and hooks
- Integration tests for user flows
- E2E tests for critical paths
- Test coverage reporting

## 📚 Documentation

- [Loading States Guide](./docs/LOADING_STATES.md) - Component loading system
- [Component Library](./docs/COMPONENTS.md) - Comprehensive component documentation
- [Architecture Guide](./docs/ARCHITECTURE.md) - System design and technical architecture
- [Development Guide](./docs/DEVELOPMENT.md) - Development workflow and best practices

## 🌟 Key Components

### **Assessment System**
- `AssessmentContainer` - Main assessment wrapper
- `QuestionCard` - Individual question display
- `AnswerInputs` - Dynamic input components
- `ProgressBar` - Assessment progress tracking

### **Dashboard & Analytics**
- `PortfolioAllocation` - Portfolio visualization
- `RiskProfileChart` - Risk assessment display
- `LearningProgress` - Progress tracking
- `RecommendationsSection` - Investment suggestions

### **Learning Platform**
- `LearningFolderView` - Educational content organization
- `ModuleCard` - Learning module display
- `MetricLibraryDetail` - Detailed metric explanations
- `QuizSection` - Interactive knowledge testing

## 🔒 Environment Variables

Create a `.env.local` file with:
```env
VITE_API_BASE_URL=your_backend_url
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

### **Other Platforms**
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For questions or support:
- Check the documentation in the `docs/` folder
- Review component examples in the codebase
- Contact the development team

---

**Built with ❤️ using modern web technologies**
