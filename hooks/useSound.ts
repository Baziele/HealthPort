// hooks/useSound.ts
import { useCallback, useEffect, useRef, useState } from "react";

export const useSound = (src: string, volume = 1) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const audio = new Audio(src);
            audio.volume = volume;
            audioRef.current = audio;
            setIsReady(true);
        }
    }, [src, volume]);

    const play = useCallback(() => {
        if (audioRef.current && isReady) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((err) => {
                // Optional: handle play error (e.g., user hasn't interacted with page yet)
                console.warn("Sound playback failed:", err);
            });
        }
    }, [isReady]);

    return play;
};
