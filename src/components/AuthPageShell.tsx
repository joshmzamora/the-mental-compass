import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Compass, ShieldCheck, X } from "lucide-react";

interface AuthPageShellProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  mode: "login" | "signup";
}

const authHighlights = [
  "Private dashboard and guided tools",
  "Saved resources for faster support",
  "A calmer path back to what helps",
];

export function AuthPageShell({
  children,
  eyebrow,
  title,
  description,
  mode,
}: AuthPageShellProps) {
  return (
    <div className={`auth-shell auth-shell-${mode}`}>
      <div className="auth-compass-rose" aria-hidden="true" />
      <Link aria-label={`Close ${mode} and return home`} className="auth-close" to="/">
        <X aria-hidden="true" />
      </Link>

      <section className="auth-page-grid" aria-label={title}>
        <div className="auth-story-panel">
          <div className="auth-brand-lockup">
            <div className="auth-mark" aria-hidden="true">
              <Compass className="auth-mark-icon" />
            </div>
            <div>
              <p>The Mental Compass</p>
              <span>Navigate your mental wellness</span>
            </div>
          </div>

          <div className="auth-intro">
            <p className="auth-kicker">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="auth-guidance-panel">
            <div className="auth-guidance-icon" aria-hidden="true">
              <ShieldCheck />
            </div>
            <div>
              <strong>Built for steady support</strong>
              <p>
                Your account keeps the tools you use most close by, without adding
                noise when you are looking for help.
              </p>
            </div>
          </div>

          <ul className="auth-highlight-list" aria-label="Account benefits">
            {authHighlights.map((highlight) => (
              <li key={highlight}>
                <CheckCircle2 aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-heading">
            <p>{mode === "signup" ? "Create your account" : "Sign in securely"}</p>
            <span>
              {mode === "signup"
                ? "Start with a few details, then personalize your compass."
                : "Continue to your dashboard and saved support tools."}
            </span>
          </div>

          <div className="auth-clerk-panel">{children}</div>

          <Link className="auth-back-link" to="/">
            <ArrowLeft aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
