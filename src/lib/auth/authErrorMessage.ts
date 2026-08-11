function errorCode(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    return String((error as { code: string }).code);
  }
  return "";
}

export function authErrorMessage(error: unknown): string {
  switch (errorCode(error)) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign in was cancelled.";
    case "auth/popup-blocked":
      return "The sign-in window was blocked. Please try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Please choose a stronger password.";
    case "auth/expired-action-code":
    case "auth/invalid-action-code":
      return "This reset link is invalid or has expired.";
    case "auth/requires-recent-login":
      return "Please sign in again to continue.";
    case "auth/user-mismatch":
      return "That account does not match.";
    default:
      break;
  }

  const raw = error instanceof Error ? error.message : "";
  if (!raw || /firebase/i.test(raw) || /auth\//i.test(raw)) {
    return "Something went wrong. Please try again.";
  }
  return raw;
}

export function toAuthError(error: unknown): Error {
  return new Error(authErrorMessage(error));
}
