import { Compass } from "lucide-react";

interface ClerkAuthFallbackProps {
  message: string;
}

export function ClerkAuthFallback({ message }: ClerkAuthFallbackProps) {
  return (
    <div className="auth-fallback">
      <Compass className="auth-fallback-icon" />
      <p>{message}</p>
    </div>
  );
}

export function ClerkAuthError() {
  return (
    <div className="auth-fallback auth-fallback-error">
      <h2>Authentication could not load</h2>
      <p>
        Refresh the page and confirm the Clerk publishable key is available to Vite.
      </p>
    </div>
  );
}
