import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";

interface ClerkAuthFallbackProps {
  message: string;
  mode: "login" | "signup";
}

interface LocalAuthFormProps {
  mode: "login" | "signup";
}

const BACKUP_AUTH_USER_KEY = "mental_compass_backup_user";
const BACKUP_AUTH_EVENT = "mental-compass-backup-auth";

function LocalAuthForm({ mode }: LocalAuthFormProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim() || "guest@thementalcompass.org";
    const displayName =
      name.trim() ||
      normalizedEmail.split("@")[0]?.replace(/[._-]/g, " ") ||
      "Guest User";

    localStorage.setItem(
      BACKUP_AUTH_USER_KEY,
      JSON.stringify({
        id: `backup-${Date.now()}`,
        email: normalizedEmail,
        name: displayName,
      })
    );
    window.dispatchEvent(new Event(BACKUP_AUTH_EVENT));
    navigate(mode === "signup" ? "/onboarding" : "/dashboard");
  };

  return (
    <form className="local-auth-form" onSubmit={handleSubmit}>
      <div className="local-auth-heading">
        <strong>{mode === "signup" ? "Create account" : "Sign in"}</strong>
      </div>

      {mode === "signup" && (
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            type="text"
          />
        </label>
      )}

      <label>
        Email
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          type="email"
        />
      </label>

      <button type="submit">
        {mode === "signup" ? "Create account" : "Continue"}
      </button>

      <p className="local-auth-disclaimer">
        {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          className="local-auth-link"
          onClick={() => navigate(mode === "signup" ? "/login" : "/signup")}
          type="button"
        >
          {mode === "signup" ? "Sign in" : "Sign up"}
        </button>
      </p>
    </form>
  );
}

export function ClerkAuthFallback({ message, mode }: ClerkAuthFallbackProps) {
  const [showBackup, setShowBackup] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowBackup(true), 4500);
    return () => window.clearTimeout(timeout);
  }, []);

  if (showBackup) {
    return <LocalAuthForm mode={mode} />;
  }

  return (
    <div className="auth-fallback">
      <Compass className="auth-fallback-icon" />
      <p>{message}</p>
    </div>
  );
}

export function ClerkAuthError({ mode }: LocalAuthFormProps) {
  return <LocalAuthForm mode={mode} />;
}
