import { Heart, Users, BookOpen, Phone, Compass, Navigation, MapPin, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-12 sm:py-20 md:py-32 overflow-hidden">
      {/* Animated compass background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 text-teal-200 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Compass className="h-64 w-64" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-10 text-blue-200 opacity-20"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <Navigation className="h-48 w-48" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-200 opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <Compass className="h-96 w-96" />
        </motion.div>

        {/* Compass directional lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="compassGrid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 50 100 M 0 50 L 100 50" stroke="#14b8a6" strokeWidth="0.5" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#compassGrid)" />
        </svg>

        {/* Cardinal directions */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-teal-400 opacity-30">
          <div className="flex flex-col items-center">
            <div className="text-sm">N</div>
            <div className="w-px h-12 bg-teal-400"></div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-teal-400 opacity-30">
          <div className="flex flex-col items-center">
            <div className="w-px h-12 bg-teal-400"></div>
            <div className="text-sm">S</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Compass icon header */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-400 mr-4"></div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Compass className="h-12 w-12 text-teal-600" />
              </motion.div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-teal-400 ml-4"></div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900 px-4">
              Your Journey to Mental Wellness Starts Here
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-gray-700 max-w-3xl mx-auto px-4">
              Navigate your mental health journey with compassion, support, and
              expert resources. You don't have to face it alone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              asChild
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
            >
              <Link to="/helplines">
                <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Get Immediate Help
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-teal-600 text-teal-600 hover:bg-teal-50 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
            >
              <Link to="/disorders">
                <Map className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Explore Resources
              </Link>
            </Button>
          </motion.div>

          {/* Feature Cards with compass theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-16 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all border border-teal-100 hover:border-teal-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 text-teal-100 opacity-50 group-hover:opacity-100 transition-opacity">
                <MapPin className="h-16 w-16 -mr-4 -mt-4" />
              </div>
              <Heart className="h-12 w-12 text-teal-600 mx-auto mb-4 relative z-10" />
              <h3 className="mb-2 text-gray-900">Expert Resources</h3>
              <p className="text-sm text-gray-600">
                Evidence-based information about mental health conditions
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all border border-blue-100 hover:border-blue-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 text-blue-100 opacity-50 group-hover:opacity-100 transition-opacity">
                <Compass className="h-16 w-16 -mr-4 -mt-4" />
              </div>
              <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4 relative z-10" />
              <h3 className="mb-2 text-gray-900">24/7 Support</h3>
              <p className="text-sm text-gray-600">
                Access to helplines and crisis support anytime you need it
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all border border-purple-100 hover:border-purple-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 text-purple-100 opacity-50 group-hover:opacity-100 transition-opacity">
                <Navigation className="h-16 w-16 -mr-4 -mt-4" />
              </div>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4 relative z-10" />
              <h3 className="mb-2 text-gray-900">Community</h3>
              <p className="text-sm text-gray-600">
                Connect with others who understand your journey
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all border border-teal-100 hover:border-teal-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 text-teal-100 opacity-50 group-hover:opacity-100 transition-opacity">
                <Map className="h-16 w-16 -mr-4 -mt-4" />
              </div>
              <BookOpen className="h-12 w-12 text-teal-600 mx-auto mb-4 relative z-10" />
              <h3 className="mb-2 text-gray-900">Education</h3>
              <p className="text-sm text-gray-600">
                Read stories and learn coping strategies from experts
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
