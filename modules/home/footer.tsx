import { Github as LucideGithub } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const socialLinks = [
    {
      href: "#",
      icon: (
        <LucideGithub className="w-5 h-5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-500" />
      ),
    },
  ];
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:justify-between">
        <div className="flex gap-4">
          {socialLinks.map((link, index) => (
            <Link
              href={link.href || "#"}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-500"
            >
              {link.icon}
            </Link>
          ))}
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
