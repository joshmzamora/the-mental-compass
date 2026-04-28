import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import App from "./App.tsx";
import "./index.css";

const clerkAppearance = {
  variables: {
    colorPrimary: "#0f9f96",
    colorText: "#102033",
    colorTextSecondary: "#5f7187",
    colorBackground: "#ffffff",
    colorInputBackground: "#f8fbfc",
    colorInputText: "#102033",
    borderRadius: "1.05rem",
    fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  },
  elements: {
    rootBox: {
      width: "100%",
    },
    cardBox: {
      width: "100%",
      borderRadius: "28px",
      boxShadow: "0 34px 90px rgba(15, 56, 74, 0.18)",
    },
    card: {
      width: "100%",
      border: "1px solid rgba(15, 159, 150, 0.18)",
      borderRadius: "28px",
      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 253, 252, 0.96))",
      overflow: "hidden",
    },
    headerTitle: {
      color: "#102033",
      fontSize: "1.28rem",
      fontWeight: "800",
      letterSpacing: "-0.045em",
    },
    headerSubtitle: {
      display: "none",
    },
    socialButtonsBlockButton: {
      minHeight: "44px",
      border: "1px solid rgba(15, 159, 150, 0.18)",
      borderRadius: "16px",
      background: "rgba(255, 255, 255, 0.78)",
      boxShadow: "0 12px 28px rgba(30, 64, 85, 0.06)",
    },
    dividerLine: {
      background: "rgba(15, 159, 150, 0.16)",
    },
    dividerText: {
      color: "#70839a",
      fontWeight: "600",
    },
    formFieldLabel: {
      color: "#23364a",
      fontWeight: "750",
    },
    formFieldInput: {
      minHeight: "44px",
      borderColor: "rgba(15, 159, 150, 0.22)",
      borderRadius: "16px",
      background: "rgba(248, 251, 252, 0.86)",
      fontWeight: "600",
    },
    formButtonPrimary: {
      minHeight: "48px",
      borderRadius: "16px",
      background: "linear-gradient(135deg, #0f9f96 0%, #1688b5 100%)",
      boxShadow: "0 18px 34px rgba(15, 159, 150, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
      fontWeight: "800",
    },
    footer: {
      background: "linear-gradient(135deg, rgba(240, 253, 250, 0.88), rgba(239, 246, 255, 0.88))",
      borderTop: "1px solid rgba(15, 159, 150, 0.12)",
    },
    footerActionLink: {
      color: "#0f8f88",
      fontWeight: "700",
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
