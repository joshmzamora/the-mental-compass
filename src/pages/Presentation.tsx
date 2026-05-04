import { Compass } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import "./Presentation.css";

const ringTransition = {
  repeat: Infinity,
  ease: "linear" as const,
};

const featureLines = [
  "Evidence-based mental health education",
  "24/7 crisis helplines and support resources",
  "Guided journeys for growth and resilience",
  "Community stories that reduce stigma",
  "Appointment tools for finding next steps",
];

export function Presentation() {
  return (
    <section className="presentation-screen" aria-label="The Mental Compass presentation screen">
      <div className="presentation-atmosphere" aria-hidden="true">
        <div className="presentation-light-field presentation-light-field-a" />
        <div className="presentation-light-field presentation-light-field-b" />
        <div className="presentation-light-field presentation-light-field-c" />
        <div className="presentation-grid" />
        <svg className="presentation-waves" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path
            className="presentation-wave presentation-wave-a"
            d="M-80 580 C 190 470 350 720 620 590 C 850 480 980 410 1210 515 C 1370 588 1510 520 1590 468"
          />
          <path
            className="presentation-wave presentation-wave-b"
            d="M-100 360 C 155 250 320 420 560 340 C 800 260 1010 200 1240 325 C 1390 408 1515 380 1580 330"
          />
          <path
            className="presentation-wave presentation-wave-c"
            d="M-120 720 C 130 660 315 780 560 705 C 850 616 1010 680 1245 605 C 1400 555 1510 585 1585 640"
          />
        </svg>
      </div>

      <div className="presentation-compass-stage" aria-hidden="true">
        <div className="presentation-cardinal presentation-cardinal-n">N</div>
        <div className="presentation-cardinal presentation-cardinal-e">E</div>
        <div className="presentation-cardinal presentation-cardinal-s">S</div>
        <div className="presentation-cardinal presentation-cardinal-w">W</div>
        <motion.div
          className="presentation-ring presentation-ring-outer"
          animate={{ rotate: 360 }}
          transition={{ ...ringTransition, duration: 46 }}
        />
        <motion.div
          className="presentation-ring presentation-ring-middle"
          animate={{ rotate: -360 }}
          transition={{ ...ringTransition, duration: 34 }}
        />
        <motion.div
          className="presentation-ring presentation-ring-inner"
          animate={{ rotate: 360 }}
          transition={{ ...ringTransition, duration: 22 }}
        />
      </div>

      <motion.div
        className="presentation-brand"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link className="presentation-mark-link" to="/" aria-label="Go to The Mental Compass home page">
          <motion.div
            className="presentation-mark"
            animate={{ rotate: [0, 2.5, -2.5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Compass aria-hidden="true" />
          </motion.div>
        </Link>
        <div className="presentation-copy">
          <p>Navigate Your Mental Wellness</p>
          <h1>The Mental Compass</h1>
          <div className="presentation-feature-rotator" aria-live="polite">
            {featureLines.map((feature, index) => (
              <span
                key={feature}
                className="presentation-feature-line"
                style={{ animationDelay: `${index * 4}s` }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
