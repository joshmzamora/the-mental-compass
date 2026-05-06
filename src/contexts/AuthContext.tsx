import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useClerk, useUser } from "@clerk/react";
import { clerkEnabled } from "../utils/clerk";

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

function readBackupUser(): User | null {
  try {
    const savedUser = localStorage.getItem(BACKUP_AUTH_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem(BACKUP_AUTH_USER_KEY);
    return null;
  }
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function LocalAuthProvider({ children }: { children: ReactNode }) {
  const [backupUser, setBackupUser] = useState<User | null>(null);

  useEffect(() => {
    const syncBackupUser = () => {
      setBackupUser(readBackupUser());
    };

    syncBackupUser();
    window.addEventListener(BACKUP_AUTH_EVENT, syncBackupUser);

    return () => {
      window.removeEventListener(BACKUP_AUTH_EVENT, syncBackupUser);
    };
  }, []);

  const login: AuthContextType["login"] = async () => {};
  const signup: AuthContextType["signup"] = async () => {};

  const logout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem(BACKUP_AUTH_USER_KEY);
    window.dispatchEvent(new Event(BACKUP_AUTH_EVENT));
  };

  return (
    <AuthContext.Provider
      value={{
        user: backupUser,
        loading: false,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function ClerkBackedAuthProvider({ children }: { children: ReactNode }) {
  const clerk = useClerk();
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const [backupUser, setBackupUser] = useState<User | null>(null);

  useEffect(() => {
    const syncBackupUser = () => {
      setBackupUser(readBackupUser());
    };

    syncBackupUser();
    window.addEventListener(BACKUP_AUTH_EVENT, syncBackupUser);

    return () => {
      window.removeEventListener(BACKUP_AUTH_EVENT, syncBackupUser);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !clerkUser || !backupUser) return;

    localStorage.removeItem(BACKUP_AUTH_USER_KEY);
    setBackupUser(null);
    window.dispatchEvent(new Event(BACKUP_AUTH_EVENT));
  }, [backupUser, clerkUser, isLoaded, isSignedIn]);

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

export function AuthProvider({ children }: { children: ReactNode }) {
  if (!clerkEnabled) {
    return <LocalAuthProvider>{children}</LocalAuthProvider>;
  }

  return <ClerkBackedAuthProvider>{children}</ClerkBackedAuthProvider>;
}
