"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { client, queries } from "@/sanity/lib/client";
import { Speaker } from "@/types";
import { CircleUserRound, MessageCircle, ExternalLink, Quote } from "lucide-react";

export function Speakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const data = await client.fetch(queries.getFeaturedSpeakers);
        setSpeakers(data);
      } catch (error) {
        console.error("Error fetching speakers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Speakers
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-xl p-6 animate-pulse"
                >
                  <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-4"></div>
                  <div className="h-20 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-pink-900/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Industry{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Experts
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Learn from the best minds in entrepreneurship and innovation who
            have shared their wisdom with E-Cell FCRIT
          </p>
        </div>

        {speakers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No speakers featured at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker) => (
              <div
                key={speaker._id}
                className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Speaker Image */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto relative">
                    {speaker.image &&
                    speaker.image.asset &&
                    speaker.image.asset.url ? (
                      <Image
                        src={speaker.image.asset.url}
                        alt={speaker.image.alt || speaker.name || "Speaker"}
                        fill
                        className="rounded-full object-cover border-4 border-purple-500/20 group-hover:border-purple-500/50 transition-colors"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {speaker.name ? speaker.name.charAt(0) : "S"}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-500 p-2 rounded-full">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Speaker Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {speaker.name || "Unknown Speaker"}
                  </h3>
                  <p className="text-purple-400 font-medium">
                    {speaker.role || "Position not specified"}
                  </p>
                  {speaker.company && (
                    <p className="text-gray-400 text-sm">{speaker.company}</p>
                  )}
                </div>

                {/* Expertise Tags */}
                {speaker.expertise && speaker.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {speaker.expertise.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Testimonial */}
                {speaker.testimonial && (
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm italic line-clamp-3">
                      "{speaker.testimonial}"
                    </p>
                  </div>
                )}

                {/* Bio */}
                {speaker.bio && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {speaker.bio}
                    </p>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  {speaker.socialMedia?.linkedin && (
                    <Link
                      href={speaker.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-full transition-colors group"
                    >
                      <CircleUserRound className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                    </Link>
                  )}
                  {speaker.socialMedia?.twitter && (
                    <Link
                      href={speaker.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-400/20 hover:bg-blue-400/30 rounded-full transition-colors group"
                    >
                      <MessageCircle className="w-4 h-4 text-blue-300 group-hover:text-blue-200" />
                    </Link>
                  )}
                  {speaker.socialMedia?.website && (
                    <Link
                      href={speaker.socialMedia.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-600/20 hover:bg-gray-600/30 rounded-full transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Speakers Button */}
        <div className="text-center mt-12">
          <Link
            href="/speakers"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
          >
            View All Speakers
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
