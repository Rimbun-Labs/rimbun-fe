import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertCircle, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import {
  consumeAccessRestricted,
  isAccessRestrictedError,
} from '@/lib/auth/accessRestricted';

const DEMO_EMAIL = 'team@rimbun.co';

const Login = () => {
  const { signInWithEmail, signInWithGoogle, operator, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessRestricted, setAccessRestricted] = useState(false);
  const [restrictedEmail, setRestrictedEmail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    const restricted = consumeAccessRestricted();
    if (restricted) {
      setAccessRestricted(true);
      setRestrictedEmail(restricted.email ?? null);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && operator) {
      navigate(from, { replace: true });
    }
  }, [authLoading, operator, navigate, from]);

  const showAccessRestricted = (email?: string | null) => {
    setAccessRestricted(true);
    setRestrictedEmail(email ?? null);
  };

  const returnToSignIn = () => {
    setAccessRestricted(false);
    setRestrictedEmail(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAccessRestricted(false);
    setRestrictedEmail(null);

    try {
      await signInWithEmail(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      if (isAccessRestrictedError(err)) {
        showAccessRestricted(err.email ?? formData.email);
        return;
      }
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    setAccessRestricted(false);
    setRestrictedEmail(null);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      if (isAccessRestrictedError(err)) {
        showAccessRestricted(err.email);
        return;
      }
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in with Google";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="md" variant="primary" text="Checking access..." />
      </div>
    );
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo size="md" showText textClassName="text-white" />
        </div>
        <div className="relative z-20 mt-auto">
          <p className="text-lg">
            Sign in to your organization’s Rimbun workspace.
          </p>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {accessRestricted ? "You're not a member of a workspace" : 'Welcome back'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {accessRestricted
                ? "Your account hasn't been added to a Rimbun workspace yet. If your organization already uses Rimbun, ask your administrator to invite you. Otherwise, contact our team to get started."
                : 'Sign in with your work email'}
            </p>
            {accessRestricted && restrictedEmail ? (
              <p className="text-sm text-muted-foreground">
                Signed in as <span className="font-medium text-foreground">{restrictedEmail}</span>
              </p>
            ) : null}
          </div>
          <Card>
            {accessRestricted ? (
              <>
                <CardHeader>
                  <CardTitle>Need access to Rimbun?</CardTitle>
                  <CardDescription>
                    We’ll help you get connected to the right workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <Button asChild className="w-full">
                    <Link to="/contact">Contact Support</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href={`mailto:${DEMO_EMAIL}?subject=${encodeURIComponent('Rimbun access request')}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email {DEMO_EMAIL}
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={returnToSignIn}
                  >
                    Sign in with another account
                  </Button>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>
                    Use the email associated with your workspace
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {error && (
                    <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" variant="default" />
                        <span>Signing in with Google...</span>
                      </div>
                    ) : (
                      <>
                        <Icons.google className="mr-2 h-4 w-4" />
                        Continue with Google
                      </>
                    )}
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your work email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        autoCapitalize="none"
                        autoComplete="current-password"
                        autoCorrect="off"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" variant="default" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <div className="text-sm text-muted-foreground text-center">
                    Need a workspace?{" "}
                    <Link to="/contact" className="text-primary underline-offset-4 hover:underline">
                      Contact us
                    </Link>
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
