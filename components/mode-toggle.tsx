"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Prevent SSR hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-input bg-muted animate-pulse" />
    );
  }

  return (
    <div className="relative inline-block text-left z-50" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-background border border-input text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer active:scale-95 focus:outline-none focus:ring-1 focus:ring-ring"
        aria-label="Toggle theme"
        title="Toggle Theme"
      >
        {/* Sun Icon (Light Mode) */}
        <svg
          className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>

        {/* Moon Icon (Dark Mode) */}
        <svg
          className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-lg bg-popover border border-border shadow-xl py-1 z-50">
          <button
            type="button"
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
              theme === "light"
                ? "bg-accent text-accent-foreground font-bold"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
              theme === "dark"
                ? "bg-accent text-accent-foreground font-bold"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
              theme === "system"
                ? "bg-accent text-accent-foreground font-bold"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
}
