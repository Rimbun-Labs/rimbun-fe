import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { authService } from "@/lib/auth/authService";
import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { Footer } from "@/components/blocks/footer";

const fieldClass =
  "h-12 rounded-xl border-border bg-card text-[15px] shadow-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-0";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!code) {
      setError("This reset link is invalid or has expired.");
    }
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!code) {
      setError("This reset link is invalid or has expired.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await authService.confirmPasswordReset(
        code,
        newPassword
      );

      if (resetError) {
        setError(
          resetError.message || "Could not reset the password. The link may have expired."
        );
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch {
      setError("Could not reset the password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="homepage flex min-h-screen flex-col">
      <LandingHeader />

      <main className="flex flex-1 flex-col items-center px-6 pt-28 pb-20 md:pt-36">
        <div className="w-full max-w-[400px]">
          {isSuccess ? (
            <>
              <h1 className="text-center text-[32px] font-semibold tracking-tight text-foreground md:text-[40px]">
                Password updated
              </h1>
              <p className="mt-3 text-center text-[17px] leading-relaxed text-muted-foreground">
                You can sign in with your new password.
              </p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-10 inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground text-[17px] font-medium text-background transition-opacity hover:opacity-85"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              <h1 className="text-center text-[32px] font-semibold tracking-tight text-foreground md:text-[40px]">
                Reset password
              </h1>
              <p className="mt-3 text-center text-[17px] leading-relaxed text-muted-foreground">
                Choose a new password for your account.
              </p>

              {error ? (
                <div className="mt-8 flex items-start gap-2 text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-[15px]">{error}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
                <div className="grid gap-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-[13px] font-medium text-muted-foreground"
                  >
                    New password
                  </Label>
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading || !code}
                    required
                    className={fieldClass}
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-[13px] font-medium text-muted-foreground"
                  >
                    Confirm password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading || !code}
                    required
                    className={fieldClass}
                  />
                </div>
                <label className="flex items-center gap-2 text-[15px] text-muted-foreground">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  Show password
                </label>
                <button
                  type="submit"
                  disabled={isLoading || !code}
                  className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground text-[17px] font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50"
                >
                  {isLoading ? "Updating…" : "Update password"}
                </button>
              </form>

              <p className="mt-8 text-center text-[15px] text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
