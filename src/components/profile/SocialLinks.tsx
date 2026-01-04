"use client";

import { Github, Twitter, Linkedin, Globe } from "lucide-react";
import { IProfile } from "@/core/types/index.types";

export default function SocialLinks({ profile }: { profile: IProfile }) {
  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: profile.urlGithub,
      color: "gray",
      username: profile.urlGithub
    },
    {
      name: "Twitter", 
      icon: Twitter,
      url: profile.urlTwitter,
      color: "blue",
      username: profile.urlTwitter
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: profile.urlLinkedIn,
      color: "blue",
      username: profile.urlLinkedIn
    },
    {
      name: "Website",
      icon: Globe,
      url: profile.urlWebsite,
      color: "indigo",
      username: profile.urlWebsite
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          link.url?.match(/^https?:\/\//) && <a
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
