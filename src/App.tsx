import React, { lazy, Suspense } from "react";
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
import { SelectedCustomerProvider } from "./contexts/SelectedCustomerContext";
import { GlobalErrorBoundary } from '@/components/error/GlobalErrorBoundary';

// Lightweight pages - keep in main bundle (frequently used, small size)
import ForBanks from "./pages/ForBanks";
import ForBusinesses from "./pages/ForBusinesses";
import ForBanksAudience from "./pages/ForBanksAudience";
import ForInsurersLenders from "./pages/ForInsurersLenders";
import PlatformHome from "./pages/PlatformHome";
import ForIndividuals from "./pages/ForIndividuals";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
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
const AppHome = lazy(() => import("./pages/AppHome"));
const Customers = lazy(() => import("./pages/Customers"));
const CustomerOverview = lazy(() => import("./pages/CustomerOverview"));
const CustomerAssessment = lazy(() => import("./pages/CustomerAssessment"));
const CustomerProducts = lazy(() => import("./pages/CustomerProducts"));
const BusinessOverview = lazy(() => import("./pages/business/BusinessOverview"));
const BusinessAccounts = lazy(() => import("./pages/business/BusinessAccounts"));
const BusinessMoney = lazy(() => import("./pages/business/BusinessMoney"));
const BusinessMoneyIn = lazy(() => import("./pages/business/BusinessMoneyIn"));
const BusinessMoneyOut = lazy(() => import("./pages/business/BusinessMoneyOut"));
const BusinessUpcomingCash = lazy(
  () => import("./pages/business/BusinessUpcomingCash"),
);
const BusinessFinancing = lazy(() => import("./pages/business/BusinessFinancing"));
const BusinessPlans = lazy(() => import("./pages/business/BusinessPlans"));
const BusinessConnections = lazy(() => import("./pages/business/BusinessConnections"));
const BusinessImport = lazy(() => import("./pages/business/BusinessImport"));
const BusinessSources = lazy(() => import("./pages/business/BusinessSources"));
const CustomerBusinessOverview = lazy(() =>
  import("./pages/business/CustomerBusinessPages").then((m) => ({
    default: m.CustomerBusinessOverview,
  }))
);
const CustomerBusinessAccounts = lazy(() =>
  import("./pages/business/CustomerBusinessPages").then((m) => ({
    default: m.CustomerBusinessAccounts,
  }))
);
const CustomerBusinessMoney = lazy(() =>
  import("./pages/business/CustomerBusinessPages").then((m) => ({
    default: m.CustomerBusinessMoney,
  }))
);
const CustomerBusinessMoneyIn = lazy(() =>
  import("./pages/business/CustomerBusinessPages").then((m) => ({
    default: m.CustomerBusinessMoneyIn,
  }))
);
const CustomerBusinessMoneyOut = lazy(() =>
  import("./pages/business/CustomerBusinessPages").then((m) => ({
    default: m.CustomerBusinessMoneyOut,
  }))
);
const CustomerBusinessUpcomingCash = lazy(() =>
  import("./pages/business/CustomerBusinessPages").then((m) => ({
    default: m.CustomerBusinessUpcomingCash,
  }))
);
const CustomerBusinessFinancing = lazy(() =>
  import("./pages/business/CustomerBusinessPages").then((m) => ({
    default: m.CustomerBusinessFinancing,
  }))
);
const CustomerBusinessPlans = lazy(() =>
  import("./pages/business/CustomerBusinessPages").then((m) => ({
    default: m.CustomerBusinessPlans,
  }))
);
const CustomerBusinessImport = lazy(() =>
  import("./pages/business/CustomerBusinessPages").then((m) => ({
    default: m.CustomerBusinessImport,
  }))
);
const CustomerBusinessSources = lazy(() =>
  import("./pages/business/CustomerBusinessPages").then((m) => ({
    default: m.CustomerBusinessSources,
  }))
);
const CustomerBusinessConnections = lazy(() =>
  import("./pages/business/CustomerBusinessPages").then((m) => ({
    default: m.CustomerBusinessConnections,
  }))
);
const Learning = lazy(() => import("./pages/Learning"));
const LearningFolderView = lazy(() => import("./pages/LearningFolderView"));
const LearningLibraryDetail = lazy(() => import("./pages/LearningLibraryDetail"));
const LearningPathDetail = lazy(() => import("./pages/LearningPathDetail"));
const LearningPaths = lazy(() => import("./pages/LearningPaths"));
const Profile = lazy(() => import("./pages/OperatorAccount"));
const InvestmentExplorer = lazy(() => import("./pages/InvestmentExplorer"));
const SpendingAnalysis = lazy(() => import("./pages/SpendingAnalysis"));
const CashFlowProjections = lazy(() => import("./pages/CashFlowProjections"));
const FinancialPlanning = lazy(() => import("./pages/FinancialPlanning"));
const Spending = lazy(() => import("./pages/Spending"));
const Planning = lazy(() => import("./pages/Planning"));
const ForBanksDemo = lazy(() => import("./pages/ForBanksDemo"));
const GoalsPage = lazy(() => import("./pages/Goals"));
const GoalDetailPage = lazy(() => import("./pages/GoalDetail"));
const GoalFamilyPage = lazy(() => import("./pages/GoalFamily"));
const BankingProducts = lazy(() => import("./pages/BankingProducts"));
const InvestmentCatalog = lazy(() => import("./pages/InvestmentCatalog"));
const InsuranceExplorer = lazy(() => import("./pages/InsuranceExplorer"));
const InsuranceProductDetail = lazy(() => import("./pages/InsuranceProductDetail"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Explore = lazy(() => import("./pages/Explore"));
const PersonaDetail = lazy(() => import("./pages/PersonaDetail"));

const queryClient = new QueryClient();

// Entitled operators land in the app zone; content varies by tenant type.
const RootRedirect = () => {
  const { operator, loading } = useAuth();
  if (loading) {
    return <LoadingState variant="expanded" />;
  }
  if (operator) {
    return <Navigate to="/app" replace />;
  }
  return <ForBanks />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      {/* Public B2C signup is disabled until productized; point people at demo/contact. */}
      <Route path="/signup" element={<Navigate to="/contact" replace />} />
      <Route path="/signup/check-email" element={<Navigate to="/contact" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<RootRedirect />} />
      <Route path="/clients" element={<ForBanks />} />
      {/* Trial IA — unified platform homepage + audience routes (not `/` yet) */}
      <Route path="/platform" element={<PlatformHome />} />
      <Route path="/banks" element={<ForBanksAudience />} />
      <Route path="/businesses" element={<ForBusinesses />} />
      <Route path="/insurers-lenders" element={<ForInsurersLenders />} />
      <Route
        path="/clients/demo"
        element={
          <Suspense fallback={<LoadingState variant="expanded" />}>
            <ForBanksDemo />
          </Suspense>
        }
      />
      {/* Legacy paths — keep bookmarks and old links working */}
      <Route path="/partners" element={<Navigate to="/clients" replace />} />
      <Route path="/partners/demo" element={<Navigate to="/clients/demo" replace />} />
      <Route path="/for-banks" element={<Navigate to="/clients" replace />} />
      <Route path="/for-banks/demo" element={<Navigate to="/clients/demo" replace />} />
      <Route path="/home" element={<Navigate to="/clients" replace />} />
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
        <Route 
          path="/assessment-results/:sessionId" 
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
        
        {/* App zone — product shell; home content is tenant-aware */}
        <Route
          path="/app"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <AppHome />
            </Suspense>
          } 
        />
        <Route
          path="/app/money"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <BusinessMoney />
            </Suspense>
          }
        />
        <Route
          path="/app/accounts"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <BusinessAccounts />
            </Suspense>
          }
        />
        <Route
          path="/app/upcoming-cash"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <BusinessUpcomingCash />
            </Suspense>
          }
        />
        <Route
          path="/app/money-in"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <BusinessMoneyIn />
            </Suspense>
          }
        />
        <Route
          path="/app/money-out"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <BusinessMoneyOut />
            </Suspense>
          }
        />
        <Route
          path="/app/financing"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <BusinessFinancing />
            </Suspense>
          }
        />
        <Route
          path="/app/plans"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <BusinessPlans />
            </Suspense>
          }
        />
        <Route
          path="/app/import"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <BusinessImport />
            </Suspense>
          }
        />
        <Route
          path="/app/sources"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <BusinessSources />
            </Suspense>
          }
        />
        <Route
          path="/app/connections"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <BusinessConnections />
            </Suspense>
          }
        />
        <Route
          path="/app/customers"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <Customers />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerOverview />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/assessment"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerAssessment />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/products"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerProducts />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/business"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerBusinessOverview />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/business/money"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerBusinessMoney />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/business/accounts"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerBusinessAccounts />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/business/upcoming-cash"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerBusinessUpcomingCash />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/business/money-in"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerBusinessMoneyIn />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/business/money-out"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerBusinessMoneyOut />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/business/financing"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerBusinessFinancing />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/business/plans"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerBusinessPlans />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/business/import"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerBusinessImport />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/business/sources"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerBusinessSources />
            </Suspense>
          }
        />
        <Route
          path="/app/customers/:customerId/business/connections"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <CustomerBusinessConnections />
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
          path="/investment-explorer"
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <InvestmentCatalog />
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
        <Route 
          path="/insurance" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <InsuranceExplorer />
            </Suspense>
          } 
        />
        <Route 
          path="/insurance/products/:productId" 
          element={
            <Suspense fallback={<LoadingState variant="expanded" />}>
              <InsuranceProductDetail />
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
              <SelectedCustomerProvider>
                <ThemeProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <AppRoutes />
                  </TooltipProvider>
                </ThemeProvider>
              </SelectedCustomerProvider>
            </SessionProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
