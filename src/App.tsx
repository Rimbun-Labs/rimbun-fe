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
import RecommendationsPage from "./pages/RecommendationsPage";
import LearningPaths from "./pages/LearningPaths";
import LearningPathDetail from "./pages/LearningPathDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./contexts/AuthContext";

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
        <Route path="/dashboard/:sessionId" element={<Dashboard />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning-path/:sessionId" element={<LearningPaths />} />
        <Route path="/learning-path/:sessionId/:assetClass" element={<LearningPathDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/assessment-results" element={<AssessmentResultsPage />} />
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
            <AppRoutes />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </SessionProvider>
  </QueryClientProvider>
);

export default App;
