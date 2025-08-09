"use client";
import { Howl } from "howler";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserData } from "@/app/page";
import {
    ArrowLeftIcon,
    ThermometerIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    InfoIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import useSound from "use-sound";

interface TemperatureMeasurementScreenProps {
    onNext: () => void;
    onBack: () => void;
    updateUserData: (data: Partial<UserData>) => void;
    userData: UserData;
}

export default function TemperatureMeasurementScreen({
    onNext,
    onBack,
    updateUserData,
    userData,
}: TemperatureMeasurementScreenProps) {
    const [stage, setStage] = useState<
        "instructions" | "measuring" | "complete" | "failed"
    >("instructions");
    const [measurementProgress, setMeasurementProgress] = useState(0);
    const [temperature, setTemperature] = useState(
        userData.biometrics.temperature || 0
    );

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
                            // Generate realistic temperature data (36.1 - 37.5°C)
                            const temp = (36.1 + Math.random() * 1.4).toFixed(
                                1
                            );
                            setTemperature(Number.parseFloat(temp));
                            setStage("complete");
                        } else {
                            setStage("failed");
                        }

                        return 100;
                    }
                    return prev + 2;
                });
            }, 100);

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
                temperature,
            },
            healthMetrics: {
                ...userData.healthMetrics,
                temperatureStatus:
                    temperature < 36.1
                        ? "Low"
                        : temperature > 37.5
                        ? "Elevated"
                        : "Normal",
            },
        });
        onNext();
    };

    const getTemperatureStatus = (temp: number) => {
        if (temp < 36.1) return { status: "Low", color: "text-blue-600" };
        if (temp > 37.5) return { status: "Elevated", color: "text-red-600" };
        return { status: "Normal", color: "text-green-600" };
    };

    const tempStatus = getTemperatureStatus(temperature);
    const [play, { stop }] = useSound(
        `/audio/temp_${userData.language}.${
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
                        Temperature Measurement
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="text-xl font-medium text-blue-700 mb-4 flex items-center">
                                    <InfoIcon className="h-6 w-6 mr-2" />
                                    How to Measure Temperature
                                </h3>
                                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                                    <li>
                                        Position your forehead 5-10 cm away from
                                        the sensor
                                    </li>
                                    <li>
                                        Keep your head still and look straight
                                        ahead
                                    </li>
                                    <li>
                                        Remove any hair, hat, or headband from
                                        your forehead
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
                                        {/* Head */}
                                        <motion.div
                                            className="w-32 h-32 bg-blue-200 rounded-full"
                                            animate={{
                                                x: [0, 5, 0, -5, 0],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatType: "loop",
                                            }}
                                        >
                                            {/* Face features */}
                                            <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-blue-300 rounded-full"></div>
                                            <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-blue-300 rounded-full"></div>
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-blue-300 rounded-full"></div>
                                        </motion.div>

                                        {/* Sensor */}
                                        <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-8 h-16 bg-gray-300 rounded-md flex items-center justify-center">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        </div>

                                        {/* Measurement line */}
                                        {stage === "measuring" && (
                                            <motion.div
                                                className="absolute top-1/2 right-0 h-1 bg-red-500"
                                                style={{
                                                    width:
                                                        measurementProgress > 0
                                                            ? "24px"
                                                            : "0px",
                                                }}
                                                animate={{
                                                    opacity: [0.3, 1, 0.3],
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                }}
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
                                    <ThermometerIcon className="mr-2 h-5 w-5" />
                                    Start Measurement
                                </Button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {stage === "instructions" && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col items-center justify-center">
                                    <ThermometerIcon className="h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                                        Ready to Measure
                                    </h3>
                                    <p className="text-gray-500 text-center">
                                        Click "Start Measurement" when you're
                                        ready to position your forehead near the
                                        sensor
                                    </p>
                                </div>
                            )}

                            {stage === "measuring" && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full">
                                    <div className="text-center mb-6">
                                        <ThermometerIcon className="h-16 w-16 text-teal-600 mx-auto mb-4 animate-pulse" />
                                        <h3 className="text-xl font-medium text-teal-700 mb-2">
                                            Measuring Temperature
                                        </h3>
                                        <p className="text-gray-600">
                                            Please remain still during the
                                            measurement process
                                        </p>
                                    </div>

                                    {/* Temperature visualization */}
                                    <div className="relative w-full h-48 bg-gradient-to-r from-blue-100 via-green-100 to-red-100 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-300"></div>
                                        <div className="absolute inset-y-0 left-0 w-1 bg-gray-300"></div>

                                        {/* Temperature indicator */}
                                        <motion.div
                                            className="absolute bottom-0 left-0 w-4 h-4 bg-teal-600 rounded-full"
                                            style={{
                                                left: `${measurementProgress}%`,
                                                bottom: `${Math.min(
                                                    20 +
                                                        measurementProgress / 2,
                                                    60
                                                )}%`,
                                            }}
                                        />

                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-teal-600">
                                                {(
                                                    36 +
                                                    (measurementProgress /
                                                        100) *
                                                        1.5
                                                ).toFixed(1)}
                                                °C
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
                                                ? "Scanning forehead..."
                                                : measurementProgress < 90
                                                ? "Processing reading..."
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
                                            Temperature
                                        </h4>
                                        <p className="text-5xl font-bold text-teal-600 mb-2">
                                            {temperature}°C
                                        </p>
                                        <p
                                            className={`text-lg font-medium ${tempStatus.color}`}
                                        >
                                            {tempStatus.status}
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
                                        We couldn't properly measure your
                                        temperature. This could be due to
                                        movement or incorrect positioning.
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
