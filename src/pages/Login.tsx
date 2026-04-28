import { Link } from "react-router-dom";
import { SignIn } from "@clerk/react";
import { Compass, X } from "lucide-react";
import { ClerkAuthFallback } from "../components/ClerkAuthFallback";
import { PageTransition } from "../components/PageTransition";

export function Login() {
  return (
    <PageTransition>
      <div className="auth-shell auth-shell-login">
        <div className="auth-orb auth-orb-one" />
        <div className="auth-orb auth-orb-two" />
        <div className="auth-compass-rose" aria-hidden="true" />
        <div className="auth-route auth-route-one" aria-hidden="true" />
        <div className="auth-route auth-route-two" aria-hidden="true" />
        <Link aria-label="Close login and return home" className="auth-close" to="/">
          <X aria-hidden="true" />
        </Link>

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
            <SignIn
              routing="path"
              path="/login"
              fallbackRedirectUrl="/dashboard"
              signUpUrl="/signup"
              signUpFallbackRedirectUrl="/onboarding"
              fallback={<ClerkAuthFallback message="Loading sign in..." mode="login" />}
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
