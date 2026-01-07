import { useState } from "react";
import { PageTransition } from "../components/PageTransition";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a backend
    setSubmitted(true);
    toast.success("Thank you for contacting us! We'll respond within 24-48 hours.");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Mail className="h-16 w-16 text-teal-600 mx-auto mb-4" />
              <h1 className="text-4xl text-gray-900 mb-4">Contact Us</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions, feedback, or need assistance? We're here to help. Reach out to us through any of the methods below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <Mail className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">Email Us</h3>
                  <a
                    href="mailto:support@mentalcompass.org"
                    className="text-teal-600 hover:underline"
                  >
                    support@mentalcompass.org
                  </a>
                  <p className="text-sm text-gray-600 mt-2">
                    Response within 24-48 hours
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">Call Us</h3>
                  <a
                    href="tel:+18005551234"
                    className="text-blue-600 hover:underline"
                  >
                    1-800-555-1234
                  </a>
                  <p className="text-sm text-gray-600 mt-2">
                    Mon-Fri, 9am-5pm EST
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">Visit Us</h3>
                  <address className="text-gray-700 not-italic">
                    123 Wellness Way<br />
                    Suite 100<br />
                    Boston, MA 02101
                  </address>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-600">
                        Thank you for reaching out. We'll respond to your inquiry within 24-48 hours.
                      </p>
                      <Button
                        onClick={() => setSubmitted(false)}
                        variant="outline"
                        className="mt-6"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john.doe@example.com"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Select name="subject" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="appointments">Appointment Help</SelectItem>
                            <SelectItem value="community">Community Guidelines</SelectItem>
                            <SelectItem value="privacy">Privacy Concerns</SelectItem>
                            <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us how we can help..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-gray-900 mb-1">How do I schedule an appointment?</h4>
                      <p className="text-sm text-gray-600">
                        Navigate to the Appointments page, browse available mental health navigators, and select a time that works for you.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-gray-900 mb-1">Is this service confidential?</h4>
                      <p className="text-sm text-gray-600">
                        Yes, we comply with HIPAA regulations and maintain strict confidentiality standards. See our Privacy Policy for details.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-gray-900 mb-1">What if I'm in crisis?</h4>
                      <p className="text-sm text-gray-600">
                        Please visit our Get Help page for immediate crisis resources and helpline numbers available 24/7.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-gray-900 mb-1">Do you accept insurance?</h4>
                      <p className="text-sm text-gray-600">
                        Insurance acceptance varies by provider. Contact individual navigators for their specific insurance policies.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="text-gray-900 mb-2">Crisis Support</h3>
                    <p className="text-gray-700 mb-4">
                      If you or someone you know is in immediate danger or experiencing a mental health crisis:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone className="h-4 w-4 text-red-600" />
                        <span>Emergency: Call 911</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone className="h-4 w-4 text-red-600" />
                        <span>Suicide & Crisis Lifeline: 988</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone className="h-4 w-4 text-red-600" />
                        <span>Crisis Text Line: Text HOME to 741741</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
