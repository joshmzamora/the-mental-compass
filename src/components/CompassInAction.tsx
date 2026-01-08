import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Compass, Calendar, Users, ArrowRight, Sparkles } from "lucide-react";

export function CompassInAction() {
  const features = [
    {
      icon: Compass,
      title: "Set Your Compass",
      description: "Take our personalized questionnaire to discover your unique mental health profile and get customized recommendations tailored to your journey.",
      link: "/signup",
      cta: "Start Your Journey",
      color: "teal",
      gradient: "from-teal-500 to-blue-500"
    },
    {
      icon: Calendar,
      title: "Global Course Correction",
      description: "Connect with experienced mental health professionals who understand your needs. Schedule appointments that fit your schedule and specialty requirements.",
      link: "/appointments",
      cta: "Book an Appointment",
      color: "blue",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: Users,
      title: "Find Your Circle",
      description: "Join our supportive community of individuals navigating similar journeys. Share experiences, offer support, and never feel alone in your mental health journey.",
      link: "/community",
      cta: "Join the Community",
      color: "purple",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-teal-600 via-blue-600 to-purple-600 relative overflow-hidden min-h-screen flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 right-20 text-white/10 hidden lg:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Compass className="h-64 w-64" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-20 text-white/10 hidden lg:block"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <Compass className="h-48 w-48" />
        </motion.div>
        
        {/* Grid pattern overlay */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="compassGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke="white" strokeWidth="0.5" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#compassGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-10 w-10 lg:h-12 lg:w-12 text-yellow-300" />
            </motion.div>
          </div>
          <h2 className="text-white mb-4 text-3xl lg:text-4xl">The Compass in Action</h2>
          <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
            Your personalized path to mental wellness in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all h-full flex flex-col">
                  {/* Icon */}
                  <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 lg:mb-6`}>
                    <Icon className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-gray-900 mb-3 text-xl lg:text-2xl">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 flex-grow text-sm lg:text-base">
                    {feature.description}
                  </p>

                  {/* CTA */}
                  <Button
                    asChild
                    className={`w-full bg-${feature.color}-600 hover:bg-${feature.color}-700`}
                    style={{
                      background: `linear-gradient(to right, ${feature.color === 'teal' ? '#0d9488' : feature.color === 'blue' ? '#2563eb' : '#9333ea'}, ${feature.color === 'teal' ? '#0891b2' : feature.color === 'blue' ? '#7c3aed' : '#db2777'})`
                    }}
                  >
                    <Link to={feature.link}>
                      {feature.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white border-2 border-yellow-300 flex items-center justify-center shadow-lg">
                  <span className="text-gray-700 font-semibold">{index + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}