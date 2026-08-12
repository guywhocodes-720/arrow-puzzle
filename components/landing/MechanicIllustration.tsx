import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, MousePointer2 } from "lucide-react";

interface MechanicIllustrationProps {
  type: "analyze" | "clear" | "empty";
}

export function MechanicIllustration({ type }: MechanicIllustrationProps) {
  return (
    <div className="w-full aspect-video sm:aspect-square bg-transparent flex items-center justify-center rounded-xl p-4 sm:p-6 relative overflow-hidden ring-1 ring-border shadow-inner">
      {type === "analyze" && (
        <div className="grid grid-cols-5 gap-3 w-full max-w-[240px] relative">
          {Array.from({ length: 25 }).map((_, i) => {
             // Highlight a specific row indicating an unblocked arrow
             const isTarget = i === 12; // Center
             const isBlocked = i === 13 || i === 14; // Arrows in front of it
             
             if (isTarget) {
                 return (
                     <div key={i} className="flex items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)] relative z-10">
                         <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={3} />
                     </div>
                 );
             }
             if (isBlocked) {
                 return (
                     <div key={i} className="flex items-center justify-center text-muted-foreground opacity-20">
                         <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={3} />
                     </div>
                 );
             }
             return (
                 <div key={i} className="flex items-center justify-center text-muted-foreground opacity-50">
                     <ArrowUp className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={3} />
                 </div>
             );
          })}
        </div>
      )}

      {type === "clear" && (
        <div className="relative w-full max-w-[240px] grid grid-cols-5 gap-3">
          {Array.from({ length: 25 }).map((_, i) => {
             const isMoving = i === 12;
             
             if (isMoving) {
                 return (
                     <div key={i} className="flex items-center justify-center relative">
                         <div className="animate-slide-up duration-[1500ms] text-primary">
                             <ArrowUp className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={3} />
                         </div>
                         <MousePointer2 className="absolute top-1/2 left-1/2 w-5 h-5 text-foreground translate-x-2 translate-y-2 z-20" />
                     </div>
                 );
             }
             return (
                 <div key={i} className="flex items-center justify-center text-muted-foreground opacity-40">
                     <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={3} />
                 </div>
             );
          })}
        </div>
      )}

      {type === "empty" && (
        <div className="grid grid-cols-5 gap-3 w-full max-w-[240px] relative">
          {Array.from({ length: 25 }).map((_, i) => {
             // Only 2 arrows left
             const isLeft = i === 10 || i === 24;
             
             if (isLeft) {
                 return (
                     <div key={i} className="flex items-center justify-center text-foreground">
                         <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={3} />
                     </div>
                 );
             }
             return (
                 <div key={i} className="flex items-center justify-center opacity-0">
                     <ArrowUp className="w-6 h-6 sm:w-8 sm:h-8" />
                 </div>
             );
          })}
        </div>
      )}
    </div>
  );
}
