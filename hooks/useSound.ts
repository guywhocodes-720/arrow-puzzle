'use client';

import { useCallback, useRef } from 'react';
import { useAudioContext } from '@/components/AudioProvider';

export const useSound = () => {
    const { isMuted, volumeMultiplier } = useAudioContext();
    const audioCtxRef = useRef<AudioContext | null>(null);

    const initAudio = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    }, []);

    const playTone = useCallback(
        (frequency: number, type: OscillatorType, duration: number, vol = 0.1) => {
            if (isMuted || volumeMultiplier === 0) return;
            if (!audioCtxRef.current) return;
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, ctx.currentTime);

            gain.gain.setValueAtTime(vol * volumeMultiplier, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        },
        []
    );

    const playTap = useCallback(() => {
        initAudio();
        // A sharp buzzer sound for wrong clicks (errors)
        playTone(250, 'sawtooth', 0.15, 0.2);
    }, [initAudio, playTone]);

    const playSlide = useCallback(() => {
        if (isMuted || volumeMultiplier === 0) return;
        initAudio();
        // A smooth "swoosh" for successful arrow clearing
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.35 * volumeMultiplier, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }, [initAudio]);

    const playWin = useCallback(() => {
        if (isMuted || volumeMultiplier === 0) return;
        initAudio();
        // A happy arpeggio for clearing the board
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const time = ctx.currentTime;

        [440, 554, 659, 880].forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0.25 * volumeMultiplier, time + index * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, time + index * 0.1 + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(time + index * 0.1);
            osc.stop(time + index * 0.1 + 0.3);
        });
    }, [initAudio]);

    return { playTap, playSlide, playWin };
};
