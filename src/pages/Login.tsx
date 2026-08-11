import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle } from "lucide-react";
import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { Footer } from "@/components/blocks/footer";
import {
  consumeAccessRestricted,
  isAccessRestrictedError,
} from "@/lib/auth/accessRestricted";

const DEMO_EMAIL = "team@rimbun.co";

const fieldClass =
  "h-12 rounded-xl border-border bg-card text-[15px] shadow-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-0";

const Login = () => {
  const { signInWithEmail, signInWithGoogle, operator, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessRestricted, setAccessRestricted] = useState(false);
  const [restrictedEmail, setRestrictedEmail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

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
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in with Google";
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
      <div className="homepage flex min-h-screen items-center justify-center">
        <LoadingSpinner size="md" variant="primary" text="Checking access..." />
      </div>
    );
  }

  return (
    <div className="homepage flex min-h-screen flex-col">
      <LandingHeader />

      <main className="flex flex-1 flex-col items-center px-6 pt-28 pb-20 md:pt-36">
        <div className="w-full max-w-[400px]">
          <h1 className="text-center text-[32px] font-semibold tracking-tight text-foreground md:text-[40px]">
            {accessRestricted ? "No workspace yet" : "Sign in"}
          </h1>
          <p className="mt-3 text-center text-[17px] leading-relaxed text-muted-foreground">
            {accessRestricted
              ? "This account hasn’t been added to a Rimbun workspace. Ask your administrator, or talk to us."
              : "Use the work email for your organization."}
          </p>
          {accessRestricted && restrictedEmail ? (
            <p className="mt-2 text-center text-[15px] text-muted-foreground">
              Signed in as{" "}
              <span className="text-foreground">{restrictedEmail}</span>
            </p>
          ) : null}

          <div className="mt-10">
            {accessRestricted ? (
              <div className="flex flex-col gap-3">
                <Link
                  to="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-foreground text-[17px] font-medium text-background transition-opacity hover:opacity-85"
                >
                  Talk to us
                </Link>
                <a
                  href={`mailto:${DEMO_EMAIL}?subject=${encodeURIComponent("Rimbun access request")}`}
                  className="inline-flex h-12 items-center justify-center text-[17px] font-medium text-primary hover:underline"
                >
                  Email {DEMO_EMAIL}
                </a>
                <button
                  type="button"
                  onClick={returnToSignIn}
                  className="mt-2 text-[15px] text-muted-foreground hover:text-foreground"
                >
                  Sign in with another account
                </button>
              </div>
            ) : (
              <>
                {error ? (
                  <div className="mb-6 flex items-start gap-2 text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="text-[15px]">{error}</p>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-[17px] font-medium text-foreground transition-opacity hover:opacity-85 disabled:opacity-50"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" variant="default" />
                  ) : (
                    <Icons.google className="h-4 w-4" />
                  )}
                  Continue with Google
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-3 text-[13px] text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[13px] font-medium text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Work email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={isLoading}
                      required
                      className={fieldClass}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-[13px] font-medium text-muted-foreground"
                      >
                        Password
                      </Label>
                      <Link
                        to="/forgot-password"
                        className="text-[13px] text-primary hover:underline"
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
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      disabled={isLoading}
                      required
                      className={fieldClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground text-[17px] font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50"
                  >
                    {isLoading ? "Signing in…" : "Sign in"}
                  </button>
                </form>

                <p className="mt-8 text-center text-[15px] text-muted-foreground">
                  Need a workspace?{" "}
                  <Link to="/contact" className="text-primary hover:underline">
                    Talk to us
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
