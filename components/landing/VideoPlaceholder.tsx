import { Video } from "lucide-react";

interface VideoPlaceholderProps {
  title?: string;
  aspectRatio?: string;
}

export function VideoPlaceholder({ title = "Video Placeholder", aspectRatio = "aspect-video" }: VideoPlaceholderProps) {
  return (
    <div className={`w-full ${aspectRatio} bg-muted flex flex-col items-center justify-center rounded-xl overflow-hidden`}>
      <Video className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
      <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm text-center px-4">
        {title}
      </p>
    </div>
  );
}
