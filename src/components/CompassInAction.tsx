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
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-transparent to-purple-50/50"></div>
      
      <motion.div
        className="absolute top-20 right-20 text-teal-200 opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <Compass className="h-48 w-48" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-teal-400 mr-3"></div>
            <Sparkles className="h-8 w-8 text-teal-600" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-teal-400 ml-3"></div>
          </div>
          <h2 className="text-gray-900 mb-4">The Compass in Action</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personalized path to mental wellness in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-xl transition-all border border-gray-200 hover:border-transparent h-full flex flex-col">
                  {/* Gradient border on hover */}
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm`}></div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">
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
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-100 border-2 border-gray-200 flex items-center justify-center shadow-lg">
                  <span className="text-gray-700">{index + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
