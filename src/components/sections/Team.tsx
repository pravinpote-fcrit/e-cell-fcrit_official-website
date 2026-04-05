"use client";

import { useState, useEffect } from "react";
import { client, queries, urlFor } from "@/sanity/lib/client";
import { CircleUserRound, Mail, Users, Award, ChevronDown } from "lucide-react";
import Image from "next/image";

interface SanityTeamMember {
  _id: string;
  name: string;
  position: string;
  department: string;
  memberType: "current" | "past" | "advisor";
  email?: string;
  linkedin?: string;
  github?: string;
  image?: any;
  bio?: string;
  achievements?: string[];
  order?: number;
  year?: string;
  currentRole?: string;
  tenure?: string;
}

export function Team() {
  const [activeTab, setActiveTab] = useState("current");
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [teamData, setTeamData] = useState<{
    current: SanityTeamMember[];
    past: SanityTeamMember[];
    advisors: SanityTeamMember[];
  }>({
    current: [],
    past: [],
    advisors: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamData() {
      try {
        const [currentTeam, pastTeam, advisors] = await Promise.all([
          client.fetch(queries.getCurrentTeam),
          client.fetch(queries.getPastTeam),
          client.fetch(queries.getAdvisors),
        ]);

        setTeamData({
          current: currentTeam || [],
          past: pastTeam || [],
          advisors: advisors || [],
        });
      } catch (error) {
        console.error("Error fetching team data:", error);
        // Fallback to empty arrays if fetch fails
        setTeamData({
          current: [],
          past: [],
          advisors: [],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchTeamData();
  }, []);

  const getImageUrl = (image: any) => {
    if (!image) return "/team/default-avatar.jpg";
    try {
      return urlFor(image).width(300).height(300).url();
    } catch (error) {
      return "/team/default-avatar.jpg";
    }
  };

  const tabs = [
    { id: "current", name: "Current Team", count: teamData.current.length },
    { id: "past", name: "Alumni", count: teamData.past.length },
    {
      id: "advisors",
      name: "Faculty Advisors",
      count: teamData.advisors.length,
    },
  ];

  const getActiveTeam = (): SanityTeamMember[] => {
    switch (activeTab) {
      case "current":
        return teamData.current;
      case "past":
        return teamData.past;
      case "advisors":
        return teamData.advisors;
      default:
        return teamData.current;
    }
  };

  if (loading) {
    return (
      <section id="team" className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-96 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6">
                  <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-32 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-24 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-20 px-4 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/20 rounded-full px-6 py-2 mb-8">
            <Users className="h-5 w-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Our Team</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Meet The Team
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Passionate individuals driving entrepreneurship and innovation at
            FCRIT. Our diverse team brings together creativity, technical
            expertise, and leadership.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {getActiveTeam().map((member) => (
            <div
              key={member._id}
              className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Profile Image */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image
                  src={getImageUrl(member.image)}
                  alt={member.name}
                  fill
                  className="rounded-full object-cover border-2 border-purple-500/50"
                />
              </div>

              {/* Member Info */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-purple-400 font-medium mb-2">
                  {member.position}
                </p>
                <p className="text-gray-400 text-sm mb-2">
                  {member.department}
                </p>
                {member.year && (
                  <p className="text-gray-500 text-sm mb-4">{member.year}</p>
                )}
                {member.currentRole && (
                  <p className="text-blue-400 text-sm mb-4">
                    Now: {member.currentRole}
                  </p>
                )}
                {member.tenure && (
                  <p className="text-gray-500 text-sm mb-4">
                    Tenure: {member.tenure}
                  </p>
                )}

                {/* Bio */}
                {member.bio && (
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>
                    {member.bio.length > 100 && (
                      <button
                        onClick={() =>
                          setExpandedMember(
                            expandedMember === member._id ? null : member._id
                          )
                        }
                        className="text-purple-400 hover:text-purple-300 text-sm mt-2 flex items-center gap-1 mx-auto transition-colors"
                      >
                        {expandedMember === member._id
                          ? "Show Less"
                          : "Read More"}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            expandedMember === member._id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>
                )}

                {/* Achievements */}
                {member.achievements && member.achievements.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Award className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">
                        Achievements
                      </span>
                    </div>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {member.achievements
                        .slice(0, 3)
                        .map((achievement, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-purple-400 mt-1">•</span>
                            {achievement}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <CircleUserRound className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getActiveTeam().length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                No team members found
              </h3>
              <p>
                Add team members through the Sanity Studio to see them here.
              </p>
            </div>
            <a
              href="/studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Open Sanity Studio
            </a>
          </div>
        )}

        {/* Join Team CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to Join Our Team?
            </h3>
            <p className="text-gray-300 mb-6">
              We're always looking for passionate individuals who want to make a
              difference in the entrepreneurship ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-8 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                Apply Now
              </button>
              <button className="border border-purple-500 text-purple-400 font-medium py-3 px-8 rounded-lg hover:bg-purple-500/20 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
