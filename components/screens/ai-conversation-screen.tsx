"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserData } from "@/app/page";
import { ArrowLeftIcon, MicIcon, BotIcon, UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import Vapi from "@vapi-ai/web";
import Visualizer from "../ui/visualizer";
import { AssistantOverrides } from "@vapi-ai/web/dist/api";

interface AIConversationScreenProps {
    onNext: () => void;
    onBack: () => void;
    updateUserData: (data: Partial<UserData>) => void;
    userData: UserData;
}

interface Message {
    role: "assistant" | "user";
    content: string;
    isComplete: boolean;
}

export default function AIConversationScreen({
    onNext,
    onBack,
    updateUserData,
    userData,
}: AIConversationScreenProps) {
    const vapi = new Vapi(process.env.VAPI_API_KEY);
    const [messages, setMessages] = useState<Message[]>([]);
    // const [isListening, setIsListening] = useState(false);
    const [conversationComplete, setConversationComplete] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [activeSpeaker, setActiveSpeaker] = useState<
        "assistant" | "user" | null
    >(null);

    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);

    const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
    const [volumeLevel, setVolumeLevel] = useState(0);
    let callSummary = "";
    const assistantOverrides: AssistantOverrides = {
        clientMessages: [],
        serverMessages: [],

        variableValues: {
            name: userData.name,
            age: userData.age,
            gender: userData.gender,
            nhisNumber: userData.nhisNumber,
            painAreas: userData.painAreas,
            height: userData.biometrics.height,
            weight: userData.biometrics.weight,
            bmi: userData.biometrics.bmi,
            temperature: userData.biometrics.temperature,
            spO2: userData.biometrics.spO2,
            heartRate: userData.biometrics.heartRate,
            bloodPressure: userData.biometrics.bloodPressure,
        },
    };

    // hook into Vapi events
    useEffect(() => {
        vapi.on("call-start", () => {
            setConnecting(false);
            setConnected(true);
        });

        vapi.on("call-end", () => {
            setConnecting(false);
            setConnected(false);
            setConversationComplete(true);
        });

        vapi.on("speech-start", () => {
            setAssistantIsSpeaking(true);
        });

        vapi.on("speech-end", () => {
            setAssistantIsSpeaking(false);
        });

        vapi.on("volume-level", (level) => {
            setVolumeLevel(level);
        });

        vapi.on("error", (error) => {
            console.log(error);

            setConnecting(false);
        });

        vapi.on("message", (message: any) => {
            if (
                message.type === "transcript" &&
                message.transcriptType === "final"
            ) {
                addMessage(message.role, message.transcript);
            } else if (message.type === "end-of-call-report") {
                callSummary = message.summary;
            }
        });

        // we only want this to fire on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // call start handler
    const startCall = async () => {
        setConnecting(true);
        try {
            const call = await vapi.start(
                process.env.VAPI_ASSISTANT_ID
                // assistantOverrides
            );
            console.log(call);
        } catch (error) {
            console.log(error);
            setConnecting(false);
            // throw error;
        }
    };
    const endCall = () => {
        vapi.stop();
    };

    // Initial AI greeting
    // useEffect(() => {
    //     setTimeout(() => {
    //         addMessage(
    //             "ai",
    //             `Hello ${userData.name}, I'm your AI medical assistant. I'll be asking you some questions about your symptoms to help provide a preliminary assessment. How can I help you today?`
    //         );
    //     }, 1000);
    // }, [userData.name]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const addMessage = (role: "assistant" | "user", content: string) => {
        if (activeSpeaker === role) {
            setMessages((prev) => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                // Only update if there's a previous message from the same speaker
                if (lastIndex >= 0 && updated[lastIndex].role === role) {
                    updated[lastIndex] = {
                        ...updated[lastIndex],
                        content: updated[lastIndex].content + " " + content,
                    };
                    return updated;
                }
                // If no previous message from this speaker, add as new
                return [...prev, { role, content, isComplete: false }];
            });
        } else {
            // Set active speaker
            setActiveSpeaker(role);

            // Add message as new
            const newMessage: Message = {
                role,
                content: content,
                isComplete: false,
            };
            setMessages((prev) => [...prev, newMessage]);
        }
    };

    // const simulateUserResponse = () => {
    //     // For demo, we'll simulate user speaking after a delay
    //     setTimeout(() => {
    //         const userResponses = [
    //             "I've been having headaches and feeling dizzy for the past few days.",
    //             "The pain is mostly on the right side of my head and gets worse when I stand up quickly.",
    //             "Yes, I've been feeling more tired than usual and having trouble sleeping.",
    //             "I took some over-the-counter pain medication but it only helps temporarily.",
    //             "No, I don't have any history of migraines or head injuries.",
    //         ];

    //         // Get next response based on message count
    //         const responseIndex = Math.floor(messages.length / 2);

    //         // Only proceed if we haven't reached the end of responses and conversation isn't complete
    //         if (
    //             responseIndex >= 0 &&
    //             responseIndex < userResponses.length &&
    //             !conversationComplete
    //         ) {
    //             setIsListening(false);
    //             addMessage("user", userResponses[responseIndex]);

    //             // AI response after user speaks
    //             setTimeout(() => {
    //                 const aiResponses = [
    //                     "I understand. Can you tell me more about these headaches? Are they on a specific side of your head, and have you noticed anything that makes them better or worse?",
    //                     "Thank you for that information. Have you been experiencing any other symptoms along with the headaches and dizziness, such as fatigue, nausea, or vision changes?",
    //                     "I see. Have you taken any medication for these symptoms, and if so, did it provide any relief?",
    //                     "Do you have any history of migraines, head injuries, or similar headaches in the past?",
    //                     "Based on the information you've provided, your symptoms are consistent with tension headaches, possibly with some migraine features. I recommend taking regular breaks from screens, staying hydrated, and practicing stress-reduction techniques. If symptoms persist or worsen, a consultation with a healthcare provider would be advisable.",
    //                 ];

    //                 if (responseIndex < aiResponses.length) {
    //                     addMessage("ai", aiResponses[responseIndex]);

    //                     // End conversation after last AI response
    //                     if (responseIndex === aiResponses.length - 1) {
    //                         setTimeout(() => {
    //                             setConversationComplete(true);
    //                         }, 2000);
    //                     }
    //                 }
    //             }, 1000);
    //         }
    //     }, 3000);
    // };

    const handleContinue = () => {
        // Update user data with conversation summary
        updateUserData({
            aiConversation: {
                summary: callSummary,
                recommendations: [
                    "Symptoms consistent with tension headaches with possible migraine features",
                    "Take regular breaks from screens",
                    "Stay hydrated",
                    "Practice stress-reduction techniques",
                    "Consult healthcare provider if symptoms persist or worsen",
                ],
            },
            diagnosisResult: {
                condition: "Tension Headache with Migraine Features",
                severity: "medium",
                nextStep: "medication",
            },
        });
        onNext();
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
            <Card className="w-full mb-8 shadow-lg border-teal-100">
                <CardContent className="p-8">
                    <h2 className="text-3xl font-semibold text-teal-700 mb-6 text-center">
                        AI Medical Consultation
                    </h2>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 h-96 overflow-y-auto">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        message.role === "assistant"
                                            ? "justify-start"
                                            : "justify-end"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 rounded-2xl ${
                                            message.role === "assistant"
                                                ? "bg-teal-100 text-teal-800 rounded-bl-none"
                                                : "bg-blue-100 text-blue-800 rounded-br-none"
                                        }`}
                                    >
                                        {message.role === "assistant" && (
                                            <div className="flex items-center mb-2">
                                                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center mr-2">
                                                    <BotIcon className="h-5 w-5 text-white" />
                                                </div>
                                                <span className="font-medium">
                                                    AI Assistant
                                                </span>
                                            </div>
                                        )}
                                        {message.role === "user" && (
                                            <div className="flex items-center justify-end mb-2">
                                                <span className="font-medium">
                                                    You
                                                </span>
                                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2">
                                                    <UserIcon className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                        )}
                                        <p>{message.content}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Waveform visualization */}
                    <div className="h-24 mb-6 bg-gray-100 rounded-lg overflow-hidden relative">
                        {activeSpeaker === "assistant" && (
                            <Visualizer
                                volumeLevel={volumeLevel}
                                isSessionActive={connected}
                            ></Visualizer>
                        )}

                        {activeSpeaker === "user" && (
                            <Visualizer
                                volumeLevel={volumeLevel}
                                isSessionActive={connected}
                            ></Visualizer>
                        )}

                        {assistantIsSpeaking && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <MicIcon className="h-10 w-10 text-red-500 mx-auto animate-pulse mb-2" />
                                    <p className="text-gray-700">
                                        Listening...
                                    </p>
                                </div>
                            </div>
                        )}

                        {!activeSpeaker && !assistantIsSpeaking && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-gray-500">
                                    {conversationComplete
                                        ? "Consultation complete"
                                        : "Waiting for response..."}
                                </p>
                            </div>
                        )}
                    </div>
                    {!connected && (
                        <div className="flex justify-center">
                            <Button
                                size="lg"
                                className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                                disabled={connecting}
                                onClick={startCall}
                            >
                                {connecting ? "Connecting..." : "Start"}
                            </Button>
                        </div>
                    )}
                    {!conversationComplete ? (
                        <div className="flex justify-center"></div>
                    ) : (
                        <div className="text-center">
                            <p className="text-lg text-gray-600 mb-4">
                                The AI consultation is complete. You can now
                                proceed to view your diagnosis summary.
                            </p>
                            <Button
                                onClick={handleContinue}
                                size="lg"
                                className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700"
                            >
                                View Diagnosis
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {!conversationComplete && (
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
            )}
        </div>
    );
}
