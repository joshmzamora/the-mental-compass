import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useClerk, useUser } from "@clerk/react";

const BACKUP_AUTH_USER_KEY = "mental_compass_backup_user";
const BACKUP_AUTH_EVENT = "mental-compass-backup-auth";

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
  const [backupUser, setBackupUser] = useState<User | null>(null);

  useEffect(() => {
    const readBackupUser = () => {
      try {
        const savedUser = localStorage.getItem(BACKUP_AUTH_USER_KEY);
        setBackupUser(savedUser ? JSON.parse(savedUser) : null);
      } catch {
        localStorage.removeItem(BACKUP_AUTH_USER_KEY);
        setBackupUser(null);
      }
    };

    readBackupUser();
    window.addEventListener(BACKUP_AUTH_EVENT, readBackupUser);

    return () => {
      window.removeEventListener(BACKUP_AUTH_EVENT, readBackupUser);
    };
  }, []);

  const user = useMemo<User | null>(() => {
    if (!isLoaded) {
      return backupUser;
    }

    if (!isSignedIn || !clerkUser) {
      return backupUser;
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
  }, [backupUser, clerkUser, isLoaded, isSignedIn]);

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
    localStorage.removeItem(BACKUP_AUTH_USER_KEY);
    window.dispatchEvent(new Event(BACKUP_AUTH_EVENT));
    await clerk.signOut({ redirectUrl: "/" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: !isLoaded && !backupUser,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
