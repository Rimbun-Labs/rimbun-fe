import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '@/lib/auth/authService';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase/config';

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const userEmail = user?.email || 'your email';

  const handleResend = async () => {
    if (!user) return;

    setIsResending(true);
    try {
      const { error } = await authService.resendVerificationEmail(user);
      
      if (error) {
        toast.error(error.message || 'Failed to resend verification email');
      } else {
        toast.success('Verification email sent!');
        setResendCooldown(60);
        
        // Start cooldown timer
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const handleContinue = () => {
    // Check if email is verified
    if (auth.currentUser?.emailVerified) {
      toast.success('Email verified!');
    }
    navigate('/dashboard');
  };

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
              <CardTitle className="text-center">Check Your Email</CardTitle>
              <CardDescription className="text-center">
                We've sent a verification link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Display */}
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">We sent a verification link to:</p>
                <p className="font-medium">{userEmail}</p>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Please check your email and click the verification link to verify your account.
                </p>
                <p className="text-sm text-muted-foreground">
                  If you don't see the email, check your spam or junk folder.
                </p>
              </div>

              {/* Resend Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              {/* Continue Button */}
              <Button
                className="w-full"
                onClick={handleContinue}
              >
                Continue to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {/* Help Text */}
              <p className="text-xs text-center text-muted-foreground">
                You can verify your email later from your profile settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;

