import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Heart, 
  Users, 
  AlertTriangle, 
  CheckCircle2,
  XCircle,
  ArrowLeft,
  MessageCircle,
  Flag
} from "lucide-react";
import { PageTransition } from "../components/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Alert, AlertDescription } from "../components/ui/alert";

export function CommunityGuidelines() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate("/community")}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Button>

            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-teal-600 mr-3" />
                <h1 className="text-4xl md:text-5xl text-gray-900">
                  Community Guidelines
                </h1>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our commitment to creating a safe, supportive, and respectful space for everyone
              </p>
            </div>

            {/* Crisis Warning */}
            <Alert className="mb-8 bg-red-50 border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-900">
                <strong>If you're in crisis:</strong> This community is for peer support only, not emergency services. 
                If you're experiencing a mental health emergency or having thoughts of self-harm, please contact the 
                National Suicide Prevention Lifeline at 988 or visit our{' '}
                <button 
                  onClick={() => navigate("/helplines")}
                  className="underline hover:text-red-700"
                >
                  helplines page
                </button> immediately.
              </AlertDescription>
            </Alert>

            {/* Core Values */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-teal-600" />
                  Our Core Values
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-teal-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Compassion & Empathy</h3>
                    <p className="text-gray-600 text-sm">
                      We approach every interaction with understanding and kindness. Everyone's journey is unique and valid.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Safety First</h3>
                    <p className="text-gray-600 text-sm">
                      We maintain a safe environment free from harassment, hate speech, and harmful content.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Respectful Dialogue</h3>
                    <p className="text-gray-600 text-sm">
                      We engage in thoughtful, respectful conversations even when we disagree.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Rules */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  Community Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">✅ Do:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Share your personal experiences and coping strategies</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Offer support, encouragement, and validation to others</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Ask thoughtful questions and listen actively</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Use trigger warnings when discussing sensitive topics</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Respect others' privacy and confidentiality</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Report inappropriate content to moderators</span>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">❌ Don't:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-700">
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>Give specific medical advice or recommend medication changes</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>Share graphic details of self-harm, suicide methods, or eating disorder behaviors</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>Use hateful, discriminatory, or offensive language</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>Harass, bully, or attack other community members</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>Share others' personal information without permission</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>Post spam, advertisements, or promotional content</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>Engage in trolling or intentionally disruptive behavior</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Policies */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  Prohibited Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  The following types of content are strictly prohibited and will result in immediate removal and possible account suspension:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Detailed descriptions of self-harm or suicide methods</strong> - While we support those struggling, we cannot allow content that could trigger or instruct harmful behaviors</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Promotion of eating disorders or "pro-ana/mia" content</strong> - We do not allow content that promotes or glorifies eating disorders</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Hate speech or discrimination</strong> - No content targeting individuals based on race, ethnicity, religion, gender, sexual orientation, disability, or any other protected characteristic</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Harassment or threats</strong> - Any form of bullying, intimidation, or threatening behavior</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Illegal content</strong> - No content promoting illegal activities or violating laws</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Misinformation</strong> - False or misleading health information that could cause harm</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Moderation & Enforcement */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-teal-600" />
                  Moderation & Enforcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Our Moderation Team</h3>
                  <p className="text-gray-700 text-sm">
                    Our trained moderators review flagged content and take appropriate action to maintain a safe environment. 
                    Moderators may remove content, issue warnings, or suspend accounts based on the severity and frequency of violations.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Reporting Content</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    If you see content that violates our guidelines, please report it immediately using the report button or by emailing{' '}
                    <a href="mailto:moderation@mentalcompass.org" className="text-teal-600 hover:text-teal-700 underline">
                      moderation@mentalcompass.org
                    </a>
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Flag className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-900">
                      All reports are reviewed within 24 hours
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Consequences of Violations</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-yellow-600">1st Violation:</span>
                      <span>Warning and content removal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-orange-600">2nd Violation:</span>
                      <span>Temporary suspension (7 days)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-red-600">3rd Violation:</span>
                      <span>Permanent account suspension</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-red-700">Severe Violations:</span>
                      <span>Immediate permanent ban (for threats, harassment, illegal content, etc.)</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Confidentiality */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle>Privacy & Confidentiality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>
                  <strong>Anonymity:</strong> You can choose to remain anonymous in the community. We encourage using usernames rather than real names.
                </p>
                <p>
                  <strong>What you share:</strong> Remember that anything posted in public forums can be seen by other community members. Only share what you're comfortable with.
                </p>
                <p>
                  <strong>Private information:</strong> Never share personal contact information, addresses, or other identifying details publicly.
                </p>
                <p>
                  <strong>Screenshots:</strong> Do not screenshot or share others' posts outside of this community without their explicit permission.
                </p>
              </CardContent>
            </Card>

            {/* Professional Disclaimer */}
            <Alert className="mb-8 bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <AlertDescription className="text-yellow-900">
                <strong>Important Disclaimer:</strong> This community is for peer support only. It is not a substitute 
                for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health 
                providers with any questions you may have regarding a medical condition.
              </AlertDescription>
            </Alert>

            {/* Footer Actions */}
            <Card className="shadow-lg bg-gradient-to-r from-teal-500 to-blue-600 border-none">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl text-white mb-3">Ready to Join the Conversation?</h3>
                <p className="text-teal-100 mb-6">
                  By participating in our community, you agree to follow these guidelines and help us maintain 
                  a supportive, respectful environment for all.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate("/community")}
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Go to Community
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white text-white hover:bg-white/20"
                    onClick={() => navigate("/helplines")}
                  >
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Crisis Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
