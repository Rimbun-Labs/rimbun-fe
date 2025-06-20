import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider } from "./contexts/SessionContext";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import AssessmentResultsPage from "./pages/AssessmentResults";
import Dashboard from "./pages/Dashboard";
import Learning from "./pages/Learning";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LearningPaths from "./pages/LearningPaths";
import LearningPathDetail from "./pages/LearningPathDetail";
import LearningLibraryDetail from "./pages/LearningLibraryDetail";
import MetricLibraryDetail from "./components/learning/library/MetricLibraryDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./contexts/AuthContext";
import InvestmentExplorer from "./pages/InvestmentExplorer";
import LearningFolderView from "./pages/LearningFolderView";
import { AssessmentPersistenceProvider } from '@/components/assessment/AssessmentPersistenceProvider';

const queryClient = new QueryClient();

// Component to handle root route redirection
const RootRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/home" replace /> : <Index />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<RootRedirect />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Index />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:sessionId" element={<Dashboard />} />
        
        {/* Learning Library Routes */}
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning/:folderId" element={<LearningFolderView />} />
        <Route path="/learning/asset-classes/:assetClass" element={<LearningLibraryDetail />} />
        <Route path="/learning/metrics/:metricId" element={<MetricLibraryDetail />} />
        
        {/* Learning Paths Routes */}
        <Route path="/learning-path/:sessionId" element={<LearningPaths />} />
        <Route path="/learning-path/:sessionId/:assetClass" element={<LearningPathDetail />} />
        
        <Route path="/profile" element={<Profile />} />
        <Route path="/assessment-results" element={<AssessmentResultsPage />} />
        <Route path="/investment-explorer/:sessionId" element={<InvestmentExplorer />} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AssessmentPersistenceProvider>
              <AppRoutes />
            </AssessmentPersistenceProvider>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </SessionProvider>
  </QueryClientProvider>
);

export default App;
