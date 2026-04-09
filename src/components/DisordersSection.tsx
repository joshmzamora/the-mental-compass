import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  mentalHealthDisorders,
  MentalHealthDisorder,
} from "../data/mental-health-disorders";
import { therapists } from "../data/therapists";
import { blogPosts } from "../data/blog-posts";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CompassDecoration } from "./CompassDecoration";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Map,
  Compass,
  Calendar,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useUserProfile } from "../contexts/UserProfileContext";
import { toast } from "sonner";

// Mapping of disorder IDs to abstract images
const disorderImages: Record<string, string> = {
  anxiety:
    "https://images.unsplash.com/photo-1759914514194-b5883244e683?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGJsdWUlMjBjYWxtfGVufDF8fHx8MTc2MjI2NDcyNnww&ixlib=rb-4.1.0&q=80&w=1080",
  depression:
    "https://images.unsplash.com/photo-1512675559587-8a91082206ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHB1cnBsZSUyMHNlcmVuaXR5fGVufDF8fHx8MTc2MjI2NDcyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  bipolar:
    "https://images.unsplash.com/photo-1590509028942-0ac2b8412dbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG9yYW5nZSUyMHdhcm10aHxlbnwxfHx8fDE3NjIyNjQ3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ptsd: "https://images.unsplash.com/photo-1690695925205-983b2efe9058?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyZWVuJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzYyMjY0NzI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ocd: "https://images.unsplash.com/photo-1760375474561-026717f7b79d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlYWwlMjB0cmFucXVpbHxlbnwxfHx8fDE3NjIyNjQ3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "eating-disorders":
    "https://images.unsplash.com/photo-1594165681163-1b85559cf250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBpbmslMjBzb2Z0fGVufDF8fHx8MTc2MjI2NDcyOHww&ixlib=rb-4.1.0&q=80&w=1080",
};

// Mapping of disorders to therapist specialties
const disorderToSpecialties: Record<string, string[]> = {
  anxiety: ["Anxiety", "Stress Management"],
  depression: ["Depression"],
  bipolar: ["Depression", "Mood Disorders"],
  ptsd: ["PTSD", "Trauma"],
  ocd: ["OCD", "Anxiety"],
  "eating-disorders": ["Eating Disorders"],
};

// Mapping of disorders to blog categories
const disorderToCategories: Record<string, string[]> = {
  anxiety: ["Coping Strategies", "Education"],
  depression: ["Support", "Education"],
  bipolar: ["Support", "Education"],
  ptsd: ["Support", "Education"],
  ocd: ["Coping Strategies", "Education"],
  "eating-disorders": ["Support", "Wellness"],
};

const guidedJournalPrompts = [
  "What feels heaviest for me today, and what would make it feel 10% lighter?",
  "What thought keeps looping in my mind, and what is a kinder reframe?",
  "When did I last feel grounded, and what helped me get there?",
  "What support do I need right now, and who can I reach out to?",
  "What is one small action I can take in the next hour for my wellbeing?",
];

const breathingPhases = [
  {
    label: "Inhale",
    guidance: "Breathe in slowly through your nose.",
  },
  {
    label: "Hold",
    guidance: "Pause gently and keep your shoulders relaxed.",
  },
  {
    label: "Exhale",
    guidance: "Release your breath slowly through your mouth.",
  },
  {
    label: "Hold",
    guidance: "Stay still for a moment, then repeat.",
  },
];

const mythVsFactCards = [
  {
    myth: "People should be able to just snap out of anxiety or depression.",
    fact: "Mental health conditions are real medical experiences, not mindset failures. Support, therapy, and treatment make a measurable difference.",
  },
  {
    myth: "Asking for help means you are weak.",
    fact: "Reaching out is a strength move. It shows self-awareness, courage, and commitment to healing.",
  },
  {
    myth: "Only people in crisis need therapy.",
    fact: "Therapy supports prevention, self-understanding, stress management, and long-term emotional resilience.",
  },
  {
    myth: "Medication changes who you are.",
    fact: "For many people, medication helps restore balance so they can feel more like themselves and function day to day.",
  },
  {
    myth: "Talking about mental health makes things worse.",
    fact: "Safe conversations reduce shame and isolation. Naming what you feel often lowers distress and opens pathways to care.",
  },
  {
    myth: "If someone is high-functioning, they are fine.",
    fact: "People can appear successful while silently struggling. Compassion and check-ins still matter.",
  },
];

