import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Compass, ShieldCheck, X } from "lucide-react";

interface AuthPageShellProps {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
  mode: "login" | "signup";
}

const authHighlights = [
  "Private dashboard and guided tools",
  "Saved resources for faster support",
  "A calmer path back to what helps",
];

const guidanceCopy = {
  login: {
    title: "Return to your saved path",
    description:
      "Your recent tools, saved resources, and next steps are ready when you sign back in.",
  },
  signup: {
    title: "Set a private starting point",
    description:
      "Create a space that can adapt around your goals, support needs, and wellness rhythm.",
  },
};

export function AuthPageShell({
  children,
  eyebrow,
  title,
  description,
  mode,
}: AuthPageShellProps) {
  return (
    <div className={`auth-shell auth-shell-${mode}`}>
      <div className="auth-background-compasses" aria-hidden="true">
        <Compass className="auth-background-compass auth-background-compass-one" />
        <Compass className="auth-background-compass auth-background-compass-two" />
        <Compass className="auth-background-compass auth-background-compass-three" />
      </div>
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
            {eyebrow ? <p className="auth-kicker">{eyebrow}</p> : null}
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="auth-guidance-panel">
            <div className="auth-guidance-icon" aria-hidden="true">
              <ShieldCheck />
            </div>
            <div>
              <strong>{guidanceCopy[mode].title}</strong>
              <p>{guidanceCopy[mode].description}</p>
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
