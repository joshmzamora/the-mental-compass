import { Link } from "react-router-dom";
import { Map, ChevronRight, BookOpen, Brain, Heart, MessageCircle, FileText, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { getJourneyById } from "../data/guided-journeys";

interface JourneyProgress {
  journeyId: string;
  currentStep: number;
  completedSteps: string[];
  startedAt: string;
  lastAccessedAt: string;
  completed: boolean;
}

interface ActiveJourneysWidgetProps {
  activeJourneys: JourneyProgress[];
  darkAccents?: boolean;
  compactView?: boolean;
}

export function ActiveJourneysWidget({ activeJourneys, darkAccents = false, compactView = false }: ActiveJourneysWidgetProps) {
  if (!activeJourneys || activeJourneys.length === 0) {
    return null;
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case "article": return BookOpen;
      case "exercise": return FileText;
      case "meditation": return Brain;
      case "reflection": return Heart;
      default: return MessageCircle;
    }
  };

  return (
    <Card className={`border-2 ${darkAccents ? 'border-slate-300 bg-gradient-to-br from-white to-slate-50' : 'border-teal-200 bg-gradient-to-br from-white to-teal-50'}`}>
      <CardHeader className={compactView ? "p-4 pb-2" : undefined}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Map className={`h-5 w-5 ${darkAccents ? 'text-slate-700' : 'text-teal-600'}`} />
            Active Guided Journeys
            <Badge className={darkAccents ? "bg-slate-700" : "bg-teal-600"}>
              {activeJourneys.length}
            </Badge>
          </CardTitle>
          <Link to="/blog">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className={compactView ? "p-4 pt-2" : undefined}>
        <div className="space-y-4">
          {activeJourneys.slice(0, 3).map((journeyProgress) => {
            const journey = getJourneyById(journeyProgress.journeyId);
            if (!journey) return null;

            const progressPercent = (journeyProgress.completedSteps.length / journey.steps.length) * 100;
            const currentStep = journey.steps[journeyProgress.currentStep - 1];
            const StepIcon = currentStep ? getStepIcon(currentStep.type) : Map;

            return (
              <div 
                key={journeyProgress.journeyId} 
                className={`p-4 rounded-lg border-2 transition-all ${
                  darkAccents 
                    ? 'border-slate-200 bg-white hover:border-slate-300' 
                    : 'border-teal-200 bg-teal-50/50 hover:border-teal-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{journey.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Step {journeyProgress.currentStep} of {journey.steps.length}</span>
                      <span>•</span>
                      <span>{Math.round(progressPercent)}% Complete</span>
                    </div>
                  </div>
                  <Trophy className={`h-5 w-5 ${darkAccents ? 'text-slate-600' : 'text-teal-600'}`} />
                </div>

                <Progress value={progressPercent} className="h-2 mb-3" />

                {currentStep && journeyProgress.currentStep <= journey.steps.length && (
                  <div className={`p-3 rounded-md border mb-3 ${
                    darkAccents 
                      ? 'bg-slate-50 border-slate-200' 
                      : 'bg-white border-teal-200'
                  }`}>
                    <p className="text-xs text-gray-500 mb-1">Up Next:</p>
                    <div className="flex items-center gap-2">
                      <StepIcon className={`h-4 w-4 ${darkAccents ? 'text-slate-600' : 'text-teal-600'}`} />
                      <p className="text-sm font-medium text-gray-900">
                        {currentStep.title}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{currentStep.estimatedTime}</p>
                  </div>
                )}

                <Link to="/blog">
                  <Button 
                    className={`w-full ${darkAccents ? 'bg-slate-700 hover:bg-slate-800' : 'bg-teal-600 hover:bg-teal-700'}`}
                    size="sm"
                  >
                    Continue Step {journeyProgress.currentStep}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            );
          })}
          
          {activeJourneys.length > 3 && (
            <Link to="/blog">
              <Button variant="outline" className="w-full" size="sm">
                View {activeJourneys.length - 3} More {activeJourneys.length - 3 === 1 ? 'Journey' : 'Journeys'}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
