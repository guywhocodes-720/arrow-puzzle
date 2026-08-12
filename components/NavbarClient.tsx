"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarClientProps {
  username: string | null;
  isLoggedIn: boolean;
}

export function NavbarClient({ username, isLoggedIn }: NavbarClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav className={`w-full flex justify-center py-6 sm:py-8 px-6 sm:px-12 bg-transparent z-50 relative ${pathname === "/" ? "hidden" : ""}`}>
      <div className="w-full max-w-6xl flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-bold tracking-widest text-foreground hover:opacity-70 transition-opacity uppercase"
          onClick={() => setMenuOpen(false)}
        >
          <img src="/android/launchericon-192x192.png" alt="Icon" className="w-8 h-8" />
          Arrow Escape
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-8">
          <Link href="/play" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
            Play
          </Link>
          <Link href="/leaderboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
            Leaderboard
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
                Dashboard
              </Link>
              <Link href="/profile" className="text-xs font-semibold text-primary uppercase tracking-widest hover:brightness-110 transition-all">
                Profile
              </Link>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile: hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-foreground hover:bg-muted/60 transition-colors"
          >
            {/* Animated burger icon */}
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <line
                x1="2" y1={menuOpen ? "11" : "5"} x2="20" y2={menuOpen ? "11" : "5"}
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                style={{ transformOrigin: "center", transform: menuOpen ? "rotate(45deg)" : "none", transition: "all 0.25s ease" }}
              />
              <line
                x1="2" y1="11" x2="20" y2="11"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                style={{ opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s ease" }}
              />
              <line
                x1="2" y1={menuOpen ? "11" : "17"} x2="20" y2={menuOpen ? "11" : "17"}
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                style={{ transformOrigin: "center", transform: menuOpen ? "rotate(-45deg)" : "none", transition: "all 0.25s ease" }}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
          aria-hidden="true"
        />
      )}
      <div
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full w-72 z-50 sm:hidden
          bg-background border-l border-border shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
        aria-label="Mobile navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <span className="text-base font-bold tracking-widest uppercase text-foreground">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 flex flex-col px-4 py-6 gap-1 overflow-y-auto">
          {[
            { href: "/play", label: "Play" },
            { href: "/leaderboard", label: "Leaderboard" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all uppercase tracking-widest"
            >
              {label}
            </Link>
          ))}

          {/* Divider */}
          <div className="my-3 border-t border-border" />

          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all uppercase tracking-widest"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary hover:brightness-110 hover:bg-primary/10 transition-all uppercase tracking-widest"
              >
                Profile
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all uppercase tracking-widest"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Drawer footer */}
        <div className="px-6 py-4 border-t border-border text-xs text-muted-foreground tracking-widest uppercase text-center">
          Arrow Escape
        </div>
      </div>
    </nav>
  );
}
