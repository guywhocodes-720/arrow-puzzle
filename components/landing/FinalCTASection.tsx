import Link from "next/link";

interface FinalCTASectionProps {
  ctaText: string;
}

export function FinalCTASection({ ctaText }: FinalCTASectionProps) {
  return (
    <section className="relative w-full py-40 flex flex-col items-center text-center overflow-hidden border-t border-border/30 bg-muted/5 mt-16">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl px-6">
        <h2 className="text-6xl sm:text-8xl lg:text-[9rem] font-black tracking-tighter uppercase text-foreground mb-8 leading-[0.8] drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          Ready to<br />Escape?
        </h2>
        <p className="text-foreground/70 text-lg sm:text-xl font-semibold tracking-[0.2em] max-w-2xl mx-auto mb-16 uppercase">
          Enter the grid. No sign-up required.
        </p>
        <Link
          href="/play"
          className="inline-block px-16 py-6 bg-primary text-primary-foreground font-bold text-xl tracking-[0.15em] uppercase rounded-full hover:brightness-110 active:scale-95 transition-all text-center shadow-[0_0_40px_rgba(var(--primary),0.3)] hover:shadow-[0_0_60px_rgba(var(--primary),0.5)] w-full sm:w-auto"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
