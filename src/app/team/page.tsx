"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { Mail, CircleUserRound, GitBranch, Trophy, Users, Star } from "lucide-react";
import Link from "next/link";
import { client, queries } from "@/sanity/lib/client";
import { TeamMember as SanityTeamMember } from "@/types";

// Hardcoded metadata since we can't export it from client component
// export const metadata: Metadata = {
//   title: "Team | E-Cell FCRIT",
//   description:
//     "Meet the passionate team of E-Cell FCRIT driving entrepreneurship and innovation in our college community.",
//   keywords:
//     "E-Cell team, FCRIT team, entrepreneurship team, student leadership, core committee",
// };

export default function TeamPage() {
  const [currentTeam, setCurrentTeam] = useState<SanityTeamMember[]>([]);
  const [advisors, setAdvisors] = useState<SanityTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const [currentTeamData, advisorsData] = await Promise.all([
          client.fetch(queries.getCurrentTeam),
          client.fetch(queries.getAdvisors),
        ]);
        setCurrentTeam(currentTeamData);
        setAdvisors(advisorsData);
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/20 rounded-full px-6 py-2 mb-8">
            <Users className="h-5 w-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Our Team</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Meet Our Team
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Passionate students driving entrepreneurship and innovation. Our
            diverse team brings together creativity, technical expertise, and
            leadership to foster the startup ecosystem at FCRIT.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {loading ? "..." : `${currentTeam.length}+`}
              </div>
              <div className="text-gray-300">Current Members</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-300">Alumni</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6">
              <div className="text-3xl font-bold text-pink-400 mb-2">5</div>
              <div className="text-gray-300">Departments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Faculty Advisors
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800/50 rounded-xl p-6 animate-pulse"
                >
                  <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-4"></div>
                  <div className="h-20 bg-gray-700 rounded"></div>
                </div>
              ))
            ) : advisors.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">
                  No faculty advisors found.
                </p>
              </div>
            ) : (
              advisors.map((advisor) => (
                <div
                  key={advisor._id}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    {advisor.image && advisor.image.asset ? (
                      <Image
                        src={advisor.image.asset.url}
                        alt={advisor.image.alt || advisor.name}
                        fill
                        className="rounded-full object-cover border-2 border-yellow-500/50"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {advisor.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                      {advisor.name}
                    </h3>
                    <p className="text-yellow-400 font-medium mb-2">
                      {advisor.position}
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      {advisor.department}
                    </p>

                    {advisor.bio && (
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {advisor.bio}
                      </p>
                    )}

                    <div className="flex justify-center gap-3">
                      {advisor.email && (
                        <a
                          href={`mailto:${advisor.email}`}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                      )}
                      {advisor.linkedin && (
                        <a
                          href={advisor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-400 hover:text-blue-400 transition-colors"
                        >
                          <CircleUserRound className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Current Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Current Core Committee
            </span>
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800/50 rounded-xl p-6 animate-pulse"
                >
                  <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-4"></div>
                  <div className="h-20 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : currentTeam.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No current team members found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentTeam.map((member) => (
                <div
                  key={member._id}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    {member.image && member.image.asset ? (
                      <Image
                        src={member.image.asset.url}
                        alt={member.image.alt || member.name}
                        fill
                        className="rounded-full object-cover border-2 border-purple-500/50"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white fill-current" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-purple-400 font-medium mb-2">
                      {member.position}
                    </p>
                    {member.department && (
                      <p className="text-gray-400 text-sm mb-4">
                        {member.department}
                      </p>
                    )}

                    {member.bio && (
                      <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                        {member.bio}
                      </p>
                    )}

                    {member.achievements && member.achievements.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Trophy className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium text-yellow-400">
                            Key Achievements
                          </span>
                        </div>
                        <ul className="text-xs text-gray-400 space-y-1">
                          {member.achievements
                            .slice(0, 2)
                            .map((achievement: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-start gap-1"
                              >
                                <span className="text-purple-400 mt-1">•</span>
                                {achievement}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

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
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          <GitBranch className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Team Section */}
      {/* <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
              Alumni & Past Members
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pastTeam.map((member) => (
              <div
                key={member.id}
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-500/50 transition-all duration-300"
              >
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover border-2 border-gray-500/50"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-gray-300 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-gray-400 font-medium mb-2">
                    {member.position}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">{member.tenure}</p>

                  {member.currentRole && (
                    <p className="text-blue-400 text-sm font-medium mb-3">
                      Now: {member.currentRole}
                    </p>
                  )}

                  <div className="flex justify-center gap-3">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-gray-400 hover:text-gray-300 transition-colors"
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
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Selection Process */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Join Our Team
            </span>
          </h2>

          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Selection Process
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Application
                </h4>
                <p className="text-gray-300 text-sm">Submit your application</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Interview
                </h4>
                <p className="text-gray-300 text-sm">
                  Face-to-face interview to assess skills and passion
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Selection
                </h4>
                <p className="text-gray-300 text-sm">
                  Final selection and onboarding process
                </p>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-4">
                Requirements:
              </h4>
              <ul className="text-gray-300 space-y-2 mb-6 text-left mx-auto w-fit">
                <li>• Passion for entrepreneurship and innovation</li>
                <li>• Strong communication and leadership skills</li>
                <li>• Commitment to contribute to E-Cell activities</li>
                <li>• Academic performance</li>
              </ul>

              <Link href="/#contact">
                <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium py-3 px-8 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300">
                  Apply Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
