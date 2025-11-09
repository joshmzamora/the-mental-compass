import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Compass, Navigation, User } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClass = (path: string) => {
    return `text-sm transition-colors relative group ${
      isActive(path)
        ? "text-teal-600"
        : "text-gray-700 hover:text-teal-600"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 relative">
      {/* Decorative compass elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 opacity-5">
          <Compass className="h-40 w-40 text-teal-600" />
        </div>
        <div className="absolute -top-10 left-1/3 opacity-5">
          <Navigation className="h-20 w-20 text-blue-600" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Compass className="h-8 w-8 text-teal-600 group-hover:text-teal-700 transition-colors" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl text-teal-900 group-hover:text-teal-700 transition-colors">
                The Mental Compass
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">
                Navigate Your Mental Wellness
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={navLinkClass("/")}>
              Home
              {isActive("/") && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-600"
                />
              )}
            </Link>
            <Link to="/disorders" className={navLinkClass("/disorders")}>
              Mental Health Info
              {isActive("/disorders") && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-600"
                />
              )}
            </Link>
            <Link to="/helplines" className={navLinkClass("/helplines")}>
              Get Help
              {isActive("/helplines") && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-600"
                />
              )}
            </Link>
            <Link to="/appointments" className={navLinkClass("/appointments")}>
              Book Appointment
              {isActive("/appointments") && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-600"
                />
              )}
            </Link>
            <Link to="/community" className={navLinkClass("/community")}>
              Community
              {isActive("/community") && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-600"
                />
              )}
            </Link>
            <Link to="/blog" className={navLinkClass("/blog")}>
              Blog
              {isActive("/blog") && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-600"
                />
              )}
            </Link>
            <Link to="/testimonials" className={navLinkClass("/testimonials")}>
              Stories
              {isActive("/testimonials") && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-600"
                />
              )}
            </Link>
            
            {user ? (
              <Button asChild variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                <Link to="/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <Link to="/login">
                    Log In
                  </Link>
                </Button>
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link to="/signup">
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t"
          >
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass("/") + " text-left"}
              >
                Home
              </Link>
              <Link
                to="/disorders"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass("/disorders") + " text-left"}
              >
                Mental Health Info
              </Link>
              <Link
                to="/helplines"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass("/helplines") + " text-left"}
              >
                Get Help
              </Link>
              <Link
                to="/appointments"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass("/appointments") + " text-left"}
              >
                Book Appointment
              </Link>
              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass("/community") + " text-left"}
              >
                Community
              </Link>
              <Link
                to="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass("/blog") + " text-left"}
              >
                Blog
              </Link>
              <Link
                to="/testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass("/testimonials") + " text-left"}
              >
                Stories
              </Link>
              
              {user ? (
                <Button asChild variant="outline" className="border-teal-600 text-teal-600 w-full">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button asChild className="bg-teal-600 hover:bg-teal-700 w-full">
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
}
