import { Brain, BookOpen, Phone, Compass, Navigation, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LayoutGroup, motion } from "motion/react";
import { TextRotate } from "./ui/text-rotate";

const heroCardsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.25,
    },
  },
};

const heroCardVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function Hero() {
  return (
    <section data-sync-section="home-hero" className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
      {/* Animated compass background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute right-10 top-10 hidden text-teal-200 opacity-20 lg:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Compass className="h-64 w-64" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-10 hidden text-blue-200 opacity-20 lg:block"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <Navigation className="h-48 w-48" />
        </motion.div>
        <motion.div
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform text-purple-200 opacity-10 sm:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <Compass className="h-96 w-96" />
        </motion.div>

        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="compassGrid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 50 100 M 0 50 L 100 50"
                stroke="#14b8a6"
                strokeWidth="0.5"
                opacity="0.1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#compassGrid)" />
        </svg>

        <div className="absolute left-1/2 top-8 hidden -translate-x-1/2 transform text-teal-400 opacity-30 sm:block">
          <div className="flex flex-col items-center">
            <div className="text-sm">N</div>
            <div className="h-12 w-px bg-teal-400"></div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 transform text-teal-400 opacity-30 sm:block">
          <div className="flex flex-col items-center">
            <div className="h-12 w-px bg-teal-400"></div>
            <div className="text-sm">S</div>
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="home-hero-stage flex items-center">
          <div className="mx-auto w-full max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-5xl"
            >
              <LayoutGroup>
                <motion.h1
                  className="home-hero-title flex flex-col items-center font-medium text-gray-900"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  layout
                >
                  <motion.span
                    className="block"
                    layout
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  >
                    Your Journey to
                  </motion.span>
                  <div className="flex flex-col items-center gap-4 sm:gap-5">
                    <TextRotate
                      texts={[
                        "Healing",
                        "Growth",
                        "Inner Peace",
                        "Resilience",
                        "Mental Wellness",
                      ]}
                      mainClassName="home-hero-word"
                      splitLevelClassName="home-hero-word-split"
                      elementLevelClassName="home-hero-word-letter font-semibold"
                      staggerFrom="last"
                      staggerDuration={0.02}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-120%" }}
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                      rotationInterval={2200}
                    />
                    <motion.span
                      className="block"
                      layout
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    >
                      Starts Here
                    </motion.span>
                  </div>
                </motion.h1>
              </LayoutGroup>

              <motion.p
                className="home-hero-copy mx-auto max-w-3xl text-lg text-gray-600 sm:text-xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Find trusted guidance, compassionate support, and practical next steps for
                wherever you are in your mental wellness journey.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 flex flex-col justify-center gap-4 sm:mt-14 sm:flex-row sm:gap-5"
            >
              <Button
                asChild
                size="lg"
                className="bg-teal-600 px-7 py-4 text-base font-semibold hover:bg-teal-700 sm:min-w-[220px] sm:px-9 sm:py-6 sm:text-lg"
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
                className="border-teal-600 bg-white/75 px-7 py-4 text-base font-semibold text-teal-600 hover:bg-teal-50 sm:min-w-[220px] sm:px-9 sm:py-6 sm:text-lg"
              >
                <Link to="/disorders">
                  <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Explore Resources
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="home-hero-cards mx-auto grid max-w-6xl grid-cols-1 gap-4 pt-4 sm:grid-cols-2 sm:gap-6 sm:pt-8 lg:grid-cols-4"
          variants={heroCardsContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={heroCardVariants}
            className="home-hero-card relative overflow-hidden rounded-lg border border-teal-300 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-teal-400 hover:shadow-md sm:p-6"
          >
            <Brain className="relative z-10 mx-auto mb-3 h-10 w-10 text-teal-600 sm:mb-4 sm:h-12 sm:w-12" />
            <h3 className="mb-2 text-xl text-gray-900">Expert Resources</h3>
            <p className="text-sm text-gray-600">
              Evidence-based information about mental health conditions
            </p>
          </motion.div>

          <motion.div
            variants={heroCardVariants}
            className="home-hero-card relative overflow-hidden rounded-lg border border-blue-300 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-blue-400 hover:shadow-md sm:p-6"
          >
            <Phone className="relative z-10 mx-auto mb-3 h-10 w-10 text-blue-600 sm:mb-4 sm:h-12 sm:w-12" />
            <h3 className="mb-2 text-xl text-gray-900">24/7 Support</h3>
            <p className="text-sm text-gray-600">
              Access to helplines and crisis support anytime you need it
            </p>
          </motion.div>

          <motion.div
            variants={heroCardVariants}
            className="home-hero-card relative overflow-hidden rounded-lg border border-purple-300 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-purple-400 hover:shadow-md sm:p-6"
          >
            <MessageSquare className="relative z-10 mx-auto mb-3 h-10 w-10 text-purple-600 sm:mb-4 sm:h-12 sm:w-12" />
            <h3 className="mb-2 text-xl text-gray-900">Community</h3>
            <p className="text-sm text-gray-600">
              Connect with others who understand your journey
            </p>
          </motion.div>

          <motion.div
            variants={heroCardVariants}
            className="home-hero-card relative overflow-hidden rounded-lg border border-teal-300 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-teal-400 hover:shadow-md sm:p-6"
          >
            <BookOpen className="relative z-10 mx-auto mb-3 h-10 w-10 text-teal-600 sm:mb-4 sm:h-12 sm:w-12" />
            <h3 className="mb-2 text-xl text-gray-900">Education</h3>
            <p className="text-sm text-gray-600">
              Read stories and learn coping strategies from experts
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
