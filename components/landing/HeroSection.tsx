import Link from "next/link";
import { AnimatedHeroBoard } from "./AnimatedHeroBoard";

interface HeroSectionProps {
  ctaText: string;
}

export function HeroSection({ ctaText }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-16 pb-16 px-6 overflow-hidden">
      
      {/* Full Screen Background Animation */}
      <AnimatedHeroBoard />

      {/* Blurred Overlay to make text readable */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
         <div className="w-full max-w-[1000px] h-[600px] bg-background/90 blur-[120px] rounded-[100%]" />
      </div>

      {/* Centered Content */}
      <div className="relative z-20 flex flex-col items-center text-center">
        <h1 className="text-7xl sm:text-9xl lg:text-[11rem] font-black tracking-tighter text-foreground uppercase leading-[0.8] mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          Arrow<br />Escape
        </h1>
        <p className="text-foreground/70 text-lg sm:text-xl font-semibold tracking-[0.2em] max-w-2xl mb-12 uppercase">
          Master the grid. No guessing. Just pure logic.
        </p>
        <Link
          href="/play"
          className="px-16 py-6 bg-primary text-primary-foreground font-bold text-xl tracking-[0.15em] uppercase rounded-full hover:brightness-110 active:scale-95 transition-all text-center shadow-[0_0_40px_rgba(var(--primary),0.3)] hover:shadow-[0_0_60px_rgba(var(--primary),0.5)] w-full sm:w-auto"
        >
          {ctaText}
        </Link>
      </div>

    </section>
  );
}
