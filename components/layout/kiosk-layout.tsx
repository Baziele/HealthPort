import type React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { MicIcon, VolumeIcon, HelpCircleIcon } from "lucide-react";
import Image from "next/image";

interface KioskLayoutProps {
    children: React.ReactNode;
    currentScreen: number;
    totalScreens: number;
    screenTitle: string;
    showAccessibilityOptions?: boolean;
}

export default function KioskLayout({
    children,
    currentScreen,
    totalScreens,
    screenTitle,
    showAccessibilityOptions = false,
}: KioskLayoutProps) {
    const progressValue = ((currentScreen + 1) / totalScreens) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            {/* Header */}
            <header className="bg-teal-600 text-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                            <Image
                                src="/HealthPortLogo.png"
                                alt="Health Port Logo"
                                width={40}
                                height={40}
                            />
                        </div>
                        <h1 className="text-2xl font-bold">Health Port</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {showAccessibilityOptions && (
                            <>
                                <button
                                    className="p-2 bg-teal-700 rounded-full hover:bg-teal-800 transition-colors"
                                    aria-label="Voice assistance"
                                >
                                    <MicIcon className="h-6 w-6" />
                                </button>
                                <button
                                    className="p-2 bg-teal-700 rounded-full hover:bg-teal-800 transition-colors"
                                    aria-label="Text to speech"
                                >
                                    <VolumeIcon className="h-6 w-6" />
                                </button>
                            </>
                        )}
                        <button
                            className="p-2 bg-teal-700 rounded-full hover:bg-teal-800 transition-colors"
                            aria-label="Help"
                        >
                            <HelpCircleIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Progress bar */}
            <div className="container mx-auto px-4 py-2">
                <div className="flex justify-between items-center mb-1">
                    <h2 className="text-lg font-medium text-teal-700">
                        {screenTitle}
                    </h2>
                    <span className="text-sm text-teal-700">
                        Step {currentScreen + 1} of {totalScreens}
                    </span>
                </div>
                <Progress value={progressValue} className="h-2 bg-gray-200" />
            </div>

            {/* Main content */}
            <main
                className={cn(
                    "flex-1 container mx-auto p-4 md:p-8",
                    showAccessibilityOptions ? "text-lg" : ""
                )}
            >
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 p-4 border-t border-gray-200">
                <div className="container mx-auto text-center text-gray-600 text-sm">
                    <p>
                        © 2025 AMM Health Technologies. For assistance, please
                        contact staff.
                    </p>
                </div>
            </footer>
        </div>
    );
}
