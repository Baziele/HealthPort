"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserData } from "@/app/page";
import { ArrowLeftIcon, MicIcon, BotIcon, UserIcon } from "lucide-react";
import WaveSurfer from "wavesurfer.js";
import useSound from "use-sound";

// Utility function to convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): Blob {
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2;
    const sampleRate = buffer.sampleRate;

    // Create the buffer for the WAV file
    const wavBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(wavBuffer);

    // Write the WAV container
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChannels * 2, true);
    view.setUint16(32, numOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, length, true);

    // Write the PCM audio data
    const channelData = [];
    for (let i = 0; i < numOfChannels; i++) {
        channelData.push(buffer.getChannelData(i));
    }

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numOfChannels; channel++) {
            const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
            const value = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
            view.setInt16(offset, value, true);
            offset += 2;
        }
    }

    return new Blob([wavBuffer], { type: "audio/wav" });
}

// Helper function to write strings to DataView
function writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

interface AIConversationScreenProps {
    onNext: () => void;
    onBack: () => void;
    updateUserData: (data: Partial<UserData>) => void;
    userData: UserData;
}

interface Message {
    role: "ai" | "user";
    content: string;
    isComplete: boolean;
}

export default function AIConversationScreen({
    onNext,
    onBack,
    updateUserData,
    userData,
}: AIConversationScreenProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [conversationComplete, setConversationComplete] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [activeSpeaker, setActiveSpeaker] = useState<"ai" | "user" | null>(
        null
    );
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    // Audio recording states
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioStreamRef = useRef<MediaStream | null>(null);

    // Sound playback hook
    const [play, { stop }] = useSound(
        `/audio/ai_${userData.language}.${
            userData.language === "akan" ? "m4a" : "mp3"
        }`,
        1.0
    );

    // Initial AI greeting
    useEffect(() => {
        setTimeout(() => {
            addMessage(
                "ai",
                `Hello ${userData.name}, I'm your AI medical assistant. I'll be asking you some questions about your symptoms to help provide a preliminary assessment. How can I help you today?`
            );
        }, 1000);
    }, [userData.name]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initialize WaveSurfer
    useEffect(() => {
        if (waveformRef.current && !wavesurferRef.current) {
            // Create WaveSurfer instance
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: "#d1d5db",
                progressColor: "#0d9488",
                cursorWidth: 0,
                barWidth: 2,
                barGap: 2,
                barRadius: 3,
                height: 80,
                normalize: true,
            });

            // Generate random audio data for visualization
            const sampleRate = 44100;
            const duration = 3; // seconds
            const numSamples = sampleRate * duration;
            const audioData = new Float32Array(numSamples);

            // Initialize with silence
            for (let i = 0; i < numSamples; i++) {
                audioData[i] = 0;
            }

            // Create an audio blob from the data
            const audioContext = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
            const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
            const channelData = buffer.getChannelData(0);
            channelData.set(audioData);

            // For WaveSurfer v7+, we need to use a different approach
            // Create a silent audio file
            const silentAudio = new Audio();
            silentAudio.src =
                "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

            // Load the silent audio
            wavesurfer.load(silentAudio.src);
            wavesurferRef.current = wavesurfer;
        }

        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
                wavesurferRef.current = null;
            }
        };
    }, []);

    // Audio recording functionality
    const startRecording = async () => {
        try {
            // Reset audio chunks
            audioChunksRef.current = [];

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            audioStreamRef.current = stream;

            // Create media recorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            // Set up event handlers
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                // Create blob from recorded chunks
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: "audio/webm",
                });
                setAudioBlob(audioBlob);

                // Visualize the recorded audio
                visualizeRecordedAudio(audioBlob);

                // Stop all tracks in the stream
                if (audioStreamRef.current) {
                    audioStreamRef.current
                        .getTracks()
                        .forEach((track) => track.stop());
                }

                // Simulate user message after recording
                simulateUserResponse();
            };

            // Start recording
            mediaRecorder.start();
            setIsRecording(true);
            setIsListening(true);

            // Update wavesurfer for recording state
            if (wavesurferRef.current) {
                wavesurferRef.current.setOptions({
                    waveColor: "#fca5a5",
                    progressColor: "#ef4444",
                });
            }

            // Visualize microphone input in real-time
            visualizeMicrophoneInput(stream);
        } catch (error) {
            console.error("Error starting recording:", error);
            setIsRecording(false);
            setIsListening(false);
        }
    };

    const stopRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
        ) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const visualizeMicrophoneInput = (stream: MediaStream) => {
        if (!wavesurferRef.current) return;

        // Create analyzer for real-time visualization
        const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Update visualization at animation frame rate
        const updateWaveform = () => {
            if (!isRecording || !wavesurferRef.current) return;

            analyser.getByteTimeDomainData(dataArray);

            // Convert to float32 for wavesurfer
            const audioBuffer = audioContext.createBuffer(
                1,
                bufferLength,
                audioContext.sampleRate
            );
            const channelData = audioBuffer.getChannelData(0);

            // Normalize the data for visualization
            for (let i = 0; i < bufferLength; i++) {
                // Convert from 0-255 to -1.0 to 1.0
                channelData[i] = dataArray[i] / 128.0 - 1.0;
            }

            // Convert buffer to blob and load it
            const audioBlob = audioBufferToWav(audioBuffer);
            const audioUrl = URL.createObjectURL(audioBlob);
            wavesurferRef.current.load(audioUrl);

            // Clean up URL after loading
            setTimeout(() => URL.revokeObjectURL(audioUrl), 100);

            // Continue updating if still recording
            if (isRecording) {
                requestAnimationFrame(updateWaveform);
            }
        };

        updateWaveform();
    };

    const visualizeRecordedAudio = async (audioBlob: Blob) => {
        if (!wavesurferRef.current) return;

        try {
            // Create audio element to decode the blob
            const audioUrl = URL.createObjectURL(audioBlob);

            // Load the audio file into wavesurfer
            wavesurferRef.current.load(audioUrl);

            // Set user as active speaker
            setActiveSpeaker("user");

            // Clean up URL object after loading
            setTimeout(() => {
                URL.revokeObjectURL(audioUrl);
            }, 1000);
        } catch (error) {
            console.error("Error visualizing recorded audio:", error);
            // Fallback to simulated waveform
            simulateWaveform("user");
        }
    };

    // Update waveform based on active speaker
    useEffect(() => {
        if (!wavesurferRef.current) return;

        // Update waveform colors based on active speaker
        if (activeSpeaker === "ai") {
            wavesurferRef.current.setOptions({
                waveColor: "#5eead4",
                progressColor: "#0d9488",
            });
            simulateWaveform("ai");
        } else if (activeSpeaker === "user") {
            wavesurferRef.current.setOptions({
                waveColor: "#93c5fd",
                progressColor: "#3b82f6",
            });
            simulateWaveform("user");
        } else if (isListening) {
            wavesurferRef.current.setOptions({
                waveColor: "#fca5a5",
                progressColor: "#ef4444",
            });
            simulateWaveform("listening");
        } else {
            // Idle state
            wavesurferRef.current.setOptions({
                waveColor: "#d1d5db",
                progressColor: "#9ca3af",
            });

            // Reset to flat line - create a silent audio
            const silentAudio = new Audio();
            silentAudio.src =
                "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
            wavesurferRef.current.load(silentAudio.src);
        }
    }, [activeSpeaker, isListening]);

    // Simulate waveform animation
    const simulateWaveform = (type: "ai" | "user" | "listening") => {
        if (!wavesurferRef.current) return;

        const sampleRate = 44100;
        const duration = 3; // seconds
        const numSamples = sampleRate * duration;
        const audioData = new Float32Array(numSamples);

        // Generate different patterns based on speaker
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;

            if (type === "ai") {
                // Smoother, more regular pattern for AI
                audioData[i] =
                    0.3 * Math.sin(2 * Math.PI * 2 * t) +
                    0.2 * Math.sin(2 * Math.PI * 4 * t) +
                    0.1 * Math.sin(2 * Math.PI * 8 * t) +
                    0.05 * Math.random();
            } else if (type === "user") {
                // More varied, human-like pattern
                audioData[i] =
                    0.25 * Math.sin(2 * Math.PI * 1.5 * t) +
                    0.25 * Math.sin(2 * Math.PI * 3.5 * t) +
                    0.15 * Math.sin(2 * Math.PI * 7 * t) +
                    0.2 * Math.random();
            } else if (type === "listening") {
                // Subtle background noise pattern
                audioData[i] = 0.1 + 0.15 * Math.random();
            }
        }

        // Apply envelope to smooth start and end
        const fadeLength = sampleRate * 0.1; // 100ms fade
        for (let i = 0; i < fadeLength; i++) {
            const fadeIn = i / fadeLength;
            const fadeOut = (numSamples - i - 1) / fadeLength;

            if (i < fadeLength) {
                audioData[i] *= fadeIn;
            }
            if (i > numSamples - fadeLength) {
                audioData[numSamples - i - 1] *= fadeOut;
            }
        }

        // Create an audio context
        const audioCtx = new (window.AudioContext ||
            (window as any).webkitAudioContext)();

        // Create a buffer with our waveform data
        const buffer = audioCtx.createBuffer(1, numSamples, sampleRate);
        const channelData = buffer.getChannelData(0);
        channelData.set(audioData);

        // Convert the buffer to a WAV blob
        const audioBlob = audioBufferToWav(buffer);

        // Create a URL for the blob
        const audioUrl = URL.createObjectURL(audioBlob);

        // Load the audio into wavesurfer
        wavesurferRef.current.load(audioUrl);

        // Clean up URL after loading
        setTimeout(() => URL.revokeObjectURL(audioUrl), 100);

        // Start playback to animate the waveform
        wavesurferRef.current.play();
    };

    const addMessage = (role: "ai" | "user", content: string) => {
        // Set active speaker
        setActiveSpeaker(role);

        // Add message with typing effect
        const newMessage: Message = { role, content: "", isComplete: false };
        setMessages((prev) => [...prev, newMessage]);

        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < content.length) {
                setMessages((prev) => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    updated[lastIndex] = {
                        ...updated[lastIndex],
                        content: content.substring(0, i + 1),
                    };
                    return updated;
                });
                i++;
            } else {
                clearInterval(typingInterval);
                setMessages((prev) => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    updated[lastIndex] = {
                        ...updated[lastIndex],
                        isComplete: true,
                    };
                    return updated;
                });

                setActiveSpeaker(null);

                // If this was an AI message, we might want to wait for user response
                if (role === "ai" && !conversationComplete) {
                    // For demo, we'll simulate listening after AI speaks
                    setTimeout(() => {
                        setIsListening(true);
                        simulateUserResponse();
                    }, 1000);
                }
            }
        }, 30); // Adjust typing speed as needed
    };

    const simulateUserResponse = () => {
        // Get predefined responses for demo purposes
        const userResponses = [
            "I've been having headaches and feeling dizzy for the past few days.",
            "The pain is mostly on the right side of my head and gets worse when I stand up quickly.",
            "Yes, I've been feeling more tired than usual and having trouble sleeping.",
            "I took some over-the-counter pain medication but it only helps temporarily.",
            "No, I don't have any history of migraines or head injuries.",
        ];

        // Get next response based on message count
        const responseIndex = Math.floor(messages.length / 2);

        if (responseIndex >= 0 && responseIndex < userResponses.length) {
            // Set listening to false
            setIsListening(false);

            // In a real app, we would process the audio recording here
            // For demo, we'll use the predefined responses
            addMessage("user", userResponses[responseIndex]);

            // AI response after user speaks
            setTimeout(() => {
                const aiResponses = [
                    "I understand. Can you tell me more about these headaches? Are they on a specific side of your head, and have you noticed anything that makes them better or worse?",
                    "Thank you for that information. Have you been experiencing any other symptoms along with the headaches and dizziness, such as fatigue, nausea, or vision changes?",
                    "I see. Have you taken any medication for these symptoms, and if so, did it provide any relief?",
                    "Do you have any history of migraines, head injuries, or similar headaches in the past?",
                    "Based on the information you've provided, your symptoms are consistent with tension headaches, possibly with some migraine features. I recommend taking regular breaks from screens, staying hydrated, and practicing stress-reduction techniques. If symptoms persist or worsen, a consultation with a healthcare provider would be advisable.",
                ];

                if (responseIndex < aiResponses.length) {
                    addMessage("ai", aiResponses[responseIndex]);

                    // End conversation after last AI response
                    if (responseIndex === aiResponses.length - 1) {
                        setTimeout(() => {
                            setConversationComplete(true);
                        }, 2000);
                    }
                }
            }, 1000);
        }
    };

    const handleContinue = () => {
        // Update user data with conversation summary
        updateUserData({
            aiConversation: {
                summary:
                    "Patient reported headaches and dizziness for several days, primarily on the right side, worsening with position changes. Also experiencing fatigue and sleep disturbances. Over-the-counter medication provides only temporary relief.",
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

    // Play greeting sound if enabled
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
                        AI Medical Consultation
                    </h2>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 h-96 overflow-y-auto">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        message.role === "ai"
                                            ? "justify-start"
                                            : "justify-end"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 rounded-2xl ${
                                            message.role === "ai"
                                                ? "bg-teal-100 text-teal-800 rounded-bl-none"
                                                : "bg-blue-100 text-blue-800 rounded-br-none"
                                        }`}
                                    >
                                        {message.role === "ai" && (
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

                    {/* Enhanced audio visualization with WaveSurfer.js */}
                    <div className="h-24 mb-6 bg-gray-50 rounded-lg overflow-hidden relative border border-gray-200">
                        <div ref={waveformRef} className="w-full h-full"></div>

                        {isListening && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <MicIcon className="h-10 w-10 text-red-500 mx-auto animate-pulse mb-2" />
                                    <p className="text-gray-700 font-medium">
                                        Listening...
                                    </p>
                                </div>
                            </div>
                        )}

                        {!activeSpeaker && !isListening && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-gray-500">
                                    {conversationComplete
                                        ? "Consultation complete"
                                        : "Waiting for response..."}
                                </p>
                            </div>
                        )}

                        {activeSpeaker && (
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                                <div
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        activeSpeaker === "ai"
                                            ? "bg-teal-100 text-teal-800"
                                            : "bg-blue-100 text-blue-800"
                                    }`}
                                >
                                    {activeSpeaker === "ai"
                                        ? "AI Speaking"
                                        : "You Speaking"}
                                </div>
                            </div>
                        )}
                    </div>

                    {conversationComplete ? (
                        <div className="flex justify-center">
                            <Button
                                disabled={activeSpeaker !== null}
                                onClick={
                                    isRecording ? stopRecording : startRecording
                                }
                                size="lg"
                                className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                            >
                                <MicIcon className="mr-2 h-5 w-5" />
                                {isListening ? "Stop Recording" : "Speak"}
                            </Button>
                        </div>
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
