import { PageTransition } from "../components/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { 
  Eye, 
  Ear, 
  Keyboard, 
  MousePointer, 
  Monitor, 
  Accessibility as AccessibilityIcon,
  Check,
  MessageSquare,
  FileText,
  Palette,
  Smartphone
} from "lucide-react";

export function Accessibility() {
  const features = [
    {
      icon: Eye,
      title: "Screen Reader Compatible",
      description: "Our website is fully compatible with popular screen readers including JAWS, NVDA, and VoiceOver.",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "All interactive elements can be accessed and operated using only a keyboard with clear focus indicators.",
      color: "from-teal-400 to-teal-600"
    },
    {
      icon: Palette,
      title: "High Contrast Mode",
      description: "Text and interactive elements meet WCAG AAA contrast ratio standards for enhanced readability.",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: FileText,
      title: "Alternative Text",
      description: "All images include descriptive alt text to ensure content is accessible to everyone.",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Monitor,
      title: "Responsive Design",
      description: "Our website adapts seamlessly to all screen sizes and devices for optimal viewing.",
      color: "from-orange-400 to-orange-600"
    },
    {
      icon: Smartphone,
      title: "Mobile Accessible",
      description: "Full functionality available on mobile devices with touch-friendly controls and gestures.",
      color: "from-pink-400 to-pink-600"
    }
  ];

  const standards = [
    "WCAG 2.1 Level AA Compliance",
    "Section 508 Standards",
    "ADA (Americans with Disabilities Act) Guidelines",
    "ARIA (Accessible Rich Internet Applications) Implementation",
    "Semantic HTML5 Structure",
    "Focus Management Best Practices"
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <AccessibilityIcon className="h-16 w-16 text-teal-600 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">
                Accessibility Statement
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                At The Mental Compass, we believe mental health resources should be accessible to everyone. 
                We're committed to ensuring our website is usable by people of all abilities.
              </p>
            </div>

            {/* Our Commitment */}
            <Card className="shadow-xl mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-teal-600" />
                  Our Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>
                  The Mental Compass is dedicated to providing a website that is accessible to the widest possible audience, 
                  regardless of technology or ability. We are actively working to increase the accessibility and usability 
                  of our website and in doing so adhere to many of the available standards and guidelines.
                </p>
                <p>
                  We recognize that accessibility is an ongoing effort, and we continuously seek ways to improve the 
                  user experience for all visitors. Our team regularly reviews and updates our content to ensure it 
                  meets or exceeds accessibility standards.
                </p>
              </CardContent>
            </Card>

            {/* Accessibility Features */}
            <div className="mb-8">
              <h2 className="text-3xl text-gray-900 mb-6 text-center">
                Accessibility Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-lg text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Standards & Guidelines */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-6 w-6 text-green-600" />
                    Standards We Follow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {standards.map((standard, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{standard}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ear className="h-6 w-6 text-teal-600" />
                    Assistive Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Our website is designed to work with assistive technologies including:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Screen readers (JAWS, NVDA, VoiceOver)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Screen magnification software
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Speech recognition software
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Alternative input devices
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Browser text-only mode
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Browser Compatibility */}
            <Card className="shadow-xl mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-6 w-6 text-teal-600" />
                  Browser Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  The Mental Compass is designed to be compatible with the following browsers and their latest versions:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Chrome", "Firefox", "Safari", "Edge", "Opera", "Brave", "Samsung Internet", "iOS Safari"].map((browser) => (
                    <div key={browser} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                      <span>{browser}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feedback & Contact */}
            <Card className="shadow-xl bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <MousePointer className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <h2 className="text-2xl text-gray-900 mb-4">
                    We Welcome Your Feedback
                  </h2>
                  <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                    If you encounter any accessibility barriers or have suggestions for improvement, 
                    please let us know. Your feedback helps us create a better experience for everyone.
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Email:</strong>{" "}
                      <a href="mailto:accessibility@mentalcompass.org" className="text-teal-600 hover:underline">
                        accessibility@mentalcompass.org
                      </a>
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      <a href="tel:+18005551234" className="text-teal-600 hover:underline">
                        1-800-555-1234
                      </a>
                    </p>
                    <p className="text-sm text-gray-600 mt-4">
                      We aim to respond to accessibility feedback within 3 business days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Updated */}
            <div className="text-center mt-8 text-sm text-gray-600">
              Last Updated: January 7, 2026
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
