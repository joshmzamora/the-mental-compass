import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Lightbulb, Users, Calendar, Heart, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";

interface CompassPoint {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  color: string;
  angle: number;
}

interface CompassPointExtended extends CompassPoint {
  longDescription: string;
  features: string[];
}

const compassPoints: CompassPointExtended[] = [
  {
    id: "clarity",
    title: "Clarity",
    description: "Understanding Mental Health",
    longDescription: "Gain insight into mental health conditions, symptoms, and treatment options. Knowledge is the first step toward healing.",
    features: ["Comprehensive disorder guides", "Expert-reviewed information", "Self-assessment tools"],
    icon: Lightbulb,
    route: "/disorders",
    color: "from-yellow-400 to-orange-500",
    angle: 0, // North
  },
  {
    id: "connection",
    title: "Connection",
    description: "Community Support",
    longDescription: "Join a supportive community where you can share experiences, find encouragement, and realize you're not alone.",
    features: ["Moderated forums", "Real-time chat rooms", "Peer support groups"],
    icon: Users,
    route: "/community",
    color: "from-blue-400 to-indigo-600",
    angle: 90, // East
  },
  {
    id: "hope",
    title: "Hope",
    description: "Success Stories",
    longDescription: "Be inspired by real stories of resilience, recovery, and transformation from people who've walked similar paths.",
    features: ["Personal recovery journeys", "Video testimonials", "Expert perspectives"],
    icon: Heart,
    route: "/testimonials",
    color: "from-pink-400 to-rose-600",
    angle: 180, // South
  },
  {
    id: "stability",
    title: "Stability",
    description: "Professional Appointments",
    longDescription: "Connect with licensed mental health professionals and schedule appointments that fit your needs and schedule.",
    features: ["Licensed therapists", "Flexible scheduling", "Secure telehealth options"],
    icon: Calendar,
    route: "/appointments",
    color: "from-green-400 to-emerald-600",
    angle: 270, // West
  },
];

