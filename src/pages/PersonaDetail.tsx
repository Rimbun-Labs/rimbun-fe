import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import {
  ArrowLeft,
  ArrowRight,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  BookOpen,
  Building2,
  PieChart,
  AlertCircle,
  CheckCircle2,
  Star,
  Lightbulb,
  Briefcase,
  Home,
  Heart,
  GraduationCap,
} from 'lucide-react';
import { personaApi } from '@/lib/api/personaApi';
import { cn } from '@/lib/utils';
import { useFormatters } from '@/hooks/useFormatters';
import { useTheme } from '@/hooks/useTheme';
import { getAssetClassDisplayName } from '@/lib/constants/displayNames';
import { AssetClass } from '@/lib/api/types/metrics';
import { 
  formatProductType, 
  formatProductName, 
  formatBankName, 
  formatGoalType, 
  formatContentType, 
  getPriorityLabel, 
  getPriorityVariant,
  formatFamilyStatus,
  formatLivingSituation,
  formatEducationLevel,
  formatLifeStage,
  formatCareerStage,
  formatLifestyleType
} from '@/lib/utils/personaFormatters';

const PersonaDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatCurrency } = useFormatters();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Smart back navigation - checks location state first, then browser history
  const handleBack = () => {
    // Check if we have a referrer in state (explicit navigation)
    if (location.state?.from) {
      navigate(location.state.from);
    } 
    // Check if we can go back in browser history
    else if (window.history.length > 1) {
      navigate(-1);
    } 
    // Fallback to explore page
    else {
      navigate('/explore');
    }
  };

  const { data: persona, isLoading, error } = useQuery({
    queryKey: ['persona', slug],
    queryFn: () => personaApi.getPersonaBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 md:px-6 py-12">
          <LoadingState variant="expanded" lines={3} />
        </div>
      </div>
    );
  }

  if (error || !persona) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 md:px-6 py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load persona details. Please try again later.
            </AlertDescription>
          </Alert>
          <Button
            onClick={handleBack}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 md:px-6 py-12">
        <div className="space-y-8">
          {/* Back Button */}
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">
                  Sample Profile
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {persona.title}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {persona.name}, {persona.age} years old
                </p>
              </div>
              <Button
                onClick={() => navigate('/signup')}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                Get Your Own Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="prose prose-slate max-w-3xl dark:prose-invert">
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {persona.description}
              </p>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="banking">Banking</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Story Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Their Story
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Background</h4>
                    <div className="prose prose-slate max-w-none dark:prose-invert">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {persona.story.background}
                      </p>
                    </div>
                  </div>
                  {persona.story?.goals && persona.story.goals.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Financial Goals</h4>
                      <ul className="space-y-1">
                        {persona.story.goals.map((goal, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {persona.story?.challenges && persona.story.challenges.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Challenges</h4>
                      <ul className="space-y-1">
                        {persona.story.challenges.map((challenge, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {persona.story?.dailyLife && (
                    <div>
                      <h4 className="font-semibold mb-2">Daily Life</h4>
                      <div className="prose prose-slate max-w-none dark:prose-invert">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {persona.story.dailyLife}
                        </p>
                      </div>
                    </div>
                  )}
                  {persona.story?.motivations && persona.story.motivations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Motivations</h4>
                      <ul className="space-y-1">
                        {persona.story.motivations.map((motivation, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            {motivation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {persona.story?.futureAspirations && persona.story.futureAspirations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Future Aspirations</h4>
                      <ul className="space-y-1">
                        {persona.story.futureAspirations.map((aspiration, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                            <Target className="h-4 w-4 text-primary" />
                            {aspiration}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Life Context Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Life Context
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Family Status</p>
                      <p className="text-lg font-semibold">{formatFamilyStatus(persona.lifeContext.familyStatus)}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Living Situation</p>
                      <p className="text-lg font-semibold">{formatLivingSituation(persona.lifeContext.livingSituation)}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Education Level</p>
                      <p className="text-lg font-semibold">{formatEducationLevel(persona.lifeContext.educationLevel)}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Life Stage</p>
                      <p className="text-lg font-semibold">{formatLifeStage(persona.lifeContext.lifeStage)}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Dependents</p>
                      <p className="text-lg font-semibold">
                        {persona.lifeContext.dependents === 0 
                          ? 'No dependents' 
                          : `${persona.lifeContext.dependents} ${persona.lifeContext.dependents === 1 ? 'dependent' : 'dependents'}`}
                      </p>
                    </div>
                    {persona.lifeContext.city && (
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">City</p>
                        <p className="text-lg font-semibold">{persona.lifeContext.city}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Career Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Career
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Job Title</p>
                      <p className="text-lg font-semibold">{persona.career.jobTitle}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Industry</p>
                      <p className="text-lg font-semibold">{persona.career.industry}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Years of Experience</p>
                      <p className="text-lg font-semibold">
                        {persona.career.yearsOfExperience === 0.5 
                          ? '0.5 years' 
                          : `${persona.career.yearsOfExperience} ${persona.career.yearsOfExperience === 1 ? 'year' : 'years'}`}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Career Stage</p>
                      <p className="text-lg font-semibold">{formatCareerStage(persona.career.careerStage)}</p>
                    </div>
                    {persona.career.workStyle && (
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Work Style</p>
                        <p className="text-lg font-semibold">{persona.career.workStyle}</p>
                      </div>
                    )}
                  </div>
                  {persona.career.careerGoals && persona.career.careerGoals.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Career Goals</h4>
                      <ul className="space-y-1">
                        {persona.career.careerGoals.map((goal, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                            <Target className="h-4 w-4 text-primary" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lifestyle Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Lifestyle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Lifestyle Type</p>
                      <p className="text-lg font-semibold">{formatLifestyleType(persona.lifestyle.lifestyleType)}</p>
                    </div>
                  </div>
                  
                  {persona.lifestyle.hobbies && persona.lifestyle.hobbies.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Hobbies</h4>
                      <div className="flex flex-wrap gap-2">
                        {persona.lifestyle.hobbies.map((hobby, idx) => (
                          <Badge key={idx} variant="outline">
                            {hobby}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {persona.lifestyle.interests && persona.lifestyle.interests.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {persona.lifestyle.interests.map((interest, idx) => (
                          <Badge key={idx} variant="outline">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {persona.lifestyle.values && persona.lifestyle.values.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Values</h4>
                      <ul className="space-y-1">
                        {persona.lifestyle.values.map((value, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                            <Heart className="h-4 w-4 text-primary" />
                            {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {persona.lifestyle.spendingPriorities && persona.lifestyle.spendingPriorities.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Spending Priorities</h4>
                      <ul className="space-y-1">
                        {persona.lifestyle.spendingPriorities.map((priority, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4 text-primary" />
                            {priority}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {persona.lifestyle.dailyLife && (
                    <div>
                      <h4 className="font-semibold mb-2">Daily Life</h4>
                      <div className="prose prose-slate max-w-none dark:prose-invert">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {persona.lifestyle.dailyLife}
                        </p>
                      </div>
                    </div>
                  )}

                  {persona.lifestyle.motivations && persona.lifestyle.motivations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Motivations</h4>
                      <ul className="space-y-1">
                        {persona.lifestyle.motivations.map((motivation, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            {motivation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {persona.lifestyle.futureAspirations && persona.lifestyle.futureAspirations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Future Aspirations</h4>
                      <ul className="space-y-1">
                        {persona.lifestyle.futureAspirations.map((aspiration, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                            <Target className="h-4 w-4 text-primary" />
                            {aspiration}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Financial Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Monthly Income</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(persona.financialProfile.monthlyIncome)}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Savings</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(persona.financialProfile.totalSavings)}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(persona.financialProfile.monthlyExpenses)}
                      </p>
                    </div>
                    {persona.financialProfile.debt !== undefined && (
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Debt</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(persona.financialProfile.debt)}
                        </p>
                      </div>
                    )}
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <p className="text-xl font-bold">{persona.financialProfile.riskLevel}</p>
                      {persona.financialProfile.riskProfile !== undefined && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Score: {persona.financialProfile.riskProfile}/100
                        </p>
                      )}
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Knowledge Level</p>
                      <p className="text-xl font-bold">{persona.financialProfile.knowledgeLevel}</p>
                    </div>
                    {persona.financialProfile.decisionStyle && (
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Decision Style</p>
                        <p className="text-lg font-semibold">{persona.financialProfile.decisionStyle}</p>
                      </div>
                    )}
                    {persona.financialProfile.employment && (
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Employment</p>
                        <p className="text-lg font-semibold">{persona.financialProfile.employment}</p>
                      </div>
                    )}
                    {persona.financialProfile.location && (
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="text-lg font-semibold">{persona.financialProfile.location}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* How It Works Together */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    How Banking & Investments Work Together
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none dark:prose-invert">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {persona.howTheyWorkTogether}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {persona.goals && persona.goals.length > 0 ? persona.goals.map((goal) => (
                  <Card key={goal.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Target className="h-5 w-5 text-primary" />
                          {goal.name}
                        </CardTitle>
                        <Badge 
                          variant={getPriorityVariant(goal.priority)}
                          className={goal.priority <= 2 ? 'bg-primary text-primary-foreground' : ''}
                        >
                          {getPriorityLabel(goal.priority)} Priority
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Goal Type Badge */}
                      {goal.type && (
                        <Badge variant="outline" className="w-fit">
                          {formatGoalType(goal.type)}
                        </Badge>
                      )}

                      {/* Goal Description */}
                      {goal.description && (
                        <div className="pb-3 border-b">
                          <div className="prose prose-slate max-w-none dark:prose-invert">
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                              {goal.description}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Financial Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Target Amount</p>
                          <p className="text-xl font-bold text-foreground">{formatCurrency(goal.targetAmount)}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Current Amount</p>
                          <p className="text-xl font-bold text-foreground">{formatCurrency(goal.currentAmount)}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Monthly Contribution</p>
                          <p className="text-lg font-semibold text-foreground">{formatCurrency(goal.monthlyContribution)}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Target Year</p>
                          <p className="text-lg font-semibold text-foreground">{goal.targetYear}</p>
                        </div>
                      </div>

                      {/* Timeline Info */}
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Investment Horizon</span>
                          <span className="text-sm font-semibold text-primary">
                            {goal.investmentHorizon} {goal.investmentHorizon === 1 ? 'year' : 'years'}
                          </span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-foreground">Progress</p>
                          <span className="text-sm font-semibold text-primary">{Math.round(goal.progress)}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${Math.round(goal.progress)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>{formatCurrency(goal.currentAmount)}</span>
                          <span>{formatCurrency(goal.targetAmount)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No goals available for this persona.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Banking Tab */}
            <TabsContent value="banking" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {persona.bankingProducts && persona.bankingProducts.length > 0 ? persona.bankingProducts.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            {formatProductName(product.productName)}
                          </CardTitle>
                          <CardDescription>
                            {formatProductType(product.productType)} • {formatBankName(product.bankName)}
                          </CardDescription>
                        </div>
                        {product.shariahCompliant && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800">
                            <Star className="h-3 w-3 mr-1" />
                            Shariah
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="prose prose-slate max-w-none dark:prose-invert">
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {product.description}
                        </p>
                      </div>
                      
                      {/* Optional fields - only show if at least one exists */}
                      {(product.interestRate !== undefined || 
                        product.minimumBalance !== undefined || 
                        product.annualFee !== undefined || 
                        product.score !== undefined) && (
                        <div className="pt-2 border-t">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {product.interestRate !== undefined && (
                              <div className="p-2 bg-muted/50 rounded">
                                <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                                <p className="font-semibold text-foreground">{product.interestRate}%</p>
                              </div>
                            )}
                            {product.minimumBalance !== undefined && (
                              <div className="p-2 bg-muted/50 rounded">
                                <p className="text-xs text-muted-foreground mb-1">Minimum Balance</p>
                                <p className="font-semibold text-foreground">{product.minimumBalance}</p>
                              </div>
                            )}
                            {product.annualFee !== undefined && (
                              <div className="p-2 bg-muted/50 rounded">
                                <p className="text-xs text-muted-foreground mb-1">Annual Fee</p>
                                <p className="font-semibold text-foreground">{product.annualFee}</p>
                              </div>
                            )}
                            {product.score !== undefined && (
                              <div className="p-2 bg-primary/10 rounded">
                                <p className="text-xs text-muted-foreground mb-1">Match Score</p>
                                <p className="font-semibold text-primary">{product.score}%</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Key Features */}
                      {product.keyFeatures && product.keyFeatures.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold mb-2">Key Features:</p>
                          <ul className="space-y-1">
                            {product.keyFeatures.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Aligned Goals */}
                      {product.alignedGoals && product.alignedGoals.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold mb-2">Aligned Goals:</p>
                          <div className="flex flex-wrap gap-1">
                            {product.alignedGoals.map((goal, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {goal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No banking products available for this persona.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Investments Tab */}
            <TabsContent value="investments" className="space-y-6">
              {persona.investmentPortfolio ? (
                <>
                  {/* Strategy and Metrics Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Portfolio Strategy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-3">Portfolio Strategy</h4>
                        <div className="prose prose-slate max-w-none dark:prose-invert">
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {persona.investmentPortfolio.strategy}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg bg-muted/30">
                          <p className="text-sm text-muted-foreground mb-1">Expected Return</p>
                          <p className="text-2xl font-bold text-foreground">{persona.investmentPortfolio.expectedReturn}</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-muted/30">
                          <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                          <p className="text-2xl font-bold text-foreground">{persona.investmentPortfolio.riskLevel}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Asset Allocation Chart Card */}
                  {persona.investmentPortfolio.allocations && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="h-5 w-5" />
                          Asset Allocation
                        </CardTitle>
                        <CardDescription>
                          Distribution of investments across different asset classes
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <InvestmentAllocationChart allocations={persona.investmentPortfolio.allocations} isDarkMode={isDarkMode} />
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No investment portfolio available for this persona.
                </div>
              )}
            </TabsContent>

            {/* Learning Tab */}
            <TabsContent value="learning" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {persona.educationalContent && persona.educationalContent.length > 0 ? persona.educationalContent.map((content) => (
                  <Card key={content.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          {content.title}
                        </CardTitle>
                        <Badge variant="outline">{formatContentType(content.type)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{content.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Estimated time: {content.estimatedTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No educational content available for this persona.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Bottom CTA */}
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Get Your Own Personalized Plan
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Sign up to receive a customized financial plan tailored to your unique situation, goals, and preferences.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    onClick={() => navigate('/signup')}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    size="lg"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Investment Allocation Chart Component
interface InvestmentAllocationChartProps {
  allocations: {
    equities: number;
    bonds: number;
    cash: number;
    realEstate: number;
  };
  isDarkMode: boolean;
}

const InvestmentAllocationChart: React.FC<InvestmentAllocationChartProps> = ({ allocations, isDarkMode }) => {
  // Color scheme matching PortfolioAllocation component
  const getAssetColor = (assetClass: string): string => {
    switch (assetClass) {
      case 'equities':
        return '#E9C46A';
      case 'bonds':
        return '#2A9D8F';
      case 'realEstate':
        return '#F4A261';
      case 'cash':
        return '#264653';
      default:
        return '#94a3b8';
    }
  };

  // Prepare chart data
  const chartData = useMemo(() => 
    Object.entries(allocations)
      .filter(([_, value]) => value > 0) // Only show assets with allocation > 0
      .map(([id, value]) => ({
        id,
        label: getAssetClassDisplayName(id as AssetClass),
        value: Math.round(value), // Backend returns 0-100, round for display
        color: getAssetColor(id)
      }))
      .sort((a, b) => b.value - a.value), // Sort by value descending
    [allocations]
  );

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No asset allocation data available.
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={130}
            paddingAngle={5}
            dataKey="value"
            label={({ value, percent }) => `${value}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-popover p-3 rounded-lg shadow-lg border border-border">
                    <p className="font-medium text-popover-foreground mb-1">
                      {payload[0].payload.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {payload[0].value}% allocation
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            payload={chartData.map(item => ({
              value: `${item.label} (${item.value}%)`,
              type: 'circle',
              color: item.color
            }))}
            formatter={(value) => (
              <span style={{ color: isDarkMode ? '#e2e8f0' : '#64748b' }}>
                {value}
              </span>
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PersonaDetail;

