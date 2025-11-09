import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { BookOpen, ArrowRight, Clock, Tag } from "lucide-react";
import { blogPosts } from "../data/blog-posts";
import { Badge } from "./ui/badge";

export function LatestJournal() {
  // Select first 3 blog posts (most recent)
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="journalPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 60 60 M 60 0 L 0 60" stroke="#14b8a6" strokeWidth="0.5" opacity="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#journalPattern)" />
        </svg>
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
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400 mr-3"></div>
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400 ml-3"></div>
          </div>
          <h2 className="text-gray-900 mb-4">Latest from the Journal</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights, strategies, and stories to support your mental health journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {latestPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all border border-blue-100 hover:border-blue-300 group flex flex-col"
            >
              <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-teal-100">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <Tag className="h-3 w-3 mr-1" />
                    {post.category}
                  </Badge>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{post.author}</span>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Link to="/blog">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Link to="/blog">
              Explore All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
