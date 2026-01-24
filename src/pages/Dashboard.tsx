import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Compass,
  Calendar,
  MessageSquare,
  BookOpen,
  LogOut,
  Clock,
  User as UserIcon,
  TrendingUp,
  Edit,
  Target,
  Heart,
  Flame,
  Plus,
  X,
  Check,
  AlertCircle,
  Phone,
  Smile,
  Meh,
  Frown,
  FileText,
  Users,
  Activity,
  Award,
  Camera,
  Mail,
  Map,
  ChevronRight,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  Star,
  Zap,
  Sun,
  Moon,
  Brain,
  Wind,
  Navigation,
  TrendingDown,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Progress } from "../components/ui/progress";
import { Switch } from "../components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { PageTransition } from "../components/PageTransition";
import { ActiveJourneysWidget } from "../components/ActiveJourneysWidget";
import { useAuth } from "../contexts/AuthContext";
import { useUserProfile } from "../contexts/UserProfileContext";
import { blogPosts } from "../data/blog-posts";
import { therapists } from "../data/therapists";
import { guidedJourneys, getJourneyById } from "../data/guided-journeys";
import { toast } from "sonner@2.0.3";

interface DashboardPreferences {
  compassBearingExpanded: boolean;
  hasSeenCompassBearing: boolean;
  showWellnessScore: boolean;
  showMotivationalQuote: boolean;
  showAchievements: boolean;
  showUpcomingAppointments: boolean;
  showCommunityActivity: boolean;
  showRecommendedContent: boolean;
  showGoals: boolean;
  showMoodTracker: boolean;
  showJournal: boolean;
  compactView: boolean;
  darkAccents: boolean;
}

const defaultPreferences: DashboardPreferences = {
  compassBearingExpanded: true,
  hasSeenCompassBearing: false,
  showWellnessScore: true,
  showMotivationalQuote: true,
  showAchievements: true,
  showUpcomingAppointments: true,
  showCommunityActivity: true,
  showRecommendedContent: true,
  showGoals: true,
  showMoodTracker: true,
  showJournal: true,
  compactView: false,
  darkAccents: false,
};

