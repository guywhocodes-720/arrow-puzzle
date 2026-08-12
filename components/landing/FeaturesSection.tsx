export function FeaturesSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-32 px-6 gap-24 sm:gap-40 overflow-hidden">
      
      {/* Feature 1 */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 max-w-2xl text-left">
          <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter uppercase text-foreground mb-6 leading-[0.9]">
            Infinite<br />Puzzles
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed font-medium">
            Procedurally generated grids mean you never play the same puzzle twice. Every level is a unique challenge.
          </p>
        </div>
        <div className="text-[10rem] sm:text-[16rem] font-black text-foreground/20 leading-none select-none">
          01
        </div>
      </div>

      {/* Feature 2 */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row-reverse items-center justify-between gap-12">
        <div className="flex-1 max-w-2xl text-left lg:text-right">
          <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter uppercase text-foreground mb-6 leading-[0.9]">
            Pure<br />Logic
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed font-medium">
            No timers. No guessing. No stress. Just you, the grid, and pure directional deduction.
          </p>
        </div>
        <div className="text-[10rem] sm:text-[16rem] font-black text-foreground/20 leading-none select-none">
          02
        </div>
      </div>

      {/* Feature 3 */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 max-w-2xl text-left">
          <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter uppercase text-foreground mb-6 leading-[0.9]">
            Instant<br />Play
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed font-medium">
            No downloads, no installations, no forced sign-ups. Click and play immediately from your browser.
          </p>
        </div>
        <div className="text-[10rem] sm:text-[16rem] font-black text-foreground/20 leading-none select-none">
          03
        </div>
      </div>

    </section>
  );
}
