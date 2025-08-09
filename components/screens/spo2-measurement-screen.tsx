"use client";
import { Howl } from "howler";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserData } from "@/app/page";
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    HeartPulseIcon,
    InfoIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import useSound from "use-sound";

interface SpO2MeasurementScreenProps {
    onNext: () => void;
    onBack: () => void;
    updateUserData: (data: Partial<UserData>) => void;
    userData: UserData;
}

export default function SpO2MeasurementScreen({
    onNext,
    onBack,
    updateUserData,
    userData,
}: SpO2MeasurementScreenProps) {
    const [stage, setStage] = useState<
        "instructions" | "measuring" | "complete" | "failed"
    >("instructions");
    const [measurementProgress, setMeasurementProgress] = useState(0);
    const [spO2, setSpO2] = useState(userData.biometrics.spO2 || 0);

    // Handle measurement progress
    useEffect(() => {
        if (stage === "measuring") {
            const interval = setInterval(() => {
                setMeasurementProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);

                        // 90% chance of successful measurement for demo purposes
                        const success = Math.random() > 0.3;

                        if (success) {
                            // Generate realistic SpO2 data (94-100%)
                            const spo2Value = Math.floor(
                                94 + Math.random() * 7
                            );
                            setSpO2(spo2Value);
                            setStage("complete");
                        } else {
                            setStage("failed");
                        }

                        return 100;
                    }
                    return prev + 2;
                });
            }, 200);

            return () => clearInterval(interval);
        }
    }, [stage]);

    const startMeasurement = () => {
        setStage("measuring");
        setMeasurementProgress(0);
    };

    const handleTryAgain = () => {
        setStage("instructions");
        setMeasurementProgress(0);
    };

    const handleContinue = () => {
        updateUserData({
            biometrics: {
                ...userData.biometrics,
                spO2,
            },
            healthMetrics: {
                ...userData.healthMetrics,
                spO2Status: spO2 < 95 ? "Low" : "Normal",
            },
        });
        onNext();
    };

    const getSpO2Status = (value: number) => {
        if (value < 90) return { status: "Critical", color: "text-red-600" };
        if (value < 95) return { status: "Low", color: "text-yellow-600" };
        return { status: "Normal", color: "text-green-600" };
    };

    const status = getSpO2Status(spO2);
    const [play, { stop }] = useSound(
        `/audio/spo2_${userData.language}.${
            userData.language === "akan" ? "m4a" : "mp3"
        }`,
        1.0
    );

    useEffect(() => {
        if (userData.accessibilityOptions.voice) {
            play();
        }
    }, [userData.accessibilityOptions.voice, play]);

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
            <Card className="w-full mb-8 shadow-lg border-teal-100">
                <CardContent className="p-8">
                    <h2 className="text-3xl font-semibold text-teal-700 mb-6 text-center">
                        Oxygen Saturation Measurement
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="text-xl font-medium text-blue-700 mb-4 flex items-center">
                                    <InfoIcon className="h-6 w-6 mr-2" />
                                    How to Measure Oxygen Saturation
                                </h3>
                                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                                    <li>
                                        Insert your index finger into the sensor
                                        on the right side of the kiosk
                                    </li>
                                    <li>
                                        Make sure your finger is clean and free
                                        of nail polish
                                    </li>
                                    <li>
                                        Keep your finger still during the
                                        measurement
                                    </li>
                                    <li>
                                        Wait for the measurement to complete
                                    </li>
                                </ol>
                            </div>

                            <div className="relative rounded-lg overflow-hidden border border-gray-200 h-64">
                                {/* Demonstration animation */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <div className="relative">
                                        {/* Hand */}
                                        <div className="w-24 h-12 bg-pink-200 rounded-t-lg"></div>

                                        {/* Finger */}
                                        <motion.div
                                            className="w-8 h-24 bg-pink-200 rounded-b-full absolute top-12 left-8"
                                            animate={{
                                                y: [0, 5, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatType: "loop",
                                            }}
                                        />

                                        {/* SpO2 sensor */}
                                        <div className="absolute top-20 left-0 w-24 h-16 bg-gray-300 rounded-md flex items-center justify-center">
                                            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* Measurement light */}
                                        {stage === "measuring" && (
                                            <motion.div
                                                className="absolute top-24 left-12 w-4 h-4 bg-red-500 rounded-full"
                                                animate={{
                                                    opacity: [0.3, 1, 0.3],
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                }}
                                                style={{ filter: "blur(4px)" }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {stage === "instructions" && (
                                <Button
                                    onClick={startMeasurement}
                                    size="lg"
                                    className="w-full text-lg py-6 bg-teal-600 hover:bg-teal-700"
                                >
                                    <HeartPulseIcon className="mr-2 h-5 w-5" />
                                    Start Measurement
                                </Button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {stage === "instructions" && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col items-center justify-center">
                                    <HeartPulseIcon className="h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                                        Ready to Measure
                                    </h3>
                                    <p className="text-gray-500 text-center">
                                        Click "Start Measurement" when you're
                                        ready to place your finger in the sensor
                                    </p>
                                </div>
                            )}

                            {stage === "measuring" && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full">
                                    <div className="text-center mb-6">
                                        <HeartPulseIcon className="h-16 w-16 text-teal-600 mx-auto mb-4 animate-pulse" />
                                        <h3 className="text-xl font-medium text-teal-700 mb-2">
                                            Measuring Oxygen Saturation
                                        </h3>
                                        <p className="text-gray-600">
                                            Please keep your finger still during
                                            the measurement
                                        </p>
                                    </div>

                                    {/* SpO2 visualization */}
                                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                                        {/* Pulse wave animation */}
                                        <svg
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 400 100"
                                            preserveAspectRatio="none"
                                        >
                                            <motion.path
                                                d="M 0,50 Q 50,30 100,50 T 200,50 T 300,50 T 400,50"
                                                fill="none"
                                                stroke="#0d9488"
                                                strokeWidth="3"
                                                animate={{
                                                    d: [
                                                        "M 0,50 Q 50,30 100,50 T 200,50 T 300,50 T 400,50",
                                                        "M 0,50 Q 50,70 100,50 T 200,50 T 300,50 T 400,50",
                                                        "M 0,50 Q 50,30 100,50 T 200,50 T 300,50 T 400,50",
                                                    ],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    repeatType: "loop",
                                                }}
                                            />
                                        </svg>

                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-teal-600">
                                                    {Math.min(
                                                        90 +
                                                            Math.floor(
                                                                measurementProgress /
                                                                    10
                                                            ),
                                                        99
                                                    )}
                                                    %
                                                </div>
                                                <div className="text-lg text-gray-500">
                                                    SpO2
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Starting</span>
                                            <span>Scanning</span>
                                            <span>Processing</span>
                                            <span>Complete</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-teal-600 h-3 rounded-full transition-all duration-300 ease-in-out"
                                                style={{
                                                    width: `${measurementProgress}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-center text-gray-600 mt-2">
                                            {measurementProgress < 30
                                                ? "Initializing sensor..."
                                                : measurementProgress < 60
                                                ? "Reading blood oxygen..."
                                                : measurementProgress < 90
                                                ? "Processing data..."
                                                : "Finalizing results..."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {stage === "complete" && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <CheckCircleIcon className="h-12 w-12 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-medium text-green-700 mb-4 text-center">
                                        Measurement Complete
                                    </h3>

                                    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center mb-6">
                                        <h4 className="text-lg font-medium text-gray-800 mb-2">
                                            Oxygen Saturation (SpO2)
                                        </h4>
                                        <p className="text-5xl font-bold text-teal-600 mb-2">
                                            {spO2}%
                                        </p>
                                        <p
                                            className={`text-lg font-medium ${status.color}`}
                                        >
                                            {status.status}
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleContinue}
                                        size="lg"
                                        className="w-full text-lg py-6 bg-teal-600 hover:bg-teal-700"
                                    >
                                        Continue
                                    </Button>
                                </div>
                            )}

                            {stage === "failed" && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <AlertCircleIcon className="h-12 w-12 text-red-500" />
                                    </div>
                                    <h3 className="text-2xl font-medium text-red-700 mb-4 text-center">
                                        Measurement Failed
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-6 text-center">
                                        We couldn't properly measure your oxygen
                                        saturation. This could be due to
                                        movement or incorrect finger
                                        positioning.
                                    </p>
                                    <Button
                                        onClick={handleTryAgain}
                                        size="lg"
                                        className="w-full text-lg py-6 bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between w-full">
                <Button
                    onClick={onBack}
                    variant="outline"
                    size="lg"
                    className="text-lg py-6 px-8"
                >
                    <ArrowLeftIcon className="mr-2 h-5 w-5" />
                    Back
                </Button>
            </div>
        </div>
    );
}