const motivationalQuotes = [
  "Every step forward is progress, no matter how small.",
  "Your mental health is a priority, not a luxury.",
  "Healing is not linear, and that's perfectly okay.",
  "You are stronger than you think.",
  "Progress, not perfection.",
  "Be kind to yourself today.",
  "Your feelings are valid.",
  "One day at a time, one step at a time.",
];

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    profile,
    loading,
    updateProfile,
    addGoal,
    toggleGoal,
    deleteGoal,
    addMoodEntry,
    addJournalEntry,
    markCheckIn,
    addRecentlyViewedArticle,
    refreshProfile,
  } = useUserProfile();

  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editProfilePic, setEditProfilePic] = useState("");
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [showMoodDialog, setShowMoodDialog] = useState(false);
  const [currentMood, setCurrentMood] = useState(3);
  const [moodNote, setMoodNote] = useState("");
  const [showJournalDialog, setShowJournalDialog] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [showCustomization, setShowCustomization] = useState(false);

  // Dashboard preferences
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => {
    const saved = localStorage.getItem("dashboard_preferences");
    if (saved) {
      const parsed = JSON.parse(saved);
      // If user has seen compass bearing before, default to collapsed
      if (parsed.hasSeenCompassBearing) {
        return { ...parsed, compassBearingExpanded: false };
      }
      return parsed;
    }
    return defaultPreferences;
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dashboard_preferences", JSON.stringify(preferences));
  }, [preferences]);

  // Mark compass bearing as seen when it's first expanded
  useEffect(() => {
    if (profile?.compassBearing && !preferences.hasSeenCompassBearing) {
      setPreferences((prev) => ({
        ...prev,
        hasSeenCompassBearing: true,
        compassBearingExpanded: true,
      }));
    }
  }, [profile?.compassBearing]);

  const updatePreference = <K extends keyof DashboardPreferences>(
    key: K,
    value: DashboardPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Auto check-in on dashboard visit
    if (profile && !loading) {
      const today = new Date().toISOString().split("T")[0];
      const lastCheckIn = profile.lastCheckIn?.split("T")[0];
      if (lastCheckIn !== today) {
        markCheckIn();
      }
    }
  }, [user, profile, loading]);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed") === "true";

    if (!loading && profile && !profile.compassBearing && !hasCompletedOnboarding) {
      console.log("Onboarding required - redirecting...");
      navigate("/onboarding");
    }
  }, [loading, profile, navigate]);

  // Refresh profile when returning to dashboard (for assessment updates)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && profile) {
        refreshProfile();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [profile, refreshProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const handleProfileUpdate = async () => {
    await updateProfile({
      name: editName || profile?.name,
      profilePicture: editProfilePic || profile?.profilePicture,
    });
    setShowProfileEdit(false);
    toast.success("Profile updated successfully!");
  };

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    await addGoal(newGoal);
    setNewGoal("");
    setShowGoalDialog(false);
    toast.success("Goal added!");
  };

  const handleLogMood = async () => {
    await addMoodEntry(currentMood, moodNote);
    setMoodNote("");
    setCurrentMood(3);
    setShowMoodDialog(false);
    toast.success("Mood logged!");
  };

  const handleAddJournal = async () => {
    if (!journalText.trim()) return;
    await addJournalEntry(journalText);
    setJournalText("");
    setShowJournalDialog(false);
    toast.success("Journal entry saved!");
  };

  const getRecommendedPosts = () => {
    if (!profile?.compassBearing) return blogPosts.slice(0, 4);

    const categoryMap: Record<string, string[]> = {
      anxiety: ["Coping Strategies", "Wellness", "Education"],
      depression: ["Support", "Wellness", "Education"],
      stress: ["Wellness", "Coping Strategies"],
      trauma: ["Support", "Education"],
      grief: ["Support", "Coping Strategies"],
      relationships: ["Support", "Wellness"],
      addiction: ["Support", "Education"],
      wellness: ["Wellness", "Education"],
    };

    const relevantCategories = categoryMap[profile.compassBearing.primaryStruggle] || ["Wellness"];

    return blogPosts
      .filter((post) => relevantCategories.includes(post.category))
      .slice(0, 4);
  };

  const getRecommendedTherapists = () => {
    if (!profile?.compassBearing) return therapists.slice(0, 3);

    const specialtyMap: Record<string, string[]> = {
      anxiety: ["Anxiety", "Stress Management"],
      depression: ["Depression"],
      stress: ["Stress Management", "Wellness"],
      trauma: ["PTSD", "Trauma"],
      grief: ["Grief Counseling", "Trauma"],
      relationships: ["Relationships", "Family Therapy", "Couples Therapy"],
      addiction: ["Addiction", "Substance Abuse"],
      wellness: ["Mindfulness", "Wellness"],
    };

    const relevantSpecialties = specialtyMap[profile.compassBearing.primaryStruggle] || ["Wellness"];

    return therapists
      .filter((therapist) =>
        therapist.specialty.some((spec) => relevantSpecialties.some((rel) => spec.includes(rel)))
      )
      .slice(0, 3);
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 4) return <Smile className="h-5 w-5 text-green-600" />;
    if (mood === 3) return <Meh className="h-5 w-5 text-yellow-600" />;
    return <Frown className="h-5 w-5 text-red-600" />;
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 4) return "bg-green-500";
    if (mood === 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRecentMoodData = () => {
    if (!profile?.moodLog || profile.moodLog.length === 0) return [];
    return profile.moodLog.slice(-7);
  };

  // Compass Calibration - Advanced Wellness Score
  const calculateCompassCalibration = () => {
    if (!profile) return { north: 0, east: 0, south: 0, west: 0, overall: 0 };

    // NORTH - Mental Clarity (Goals, Journeys, Focus)
    const goalsCompleted = profile.goals?.filter(g => g.completed).length || 0;
    const totalGoals = profile.goals?.length || 0;
    const goalsScore = totalGoals > 0 ? (goalsCompleted / totalGoals) * 100 : 50;
    const journeyProgress = profile.activeJourneys?.length || 0;
    const journeyScore = Math.min(journeyProgress * 20, 100);
    const north = Math.round((goalsScore + journeyScore) / 2);

    // EAST - Emotional Balance (Mood tracking)
    const recentMoods = getRecentMoodData();
    let east = 50;
    if (recentMoods.length > 0) {
      const avgMood = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
      east = Math.round((avgMood / 5) * 100);
    }

    // SOUTH - Physical Vitality (Streak, Activity)
    const streakScore = Math.min((profile.wellnessStreak || 0) * 10, 100);
    const activityScore = Math.min(((profile.journalEntries?.length || 0) + (profile.appointments?.length || 0)) * 5, 100);
    const south = Math.round((streakScore + activityScore) / 2);

    // WEST - Social Connection (Community, Appointments)
    const appointmentScore = Math.min((profile.appointments?.length || 0) * 25, 100);
    const communityScore = Math.min((profile.forumPosts || 0) * 10, 100);
    const west = Math.round((appointmentScore + communityScore) / 2);

    // Overall compass calibration
    const overall = Math.round((north + east + south + west) / 4);

    return { north, east, south, west, overall };
  };

  const getCompassDirection = (score: number) => {
    if (score >= 80) return { label: "True North", color: "text-green-500", trend: "up" };
    if (score >= 60) return { label: "On Course", color: "text-teal-500", trend: "steady" };
    if (score >= 40) return { label: "Recalibrating", color: "text-blue-500", trend: "steady" };
    return { label: "Needs Attention", color: "text-purple-500", trend: "down" };
  };

  const getPersonalizedInsights = () => {
    if (!profile?.compassBearing) return [];

    const insights: Array<{ icon: any; message: string; action: string; link: string }> = [];
    const recentMoods = getRecentMoodData();
    const compass = calculateCompassCalibration();

    // Mood-based insights
    if (recentMoods.length >= 3) {
      const avgMood = recentMoods.reduce((sum, e) => sum + e.mood, 0) / recentMoods.length;
      if (avgMood < 2.5) {
        insights.push({
          icon: Heart,
          message: "Your mood has been low lately. Remember, it's okay to ask for support.",
          action: "View Crisis Resources",
          link: "/helplines"
        });
      } else if (avgMood >= 4) {
        insights.push({
          icon: Sparkles,
          message: "Your mood has been positive! Keep up those healthy habits.",
          action: "Celebrate Your Progress",
          link: "/community"
        });
      }
    }

    // Journey-based insights
    if (profile.activeJourneys && profile.activeJourneys.length === 0) {
      insights.push({
        icon: Map,
        message: `Based on your ${profile.compassBearing.primaryStruggle} focus, guided journeys can help.`,
        action: "Start a Journey",
        link: "/blog"
      });
    }

    // Streak insights
    if ((profile.wellnessStreak || 0) >= 7) {
      insights.push({
        icon: Flame,
        message: "Amazing! You've maintained your streak for a week. That's real commitment.",
        action: "Share in Community",
        link: "/community"
      });
    } else if ((profile.wellnessStreak || 0) === 0) {
      insights.push({
        icon: Target,
        message: "Start building your wellness streak today with small, consistent actions.",
        action: "Set a Daily Goal",
        link: "#goals"
      });
    }

    // Appointment insights
    if (!profile.appointments || profile.appointments.length === 0) {
      insights.push({
        icon: Calendar,
        message: "Professional support can make a significant difference in your journey.",
        action: "Find a Navigator",
        link: "/appointments"
      });
    }

    // Compass calibration insights
    if (compass.north < 40) {
      insights.push({
        icon: Brain,
        message: "Your mental clarity could use some attention. Try setting specific, achievable goals.",
        action: "Set New Goals",
        link: "#goals"
      });
    }

    if (compass.west < 40) {
      insights.push({
        icon: Users,
        message: "Connection is healing. Consider reaching out to our supportive community.",
        action: "Join Community",
        link: "/community"
      });
    }

    return insights.slice(0, 3); // Return top 3 insights
  };

  const getAchievements = () => {
    const achievements = [];
    if ((profile?.wellnessStreak || 0) >= 7) {
      achievements.push({ icon: Flame, label: "Week Warrior", color: "text-orange-500" });
    }
    if ((profile?.journalEntries?.length || 0) >= 5) {
      achievements.push({ icon: FileText, label: "Reflective Writer", color: "text-purple-500" });
    }
    if ((profile?.goals?.filter(g => g.completed).length || 0) >= 3) {
      achievements.push({ icon: Target, label: "Goal Crusher", color: "text-green-500" });
    }
    if ((profile?.moodLog?.length || 0) >= 7) {
      achievements.push({ icon: Activity, label: "Emotion Tracker", color: "text-blue-500" });
    }
    if ((profile?.appointments?.length || 0) >= 1) {
      achievements.push({ icon: Calendar, label: "Care Seeker", color: "text-teal-500" });
    }
    if ((profile?.activeJourneys?.length || 0) >= 1) {
      achievements.push({ icon: Map, label: "Journey Explorer", color: "text-purple-600" });
    }
    return achievements;
  };

  const getTodayQuote = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return motivationalQuotes[dayOfYear % motivationalQuotes.length];
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <Compass className="h-16 w-16 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your compass...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!profile?.compassBearing && localStorage.getItem("onboarding_completed") !== "true") {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <Compass className="h-16 w-16 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Setting up your experience...</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting you to the assessment</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const recommendedPosts = getRecommendedPosts();
  const recommendedTherapists = getRecommendedTherapists();
  const recentMoodData = getRecentMoodData();
  const compassCalibration = calculateCompassCalibration();
  const compassDirection = getCompassDirection(compassCalibration.overall);
  const personalizedInsights = getPersonalizedInsights();
  const achievements = getAchievements();
  const todayQuote = getTodayQuote();

  return (
    <PageTransition>
      <div className={`min-h-screen ${preferences.darkAccents ? 'bg-gradient-to-br from-slate-100 via-gray-100 to-blue-100' : 'bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50'} py-12 px-4`}>
        <div className="container mx-auto max-w-7xl">
          {/* Header with Profile */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white shadow-lg">
                    {profile?.profilePicture ? (
                      <img src={profile.profilePicture} alt={user?.name} className="object-cover" />
                    ) : (
                      <AvatarFallback className={`${preferences.darkAccents ? 'bg-slate-700' : 'bg-teal-600'} text-white text-2xl sm:text-3xl`}>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Dialog open={showProfileEdit} onOpenChange={setShowProfileEdit}>
                    <DialogTrigger asChild>
                      <button className={`absolute bottom-0 right-0 ${preferences.darkAccents ? 'bg-slate-700 hover:bg-slate-800' : 'bg-teal-600 hover:bg-teal-700'} text-white rounded-full p-1.5 sm:p-2 shadow-lg`}>
                        <Camera className="h-3 w-3" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>Update your profile information</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Display Name</Label>
                          <Input
                            id="name"
                            placeholder={profile?.name}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="profilePic">Profile Picture URL</Label>
                          <Input
                            id="profilePic"
                            placeholder="https://example.com/image.jpg"
                            value={editProfilePic}
                            onChange={(e) => setEditProfilePic(e.target.value)}
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter a URL to an image</p>
                        </div>
                        <Button onClick={handleProfileUpdate} className={`w-full ${preferences.darkAccents ? 'bg-slate-700 hover:bg-slate-800' : 'bg-teal-600 hover:bg-teal-700'}`}>
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 flex flex-wrap items-center gap-2">
                    <span className="truncate">Welcome back, {profile?.name || user?.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowProfileEdit(true)}
                      className={`${preferences.darkAccents ? 'text-slate-700 hover:text-slate-900' : 'text-gray-500 hover:text-teal-600'} flex-shrink-0`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2 truncate">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge className={`${preferences.darkAccents ? 'bg-slate-700' : 'bg-teal-600'} text-xs sm:text-sm`}>
                      <Flame className="h-3 w-3 mr-1" />
                      {profile?.wellnessStreak || 0} Day Streak
                    </Badge>
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      <Compass className="h-3 w-3 mr-1" />
                      {compassDirection.label}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Dialog open={showCustomization} onOpenChange={setShowCustomization}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 sm:flex-initial">
                      <Settings className="h-4 w-4 mr-2" />
                      Customize
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Dashboard Customization</DialogTitle>
                      <DialogDescription>
                        Personalize your dashboard to focus on what matters most to you
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div>
                        <h4 className="mb-4">Dashboard Sections</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="wellness-score" className="flex items-center gap-2 cursor-pointer">
                              <Compass className="h-4 w-4 text-teal-600" />
                              Compass Calibration
                            </Label>
                            <Switch
                              id="wellness-score"
                              checked={preferences.showWellnessScore}
                              onCheckedChange={(checked) => updatePreference("showWellnessScore", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="motivational-quote" className="flex items-center gap-2 cursor-pointer">
                              <Star className="h-4 w-4 text-purple-500" />
                              Daily Motivation
                            </Label>
                            <Switch
                              id="motivational-quote"
                              checked={preferences.showMotivationalQuote}
                              onCheckedChange={(checked) => updatePreference("showMotivationalQuote", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="achievements" className="flex items-center gap-2 cursor-pointer">
                              <Trophy className="h-4 w-4 text-yellow-600" />
                              Achievements
                            </Label>
                            <Switch
                              id="achievements"
                              checked={preferences.showAchievements}
                              onCheckedChange={(checked) => updatePreference("showAchievements", checked)}
                            />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <Label htmlFor="goals" className="flex items-center gap-2 cursor-pointer">
                              <Target className="h-4 w-4 text-teal-600" />
                              Goals Tracker
                            </Label>
                            <Switch
                              id="goals"
                              checked={preferences.showGoals}
                              onCheckedChange={(checked) => updatePreference("showGoals", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="mood-tracker" className="flex items-center gap-2 cursor-pointer">
                              <Activity className="h-4 w-4 text-blue-600" />
                              Mood Tracker
                            </Label>
                            <Switch
                              id="mood-tracker"
                              checked={preferences.showMoodTracker}
                              onCheckedChange={(checked) => updatePreference("showMoodTracker", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="journal" className="flex items-center gap-2 cursor-pointer">
                              <FileText className="h-4 w-4 text-purple-600" />
                              Journal Entries
                            </Label>
                            <Switch
                              id="journal"
                              checked={preferences.showJournal}
                              onCheckedChange={(checked) => updatePreference("showJournal", checked)}
                            />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <Label htmlFor="appointments" className="flex items-center gap-2 cursor-pointer">
                              <Calendar className="h-4 w-4 text-teal-600" />
                              Appointments
                            </Label>
                            <Switch
                              id="appointments"
                              checked={preferences.showUpcomingAppointments}
                              onCheckedChange={(checked) => updatePreference("showUpcomingAppointments", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="community" className="flex items-center gap-2 cursor-pointer">
                              <Users className="h-4 w-4 text-blue-600" />
                              Community Activity
                            </Label>
                            <Switch
                              id="community"
                              checked={preferences.showCommunityActivity}
                              onCheckedChange={(checked) => updatePreference("showCommunityActivity", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="recommended" className="flex items-center gap-2 cursor-pointer">
                              <BookOpen className="h-4 w-4 text-purple-600" />
                              Recommended Content
                            </Label>
                            <Switch
                              id="recommended"
                              checked={preferences.showRecommendedContent}
                              onCheckedChange={(checked) => updatePreference("showRecommendedContent", checked)}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="mb-4">Display Options</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="compact-view" className="flex items-center gap-2 cursor-pointer">
                              <Zap className="h-4 w-4 text-orange-500" />
                              Compact View
                            </Label>
                            <Switch
                              id="compact-view"
                              checked={preferences.compactView}
                              onCheckedChange={(checked) => updatePreference("compactView", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="dark-accents" className="flex items-center gap-2 cursor-pointer">
                              <Moon className="h-4 w-4 text-slate-700" />
                              Dark Accents
                            </Label>
                            <Switch
                              id="dark-accents"
                              checked={preferences.darkAccents}
                              onCheckedChange={(checked) => updatePreference("darkAccents", checked)}
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setPreferences(defaultPreferences);
                          toast.success("Dashboard reset to default settings");
                        }}
                      >
                        Reset to Defaults
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={handleLogout} className="flex-1 sm:flex-initial">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </div>
          </div>

          {/* Emergency Distress Signal */}
          <Card className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white border-none shadow-lg">
            <CardContent className={preferences.compactView ? "p-3" : "p-4"}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Need Immediate Support?</p>
                    <p className="text-xs sm:text-sm text-red-100">24/7 Crisis Resources Available</p>
                  </div>
                </div>
                <Link to="/helplines" className="w-full sm:w-auto">
                  <Button variant="secondary" size="sm" className="w-full sm:w-auto flex-shrink-0">
                    <Phone className="h-4 w-4 mr-2" />
                    Get Help Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Compass Calibration - Advanced Wellness Score */}
          {preferences.showWellnessScore && (
            <Card className={`mb-6 ${preferences.darkAccents ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-blue-700' : 'bg-gradient-to-br from-teal-500 via-blue-600 to-purple-600'} text-white border-none shadow-2xl overflow-hidden relative`}>
              {/* Compass decoration background */}
              <div className="absolute inset-0 opacity-10">
                <Compass className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64" style={{ transform: `translate(-50%, -50%) rotate(${compassCalibration.overall}deg)` }} />
              </div>

              <CardContent className={`${preferences.compactView ? 'p-4' : 'p-6'} relative z-10`}>
                <div className="flex items-center gap-3 mb-6">
                  <Navigation className="h-8 w-8" />
                  <div>
                    <h3 className="text-2xl">
                      Compass Calibration
                    </h3>
                    <p className="text-sm text-white/80">Your Mental Health Navigation System</p>
                  </div>
                </div>

                {/* Compass Directions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {/* North - Mental Clarity */}
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Brain className="h-6 w-6" />
                    </div>
                    <p className="text-xs text-white/90 mb-1">NORTH - Mental Clarity</p>
                    <p className="text-2xl text-white mb-2">{compassCalibration.north}%</p>
                    <Progress value={compassCalibration.north} className="h-2 bg-white/20 [&>div]:bg-white" />
                    <p className="text-xs text-white/80 mt-2">Goals & Focus</p>
                  </div>

                  {/* East - Emotional Balance */}
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Heart className="h-6 w-6" />
                    </div>
                    <p className="text-xs text-white/90 mb-1">EAST - Emotional Balance</p>
                    <p className="text-2xl text-white mb-2">{compassCalibration.east}%</p>
                    <Progress value={compassCalibration.east} className="h-2 bg-white/20 [&>div]:bg-white" />
                    <p className="text-xs text-white/80 mt-2">Mood & Feelings</p>
                  </div>

                  {/* South - Physical Vitality */}
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Activity className="h-6 w-6" />
                    </div>
                    <p className="text-xs text-white/90 mb-1">SOUTH - Physical Vitality</p>
                    <p className="text-2xl text-white mb-2">{compassCalibration.south}%</p>
                    <Progress value={compassCalibration.south} className="h-2 bg-white/20 [&>div]:bg-white" />
                    <p className="text-xs text-white/80 mt-2">Activity & Streak</p>
                  </div>

                  {/* West - Social Connection */}
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="text-xs text-white/90 mb-1">WEST - Social Connection</p>
                    <p className="text-2xl text-white mb-2">{compassCalibration.west}%</p>
                    <Progress value={compassCalibration.west} className="h-2 bg-white/20 [&>div]:bg-white" />
                    <p className="text-xs text-white/80 mt-2">Support & Community</p>
                  </div>
                </div>

                {/* Overall Status & Guidance */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-white/80 mb-2">Overall Calibration</p>
                    <div className="relative mb-3">
                      <div className="text-5xl text-white">{compassCalibration.overall}%</div>
                    </div>
                    <Badge className={`bg-white/20 text-white border-white/30`}>
                      {compassDirection.label}
                    </Badge>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <h4 className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-5 w-5" />
                      <span>Navigational Guidance</span>
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {compassCalibration.overall >= 80 && "Excellent navigation! Your compass is well-calibrated. Continue these practices to maintain your course."}
                      {compassCalibration.overall >= 60 && compassCalibration.overall < 80 && "You're on a good course! Small adjustments in the areas below 60% will improve your overall calibration."}
                      {compassCalibration.overall >= 40 && compassCalibration.overall < 60 && "Your compass needs recalibration. Focus on the directions showing below 50% for better balance."}
                      {compassCalibration.overall < 40 && "Your compass needs significant attention. Consider booking an appointment with a Navigator and starting a guided journey."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Personalized Compass Bearing with Insights */}
          <Collapsible
            open={preferences.compassBearingExpanded}
            onOpenChange={(open) => updatePreference("compassBearingExpanded", open)}
            className={preferences.compactView ? "mb-6" : "mb-8"}
          >
            <Card className={`${preferences.darkAccents ? 'bg-gradient-to-br from-slate-600 to-blue-700' : 'bg-gradient-to-br from-teal-500 to-blue-600'} text-white border-none shadow-xl`}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-white/10 transition-colors rounded-t-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Compass className="h-8 w-8 flex-shrink-0" />
                      <div>
                        <CardTitle className="text-white text-xl sm:text-2xl">Your Compass Bearing</CardTitle>
                        <CardDescription className={`${preferences.darkAccents ? 'text-slate-100' : 'text-teal-100'}`}>
                          {preferences.compassBearingExpanded
                            ? "Personalized guidance for your journey"
                            : "Click to view your personalized insights"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {preferences.compassBearingExpanded ? (
                        <ChevronUp className="h-6 w-6" />
                      ) : (
                        <ChevronDown className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  {profile?.compassBearing ? (
                    <>
                      {/* Analysis */}
                      <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
                        <p className="text-white whitespace-pre-line leading-relaxed">
                          {profile.compassBearing.analysis}
                        </p>
                      </div>

                      {/* Compass Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4">
                        <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                          <p className={`text-xs ${preferences.darkAccents ? 'text-slate-100' : 'text-teal-100'} mb-1`}>Focus Area</p>
                          <p className="text-xs sm:text-sm font-medium capitalize truncate">{profile.compassBearing.primaryStruggle}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                          <p className={`text-xs ${preferences.darkAccents ? 'text-slate-100' : 'text-teal-100'} mb-1`}>Stress Level</p>
                          <p className="text-xs sm:text-sm font-medium capitalize truncate">{profile.compassBearing.stressLevel}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                          <p className={`text-xs ${preferences.darkAccents ? 'text-slate-100' : 'text-teal-100'} mb-1`}>Sleep Quality</p>
                          <p className="text-xs sm:text-sm font-medium capitalize truncate">{profile.compassBearing.sleepQuality}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                          <p className={`text-xs ${preferences.darkAccents ? 'text-slate-100' : 'text-teal-100'} mb-1`}>Support</p>
                          <p className="text-xs sm:text-sm font-medium capitalize truncate">{profile.compassBearing.supportSystem}</p>
                        </div>
                      </div>

                      {/* Personalized Insights */}
                      {personalizedInsights.length > 0 && (
                        <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
                          <h4 className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-5 w-5" />
                            <span>Personalized Insights</span>
                          </h4>
                          <div className="space-y-3">
                            {personalizedInsights.map((insight, idx) => (
                              <div key={idx} className="flex items-start gap-3 bg-white/10 rounded-lg p-3">
                                <insight.icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm text-white mb-2">{insight.message}</p>
                                  <Link to={insight.link}>
                                    <Button variant="secondary" size="sm" className="text-xs">
                                      {insight.action}
                                      <ChevronRight className="h-3 w-3 ml-1" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        variant="secondary"
                        onClick={async () => {
                          localStorage.removeItem("onboarding_completed");
                          navigate("/onboarding");
                        }}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Retake Assessment
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
                        <p className="text-white leading-relaxed">
                          Your compass bearing has been set! Thank you for completing the assessment.
                          Your personalized mental health journey begins here.
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          localStorage.removeItem("onboarding_completed");
                          navigate("/onboarding");
                        }}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Take Assessment
                      </Button>
                    </>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Motivational Quote */}
          {preferences.showMotivationalQuote && (
            <Card className={`mb-6 border-2 ${preferences.darkAccents ? 'border-slate-300' : 'border-purple-200'} ${preferences.darkAccents ? 'bg-gradient-to-r from-white to-slate-50' : 'bg-gradient-to-r from-white to-purple-50'}`}>
              <CardContent className={preferences.compactView ? "p-4" : "p-6"}>
                <div className="flex items-start gap-4">
                  <Star className={`h-6 w-6 ${preferences.darkAccents ? 'text-slate-600' : 'text-purple-600'} flex-shrink-0`} />
                  <div>
                    <p className={`${preferences.compactView ? 'text-base' : 'text-lg'} text-gray-800 italic`}>
                      "{todayQuote}"
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Daily Motivation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements */}
          {preferences.showAchievements && achievements.length > 0 && (
            <Card className={`mb-6 ${preferences.darkAccents ? 'border-slate-300' : 'border-yellow-200'}`}>
              <CardHeader className={preferences.compactView ? "p-4 pb-2" : undefined}>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className={`h-5 w-5 ${preferences.darkAccents ? 'text-slate-600' : 'text-yellow-600'}`} />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className={preferences.compactView ? "p-4 pt-2" : undefined}>
                <div className="flex flex-wrap gap-3">
                  {achievements.map((achievement, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${preferences.darkAccents ? 'bg-slate-100' : 'bg-gradient-to-r from-yellow-50 to-orange-50'} border ${preferences.darkAccents ? 'border-slate-200' : 'border-yellow-200'}`}
                    >
                      <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                      <span className="text-sm">{achievement.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions Row */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 ${preferences.compactView ? 'mb-6' : 'mb-8'}`}>
            <Dialog open={showMoodDialog} onOpenChange={setShowMoodDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className={preferences.compactView ? "h-16 flex-col gap-1" : "h-20 sm:h-24 flex-col gap-2"}>
                  <Heart className={`${preferences.compactView ? 'h-5 w-5' : 'h-5 w-5 sm:h-6 sm:w-6'} ${preferences.darkAccents ? 'text-slate-700' : 'text-teal-600'}`} />
                  <span className="text-xs sm:text-sm">Log Mood</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>How are you feeling today?</DialogTitle>
                  <DialogDescription>Track your emotional state</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Mood Level</Label>
                      <span className="text-2xl">{getMoodIcon(currentMood)}</span>
                    </div>
                    <Slider
                      value={[currentMood]}
                      onValueChange={(value) => setCurrentMood(value[0])}
                      min={1}
                      max={5}
                      step={1}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Very Low</span>
                      <span>Low</span>
                      <span>Neutral</span>
                      <span>Good</span>
                      <span>Great</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="moodNote">Note (Optional)</Label>
                    <Textarea
                      id="moodNote"
                      placeholder="What's on your mind?"
                      value={moodNote}
                      onChange={(e) => setMoodNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleLogMood} className={`w-full ${preferences.darkAccents ? 'bg-slate-700 hover:bg-slate-800' : 'bg-teal-600 hover:bg-teal-700'}`}>
                    Save Mood
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className={preferences.compactView ? "h-16 flex-col gap-1" : "h-20 sm:h-24 flex-col gap-2"}>
                  <Target className={`${preferences.compactView ? 'h-5 w-5' : 'h-5 w-5 sm:h-6 sm:w-6'} ${preferences.darkAccents ? 'text-slate-700' : 'text-teal-600'}`} />
                  <span className="text-xs sm:text-sm">Add Goal</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set a New Goal</DialogTitle>
                  <DialogDescription>Create a mental health goal to work towards</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newGoal">Your Goal</Label>
                    <Input
                      id="newGoal"
                      placeholder="e.g., Meditate 3x this week"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddGoal} className={`w-full ${preferences.darkAccents ? 'bg-slate-700 hover:bg-slate-800' : 'bg-teal-600 hover:bg-teal-700'}`}>
                    Add Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showJournalDialog} onOpenChange={setShowJournalDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className={preferences.compactView ? "h-16 flex-col gap-1" : "h-20 sm:h-24 flex-col gap-2"}>
                  <FileText className={`${preferences.compactView ? 'h-5 w-5' : 'h-5 w-5 sm:h-6 sm:w-6'} ${preferences.darkAccents ? 'text-slate-700' : 'text-teal-600'}`} />
                  <span className="text-xs sm:text-sm">Journal</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Captain's Log</DialogTitle>
                  <DialogDescription>Capture your thoughts and feelings</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="journalEntry">Your Entry</Label>
                    <Textarea
                      id="journalEntry"
                      placeholder="What's on your mind today?"
                      value={journalText}
                      onChange={(e) => setJournalText(e.target.value)}
                      rows={6}
                    />
                  </div>
                  <Button onClick={handleAddJournal} className={`w-full ${preferences.darkAccents ? 'bg-slate-700 hover:bg-slate-800' : 'bg-teal-600 hover:bg-teal-700'}`}>
                    Save Entry
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Link to="/community" className="w-full">
              <Button variant="outline" className={`${preferences.compactView ? 'h-16 flex-col gap-1' : 'h-20 sm:h-24 flex-col gap-2'} w-full`}>
                <Users className={`${preferences.compactView ? 'h-5 w-5' : 'h-5 w-5 sm:h-6 sm:w-6'} ${preferences.darkAccents ? 'text-slate-700' : 'text-teal-600'}`} />
                <span className="text-xs sm:text-sm">Community</span>
              </Button>
            </Link>
          </div>

          {/* Active Journeys Highlight */}
          {profile?.activeJourneys && profile.activeJourneys.length > 0 && (
            <div className="mb-6">
              <ActiveJourneysWidget
                activeJourneys={profile.activeJourneys}
                darkAccents={preferences.darkAccents}
                compactView={preferences.compactView}
              />
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Goals, Mood, Journal */}
            <div className={preferences.compactView ? "space-y-4" : "space-y-6"}>
              {/* Wellness Streak */}
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 backdrop-blur-sm">
                <CardHeader className={preferences.compactView ? "p-4 pb-2" : undefined}>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Wellness Streak
                  </CardTitle>
                </CardHeader>
                <CardContent className={preferences.compactView ? "p-4 pt-2" : undefined}>
                  <div className="text-center">
                    <div className={`${preferences.compactView ? 'text-4xl' : 'text-5xl'} ${preferences.darkAccents ? 'text-slate-700' : 'text-orange-600'}`}>
                      {profile?.wellnessStreak || 0}
                    </div>
                    <p className="text-gray-700 mb-4">Days in a row!</p>
                    <Progress value={Math.min((profile?.wellnessStreak || 0) * 10, 100)} className="h-2 bg-orange-200 [&>div]:bg-orange-500" />
                    <p className="text-xs text-gray-600 mt-2">Keep logging in to maintain your streak</p>
                  </div>
                </CardContent>
              </Card>

              {/* Goals Tracker */}
              {preferences.showGoals && (
                <Card id="goals" className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200 backdrop-blur-sm">
                  <CardHeader className={preferences.compactView ? "p-4 pb-2" : undefined}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Target className={`h-5 w-5 ${preferences.darkAccents ? 'text-slate-700' : 'text-teal-600'}`} />
                        Current Goals
                      </CardTitle>
                      <Button size="sm" variant="outline" onClick={() => setShowGoalDialog(true)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className={preferences.compactView ? "p-4 pt-2" : undefined}>
                    {profile?.goals && profile.goals.length > 0 ? (
                      <div className={preferences.compactView ? "space-y-1.5" : "space-y-2"}>
                        {profile.goals.slice(0, 5).map((goal) => (
                          <div
                            key={goal.id}
                            className={`flex items-center gap-2 ${preferences.compactView ? 'p-2' : 'p-3'} rounded-lg border ${goal.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                              }`}
                          >
                            <button
                              onClick={() => toggleGoal(goal.id)}
                              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${goal.completed
                                ? "bg-green-500 border-green-500"
                                : `border-gray-300 ${preferences.darkAccents ? 'hover:border-slate-500' : 'hover:border-teal-500'}`
                                }`}
                            >
                              {goal.completed && <Check className="h-3 w-3 text-white" />}
                            </button>
                            <span className={`flex-1 text-sm ${goal.completed ? "line-through text-gray-500" : "text-gray-700"}`}>
                              {goal.text}
                            </span>
                            <button
                              onClick={() => deleteGoal(goal.id)}
                              className="flex-shrink-0 text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center ${preferences.compactView ? 'py-4' : 'py-6'} text-gray-500`}>
                        <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm mb-3">No goals set yet</p>
                        <Button size="sm" onClick={() => setShowGoalDialog(true)} className={preferences.darkAccents ? 'bg-slate-700 hover:bg-slate-800' : 'bg-teal-600 hover:bg-teal-700'}>
                          Set Your First Goal
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Mood Tracker */}
              {preferences.showMoodTracker && (
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className={preferences.compactView ? "p-4 pb-2" : undefined}>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className={`h-5 w-5 ${preferences.darkAccents ? 'text-slate-700' : 'text-blue-600'}`} />
                      Mood Tracker
                    </CardTitle>
                    <CardDescription>Last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent className={preferences.compactView ? "p-4 pt-2" : undefined}>
                    {recentMoodData.length > 0 ? (
                      <>
                        <div className={`flex items-end gap-2 ${preferences.compactView ? 'h-24 mb-3' : 'h-32 mb-4'}`}>
                          {recentMoodData.map((entry, index) => (
                            <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
                              <div
                                className={`w-full rounded-t ${getMoodColor(entry.mood)}`}
                                style={{ height: `${(entry.mood / 5) * 100}%` }}
                              ></div>
                              <span className="text-xs text-gray-500">
                                {new Date(entry.date).getDate()}
                              </span>
                            </div>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowMoodDialog(true)}
                        >
                          Log Today's Mood
                        </Button>
                      </>
                    ) : (
                      <div className={`text-center ${preferences.compactView ? 'py-4' : 'py-6'} text-gray-500`}>
                        <Heart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm mb-3">Start tracking your mood</p>
                        <Button
                          size="sm"
                          onClick={() => setShowMoodDialog(true)}
                          className={preferences.darkAccents ? 'bg-slate-700 hover:bg-slate-800' : 'bg-teal-600 hover:bg-teal-700'}
                        >
                          Log First Entry
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Recent Journal */}
              {preferences.showJournal && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader className={preferences.compactView ? "p-4 pb-2" : undefined}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className={`h-5 w-5 ${preferences.darkAccents ? 'text-slate-700' : 'text-purple-600'}`} />
                        Captain's Log
                      </CardTitle>
                      <Button size="sm" variant="outline" onClick={() => setShowJournalDialog(true)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className={preferences.compactView ? "p-4 pt-2" : undefined}>
                    {profile?.journalEntries && profile.journalEntries.length > 0 ? (
                      <div className={preferences.compactView ? "space-y-2" : "space-y-3"}>
                        {profile.journalEntries.slice(0, 3).map((entry) => (
                          <div key={entry.id} className={`border-l-2 ${preferences.darkAccents ? 'border-slate-500' : 'border-teal-500'} pl-3 py-2`}>
                            <p className="text-sm text-gray-700 line-clamp-2">{entry.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center ${preferences.compactView ? 'py-4' : 'py-6'} text-gray-500`}>
                        <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm mb-3">Start journaling</p>
                        <Button
                          size="sm"
                          onClick={() => setShowJournalDialog(true)}
                          className={preferences.darkAccents ? 'bg-slate-700 hover:bg-slate-800' : 'bg-teal-600 hover:bg-teal-700'}
                        >
                          Write First Entry
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Middle Column - Appointments & Community */}
            <div className={preferences.compactView ? "space-y-4" : "space-y-6"}>
              {/* Upcoming Appointments */}
              {preferences.showUpcomingAppointments && (
                <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
                  <CardHeader className={preferences.compactView ? "p-4 pb-2" : undefined}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className={`h-5 w-5 ${preferences.darkAccents ? 'text-slate-700' : 'text-teal-600'}`} />
                        <CardTitle>Upcoming Appointments</CardTitle>
                      </div>
                      <Link to="/appointments">
                        <Button variant="outline" size="sm">
                          Book New
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className={preferences.compactView ? "p-4 pt-2" : undefined}>
                    {profile?.appointments && profile.appointments.length > 0 ? (
                      <div className={preferences.compactView ? "space-y-3" : "space-y-4"}>
                        {profile.appointments.slice(0, 3).map((appointment) => (
                          <div
                            key={appointment.id}
                            className={`flex items-start gap-4 ${preferences.compactView ? 'p-3' : 'p-4'} ${preferences.darkAccents ? 'bg-slate-100' : 'bg-teal-50'} rounded-lg`}
                          >
                            <div className="flex-shrink-0">
                              <div className={`h-12 w-12 ${preferences.darkAccents ? 'bg-slate-700' : 'bg-teal-600'} rounded-full flex items-center justify-center`}>
                                <UserIcon className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{appointment.therapistName}</h4>
                              <p className="text-sm text-gray-600">{appointment.therapistSpecialty}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(appointment.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {appointment.time}
                                </div>
                              </div>
                            </div>
                            <Badge className={`${preferences.darkAccents ? 'bg-slate-200 text-slate-800' : 'bg-teal-100 text-teal-800'}`}>{appointment.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center ${preferences.compactView ? 'py-6' : 'py-8'}`}>
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-4">No upcoming appointments</p>
                        <Link to="/appointments">
                          <Button className={preferences.darkAccents ? 'bg-slate-700 hover:bg-slate-800' : 'bg-teal-600 hover:bg-teal-700'}>
                            Schedule Your First Session
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Community Activity */}
              {preferences.showCommunityActivity && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className={preferences.compactView ? "p-4 pb-2" : undefined}>
                    <div className="flex items-center gap-2">
                      <MessageSquare className={`h-5 w-5 ${preferences.darkAccents ? 'text-slate-700' : 'text-green-600'}`} />
                      <CardTitle>Featured Community Topics</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className={preferences.compactView ? "p-4 pt-2" : undefined}>
                    <div className={preferences.compactView ? "space-y-2" : "space-y-3"}>
                      {[
                        { title: "Coping with Anxiety During the Holidays", replies: 24, active: "2h ago" },
                        { title: "Morning Meditation Accountability Thread", replies: 156, active: "4h ago" },
                        { title: "Share Your Wins - Big or Small!", replies: 89, active: "1d ago" },
                      ].map((topic, idx) => (
                        <Link key={idx} to="/community">
                          <div className={`${preferences.compactView ? 'p-2.5' : 'p-3'} rounded-lg border border-gray-200 ${preferences.darkAccents ? 'hover:bg-slate-100 hover:border-slate-300' : 'hover:bg-teal-50 hover:border-teal-300'} transition-colors cursor-pointer`}>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">{topic.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{topic.replies} replies</span>
                              <span>•</span>
                              <span>Active {topic.active}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link to="/community">
                      <Button variant="outline" className="w-full mt-4">
                        View All Topics
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Recommended Therapists */}
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                <CardHeader className={preferences.compactView ? "p-4 pb-2" : undefined}>
                  <CardTitle className="flex items-center gap-2">
                    <Award className={`h-5 w-5 ${preferences.darkAccents ? 'text-slate-700' : 'text-amber-600'}`} />
                    Recommended Navigators
                  </CardTitle>
                  <CardDescription>Based on your compass bearing</CardDescription>
                </CardHeader>
                <CardContent className={preferences.compactView ? "p-4 pt-2" : undefined}>
                  <div className={preferences.compactView ? "space-y-3" : "space-y-4"}>
                    {recommendedTherapists.map((therapist) => (
                      <div key={therapist.id} className={`flex items-start gap-3 ${preferences.compactView ? 'p-2.5' : 'p-3'} rounded-lg border border-gray-200 ${preferences.darkAccents ? 'hover:bg-slate-50' : 'hover:bg-teal-50'} transition-colors`}>
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className={`${preferences.darkAccents ? 'bg-slate-700' : 'bg-teal-600'} text-white`}>
                            {therapist.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{therapist.name}</h4>
                          <p className="text-xs text-gray-600">{therapist.credential}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {therapist.specialty.slice(0, 2).map((spec) => (
                              <Badge key={spec} variant="secondary" className={`${preferences.darkAccents ? 'bg-slate-100 text-slate-800' : 'bg-teal-100 text-teal-800'} text-xs`}>
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/appointments">
                    <Button variant="outline" className="w-full mt-4">
                      Book a Session
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Recommended Content */}
            <div className={preferences.compactView ? "space-y-4" : "space-y-6"}>
              {/* Recommended Articles */}
              {preferences.showRecommendedContent && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 backdrop-blur-sm">
                  <CardHeader className={preferences.compactView ? "p-4 pb-2" : undefined}>
                    <div className="flex items-center gap-2">
                      <BookOpen className={`h-5 w-5 ${preferences.darkAccents ? 'text-slate-700' : 'text-teal-600'}`} />
                      <CardTitle>Recommended for You</CardTitle>
                    </div>
                    <CardDescription>Based on your compass bearing</CardDescription>
                  </CardHeader>
                  <CardContent className={preferences.compactView ? "p-4 pt-2" : undefined}>
                    <div className={preferences.compactView ? "space-y-3" : "space-y-4"}>
                      {recommendedPosts.map((post) => (
                        <Link
                          key={post.id}
                          to="/blog"
                          onClick={() => addRecentlyViewedArticle(post.id)}
                        >
                          <div className="group cursor-pointer">
                            <div className="flex gap-3">
                              <div className="flex-shrink-0">
                                <div className={`${preferences.compactView ? 'h-16 w-16' : 'h-20 w-20'} ${preferences.darkAccents ? 'bg-slate-100' : 'bg-gradient-to-br from-teal-100 to-purple-100'} rounded-lg overflow-hidden ring-2 ring-purple-200/50`}>
                                  <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <Badge variant="secondary" className={`${preferences.darkAccents ? 'bg-slate-100 text-slate-800' : 'bg-purple-100 text-purple-800'} text-xs mb-1`}>
                                  {post.category}
                                </Badge>
                                <h4 className={`text-sm font-medium text-gray-900 line-clamp-2 mb-1 ${preferences.darkAccents ? 'group-hover:text-slate-700' : 'group-hover:text-purple-600'} transition-colors`}>
                                  {post.title}
                                </h4>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {post.readTime}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link to="/blog">
                      <Button variant="outline" className="w-full mt-4">
                        View All Articles
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Recently Viewed Articles */}
              {profile?.recentlyViewedArticles && profile.recentlyViewedArticles.length > 0 && (
                <Card>
                  <CardHeader className={preferences.compactView ? "p-4 pb-2" : undefined}>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className={`h-5 w-5 ${preferences.darkAccents ? 'text-slate-700' : 'text-teal-600'}`} />
                      Recently Viewed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={preferences.compactView ? "p-4 pt-2" : undefined}>
                    <div className={preferences.compactView ? "space-y-1.5" : "space-y-2"}>
                      {profile.recentlyViewedArticles.slice(0, 3).map((articleId) => {
                        const article = blogPosts.find((p) => p.id === articleId);
                        if (!article) return null;
                        return (
                          <Link key={articleId} to="/blog">
                            <div className={`text-sm text-gray-700 ${preferences.darkAccents ? 'hover:text-slate-900' : 'hover:text-teal-600'} transition-colors line-clamp-1`}>
                              • {article.title}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader className={preferences.compactView ? "p-4 pb-2" : undefined}>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className={`${preferences.compactView ? 'p-4 pt-2 space-y-1.5' : 'space-y-2'}`}>
                  <Link to="/appointments">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                  <Link to="/community">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Join Community
                    </Button>
                  </Link>
                  <Link to="/helplines">
                    <Button variant="outline" className="w-full justify-start">
                      <Compass className="h-4 w-4 mr-2" />
                      Get Support
                    </Button>
                  </Link>
                  <Link to="/blog">
                    <Button variant="outline" className="w-full justify-start">
                      <Map className="h-4 w-4 mr-2" />
                      Guided Journeys
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
