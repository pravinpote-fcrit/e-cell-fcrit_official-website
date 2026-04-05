"use client";

import {
  Mail,
  Phone,
  MapPin,
  Users,
  MessageCircle,
  Heart,
  CircleUserRound,
  Play,
  ExternalLink,
  ArrowUp,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Events", href: "#events" },
    { name: "Team", href: "#team" },
    { name: "Contact", href: "#contact" },
  ];

  const programs = [
    { name: "Startup Incubation", href: "#" },
    { name: "Mentorship Program", href: "#" },
    { name: "Workshops", href: "#" },
    { name: "Networking Events", href: "#" },
  ];

  const resources = [
    { name: "Posts", href: "/posts" },
    { name: "Success Stories", href: "#" },
    { name: "Downloads", href: "#" },
    { name: "FAQ", href: "#" },
  ];

  const socialLinks = [
    // {
    //   name: "Facebook",
    //   icon: Facebook,
    //   href: "#",
    //   color: "hover:text-blue-400",
    // },
    // { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-400" },
    {
      name: "Instagram",
      icon: Heart,
      href: "https://instagram.com/ecellfcrit/",
      color: "hover:text-pink-400",
    },
    {
      name: "LinkedIn",
      icon: CircleUserRound,
      href: "https://www.linkedin.com/company/fcrit-entrepreneurship-cell/",
      color: "hover:text-blue-300",
    },
    // { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-400" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="/ecell-logo-removebg-preview.png"
                  alt="ecell logo"
                  className="w-20 h-20"
                />
                {/* <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div> */}
                <div>
                  <div className="text-white font-bold text-xl">
                    E-CELL FCRIT
                  </div>
                  <div className="text-purple-400 text-sm">Est. 2019</div>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                A non-profit student organization that promotes entrepreneurship
                by offering mentorship from experienced professionals and a
                platform to present ideas to investors and industry leaders. It
                unites students, entrepreneurs, and professionals through events
                like Guest Lectures, Workshops, Panel Discussions, Product Expo,
                and the Connect the Dots conference.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Mail className="w-4 h-4 mr-3 text-purple-400" />
                  <a
                    href="mailto:ecellfcrit2425@gmail.com"
                    className="hover:text-purple-300 transition-colors duration-300"
                  >
                    ecellfcrit2425@gmail.com
                  </a>
                </div>
                {/* <div className="flex items-center text-gray-300">
                  <Phone className="w-4 h-4 mr-3 text-purple-400" />
                  <a
                    href="tel:+919876543210"
                    className="hover:text-purple-300 transition-colors duration-300"
                  >
                    +91 98765 43210
                  </a>
                </div> */}
                <div className="flex items-start text-gray-300">
                  <MapPin className="w-4 h-4 mr-3 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <div>FCRIT, Sector 9A, Vashi</div>
                    <div>Navi Mumbai, Maharashtra 400703</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-purple-300 transition-colors duration-300 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">
                Programs
              </h3>
              <ul className="space-y-3">
                {programs.map((program) => (
                  <li key={program.name}>
                    <Link
                      href={program.href}
                      className="text-gray-300 hover:text-purple-300 transition-colors duration-300 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {program.name}
                      </span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Newsletter */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">
                Resources
              </h3>
              <ul className="space-y-3 mb-8">
                {resources.map((resource) => (
                  <li key={resource.name}>
                    <Link
                      href={resource.href}
                      className="text-gray-300 hover:text-purple-300 transition-colors duration-300 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {resource.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Newsletter Signup */}
              {/* <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                <h4 className="text-white font-semibold mb-3">Stay Updated</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Get the latest updates on events and opportunities
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-500 transition-colors duration-300"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 ${social.color} transition-all duration-300 transform hover:scale-110`}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-300 hover:text-purple-300 transition-colors duration-300 group"
            >
              <span className="text-sm">Back to top</span>
              <ArrowUp className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} E-Cell FCRIT. All rights reserved. | Established
              2019
            </div>

            <div className="flex space-x-6 text-sm">
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
              >
                Code of Conduct
              </Link>
            </div>
          </div>
        </div>

        {/* FCRIT Credit */}
        <div className="py-4 text-center border-t border-gray-800">
          <p className="text-gray-500 text-xs">
            Part of{" "}
            <a
              href="https://fcrit.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300 font-medium"
            >
              Fr. Conceicao Rodrigues Institute of Technology
            </a>{" "}
            • Vashi, Navi Mumbai
          </p>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-3xl"></div>
      </div>
    </footer>
  );
}
