import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, ChevronRight, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { PageTransition } from "../components/PageTransition";
import { useAuth } from "../contexts/AuthContext";
import { useUserProfile } from "../contexts/UserProfileContext";
import { toast } from "sonner@2.0.3";
import { projectId } from "../utils/supabase/info";

interface QuestionnaireAnswers {
  primaryStruggle: string;
  sleepQuality: string;
  stressLevel: string;
  supportSystem: string;
  coping: string;
  physicalActivity: string;
}

const questions = [
  {
    id: "primaryStruggle",
    title: "What is your primary mental health focus?",
    description: "Select the area you'd like to focus on most",
    options: [
      { value: "anxiety", label: "Anxiety & Worry" },
      { value: "depression", label: "Depression & Low Mood" },
      { value: "stress", label: "Stress Management" },
      { value: "trauma", label: "Trauma & PTSD" },
      { value: "grief", label: "Grief & Loss" },
      { value: "relationships", label: "Relationships & Social Connections" },
      { value: "addiction", label: "Addiction & Substance Use" },
      { value: "wellness", label: "General Mental Wellness" },
    ],
  },
  {
    id: "sleepQuality",
    title: "How would you rate your sleep quality?",
    description: "Sleep is crucial for mental health",
    options: [
      { value: "excellent", label: "Excellent - I sleep well most nights (7-9 hours)" },
      { value: "good", label: "Good - I usually sleep well" },
      { value: "fair", label: "Fair - I have some sleep issues" },
      { value: "poor", label: "Poor - I struggle with sleep regularly" },
    ],
  },
  {
    id: "stressLevel",
    title: "On average, how would you rate your stress level?",
    description: "Think about the past month",
    options: [
      { value: "low", label: "Low - I feel relatively calm and in control" },
      { value: "moderate", label: "Moderate - Some stress but manageable" },
      { value: "high", label: "High - Often feeling overwhelmed" },
      { value: "severe", label: "Severe - Constantly stressed and unable to cope" },
    ],
  },
  {
    id: "supportSystem",
    title: "How would you describe your support system?",
    description: "Friends, family, or community connections",
    options: [
      { value: "strong", label: "Strong - I have multiple people I can count on" },
      { value: "moderate", label: "Moderate - Some support but limited" },
      { value: "weak", label: "Weak - Very little support available" },
      { value: "none", label: "Isolated - I feel quite alone" },
    ],
  },
  {
    id: "coping",
    title: "How do you currently cope with difficult emotions?",
    description: "Select what best describes your current coping strategies",
    options: [
      { value: "healthy", label: "Healthy strategies - Exercise, therapy, meditation, talking" },
      { value: "mixed", label: "Mixed - Some healthy, some not ideal" },
      { value: "struggling", label: "Struggling - I don't have effective coping strategies" },
      { value: "harmful", label: "Harmful patterns - Substance use, isolation, self-harm" },
    ],
  },
  {
    id: "physicalActivity",
    title: "How often do you engage in physical activity?",
    description: "Exercise has significant impact on mental health",
    options: [
      { value: "regular", label: "Regularly - 3+ times per week" },
      { value: "sometimes", label: "Sometimes - 1-2 times per week" },
      { value: "rarely", label: "Rarely - Less than once a week" },
      { value: "never", label: "Never or almost never" },
    ],
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProfile } = useUserProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateAnalysis = (): string => {
    const struggle = answers.primaryStruggle || "wellness";
    const sleep = answers.sleepQuality || "good";
    const stress = answers.stressLevel || "moderate";
    const support = answers.supportSystem || "moderate";
    const coping = answers.coping || "mixed";
    const activity = answers.physicalActivity || "sometimes";

    let analysis = "";

    // Primary focus section
    const focusMap: Record<string, string> = {
      anxiety: "You've identified anxiety as your primary focus. Anxiety is one of the most common mental health challenges, and it's highly treatable. We'll connect you with resources on managing worry, grounding techniques, and building resilience through evidence-based approaches like CBT and mindfulness.",
      depression: "You've indicated depression as a key area of concern. Depression affects millions, and recovery is possible with the right support. We'll share content on mood regulation, behavioral activation, self-compassion, and building positive daily habits that support mental wellness.",
      stress: "Stress management is your priority. Chronic stress can impact all areas of life, but effective tools exist to help. We'll provide resources on relaxation techniques, time management, healthy boundaries, and stress-reduction strategies tailored to your needs.",
      trauma: "You've identified trauma as your primary concern. Healing from trauma takes time and support, and you deserve compassionate care. We'll recommend trauma-informed resources, information on EMDR and somatic therapies, and navigators who specialize in trauma recovery.",
      grief: "You're navigating grief and loss. Grief is a natural but often overwhelming process. We'll connect you with resources on healthy grieving, finding meaning after loss, and support groups where others understand what you're experiencing.",
      relationships: "Relationship challenges are your main focus. Healthy relationships are foundational to wellbeing. We'll provide resources on communication skills, boundary-setting, conflict resolution, and building stronger connections with others.",
      addiction: "You're focusing on addiction and substance use. Recovery is a journey that requires courage, and you don't have to do it alone. We'll recommend resources on addiction recovery, harm reduction, building sober support networks, and treating co-occurring mental health conditions.",
      wellness: "You're focused on general mental wellness and prevention. Proactive mental health care is a powerful choice. We'll share resources on building resilience, maintaining balance, stress prevention, and creating sustainable wellness practices.",
    };

    analysis += focusMap[struggle] + "\n\n";

    // Sleep assessment
    if (sleep === "poor" || sleep === "fair") {
      analysis += "Your sleep quality needs attention. Poor sleep significantly impacts mood, energy, and mental health. We'll include resources on sleep hygiene, addressing insomnia, and the connection between sleep and emotional wellbeing.\n\n";
    }

    // Stress level
    if (stress === "high" || stress === "severe") {
      analysis += "Your stress levels are elevated, which can take a toll on both mental and physical health. We strongly recommend prioritizing stress-reduction techniques and considering professional support to develop effective coping strategies.\n\n";
    }

    // Support system
    if (support === "weak" || support === "none") {
      analysis += "Building a stronger support network could be tremendously beneficial. Isolation can intensify mental health struggles. We'll suggest community resources, support groups, and strategies for building meaningful connections.\n\n";
    }

    // Coping strategies
    if (coping === "struggling" || coping === "harmful") {
      analysis += "Developing healthier coping strategies is crucial for your wellbeing. We'll provide resources on effective coping techniques, crisis management, and alternatives to harmful patterns. Consider connecting with a mental health professional for personalized support.\n\n";
    }

    // Physical activity
    if (activity === "rarely" || activity === "never") {
      analysis += "Increasing physical activity could significantly benefit your mental health. Exercise is a proven mood booster and stress reducer. We'll include resources on starting small, finding enjoyable movement, and the mental health benefits of regular activity.\n\n";
    }

    analysis += "Your Compass Bearing has been set based on your responses. Remember, seeking support is a sign of strength, not weakness. We're here to support your journey toward better mental health, one step at a time.";

    return analysis;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please log in to continue");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const analysis = generateAnalysis();
      const compassBearing = {
        analysis,
        primaryStruggle: answers.primaryStruggle || "wellness",
        sleepQuality: answers.sleepQuality || "good",
        stressLevel: answers.stressLevel || "moderate",
        supportSystem: answers.supportSystem || "moderate",
        coping: answers.coping || "mixed",
        physicalActivity: answers.physicalActivity || "sometimes",
      };

      // Update profile with compass bearing
      await updateProfile({ compassBearing });

      const accessToken = localStorage.getItem("access_token");

      // Try to sync with backend
      try {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/server/user/compass-bearing`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              userId: user.id,
              answers,
              analysis,
            }),
          }
        );
      } catch (fetchError) {
        // Silently handle - data is saved locally
      }

      // Mark onboarding as completed
      localStorage.setItem("onboarding_completed", "true");

      toast.success("Your Compass Bearing has been set!");

      // Navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error: any) {
      console.error("Error saving questionnaire:", error);
      toast.error(error.message || "Failed to save your responses. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = answers[currentQuestion.id];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-8 sm:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Compass className="h-12 w-12 sm:h-16 sm:w-16 text-teal-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 bg-teal-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Set Your Compass Bearing</h1>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              Help us personalize your mental health journey
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "w-8 bg-teal-600"
                      : index < currentStep
                      ? "w-2 bg-teal-400"
                      : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{currentQuestion.title}</CardTitle>
              <CardDescription>{currentQuestion.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-teal-50 transition-colors cursor-pointer"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="flex-1 cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                {isLastStep ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed || isSubmitting}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {isSubmitting ? "Saving..." : "Complete"}
                    <Compass className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
