import { Link } from "react-router-dom";
import { SignUp as ClerkSignUp } from "@clerk/react";
import { Compass, X } from "lucide-react";
import { ClerkAuthFallback } from "../components/ClerkAuthFallback";
import { PageTransition } from "../components/PageTransition";

export function SignUp() {
  return (
    <PageTransition>
      <div className="auth-shell auth-shell-signup">
        <div className="auth-orb auth-orb-one" />
        <div className="auth-orb auth-orb-two" />
        <div className="auth-compass-rose" aria-hidden="true" />
        <div className="auth-route auth-route-one" aria-hidden="true" />
        <div className="auth-route auth-route-two" aria-hidden="true" />
        <Link aria-label="Close sign up and return home" className="auth-close" to="/">
          <X aria-hidden="true" />
        </Link>

        <section className="auth-card-wrap">
          <div className="auth-intro">
            <div className="auth-mark" aria-hidden="true">
              <Compass className="auth-mark-icon" />
              <span className="auth-mark-dot" />
            </div>
            <p className="auth-kicker">Set your direction</p>
            <h1>Begin your journey</h1>
            <p>Create your account and tailor the app around the kind of support you need.</p>
          </div>

          <div className="auth-clerk-panel">
            <ClerkSignUp
              routing="path"
              path="/signup"
              fallbackRedirectUrl="/onboarding"
              signInUrl="/login"
              signInFallbackRedirectUrl="/dashboard"
              fallback={<ClerkAuthFallback message="Loading sign up..." mode="signup" />}
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
