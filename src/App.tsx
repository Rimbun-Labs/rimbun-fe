import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider } from "./contexts/SessionContext";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import AssessmentResultsPage from "./pages/AssessmentResults";
import Dashboard from "./pages/Dashboard";
import Learning from "./pages/Learning";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import RecommendationsPage from "./pages/RecommendationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Index />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/dashboard/:sessionId" element={<Dashboard />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionProvider>
  </QueryClientProvider>
);

export default App;
