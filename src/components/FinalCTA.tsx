import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Compass, Phone, ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-teal-600 via-blue-600 to-purple-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 right-20 text-white/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Compass className="h-64 w-64" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-20 text-white/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <Compass className="h-48 w-48" />
        </motion.div>
        
        {/* Grid pattern overlay */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="finalCtaGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 40 80 M 0 40 L 80 40" stroke="white" strokeWidth="0.5" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#finalCtaGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Icon header */}
          <motion.div
            className="flex items-center justify-center mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-12 w-12 text-yellow-300" />
          </motion.div>

          <h2 className="text-white mb-6">
            Ready to Find Your Bearing?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
            Take the first step toward mental wellness. Whether you need immediate support or want to start your personalized journey, we're here to help guide you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full sm:w-auto"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-6 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all"
              >
                <Link to="/signup">
                  <Compass className="mr-2 h-5 w-5" />
                  Start Your Personalized Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full sm:w-auto"
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-teal-600 hover:bg-white hover:text-red-600 text-lg px-8 py-6 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all"
              >
                <Link to="/helplines">
                  <Phone className="mr-2 h-5 w-5" />
                  Need Help Now? SOS
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-white/80 text-sm mb-4">
              Join thousands finding their path to mental wellness
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/70 text-sm">
              <div className="flex items-center">
                <Compass className="h-4 w-4 mr-2" />
                <span>Personalized Support</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>24/7 Crisis Resources</span>
              </div>
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Evidence-Based Care</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