export function InteractiveMentalCompass() {
  const navigate = useNavigate();
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [needleAngle, setNeedleAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);

  // Track mouse movement for needle (disabled when hovering over a point)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!compassRef.current || isAnimating || hoveredPoint) return;
      
      const rect = compassRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Calculate angle in degrees (0° is north/up, increases clockwise)
      let angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI);
      // Normalize angle to 0-360 range
      angle = ((angle % 360) + 360) % 360;
      
      setNeedleAngle(angle);
      setIsDragging(true);
    };

    const handleMouseStop = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseStop);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseStop);
    };
  }, [isAnimating, hoveredPoint]);

  const handlePointClick = (point: CompassPoint) => {
    setIsAnimating(true);
    // Animate needle to point
    setNeedleAngle(point.angle);
    // Navigate after a brief animation
    setTimeout(() => {
      navigate(point.route);
    }, 600);
  };

  const handlePointHover = (point: CompassPoint | null) => {
    setHoveredPoint(point?.id || null);
    // Rotate compass needle to point at hovered direction
    if (point) {
      setNeedleAngle(point.angle);
      setIsAnimating(true);
      // Reset animation flag after transition
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Compass className="h-8 w-8 text-teal-600 mr-3" />
            <h2 className="text-3xl md:text-4xl text-gray-900">
              Navigate Your Mental Health Journey
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Choose your path forward. Click any direction to explore resources tailored to your needs.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="relative py-12 md:py-16">
            {/* Main Container for Compass and Info Card */}
            <div className="hidden md:flex items-center justify-center gap-12">
              {/* Main Compass Container - Hidden on Mobile */}
              <div 
                ref={compassRef}
                className="relative flex-shrink-0" 
                style={{ width: "700px", height: "700px" }}
              >
              {/* Outer Circle with Glow */}
              <div className="absolute inset-0 rounded-full border-8 border-teal-600/20 bg-white shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-100/30 to-blue-100/30 animate-pulse"></div>
              </div>

              {/* Inner Circle Background */}
              <div className="absolute inset-10 rounded-full border-4 border-teal-600/10 bg-gradient-to-br from-teal-50 to-blue-50"></div>

              {/* Compass Rose Background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full relative">
                  {/* Cardinal Direction Lines */}
                  <div className="absolute top-1/2 left-1/2 w-1 h-full bg-gradient-to-b from-teal-300 to-transparent transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                  <div className="absolute top-1/2 left-1/2 h-1 w-full bg-gradient-to-r from-teal-300 to-transparent transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                  <div className="absolute top-1/2 left-1/2 w-1 h-full bg-gradient-to-t from-teal-300 to-transparent transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                  <div className="absolute top-1/2 left-1/2 h-1 w-full bg-gradient-to-l from-teal-300 to-transparent transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                </div>
              </div>

              {/* Compass Needle (Follows Cursor or Points to Hovered Direction) */}
              <div 
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300 ease-out`}
                style={{ transform: `rotate(${needleAngle}deg)` }}
              >
                <div className="relative">
                  {/* Needle pointing up - Red with enhanced shadow */}
                  <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[180px] border-b-red-600 drop-shadow-lg" 
                    style={{ filter: "drop-shadow(0 6px 8px rgba(220, 38, 38, 0.4)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))" }}
                  ></div>
                  {/* Needle pointing down - Gray */}
                  <div className="absolute top-[180px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[90px] border-t-gray-400 opacity-80"></div>
                </div>
              </div>

              {/* Center Hub with Pulsing Effect - Now Interactive */}
              <button
                onClick={() => navigate("/onboarding")}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-gradient-to-br from-teal-600 to-blue-700 shadow-2xl flex items-center justify-center border-4 border-white z-10 hover:scale-110 transition-transform duration-300 group cursor-pointer"
                title="Find Your Bearing"
              >
                <div className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20 group-hover:opacity-40"></div>
                <Compass className="h-14 w-14 text-white relative z-10 group-hover:rotate-180 transition-transform duration-500" />
              </button>

              {/* Compass Points (N, E, S, W) */}
              {compassPoints.map((point, index) => {
                const isHovered = hoveredPoint === point.id;
                const Icon = point.icon;

                // Calculate position for icons only
                let iconPositionClasses = "";
                
                if (point.angle === 0) { // North
                  iconPositionClasses = "top-[-40px] left-1/2 -translate-x-1/2";
                } else if (point.angle === 90) { // East
                  iconPositionClasses = "top-1/2 right-[-40px] -translate-y-1/2";
                } else if (point.angle === 180) { // South
                  iconPositionClasses = "bottom-[-40px] left-1/2 -translate-x-1/2";
                } else { // West
                  iconPositionClasses = "top-1/2 left-[-40px] -translate-y-1/2";
                }

                return (
                  <div key={point.id}>
                    {/* Icon Button */}
                    <div className={`absolute ${iconPositionClasses} z-20`}>
                      <button
                        onClick={() => handlePointClick(point)}
                        onMouseEnter={() => handlePointHover(point)}
                        onMouseLeave={() => handlePointHover(null)}
                        className={`transition-all duration-300 group ${
                          isHovered ? "scale-110" : "scale-100"
                        }`}
                      >
                        <div
                          className={`w-28 h-28 rounded-full bg-gradient-to-br ${point.color} shadow-lg flex items-center justify-center transform transition-all duration-300 relative ${
                            isHovered ? "shadow-2xl scale-110 ring-4 ring-white" : ""
                          }`}
                        >
                          {isHovered && (
                            <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-30 z-0"></div>
                          )}
                          <Icon className="h-14 w-14 text-white relative z-10" />
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Degree Markers */}
              <div className="absolute inset-12 rounded-full">
                {[...Array(36)].map((_, i) => {
                  const angle = i * 10;
                  const isCardinal = angle % 90 === 0;
                  return (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 origin-left"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        width: "50%",
                      }}
                    >
                      <div
                        className={`absolute right-0 bg-teal-600 ${
                          isCardinal ? "w-4 h-1" : "w-2 h-0.5"
                        }`}
                        style={{ opacity: isCardinal ? 0.4 : 0.2 }}
                      ></div>
                    </div>
                  );
                })}
              </div>
              </div>

              {/* Clean White Information Card - Right Side of Compass */}
              <div className="flex-shrink-0" style={{ width: "400px", height: "700px" }}>
                <div className="h-full flex items-center relative">
                  {/* Placeholder when no direction is hovered */}
                  <div 
                    className={`w-full absolute inset-0 flex items-center transition-all duration-300 ${
                      !hoveredPoint 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4 pointer-events-none'
                    }`}
                  >
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full">
                      <div className="flex flex-col items-center text-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                          <Compass className="h-10 w-10 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-xl text-gray-900 mb-3">
                            Choose Your Direction
                          </h3>
                          <p className="text-gray-600">
                            Hover over any compass point to learn more about that path on your mental health journey.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 w-full mt-2">
                          {compassPoints.map((point) => {
                            const Icon = point.icon;
                            return (
                              <div key={point.id} className="flex items-center gap-2 text-sm text-gray-500">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${point.color} flex items-center justify-center flex-shrink-0`}>
                                  <Icon className="h-4 w-4 text-white" />
                                </div>
                                <span>{point.title}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Direction-specific cards */}
                  <div 
                    className={`w-full absolute inset-0 flex items-center transition-all duration-300 ${
                      hoveredPoint 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 translate-x-4 pointer-events-none'
                    }`}
                  >
                    {compassPoints.map((point) => {
                      if (point.id !== hoveredPoint) return null;
                      const Icon = point.icon;
                      
                      return (
                        <div
                          key={point.id}
                          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 w-full"
                        >
                          <div className="flex flex-col gap-6">
                            {/* Header with Icon and Title */}
                            <div className="flex items-start gap-4">
                              <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${point.color} shadow-lg flex items-center justify-center`}>
                                <Icon className="h-8 w-8 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className={`text-2xl mb-2 bg-gradient-to-r ${point.color} bg-clip-text text-transparent`}>
                                  {point.title}
                                </h3>
                                <p className="text-sm text-gray-500">{point.description}</p>
                              </div>
                            </div>
                            
                            {/* Long Description */}
                            <p className="text-gray-700 leading-relaxed">
                              {point.longDescription}
                            </p>

                            {/* Features List */}
                            <div className="space-y-2">
                              {point.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${point.color}`}></div>
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>

                            {/* CTA Button */}
                            <button
                              onClick={() => handlePointClick(point)}
                              className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${point.color} text-white rounded-full hover:shadow-xl transition-all duration-300 group mt-2`}
                            >
                              <span>Explore {point.title}</span>
                              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-Friendly Card Grid - Only visible on mobile */}
            <div className="md:hidden">
              {/* Simple card grid for mobile */}
              <div className="grid grid-cols-1 gap-4">
                {compassPoints.map((point) => {
                  const Icon = point.icon;
                  return (
                    <button
                      key={point.id}
                      onClick={() => handlePointClick(point)}
                      className="group"
                    >
                      <Card className="p-5 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-teal-200 bg-white">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${point.color} shadow-lg flex items-center justify-center flex-shrink-0 transform transition-all duration-300 group-hover:scale-110`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className={`text-lg mb-1 bg-gradient-to-r ${point.color} bg-clip-text text-transparent`}>
                              {point.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {point.description}
                            </p>
                          </div>
                          <div className="text-teal-600 transform transition-transform group-hover:translate-x-1">
                            →
                          </div>
                        </div>
                      </Card>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA - Increased spacing */}
        <div className="text-center mt-16 md:mt-20 px-4">
          <p className="text-gray-600 mb-4 text-sm md:text-base">
            Not sure where to start? Take our personalized assessment.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors duration-300 shadow-lg hover:shadow-xl text-sm md:text-base group"
          >
            <Compass className="h-4 w-4 md:h-5 md:w-5 group-hover:rotate-180 transition-transform duration-500" />
            Find Your Bearing
          </button>
        </div>
      </div>
    </section>
  );
}