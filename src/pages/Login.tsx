import { Link } from "react-router-dom";
import { ClerkFailed, SignIn } from "@clerk/react";
import { Compass } from "lucide-react";
import { ClerkAuthError, ClerkAuthFallback } from "../components/ClerkAuthFallback";
import { PageTransition } from "../components/PageTransition";

export function Login() {
  return (
    <PageTransition>
      <div className="auth-shell">
        <div className="auth-orb auth-orb-one" />
        <div className="auth-orb auth-orb-two" />

        <section className="auth-card-wrap">
          <div className="auth-intro">
            <div className="auth-mark" aria-hidden="true">
              <Compass className="auth-mark-icon" />
              <span className="auth-mark-dot" />
            </div>
            <p className="auth-kicker">Your private compass</p>
            <h1>Welcome back</h1>
            <p>Pick up where you left off with your dashboard, journals, and support tools.</p>
          </div>

          <div className="auth-clerk-panel">
            <ClerkFailed>
              <ClerkAuthError />
            </ClerkFailed>
            <SignIn
              routing="path"
              path="/login"
              fallbackRedirectUrl="/dashboard"
              signUpUrl="/signup"
              signUpFallbackRedirectUrl="/onboarding"
              fallback={<ClerkAuthFallback message="Loading sign in..." />}
            />
          </div>

          <div className="auth-back-link">
            <Link to="/">
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
