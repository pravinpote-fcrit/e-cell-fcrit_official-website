"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { client, queries } from "@/sanity/lib/client";
import { Speaker } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  CircleUserRound,
  MessageCircle,
  ExternalLink,
  Quote,
  Award,
  Users,
  Calendar,
} from "lucide-react";

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("");

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const data = await client.fetch(queries.getAllSpeakers);
        setSpeakers(data);
      } catch (error) {
        console.error("Error fetching speakers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  // Get all unique expertise areas for filter
  const allExpertise = Array.from(
    new Set(speakers.flatMap((speaker) => speaker.expertise || []))
  ).sort();

  // Filter speakers based on search and expertise
  const filteredSpeakers = speakers.filter((speaker) => {
    if (!speaker) return false;

    const matchesSearch =
      (speaker.name &&
        speaker.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (speaker.role &&
        speaker.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (speaker.company &&
        speaker.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (speaker.bio &&
        speaker.bio.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesExpertise =
      !selectedExpertise ||
      (speaker.expertise && speaker.expertise.includes(selectedExpertise));

    return matchesSearch && matchesExpertise;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Speakers
                </span>
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {[...Array(9)].map((_, i) => (
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
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-black via-purple-900/10 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Industry{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Experts
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Meet the visionaries, entrepreneurs, and industry leaders who have
              shared their knowledge and inspired our community at E-Cell FCRIT
              events.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-purple-400">
                  {speakers.length}+
                </div>
                <div className="text-gray-300">Expert Speakers</div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-pink-400">
                  {allExpertise.length}+
                </div>
                <div className="text-gray-300">Expertise Areas</div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-blue-400">50+</div>
                <div className="text-gray-300">Events Conducted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search speakers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Expertise Filter */}
            <div className="w-full md:w-auto">
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="w-full md:w-60 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="">All Expertise</option>
                {allExpertise.map((expertise) => (
                  <option
                    key={expertise}
                    value={expertise}
                    className="bg-gray-800"
                  >
                    {expertise}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-gray-400 text-center">
            Showing {filteredSpeakers.length} of {speakers.length} speakers
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredSpeakers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No speakers found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSpeakers.map((speaker) => (
                <div
                  key={speaker._id}
                  className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105"
                >
                  {/* Speaker Image */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto relative">
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
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
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
                    <h3 className="text-xl font-bold text-white mb-2">
                      {speaker.name}
                    </h3>
                    <p className="text-purple-400 font-medium text-lg">
                      {speaker.role}
                    </p>
                    {speaker.company && (
                      <p className="text-gray-400">{speaker.company}</p>
                    )}
                  </div>

                  {/* Bio */}
                  {speaker.bio && (
                    <div className="mb-4">
                      <p className="text-gray-300 text-sm line-clamp-3">
                        {speaker.bio}
                      </p>
                    </div>
                  )}

                  {/* Expertise Tags */}
                  {speaker.expertise && speaker.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {speaker.expertise.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {speaker.expertise.length > 4 && (
                        <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                          +{speaker.expertise.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Achievements */}
                  {speaker.achievements && speaker.achievements.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-300">
                          Key Achievements
                        </span>
                      </div>
                      <ul className="text-gray-400 text-sm space-y-1">
                        {speaker.achievements
                          .slice(0, 2)
                          .map((achievement, index) => (
                            <li key={index} className="line-clamp-1">
                              • {achievement}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {/* Events Associated */}
                  {speaker.eventsSpokeAt &&
                    speaker.eventsSpokeAt.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-gray-300">
                            Events
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          Spoke at {speaker.eventsSpokeAt.length} E-Cell event
                          {speaker.eventsSpokeAt.length > 1 ? "s" : ""}
                        </div>
                      </div>
                    )}

                  {/* Testimonial */}
                  {speaker.testimonial && (
                    <div className="mb-4 p-4 bg-purple-500/10 rounded-lg border-l-4 border-purple-500">
                      <p className="text-gray-300 text-sm italic">
                        "{speaker.testimonial}"
                      </p>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex justify-center gap-3 pt-4 border-t border-white/10">
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
        </div>
      </section>

      {/* Become a Speaker CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Become a Speaker
            </h2>
            <p className="text-gray-300 mb-8">
              Share your expertise and inspire the next generation of
              entrepreneurs at E-Cell FCRIT.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
            >
              Apply to Speak
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
