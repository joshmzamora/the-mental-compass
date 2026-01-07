import { useState, useEffect } from "react";
import { Calendar, User, Clock, BookOpen, Compass, X, Filter, CheckCircle2 } from "lucide-react";
import { blogPosts, BlogPost } from "../data/blog-posts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CompassDecoration } from "./CompassDecoration";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

// Mapping of disorder topics to relevant categories/keywords
const topicToCategoriesMap: Record<string, string[]> = {
  anxiety: ["Coping Strategies", "Education"],
  depression: ["Support", "Education"],
  bipolar: ["Support", "Education"],
  ptsd: ["Support", "Education"],
  ocd: ["Coping Strategies", "Education"],
  "eating-disorders": ["Support", "Wellness"],
};

export function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [topicFilter, setTopicFilter] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);

  useEffect(() => {
    // Check for topic filter in URL params
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");
    if (topic) {
      setTopicFilter(topic);
      toast.info(`Showing articles related to ${topic}`);
    }
  }, []);

  useEffect(() => {
    // Filter posts based on topic
    if (!topicFilter) {
      setFilteredPosts(blogPosts);
      return;
    }

    const categories = topicToCategoriesMap[topicFilter] || [];
    const filtered = blogPosts.filter(post => {
      const categoryMatch = categories.includes(post.category);
      const titleMatch = post.title.toLowerCase().includes(topicFilter.toLowerCase());
      const excerptMatch = post.excerpt.toLowerCase().includes(topicFilter.toLowerCase());
      return categoryMatch || titleMatch || excerptMatch;
    });

    setFilteredPosts(filtered);
  }, [topicFilter]);

  return (
    <section id="blog" className="py-20 bg-white relative overflow-hidden">
      <CompassDecoration variant="light" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-teal-600 mr-3" />
              <h2 className="text-3xl md:text-4xl text-gray-900">
                Mental Health Blog
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert insights, personal stories, and practical advice to support
              your mental health journey.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-teal-400"></div>
              <Compass className="h-5 w-5 text-teal-600" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-teal-400"></div>
            </div>
          </div>

          {topicFilter && (
            <div className="mb-8 bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="font-medium text-teal-900">
                      Showing articles related to: <span className="capitalize">{topicFilter.replace('-', ' ')}</span>
                    </p>
                    <p className="text-sm text-teal-700">
                      {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTopicFilter("");
                    window.history.pushState({}, '', '/blog');
                  }}
                >
                  Clear Filter
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="aspect-[16/9] overflow-hidden bg-gray-200">
                  <ImageWithFallback
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-gray-900 line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-700 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedPost(post)}
                    variant="link"
                    className="mt-4 p-0 h-auto text-teal-600 hover:text-teal-700"
                  >
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Post Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="aspect-[16/9] overflow-hidden bg-gray-200 rounded-lg mb-4 -mt-6 -mx-6">
                  <ImageWithFallback
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge variant="secondary" className="bg-teal-100 text-teal-800 w-fit mb-2">
                  {selectedPost.category}
                </Badge>
                <DialogTitle className="text-3xl">{selectedPost.title}</DialogTitle>
                <DialogDescription className="sr-only">
                  Blog post article with full content
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-lg text-gray-700 mb-4 italic">{selectedPost.excerpt}</p>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedPost.content}
                  </p>
                  
                  {/* Additional content sections */}
                  <div className="mt-8 p-6 bg-teal-50 rounded-lg border border-teal-200">
                    <h3 className="text-xl mb-3 text-teal-900">Key Takeaways</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>Mental health is just as important as physical health</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>Seeking help is a sign of strength, not weakness</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>Small daily habits can make a significant difference</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>You're not alone in your journey</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong>Need Support?</strong> If you're struggling with your mental health, 
                      please reach out to a healthcare professional or contact one of our 
                      <Button variant="link" className="text-blue-700 hover:text-blue-800 p-0 h-auto ml-1" onClick={() => setSelectedPost(null)}>
                        crisis helplines
                      </Button>.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
