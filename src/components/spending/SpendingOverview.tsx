import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingDown, PiggyBank, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { SpendingAnalysisDto } from '@/lib/api/spendingApi';
import { useFormatters } from '@/hooks/useFormatters';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface SpendingOverviewProps {
  data: SpendingAnalysisDto | undefined;
  loading: boolean;
}

const SpendingOverview: React.FC<SpendingOverviewProps> = ({ data, loading }) => {
  const { formatCurrency, formatPercentage } = useFormatters();

  if (loading) {
    return (
      <div className="py-8">
        <LoadingState variant="expanded" lines={3} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No spending data available</p>
      </div>
    );
  }

  const {
    monthlyIncome,
    monthlySpending,
    savingsRate,
    emergencyFundStatus,
    spendingCategories
  } = data;

  // Extract emergency fund data from the status object
  const recommendedEmergencyFund = emergencyFundStatus?.recommendedTarget || 0;
  const emergencyFundStatusString = emergencyFundStatus?.status || 'unknown';

  // Calculate remaining amount
  const remainingAmount = monthlyIncome - monthlySpending;

  // Get status color and message
  const getSavingsRateStatus = (rate: number) => {
    if (rate >= 20) return { color: 'text-green-600', message: 'Excellent!' };
    if (rate >= 10) return { color: 'text-blue-600', message: 'Good' };
    if (rate >= 0) return { color: 'text-yellow-600', message: 'Needs improvement' };
    return { color: 'text-red-600', message: 'Critical' };
  };

  const getEmergencyFundStatus = (status: string) => {
    switch (status) {
      case 'adequate':
        return { 
          color: 'bg-green-100 text-green-800', 
          icon: CheckCircle, 
          message: 'Adequate' 
        };
      case 'insufficient':
        return { 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: AlertCircle, 
          message: 'Insufficient' 
        };
      case 'excessive':
        return { 
          color: 'bg-blue-100 text-blue-800', 
          icon: Shield, 
          message: 'Excessive' 
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800', 
          icon: AlertCircle, 
          message: 'Unknown' 
        };
    }
  };

  const savingsStatus = getSavingsRateStatus(savingsRate);
  const emergencyStatus = getEmergencyFundStatus(emergencyFundStatusString);
  const EmergencyIcon = emergencyStatus.icon;

  // Color palette for categories
  const categoryColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
    '#84CC16', // lime
    '#6366F1', // indigo
  ];

  // Prepare data for bar chart
  const barChartData = useMemo(() => {
    if (!spendingCategories || spendingCategories.length === 0) return [];
    
    return spendingCategories
      .map((category, index) => ({
        name: category.categoryName.length > 12 
          ? category.categoryName.substring(0, 12) + '...' 
          : category.categoryName,
        fullName: category.categoryName,
        value: category.monthlyAmount,
        percentage: (category.monthlyAmount / monthlySpending) * 100,
        color: categoryColors[index % categoryColors.length],
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [spendingCategories, monthlySpending]);

  // Prepare data for pie chart
  const pieChartData = useMemo(() => {
    if (!spendingCategories || spendingCategories.length === 0) return [];
    
    return spendingCategories.map((category, index) => ({
      name: category.categoryName,
      value: category.monthlyAmount,
      percentage: (category.monthlyAmount / monthlySpending) * 100,
      color: categoryColors[index % categoryColors.length],
    }));
  }, [spendingCategories, monthlySpending]);

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Income */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(monthlyIncome)}
                </p>
                <p className="text-xs text-muted-foreground">From assessment</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Spending */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Spending</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(monthlySpending)}
                </p>
                <p className="text-xs text-muted-foreground">Total expenses</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Savings Rate */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
                <p className={`text-2xl font-bold ${savingsStatus.color}`}>
                  {formatPercentage(savingsRate)}
                </p>
                <p className="text-xs text-muted-foreground">{savingsStatus.message}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <PiggyBank className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cash Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Income</span>
                <span className="font-medium">{formatCurrency(monthlyIncome)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Spending</span>
                <span className="font-medium">{formatCurrency(monthlySpending)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Remaining Amount</span>
                  <span className={`font-bold ${remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(remainingAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Savings Rate Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Savings Rate</span>
                <span className="text-sm font-medium">{formatPercentage(savingsRate)}</span>
              </div>
              <Progress 
                value={Math.min(savingsRate, 100)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>20% (Recommended)</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Fund Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Emergency Fund Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={emergencyStatus.color}>
                <EmergencyIcon className="h-3 w-3 mr-1" />
                {emergencyStatus.message}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Recommended Amount</span>
                <span className="font-medium">{formatCurrency(recommendedEmergencyFund)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Based on 3-6 months of expenses
              </div>
            </div>

            {emergencyFundStatusString === 'insufficient' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Consider building your emergency fund to cover unexpected expenses.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Spending Categories Summary with Charts */}
      {spendingCategories && spendingCategories.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      className="text-xs"
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)}
                      className="text-xs"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover p-3 rounded-lg shadow-lg border border-border">
                              <p className="font-medium text-popover-foreground">
                                {data.fullName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(data.value)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatPercentage(data.percentage)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    >
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spending Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ percentage }) => 
                        percentage > 5 ? `${percentage.toFixed(0)}%` : ''
                      }
                      labelLine={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover p-3 rounded-lg shadow-lg border border-border">
                              <p className="font-medium text-popover-foreground">
                                {data.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(data.value)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatPercentage(data.percentage)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={60}
                      formatter={(value, entry: any) => (
                        <span style={{ color: 'hsl(var(--muted-foreground))' }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Spending Categories List (Detailed) */}
      {spendingCategories && spendingCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spendingCategories.map((category, index) => {
                const percentage = (category.monthlyAmount / monthlySpending) * 100;
                return (
                  <div key={category.id || index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                        />
                        <span className="text-sm font-medium">{category.categoryName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold">{formatCurrency(category.monthlyAmount)}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatPercentage(percentage)}
                        </span>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-1" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpendingOverview;
