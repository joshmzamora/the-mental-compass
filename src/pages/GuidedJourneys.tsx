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
  LogIn,
  ChevronLeft,
  FileText,
  Brain,
  Heart,
  MessageCircle,
  CheckCircle,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { Alert, AlertDescription } from "../components/ui/alert";
import { PageTransition } from "../components/PageTransition";
import { StepEngagementGate } from "../components/StepEngagementGate";
import { guidedJourneys, getJourneyById, getRecommendedJourneys, type JourneyStep, type GuidedJourney } from "../data/guided-journeys";
import { useAuth } from "../contexts/AuthContext";
import { useUserProfile } from "../contexts/UserProfileContext";
import { toast } from "sonner@2.0.3";

export function GuidedJourneys() {
  const { user } = useAuth();
  const { profile, enrollInJourney, completeJourneyStep, unenrollFromJourney } = useUserProfile();
  const navigate = useNavigate();
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [viewingStep, setViewingStep] = useState<JourneyStep | null>(null);
  const [viewingStepJourney, setViewingStepJourney] = useState<GuidedJourney | null>(null);

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

  const handleStepComplete = async (journeyId: string, stepId: string, reflection: string, timeSpent: number) => {
    await completeJourneyStep(journeyId, stepId, reflection, timeSpent);
    toast.success("Step completed! Keep up the great work!");
    setViewingStep(null);
    setViewingStepJourney(null);
  };

  const handleUnenroll = async (journeyId: string) => {
    await unenrollFromJourney(journeyId);
    toast.success("Unenrolled from journey.");
    setSelectedJourney(null);
  };

  const handleViewStep = (step: JourneyStep, journey: GuidedJourney) => {
    // Check if this step is accessible (sequential enforcement)
    const journeyProg = activeJourneys.find(j => j.journeyId === journey.id);
    if (journeyProg) {
      const isCompleted = journeyProg.completedSteps.includes(step.id);
      const isCurrent = journeyProg.currentStep === step.stepNumber;
      const isPrevious = step.stepNumber < journeyProg.currentStep;
      
      if (!isCompleted && !isCurrent && !isPrevious) {
        toast.error("Please complete previous steps first!");
        return;
      }
    }
    
    setViewingStep(step);
    setViewingStepJourney(journey);
    setSelectedJourney(null);
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
      case "article": return BookOpen;
      case "exercise": return FileText;
      case "meditation": return Brain;
      case "reflection": return Heart;
      default: return MessageCircle;
    }
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case "article": return "text-blue-600 bg-blue-50 border-blue-200";
      case "exercise": return "text-purple-600 bg-purple-50 border-purple-200";
      case "meditation": return "text-green-600 bg-green-50 border-green-200";
      case "reflection": return "text-pink-600 bg-pink-50 border-pink-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <PageTransition>
      <section className="min-h-screen py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 relative overflow-hidden">
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
                      const currentStep = journey.steps[progress.currentStep - 1];

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
                            
                            {currentStep && progress.currentStep <= journey.steps.length && (
                              <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                                <p className="text-sm text-gray-600 mb-1">Next Step:</p>
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const StepIcon = getStepIcon(currentStep.type);
                                    return <StepIcon className="h-5 w-5 text-teal-600" />;
                                  })()}
                                  <p className="font-medium text-gray-900">
                                    {currentStep.title}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{currentStep.estimatedTime}</p>
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
                      const StepIconComponent = getStepIcon(step.type);
                      
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
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-medium text-gray-900 flex items-center gap-1.5">
                                  <StepIconComponent className="h-4 w-4" />
                                  {step.title}
                                </span>
                                {isCurrent && <Badge className="bg-teal-600">Current</Badge>}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                <Badge variant="outline" className={`capitalize ${getStepTypeColor(step.type)}`}>
                                  {step.type}
                                </Badge>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {step.estimatedTime}
                                </span>
                              </div>
                              {(step.content || step.articleId) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewStep(step, journey)}
                                  className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                                >
                                  View Content
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              )}
                            </div>
                            {isCurrent && !isCompleted && journeyProgress && (
                              <Button
                                size="sm"
                                onClick={() => handleStepComplete(journey.id, step.id, "", 0)}
                                className="bg-teal-600 hover:bg-teal-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
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

        {/* Step Content Viewer Dialog */}
        <Dialog open={viewingStep !== null} onOpenChange={() => {
          setViewingStep(null);
          setViewingStepJourney(null);
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {viewingStep && viewingStepJourney && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setViewingStep(null);
                        setViewingStepJourney(null);
                        setSelectedJourney(viewingStepJourney.id);
                      }}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back to Journey
                    </Button>
                  </div>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    {(() => {
                      const StepIcon = getStepIcon(viewingStep.type);
                      return <StepIcon className="h-6 w-6 text-teal-600" />;
                    })()}
                    {viewingStep.title}
                  </DialogTitle>
                  <DialogDescription>
                    Step {viewingStep.stepNumber} of {viewingStepJourney.steps.length} • {viewingStep.estimatedTime}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <Badge variant="outline" className={`capitalize ${getStepTypeColor(viewingStep.type)}`}>
                    {viewingStep.type}
                  </Badge>

                  {viewingStep.type === "article" && viewingStep.articleId && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-900">
                        This step includes reading a recommended article. You'll find it in our Blog section.
                      </AlertDescription>
                    </Alert>
                  )}

                  {viewingStep.content && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                            {viewingStep.content}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {viewingStep.type === "exercise" && (
                    <Alert className="bg-purple-50 border-purple-200">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-900">
                        <strong>Tip:</strong> Take your time with this exercise. Consider writing your responses in your journal to track your progress.
                      </AlertDescription>
                    </Alert>
                  )}

                  {viewingStep.type === "meditation" && (
                    <Alert className="bg-green-50 border-green-200">
                      <Brain className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-900">
                        <strong>Tip:</strong> Find a quiet, comfortable space. Set a timer if helpful, and remember there's no "wrong" way to practice.
                      </AlertDescription>
                    </Alert>
                  )}

                  {viewingStep.type === "reflection" && (
                    <Alert className="bg-pink-50 border-pink-200">
                      <Heart className="h-4 w-4 text-pink-600" />
                      <AlertDescription className="text-pink-900">
                        <strong>Tip:</strong> Be honest and compassionate with yourself. Reflection is about awareness, not judgment.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  <div className="flex gap-3">
                    {(() => {
                      const journeyProg = activeJourneys.find(j => j.journeyId === viewingStepJourney.id);
                      const isCurrent = journeyProg?.currentStep === viewingStep.stepNumber;
                      const isCompleted = journeyProg?.completedSteps.includes(viewingStep.id);

                      if (isCurrent && !isCompleted && journeyProg) {
                        return (
                          <StepEngagementGate
                            step={viewingStep}
                            journeyColor={viewingStepJourney.color}
                            onComplete={(reflection, timeSpent) => {
                              handleStepComplete(viewingStepJourney.id, viewingStep.id, reflection, timeSpent);
                            }}
                          />
                        );
                      }

                      if (isCompleted) {
                        return (
                          <div className="w-full space-y-3">
                            <Alert className="bg-green-50 border-green-200">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <AlertDescription className="text-green-900">
                                <strong>Step completed!</strong> You've already finished this step.
                              </AlertDescription>
                            </Alert>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                setViewingStep(null);
                                setViewingStepJourney(null);
                                setSelectedJourney(viewingStepJourney.id);
                              }}
                            >
                              Back to Journey
                            </Button>
                          </div>
                        );
                      }

                      return (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setViewingStep(null);
                            setViewingStepJourney(null);
                            setSelectedJourney(viewingStepJourney.id);
                          }}
                        >
                          Back to Journey
                        </Button>
                      );
                    })()}
                  </div>
                </div>
              </>
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
    </PageTransition>
  );
}