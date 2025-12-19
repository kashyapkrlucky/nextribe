"use client";

import { Github, Twitter, Linkedin, Globe, Mail } from "lucide-react";

export default function SocialLinks() {
  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/kashyapkrlucky",
      color: "gray",
      username: "@kashyapkrlucky"
    },
    {
      name: "Twitter", 
      icon: Twitter,
      url: "https://twitter.com/kashyapkrlucky",
      color: "blue",
      username: "@kashyapkrlucky"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/kashyapkrlucky",
      color: "blue",
      username: "kashyap lucky"
    },
    {
      name: "Website",
      icon: Globe,
      url: "https://kashyap.dev",
      color: "indigo",
      username: "kashyap.dev"
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:kashyap@example.com",
      color: "green",
      username: "kashyap@example.com"
    }
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors group"
          >
            <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200" />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              {link.username}
            </span>
          </a>
        );
      })}
    </div>
  );
}
