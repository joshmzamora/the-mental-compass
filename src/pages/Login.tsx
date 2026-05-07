import { SignIn } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { AuthPageShell } from "../components/AuthPageShell";
import { ClerkAuthFallback } from "../components/ClerkAuthFallback";
import { PageTransition } from "../components/PageTransition";
import { useAuth } from "../contexts/AuthContext";
import { clerkEnabled, clerkMissingMessage } from "../utils/clerk";

export function Login() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageTransition>
      <AuthPageShell
        title="Welcome back"
        description="Pick up where you left off with your dashboard, journals, and support tools."
        mode="login"
      >
        {clerkEnabled ? (
          <SignIn
            routing="path"
            path="/login"
            fallbackRedirectUrl="/dashboard"
            signUpUrl="/signup"
            signUpFallbackRedirectUrl="/onboarding"
            fallback={<ClerkAuthFallback message="Loading sign in..." mode="login" />}
          />
        ) : (
          <ClerkAuthFallback message={clerkMissingMessage} mode="login" />
        )}
      </AuthPageShell>
    </PageTransition>
  );
}
