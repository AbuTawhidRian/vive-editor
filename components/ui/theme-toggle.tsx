"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <button
      type="button"
      onClick={() =>
        setTheme(resolvedTheme === "light" ? "dark" : "light")
      }
      className="cursor-pointer p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resolvedTheme}
          initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
          transition={{ duration: 0.25 }}
        >
          {resolvedTheme === "light" ? (
            <Moon className="h-5 w-5 text-black" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-400" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
