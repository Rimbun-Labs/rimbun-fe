import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBankCustomerInsights } from '@/hooks/useBankCustomerInsights';
import { useBankPermission } from '@/hooks/useBankPermission';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { OverviewCards } from '@/components/dashboard/bank/OverviewCards';
import { RiskProfileChart } from '@/components/dashboard/bank/RiskProfileChart';
import { FinancialHealthSection } from '@/components/dashboard/bank/FinancialHealthSection';
import { EngagementMetrics } from '@/components/dashboard/bank/EngagementMetrics';
import { InvestmentPreferences } from '@/components/dashboard/bank/InvestmentPreferences';
import { CustomerSegmentation } from '@/components/dashboard/bank/CustomerSegmentation';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';
import { format } from 'date-fns';

const BankAnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission, isLoading: permissionLoading } = useBankPermission();
  const { data, loading, error, refetch } = useBankCustomerInsights();

  // Show loading state while checking permission
  if (permissionLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle permission denied
  if (!hasPermission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <Shield className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription className="mt-2">
            You don't have permission to access the Bank Analytics Dashboard. 
            This feature is only available to bank administrators and super administrators.
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="mt-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show error state
  if (error) {
    const isUnauthorized = error.message.includes('401') || error.message.includes('Unauthorized');
    const isForbidden = error.message.includes('403') || error.message.includes('Forbidden');
    
    if (isUnauthorized || isForbidden) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {isUnauthorized ? 'Authentication Required' : 'Access Denied'}
            </AlertTitle>
            <AlertDescription className="mt-2">
              {isUnauthorized 
                ? 'Please log in to access this dashboard.'
                : 'You don\'t have permission to access this dashboard.'}
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => isUnauthorized ? navigate('/login') : navigate('/dashboard')}
                  className="mt-2"
                >
                  {isUnauthorized ? 'Go to Login' : 'Back to Dashboard'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription className="mt-2">
            {error.message || 'Failed to load customer insights. Please try again.'}
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading state
  if (loading || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Format the generatedAt timestamp
  const formattedDate = data.generatedAt 
    ? format(new Date(data.generatedAt), 'PPpp')
    : 'Unknown';

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bank Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Last updated: {formattedDate}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <OverviewCards data={data} />

      {/* Risk Profile Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Profile Distribution</CardTitle>
          <CardDescription>
            Breakdown of customer risk profiles across your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RiskProfileChart data={data.riskProfiles} />
        </CardContent>
      </Card>

      {/* Financial Health & Engagement - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialHealthSection data={data.financialHealth} />
        <EngagementMetrics data={data.engagement} />
      </div>

      {/* Investment Preferences */}
      <InvestmentPreferences data={data.investmentPreferences} />

      {/* Customer Segmentation */}
      <CustomerSegmentation data={data.customerSegments} />
    </div>
  );
};

// Wrap with error boundary
const BankAnalyticsDashboardWithBoundary: React.FC = () => (
  <RouteErrorBoundary routeName="Bank Analytics Dashboard" showFullPage={true}>
    <BankAnalyticsDashboard />
  </RouteErrorBoundary>
);

export default BankAnalyticsDashboardWithBoundary;

