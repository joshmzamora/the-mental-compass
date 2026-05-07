import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { AuthPageShell } from "../components/AuthPageShell";
import { ClerkAuthFallback } from "../components/ClerkAuthFallback";
import { PageTransition } from "../components/PageTransition";
import { useAuth } from "../contexts/AuthContext";
import { clerkEnabled, clerkMissingMessage } from "../utils/clerk";

export function SignUp() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageTransition>
      <AuthPageShell
        title="Begin your journey"
        description="Create your account and tailor the app around the kind of support you need."
        mode="signup"
      >
        {clerkEnabled ? (
          <ClerkSignUp
            routing="path"
            path="/signup"
            fallbackRedirectUrl="/onboarding"
            signInUrl="/login"
            signInFallbackRedirectUrl="/dashboard"
            fallback={<ClerkAuthFallback message="Loading sign up..." mode="signup" />}
          />
        ) : (
          <ClerkAuthFallback message={clerkMissingMessage} mode="signup" />
        )}
      </AuthPageShell>
    </PageTransition>
  );
}
