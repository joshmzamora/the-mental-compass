import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Map, 
  BookOpen, 
  Clock, 
  Award, 
  ChevronRight, 
  Check,
  Play,
  X,
  Compass,
  Sparkles,
  LogIn
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { guidedJourneys, getJourneyById, getRecommendedJourneys } from "../data/guided-journeys";
import { useAuth } from "../contexts/AuthContext";
import { useUserProfile } from "../contexts/UserProfileContext";
import { toast } from "sonner";

export function GuidedJourneysSection() {
  const { user } = useAuth();
  const { profile, enrollInJourney, completeJourneyStep, unenrollFromJourney } = useUserProfile();
  const navigate = useNavigate();
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const activeJourneys = profile?.activeJourneys || [];
  const recommendedJourneys = profile?.compassBearing 
    ? getRecommendedJourneys(profile.compassBearing.primaryStruggle)
    : guidedJourneys.slice(0, 3);

  const handleEnroll = async (journeyId: string) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    const alreadyEnrolled = activeJourneys.some(j => j.journeyId === journeyId);
    if (alreadyEnrolled) {
      toast.info("You're already enrolled in this journey!");
      return;
    }

    await enrollInJourney(journeyId);
    toast.success("Journey started! Check your dashboard to continue.");
  };

  const handleStepComplete = async (journeyId: string, stepId: string) => {
    await completeJourneyStep(journeyId, stepId);
    toast.success("Step completed! Keep up the great work!");
  };

  const handleUnenroll = async (journeyId: string) => {
    await unenrollFromJourney(journeyId);
    toast.success("Unenrolled from journey.");
  };

  const journey = selectedJourney ? getJourneyById(selectedJourney) : null;
  const journeyProgress = activeJourneys.find(j => j.journeyId === selectedJourney);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500";
      case "Intermediate": return "bg-yellow-500";
      case "Advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "article": return "📖";
      case "exercise": return "✍️";
      case "meditation": return "🧘";
      case "reflection": return "💭";
      default: return "📝";
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Map className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-3xl md:text-4xl text-gray-900">
                Guided Journeys
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Structured learning paths to help you navigate your mental health journey with expert guidance, step by step.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-400"></div>
              <Compass className="h-5 w-5 text-purple-600" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-purple-400"></div>
            </div>
          </div>

          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="discover">Discover Journeys</TabsTrigger>
              <TabsTrigger value="active">
                My Journeys {activeJourneys.length > 0 && `(${activeJourneys.length})`}
              </TabsTrigger>
            </TabsList>

            {/* Discover Tab */}
            <TabsContent value="discover" className="space-y-8">
              {/* Recommended Journeys */}
              {user && profile?.compassBearing && recommendedJourneys.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h3 className="text-xl text-gray-900">Recommended For You</h3>
                    <Badge className="bg-purple-600">
                      Based on your Compass Bearing
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {recommendedJourneys.slice(0, 2).map((journey) => {
                      const isEnrolled = activeJourneys.some(j => j.journeyId === journey.id);
                      return (
                        <Card key={journey.id} className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <Badge className={getDifficultyColor(journey.difficulty)}>
                                {journey.difficulty}
                              </Badge>
                              <Badge variant="outline">{journey.category}</Badge>
                            </div>
                            <CardTitle className={`bg-gradient-to-r ${journey.color} bg-clip-text text-transparent`}>
                              {journey.title}
                            </CardTitle>
                            <CardDescription>{journey.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {journey.duration}
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                {journey.steps.length} steps
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => setSelectedJourney(journey.id)}
                                variant="outline"
                                className="flex-1"
                              >
                                View Details
                              </Button>
                              {!isEnrolled ? (
                                <Button
                                  onClick={() => handleEnroll(journey.id)}
                                  className={`flex-1 bg-gradient-to-r ${journey.color} text-white hover:opacity-90`}
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Journey
                                </Button>
                              ) : (
                                <Button
                                  variant="secondary"
                                  className="flex-1"
                                  disabled
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Enrolled
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Journeys */}
              <div>
                <h3 className="text-xl text-gray-900 mb-4">All Guided Journeys</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guidedJourneys.map((journey) => {
                    const isEnrolled = activeJourneys.some(j => j.journeyId === journey.id);
                    const isRecommended = recommendedJourneys.some(j => j.id === journey.id);
                    
                    return (
                      <Card key={journey.id} className={`hover:shadow-lg transition-shadow cursor-pointer ${isRecommended && user ? 'opacity-50' : ''}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={getDifficultyColor(journey.difficulty)}>
                              {journey.difficulty}
                            </Badge>
                            <Badge variant="outline">{journey.category}</Badge>
                          </div>
                          <CardTitle className="text-lg">{journey.title}</CardTitle>
                          <CardDescription className="text-sm">{journey.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {journey.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {journey.steps.length} steps
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setSelectedJourney(journey.id)}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              Details
                            </Button>
                            {!isEnrolled ? (
                              <Button
                                onClick={() => handleEnroll(journey.id)}
                                size="sm"
                                className="flex-1 bg-teal-600 hover:bg-teal-700"
                              >
                                Start
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1"
                                disabled
                              >
                                Enrolled
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Active Journeys Tab */}
            <TabsContent value="active">
              {activeJourneys.length === 0 ? (
                <Card className="p-12 text-center">
                  <Map className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl text-gray-900 mb-2">No Active Journeys Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start a guided journey to receive structured support and track your progress.
                  </p>
                  <Button
                    onClick={() => {
                      const tabs = document.querySelector('[value="discover"]') as HTMLElement;
                      tabs?.click();
                    }}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Browse Journeys
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {activeJourneys.map((progress) => {
                    const journey = getJourneyById(progress.journeyId);
                    if (!journey) return null;

                    const progressPercent = (progress.completedSteps.length / journey.steps.length) * 100;

                    return (
                      <Card key={progress.journeyId} className="border-2 border-teal-200">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1">{journey.title}</CardTitle>
                              <CardDescription>
                                Step {progress.currentStep} of {journey.steps.length}
                              </CardDescription>
                            </div>
                            <Badge className="bg-teal-600">Active</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{Math.round(progressPercent)}%</span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>
                          
                          {progress.currentStep <= journey.steps.length && (
                            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                              <p className="text-sm text-gray-600 mb-1">Next Step:</p>
                              <p className="font-medium text-gray-900">
                                {getStepIcon(journey.steps[progress.currentStep - 1]?.type)}{" "}
                                {journey.steps[progress.currentStep - 1]?.title}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              onClick={() => setSelectedJourney(journey.id)}
                              className="flex-1 bg-teal-600 hover:bg-teal-700"
                            >
                              Continue Journey
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                            <Button
                              onClick={() => handleUnenroll(journey.id)}
                              variant="outline"
                              size="icon"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Journey Detail Dialog */}
      <Dialog open={selectedJourney !== null} onOpenChange={() => setSelectedJourney(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{journey?.title}</DialogTitle>
            <DialogDescription>{journey?.description}</DialogDescription>
          </DialogHeader>
          {journey && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge className={getDifficultyColor(journey.difficulty)}>
                  {journey.difficulty}
                </Badge>
                <Badge variant="outline">{journey.category}</Badge>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {journey.duration}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  {journey.steps.length} steps
                </div>
              </div>

              {journeyProgress && (
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Your Progress</span>
                    <span className="text-sm text-gray-600">
                      {journeyProgress.completedSteps.length} / {journey.steps.length} completed
                    </span>
                  </div>
                  <Progress value={(journeyProgress.completedSteps.length / journey.steps.length) * 100} className="h-2" />
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Journey Steps</h4>
                <div className="space-y-3">
                  {journey.steps.map((step, index) => {
                    const isCompleted = journeyProgress?.completedSteps.includes(step.id);
                    const isCurrent = journeyProgress?.currentStep === step.stepNumber;
                    
                    return (
                      <div
                        key={step.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isCompleted
                            ? "bg-green-50 border-green-200"
                            : isCurrent
                            ? "bg-teal-50 border-teal-300 ring-2 ring-teal-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-teal-600 text-white" : "bg-gray-300 text-gray-600"
                          }`}>
                            {isCompleted ? <Check className="h-4 w-4" /> : step.stepNumber}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {getStepIcon(step.type)} {step.title}
                              </span>
                              {isCurrent && <Badge className="bg-teal-600">Current</Badge>}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="capitalize">{step.type}</span>
                              <span>•</span>
                              <span>{step.estimatedTime}</span>
                            </div>
                          </div>
                          {isCurrent && !isCompleted && journeyProgress && (
                            <Button
                              size="sm"
                              onClick={() => handleStepComplete(journey.id, step.id)}
                              className="bg-teal-600 hover:bg-teal-700"
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                {!journeyProgress ? (
                  <Button
                    onClick={() => {
                      handleEnroll(journey.id);
                      setSelectedJourney(null);
                    }}
                    className={`flex-1 bg-gradient-to-r ${journey.color} text-white hover:opacity-90`}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start This Journey
                  </Button>
                ) : (
                  <Button
                    onClick={() => setSelectedJourney(null)}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                  >
                    Continue Journey
                  </Button>
                )}
                <Button onClick={() => setSelectedJourney(null)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              Please sign in or create an account to start a guided journey and track your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setShowLoginPrompt(false);
                navigate("/login");
              }}
              className="flex-1 bg-teal-600 hover:bg-teal-700"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button
              onClick={() => {
                setShowLoginPrompt(false);
                navigate("/signup");
              }}
              variant="outline"
              className="flex-1"
            >
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
