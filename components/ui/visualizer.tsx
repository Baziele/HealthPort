import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MicIcon, PhoneOff } from "lucide-react";

export default function Visualizer({
    volumeLevel,
    isSessionActive,
}: {
    volumeLevel: number;
    isSessionActive: boolean;
}) {
    const [bars, setBars] = useState(Array(50).fill(5)); // Initialize with low value for inactivity

    useEffect(() => {
        if (isSessionActive) {
            updateBars(volumeLevel);
        } else {
            resetBars();
        }
    }, [volumeLevel, isSessionActive]);

    const updateBars = (volume: number) => {
        setBars(bars.map(() => Math.random() * volume * 150));
    };

    const resetBars = () => {
        setBars(Array(50).fill(5)); // Reset to low value for inactivity
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 rounded">
            <AnimatePresence>
                {isSessionActive && (
                    <motion.div
                        className="flex items-center justify-center w-full h-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                    >
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 1000 200"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {bars.map((height, index) => (
                                <React.Fragment key={index}>
                                    <rect
                                        x={500 + index * 20 - 490}
                                        y={100 - height / 2}
                                        width="10"
                                        height={height}
                                        className={`fill-current ${
                                            isSessionActive
                                                ? "text-black dark:text-white opacity-70"
                                                : "text-gray-400 opacity-30"
                                        }`}
                                    />
                                    <rect
                                        x={500 - index * 20 - 10}
                                        y={100 - height / 2}
                                        width="10"
                                        height={height}
                                        className={`fill-current ${
                                            isSessionActive
                                                ? "text-black dark:text-white opacity-70"
                                                : "text-gray-400 opacity-30"
                                        }`}
                                    />
                                </React.Fragment>
                            ))}
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
