"use client";
import useSound from "use-sound";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { UserData } from "@/app/page";
import {
    GlobeIcon,
    VolumeIcon,
    Type,
    HeartPulseIcon,
    ActivityIcon,
    ThermometerIcon,
    ScanIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
    onNext: () => void;
    updateUserData: (data: Partial<UserData>) => void;
    userData: UserData;
}

export default function WelcomeScreen({
    onNext,
    updateUserData,
    userData,
}: WelcomeScreenProps) {
    const [language, setLanguage] = useState(userData.language || "english");
    const [voiceEnabled, setVoiceEnabled] = useState(
        userData.accessibilityOptions?.voice || false
    );
    const [largeTextEnabled, setLargeTextEnabled] = useState(
        userData.accessibilityOptions?.largeText || false
    );

    const [play, { stop }] = useSound(
        `/audio/home_${language}.${language === "akan" ? "m4a" : "mp3"}`,
        {
            volume: 1.0,
            onend: () => console.log("Finished playing!"),
        }
    );

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
        console.log("Language changed to:", value);
    };

    const handleStart = () => {
        stop(); // Stop any playing audio before proceeding
        updateUserData({
            language,
            accessibilityOptions: {
                voice: voiceEnabled,
                largeText: largeTextEnabled,
            },
        });
        onNext();
    };

    const features = [
        {
            icon: <ScanIcon className="h-10 w-10 text-teal-500" />,
            title: "Quick Identification",
            description:
                "Scan your NHIS card for fast and secure identification",
        },
        {
            icon: <ActivityIcon className="h-10 w-10 text-teal-500" />,
            title: "Vital Measurements",
            description: "Measure your height, weight, temperature, and more",
        },
        {
            icon: <HeartPulseIcon className="h-10 w-10 text-teal-500" />,
            title: "Health Assessment",
            description:
                "Get a comprehensive assessment of your health metrics",
        },
        {
            icon: <ThermometerIcon className="h-10 w-10 text-teal-500" />,
            title: "AI Consultation",
            description: "Discuss your symptoms with our advanced AI assistant",
        },
    ];

    useEffect(() => {
        console.log(language, voiceEnabled);
        if (voiceEnabled) {
            console.log("Voice assistance enabled, playing sound");
            play();
        } else {
            console.log("Voice assistance disabled, stopping sound");
            stop();
        }
    }, [voiceEnabled, play, stop]);

    // Stop audio when language changes and voice is enabled
    useEffect(() => {
        if (voiceEnabled) {
            stop(); // Stop current audio
            // The new audio will be loaded automatically due to the URL change
            setTimeout(() => play(), 100); // Small delay to ensure new audio is loaded
        }
    }, [language]);

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
            >
                <h1 className="text-5xl font-bold text-teal-700 mb-4">
                    Welcome to the Health Port
                </h1>
                <p className="text-xl text-gray-600">
                    Your self-service medical evaluation kiosk
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="col-span-1 md:col-span-2"
                >
                    <Card className="overflow-hidden border-teal-100 shadow-lg h-64 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-700 opacity-90"></div>
                        <CardContent className="p-8 relative z-10 h-full flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Start Your Health Assessment
                            </h2>
                            <p className="text-xl text-white mb-6">
                                Get a comprehensive health check-up in minutes
                                with our state-of-the-art medical kiosk
                            </p>
                            <Button
                                onClick={handleStart}
                                size="lg"
                                className="text-xl py-8 px-16 bg-white text-teal-700 hover:bg-gray-100 w-fit"
                            >
                                Start Assessment
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card className="h-full shadow-lg border-teal-100">
                        <CardContent className="p-6">
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <GlobeIcon className="h-6 w-6 text-teal-600" />
                                    <h2 className="text-2xl font-semibold text-teal-700">
                                        Select Your Language
                                    </h2>
                                </div>
                                <Tabs
                                    defaultValue={language}
                                    onValueChange={handleLanguageChange}
                                    className="w-full"
                                >
                                    <TabsList className="grid grid-cols-3 w-full">
                                        <TabsTrigger
                                            value="english"
                                            className="text-lg py-3"
                                        >
                                            English
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="akan"
                                            className="text-lg py-3"
                                        >
                                            Akan
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="french"
                                            className="text-lg py-3"
                                        >
                                            Français
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Type className="h-6 w-6 text-teal-600" />
                                    <h2 className="text-2xl font-semibold text-teal-700">
                                        Accessibility Options
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <VolumeIcon className="h-5 w-5 text-teal-600" />
                                            <Label
                                                htmlFor="voice-assist"
                                                className="text-lg"
                                            >
                                                Voice Assistance
                                            </Label>
                                        </div>
                                        <Switch
                                            id="voice-assist"
                                            checked={voiceEnabled}
                                            onCheckedChange={setVoiceEnabled}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Type className="h-5 w-5 text-teal-600" />
                                            <Label
                                                htmlFor="large-text"
                                                className="text-lg"
                                            >
                                                Large Text
                                            </Label>
                                        </div>
                                        <Switch
                                            id="large-text"
                                            checked={largeTextEnabled}
                                            onCheckedChange={
                                                setLargeTextEnabled
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Card className="h-full shadow-lg border-teal-100">
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                                Features
                            </h2>
                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="mt-1 text-teal-600">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
