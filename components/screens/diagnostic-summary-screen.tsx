"use client";
import { Howl } from "howler";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserData } from "@/app/page";
import {
    ArrowLeftIcon,
    AlertTriangleIcon,
    InfoIcon,
    AlertCircleIcon,
    VideoIcon,
    PillIcon,
    ClipboardListIcon,
    PrinterIcon,
} from "lucide-react";
import { useEffect } from "react";
import useSound from "use-sound";

interface DiagnosticSummaryScreenProps {
    onNext: () => void;
    onBack: () => void;
    updateUserData: (data: Partial<UserData>) => void;
    userData: UserData;
}

export default function DiagnosticSummaryScreen({
    onNext,
    onBack,
    updateUserData,
    userData,
}: DiagnosticSummaryScreenProps) {
    const getSeverityIcon = (severity: "low" | "medium" | "high") => {
        switch (severity) {
            case "low":
                return (
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <InfoIcon className="h-6 w-6 text-green-500" />
                    </div>
                );
            case "medium":
                return (
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <AlertTriangleIcon className="h-6 w-6 text-yellow-500" />
                    </div>
                );
            case "high":
                return (
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircleIcon className="h-6 w-6 text-red-500" />
                    </div>
                );
        }
    };

    const getSeverityColor = (severity: "low" | "medium" | "high") => {
        switch (severity) {
            case "low":
                return "bg-green-100 text-green-800 border-green-200";
            case "medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "high":
                return "bg-red-100 text-red-800 border-red-200";
        }
    };

    const getSeverityText = (severity: "low" | "medium" | "high") => {
        switch (severity) {
            case "low":
                return "Low Severity";
            case "medium":
                return "Medium Severity";
            case "high":
                return "High Severity";
        }
    };

    const handleSelectNextStep = (nextStep: string) => {
        updateUserData({
            diagnosisResult: {
                ...userData.diagnosisResult,
                nextStep: nextStep as
                    | "consultation"
                    | "medication"
                    | "selfCare"
                    | "referral",
            },
        });
        onNext();
    };

    // Next steps options
    const nextSteps = [
        {
            id: "medication",
            title: "Medication",
            description: "Receive medication recommendations and prescription",
            icon: <PillIcon className="h-6 w-6" />,
        },
        {
            id: "consultation",
            title: "Video Consultation",
            description: "Speak with a healthcare provider",
            icon: <VideoIcon className="h-6 w-6" />,
        },
        {
            id: "referral",
            title: "Referral",
            description: "Visit a nearby clinic for further evaluation",
            icon: <ClipboardListIcon className="h-6 w-6" />,
        },
    ];

    const [play, { stop }] = useSound(
        `/audio/vitalsOverview_${userData.language}.${
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
                        Diagnostic Summary
                    </h2>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            {getSeverityIcon(userData.diagnosisResult.severity)}
                            <div>
                                <h3 className="text-2xl font-medium text-gray-800 mb-2">
                                    {userData.diagnosisResult.condition}
                                </h3>
                                <div
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getSeverityColor(
                                        userData.diagnosisResult.severity
                                    )}`}
                                >
                                    {getSeverityText(
                                        userData.diagnosisResult.severity
                                    )}
                                </div>
                                <p className="text-lg text-gray-600">
                                    Based on your symptoms and vital signs, our
                                    AI assessment indicates you may be
                                    experiencing{" "}
                                    {userData.diagnosisResult.condition.toLowerCase()}
                                    .
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <h3 className="text-xl font-medium text-gray-800 mb-4">
                                Consultation Summary
                            </h3>
                            <p className="text-lg text-gray-600 mb-4">
                                {userData.aiConversation.summary}
                            </p>

                            <h4 className="text-lg font-medium text-gray-800 mb-2">
                                Recommendations:
                            </h4>
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                {userData.aiConversation.recommendations.map(
                                    (recommendation, index) => (
                                        <li key={index} className="text-lg">
                                            {recommendation}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-xl font-medium text-blue-700 mb-4">
                                Health Metrics Summary
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600 font-medium">
                                        BMI:
                                    </p>
                                    <p className="text-lg">
                                        {userData.biometrics.bmi} (
                                        {userData.healthMetrics.bmiCategory})
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium">
                                        Temperature:
                                    </p>
                                    <p className="text-lg">
                                        {userData.biometrics.temperature}°C (
                                        {
                                            userData.healthMetrics
                                                .temperatureStatus
                                        }
                                        )
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium">
                                        Heart Rate:
                                    </p>
                                    <p className="text-lg">
                                        {userData.biometrics.heartRate} BPM (
                                        {userData.healthMetrics.heartRateStatus}
                                        )
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium">
                                        Blood Pressure:
                                    </p>
                                    <p className="text-lg">
                                        {
                                            userData.biometrics.bloodPressure
                                                .systolic
                                        }
                                        /
                                        {
                                            userData.biometrics.bloodPressure
                                                .diastolic
                                        }{" "}
                                        mmHg (
                                        {
                                            userData.healthMetrics
                                                .bloodPressureStatus
                                        }
                                        )
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium">
                                        Oxygen Saturation:
                                    </p>
                                    <p className="text-lg">
                                        {userData.biometrics.spO2}% (
                                        {userData.healthMetrics.spO2Status})
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium">
                                        Overall Health:
                                    </p>
                                    <p className="text-lg">
                                        {userData.healthMetrics.overallHealth}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-medium text-gray-800 mb-4">
                                Recommended Next Steps
                            </h3>
                            <p className="text-lg text-gray-600 mb-4">
                                Based on your assessment, please select one of
                                the following options:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {nextSteps.map((step) => (
                                    <Button
                                        key={step.id}
                                        variant="outline"
                                        className="h-auto p-4 flex items-start gap-3 text-left border-2 hover:bg-gray-50 hover:border-teal-300"
                                        onClick={() =>
                                            handleSelectNextStep(step.id)
                                        }
                                    >
                                        <div className="mt-1 text-teal-600">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-800 mb-1">
                                                {step.title}
                                            </h4>
                                            <p className="text-gray-600">
                                                {step.description}
                                            </p>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-lg py-4 px-6"
                            >
                                <PrinterIcon className="mr-2 h-5 w-5" />
                                Print Summary
                            </Button>
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
