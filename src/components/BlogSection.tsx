import { useState, useEffect } from "react";
import { Calendar, User, Clock, BookOpen, Compass, X, Filter, CheckCircle2 } from "lucide-react";
import { blogPosts, BlogPost } from "../data/blog-posts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
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
        <DialogContent className="!max-w-none !w-screen !h-screen !top-0 !left-0 !translate-x-0 !translate-y-0 !rounded-none overflow-y-auto p-0 flex flex-col [&>button]:!top-4 [&>button]:!right-4 [&>button]:!z-50 [&>button]:!bg-white/90 [&>button]:!w-10 [&>button]:!h-10 [&>button]:!rounded-full [&>button]:hover:!bg-white [&>button]:!flex [&>button]:!items-center [&>button]:!justify-center [&>button]:!shadow-md">
          {selectedPost && (
            <>
              {/* Sticky Header with Hero Image */}
              <DialogHeader className="sticky top-0 z-10 bg-white border-b flex-shrink-0 p-0 space-y-0">
                <div className="relative h-40 md:h-52 lg:h-64 overflow-hidden w-full">
                  <ImageWithFallback
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 lg:left-12 right-4 sm:right-6 md:right-8 lg:right-12">
                    <Badge className="bg-teal-500/90 hover:bg-teal-500 text-white border-none mb-3">
                      {selectedPost.category}
                    </Badge>
                    <DialogTitle className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight shadow-sm">
                      {selectedPost.title}
                    </DialogTitle>
                    <DialogDescription className="text-teal-50 text-base sm:text-lg md:text-xl mt-2 max-w-4xl font-medium">
                      {selectedPost.excerpt}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 border border-gray-200">
                        <AvatarFallback className="bg-teal-100 text-teal-800 font-bold">
                          {selectedPost.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{selectedPost.author}</p>
                        <p className="text-xs">Author</p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-teal-600" />
                        <span>{new Date(selectedPost.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-teal-600" />
                        <span>{selectedPost.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Article Content */}
                  <article className="prose prose-lg prose-teal max-w-none leading-relaxed font-serif">
                    {/* Render paragraphs cleanly */}
                    {selectedPost.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-6 text-gray-800 text-lg md:text-xl leading-8">
                        {paragraph}
                      </p>
                    ))}

                    {/* Pull Quote */}
                    {selectedPost.quote && (
                      <figure className="my-10 pl-6 border-l-4 border-teal-500 bg-teal-50/50 p-6 rounded-r-xl italic relative">
                        <span className="absolute top-2 left-2 text-6xl text-teal-200 opacity-50 font-serif leading-none">"</span>
                        <blockquote className="text-xl md:text-2xl text-teal-900 font-medium relative z-10">
                          {selectedPost.quote}
                        </blockquote>
                        {selectedPost.quoteAuthor && (
                          <figcaption className="mt-4 text-sm font-bold text-teal-700 not-italic">
                            — {selectedPost.quoteAuthor}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    {/* Secondary Image */}
                    {selectedPost.secondaryImageUrl && (
                      <div className="my-10 rounded-2xl overflow-hidden shadow-xl">
                        <ImageWithFallback
                          src={selectedPost.secondaryImageUrl}
                          alt="Illustration"
                          className="w-full h-auto object-cover max-h-[500px]"
                        />
                      </div>
                    )}
                  </article>

                  {/* Additional content sections */}
                  <div className="mt-12 p-8 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl border border-teal-100 shadow-sm">
                    <h3 className="text-2xl font-bold mb-6 text-teal-900 flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-teal-600" />
                      Key Takeaways
                    </h3>
                    <ul className="space-y-4 text-gray-700">
                      <li className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-teal-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-teal-800 text-xs font-bold">1</div>
                        <span className="text-lg">Mental health is just as important as physical health and deserves the same care.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-teal-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-teal-800 text-xs font-bold">2</div>
                        <span className="text-lg">Seeking help is a brave and vital step towards recovery and balance.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-teal-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-teal-800 text-xs font-bold">3</div>
                        <span className="text-lg">Small, consistent daily habits can create powerful positive changes over time.</span>
                      </li>
                    </ul>
                  </div>

                  {/* About the Author Section */}
                  {selectedPost.authorBio && (
                    <div className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                      <Avatar className="h-16 w-16 border-2 border-white shadow-sm flex-shrink-0">
                        <AvatarFallback className="bg-teal-600 text-white text-xl font-bold">
                          {selectedPost.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">About the Author</h4>
                        <p className="text-sm font-medium text-teal-700 mb-2">{selectedPost.author}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{selectedPost.authorBio}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 p-6 bg-blue-50/80 rounded-xl border border-blue-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600 hidden sm:block">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1">Need Professional Support?</h4>
                      <p className="text-blue-800 text-sm leading-6">
                        If this article resonates with you, know that help is available.{" "}
                        <button
                          onClick={() => setSelectedPost(null)}
                          className="text-blue-700 hover:text-blue-900 font-bold decoration-blue-400 underline inline cursor-pointer"
                        >
                          Find a Navigator
                        </button>{" "}
                        today.
                      </p>
                    </div>
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