export function DisordersSection() {
  const { user } = useAuth();
  const { updateProfile, profile } = useUserProfile();
  const navigate = useNavigate();

  const [selectedDisorder, setSelectedDisorder] =
    useState<MentalHealthDisorder | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginAction, setLoginAction] = useState<
    "appointment" | "community" | "blog"
  >("appointment");
  const [journalPromptIndex, setJournalPromptIndex] =
    useState(0);
  const [isPromptVisible, setIsPromptVisible] =
    useState(true);
  const [breathingPhaseIndex, setBreathingPhaseIndex] =
    useState(0);
  const [flippedMythCards, setFlippedMythCards] =
    useState<Record<number, boolean>>({});
  const journalPromptTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const breathingTimer = window.setInterval(() => {
      setBreathingPhaseIndex(
        (prevIndex) =>
          (prevIndex + 1) % breathingPhases.length,
      );
    }, 4000);

    return () => {
      window.clearInterval(breathingTimer);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (journalPromptTimerRef.current !== null) {
        window.clearTimeout(journalPromptTimerRef.current);
      }
    };
  }, []);

  const trackDisorderView = async (
    disorderId: string,
    disorderName: string,
  ) => {
    if (!user || !profile) return;

    // Track the disorder view in user profile
    const recentViews = profile.recentlyViewedArticles || [];
    const updatedViews = [
      `disorder-${disorderId}`,
      ...recentViews.filter(
        (v) => v !== `disorder-${disorderId}`,
      ),
    ].slice(0, 5);

    await updateProfile({
      recentlyViewedArticles: updatedViews,
    });

    console.log(`User viewed: ${disorderName}`);
  };

  const handleDisorderClick = (
    disorder: MentalHealthDisorder,
  ) => {
    setSelectedDisorder(disorder);
    if (user) {
      trackDisorderView(disorder.id, disorder.name);
    }
  };

  const handleCTAClick = (
    action: "appointment" | "community" | "blog",
    disorderId: string,
  ) => {
    if (!user) {
      setLoginAction(action);
      setShowLoginPrompt(true);
      return;
    }

    // User is logged in - proceed with action
    switch (action) {
      case "appointment":
        navigate(`/appointments?specialty=${disorderId}`);
        toast.success(
          "Finding navigators specialized in this area...",
        );
        break;
      case "community":
        navigate("/community");
        toast.success(
          "Connecting you to the support community...",
        );
        break;
      case "blog":
        navigate(`/blog?topic=${disorderId}`);
        toast.success("Loading relevant articles...");
        break;
    }
  };

  const getMatchingTherapists = (disorderId: string) => {
    const specialties = disorderToSpecialties[disorderId] || [];
    return therapists.filter((therapist) =>
      therapist.specialty.some((spec) =>
        specialties.some((targetSpec) =>
          spec.toLowerCase().includes(targetSpec.toLowerCase()),
        ),
      ),
    );
  };

  const getMatchingArticles = (disorderId: string) => {
    const categories = disorderToCategories[disorderId] || [];
    const tags = [disorderId];

    return blogPosts.filter((post) => {
      const categoryMatch = categories.includes(post.category);
      const titleMatch = tags.some((tag) =>
        post.title.toLowerCase().includes(tag.toLowerCase()),
      );
      return categoryMatch || titleMatch;
    });
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate("/login", { state: { returnTo: "/disorders" } });
  };

  const handleSignUpRedirect = () => {
    setShowLoginPrompt(false);
    navigate("/signup", { state: { returnTo: "/disorders" } });
  };

  const handleRecommendedClick = () => {
    if (!profile?.compassBearing) return;

    const disorder = mentalHealthDisorders.find(
      (d) =>
        d.id ===
        profile.compassBearing?.primaryStruggle?.toLowerCase() ||
        d.name
          .toLowerCase()
          .includes(
            profile.compassBearing?.primaryStruggle?.toLowerCase() || "",
          ),
    );

    if (disorder) {
      handleDisorderClick(disorder);
    }
  };

  const handleNextJournalPrompt = () => {
    if (journalPromptTimerRef.current !== null) {
      window.clearTimeout(journalPromptTimerRef.current);
    }

    setIsPromptVisible(false);

    journalPromptTimerRef.current = window.setTimeout(
      () => {
        setJournalPromptIndex(
          (prevIndex) =>
            (prevIndex + 1) % guidedJournalPrompts.length,
        );
        setIsPromptVisible(true);
      },
      180,
    );
  };

  const toggleMythCard = (index: number) => {
    setFlippedMythCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section
      id="disorders"
      className="py-20 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 relative overflow-hidden"
    >
      <CompassDecoration variant="light" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center mb-4">
              <Map className="h-6 w-6 md:h-8 md:w-8 text-teal-600 mr-2 md:mr-3" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900">
                Understanding Mental Health Conditions
              </h2>
            </div>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-4 md:mb-6 px-4">
              Knowledge is power. Learn about common mental
              health disorders, their symptoms, and available
              treatments. Find personalized support tailored to
              your needs.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-teal-400"></div>
              <Compass className="h-5 w-5 text-teal-600" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-teal-400"></div>
            </div>
          </div>

          {/* Personalization Banner for Logged-in Users */}
          {user && profile?.compassBearing && (
            <Card className="mb-6 md:mb-8 bg-gradient-to-r from-teal-500 to-blue-600 border-none shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-lg md:text-xl mb-2">
                      Personalized for Your Journey
                    </h3>
                    <p className="text-teal-100 text-sm md:text-base mb-3">
                      Based on your Compass Bearing, we
                      recommend starting with{" "}
                      <strong>
                        {profile.compassBearing.primaryStruggle}
                      </strong>
                      -related resources.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleRecommendedClick}
                    >
                      View Recommended Condition
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disorders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {mentalHealthDisorders.map((disorder) => {
  const isRecommended = 
    user && 
    profile?.compassBearing && 
    (disorder.id === profile.compassBearing.primaryStruggle.toLowerCase() || 
     disorder.name.toLowerCase().includes(profile.compassBearing.primaryStruggle.toLowerCase()));

  return (
    <Card
      key={disorder.id}
      className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col gap-0"
      onClick={() => handleDisorderClick(disorder)}
    >
      <div className="relative h-40 sm:h-48 overflow-hidden flex-shrink-0">
        <ImageWithFallback
          src={disorderImages[disorder.id]}
          alt={disorder.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Darker gradient for better text contrast on tablets/desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {isRecommended && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-teal-600 shadow-lg">
              <Sparkles className="h-3 w-3 mr-1" />
              Recommended
            </Badge>
          </div>
        )}

        {/* Desktop-only Title Overlay (Hidden on mobile) */}
        <div className="absolute bottom-3 left-3 right-3 hidden sm:block">
          <h3 className="text-white text-xl font-bold leading-tight">
            {disorder.name}
          </h3>
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-1">
        {/* Mobile-only Title (Visible only on small screens) */}
        <h3 className="text-gray-900 font-bold text-lg mb-2 sm:hidden">
          {disorder.name}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
          {disorder.description}
        </p>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-colors text-sm"
        >
          Learn More
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
})}
          </div>

          {/* Section 3: Interactive Coping Strategies Toolbox */}
          <div className="mb-12 md:mb-16">
            <Card className="relative overflow-hidden border-teal-200/80 shadow-md bg-white/95">
              <div className="pointer-events-none absolute -top-16 right-10 h-40 w-40 rounded-full bg-teal-100/60 blur-2xl"></div>
              <div className="pointer-events-none absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-blue-100/60 blur-2xl"></div>

              <CardContent className="relative p-6 md:p-8 lg:p-9">
                <div className="mb-3 md:mb-4 text-center">
                  <h3 className="text-xl md:text-2xl text-gray-900">
                    Interactive Coping Toolbox
                  </h3>
                </div>
                <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-6 max-w-3xl mx-auto text-center leading-relaxed">
                  Quick grounding tools designed for moments when you
                  feel overwhelmed. Pick the strategy that fits your
                  current headspace and follow along.
                </p>

                <Tabs
                  defaultValue="grounding"
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto gap-2 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-blue-50 p-1.5 mb-6 shadow-sm justify-items-stretch items-stretch">
                    <TabsTrigger
                      value="grounding"
                      className="w-full justify-self-stretch rounded-xl text-slate-700 py-3.5 px-6 text-base transition-all duration-300 hover:text-teal-700 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-teal-200"
                    >
                      "5-4-3-2-1" Reset
                    </TabsTrigger>
                    <TabsTrigger
                      value="breathing"
                      className="w-full justify-self-stretch rounded-xl text-slate-700 py-3.5 px-6 text-base transition-all duration-300 hover:text-teal-700 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-teal-200"
                    >
                      Breathing Bubble
                    </TabsTrigger>
                    <TabsTrigger
                      value="journaling"
                      className="w-full justify-self-stretch rounded-xl text-slate-700 py-3.5 px-6 text-base transition-all duration-300 hover:text-teal-700 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-teal-200"
                    >
                      Guided Journaling
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="grounding"
                    className="mt-0 min-h-[720px] sm:min-h-[680px] md:h-[500px] md:min-h-0 lg:h-[460px]"
                  >
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 items-stretch">
                      <div className="h-full bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl border border-teal-100 p-5 md:p-6">
                        <h4 className="text-lg md:text-xl text-gray-900 mb-2">
                          5-4-3-2-1 Sensory Check-In
                        </h4>
                        <p className="text-sm md:text-base text-gray-600 mb-4">
                          Bring attention back to the present moment by
                          naming:
                        </p>
                        <ul className="space-y-2.5">
                          {[
                            "5 things you can see",
                            "4 things you can feel",
                            "3 things you can hear",
                            "2 things you can smell",
                            "1 thing you can taste",
                          ].map((step, index) => (
                            <li
                              key={step}
                              className="flex items-start gap-2.5 text-sm md:text-base text-gray-700 bg-white/90 rounded-lg p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                              style={{
                                transitionDelay: `${index * 35}ms`,
                              }}
                            >
                              <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                              <span className="ml-1">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="h-full bg-white rounded-2xl border border-teal-200 p-5 md:p-6">
                        <h4 className="text-lg md:text-xl text-gray-900 mb-2">
                          Compass Tip
                        </h4>
                        <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
                          Speak each item out loud and move slowly.
                          Naming sensory details interrupts spiraling
                          thoughts and brings your focus back to what is
                          real right now.
                        </p>
                        <div className="rounded-lg bg-teal-50 border border-teal-100 p-3 md:p-4">
                          <p className="text-sm text-teal-800">
                            If your mind drifts, gently restart at 5.
                            There is no wrong way to do this.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="breathing"
                    className="mt-0 min-h-[720px] sm:min-h-[680px] md:h-[500px] md:min-h-0 lg:h-[460px]"
                  >
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 items-center">
                      <div className="relative mx-auto h-56 w-56 md:h-64 md:w-64 lg:h-72 lg:w-72">
                        <div className="absolute inset-0 rounded-full bg-teal-200/60 blur-3xl"></div>
                        <svg
                          viewBox="0 0 200 200"
                          className="relative h-full w-full"
                          role="img"
                          aria-label="Animated breathing bubble for box breathing rhythm"
                        >
                          <defs>
                            <radialGradient
                              id="breathingGradient"
                              cx="50%"
                              cy="40%"
                              r="60%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#5eead4"
                              />
                              <stop
                                offset="100%"
                                stopColor="#2563eb"
                              />
                            </radialGradient>
                          </defs>
                          <circle
                            cx="100"
                            cy="100"
                            r="34"
                            fill="url(#breathingGradient)"
                            opacity="0.9"
                          >
                            <animate
                              attributeName="r"
                              values="34;74;74;34;34"
                              dur="16s"
                              keyTimes="0;0.25;0.5;0.75;1"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.82;1;1;0.82;0.82"
                              dur="16s"
                              keyTimes="0;0.25;0.5;0.75;1"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle
                            cx="100"
                            cy="100"
                            r="56"
                            fill="none"
                            stroke="#5eead4"
                            strokeOpacity="0.32"
                            strokeWidth="1.5"
                          >
                            <animate
                              attributeName="r"
                              values="56;84;84;56;56"
                              dur="16s"
                              keyTimes="0;0.25;0.5;0.75;1"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="stroke-opacity"
                              values="0.28;0.1;0.1;0.28;0.28"
                              dur="16s"
                              keyTimes="0;0.25;0.5;0.75;1"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle
                            cx="100"
                            cy="100"
                            r="82"
                            fill="none"
                            stroke="#0f766e"
                            strokeOpacity="0.25"
                            strokeWidth="2"
                            strokeDasharray="10 8"
                          >
                            <animateTransform
                              attributeName="transform"
                              attributeType="XML"
                              type="rotate"
                              from="0 100 100"
                              to="360 100 100"
                              dur="14s"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle
                            cx="100"
                            cy="20"
                            r="6"
                            fill="#2dd4bf"
                          >
                            <animateTransform
                              attributeName="transform"
                              attributeType="XML"
                              type="rotate"
                              from="0 100 100"
                              to="360 100 100"
                              dur="12s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </svg>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div
                            key={`breathing-phase-${breathingPhaseIndex}`}
                            className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm animate-[pulse_0.75s_ease-out_1]"
                          >
                            {breathingPhases[breathingPhaseIndex].label}
                          </div>
                        </div>
                      </div>

                      <div className="h-full bg-white rounded-2xl border border-teal-200 p-5 md:p-6">
                        <h4 className="text-lg md:text-xl text-gray-900 mb-2">
                          Box Breathing: 4-4-4-4
                        </h4>
                        <p className="text-sm md:text-base text-gray-600 mb-4">
                          Follow the bubble rhythm to steady your
                          nervous system.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Inhale 4 sec",
                            "Hold 4 sec",
                            "Exhale 4 sec",
                            "Hold 4 sec",
                          ].map((phase) => (
                            <div
                              key={phase}
                              className="rounded-lg bg-teal-50 border border-teal-100 p-3 text-sm text-teal-900"
                            >
                              {phase}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          {breathingPhases.map((phase, index) => (
                            <div
                              key={`${phase.label}-${index}`}
                              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                                index === breathingPhaseIndex
                                  ? "bg-teal-600 scale-125 shadow-[0_0_0_4px_rgba(13,148,136,0.15)]"
                                  : "bg-teal-200"
                              }`}
                            ></div>
                          ))}
                        </div>
                        <p className="mt-3 min-h-[40px] text-sm text-teal-800 transition-all duration-300">
                          {breathingPhases[breathingPhaseIndex].guidance}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="journaling"
                    className="mt-0 min-h-[720px] sm:min-h-[680px] md:min-h-[500px] lg:min-h-[460px]"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-7">
                      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 md:p-7">
                        <h4 className="text-lg md:text-xl text-gray-900 mb-4">
                          Guided Journaling Prompt
                        </h4>
                        <p
                          className="text-base md:text-lg text-gray-800 italic mb-7 transition-all duration-300 leading-relaxed"
                          style={{
                            opacity: isPromptVisible ? 1 : 0,
                            transform: isPromptVisible
                              ? "translateY(0px)"
                              : "translateY(8px)",
                          }}
                        >
                          "{guidedJournalPrompts[journalPromptIndex]}"
                        </p>
                        <Button
                          variant="outline"
                          onClick={handleNextJournalPrompt}
                          className="mt-1 inline-flex h-11 rounded-xl border-0 bg-gradient-to-r from-teal-600 to-blue-600 px-5 text-white shadow-md shadow-teal-600/20 hover:from-teal-700 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-600/25 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 transition-all duration-250"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Next Prompt
                        </Button>
                      </div>

                      <div className="h-full bg-white rounded-2xl border border-blue-200 p-6 md:p-7">
                        <h4 className="text-lg md:text-xl text-gray-900 mb-3">
                          3-Minute Practice
                        </h4>
                        <ul className="space-y-3.5">
                          {[
                            "Set a 3-minute timer and write without editing.",
                            "Focus on honesty, not perfect wording.",
                            "End with one supportive sentence to yourself.",
                          ].map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm md:text-base leading-relaxed text-gray-700"
                            >
                              <CheckCircle2 className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Section 4: Myth vs Fact */}
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-5 md:p-8 lg:p-10 shadow-md">
            <div className="text-center mb-6 md:mb-8">
              <div className="mb-3">
                <h3 className="text-xl md:text-2xl text-gray-900">
                  Myth vs Fact: Breaking Mental Health Stigma
                </h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Tap each card to flip it and reveal the truth. These
                are common misconceptions our Mental Compass community
                works to replace with compassion and evidence-based
                understanding.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {mythVsFactCards.map((card, index) => {
                const isFlipped = !!flippedMythCards[index];

                return (
                  <button
                    type="button"
                    key={card.myth}
                    onClick={() => toggleMythCard(index)}
                    aria-pressed={isFlipped}
                    className={`group relative text-left rounded-2xl border p-5 min-h-[240px] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                      isFlipped
                        ? "border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50"
                        : "border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50"
                    }`}
                    style={{ transitionDelay: `${index * 25}ms` }}
                  >
                    <div
                      className={`absolute top-0 left-0 h-1 rounded-t-2xl transition-all duration-300 ${
                        isFlipped
                          ? "w-full bg-teal-500"
                          : "w-14 bg-rose-400"
                      }`}
                    ></div>
                    <div className="flex items-center gap-2 mb-3">
                      {isFlipped ? (
                        <CheckCircle2 className="h-5 w-5 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-rose-600 transition-transform duration-300 group-hover:scale-110" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          isFlipped
                            ? "text-teal-700"
                            : "text-rose-700"
                        }`}
                      >
                        {isFlipped ? "Fact" : "Myth"}
                      </span>
                    </div>

                    <p
                      className={`text-sm md:text-base leading-relaxed transition-all duration-300 ${
                        isFlipped
                          ? "text-gray-800"
                          : "text-gray-900"
                      }`}
                    >
                      {isFlipped ? card.fact : card.myth}
                    </p>

                    <p
                      className={`text-xs mt-5 ${
                        isFlipped
                          ? "text-teal-700/80"
                          : "text-rose-700/80"
                      }`}
                    >
                      {isFlipped ? "Tap to show myth" : "Tap to reveal fact"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Disorder Detail Dialog - Full Screen */}
      <Dialog
        open={!!selectedDisorder}
        onOpenChange={(open: boolean) =>
          !open && setSelectedDisorder(null)
        }
      >
        <DialogContent className="!max-w-none !w-screen !h-screen !top-0 !left-0 !translate-x-0 !translate-y-0 !rounded-none overflow-y-auto p-0 flex flex-col [&>button]:!top-4 [&>button]:!right-4 [&>button]:!z-50 [&>button]:!bg-white/90 [&>button]:!w-10 [&>button]:!h-10 [&>button]:!rounded-full [&>button]:hover:!bg-white [&>button]:!flex [&>button]:!items-center [&>button]:!justify-center">
          {selectedDisorder && (
            <>
              <DialogHeader className="sticky top-0 z-10 bg-white border-b flex-shrink-0">
                <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                  <ImageWithFallback
                    src={disorderImages[selectedDisorder.id]}
                    alt={selectedDisorder.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-4 sm:left-6 md:left-8 lg:left-12 right-4 sm:right-6 md:right-8 lg:right-12">
                    <DialogTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-1 md:mb-2">
                      {selectedDisorder.name}
                    </DialogTitle>
                    <DialogDescription className="text-teal-100 text-sm sm:text-base md:text-lg max-w-4xl">
                      {selectedDisorder.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="w-full px-4 sm:px-6 md:px-8 py-6 md:py-8">
                  {/* Quick Stats - Now Clickable */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                    <Card
                      className="bg-teal-50 border-teal-200 cursor-pointer hover:shadow-lg hover:border-teal-400 transition-all group"
                      onClick={() =>
                        handleCTAClick(
                          "appointment",
                          selectedDisorder.id,
                        )
                      }
                    >
                      <CardContent className="p-4 md:p-6 flex items-center gap-3">
                        <Calendar className="h-10 w-10 md:h-12 md:w-12 text-teal-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="text-base md:text-lg lg:text-xl text-teal-900">
                            {
                              getMatchingTherapists(
                                selectedDisorder.id,
                              ).length
                            }{" "}
                            Navigators
                          </p>
                          <p className="text-xs md:text-sm text-teal-700">
                            View specialists
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className="bg-blue-50 border-blue-200 cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all group"
                      onClick={() =>
                        handleCTAClick(
                          "blog",
                          selectedDisorder.id,
                        )
                      }
                    >
                      <CardContent className="p-4 md:p-6 flex items-center gap-3">
                        <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="text-base md:text-lg lg:text-xl text-blue-900">
                            {
                              getMatchingArticles(
                                selectedDisorder.id,
                              ).length
                            }{" "}
                            Articles
                          </p>
                          <p className="text-xs md:text-sm text-blue-700">
                            Read more
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className="bg-purple-50 border-purple-200 cursor-pointer hover:shadow-lg hover:border-purple-400 transition-all group"
                      onClick={() =>
                        handleCTAClick(
                          "community",
                          selectedDisorder.id,
                        )
                      }
                    >
                      <CardContent className="p-4 md:p-6 flex items-center gap-3">
                        <Users className="h-10 w-10 md:h-12 md:w-12 text-purple-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="text-base md:text-lg lg:text-xl text-purple-900">
                            Community
                          </p>
                          <p className="text-xs md:text-sm text-purple-700">
                            Join discussion
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Main Content - Side by side on larger screens */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    {/* Symptoms */}
                    <div className="bg-gray-50 rounded-xl p-5 md:p-6 lg:p-7">
                      <h4 className="mb-4 md:mb-5 text-lg md:text-xl lg:text-2xl text-gray-900 flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 md:h-7 md:w-7 text-teal-600" />
                        Common Symptoms
                      </h4>
                      <ul className="grid grid-cols-1 gap-2 md:gap-3">
                        {selectedDisorder.symptoms.map(
                          (symptom, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 md:gap-3 bg-white rounded-lg p-3 md:p-4"
                            >
                              <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 text-sm md:text-base lg:text-lg">
                                {symptom}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* Treatment Options */}
                    <div className="bg-gray-50 rounded-xl p-5 md:p-6 lg:p-7">
                      <h4 className="mb-4 md:mb-5 text-lg md:text-xl lg:text-2xl text-gray-900 flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 md:h-7 md:w-7 text-teal-600" />
                        Treatment Options
                      </h4>
                      <ul className="grid grid-cols-1 gap-2 md:gap-3">
                        {selectedDisorder.treatments.map(
                          (treatment, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 md:gap-3 bg-white rounded-lg p-3 md:p-4"
                            >
                              <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 text-sm md:text-base lg:text-lg">
                                {treatment}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* Resources & CTAs Column */}
                    <div className="lg:col-span-1 xl:col-span-1 space-y-6">
                      {/* Resources */}
                      <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-5 md:p-6 lg:p-7">
                        <h4 className="mb-4 md:mb-5 text-lg md:text-xl lg:text-2xl text-gray-900 flex items-center gap-3">
                          <ExternalLink className="h-6 w-6 md:h-7 md:w-7 text-teal-600" />
                          Helpful Resources
                        </h4>
                        <div className="space-y-2">
                          {selectedDisorder.resources.map(
                            (resource, index) => {
                              // Map resource names to URLs
                              const resourceUrls: Record<
                                string,
                                string
                              > = {
                                "Anxiety and Depression Association of America (ADAA)":
                                  "https://adaa.org",
                                "National Institute of Mental Health (NIMH)":
                                  "https://www.nimh.nih.gov",
                                "Mental Health America":
                                  "https://www.mhanational.org",
                                "Depression and Bipolar Support Alliance (DBSA)":
                                  "https://www.dbsalliance.org",
                                "National Alliance on Mental Illness (NAMI)":
                                  "https://www.nami.org",
                                "Substance Abuse and Mental Health Services Administration (SAMHSA)":
                                  "https://www.samhsa.gov",
                                "International Bipolar Foundation":
                                  "https://ibpf.org",
                                "National Center for PTSD":
                                  "https://www.ptsd.va.gov",
                                "PTSD Alliance":
                                  "https://www.ptsdalliance.org",
                                "Sidran Institute":
                                  "https://www.sidran.org",
                                "International OCD Foundation":
                                  "https://iocdf.org",
                                "National Eating Disorders Association (NEDA)":
                                  "https://www.nationaleatingdisorders.org",
                                "Academy for Eating Disorders":
                                  "https://www.aedweb.org",
                                "National Association of Anorexia Nervosa and Associated Disorders (ANAD)":
                                  "https://anad.org",
                              };

                              const url =
                                resourceUrls[resource];

                              return url ? (
                                <a
                                  key={index}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between bg-white rounded-lg p-3 md:p-4 hover:bg-teal-50 transition-colors group border border-teal-100"
                                >
                                  <span className="text-gray-700 text-sm md:text-base lg:text-lg">
                                    {resource}
                                  </span>
                                  <ExternalLink className="h-4 w-4 md:h-5 md:w-5 text-teal-600 group-hover:scale-110 transition-transform flex-shrink-0 ml-2" />
                                </a>
                              ) : (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-white rounded-lg p-3 md:p-4 border border-teal-100"
                                >
                                  <span className="text-gray-700 text-sm md:text-base lg:text-lg">
                                    {resource}
                                  </span>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>

                      {/* Get Support CTAs */}
                      <div className="bg-white border-2 border-teal-200 rounded-xl p-5 md:p-6 lg:p-7">
                        <h4 className="mb-4 text-base md:text-lg lg:text-xl text-gray-900">
                          Get Personalized Support
                        </h4>
                        <div className="space-y-3">
                          <Button
                            onClick={() =>
                              handleCTAClick(
                                "appointment",
                                selectedDisorder.id,
                              )
                            }
                            className="w-full bg-teal-600 hover:bg-teal-700 h-auto py-3 md:py-4 flex items-center justify-between text-left"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 md:h-6 md:w-6" />
                              <div>
                                <div className="text-sm md:text-base">
                                  Book Session
                                </div>
                                <div className="text-xs text-teal-100">
                                  {
                                    getMatchingTherapists(
                                      selectedDisorder.id,
                                    ).length
                                  }{" "}
                                  specialist
                                  {getMatchingTherapists(
                                    selectedDisorder.id,
                                  ).length !== 1
                                    ? "s"
                                    : ""}{" "}
                                  available
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5" />
                          </Button>

                          <Button
                            onClick={() =>
                              handleCTAClick(
                                "community",
                                selectedDisorder.id,
                              )
                            }
                            variant="outline"
                            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 h-auto py-3 md:py-4 flex items-center justify-between text-left"
                          >
                            <div className="flex items-center gap-3">
                              <Users className="h-5 w-5 md:h-6 md:w-6" />
                              <div>
                                <div className="text-sm md:text-base">
                                  Join Community
                                </div>
                                <div className="text-xs text-blue-600/70">
                                  Connect with others
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5" />
                          </Button>

                          <Button
                            onClick={() =>
                              handleCTAClick(
                                "blog",
                                selectedDisorder.id,
                              )
                            }
                            variant="outline"
                            className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 h-auto py-3 md:py-4 flex items-center justify-between text-left"
                          >
                            <div className="flex items-center gap-3">
                              <BookOpen className="h-5 w-5 md:h-6 md:w-6" />
                              <div>
                                <div className="text-sm md:text-base">
                                  Read Articles
                                </div>
                                <div className="text-xs text-purple-600/70">
                                  {
                                    getMatchingArticles(
                                      selectedDisorder.id,
                                    ).length
                                  }{" "}
                                  article
                                  {getMatchingArticles(
                                    selectedDisorder.id,
                                  ).length !== 1
                                    ? "s"
                                    : ""}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Important Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-5">
                    <p className="text-sm md:text-base text-blue-900">
                      <strong>Important:</strong> If you
                      recognize these symptoms in yourself or
                      someone you care about, please reach out
                      to a mental health professional. Early
                      intervention can make a significant
                      difference.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
      >
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-teal-600" />
              Set Your Compass to Continue
            </DialogTitle>
            <DialogDescription>
              Create an account to unlock personalized features
              and connect with our community
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-700">
              To access{" "}
              {loginAction === "appointment"
                ? "personalized therapist recommendations"
                : loginAction === "community"
                  ? "the support community"
                  : "curated articles"}
              , please create a free account or log in.
            </p>
            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
              <h4 className="text-teal-900 mb-2">
                Why create an account?
              </h4>
              <ul className="space-y-1 text-sm text-teal-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Get personalized recommendations based on
                    your needs
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Track your wellness journey and progress
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Connect with mental health professionals
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Join a supportive community</span>
                </li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSignUpRedirect}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                Create Free Account
              </Button>
              <Button
                onClick={handleLoginRedirect}
                variant="outline"
                className="flex-1"
              >
                Log In
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
