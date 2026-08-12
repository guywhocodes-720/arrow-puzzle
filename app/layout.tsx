import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

import Script from "next/script";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arrow Escape | Directional Logic Puzzle",
  description: "A minimalist directional logic puzzle game built with Next.js",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Arrow Escape",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <Script
          id="pwa-event-listener"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredPrompt = e;
              });
            `,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Navbar />
          <div className="flex-1 flex flex-col w-full">
            {children}
          </div>
          {/* Footer */}
          <footer className="w-full py-12 border-t border-border/40 mt-auto">
            <div className="max-w-6xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-muted-foreground gap-4">
              <div className="flex items-center gap-3 font-bold tracking-widest uppercase text-sm">
                <img src="/android/launchericon-192x192.png" alt="Icon" className="w-6 h-6 rounded-md opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
                <span>Arrow Escape</span>
              </div>
              <p className="text-xs tracking-widest uppercase font-semibold">
                &copy; {new Date().getFullYear()} Play Pure Logic.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
