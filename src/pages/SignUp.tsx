import { Link } from "react-router-dom";
import { ClerkFailed, SignUp as ClerkSignUp } from "@clerk/react";
import { Compass } from "lucide-react";
import { ClerkAuthError, ClerkAuthFallback } from "../components/ClerkAuthFallback";
import { PageTransition } from "../components/PageTransition";

export function SignUp() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Compass className="h-16 w-16 text-teal-600 animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 bg-teal-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">Begin Your Journey</h1>
            <p className="text-gray-600">Create an account to access personalized support</p>
          </div>

          <div className="flex justify-center">
            <ClerkFailed>
              <ClerkAuthError />
            </ClerkFailed>
            <ClerkSignUp
              routing="path"
              path="/signup"
              fallbackRedirectUrl="/onboarding"
              signInUrl="/login"
              signInFallbackRedirectUrl="/dashboard"
              fallback={<ClerkAuthFallback message="Loading sign up..." />}
            />
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-teal-600">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
