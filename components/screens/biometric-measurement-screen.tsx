"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserData } from "@/app/page";
import {
    ArrowLeftIcon,
    ActivityIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    ScaleIcon,
    InfoIcon,
    Weight,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { get } from "http";
import useSound from "use-sound";

interface BiometricMeasurementScreenProps {
    onNext: () => void;
    onBack: () => void;
    updateUserData: (data: Partial<UserData>) => void;
    userData: UserData;
}

export default function BiometricMeasurementScreen({
    onNext,
    onBack,
    updateUserData,
    userData,
}: BiometricMeasurementScreenProps) {
    const [stage, setStage] = useState<
        "instructions" | "measuring" | "complete" | "failed"
    >("instructions");
    const [measurementProgress, setMeasurementProgress] = useState(0);
    const [biometricData, setBiometricData] = useState({
        height: userData.biometrics.height || 0,
        weight:
            userData.biometrics.weight ||
            Math.floor(55 + Math.random() * 10) ||
            0,
        bmi: userData.biometrics.bmi || 0,
    });

    // Ref to prevent double execution of measurement completion
    const measurementCompleteRef = useRef(false);

    const requestSensorValue = async (sensorType: "height" | "weight") => {
        try {
            const response = await fetch(`http://localhost:5000/${sensorType}`);
            if (!response.ok) {
                console.error(`Failed to fetch ${sensorType} data`);
                return null;
            }
        } catch (error) {
            console.error(`Error requesting ${sensorType} sensor:`, error);
            return null;
        }
    };

    const getSensorValue = async (sensorType: "height" | "weight") => {
        try {
            const response = await fetch(
                `http://localhost:5000/poll/${sensorType}`
            );
            if (!response.ok) {
                console.error(`Failed to poll ${sensorType} data`);
                return null;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error getting ${sensorType} sensor value:`, error);
            return null;
        }
    };

    // Handle measurement progress
    useEffect(() => {
        if (stage === "measuring" && !measurementCompleteRef.current) {
            const interval = setInterval(() => {
                setMeasurementProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);

                        // Prevent multiple executions
                        if (measurementCompleteRef.current) {
                            return 100;
                        }
                        measurementCompleteRef.current = true;

                        const fetchData = async () => {
                            try {
                                const heightData = await getSensorValue(
                                    "height"
                                );
                                const weightData = await getSensorValue(
                                    "weight"
                                );

                                if (!heightData || !weightData) {
                                    console.error("Failed to get sensor data");
                                    setStage("failed");
                                    return;
                                }

                                console.log(
                                    "Sensor data received:",
                                    heightData.value,
                                    weightData.value
                                );

                                // 90% success rate for demo
                                if (Math.random() < 0.9) {
                                    const weight = Number(weightData.value);
                                    const height = Number(heightData.value);
                                    const bmi = Number(
                                        (weight / (height / 100) ** 2).toFixed(
                                            1
                                        )
                                    );

                                    setBiometricData({
                                        height,
                                        weight,
                                        bmi,
                                    });

                                    setStage("complete");
                                } else {
                                    setStage("failed");
                                }
                            } catch (error) {
                                console.error(
                                    "Error fetching sensor data:",
                                    error
                                );
                                setStage("failed");
                            }
                        };

                        fetchData();
                        console.log("Measurement function executed");
                        return 100;
                    }
                    return prev + 2;
                });
            }, 300);

            return () => {
                clearInterval(interval);
            };
        }
    }, [stage]);

    const startMeasurement = async () => {
        measurementCompleteRef.current = false;
        setMeasurementProgress(0);
        setStage("measuring");

        // Request sensor readings
        await requestSensorValue("height");
        await requestSensorValue("weight");
    };

    const handleTryAgain = () => {
        measurementCompleteRef.current = false;
        setStage("instructions");
        setMeasurementProgress(0);
    };

    const handleContinue = () => {
        updateUserData({
            biometrics: {
                ...userData.biometrics,
                height: biometricData.height,
                weight: biometricData.weight,
                bmi: biometricData.bmi,
            },
            healthMetrics: {
                ...userData.healthMetrics,
                bmiCategory:
                    biometricData.bmi < 18.5
                        ? "Underweight"
                        : biometricData.bmi < 25
                        ? "Normal"
                        : biometricData.bmi < 30
                        ? "Overweight"
                        : "Obese",
            },
        });
        onNext();
    };

    const [play, { stop }] = useSound(
        `/audio/h&w_${userData.language}.${
            userData.language === "akan" ? "m4a" : "mp3"
        }`,
        1.0
    );

    useEffect(() => {
        if (userData.accessibilityOptions.voice) {
            play();
        }

        return () => {
            stop();
        };
    }, [userData.accessibilityOptions.voice, play, stop]);

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
            <Card className="w-full mb-8 shadow-lg border-teal-100">
                <CardContent className="p-8">
                    <h2 className="text-3xl font-semibold text-teal-700 mb-6 text-center">
                        Height & Weight Measurement
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="text-xl font-medium text-blue-700 mb-4 flex items-center">
                                    <InfoIcon className="h-6 w-6 mr-2" />
                                    How to Measure Height & Weight
                                </h3>
                                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                                    <li>
                                        Stand on the marked area on the floor in
                                        front of the kiosk
                                    </li>
                                    <li>
                                        Face forward and stand straight with
                                        your back against the height sensor
                                    </li>
                                    <li>Keep your feet flat on the scale</li>
                                    <li>
                                        Remain still during the measurement
                                        process
                                    </li>
                                    <li>
                                        Wait for the confirmation before
                                        stepping off
                                    </li>
                                </ol>
                            </div>

                            <div className="relative rounded-lg overflow-hidden border border-gray-200 w-full aspect-square">
                                <Image
                                    src="/stand.png"
                                    alt="Image of a man standing upright"
                                    fill
                                    className="object-fill"
                                />
                            </div>

                            {stage === "instructions" && (
                                <Button
                                    onClick={startMeasurement}
                                    size="lg"
                                    className="w-full text-lg py-6 bg-teal-600 hover:bg-teal-700"
                                >
                                    <ScaleIcon className="mr-2 h-5 w-5" />
                                    Start Measurement
                                </Button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {stage === "instructions" && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col items-center justify-center">
                                    <ScaleIcon className="h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                                        Ready to Measure
                                    </h3>
                                    <p className="text-gray-500 text-center">
                                        Click "Start Measurement" when you're
                                        ready to stand on the scale
                                    </p>
                                </div>
                            )}

                            {stage === "measuring" && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full">
                                    <div className="text-center mb-6">
                                        <ActivityIcon className="h-16 w-16 text-teal-600 mx-auto mb-4 animate-pulse" />
                                        <h3 className="text-xl font-medium text-teal-700 mb-2">
                                            Measuring Height & Weight
                                        </h3>
                                        <p className="text-gray-600">
                                            Please remain still during the
                                            measurement process
                                        </p>
                                    </div>

                                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-teal-600 mb-2">
                                                {Math.floor(
                                                    measurementProgress / 2
                                                )}
                                                <span className="text-lg font-normal text-gray-500">
                                                    kg
                                                </span>
                                            </div>
                                            <div className="text-4xl font-bold text-teal-600">
                                                {Math.floor(
                                                    150 +
                                                        measurementProgress / 4
                                                )}
                                                <span className="text-lg font-normal text-gray-500">
                                                    cm
                                                </span>
                                            </div>
                                        </div>

                                        <div className="absolute left-4 inset-y-4 w-2 bg-gray-200 rounded-full overflow-hidden">
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 bg-teal-500"
                                                animate={{
                                                    height: `${measurementProgress}%`,
                                                }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                        <div className="absolute right-4 inset-y-4 w-2 bg-gray-200 rounded-full overflow-hidden">
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 bg-teal-500"
                                                animate={{
                                                    height: `${measurementProgress}%`,
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.2,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Starting</span>
                                            <span>Measuring Height</span>
                                            <span>Measuring Weight</span>
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
                                                ? "Initializing sensors..."
                                                : measurementProgress < 60
                                                ? "Measuring height..."
                                                : measurementProgress < 90
                                                ? "Measuring weight..."
                                                : "Processing results..."}
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

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                            <h4 className="text-lg font-medium text-gray-800 mb-2">
                                                Height
                                            </h4>
                                            <p className="text-3xl font-bold text-teal-600">
                                                {biometricData.height} cm
                                            </p>
                                        </div>
                                        {/* <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                            <h4 className="text-lg font-medium text-gray-800 mb-2">
                                                Weight
                                            </h4>
                                            <p className="text-3xl font-bold text-teal-600">
                                                {biometricData.weight} kg
                                            </p>
                                        </div> */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                            <h4 className="text-lg font-medium text-gray-800 mb-2">
                                                BMI
                                            </h4>
                                            <p className="text-3xl font-bold text-teal-600">
                                                {biometricData.bmi}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {biometricData.bmi < 18.5
                                                    ? "Underweight"
                                                    : biometricData.bmi < 25
                                                    ? "Normal"
                                                    : biometricData.bmi < 30
                                                    ? "Overweight"
                                                    : "Obese"}
                                            </p>
                                        </div>
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
                                        We couldn't properly measure your height
                                        and weight. This could be due to
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
