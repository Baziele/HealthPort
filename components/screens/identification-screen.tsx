"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserData } from "@/app/page";
import {
    ArrowLeftIcon,
    CameraIcon,
    ScanLineIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    InfoIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import useSound from "use-sound";

interface IdentificationScreenProps {
    onNext: () => void;
    onBack: () => void;
    updateUserData: (data: Partial<UserData>) => void;
    userData: UserData;
}

export default function IdentificationScreen({
    onNext,
    onBack,
    updateUserData,
    userData,
}: IdentificationScreenProps) {
    const [stage, setStage] = useState<
        "initial" | "countdown" | "analyzing" | "complete" | "failed"
    >("initial");
    const [countdown, setCountdown] = useState(3);
    const [analyzing, setAnalyzing] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [userInfo, setUserInfo] = useState({
        name: userData.name || "",
        age: userData.age || 0,
        gender: userData.gender || "",
        nhisNumber: userData.nhisNumber || "",
    });

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // const [snapshot, setSnapshot] = useState<string>("");
    let snapshot = "";
    const [stream, setStream] = useState<MediaStream | null>(null);
    const width = 640 * 1.5;
    const height = 480 * 1.5;

    // Simulate camera activation on page load
    useEffect(() => {
        // In a real implementation, this would access the user's camera
        const simulateCameraFeed = async () => {
            try {
                console.log("mediaStream run");
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        // facingMode: { ideal: "user" },
                        width,
                        height,
                        // deviceId: "",
                    },
                });
                console.log(mediaStream);
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing webcam: ", err);
            }
        };

        simulateCameraFeed();
    }, []);

    function dataURLtoBlob(dataURL: any) {
        const parts = dataURL.split(",");
        const mime = parts[0].match(/:(.*?);/)[1];
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    const uploadSnapshot = async () => {
        if (!snapshot) return;
        const blob = dataURLtoBlob(snapshot);
        const formData = new FormData();
        formData.append("apikey", "K87859752788957");
        formData.append("language", "eng");
        formData.append("isOverlayRequired", "false");
        formData.append("base64Image", snapshot);

        try {
            console.log("Uploading snapshot for OCR...");
            const res = await fetch("https://api.ocr.space/parse/image", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            console.log("OCR Result:", result);
            const geminiRes = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
                {
                    method: "POST",
                    headers: {
                        "x-goog-api-key":
                            "AIzaSyCgj6eCdSmChm6OgJKHmM2G1oAS-h9G16Y",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `this is the result of the OCR: ${JSON.stringify(
                                            result
                                        )}, respond with a json with the details of the person formatted properly. also it should have a key called as 'successful' with a boolean value, it should be true if you could extract at least the name, and false otherwise.`,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );
            const geminiResult = await geminiRes.json();
            console.log(geminiResult);

            // Parse the Gemini response text to get the JSON
            try {
                const parsedText = JSON.parse(
                    geminiResult.candidates[0].content.parts[0].text
                        .replace(/```json\n?/g, "")
                        .replace(/\n?```$/g, "")
                        .trim()
                );
                if (parsedText.successful) {
                    console.log(parsedText);
                    // Calculate age from date of birth if present
                    let age = 0;
                    if (parsedText.person_details.dateOfBirth) {
                        const dob = new Date(
                            parsedText.person_details.dateOfBirth
                        );
                        const today = new Date();
                        age = today.getFullYear() - dob.getFullYear();
                    }

                    setUserInfo({
                        name: parsedText.person_details.name || "",
                        age: age || parsedText.person_details.date || 0,
                        gender: parsedText.person_details.gender || "",
                        nhisNumber: parsedText.person_details.id_number || "",
                    });
                    setStage("complete");
                } else {
                    setStage("failed");
                }
            } catch (parseError) {
                console.error("Failed to parse Gemini response:", parseError);
                // setStage("failed");
            }
        } catch (err) {
            console.error("OCR upload failed:", err);
            // setStage("failed");
        }
    };

    const takeSnapshot = () => {
        console.log("snapshot taken");
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(video, 0, 0, width, height);
        const imageData = canvas.toDataURL("image/png");

        snapshot = imageData;
        uploadSnapshot(); // Add this line
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
    };

    // Handle countdown
    useEffect(() => {
        if (stage === "countdown" && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (stage === "countdown" && countdown === 0) {
            // Capture image when countdown reaches zero
            captureImage();
        }
    }, [stage, countdown]);

    // Handle analysis progress
    useEffect(() => {
        if (stage === "analyzing") {
            const interval = setInterval(() => {
                setScanProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);

                        // // 80% chance of successful analysis for demo purposes
                        // const success = Math.random() > 0.1;

                        // if (success) {
                        //     setUserInfo({
                        //         name: "Francis Saah",
                        //         age: 18,
                        //         gender: "Male",
                        //         nhisNumber: "NHIS-47787837",
                        //     });
                        //     setStage("complete");
                        // } else {
                        //     setStage("failed");
                        // }

                        return 100;
                    }
                    return prev + 0.5;
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [stage]);

    const startCapture = () => {
        setStage("countdown");
        setCountdown(3);
    };

    const captureImage = () => {
        // Simulate capturing the image
        takeSnapshot();
        setStage("analyzing");
        // setScanProgress(0);
    };

    const handleConfirm = () => {
        updateUserData({
            name: userInfo.name,
            age: userInfo.age,
            gender: userInfo.gender,
            nhisNumber: userInfo.nhisNumber,
        });
        onNext();
    };

    const handleTryAgain = () => {
        setStage("initial");
        setScanProgress(0);
    };

    const [soundID, setSoundID] = useState<number | null>(null);
    const [play, { stop }] = useSound(
        `/audio/auth_${userData.language}.${
            userData.language === "akan" ? "m4a" : "mp3"
        }`,
        1.0
    );

    // const [play, { stop }] = useSound(
    //     `/audio/home_${language}.${language === "akan" ? "m4a" : "mp3"}`,
    //     {
    //         volume: 1.0,
    //         onend: () => console.log("Finished playing!"),
    //     }
    // );

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
                        NHIS Card Identification
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="text-xl font-medium text-blue-700 mb-4 flex items-center">
                                    <InfoIcon className="h-6 w-6 mr-2" />
                                    How to Scan Your NHIS Card
                                </h3>
                                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                                    <li>
                                        Place your NHIS card face up in front of
                                        the camera
                                    </li>
                                    <li>
                                        Ensure the card is fully visible within
                                        the frame
                                    </li>
                                    <li>Click the "Start" button when ready</li>
                                    <li>
                                        Hold the card steady during the 3-second
                                        countdown
                                    </li>
                                    <li>
                                        Wait for the system to verify your
                                        information
                                    </li>
                                </ol>
                            </div>

                            <div className="relative rounded-lg overflow-hidden border border-gray-200 h-64">
                                {/* Demonstration animation */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <div className="relative w-3/4 h-3/4 flex items-center justify-center">
                                        {/* Simulated card animation */}
                                        <motion.div
                                            className="w-64 h-40 bg-gradient-to-r from-blue-400 to-teal-500 rounded-lg shadow-md flex items-center justify-center"
                                            animate={{
                                                y: [0, -10, 0],
                                                rotate: [0, 2, 0, -2, 0],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatType: "loop",
                                            }}
                                        >
                                            <div className="text-white text-center">
                                                <div className="text-xs mb-1">
                                                    National Health Insurance
                                                    Scheme
                                                </div>
                                                <div className="text-lg font-bold mb-2">
                                                    NHIS CARD
                                                </div>
                                                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-1"></div>
                                                <div className="text-sm">
                                                    Place card here
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Scanner light effect */}
                                        {
                                            /*stage === "instructions" && */ <motion.div
                                                className="absolute inset-0 bg-teal-500 opacity-20"
                                                animate={{
                                                    top: ["100%", "0%", "100%"],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    repeatType: "loop",
                                                }}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Camera feed - always visible */}
                            <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden border-2 border-gray-300">
                                {/* Live camera feed */}
                                {!snapshot ? (
                                    <video
                                        ref={videoRef}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        playsInline
                                    ></video>
                                ) : (
                                    <img
                                        src={snapshot}
                                        alt="Captured Image"
                                        width={width}
                                        height={height}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <canvas
                                    ref={canvasRef}
                                    style={{ display: "none" }}
                                />

                                {/* Card positioning guide */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3/4 h-1/2 border-2 border-white border-dashed rounded-md flex items-center justify-center">
                                        <div className="text-white text-sm">
                                            {stage === "initial"
                                                ? "Position NHIS Card Here"
                                                : stage === "countdown"
                                                ? `Capturing in ${countdown}...`
                                                : stage === "analyzing"
                                                ? "Analyzing card..."
                                                : ""}
                                        </div>
                                    </div>
                                </div>

                                {/* Countdown overlay */}
                                {stage === "countdown" && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <div className="text-white text-8xl font-bold">
                                            {countdown}
                                        </div>
                                    </div>
                                )}

                                {/* Scanner light effect */}
                                {stage === "analyzing" && (
                                    <motion.div
                                        className="absolute inset-x-0 h-2 bg-teal-500 opacity-70"
                                        animate={{
                                            top: ["0%", "100%", "0%"],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                            repeatType: "loop",
                                        }}
                                    />
                                )}

                                {/* Capture flash effect */}
                                {stage === "countdown" && countdown === 0 && (
                                    <motion.div
                                        className="absolute inset-0 bg-white"
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                )}
                            </div>

                            {/* Analysis progress */}
                            {stage === "analyzing" && (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <ScanLineIcon className="h-12 w-12 text-teal-600 mx-auto mb-2 animate-pulse" />
                                        <h3 className="text-xl font-medium text-teal-700 mb-2">
                                            Analyzing NHIS Card
                                        </h3>
                                        <p className="text-gray-600">
                                            Please wait while we verify your
                                            information
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Scanning</span>
                                            <span>Analyzing</span>
                                            <span>Verifying</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-teal-600 h-3 rounded-full transition-all duration-300 ease-in-out"
                                                style={{
                                                    width: `${scanProgress}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-center text-gray-600 mt-2">
                                            {scanProgress < 30
                                                ? "Scanning card..."
                                                : scanProgress < 60
                                                ? "Reading information..."
                                                : scanProgress < 90
                                                ? "Verifying identity..."
                                                : "Almost complete..."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Hidden canvas for image capture */}
                            <canvas ref={canvasRef} className="hidden"></canvas>

                            {(stage === "initial" || stage === "countdown") && (
                                <Button
                                    onClick={startCapture}
                                    size="lg"
                                    className="w-full text-lg py-6 bg-teal-600 hover:bg-teal-700"
                                    disabled={stage === "countdown"}
                                >
                                    <CameraIcon className="mr-2 h-5 w-5" />
                                    {stage === "initial"
                                        ? "Start"
                                        : `Capturing in ${countdown}...`}
                                </Button>
                            )}

                            {stage === "complete" && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <CheckCircleIcon className="h-12 w-12 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-medium text-green-700 mb-4 text-center">
                                        NHIS Card Successfully Verified
                                    </h3>
                                    <div className="space-y-3 text-left">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-500 font-medium">
                                                Name:
                                            </span>
                                            <span className="text-gray-800">
                                                {userInfo.name}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-500 font-medium">
                                                Age:
                                            </span>
                                            <span className="text-gray-800">
                                                {userInfo.age}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-500 font-medium">
                                                Gender:
                                            </span>
                                            <span className="text-gray-800">
                                                {userInfo.gender}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-500 font-medium">
                                                NHIS Number:
                                            </span>
                                            <span className="text-gray-800">
                                                {userInfo.nhisNumber}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <Button
                                            onClick={handleConfirm}
                                            size="lg"
                                            className="w-full text-lg py-6 bg-teal-600 hover:bg-teal-700"
                                        >
                                            Confirm & Continue
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {stage === "failed" && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <AlertCircleIcon className="h-12 w-12 text-red-500" />
                                    </div>
                                    <h3 className="text-2xl font-medium text-red-700 mb-4 text-center">
                                        Verification Failed
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-6 text-center">
                                        We couldn't properly read your NHIS
                                        card. Please make sure the card is
                                        clean, properly positioned, and try
                                        again.
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
