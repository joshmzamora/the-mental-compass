import { Link } from "react-router-dom";
import { Compass, Home, ArrowLeft, Navigation, MapPin, Heart, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { motion } from "motion/react";

export function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated compass background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-teal-200 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Compass className="h-32 w-32" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-blue-200 opacity-20"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <Compass className="h-40 w-40" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/4 text-purple-200 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Navigation className="h-24 w-24" />
        </motion.div>
        
        {/* Directional markers */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-teal-300 opacity-30">
          <div className="flex flex-col items-center">
            <div className="text-sm">N</div>
            <div className="w-px h-8 bg-teal-300"></div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-teal-300 opacity-30">
          <div className="flex flex-col items-center">
            <div className="w-px h-8 bg-teal-300"></div>
            <div className="text-sm">S</div>
          </div>
        </div>
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 text-teal-300 opacity-30">
          <div className="flex items-center">
            <div className="text-sm">W</div>
            <div className="h-px w-8 bg-teal-300"></div>
          </div>
        </div>
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 text-teal-300 opacity-30">
          <div className="flex items-center">
            <div className="h-px w-8 bg-teal-300"></div>
            <div className="text-sm">E</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="relative inline-block">
              {/* Compass rose background */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                <div className="relative h-48 w-48">
                  {/* Compass points */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-teal-400">
                    <div className="text-xs">N</div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-teal-400">
                    <div className="text-xs">S</div>
                  </div>
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 text-teal-400">
                    <div className="text-xs">W</div>
                  </div>
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-teal-400">
                    <div className="text-xs">E</div>
                  </div>
                  {/* Diagonal lines */}
                  <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <line x1="50" y1="0" x2="50" y2="100" stroke="#14b8a6" strokeWidth="0.5" opacity="0.3" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#14b8a6" strokeWidth="0.5" opacity="0.3" />
                      <line x1="15" y1="15" x2="85" y2="85" stroke="#14b8a6" strokeWidth="0.5" opacity="0.2" />
                      <line x1="85" y1="15" x2="15" y2="85" stroke="#14b8a6" strokeWidth="0.5" opacity="0.2" />
                      <circle cx="50" cy="50" r="45" stroke="#14b8a6" strokeWidth="1" fill="none" opacity="0.2" />
                      <circle cx="50" cy="50" r="35" stroke="#14b8a6" strokeWidth="0.5" fill="none" opacity="0.2" />
                    </svg>
                  </div>
                </div>
              </motion.div>
              
              {/* Central compass icon */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Compass className="h-32 w-32 text-teal-600 relative z-10" strokeWidth={1.5} />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-400"></div>
              <h1 className="text-8xl md:text-9xl text-gray-900">404</h1>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-teal-400"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl mb-4 text-gray-800">
              Your Compass Lost Its Bearing
            </h2>
            <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
              Even the best navigators sometimes drift off course. Let's recalibrate your mental compass and guide you back to the right path.
            </p>

            {/* Navigation cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-teal-200 hover:border-teal-400 transition-all hover:shadow-lg">
                <MapPin className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                <h3 className="mb-2 text-gray-900">Find Your Way</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Return to home base and start fresh
                </p>
                <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <Navigation className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="mb-2 text-gray-900">Retrace Steps</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Go back to your last location
                </p>
                <Button 
                  onClick={() => window.history.back()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <Heart className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="mb-2 text-gray-900">Explore Resources</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Browse mental health support
                </p>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link to="/disorders">
                    <Compass className="mr-2 h-4 w-4" />
                    View Resources
                  </Link>
                </Button>
              </Card>
            </div>

            {/* Crisis support section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-8 bg-gradient-to-r from-red-50 to-pink-50 border-red-200 max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Phone className="h-10 w-10 text-red-600 mr-3" />
                  <h3 className="text-2xl text-gray-900">In Crisis? We're Here</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  If you're experiencing a mental health emergency or need immediate support, help is available 24/7.
                </p>
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 w-full md:w-auto">
                  <Link to="/helplines">
                    <Phone className="mr-2 h-5 w-5" />
                    Access Crisis Helplines Now
                  </Link>
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
