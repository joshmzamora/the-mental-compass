import { PageTransition } from "../components/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { FileText, AlertCircle, CheckCircle2 } from "lucide-react";

export function TermsOfService() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <FileText className="h-16 w-16 text-teal-600 mx-auto mb-4" />
              <h1 className="text-4xl text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-lg text-gray-600">
                Last Updated: November 4, 2025
              </p>
            </div>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Agreement to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  By accessing or using The Mental Compass website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access our services.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-teal-600" />
                  Important Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-red-900 mb-2">Not a Substitute for Professional Care</h3>
                  <p className="text-red-800">
                    The Mental Compass provides educational information and resources but is NOT a substitute for professional mental health care, therapy, or medical advice. If you are experiencing a mental health crisis, please contact emergency services or a crisis helpline immediately.
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-yellow-900 mb-2">No Therapist-Patient Relationship</h3>
                  <p className="text-yellow-800">
                    Use of this website does not create a therapist-patient relationship. Appointments scheduled through our platform are facilitated but conducted by independent licensed professionals.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Use of Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">By using our services, you agree to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Use the services in compliance with all applicable laws</li>
                  <li>Not misuse or attempt to disrupt our services</li>
                  <li>Respect other users and community guidelines</li>
                  <li>Not share or distribute content that is harmful, offensive, or illegal</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>User Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  When you create an account, you are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must notify us immediately of any unauthorized access or security breach.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  Participation in our community forums requires adherence to our Community Guidelines. We reserve the right to remove content or suspend accounts that violate these guidelines, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Harassment or bullying of other users</li>
                  <li>Sharing personal or confidential information</li>
                  <li>Posting misleading or dangerous health information</li>
                  <li>Spam or commercial solicitation</li>
                  <li>Impersonation of others</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Appointment Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Our platform facilitates connections with licensed mental health professionals. Each professional maintains their own practice and is responsible for their services. Cancellation policies, fees, and terms of care are established by individual providers.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  All content on The Mental Compass website, including text, graphics, logos, and software, is the property of The Mental Compass or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  To the fullest extent permitted by law, The Mental Compass shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services. This includes any damages related to mental health outcomes or decisions made based on information obtained through our platform.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Indemnification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  You agree to indemnify and hold harmless The Mental Compass and its affiliates from any claims, losses, damages, liabilities, and expenses arising from your use of our services or violation of these Terms.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Modifications to Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We reserve the right to modify, suspend, or discontinue any part of our services at any time without notice. We may also update these Terms of Service periodically. Continued use of our services after changes constitutes acceptance of the modified terms.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle>Severability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-gray-900 mb-2">Questions About These Terms?</h3>
                <p className="text-gray-700">
                  If you have any questions about these Terms of Service, please contact us at{" "}
                  <a href="mailto:legal@mentalcompass.org" className="text-teal-600 hover:underline">
                    legal@mentalcompass.org
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
