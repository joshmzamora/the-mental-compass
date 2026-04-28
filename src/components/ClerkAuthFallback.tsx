import { Compass } from "lucide-react";

interface ClerkAuthFallbackProps {
  message: string;
}

export function ClerkAuthFallback({ message }: ClerkAuthFallbackProps) {
  return (
    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg">
      <Compass className="mx-auto mb-4 h-10 w-10 animate-spin text-teal-600" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}

export function ClerkAuthError() {
  return (
    <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-lg">
      <h2 className="mb-2 text-xl font-medium text-gray-900">Authentication could not load</h2>
      <p className="text-sm text-gray-600">
        Refresh the page and confirm the Clerk publishable key is available to Vite.
      </p>
    </div>
  );
}
