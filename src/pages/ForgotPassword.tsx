import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { authService } from '@/lib/auth/authService';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await authService.sendPasswordResetEmail(email);
      
      if (error) {
        toast.error(error.message || 'Failed to send password reset email');
      } else {
        toast.success('Password reset link sent!');
        setIsSent(true);
      }
    } catch (error) {
      toast.error('Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:px-0">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-center">Check Your Email</CardTitle>
                <CardDescription className="text-center">
                  We sent a password reset link to your email address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Reset link sent to:</p>
                  <p className="font-medium">{email}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Click the link in your email to reset your password.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    If you don't see the email, check your spam or junk folder.
                  </p>
                </div>

                <Button asChild className="w-full">
                  <Link to="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Didn't receive the email? <button onClick={() => setIsSent(false)} className="text-primary hover:underline">Try again</button>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <Link to="/login" className="text-muted-foreground hover:text-primary inline-flex items-center">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

