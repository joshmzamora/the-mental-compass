import { useState, useEffect } from "react";
import { 
  Clock, 
  CheckCircle, 
  Lock, 
  PenLine, 
  Timer,
  BookOpen,
  Brain,
  Heart,
  MessageCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import type { JourneyStep } from "../data/guided-journeys";

interface StepEngagementGateProps {
  step: JourneyStep;
  onComplete: (reflection: string, timeSpent: number) => void;
  journeyColor: string;
}

export function StepEngagementGate({ step, onComplete, journeyColor }: StepEngagementGateProps) {
  // Pillar 1: Time Gate
  const minimumTime = step.minimumTimeSeconds || 60; // Default 60 seconds
  const [timeSpent, setTimeSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  // Pillar 2: Reflection
  const requiresReflection = step.type === "reflection" || step.type === "exercise" || step.type === "meditation";
  const [reflection, setReflection] = useState("");
  const minReflectionLength = 50;
  
  // Pillar 3: Active Confirmation (for specific step types)
  const [confirmationComplete, setConfirmationComplete] = useState(false);
  
  // Check completion status
  const [pillarsComplete, setPillarsComplete] = useState({
    time: false,
    reflection: false,
    confirmation: false,
  });
  
  // Auto-start timer when component mounts
  useEffect(() => {
    setTimerActive(true);
    
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update pillar completion status
  useEffect(() => {
    setPillarsComplete({
      time: timeSpent >= minimumTime,
      reflection: !requiresReflection || reflection.trim().length >= minReflectionLength,
      confirmation: !requiresConfirmation() || confirmationComplete,
    });
  }, [timeSpent, reflection, confirmationComplete, minimumTime, requiresReflection]);
  
  function requiresConfirmation(): boolean {
    // Meditation and reading steps require active confirmation
    return step.type === "meditation" || step.type === "article";
  }
  
  function canComplete(): boolean {
    // Must pass at least 2 out of 3 pillars
    const completedPillars = Object.values(pillarsComplete).filter(Boolean).length;
    return completedPillars >= 2;
  }
  
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  function getTimeRemaining(): number {
    return Math.max(0, minimumTime - timeSpent);
  }
  
  function handleComplete() {
    if (canComplete()) {
      onComplete(reflection, timeSpent);
    }
  }
  
  function handleConfirmationCheck(checklistItem: string) {
    // Simple confirmation - check at least one item
    setConfirmationComplete(true);
  }
  
  const timeProgress = Math.min((timeSpent / minimumTime) * 100, 100);
  const timeRemaining = getTimeRemaining();
  
  const getStepIcon = () => {
    switch (step.type) {
      case "article": return BookOpen;
      case "meditation": return Brain;
      case "reflection": return Heart;
      default: return MessageCircle;
    }
  };
  
  const StepIcon = getStepIcon();
  
  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-6 border-2 border-teal-200">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-teal-600" />
          Engagement Requirements
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Complete at least 2 of these 3 requirements to finish this step:
        </p>
        
        <div className="grid gap-3">
          {/* Pillar 1: Time Gate */}
          <div className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
            pillarsComplete.time 
              ? 'bg-green-50 border-green-300' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              pillarsComplete.time ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {pillarsComplete.time ? (
                <CheckCircle className="h-4 w-4 text-white" />
              ) : (
                <Lock className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Time Investment</p>
              <p className="text-xs text-gray-600">
                Spend at least {Math.ceil(minimumTime / 60)} minute{Math.ceil(minimumTime / 60) !== 1 ? 's' : ''} engaging with content
              </p>
            </div>
            <Badge variant={pillarsComplete.time ? "default" : "outline"} className={pillarsComplete.time ? "bg-green-600" : ""}>
              {formatTime(timeSpent)}
            </Badge>
          </div>
          
          {/* Pillar 2: Reflection */}
          {requiresReflection && (
            <div className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
              pillarsComplete.reflection 
                ? 'bg-green-50 border-green-300' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                pillarsComplete.reflection ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {pillarsComplete.reflection ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <Lock className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Written Reflection</p>
                <p className="text-xs text-gray-600">
                  Write at least {minReflectionLength} characters about your experience
                </p>
              </div>
              <Badge variant={pillarsComplete.reflection ? "default" : "outline"} className={pillarsComplete.reflection ? "bg-green-600" : ""}>
                {reflection.trim().length}/{minReflectionLength}
              </Badge>
            </div>
          )}
          
          {/* Pillar 3: Active Confirmation */}
          {requiresConfirmation() && (
            <div className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
              pillarsComplete.confirmation 
                ? 'bg-green-50 border-green-300' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                pillarsComplete.confirmation ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {pillarsComplete.confirmation ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <Lock className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Active Confirmation</p>
                <p className="text-xs text-gray-600">
                  {step.type === "meditation" ? "Confirm meditation practice completion" : "Confirm you've read the content"}
                </p>
              </div>
              <Badge variant={pillarsComplete.confirmation ? "default" : "outline"} className={pillarsComplete.confirmation ? "bg-green-600" : ""}>
                {pillarsComplete.confirmation ? "Done" : "Pending"}
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      {/* Time Gate Display */}
      <div className="bg-white rounded-lg p-5 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Timer className={`h-5 w-5 ${pillarsComplete.time ? 'text-green-600' : 'text-teal-600'}`} />
            <span className="font-medium text-gray-900">
              {pillarsComplete.time ? "Time requirement met!" : `Time unlocks in ${formatTime(timeRemaining)}`}
            </span>
          </div>
          <span className={`text-lg font-semibold ${pillarsComplete.time ? 'text-green-600' : 'text-teal-600'}`}>
            {formatTime(timeSpent)}
          </span>
        </div>
        <Progress value={timeProgress} className="h-2" />
        {!pillarsComplete.time && (
          <p className="text-xs text-gray-500 mt-2">
            Take your time to fully engage with this step's content. The timer started when you opened this step.
          </p>
        )}
      </div>
      
      {/* Reflection Input */}
      {requiresReflection && (
        <div className="bg-white rounded-lg p-5 border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <PenLine className={`h-5 w-5 ${pillarsComplete.reflection ? 'text-green-600' : 'text-purple-600'}`} />
            <label className="font-medium text-gray-900">
              Your Reflection {!pillarsComplete.reflection && `(${minReflectionLength - reflection.trim().length} more characters needed)`}
            </label>
          </div>
          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder={
              step.type === "reflection" 
                ? "Share your thoughts and insights from this reflection exercise..."
                : step.type === "meditation"
                ? "How did this meditation practice feel? What did you notice?"
                : "What resonated with you from this exercise? What will you try?"
            }
            className="min-h-[120px] resize-none"
            rows={5}
          />
          <p className="text-xs text-gray-500 mt-2">
            {pillarsComplete.reflection 
              ? "✓ Great reflection! This will be saved to your personal journal."
              : `Write at least ${minReflectionLength} characters to complete this requirement.`
            }
          </p>
        </div>
      )}
      
      {/* Active Confirmation Checklist */}
      {requiresConfirmation() && (
        <div className="bg-white rounded-lg p-5 border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <StepIcon className={`h-5 w-5 ${pillarsComplete.confirmation ? 'text-green-600' : 'text-blue-600'}`} />
            <label className="font-medium text-gray-900">
              {step.type === "meditation" ? "Practice Confirmation" : "Reading Confirmation"}
            </label>
          </div>
          
          {step.type === "meditation" && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">
                Confirm you've completed the meditation practice:
              </p>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="meditation-confirm"
                  checked={confirmationComplete}
                  onChange={(e) => setConfirmationComplete(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="meditation-confirm" className="text-sm text-gray-700 flex-1 cursor-pointer">
                  I have completed the meditation practice described in this step
                </label>
              </div>
            </div>
          )}
          
          {step.type === "article" && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">
                Confirm you've read the article:
              </p>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="reading-confirm"
                  checked={confirmationComplete}
                  onChange={(e) => setConfirmationComplete(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="reading-confirm" className="text-sm text-gray-700 flex-1 cursor-pointer">
                  I have read and engaged with the article content
                </label>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Completion Status */}
      {canComplete() ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            <strong>Ready to continue!</strong> You've met the requirements to complete this step.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            Complete at least 2 requirements above to unlock the "Mark Complete" button.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Complete Button */}
      <Button
        onClick={handleComplete}
        disabled={!canComplete()}
        className={`w-full ${canComplete() ? `bg-gradient-to-r ${journeyColor} hover:opacity-90` : 'bg-gray-300'} text-white`}
        size="lg"
      >
        {canComplete() ? (
          <>
            <CheckCircle className="h-5 w-5 mr-2" />
            Mark Step Complete
          </>
        ) : (
          <>
            <Lock className="h-5 w-5 mr-2" />
            Complete {3 - Object.values(pillarsComplete).filter(Boolean).length} More Requirement{3 - Object.values(pillarsComplete).filter(Boolean).length !== 1 ? 's' : ''}
          </>
        )}
      </Button>
    </div>
  );
}
