import { Target, Search, CheckCircle2 } from "lucide-react";

export function MechanicsSection() {
  const steps = [
    {
      title: "Analyze the Grid",
      description: "You start with a full grid of arrows. Look for arrows that have a clear path to slide off the board in the direction they point.",
      icon: <Search className="w-10 h-10 text-primary" />,
    },
    {
      title: "Clear Unblocked Paths",
      description: "Click an unblocked arrow. It will slide off the screen. If it hits another arrow, it's an invalid move.",
      icon: <Target className="w-10 h-10 text-primary" />,
    },
    {
      title: "Empty the Board",
      description: "Carefully dismantle the grid piece by piece. Clear all arrows to complete the level and progress.",
      icon: <CheckCircle2 className="w-10 h-10 text-primary" />,
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-32">
      <div className="text-center mb-20">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-widest uppercase mb-6 text-foreground">
          How to Play
        </h2>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          Dismantle the grid one arrow at a time.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {steps.map((step, i) => (
          <div key={step.title} className="flex flex-col items-center text-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/30">
               {step.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-wider mb-4 text-foreground">
                <span className="text-primary mr-2">0{i + 1}.</span> {step.title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
