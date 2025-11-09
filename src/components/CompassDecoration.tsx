import { Compass, Navigation } from "lucide-react";
import { motion } from "motion/react";

interface CompassDecorationProps {
  variant?: "light" | "dark";
}

export function CompassDecoration({ variant = "light" }: CompassDecorationProps) {
  const isDark = variant === "dark";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large rotating compass - top right */}
      <motion.div
        className={`absolute -top-20 -right-20 ${
          isDark ? "text-teal-900/20" : "text-teal-200/30"
        }`}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <Compass className="h-48 w-48" />
      </motion.div>

      {/* Medium rotating navigation - bottom left */}
      <motion.div
        className={`absolute -bottom-20 -left-20 ${
          isDark ? "text-blue-900/20" : "text-blue-200/30"
        }`}
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <Navigation className="h-40 w-40" />
      </motion.div>

      {/* Small compass - top left */}
      <motion.div
        className={`absolute top-10 left-10 ${
          isDark ? "text-purple-900/10" : "text-purple-200/20"
        }`}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <Compass className="h-24 w-24" />
      </motion.div>

      {/* Directional lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`compassGrid-${variant}`} width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 40 80 M 0 40 L 80 40"
              stroke={isDark ? "#0f766e" : "#14b8a6"}
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#compassGrid-${variant})`} />
      </svg>

      {/* Cardinal directions */}
      <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 ${
        isDark ? "text-teal-700/30" : "text-teal-400/40"
      }`}>
        <div className="flex flex-col items-center">
          <div className="text-xs">N</div>
          <div className={`w-px h-8 ${isDark ? "bg-teal-700/30" : "bg-teal-400/40"}`}></div>
        </div>
      </div>
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 ${
        isDark ? "text-teal-700/30" : "text-teal-400/40"
      }`}>
        <div className="flex flex-col items-center">
          <div className={`w-px h-8 ${isDark ? "bg-teal-700/30" : "bg-teal-400/40"}`}></div>
          <div className="text-xs">S</div>
        </div>
      </div>
    </div>
  );
}
