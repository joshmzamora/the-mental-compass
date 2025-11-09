import { PageTransition } from "../components/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export function PrivacyPolicy() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Shield className="h-16 w-16 text-teal-600 mx-auto mb-4" />
              <h1 className="text-4xl text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-lg text-gray-600">
                Last Updated: November 4, 2025
              </p>
            </div>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-teal-600" />
                  Our Commitment to Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-teal max-w-none">
                <p className="text-gray-700">
                  At The Mental Compass, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-teal-600" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-gray-700">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
                    <li>Register for an account</li>
                    <li>Complete our onboarding questionnaire</li>
                    <li>Book appointments with mental health professionals</li>
                    <li>Participate in community forums</li>
                    <li>Contact us for support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Automatically Collected Information</h3>
                  <p className="text-gray-700">
                    When you access our website, we may automatically collect certain information about your device, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Pages you visit and time spent</li>
                    <li>Referring website addresses</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-teal-600" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Provide personalized mental health resources and recommendations</li>
                  <li>Facilitate appointments with mental health professionals</li>
                  <li>Enable community participation and support</li>
                  <li>Improve our website and services</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Ensure the security and integrity of our platform</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>The right to access your personal information</li>
                  <li>The right to correct inaccurate information</li>
                  <li>The right to delete your personal information</li>
                  <li>The right to restrict or object to processing</li>
                  <li>The right to data portability</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>HIPAA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  For users who schedule appointments through our platform, we comply with the Health Insurance Portability and Accountability Act (HIPAA) and maintain appropriate safeguards for protected health information (PHI). Your health information is encrypted and stored securely.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We may use third-party service providers to help us operate our website and provide services. These providers have access to your personal information only to perform specific tasks on our behalf and are obligated to protect your information.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-gray-900 mb-2">Contact Us</h3>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@mentalcompass.org" className="text-teal-600 hover:underline">
                    privacy@mentalcompass.org
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
