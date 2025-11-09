import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { projectId } from "../utils/supabase/info";

interface CompassBearing {
  analysis: string;
  primaryStruggle: string;
  sleepQuality: string;
  stressLevel: string;
  supportSystem: string;
  coping: string;
  physicalActivity: string;
}

interface Appointment {
  id: string;
  therapistId: string;
  therapistName: string;
  therapistSpecialty: string;
  date: string;
  time: string;
  status: string;
}

interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface MoodEntry {
  id: string;
  mood: number;
  date: string;
  note?: string;
}

interface JournalEntry {
  id: string;
  text: string;
  createdAt: string;
}

interface JourneyProgress {
  journeyId: string;
  currentStep: number;
  completedSteps: string[];
  startedAt: string;
  lastAccessedAt: string;
  completed: boolean;
  reflections?: Array<{
    stepId: string;
    reflection: string;
    createdAt: string;
    timeSpent: number;
  }>;
  totalTimeSpent?: number;
  completedAt?: string;
}

interface CompletedJourney {
  journeyId: string;
  journeyTitle: string;
  completedAt: string;
  totalTimeSpent: number;
  reflectionCount: number;
}

interface UserProfile {
  name: string;
  email: string;
  profilePicture?: string;
  compassBearing?: CompassBearing;
  appointments: Appointment[];
  goals: Goal[];
  moodLog: MoodEntry[];
  journalEntries: JournalEntry[];
  wellnessStreak: number;
  lastCheckIn?: string;
  recentlyViewedArticles: string[];
  forumPosts: number;
  activeJourneys: JourneyProgress[];
  completedJourneys?: CompletedJourney[];
}

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addAppointment: (appointment: Appointment) => void;
  addGoal: (goalText: string) => Promise<void>;
  toggleGoal: (goalId: string) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  addMoodEntry: (mood: number, note?: string) => Promise<void>;
  addJournalEntry: (text: string) => Promise<void>;
  markCheckIn: () => Promise<void>;
  addRecentlyViewedArticle: (articleId: string) => void;
  refreshProfile: () => Promise<void>;
  enrollInJourney: (journeyId: string) => Promise<void>;
  completeJourneyStep: (journeyId: string, stepId: string, reflection?: string, timeSpent?: number) => Promise<void>;
  unenrollFromJourney: (journeyId: string) => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");

      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/server/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          // Initialize with default profile
          initializeDefaultProfile();
        }
      } catch (error) {
        // Initialize with default profile
        initializeDefaultProfile();
      }
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultProfile = () => {
    if (!user) return;

    const defaultProfile: UserProfile = {
      name: user.name,
      email: user.email,
      appointments: [],
      goals: [],
      moodLog: [],
      journalEntries: [],
      wellnessStreak: 0,
      recentlyViewedArticles: [],
      forumPosts: 0,
      activeJourneys: [],
    };

    setProfile(defaultProfile);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);

    // Try to sync with backend
    try {
      const accessToken = localStorage.getItem("access_token");
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updates),
        }
      );
    } catch (error) {
      // Silently fail - data is still updated locally
      console.log("Profile update saved locally");
    }
  };

  const addAppointment = (appointment: Appointment) => {
    if (!profile) return;
    
    const updatedAppointments = [...profile.appointments, appointment];
    setProfile({ ...profile, appointments: updatedAppointments });
  };

  const addGoal = async (goalText: string) => {
    if (!profile) return;

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      text: goalText,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    await updateProfile({
      goals: [...profile.goals, newGoal],
    });
  };

  const toggleGoal = async (goalId: string) => {
    if (!profile) return;

    const updatedGoals = profile.goals.map((goal) =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );

    await updateProfile({ goals: updatedGoals });
  };

  const deleteGoal = async (goalId: string) => {
    if (!profile) return;

    const updatedGoals = profile.goals.filter((goal) => goal.id !== goalId);
    await updateProfile({ goals: updatedGoals });
  };

  const addMoodEntry = async (mood: number, note?: string) => {
    if (!profile) return;

    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      mood,
      date: new Date().toISOString().split("T")[0],
      note,
    };

    // Keep only last 30 days
    const updatedMoodLog = [...profile.moodLog, newEntry].slice(-30);

    await updateProfile({ moodLog: updatedMoodLog });
  };

  const addJournalEntry = async (text: string) => {
    if (!profile) return;

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
    };

    // Keep last 50 entries
    const updatedJournal = [newEntry, ...profile.journalEntries].slice(0, 50);

    await updateProfile({ journalEntries: updatedJournal });
  };

  const markCheckIn = async () => {
    if (!profile) return;

    const today = new Date().toISOString().split("T")[0];
    const lastCheckIn = profile.lastCheckIn?.split("T")[0];

    let newStreak = profile.wellnessStreak;

    if (!lastCheckIn) {
      newStreak = 1;
    } else if (lastCheckIn === today) {
      // Already checked in today
      return;
    } else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      newStreak = lastCheckIn === yesterday ? newStreak + 1 : 1;
    }

    await updateProfile({
      wellnessStreak: newStreak,
      lastCheckIn: new Date().toISOString(),
    });
  };

  const addRecentlyViewedArticle = (articleId: string) => {
    if (!profile) return;

    const updated = [
      articleId,
      ...profile.recentlyViewedArticles.filter((id) => id !== articleId),
    ].slice(0, 5);

    setProfile({ ...profile, recentlyViewedArticles: updated });
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const enrollInJourney = async (journeyId: string) => {
    if (!profile) return;

    const newProgress: JourneyProgress = {
      journeyId,
      currentStep: 1,
      completedSteps: [],
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      completed: false,
    };

    await updateProfile({
      activeJourneys: [...profile.activeJourneys, newProgress],
    });
  };

  const completeJourneyStep = async (journeyId: string, stepId: string, reflection?: string, timeSpent?: number) => {
    if (!profile) return;

    const updatedJourneys = profile.activeJourneys.map((journey) => {
      if (journey.journeyId === journeyId) {
        const completedSteps = [...journey.completedSteps, stepId];
        const newReflections = reflection && timeSpent ? [...(journey.reflections || []), { stepId, reflection, createdAt: new Date().toISOString(), timeSpent }] : journey.reflections;
        return {
          ...journey,
          completedSteps,
          currentStep: journey.currentStep + 1,
          lastAccessedAt: new Date().toISOString(),
          reflections: newReflections,
        };
      }
      return journey;
    });

    await updateProfile({ activeJourneys: updatedJourneys });
  };

  const unenrollFromJourney = async (journeyId: string) => {
    if (!profile) return;

    const updatedJourneys = profile.activeJourneys.filter(
      (journey) => journey.journeyId !== journeyId
    );

    await updateProfile({ activeJourneys: updatedJourneys });
  };

  const value = {
    profile,
    loading,
    updateProfile,
    addAppointment,
    addGoal,
    toggleGoal,
    deleteGoal,
    addMoodEntry,
    addJournalEntry,
    markCheckIn,
    addRecentlyViewedArticle,
    refreshProfile,
    enrollInJourney,
    completeJourneyStep,
    unenrollFromJourney,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}