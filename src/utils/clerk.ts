export const clerkPublishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim() ?? "";

export const clerkEnabled = clerkPublishableKey.length > 0;

export const clerkMissingMessage =
  "Clerk is not configured for this environment. Add VITE_CLERK_PUBLISHABLE_KEY to enable hosted authentication.";
