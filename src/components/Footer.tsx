import { Compass, Facebook, Twitter, Instagram, Mail, Navigation, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import bpaLogo from "./bpalogowhite.png";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 relative overflow-hidden">
      {/* Compass background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <motion.div
          className="absolute top-10 right-20 text-teal-400 hidden sm:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <Compass className="h-32 w-32" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-20 text-blue-400 hidden sm:block"
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <Navigation className="h-40 w-40" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Compass className="h-6 w-6 text-teal-400" />
              </motion.div>
              <span className="text-xl text-white">The Mental Compass</span>
            </div>
            <p className="text-sm mb-4">
              Guiding you towards better mental health with compassion,
              resources, and community support.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <MapPin className="h-4 w-4" />
              <span>Your guide to mental wellness</span>
            </div>
          </div>

          <div>
            <h4 className="text-white mb-4 flex items-center gap-2">
              <Navigation className="h-4 w-4 text-teal-400" />
              Navigate
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">
                  <span className="text-teal-400">›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/disorders" className="hover:text-teal-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">
                  <span className="text-teal-400">›</span> Mental Health Info
                </Link>
              </li>
              <li>
                <Link to="/helplines" className="hover:text-teal-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">
                  <span className="text-teal-400">›</span> Get Help
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-teal-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">
                  <span className="text-teal-400">›</span> Community
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-teal-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">
                  <span className="text-teal-400">›</span> Blog
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-teal-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">
                  <span className="text-teal-400">›</span> Testimonials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-400" />
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/helplines" className="hover:text-teal-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">
                  <span className="text-teal-400">›</span> Crisis Support
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="hover:text-teal-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">
                  <span className="text-teal-400">›</span> Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-teal-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">
                  <span className="text-teal-400">›</span> Self-Care Articles
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-teal-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">
                  <span className="text-teal-400">›</span> Recovery Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Connect With Us</h4>
            <div className="flex gap-4 mb-4">
              <a
                href="#"
                className="hover:text-teal-400 transition-colors hover:scale-110 transform duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-teal-400 transition-colors hover:scale-110 transform duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-teal-400 transition-colors hover:scale-110 transform duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-teal-400 transition-colors hover:scale-110 transform duration-200"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm">
              Subscribe to our newsletter for mental health tips and updates.
            </p>
          </div>
        </div>

        {/* Compass direction divider */}
        <div className="border-t border-gray-800 pt-8 mt-8 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-gray-900 px-4">
              <Compass className="h-6 w-6 text-teal-400" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2025 The Mental Compass. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              <Link to="/privacy-policy" className="hover:text-teal-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-teal-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/accessibility" className="hover:text-teal-400 transition-colors">
                Accessibility
              </Link>
              <Link to="/team" className="hover:text-teal-400 transition-colors">
                Team
              </Link>
              <Link to="/contact" className="hover:text-teal-400 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-6 p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
            <p className="text-sm text-center text-red-200 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span className="flex items-center gap-2 mb-1 sm:mb-0">
                <span className="text-red-400">⚠</span>
                If you are in crisis or need immediate help, please call
              </span>
              <span className="flex items-center gap-2">
                <strong className="text-red-300">988</strong>(Suicide & Crisis Lifeline) or
                <strong className="text-red-300">911</strong>.
              </span>
            </p>
          </div>
          
          {/* BPA Logo Section */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <img 
              src={bpaLogo} 
              alt="Business Professionals of America" 
              className="h-12 sm:h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
            <p className="text-xs text-gray-400 text-center">
              Proudly created for the BPA Web Design Competition
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}