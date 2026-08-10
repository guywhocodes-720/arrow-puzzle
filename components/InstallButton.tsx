"use client";

import { useState, useEffect } from "react";
import { Download, Share2, MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);

      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));

      if ((window as any).deferredPrompt) {
        setDeferredPrompt((window as any).deferredPrompt);
      }
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPrompt = e;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      setIsDialogOpen(true);
    }
  };

  if (isStandalone) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase hover:brightness-110 rounded-xl border-b-[4px] border-primary/50 active:translate-y-[2px] active:border-b-[2px] duration-75 text-center"
      >
        <Download className="w-5 h-5" />
        Install App
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-xl font-bold tracking-widest uppercase text-foreground">
              How to Install Arrow Escape
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mt-2">
              {isIOS ? (
                <span className="flex flex-col items-center gap-3 pt-2">
                  <span>1. Tap the <Share2 className="w-4 h-4 inline text-primary mx-1" /> <strong>Share</strong> button in Safari.</span>
                  <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </span>
              ) : (
                <span className="flex flex-col items-center gap-3 pt-2">
                  <span>1. Tap the <MoreVertical className="w-4 h-4 inline text-primary mx-1" /> <strong>Menu</strong> (three dots) in your browser.</span>
                  <span>2. Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
