"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { updateAudioSettings } from "@/app/profile/action";

type AudioContextType = {
  isMuted: boolean;
  volumeMultiplier: number;
  setAudioSettings: (muted: boolean, volume: number) => void;
};

const AudioContext = createContext<AudioContextType>({
  isMuted: false,
  volumeMultiplier: 1.0,
  setAudioSettings: () => {},
});

export function AudioProvider({
  children,
  initialMuted,
  initialVolume,
}: {
  children: ReactNode;
  initialMuted: boolean;
  initialVolume: number;
}) {
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [volumeMultiplier, setVolumeMultiplier] = useState(initialVolume);

  const setAudioSettings = (muted: boolean, volume: number) => {
    setIsMuted(muted);
    setVolumeMultiplier(volume);
    updateAudioSettings(muted, volume);
  };

  return (
    <AudioContext.Provider value={{ isMuted, volumeMultiplier, setAudioSettings }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudioContext = () => useContext(AudioContext);
