import { createContext, ReactNode, useContext, useMemo } from "react";
import { useClerk, useUser } from "@clerk/react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const clerk = useClerk();
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  const user = useMemo<User | null>(() => {
    if (!isLoaded || !isSignedIn || !clerkUser) {
      return null;
    }

    const email =
      clerkUser.primaryEmailAddress?.emailAddress ||
      clerkUser.emailAddresses[0]?.emailAddress ||
      "";

    return {
      id: clerkUser.id,
      email,
      name:
        clerkUser.fullName ||
        clerkUser.username ||
        email.split("@")[0] ||
        "User",
    };
  }, [clerkUser, isLoaded, isSignedIn]);

  const login: AuthContextType["login"] = async () => {
    await clerk.redirectToSignIn({
      signInFallbackRedirectUrl: "/dashboard",
    });
  };

  const signup: AuthContextType["signup"] = async () => {
    await clerk.redirectToSignUp({
      signUpFallbackRedirectUrl: "/onboarding",
    });
  };

  const logout = async () => {
    localStorage.removeItem("access_token");
    await clerk.signOut({ redirectUrl: "/" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: !isLoaded,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
