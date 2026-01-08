import { PageTransition } from "../components/PageTransition";
import { Card, CardContent } from "../components/ui/card";
import { 
  Users, 
  Compass,
  FileText,
  Palette,
  Code,
  Database,
  Linkedin,
  Mail,
  Heart,
  Award
} from "lucide-react";
import bpaLogo from "./bpalogocolor.png";

export function Team() {
  const teamMembers = [
    {
      name: "Kolbe Pool",
      role: "Content Manager",
      icon: FileText,
      color: "from-blue-400 to-blue-600",
      description: "Crafting compassionate content that resonates with our community and provides valuable mental health resources.",
      specialties: ["Content Strategy", "Mental Health Writing", "Community Engagement"],
      quote: "Every word matters when it comes to mental health support."
    },
    {
      name: "Parker Dagley",
      role: "Design Manager",
      icon: Palette,
      color: "from-purple-400 to-purple-600",
      description: "Creating intuitive and accessible designs that make mental health resources approachable and easy to navigate.",
      specialties: ["UI/UX Design", "Visual Identity", "Accessibility"],
      quote: "Great design removes barriers and creates connections."
    },
    {
      name: "Grant Carroll",
      role: "Front End Developer & CEO",
      icon: Code,
      color: "from-teal-400 to-teal-600",
      description: "Leading the vision and building seamless user experiences that empower individuals on their mental health journey.",
      specialties: ["React Development", "User Experience", "Strategic Vision"],
      quote: "Technology should serve humanity's most important needs."
    },
    {
      name: "Joshua Zamora",
      role: "Backend Manager",
      icon: Database,
      color: "from-green-400 to-green-600",
      description: "Ensuring secure, reliable infrastructure that protects user data and enables our platform to scale with compassion.",
      specialties: ["Database Architecture", "API Development", "Security"],
      quote: "Trust is built on a foundation of security and reliability."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description: "Every decision we make is guided by empathy and understanding for those seeking mental health support."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "We listen to our users and continuously improve based on their needs and feedback."
    },
    {
      icon: Compass,
      title: "Guided by Purpose",
      description: "Our mission to de-stigmatize mental health drives everything we create and deliver."
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* BPA Competition Banner */}
            <Card className="shadow-xl bg-white border-2 border-blue-200 mb-12">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={bpaLogo} 
                      alt="Business Professionals of America" 
                      className="h-16 sm:h-20 w-auto"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg sm:text-xl text-gray-900">
                        BPA Web Design Competition
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      We are part of the <strong>02-1105 Barbers Hill High School Chapter 1</strong> in Mont Belvieu, Texas during the <strong>2025-2026 school year</strong>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 text-teal-600 mx-auto mb-4" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
                Meet Our Team
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                We're a passionate team dedicated to making mental health resources accessible, 
                supportive, and stigma-free for everyone who needs them.
              </p>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {teamMembers.map((member, index) => {
                const Icon = member.icon;
                return (
                  <Card 
                    key={index} 
                    className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <CardContent className="p-8">
                      {/* Icon and Name */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl text-gray-900 mb-1">
                            {member.name}
                          </h2>
                          <p className={`text-sm bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>
                            {member.role}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 mb-4">
                        {member.description}
                      </p>

                      {/* Quote */}
                      <div className="bg-gray-50 border-l-4 border-teal-600 p-4 mb-4 italic text-gray-600">
                        "{member.quote}"
                      </div>

                      {/* Specialties */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-2">
                          {member.specialties.map((specialty, idx) => (
                            <span 
                              key={idx}
                              className={`px-3 py-1 text-xs rounded-full bg-gradient-to-r ${member.color} text-white`}
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contact Icons */}
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button 
                          className={`p-2 rounded-full bg-gradient-to-br ${member.color} text-white hover:shadow-lg transition-shadow duration-200`}
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="h-4 w-4" />
                        </button>
                        <button 
                          className={`p-2 rounded-full bg-gradient-to-br ${member.color} text-white hover:shadow-lg transition-shadow duration-200`}
                          aria-label="Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Our Values */}
            <div className="mb-12">
              <h2 className="text-3xl text-gray-900 mb-8 text-center">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <Card key={index} className="shadow-lg text-center">
                      <CardContent className="p-6">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-7 w-7 text-teal-600" />
                        </div>
                        <h3 className="text-xl text-gray-900 mb-2">
                          {value.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Mission Statement */}
            <Card className="shadow-xl bg-gradient-to-br from-teal-600 to-blue-700 text-white">
              <CardContent className="p-8 md:p-12 text-center">
                <Compass className="h-16 w-16 mx-auto mb-6 animate-pulse" />
                <h2 className="text-3xl mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-teal-50 max-w-3xl mx-auto mb-6">
                  The Mental Compass exists to guide individuals toward better mental health by providing 
                  accessible resources, fostering supportive communities, and breaking down the stigma 
                  surrounding mental health challenges. We believe everyone deserves a compassionate 
                  path forward.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-300"></div>
                    <span>Accessible Resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                    <span>Supportive Community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-300"></div>
                    <span>Stigma-Free Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Join Us CTA */}
            <div className="text-center mt-12">
              <Card className="shadow-xl border-2 border-teal-200">
                <CardContent className="p-8">
                  <Users className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-2xl text-gray-900 mb-3">
                    Want to Join Our Mission?
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    We're always looking for passionate individuals who want to make a difference 
                    in mental health accessibility and support.
                  </p>
                  <a 
                    href="mailto:careers@mentalcompass.org"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Mail className="h-5 w-5" />
                    careers@mentalcompass.org
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}