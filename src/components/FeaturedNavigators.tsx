import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Compass, ArrowRight } from "lucide-react";
import { therapists } from "../data/therapists";

export function FeaturedNavigators() {
  // Select first 4 therapists for featured display
  const featuredTherapists = therapists.slice(0, 4);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-teal-600">
          <Compass className="h-32 w-32" />
        </div>
        <div className="absolute bottom-10 right-10 text-purple-600">
          <Compass className="h-32 w-32" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-teal-400 mr-3"></div>
            <Compass className="h-8 w-8 text-teal-600" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-teal-400 ml-3"></div>
          </div>
          <h2 className="text-gray-900 mb-4">Featured Navigators</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our experienced mental health professionals ready to guide you on your journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredTherapists.map((therapist, index) => (
            <motion.div
              key={therapist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all border border-teal-100 hover:border-teal-300 group"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={therapist.imageUrl}
                  alt={therapist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-gray-900 mb-1">{therapist.name}</h3>
                <p className="text-sm text-teal-600 mb-3">{therapist.credential}</p>
                <div className="mb-4">
                  <p className="text-gray-700">{therapist.specialty[0]}</p>
                </div>
                <Button
                  asChild
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  <Link to={`/appointments?therapist=${therapist.id}`}>
                    Consult Navigator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-teal-600 text-teal-600 hover:bg-teal-50"
          >
            <Link to="/appointments">
              View All Navigators
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
