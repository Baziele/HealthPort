"use client";
import { Howl } from "howler";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserData } from "@/app/page";
import {
    ArrowLeftIcon,
    HeartIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    InfoIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import useSound from "use-sound";

interface HeartRateMeasurementScreenProps {
    onNext: () => void;
    onBack: () => void;
    updateUserData: (data: Partial<UserData>) => void;
    userData: UserData;
}

export default function HeartRateMeasurementScreen({
    onNext,
    onBack,
    updateUserData,
    userData,
}: HeartRateMeasurementScreenProps) {
    const [stage, setStage] = useState<
        "instructions" | "measuring" | "complete" | "failed"
    >("instructions");
    const [measurementProgress, setMeasurementProgress] = useState(0);
    const [heartRate, setHeartRate] = useState(
        userData.biometrics.heartRate || 0
    );
    const [bloodPressure, setBloodPressure] = useState({
        systolic: userData.biometrics.bloodPressure?.systolic || 0,
        diastolic: userData.biometrics.bloodPressure?.diastolic || 0,
    });

    const requestSensorValue = async (sensorType) => {
        console.log(`Requesting ${sensorType} sensor...`);
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
        if (stage === "measuring") {
            console.log(`Requesting kjyfjhyjh sensor.knllkkikjlkjlijlijlik..`);

            const interval = setInterval(() => {
                setMeasurementProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);

                        // 90% chance of successful measurement for demo purposes
                        const success = Math.random() > 0.3;

                        if (success) {
                            // Generate realistic heart rate data (60-100 bpm)
                            const hr = Math.floor(60 + Math.random() * 40);
                            // Generate realistic blood pressure data
                            const systolic = Math.floor(
                                110 + Math.random() * 30
                            );
                            const diastolic = Math.floor(
                                70 + Math.random() * 20
                            );

                            setHeartRate(hr);
                            setBloodPressure({
                                systolic,
                                diastolic,
                            });
                            setStage("complete");
                        } else {
                            setStage("failed");
                        }

                        return 100;
                    }
                    return prev + 2;
                });
            }, 700);

            return () => clearInterval(interval);
        }
    }, [stage]);

    const startMeasurement = () => {
        console.log(`Requesting kjyfjhyjh sensor...`);

        requestSensorValue("bp");
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
                heartRate,
                bloodPressure,
            },
            healthMetrics: {
                ...userData.healthMetrics,
                heartRateStatus:
                    heartRate < 60
                        ? "Low"
                        : heartRate > 100
                        ? "Elevated"
                        : "Normal",
                bloodPressureStatus:
                    bloodPressure.systolic > 140 || bloodPressure.diastolic > 90
                        ? "Elevated"
                        : bloodPressure.systolic < 90 ||
                          bloodPressure.diastolic < 60
                        ? "Low"
                        : "Normal",
            },
        });
        onNext();
    };

    const getHeartRateStatus = (hr: number) => {
        if (hr < 60) return { status: "Low", color: "text-blue-600" };
        if (hr > 100) return { status: "Elevated", color: "text-red-600" };
        return { status: "Normal", color: "text-green-600" };
    };

    const getBloodPressureStatus = (systolic: number, diastolic: number) => {
        if (systolic > 140 || diastolic > 90)
            return { status: "Elevated", color: "text-red-600" };
        if (systolic < 90 || diastolic < 60)
            return { status: "Low", color: "text-blue-600" };
        return { status: "Normal", color: "text-green-600" };
    };

    const hrStatus = getHeartRateStatus(heartRate);
    const bpStatus = getBloodPressureStatus(
        bloodPressure.systolic,
        bloodPressure.diastolic
    );

    const [play, { stop }] = useSound(
        `/audio/hr&bp_${userData.language}.${
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
                        Heart Rate & Blood Pressure
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="text-xl font-medium text-blue-700 mb-4 flex items-center">
                                    <InfoIcon className="h-6 w-6 mr-2" />
                                    How to Measure Heart Rate & Blood Pressure
                                </h3>
                                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                                    <li>
                                        Insert your left arm into the blood
                                        pressure cuff
                                    </li>
                                    <li>
                                        Rest your arm on the armrest with your
                                        palm facing up
                                    </li>
                                    <li>
                                        Remain still and relaxed during the
                                        measurement
                                    </li>
                                    <li>
                                        The cuff will inflate and then slowly
                                        deflate
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
                                        {/* Arm */}
                                        <motion.div
                                            className="w-48 h-16 bg-pink-200 rounded-full transform rotate-45"
                                            animate={{
                                                y: [0, -5, 0],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatType: "loop",
                                            }}
                                        />

                                        {/* Blood pressure cuff */}
                                        <div className="absolute top-0 left-12 w-24 h-16 bg-blue-300 rounded-md border-2 border-blue-500 flex items-center justify-center">
                                            <div className="text-xs text-white font-bold">
                                                BP CUFF
                                            </div>
                                        </div>

                                        {/* Inflation animation */}
                                        {stage === "measuring" &&
                                            measurementProgress < 50 && (
                                                <motion.div
                                                    className="absolute top-0 left-12 w-24 h-16 bg-blue-500 rounded-md opacity-30"
                                                    animate={{
                                                        scale: [1, 1.1, 1],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Number.POSITIVE_INFINITY,
                                                        repeatType: "loop",
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
                                    <HeartIcon className="mr-2 h-5 w-5" />
                                    Start Measurement
                                </Button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {stage === "instructions" && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col items-center justify-center">
                                    <HeartIcon className="h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                                        Ready to Measure
                                    </h3>
                                    <p className="text-gray-500 text-center">
                                        Click "Start Measurement" when you're
                                        ready to place your arm in the blood
                                        pressure cuff
                                    </p>
                                </div>
                            )}

                            {stage === "measuring" && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full">
                                    <div className="text-center mb-6">
                                        <HeartIcon className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
                                        <h3 className="text-xl font-medium text-teal-700 mb-2">
                                            Measuring Heart Rate & Blood
                                            Pressure
                                        </h3>
                                        <p className="text-gray-600">
                                            Please remain still and relaxed
                                            during the measurement
                                        </p>
                                    </div>

                                    {/* Heart rate visualization */}
                                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                                        {/* ECG line animation */}
                                        <svg
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 400 100"
                                            preserveAspectRatio="none"
                                        >
                                            <motion.path
                                                d="M 0,50 L 50,50 L 60,20 L 70,80 L 80,50 L 100,50 L 150,50 L 160,20 L 170,80 L 180,50 L 200,50 L 250,50 L 260,20 L 270,80 L 280,50 L 300,50 L 350,50 L 360,20 L 370,80 L 380,50 L 400,50"
                                                fill="none"
                                                stroke="#ef4444"
                                                strokeWidth="3"
                                                initial={{
                                                    pathLength: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    pathLength: 1,
                                                    opacity: 1,
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    repeatType: "loop",
                                                    ease: "linear",
                                                }}
                                            />
                                        </svg>

                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center">
                                                    <div className="text-4xl font-bold text-red-500">
                                                        {Math.min(
                                                            60 +
                                                                Math.floor(
                                                                    measurementProgress /
                                                                        2.5
                                                                ),
                                                            100
                                                        )}
                                                    </div>
                                                    <div className="text-lg text-gray-500">
                                                        BPM
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-4xl font-bold text-red-500">
                                                        {Math.min(
                                                            110 +
                                                                Math.floor(
                                                                    measurementProgress /
                                                                        5
                                                                ),
                                                            140
                                                        )}
                                                        /
                                                        {Math.min(
                                                            70 +
                                                                Math.floor(
                                                                    measurementProgress /
                                                                        10
                                                                ),
                                                            90
                                                        )}
                                                    </div>
                                                    <div className="text-lg text-gray-500">
                                                        mmHg
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Starting</span>
                                            <span>Inflating</span>
                                            <span>Measuring</span>
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
                                                ? "Preparing measurement..."
                                                : measurementProgress < 60
                                                ? "Inflating cuff..."
                                                : measurementProgress < 90
                                                ? "Taking measurements..."
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

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                            <h4 className="text-lg font-medium text-gray-800 mb-2">
                                                Heart Rate
                                            </h4>
                                            <p className="text-3xl font-bold text-teal-600 mb-1">
                                                {heartRate}
                                            </p>
                                            <p className="text-sm font-medium">
                                                BPM
                                            </p>
                                            <p
                                                className={`text-sm font-medium ${hrStatus.color} mt-1`}
                                            >
                                                {hrStatus.status}
                                            </p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                            <h4 className="text-lg font-medium text-gray-800 mb-2">
                                                Blood Pressure
                                            </h4>
                                            <p className="text-3xl font-bold text-teal-600 mb-1">
                                                {bloodPressure.systolic}/
                                                {bloodPressure.diastolic}
                                            </p>
                                            <p className="text-sm font-medium">
                                                mmHg
                                            </p>
                                            <p
                                                className={`text-sm font-medium ${bpStatus.color} mt-1`}
                                            >
                                                {bpStatus.status}
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
                                        We couldn't properly measure your heart
                                        rate and blood pressure. This could be
                                        due to movement or incorrect arm
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
