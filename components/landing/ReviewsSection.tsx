export function ReviewsSection() {
  const row1 = [
    "this game is actually so good",
    "i couldn't stop playing",
    "finally a puzzle without annoying timers",
    "perfect for playing while listening to podcasts",
    "super satisfying when the board clears",
    "i got stuck on level 12 but it was my own fault",
    "the aesthetic is really clean",
    "no ads, no bs. just logic.",
    "brain hurts but in a good way",
    "i love the animations"
  ];

  const row2 = [
    "reminds me of the old flash games but better",
    "my commute feels way shorter now",
    "smooth as butter",
    "played it for 3 hours straight",
    "harder than it looks!",
    "it just clicks once you get it",
    "the dark mode is everything",
    "pure dopamine when you finish a hard level",
    "my new favorite coffee break game",
    "simple concept, executed perfectly"
  ];

  const row3 = [
    "best puzzle game of the year",
    "the mechanics are genius",
    "i love how there is no tutorial",
    "it makes you feel smart",
    "perfectly balanced difficulty",
    "i can't believe it's free",
    "the ui is gorgeous",
    "so simple yet so deep",
    "i play this every morning",
    "10/10 would erase my memory to play again"
  ];

  const renderCard = (text: string, i: number) => (
    <div key={i} className="flex-shrink-0 flex items-center justify-center px-8 py-5 mx-3 bg-card/60 backdrop-blur-xl border border-border/60 rounded-2xl hover:border-primary/40 transition-colors shadow-sm cursor-default">
      <span className="text-foreground/90 font-medium text-lg tracking-wide">
        "{text}"
      </span>
    </div>
  );

  return (
    <section className="w-full py-32 flex flex-col items-start overflow-hidden">
      
      {/* Title block */}
      <div className="w-full px-6 sm:px-12 mb-16 text-center flex flex-col items-center">
        <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter uppercase text-foreground leading-[0.9] mb-6">
          What Players Say
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base tracking-[0.2em] uppercase font-bold">
          Across Different Platforms
        </p>
      </div>

      {/* Denser grid, left aligned text in cards */}
      <div className="w-full flex flex-col gap-6 [mask-image:_linear-gradient(to_right,transparent_0,_black_15%,_black_85%,transparent_100%)]">
        
        {/* Row 1 (Moving Left) */}
        <div className="w-full flex overflow-hidden">
          <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused]">
            {[...row1, ...row1].map(renderCard)}
          </div>
        </div>

        {/* Row 2 (Moving Right) */}
        <div className="w-full flex overflow-hidden">
          <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused]">
            {[...row2, ...row2].map(renderCard)}
          </div>
        </div>

        {/* Row 3 (Moving Left) */}
        <div className="w-full flex overflow-hidden">
          <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused]" style={{ animationDelay: '-15s' }}>
            {[...row3, ...row3].map(renderCard)}
          </div>
        </div>
      </div>

    </section>
  );
}
