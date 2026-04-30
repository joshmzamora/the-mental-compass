import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import App from "./App.tsx";
import "./index.css";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to your Vite environment.");
}

const clerkAppearance = {
  variables: {
    colorPrimary: "#0f9f96",
    colorText: "#102033",
    colorTextSecondary: "#5f7187",
    colorBackground: "rgba(255, 255, 255, 0)",
    colorInputBackground: "#f8fbfc",
    colorInputText: "#102033",
    borderRadius: "0.9rem",
    fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  },
  elements: {
    rootBox: {
      width: "100%",
    },
    cardBox: {
      width: "100%",
      borderRadius: "22px",
      boxShadow: "none",
    },
    card: {
      width: "100%",
      border: "1px solid rgba(15, 159, 150, 0.14)",
      borderRadius: "22px",
      background: "rgba(255, 255, 255, 0.86)",
      backdropFilter: "blur(12px)",
      overflow: "hidden",
      boxShadow: "none",
    },
    headerTitle: {
      color: "#102033",
      fontSize: "1.42rem",
      fontWeight: "850",
      letterSpacing: "-0.035em",
      lineHeight: "1.15",
      wordSpacing: "0.08em",
    },
    headerSubtitle: {
      display: "none",
    },
    main: {
      gap: "1rem",
    },
    socialButtonsBlockButton: {
      minHeight: "46px",
      border: "1px solid rgba(15, 159, 150, 0.14)",
      borderRadius: "14px",
      background: "#ffffff",
      boxShadow: "0 10px 24px rgba(30, 64, 85, 0.05)",
      fontWeight: "700",
    },
    socialButtonsBlockButtonText: {
      color: "#22364a",
      fontWeight: "750",
    },
    dividerLine: {
      background: "rgba(15, 159, 150, 0.12)",
    },
    dividerText: {
      color: "#70839a",
      fontWeight: "600",
    },
    formFieldLabel: {
      color: "#23364a",
      fontWeight: "800",
      fontSize: "0.84rem",
    },
    formFieldInput: {
      minHeight: "46px",
      borderColor: "rgba(15, 159, 150, 0.18)",
      borderRadius: "14px",
      background: "#f8fbfc",
      fontWeight: "600",
    },
    formFieldInputShowPasswordButton: {
      color: "#0f8f88",
    },
    formButtonPrimary: {
      minHeight: "48px",
      borderRadius: "14px",
      background: "linear-gradient(135deg, #0f9f96 0%, #1688b5 52%, #2563eb 100%)",
      boxShadow: "0 14px 28px rgba(15, 159, 150, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.28)",
      fontWeight: "850",
    },
    footer: {
      background: "rgba(240, 253, 250, 0.52)",
      borderTop: "1px solid rgba(15, 159, 150, 0.1)",
    },
    footerActionLink: {
      color: "#0f8f88",
      fontWeight: "800",
    },
    identityPreviewEditButton: {
      color: "#0f8f88",
    },
    formResendCodeLink: {
      color: "#0f8f88",
      fontWeight: "700",
    },
  },
};

const clerkLocalization = {
  signIn: {
    start: {
      title: "Sign in",
      subtitle: "",
    },
  },
  signUp: {
    start: {
      title: "Create account",
      subtitle: "",
    },
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={clerkAppearance}
      localization={clerkLocalization}
      signInUrl="/login"
      signUpUrl="/signup"
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);
