# 🛠️ Development Guide

> **Development workflow, coding standards, and best practices for InvestLearn Compass**

This guide provides developers with everything they need to contribute to the project effectively and maintain code quality.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Coding Standards](#coding-standards)
- [Component Development](#component-development)
- [State Management](#state-management)
- [Testing Guidelines](#testing-guidelines)
- [Git Workflow](#git-workflow)
- [Debugging & Troubleshooting](#debugging--troubleshooting)
- [Performance Guidelines](#performance-guidelines)
- [Common Patterns](#common-patterns)

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** or **yarn** package manager
- **Git** for version control
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

### **Initial Setup**

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

---

## 🖥️ Development Environment

### **Environment Variables**

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### **Available Scripts**

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run build:dev    # Build for development
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### **IDE Configuration**

**VS Code Settings** (`.vscode/settings.json`):
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "([^)]*)"],
    ["clsx\\(([^)]*)\\)", "([^)]*)"]
  ]
}
```

---

## 📝 Coding Standards

### **1. TypeScript Guidelines**

**Type Definitions:**
- Always define interfaces for component props
- Use strict typing, avoid `any` when possible
- Export types from dedicated type files
- Use branded types for IDs and enums

```typescript
// ✅ Good
interface UserProfile {
  id: UserId; // Branded type
  email: string;
  displayName: string;
  preferences: UserPreferences;
}

// ❌ Avoid
interface UserProfile {
  id: any;
  email: any;
  displayName: any;
  preferences: any;
}
```

**Import/Export:**
```typescript
// ✅ Good - Named exports
export { Button, ButtonProps };
export type { ButtonVariant };

// ✅ Good - Default exports for main components
export default Button;

// ❌ Avoid - Mixed export styles
export default Button;
export { ButtonProps };
```

### **2. Component Structure**

**File Organization:**
```
src/components/
├── component-name/
│   ├── index.ts              # Public exports
│   ├── ComponentName.tsx     # Main component
│   ├── ComponentName.test.tsx # Tests
│   ├── ComponentName.stories.tsx # Storybook (future)
│   └── types.ts              # Component-specific types
```

**Component Template:**
```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import { ComponentProps } from './types';

export const ComponentName: React.FC<ComponentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('base-classes', className)} {...props}>
      {children}
    </div>
  );
};

ComponentName.displayName = 'ComponentName';
```

### **3. Naming Conventions**

**Files & Components:**
- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useUserProfile.ts`)
- **Utilities**: camelCase (`formatCurrency.ts`)
- **Types**: PascalCase (`UserProfile.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

**CSS Classes:**
- Use Tailwind utility classes
- Custom classes in `kebab-case`
- BEM methodology for complex components

```typescript
// ✅ Good
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
</div>

// ❌ Avoid
<div className="profile-container">
  <h2 className="profile-title">Profile</h2>
</div>
```

---

## 🧩 Component Development

### **1. Component Design Principles**

**Single Responsibility:**
- Each component should have one clear purpose
- Break complex components into smaller, focused ones
- Use composition over inheritance

**Props Interface:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}
```

**Default Props:**
```typescript
const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  loading = false,
  children,
  ...props
}) => {
  // Component implementation
};
```

### **2. Component Composition**

**Container/Presentational Pattern:**
```typescript
// Container component (logic)
const UserProfileContainer = () => {
  const { user, loading, error } = useUserProfile();
  
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  
  return <UserProfile user={user} />;
};

// Presentational component (UI)
const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.displayName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
      </CardContent>
    </Card>
  );
};
```

### **3. Error Handling**

**Error Boundaries:**
```typescript
<ComponentErrorBoundary context="UserProfile">
  <UserProfileContainer />
</ComponentErrorBoundary>
```

**Loading States:**
```typescript
if (isLoading) {
  return <LoadingState variant="expanded" lines={3} />;
}
```

---

## 🎛️ State Management

### **1. State Hierarchy**

**Local State (useState):**
- Form inputs
- UI interactions
- Component-specific data

**Context State:**
- User authentication
- Application settings
- Global UI state

**Server State (React Query):**
- API data
- Caching
- Background updates

### **2. Custom Hooks**

**Hook Structure:**
```typescript
export const useCustomHook = (dependencies: Dependencies) => {
  // State declarations
  const [state, setState] = useState(initialState);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = useCallback(() => {
    // Event logic
  }, [dependencies]);
  
  // Return values
  return {
    state,
    handleEvent,
    // ... other values
  };
};
```

**Hook Usage:**
```typescript
const { user, updateUser, isLoading } = useUserProfile();
const { assessment, submitAnswer } = useAssessment();
```

### **3. React Query Patterns**

**Query Definition:**
```typescript
const { data: user, isLoading, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => userApi.getUser(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

**Mutation Definition:**
```typescript
const updateUser = useMutation({
  mutationFn: (userData: UpdateUserData) => userApi.updateUser(userData),
  onSuccess: (data) => {
    queryClient.invalidateQueries(['user', data.id]);
    toast.success('User updated successfully');
  },
  onError: (error) => {
    toast.error('Failed to update user');
  },
});
```

---

## 🧪 Testing Guidelines

### **1. Testing Strategy**

**Test Pyramid:**
- **Unit Tests** (70%) - Components, hooks, utilities
- **Integration Tests** (20%) - Component interactions
- **E2E Tests** (10%) - Critical user flows

**Testing Tools:**
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **MSW** - API mocking (future)

### **2. Component Testing**

**Test Structure:**
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-destructive');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Testing Best Practices:**
- Test behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Test accessibility features
- Mock external dependencies

### **3. Hook Testing**

**Hook Testing Pattern:**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

---

## 🔀 Git Workflow

### **1. Branch Strategy**

**Main Branches:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature development
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

**Branch Naming:**
```bash
# Feature branches
git checkout -b feature/user-authentication
git checkout -b feature/assessment-flow

# Bug fix branches
git checkout -b bugfix/login-validation
git checkout -b bugfix/portfolio-chart-error

# Hotfix branches
git checkout -b hotfix/security-vulnerability
```

### **2. Commit Guidelines**

**Commit Message Format:**
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat(assessment): add progress tracking"
git commit -m "fix(dashboard): resolve portfolio chart rendering issue"
git commit -m "docs(components): update component library documentation"
```

### **3. Pull Request Process**

**PR Checklist:**
- [ ] Code follows project standards
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design verified
- [ ] Accessibility requirements met

**PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing verified

## Screenshots (if applicable)
Add screenshots for UI changes
```

---

## 🐛 Debugging & Troubleshooting

### **1. Common Issues**

**Build Errors:**
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force
```

**TypeScript Errors:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Generate type definitions
npx tsc --declaration --emitDeclarationOnly
```

**Runtime Errors:**
- Check browser console for errors
- Verify environment variables
- Check API endpoints and authentication
- Validate component props

### **2. Debugging Tools**

**React Developer Tools:**
- Component tree inspection
- Props and state debugging
- Performance profiling

**Browser DevTools:**
- Network tab for API calls
- Console for error messages
- Elements tab for DOM inspection

**VS Code Extensions:**
- React Developer Tools
- Error Lens
- TypeScript Importer

### **3. Logging Strategy**

**Console Logging:**
```typescript
// Development logging
if (import.meta.env.DEV) {
  console.log('🔵 Component mounted:', componentName);
  console.log('📊 Data received:', data);
}

// Error logging
console.error('❌ API call failed:', error);
```

**Error Tracking:**
```typescript
// Global error boundary logging
onError={(error, errorInfo) => {
  console.error('🚨 CRITICAL ERROR:', {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    url: window.location.href,
    timestamp: new Date().toISOString()
  });
}}
```

---

## ⚡ Performance Guidelines

### **1. React Optimization**

**Memoization:**
```typescript
// Memoize expensive components
const ExpensiveChart = React.memo(({ data }) => {
  // Component implementation
});

// Memoize callbacks
const handleClick = useCallback(() => {
  // Click handler logic
}, [dependencies]);

// Memoize computed values
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

**Code Splitting:**
```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Learning = lazy(() => import('./pages/Learning'));

// Lazy load heavy components
const PortfolioChart = lazy(() => import('./components/PortfolioChart'));
```

### **2. Bundle Optimization**

**Import Optimization:**
```typescript
// ✅ Good - Named imports
import { Button, Card } from '@/components/ui';

// ❌ Avoid - Default imports for large libraries
import * as Chart from 'chart.js';

// ✅ Good - Specific imports
import { Line } from 'react-chartjs-2';
```

**Tree Shaking:**
```typescript
// ✅ Good - Tree-shakeable imports
import { debounce } from 'lodash-es';

// ❌ Avoid - Full library imports
import _ from 'lodash';
```

---

## 🔄 Common Patterns

### **1. Form Handling**

**React Hook Form Pattern:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
};
```

### **2. API Integration**

**API Hook Pattern:**
```typescript
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUser(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['user', data.id]);
    },
  });
};
```

### **3. Error Handling**

**Error Boundary Pattern:**
```typescript
const ComponentWithErrorBoundary = () => {
  return (
    <ComponentErrorBoundary context="UserProfile">
      <UserProfile />
    </ComponentErrorBoundary>
  );
};
```

**Toast Notifications:**
```typescript
import { toast } from 'sonner';

const handleSuccess = () => {
  toast.success('Operation completed successfully');
};

const handleError = (error: Error) => {
  toast.error(`Operation failed: ${error.message}`);
};
```

---

## 📚 Additional Resources

- [Component Library](./COMPONENTS.md) - Detailed component documentation
- [Architecture Guide](./ARCHITECTURE.md) - System design and patterns
- [Loading States Guide](./LOADING_STATES.md) - Loading component system
- [React Documentation](https://react.dev/) - Official React guides
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript reference
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework

---

## 🤝 Contributing

### **Getting Help**

1. **Check Documentation** - Review relevant guides first
2. **Search Issues** - Look for similar problems
3. **Ask Questions** - Use team communication channels
4. **Code Review** - Request feedback on complex changes

### **Code Review Process**

1. **Self-Review** - Review your own code before submitting
2. **Peer Review** - Get feedback from team members
3. **Testing** - Ensure all tests pass
4. **Documentation** - Update relevant documentation

---

*Last updated: [Current Date]*
*Maintained by: InvestLearn Compass Development Team* 