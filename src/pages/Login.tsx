import { SignIn } from "@clerk/react";
import { AuthPageShell } from "../components/AuthPageShell";
import { ClerkAuthFallback } from "../components/ClerkAuthFallback";
import { PageTransition } from "../components/PageTransition";

export function Login() {
  return (
    <PageTransition>
      <AuthPageShell
        title="Welcome back"
        description="Pick up where you left off with your dashboard, journals, and support tools."
        mode="login"
      >
        <SignIn
          routing="path"
          path="/login"
          fallbackRedirectUrl="/dashboard"
          signUpUrl="/signup"
          signUpFallbackRedirectUrl="/onboarding"
          fallback={<ClerkAuthFallback message="Loading sign in..." mode="login" />}
        />
      </AuthPageShell>
    </PageTransition>
  );
}
