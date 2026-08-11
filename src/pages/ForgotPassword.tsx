import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { authService } from "@/lib/auth/authService";
import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { Footer } from "@/components/blocks/footer";

const fieldClass =
  "h-12 rounded-xl border-border bg-card text-[15px] shadow-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-0";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: sendError } = await authService.sendPasswordResetEmail(email);

      if (sendError) {
        setError(sendError.message || "Could not send the reset email. Please try again.");
      } else {
        setIsSent(true);
      }
    } catch {
      setError("Could not send the reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="homepage flex min-h-screen flex-col">
      <LandingHeader />

      <main className="flex flex-1 flex-col items-center px-6 pt-28 pb-20 md:pt-36">
        <div className="w-full max-w-[400px]">
          {isSent ? (
            <>
              <h1 className="text-center text-[32px] font-semibold tracking-tight text-foreground md:text-[40px]">
                Check your email
              </h1>
              <p className="mt-3 text-center text-[17px] leading-relaxed text-muted-foreground">
                If an account exists for{" "}
                <span className="text-foreground">{email}</span>, you’ll get a
                link to reset your password.
              </p>
              <p className="mt-4 text-center text-[15px] text-muted-foreground">
                If it doesn’t arrive, check spam, or{" "}
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="text-primary hover:underline"
                >
                  try again
                </button>
                .
              </p>
              <Link
                to="/login"
                className="mt-10 inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground text-[17px] font-medium text-background transition-opacity hover:opacity-85"
              >
                Back to sign in
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-center text-[32px] font-semibold tracking-tight text-foreground md:text-[40px]">
                Forgot password
              </h1>
              <p className="mt-3 text-center text-[17px] leading-relaxed text-muted-foreground">
                Enter your work email and we’ll send a reset link.
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
                    htmlFor="email"
                    className="text-[13px] font-medium text-muted-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  {isLoading ? "Sending…" : "Send reset link"}
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

export default ForgotPassword;
