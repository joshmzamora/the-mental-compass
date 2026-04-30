import { SignUp as ClerkSignUp } from "@clerk/react";
import { AuthPageShell } from "../components/AuthPageShell";
import { ClerkAuthFallback } from "../components/ClerkAuthFallback";
import { PageTransition } from "../components/PageTransition";

export function SignUp() {
  return (
    <PageTransition>
      <AuthPageShell
        eyebrow="Set your direction"
        title="Begin your journey"
        description="Create your account and tailor the app around the kind of support you need."
        mode="signup"
      >
        <ClerkSignUp
          routing="path"
          path="/signup"
          fallbackRedirectUrl="/onboarding"
          signInUrl="/login"
          signInFallbackRedirectUrl="/dashboard"
          fallback={<ClerkAuthFallback message="Loading sign up..." mode="signup" />}
        />
      </AuthPageShell>
    </PageTransition>
  );
}
