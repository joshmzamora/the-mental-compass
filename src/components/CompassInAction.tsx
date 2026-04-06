import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Target, Calendar, MessageSquare, ArrowRight, Compass } from "lucide-react";

export function CompassInAction() {
  const features = [
    {
      icon: Target,
      title: "Set Your Compass",
      description: "Answer a few guided questions to understand your needs and get recommendations that fit your journey.",
      link: "/signup",
      cta: "Start Your Journey",
      color: "teal",
      gradient: "from-teal-500 to-blue-500"
    },
    {
      icon: Calendar,
      title: "Global Course Correction",
      description: "Find mental health professionals who match your needs and book a time that works for you.",
      link: "/appointments",
      cta: "Book an Appointment",
      color: "blue",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: MessageSquare,
      title: "Find Your Circle",
      description: "Join a supportive community, share your experience, and connect with people who understand.",
      link: "/community",
      cta: "Join the Community",
      color: "purple",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-teal-600 via-blue-600 to-purple-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 right-20 text-white/10 hidden lg:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Target className="h-64 w-64" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-20 text-white/10 hidden lg:block"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <MessageSquare className="h-48 w-48" />
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
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Compass className="h-16 w-16 lg:h-14 lg:w-14 text-white stroke-[2.25]" />
            </motion.div>
          </div>
          <h2 className="text-white mb-4 text-4xl font-bold lg:text-6xl">The Compass in Action</h2>
          <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
            Your personalized path to mental wellness
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
