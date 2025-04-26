
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, BarChart, LayoutDashboard, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Understand Your Financial Profile
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Discover your investment personality and get personalized recommendations for financial growth.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link to="/assessment">Take Assessment</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/learning">Explore Learning</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-80 md:h-96">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-20 blur-2xl"></div>
                <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Your Investment Profile</h3>
                    <p className="text-muted-foreground mt-2">Take the assessment to discover your:</p>
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full">
                          <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span>Risk Tolerance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full">
                          <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span>Investment Knowledge</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                          <BarChart className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span>Financial Goals Alignment</span>
                      </li>
                    </ul>
                  </div>
                  <Button asChild className="mt-6">
                    <Link to="/assessment" className="w-full">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">How Investlearn Works</h2>
            <p className="text-muted-foreground mt-2">A journey to financial knowledge and confidence</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <CardContent className="p-6">
                <div className="mb-4 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Complete Assessment</h3>
                <p className="text-muted-foreground">
                  Answer questions about your financial goals, risk tolerance, and investment knowledge.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
              <CardContent className="p-6">
                <div className="mb-4 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <LayoutDashboard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Get Insights</h3>
                <p className="text-muted-foreground">
                  Receive your personalized investment profile and tailored recommendations.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden sm:col-span-2 lg:col-span-1">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <CardContent className="p-6">
                <div className="mb-4 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Learn & Improve</h3>
                <p className="text-muted-foreground">
                  Access educational modules customized to your knowledge gaps and financial goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to understand your investment style?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Take the financial profile assessment and get personalized insights today.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link to="/assessment">Start Assessment</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">View Demo Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
