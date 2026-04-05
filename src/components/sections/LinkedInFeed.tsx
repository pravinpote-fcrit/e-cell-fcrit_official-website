"use client";

import { useState, useEffect } from "react";
import {
  ExternalLink,
  Heart,
  Share,
  MessageCircle,
  CircleUserRound,
  Calendar,
  Tag,
} from "lucide-react";
import { LinkedInService, LinkedInPost } from "@/lib/linkedin";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export function LinkedInFeed() {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkedInPosts = async () => {
      try {
        const linkedInService = LinkedInService.getInstance();
        const linkedInPosts = await linkedInService.getCompanyPosts(6);
        setPosts(linkedInPosts);
      } catch (err) {
        setError("Failed to load LinkedIn posts");
        console.error("Error fetching LinkedIn posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinkedInPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      event: "bg-blue-500/20 text-blue-300",
      achievement: "bg-green-500/20 text-green-300",
      workshop: "bg-purple-500/20 text-purple-300",
      alumni: "bg-yellow-500/20 text-yellow-300",
      general: "bg-gray-500/20 text-gray-300",
      competition: "bg-red-500/20 text-red-300",
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading LinkedIn updates...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
              <p className="text-red-400 mb-4">{error}</p>
              <a
                href="https://www.linkedin.com/company/fcrit-entrepreneurship-cell/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Visit LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
              <p className="text-gray-400 mb-4">
                No LinkedIn posts available yet.
              </p>
              <a
                href="https://www.linkedin.com/company/fcrit-entrepreneurship-cell/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Follow us on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/20 rounded-full px-6 py-2 mb-8">
            <CircleUserRound className="h-5 w-5 text-blue-400" />
            <span className="text-blue-300 font-medium">LinkedIn Updates</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Latest from LinkedIn
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay connected with our latest updates, achievements, and insights
            shared on LinkedIn.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:transform hover:scale-105"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                      post.category
                    )}`}
                  >
                    {post.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Calendar className="w-3 h-3" />
                  {formatDate(post.publishedAt)}
                </div>
              </div>

              {/* Post Title */}
              <h4 className="text-white font-semibold mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                {post.title}
              </h4>

              {/* Post Content */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {post.excerpt || "Read the full post to see more details..."}
              </p>

              {/* Post Media */}
              {post.featuredImage && (
                <div className="mb-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={urlFor(post.featuredImage)
                        .width(300)
                        .height(200)
                        .url()}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-blue-400 text-xs flex items-center gap-1"
                    >
                      <Tag className="w-2 h-2" />#{tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-gray-500 text-xs">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.engagement.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.engagement.comments}
                  </div>
                  <div className="flex items-center gap-1">
                    <Share className="w-4 h-4" />
                    {post.engagement.shares}
                  </div>
                </div>
                <a
                  href={
                    post.linkedinUrl ||
                    "https://www.linkedin.com/company/fcrit-entrepreneurship-cell/posts/"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Stay Connected on LinkedIn
            </h3>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Follow us on LinkedIn for the latest updates, insights, and
              opportunities from FCRIT Entrepreneurship Cell.
            </p>
            <button
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/company/fcrit-entrepreneurship-cell/",
                  "_blank"
                )
              }
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              <CircleUserRound className="w-5 h-5 mr-2" />
              Follow on LinkedIn
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
