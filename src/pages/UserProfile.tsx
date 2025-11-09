import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { PageTransition } from "../components/PageTransition";
import { getUserProfile } from "../data/user-profiles";
import { ArrowLeft, Calendar, MessageCircle, FileText, Sparkles } from "lucide-react";

export function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const profile = getUserProfile(userId || "");

  if (!profile) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl text-gray-900 mb-4">User Not Found</h1>
              <p className="text-gray-600 mb-6">
                We couldn't find the profile you're looking for.
              </p>
              <Button onClick={() => navigate("/community")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const memberSince = new Date(profile.joinedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate("/community")}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Button>

            {/* Profile Header */}
            <Card className="mb-8 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl">
                      {profile.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl text-gray-900 mb-2">{profile.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {memberSince}</span>
                    </div>
                    {profile.bio && (
                      <p className="text-gray-700 mb-4">{profile.bio}</p>
                    )}
                    {profile.interests && profile.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-teal-100 text-teal-800"
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-2 border-teal-200 bg-gradient-to-br from-white to-teal-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <FileText className="h-5 w-5 text-teal-600" />
                    Posts Created
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl text-teal-600 mb-2">
                    {profile.postsCreated.length}
                  </div>
                  <p className="text-sm text-gray-600">
                    {profile.postsCreated.length === 1 ? 'discussion started' : 'discussions started'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    Comments Made
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl text-blue-600 mb-2">
                    {profile.commentsCreated.length}
                  </div>
                  <p className="text-sm text-gray-600">
                    {profile.commentsCreated.length === 1 ? 'helpful response' : 'helpful responses'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Activity Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Sparkles className="h-5 w-5 text-teal-600" />
                  Community Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.postsCreated.length === 0 && profile.commentsCreated.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    This user hasn't posted or commented yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {profile.postsCreated.length > 0 && (
                      <div>
                        <h3 className="text-sm text-gray-900 mb-2">
                          Started {profile.postsCreated.length} discussion{profile.postsCreated.length !== 1 ? 's' : ''}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.postsCreated.map((postId) => (
                            <Badge
                              key={postId}
                              variant="outline"
                              className="border-teal-300 text-teal-700"
                            >
                              Post #{postId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.commentsCreated.length > 0 && (
                      <div>
                        <h3 className="text-sm text-gray-900 mb-2">
                          Made {profile.commentsCreated.length} helpful response{profile.commentsCreated.length !== 1 ? 's' : ''}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.commentsCreated.map((commentId) => (
                            <Badge
                              key={commentId}
                              variant="outline"
                              className="border-blue-300 text-blue-700"
                            >
                              Comment #{commentId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-900">
                  <strong>Privacy Notice:</strong> User profiles show only public activity within the Mental Compass community. Personal information is kept private and secure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
