"use client";
import { Howl } from "howler";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { UserData } from "@/app/page";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import useSound from "use-sound";

interface BodyPainSelectionScreenProps {
    onNext: () => void;
    onBack: () => void;
    updateUserData: (data: Partial<UserData>) => void;
    userData: UserData;
}

export default function BodyPainSelectionScreen({
    onNext,
    onBack,
    updateUserData,
    userData,
}: BodyPainSelectionScreenProps) {
    const [selectedAreas, setSelectedAreas] = useState<string[]>(
        userData.painAreas || []
    );
    // Use gender from userData, defaulting to "male" if not available
    const [gender, setGender] = useState<"male" | "female">(
        userData.gender?.toLowerCase() === "female" ? "female" : "male"
    );

    // Update gender if userData changes
    useEffect(() => {
        if (userData.gender) {
            setGender(
                userData.gender.toLowerCase() === "female" ? "female" : "male"
            );
        }
    }, [userData.gender]);

    // Body parts for front view
    const frontBodyParts = [
        { id: "head", name: "Head", top: "5%", left: "50%", width: "15%" },
        { id: "face", name: "Face", top: "10%", left: "50%", width: "12%" },
        { id: "neck", name: "Neck", top: "15%", left: "50%", width: "10%" },
        {
            id: "leftShoulder",
            name: "Left Shoulder",
            top: "20%",
            left: "35%",
            width: "10%",
        },
        {
            id: "rightShoulder",
            name: "Right Shoulder",
            top: "20%",
            left: "65%",
            width: "10%",
        },
        { id: "chest", name: "Chest", top: "25%", left: "50%", width: "20%" },
        {
            id: "leftArm",
            name: "Left Arm",
            top: "30%",
            left: "25%",
            width: "8%",
        },
        {
            id: "rightArm",
            name: "Right Arm",
            top: "30%",
            left: "75%",
            width: "8%",
        },
        {
            id: "abdomen",
            name: "Abdomen",
            top: "38%",
            left: "50%",
            width: "20%",
        },
        {
            id: "leftHand",
            name: "Left Hand",
            top: "45%",
            left: "20%",
            width: "8%",
        },
        {
            id: "rightHand",
            name: "Right Hand",
            top: "45%",
            left: "80%",
            width: "8%",
        },
        { id: "pelvis", name: "Pelvis", top: "52%", left: "50%", width: "15%" },
        {
            id: "leftThigh",
            name: "Left Thigh",
            top: "62%",
            left: "40%",
            width: "10%",
        },
        {
            id: "rightThigh",
            name: "Right Thigh",
            top: "62%",
            left: "60%",
            width: "10%",
        },
        {
            id: "leftKnee",
            name: "Left Knee",
            top: "72%",
            left: "40%",
            width: "8%",
        },
        {
            id: "rightKnee",
            name: "Right Knee",
            top: "72%",
            left: "60%",
            width: "8%",
        },
        {
            id: "leftLeg",
            name: "Left Leg",
            top: "82%",
            left: "40%",
            width: "8%",
        },
        {
            id: "rightLeg",
            name: "Right Leg",
            top: "82%",
            left: "60%",
            width: "8%",
        },
        {
            id: "leftFoot",
            name: "Left Foot",
            top: "92%",
            left: "40%",
            width: "8%",
        },
        {
            id: "rightFoot",
            name: "Right Foot",
            top: "92%",
            left: "60%",
            width: "8%",
        },
    ];

    // Body parts for back view
    const backBodyParts = [
        {
            id: "backHead",
            name: "Back of Head",
            top: "5%",
            left: "50%",
            width: "15%",
        },
        {
            id: "upperBack",
            name: "Upper Back",
            top: "20%",
            left: "50%",
            width: "20%",
        },
        {
            id: "leftUpperBack",
            name: "Left Upper Back",
            top: "20%",
            left: "35%",
            width: "10%",
        },
        {
            id: "rightUpperBack",
            name: "Right Upper Back",
            top: "20%",
            left: "65%",
            width: "10%",
        },
        {
            id: "midBack",
            name: "Mid Back",
            top: "30%",
            left: "50%",
            width: "20%",
        },
        {
            id: "leftBackArm",
            name: "Left Back Arm",
            top: "30%",
            left: "25%",
            width: "8%",
        },
        {
            id: "rightBackArm",
            name: "Right Back Arm",
            top: "30%",
            left: "75%",
            width: "8%",
        },
        {
            id: "lowerBack",
            name: "Lower Back",
            top: "40%",
            left: "50%",
            width: "20%",
        },
        {
            id: "leftBackHand",
            name: "Left Back Hand",
            top: "45%",
            left: "20%",
            width: "8%",
        },
        {
            id: "rightBackHand",
            name: "Right Back Hand",
            top: "45%",
            left: "80%",
            width: "8%",
        },
        {
            id: "buttocks",
            name: "Buttocks",
            top: "52%",
            left: "50%",
            width: "15%",
        },
        {
            id: "leftBackThigh",
            name: "Left Back Thigh",
            top: "62%",
            left: "40%",
            width: "10%",
        },
        {
            id: "rightBackThigh",
            name: "Right Back Thigh",
            top: "62%",
            left: "60%",
            width: "10%",
        },
        {
            id: "leftBackKnee",
            name: "Left Back Knee",
            top: "72%",
            left: "40%",
            width: "8%",
        },
        {
            id: "rightBackKnee",
            name: "Right Back Knee",
            top: "72%",
            left: "60%",
            width: "8%",
        },
        {
            id: "leftBackLeg",
            name: "Left Back Leg",
            top: "82%",
            left: "40%",
            width: "8%",
        },
        {
            id: "rightBackLeg",
            name: "Right Back Leg",
            top: "82%",
            left: "60%",
            width: "8%",
        },
        {
            id: "leftBackFoot",
            name: "Left Back Foot",
            top: "92%",
            left: "40%",
            width: "8%",
        },
        {
            id: "rightBackFoot",
            name: "Right Back Foot",
            top: "92%",
            left: "60%",
            width: "8%",
        },
    ];

    const toggleBodyPart = (partId: string) => {
        setSelectedAreas((prev) => {
            if (prev.includes(partId)) {
                return prev.filter((id) => id !== partId);
            } else {
                return [...prev, partId];
            }
        });
    };

    const handleContinue = () => {
        updateUserData({
            painAreas: selectedAreas,
        });
        onNext();
    };

    const handleSkip = () => {
        updateUserData({
            painAreas: [],
        });
        onNext();
    };

    // Function to manually override gender if needed
    const toggleGender = () => {
        setGender(gender === "male" ? "female" : "male");
    };

    const [play, { stop }] = useSound(
        `/audio/pain_${userData.language}.${
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
        <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto">
            <Card className="w-full mb-8 shadow-lg border-teal-100">
                <CardContent className="p-8">
                    <h2 className="text-3xl font-semibold text-teal-700 mb-6 text-center">
                        Select Areas of Pain or Discomfort
                    </h2>

                    <div className="space-y-6">
                        <p className="text-lg text-gray-600 text-center mb-4">
                            Please tap on the body diagrams to indicate where
                            you are experiencing pain or discomfort. You can
                            select multiple areas on both the front and back
                            views.
                        </p>

                        <div className="flex justify-end mb-4">
                            <div className="flex items-center space-x-2">
                                <Label
                                    htmlFor="gender-toggle"
                                    className="text-gray-700"
                                >
                                    {gender === "male" ? "Male" : "Female"}{" "}
                                    Anatomy
                                </Label>
                                <Switch
                                    id="gender-toggle"
                                    checked={gender === "female"}
                                    onCheckedChange={toggleGender}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Front view */}
                            <div className="flex flex-col items-center">
                                <h3 className="text-lg font-medium text-teal-700 mb-3">
                                    Front View
                                </h3>
                                <div className="relative w-56 h-80 bg-gray-50 border border-gray-200 rounded-lg">
                                    {/* Human body outline - front view */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg
                                            viewBox="0 0 100 200"
                                            className="w-full h-full"
                                        >
                                            {/* Front body outline - different for male/female */}
                                            {gender === "male" ? (
                                                // Male front body outline
                                                <>
                                                    <path
                                                        d="M50,10 C60,10 65,15 65,25 C65,35 60,40 55,42 L55,55 L65,70 L65,100 L60,110 L60,140 L50,150 L40,140 L40,110 L35,100 L35,70 L45,55 L45,42 C40,40 35,35 35,25 C35,15 40,10 50,10 Z"
                                                        fill="none"
                                                        stroke="#ccc"
                                                        strokeWidth="1"
                                                    />
                                                    {/* Male chest */}
                                                    <path
                                                        d="M45,55 C45,60 40,65 40,70 M55,55 C55,60 60,65 60,70"
                                                        fill="none"
                                                        stroke="#ccc"
                                                        strokeWidth="1"
                                                    />
                                                </>
                                            ) : (
                                                // Female front body outline
                                                <>
                                                    <path
                                                        d="M50,10 C60,10 65,15 65,25 C65,35 60,40 55,42 L55,55 L65,70 L65,100 L60,110 L60,140 L50,150 L40,140 L40,110 L35,100 L35,70 L45,55 L45,42 C40,40 35,35 35,25 C35,15 40,10 50,10 Z"
                                                        fill="none"
                                                        stroke="#ccc"
                                                        strokeWidth="1"
                                                    />
                                                    {/* Female chest */}
                                                    <circle
                                                        cx="42"
                                                        cy="60"
                                                        r="5"
                                                        fill="none"
                                                        stroke="#ccc"
                                                        strokeWidth="1"
                                                    />
                                                    <circle
                                                        cx="58"
                                                        cy="60"
                                                        r="5"
                                                        fill="none"
                                                        stroke="#ccc"
                                                        strokeWidth="1"
                                                    />
                                                </>
                                            )}
                                            {/* Arms - same for both genders */}
                                            <path
                                                d="M55,55 L80,70 L85,90 M45,55 L20,70 L15,90"
                                                fill="none"
                                                stroke="#ccc"
                                                strokeWidth="1"
                                            />
                                            {/* Legs - same for both genders */}
                                            <path
                                                d="M50,150 L50,190 M40,140 L35,190 M60,140 L65,190"
                                                fill="none"
                                                stroke="#ccc"
                                                strokeWidth="1"
                                            />
                                        </svg>
                                    </div>

                                    {/* Clickable body parts - front */}
                                    {frontBodyParts.map((part) => (
                                        <button
                                            key={part.id}
                                            className={`absolute rounded-full ${
                                                selectedAreas.includes(part.id)
                                                    ? "bg-red-400 opacity-70"
                                                    : "bg-transparent border-2 border-dashed border-gray-400 opacity-50 hover:opacity-100"
                                            }`}
                                            style={{
                                                top: part.top,
                                                left: part.left,
                                                width: part.width,
                                                height: part.width,
                                                transform:
                                                    "translate(-50%, -50%)",
                                            }}
                                            onClick={() =>
                                                toggleBodyPart(part.id)
                                            }
                                            aria-label={part.name}
                                        ></button>
                                    ))}
                                </div>
                            </div>

                            {/* Back view */}
                            <div className="flex flex-col items-center">
                                <h3 className="text-lg font-medium text-teal-700 mb-3">
                                    Back View
                                </h3>
                                <div className="relative w-56 h-80 bg-gray-50 border border-gray-200 rounded-lg">
                                    {/* Human body outline - back view */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg
                                            viewBox="0 0 100 200"
                                            className="w-full h-full"
                                        >
                                            {/* Back body outline - different for male/female */}
                                            {gender === "male" ? (
                                                // Male back body outline
                                                <>
                                                    <path
                                                        d="M50,10 C60,10 65,15 65,25 C65,35 60,40 55,42 L55,55 L65,70 L65,100 L60,110 L60,140 L50,150 L40,140 L40,110 L35,100 L35,70 L45,55 L45,42 C40,40 35,35 35,25 C35,15 40,10 50,10 Z"
                                                        fill="none"
                                                        stroke="#ccc"
                                                        strokeWidth="1"
                                                    />
                                                    {/* Male back details */}
                                                    <path
                                                        d="M40,70 L60,70 M40,80 L60,80 M40,90 L60,90"
                                                        fill="none"
                                                        stroke="#ccc"
                                                        strokeWidth="1"
                                                    />
                                                </>
                                            ) : (
                                                // Female back body outline
                                                <>
                                                    <path
                                                        d="M50,10 C60,10 65,15 65,25 C65,35 60,40 55,42 L55,55 L65,70 L65,100 L60,110 L60,140 L50,150 L40,140 L40,110 L35,100 L35,70 L45,55 L45,42 C40,40 35,35 35,25 C35,15 40,10 50,10 Z"
                                                        fill="none"
                                                        stroke="#ccc"
                                                        strokeWidth="1"
                                                    />
                                                    {/* Female back details - narrower waist */}
                                                    <path
                                                        d="M40,70 L60,70 M38,90 L62,90 M40,110 L60,110"
                                                        fill="none"
                                                        stroke="#ccc"
                                                        strokeWidth="1"
                                                    />
                                                </>
                                            )}
                                            {/* Arms - same for both genders */}
                                            <path
                                                d="M55,55 L80,70 L85,90 M45,55 L20,70 L15,90"
                                                fill="none"
                                                stroke="#ccc"
                                                strokeWidth="1"
                                            />
                                            {/* Legs - same for both genders */}
                                            <path
                                                d="M50,150 L50,190 M40,140 L35,190 M60,140 L65,190"
                                                fill="none"
                                                stroke="#ccc"
                                                strokeWidth="1"
                                            />
                                        </svg>
                                    </div>

                                    {/* Clickable body parts - back */}
                                    {backBodyParts.map((part) => (
                                        <button
                                            key={part.id}
                                            className={`absolute rounded-full ${
                                                selectedAreas.includes(part.id)
                                                    ? "bg-red-400 opacity-70"
                                                    : "bg-transparent border-2 border-dashed border-gray-400 opacity-50 hover:opacity-100"
                                            }`}
                                            style={{
                                                top: part.top,
                                                left: part.left,
                                                width: part.width,
                                                height: part.width,
                                                transform:
                                                    "translate(-50%, -50%)",
                                            }}
                                            onClick={() =>
                                                toggleBodyPart(part.id)
                                            }
                                            aria-label={part.name}
                                        ></button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center">
                            {selectedAreas.map((areaId) => {
                                const frontPart = frontBodyParts.find(
                                    (p) => p.id === areaId
                                );
                                const backPart = backBodyParts.find(
                                    (p) => p.id === areaId
                                );
                                const part = frontPart || backPart;

                                return part ? (
                                    <div
                                        key={areaId}
                                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        {part.name}
                                    </div>
                                ) : null;
                            })}
                            {selectedAreas.length === 0 && (
                                <div className="text-gray-500 italic">
                                    No areas selected
                                </div>
                            )}
                        </div>

                        <div className="text-center text-gray-600">
                            <p>
                                Tap on the body diagrams to select areas of pain
                                or discomfort.
                            </p>
                            <p>
                                You can select multiple areas on both the front
                                and back views.
                            </p>
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
                <Button
                    onClick={handleSkip}
                    variant="outline"
                    size="lg"
                    className="text-lg py-6 px-8"
                >
                    Skip
                </Button>
                <Button
                    onClick={handleContinue}
                    size="lg"
                    className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700"
                >
                    Continue
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
