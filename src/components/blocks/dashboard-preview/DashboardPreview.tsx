import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  BarChart3, 
  Lightbulb,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  PieChart,
  Award,
  Shield,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl border shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Sarah's Investment Dashboard</h3>
              <p className="text-sm text-muted-foreground">Personalized for your goals</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Optimized
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Learning
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 pt-6">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Profile</p>
                      <p className="text-2xl font-bold text-blue-600">65%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                  <Progress value={65} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Balanced growth approach</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Knowledge Level</p>
                      <p className="text-2xl font-bold text-emerald-600">78%</p>
                    </div>
                    <Award className="h-8 w-8 text-emerald-500" />
                  </div>
                  <Progress value={78} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Intermediate understanding</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Goal Progress</p>
                      <p className="text-2xl font-bold text-purple-600">42%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                  <Progress value={42} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">$150K of $1.2M target</p>
                </CardContent>
              </Card>
            </div>

            {/* Investment Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Investment Scenarios for Retirement Goal
                </CardTitle>
                <CardDescription>
                  Compare different approaches to reach your $1.2M retirement goal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Conservative Plan</h4>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700">Achievable</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Time to Goal:</span>
                        <span className="font-medium">18 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Investment:</span>
                        <span className="font-medium">$2,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Projected Amount:</span>
                        <span className="font-medium">$1,250,000</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-orange-50/50 dark:bg-orange-900/10">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Aggressive Plan</h4>
                      <Badge variant="outline" className="bg-orange-100 text-orange-700">Faster</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Time to Goal:</span>
                        <span className="font-medium">12 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Investment:</span>
                        <span className="font-medium">$3,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Projected Amount:</span>
                        <span className="font-medium">$1,350,000</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Key Differences</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Conservative plan uses your current investment rate</li>
                    <li>• Aggressive plan includes additional savings for faster goal achievement</li>
                    <li>• Time difference: 6 years between approaches</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>
                  Personalized recommendations based on your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg">
                    <h4 className="font-medium mb-2 text-emerald-700">Portfolio Strategy</h4>
                    <ul className="space-y-1 text-sm text-emerald-700">
                      <li>• Your current allocation aligns well with your risk profile</li>
                      <li>• Consider increasing equity exposure for higher growth potential</li>
                      <li>• Maintain bond allocation for stability</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-700">Learning Recommendations</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Focus on advanced portfolio management concepts</li>
                      <li>• Explore alternative investment strategies</li>
                      <li>• Review risk management techniques</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6 pt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goal Gap Analysis
                </CardTitle>
                <CardDescription>
                  AI-powered insights on your retirement planning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Current Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Current Savings:</span>
                          <span className="font-medium">$150,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Savings:</span>
                          <span className="font-medium">$2,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Target Amount:</span>
                          <span className="font-medium">$1,200,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Investment Horizon:</span>
                          <span className="font-medium">15 years</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg">
                      <h4 className="font-medium mb-2 text-amber-700">AI Recommendations</h4>
                      <ul className="space-y-1 text-sm text-amber-700">
                        <li>• Increase monthly savings by $500</li>
                        <li>• Consider more aggressive allocation</li>
                        <li>• Extend timeline by 2 years</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg">
                      <h4 className="font-medium mb-2 text-emerald-700">Goal Achievability Score</h4>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600 mb-2">78%</div>
                        <Progress value={78} className="h-3" />
                        <p className="text-sm text-emerald-700 mt-2">Highly achievable with adjustments</p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-700">Time Analysis</h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <div className="flex justify-between">
                          <span>Current Timeline:</span>
                          <span>15 years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Required Timeline:</span>
                          <span>18 years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gap:</span>
                          <span className="font-medium">3 years</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Next Steps</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Adjust Savings</p>
                        <p className="text-muted-foreground">Increase monthly contribution</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Review Allocation</p>
                        <p className="text-muted-foreground">Optimize portfolio mix</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Monitor Progress</p>
                        <p className="text-muted-foreground">Track goal achievement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6 pt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Personalized Learning Journey
                </CardTitle>
                <CardDescription>
                  Adaptive modules and quizzes based on your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Current Module</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span className="font-medium">Asset Allocation Basics</span>
                        <Badge variant="outline" className="bg-primary/10">In Progress</Badge>
                      </div>
                      <Progress value={60} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">60% complete</div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>~15 minutes remaining</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg">
                      <h4 className="font-medium mb-2 text-emerald-700">Next Modules</h4>
                      <ul className="space-y-2 text-sm text-emerald-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Risk & Return Metrics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Diversification Strategies</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Portfolio Optimization</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-700">Learning Progress</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Progress value={75} className="h-3 flex-1" />
                        <span className="text-lg font-bold text-blue-700">75%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">6 of 8 modules completed</div>
                      <div className="mt-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Completed:</span>
                          <span className="font-medium">6 modules</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining:</span>
                          <span className="font-medium">2 modules</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Score:</span>
                          <span className="font-medium">87%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-lg">
                      <h4 className="font-medium mb-2 text-purple-700">Learning Path</h4>
                      <div className="space-y-2 text-sm text-purple-700">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                          <span>Assessment Complete</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                          <span>Core Concepts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-purple-300 rounded-full"></div>
                          <span>Advanced Strategies</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                          <span>Portfolio Mastery</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6 pt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Portfolio Analysis
                </CardTitle>
                <CardDescription>
                  Diversification, risk metrics, and strategic insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Diversification Score</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-emerald-600">82%</span>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-700">High</Badge>
                      </div>
                      <Progress value={82} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">Well-balanced portfolio across asset classes</div>
                    </div>
                    
                    <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-700">Risk Metrics</h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <div className="flex justify-between">
                          <span>Risk-Adjusted Volatility:</span>
                          <span className="font-medium">0.18</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sharpe Ratio:</span>
                          <span className="font-medium">1.24</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Maximum Drawdown:</span>
                          <span className="font-medium">-12.5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg">
                      <h4 className="font-medium mb-2 text-amber-700">Key Insights</h4>
                      <ul className="space-y-1 text-sm text-amber-700">
                        <li>• Portfolio is well diversified across asset classes</li>
                        <li>• Risk level aligns with your 65% risk profile</li>
                        <li>• Consider increasing equity allocation for higher growth</li>
                        <li>• Bond allocation provides stability during market volatility</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-lg">
                      <h4 className="font-medium mb-2 text-purple-700">Asset Correlations</h4>
                      <div className="space-y-2 text-sm text-purple-700">
                        <div className="flex justify-between">
                          <span>Equities vs Bonds:</span>
                          <span className="font-medium">-0.15</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Real Estate vs Equities:</span>
                          <span className="font-medium">0.32</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cash vs Equities:</span>
                          <span className="font-medium">0.08</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Low correlations indicate good diversification
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg mt-4">
                  <h4 className="font-medium mb-2">Portfolio Recommendations</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Increase Equities</p>
                        <p className="text-muted-foreground">Add 5% to growth potential</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Maintain Bonds</p>
                        <p className="text-muted-foreground">Keep stability allocation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Review Quarterly</p>
                        <p className="text-muted-foreground">Monitor and rebalance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPreview; 