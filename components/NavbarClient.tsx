"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightLeft, Menu, X } from "lucide-react";
import { useSync } from "@/hooks/useSync";
import { createClient } from "@/utils/supabase/client";

export function NavbarClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  useSync();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        setUsername(session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        setUsername(session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || null);
      } else {
        setUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    <div className={`w-full flex justify-center px-4 pt-4 sm:px-8 sm:pt-6 z-50 relative ${pathname === "/" ? "hidden" : ""}`}>
      <nav className="w-full max-w-6xl flex items-center justify-between bg-[#11171d] border border-border/20 rounded-[28px] px-4 py-3 sm:px-6 shadow-2xl">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 sm:gap-4 group"
          onClick={() => setMenuOpen(false)}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#090b10] rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
            <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-[0.15em] sm:tracking-[0.2em] text-foreground group-hover:opacity-80 transition-opacity uppercase">
            Arrow Escape
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <Link
            href="/play"
            className={`text-sm font-medium transition-all ${pathname === "/play" ? "text-primary drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]" : "text-muted-foreground hover:text-foreground"}`}
          >
            Play
          </Link>

          <Link
            href="/leaderboard"
            className={`text-sm font-medium transition-all ${pathname === "/leaderboard" ? "text-primary drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]" : "text-muted-foreground hover:text-foreground"}`}
          >
            Leaderboard
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-all ${pathname === "/dashboard" ? "text-primary drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]" : "text-muted-foreground hover:text-foreground"}`}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className={`text-sm font-medium transition-all ${pathname === "/profile" ? "text-primary drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]" : "text-muted-foreground hover:text-foreground"}`}
              >
                Profile
              </Link>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium transition-all text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" aria-hidden="true" />
      )}

      {/* Mobile Drawer */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-[#0e141b] border-l border-border/20 shadow-2xl z-50 lg:hidden flex flex-col transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <span className="font-bold tracking-[0.15em] uppercase text-sm">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <Link
            href="/play"
            onClick={() => setMenuOpen(false)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === "/play" ? "bg-primary/10 text-primary drop-shadow-[0_0_4px_rgba(20,184,166,0.5)]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
          >
            Play
          </Link>
          <Link
            href="/leaderboard"
            onClick={() => setMenuOpen(false)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === "/leaderboard" ? "bg-primary/10 text-primary drop-shadow-[0_0_4px_rgba(20,184,166,0.5)]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
          >
            Leaderboard
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === "/dashboard" ? "bg-primary/10 text-primary drop-shadow-[0_0_4px_rgba(20,184,166,0.5)]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === "/profile" ? "bg-primary/10 text-primary drop-shadow-[0_0_4px_rgba(20,184,166,0.5)]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
              >
                Profile
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium transition-all text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
