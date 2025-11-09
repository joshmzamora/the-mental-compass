import { useState } from "react";
import { Quote, Heart, Compass, ChevronDown, ChevronUp } from "lucide-react";
import { testimonials, Testimonial } from "../data/testimonials";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CompassDecoration } from "./CompassDecoration";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";

export function TestimonialsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for sharing your story! We'll review it and be in touch soon.");
    setShowSubmitDialog(false);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <CompassDecoration variant="light" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-teal-600 mr-3" />
              <h2 className="text-3xl md:text-4xl text-gray-900">
                Stories of Hope and Recovery
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real people, real stories. Hear from individuals who have navigated
              their mental health challenges and found hope.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-teal-400"></div>
              <Compass className="h-5 w-5 text-teal-600" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-teal-400"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => {
              const isExpanded = expandedId === testimonial.id;
              
              return (
                <Card key={testimonial.id} className="relative overflow-hidden hover:shadow-xl transition-all bg-white group">
                  <CardContent className="p-6">
                    <Quote className="h-12 w-12 text-teal-200 mb-4 group-hover:text-teal-300 transition-colors" />
                    
                    <blockquote className="text-lg text-gray-900 mb-6 italic">
                      "{testimonial.quote}"
                    </blockquote>

                    <p className={`text-gray-700 mb-6 transition-all ${isExpanded ? '' : 'line-clamp-4'}`}>
                      {testimonial.story}
                    </p>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : testimonial.id)}
                      className="text-teal-600 hover:text-teal-700 text-sm flex items-center gap-1 mb-4 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          Show Less <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Read Full Story <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-4 pt-4 border-t">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">
                          {testimonial.age} • {testimonial.condition}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center bg-white rounded-lg p-8 shadow-sm border border-teal-100">
            <Heart className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-2xl mb-4 text-gray-900">
              Share Your Story
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Your journey could inspire someone else to seek help. If you'd like
              to share your mental health recovery story, we'd love to hear from
              you.
            </p>
            <Button 
              onClick={() => setShowSubmitDialog(true)}
              className="bg-teal-600 hover:bg-teal-700"
              size="lg"
            >
              Submit Your Story
            </Button>
          </div>
        </div>
      </div>

      {/* Submit Story Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Share Your Story of Hope</DialogTitle>
            <DialogDescription>
              Your story can inspire others on their journey. All submissions are reviewed before publishing to ensure privacy and safety.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitStory} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name (or Anonymous)</Label>
                <Input id="name" placeholder="Your name or 'Anonymous'" required />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" placeholder="Your age" required />
              </div>
            </div>
            
            <div>
              <Label htmlFor="condition">Mental Health Condition</Label>
              <Input id="condition" placeholder="e.g., Anxiety, Depression, etc." required />
            </div>

            <div>
              <Label htmlFor="quote">Short Quote (1-2 sentences)</Label>
              <Textarea 
                id="quote" 
                placeholder="A brief, powerful statement about your journey..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="story">Your Full Story</Label>
              <Textarea 
                id="story" 
                placeholder="Share your journey, challenges you faced, and how you found hope and recovery..."
                rows={8}
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Privacy Note:</strong> We respect your privacy. You can choose to remain anonymous, 
                and we'll review all submissions to ensure no identifying information is shared without your consent.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700">
                Submit Story
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowSubmitDialog(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
