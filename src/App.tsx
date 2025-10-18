import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider } from "./contexts/SessionContext";
// Removed environment-aware storage - using API-first approach
import { ThemeProvider } from "./hooks/useTheme";
import { AppLayout, ContentLayout } from "./components/layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import AssessmentResultsPage from "./pages/AssessmentResults";
import Dashboard from "./pages/Dashboard";
import Learning from "./pages/Learning";
import LearningFolderView from "./pages/LearningFolderView";
import LearningLibraryDetail from "./pages/LearningLibraryDetail";
import LearningPathDetail from "./pages/LearningPathDetail";
import LearningPaths from "./pages/LearningPaths";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import InvestmentExplorer from "./pages/InvestmentExplorer";
import SpendingAnalysis from "./pages/SpendingAnalysis";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useSession } from "./contexts/SessionContext";
import { AssessmentPersistenceProvider } from '@/components/assessment/AssessmentPersistenceProvider';
import { GlobalErrorBoundary } from '@/components/error/GlobalErrorBoundary';
import TestLayout from "./pages/TestLayout";

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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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

  // If user is not authenticated, show marketing page
  return <Index />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<RootRedirect />} />

      {/* Protected routes with ContentLayout (contained, centered) */}
      <Route
        element={
          <ProtectedRoute>
            <ContentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/assessment-results" element={<AssessmentResultsPage />} />
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
        <Route path="/assessment" element={<Assessment />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:sessionId" element={<Dashboard />} />
        
        {/* Learning Library Routes */}
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning/:folderId" element={<LearningFolderView />} />
        <Route path="/learning/asset-classes/:assetClass" element={<LearningLibraryDetail />} />
        <Route path="/learning/metrics/:metricId" element={<LearningLibraryDetail />} />
        <Route path="/learning/islamic-finance/:moduleId" element={<LearningLibraryDetail />} />
        <Route path="/learning/esg-investing/:moduleId" element={<LearningLibraryDetail />} />
        <Route path="/learning/risk-management/:moduleId" element={<LearningLibraryDetail />} />
        <Route path="/learning/market-analysis/:moduleId" element={<LearningLibraryDetail />} />
        <Route path="/learning/portfolio-optimization/:moduleId" element={<LearningLibraryDetail />} />
        
        {/* Learning Paths Routes */}
        <Route path="/learning-path/:sessionId" element={<LearningPaths />} />
        <Route path="/learning-path/:sessionId/:assetClass" element={<LearningPathDetail />} />
        
        {/* Application Pages */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/spending-analysis" element={<SpendingAnalysis />} />
        <Route path="/investment-explorer/:sessionId" element={<InvestmentExplorer />} />

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
              <ThemeProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AssessmentPersistenceProvider>
                    <AppRoutes />
                  </AssessmentPersistenceProvider>
                </TooltipProvider>
              </ThemeProvider>
            </SessionProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
