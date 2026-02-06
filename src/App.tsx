import React, { useEffect, useState, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider } from "./contexts/SessionContext";
// Removed environment-aware storage - using API-first approach
import { ThemeProvider } from "./hooks/useTheme";
import { AppLayout, ContentLayout, PublicLayout, LandingLayout } from "./components/layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { LoadingState } from "@/components/dashboard/ui/LoadingState";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useSession } from "./contexts/SessionContext";
import { AssessmentPersistenceProvider } from '@/components/assessment/AssessmentPersistenceProvider';
import { GlobalErrorBoundary } from '@/components/error/GlobalErrorBoundary';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

// Lightweight pages - keep in main bundle (frequently used, small size)
import ForBanks from "./pages/ForBanks";
import ForIndividuals from "./pages/ForIndividuals";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import EmailConfirmation from "./pages/EmailConfirmation";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AboutUs from "./pages/AboutUs";
import CookiePolicy from "./pages/CookiePolicy";
import Contact from "./pages/Contact";

// Heavy pages - lazy load for code splitting
const Assessment = lazy(() => import("./pages/Assessment"));
const AssessmentResultsPage = lazy(() => import("./pages/AssessmentResults"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Learning = lazy(() => import("./pages/Learning"));
const LearningFolderView = lazy(() => import("./pages/LearningFolderView"));
const LearningLibraryDetail = lazy(() => import("./pages/LearningLibraryDetail"));
const LearningPathDetail = lazy(() => import("./pages/LearningPathDetail"));
const LearningPaths = lazy(() => import("./pages/LearningPaths"));
const Profile = lazy(() => import("./pages/Profile"));
const InvestmentExplorer = lazy(() => import("./pages/InvestmentExplorer"));
const SpendingAnalysis = lazy(() => import("./pages/SpendingAnalysis"));
const CashFlowProjections = lazy(() => import("./pages/CashFlowProjections"));
const FinancialPlanning = lazy(() => import("./pages/FinancialPlanning"));
const Spending = lazy(() => import("./pages/Spending"));
const Planning = lazy(() => import("./pages/Planning"));
const BankAnalyticsDashboard = lazy(() => import("./pages/BankAnalyticsDashboard"));
const GoalsPage = lazy(() => import("./pages/Goals"));
const GoalDetailPage = lazy(() => import("./pages/GoalDetail"));
const GoalFamilyPage = lazy(() => import("./pages/GoalFamily"));
const BankingProducts = lazy(() => import("./pages/BankingProducts"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Explore = lazy(() => import("./pages/Explore"));
const PersonaDetail = lazy(() => import("./pages/PersonaDetail"));

const queryClient = new QueryClient();

// Component to handle root route redirection
const RootRedirect = () => {
  const { user } = useAuth();
  const { hasCompletedAssessment } = useSession();
  const [isCheckingAssessment, setIsCheckingAssessment] = useState(false);
  const [assessmentStatus, setAssessmentStatus] = useState<{ hasAssessment: boolean; sessionId?: string; isIncomplete?: boolean } | null>(null);

  // 🔑 SMART ROUTE PROTECTION: Only redirect if we're on the root path
  // This prevents aggressive redirects when users intentionally navigate to specific routes
  const isRootPath = window.location.pathname === '/';
  
  // 🔑 NEW: Check if user is in retake mode to prevent redirect conflicts
  const isRetakeMode = window.location.pathname === '/assessment' && 
                      new URLSearchParams(window.location.search).get('mode') === 'retake';

  useEffect(() => {
    const checkUserAssessment = async () => {
      if (user && !isCheckingAssessment) {
        setIsCheckingAssessment(true);
        try {
          const status = await hasCompletedAssessment();
          setAssessmentStatus(status);
        } catch (error) {
          console.error('Failed to check assessment status:', error);
          setAssessmentStatus({ hasAssessment: false });
        } finally {
          setIsCheckingAssessment(false);
        }
      }
    };

    checkUserAssessment();
  }, [user, isCheckingAssessment]);

  // Show loading while checking assessment status
  if (user && isCheckingAssessment) {
    return <div className="min-h-screen flex items-center justify-center">Checking your account...</div>;
  }

  // If user is authenticated, check assessment status
  if (user) {
    // 🔑 FIXED: Only redirect to dashboard if we're on root path AND user has complete assessment AND not in retake mode
    if (isRootPath && assessmentStatus?.hasAssessment && assessmentStatus.sessionId && !assessmentStatus.isIncomplete && !isRetakeMode) {
      return <Navigate to={`/dashboard/${assessmentStatus.sessionId}`} replace />;
    }
    // If user has incomplete assessment, redirect to assessment to complete it
    else if (assessmentStatus?.isIncomplete) {
      return <Navigate to="/assessment" replace />;
    }
    // If user has no assessment, go to dashboard (which will show assessment prompt)
    else if (isRootPath) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If user is not authenticated, show B2B homepage (For Banks)
  return <ForBanks />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/check-email" element={<EmailConfirmation />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<RootRedirect />} />
      <Route path="/for-banks" element={<ForBanks />} />
      <Route path="/home" element={<ForBanks />} />
      <Route path="/for-individuals" element={<ForIndividuals />} />

      {/* Public routes with same landing header as For Banks / For Individuals */}
      <Route element={<LandingLayout />}>
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Public routes with app header (legal, explore) */}
      <Route element={<PublicLayout />}>
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route 
          path="/explore" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <Explore />
            </Suspense>
          } 
        />
        <Route 
          path="/explore/:slug" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <PersonaDetail />
            </Suspense>
          } 
        />
      </Route>

      {/* Protected routes with ContentLayout (contained, centered) */}
      <Route
        element={
          <ProtectedRoute>
            <ContentLayout />
          </ProtectedRoute>
        }
      >
        <Route 
          path="/assessment-results" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <AssessmentResultsPage />
            </Suspense>
          } 
        />
      </Route>

      {/* Protected routes with AppLayout (full width) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Assessment Routes */}
        <Route 
          path="/assessment" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <Assessment />
            </Suspense>
          } 
        />
        
        {/* Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <Dashboard />
            </Suspense>
          } 
        />
        <Route 
          path="/dashboard/:sessionId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <Dashboard />
            </Suspense>
          } 
        />
        
        {/* Learning Library Routes */}
        <Route 
          path="/learning" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <Learning />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/:folderId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningFolderView />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/asset-classes/:assetClass" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningLibraryDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/metrics/:metricId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningLibraryDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/islamic-finance/:moduleId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningLibraryDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/esg-investing/:moduleId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningLibraryDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/risk-management/:moduleId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningLibraryDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/market-analysis/:moduleId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningLibraryDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/portfolio-optimization/:moduleId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningLibraryDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/retirement-planning/:moduleId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningLibraryDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/financial-planning/:moduleId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningLibraryDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/value-growth-investing/:moduleId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningLibraryDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/economic-fundamentals/:moduleId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningLibraryDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/learning/behavioral-finance/:moduleId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningLibraryDetail />
            </Suspense>
          } 
        />
        
        {/* Learning Paths Routes */}
        <Route 
          path="/learning-path/:sessionId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningPaths />
            </Suspense>
          } 
        />
        <Route 
          path="/learning-path/:sessionId/:assetClass" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <LearningPathDetail />
            </Suspense>
          } 
        />
        
        {/* Application Pages */}
        <Route 
          path="/profile" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <Profile />
            </Suspense>
          } 
        />
        <Route 
          path="/spending" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <Spending />
            </Suspense>
          } 
        />
        <Route 
          path="/planning" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <Planning />
            </Suspense>
          } 
        />
        {/* Legacy routes - redirect to new pages */}
        <Route path="/financial-planning" element={<Navigate to="/spending" replace />} />
        <Route path="/spending-analysis" element={<Navigate to="/spending" replace />} />
        <Route path="/cash-flow-projections" element={<Navigate to="/planning?tab=projections" replace />} />
        <Route 
          path="/banking-products" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <BankingProducts />
            </Suspense>
          } 
        />
        <Route 
          path="/banking-products/:productId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <ProductDetail />
            </Suspense>
          } 
        />
        <Route 
          path="/goals" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <GoalsPage />
            </Suspense>
          } 
        />
        <Route 
          path="/goals/family/:familySlug" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <GoalFamilyPage />
            </Suspense>
          } 
        />
        <Route 
          path="/goals/:goalId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <GoalDetailPage />
            </Suspense>
          } 
        />
        <Route 
          path="/investment-explorer/:sessionId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <InvestmentExplorer />
            </Suspense>
          } 
        />
        
        {/* Bank Analytics (Protected by backend - will show error if no permission) */}
        <Route 
          path="/analytics" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <BankAnalyticsDashboard />
            </Suspense>
          } 
        />

      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Environment-aware storage removed - using API-first approach
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <SessionProvider>
              <SubscriptionProvider>
                <ThemeProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <AssessmentPersistenceProvider>
                      <AppRoutes />
                    </AssessmentPersistenceProvider>
                  </TooltipProvider>
                </ThemeProvider>
              </SubscriptionProvider>
            </SessionProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
