"use client"

import { useState } from "react"
import WelcomeScreen from "@/components/screens/welcome-screen"
import IdentificationScreen from "@/components/screens/identification-screen"
import BiometricMeasurementScreen from "@/components/screens/biometric-measurement-screen"
import TemperatureMeasurementScreen from "@/components/screens/temperature-measurement-screen"
import SpO2MeasurementScreen from "@/components/screens/spo2-measurement-screen"
import HeartRateMeasurementScreen from "@/components/screens/heart-rate-measurement-screen"
import HealthDashboardScreen from "@/components/screens/health-dashboard-screen"
import BodyPainSelectionScreen from "@/components/screens/body-pain-selection-screen"
import AIConversationScreen from "@/components/screens/ai-conversation-screen"
import DiagnosticSummaryScreen from "@/components/screens/diagnostic-summary-screen"
import VideoConsultationScreen from "@/components/screens/video-consultation-screen"
import MedicationScreen from "@/components/screens/medication-screen"
import ReferralScreen from "@/components/screens/referral-screen"
import ExitScreen from "@/components/screens/exit-screen"
import KioskLayout from "@/components/layout/kiosk-layout"

export type UserData = {
  name: string
  age: number
  gender: string
  nhisNumber: string
  language: string
  accessibilityOptions: {
    voice: boolean
    largeText: boolean
  }
  biometrics: {
    height: number // in cm
    weight: number // in kg
    bmi: number
    temperature: number // in Celsius
    spO2: number // in percentage
    heartRate: number // in bpm
    bloodPressure: {
      systolic: number
      diastolic: number
    }
  }
  healthMetrics: {
    bmiCategory: string
    temperatureStatus: string
    spO2Status: string
    heartRateStatus: string
    bloodPressureStatus: string
    overallHealth: string
  }
  painAreas: string[]
  symptoms: string
  aiConversation: {
    summary: string
    recommendations: string[]
  }
  diagnosisResult: {
    condition: string
    severity: "low" | "medium" | "high"
    nextStep: "consultation" | "medication" | "selfCare" | "referral"
  }
  feedback: {
    rating: number
    comments: string
  }
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<number>(0)
  const [userData, setUserData] = useState<UserData>({
    name: "",
    age: 0,
    gender: "",
    nhisNumber: "",
    language: "english",
    accessibilityOptions: {
      voice: false,
      largeText: false,
    },
    biometrics: {
      height: 0,
      weight: 0,
      bmi: 0,
      temperature: 0,
      spO2: 0,
      heartRate: 0,
      bloodPressure: {
        systolic: 0,
        diastolic: 0,
      },
    },
    healthMetrics: {
      bmiCategory: "",
      temperatureStatus: "",
      spO2Status: "",
      heartRateStatus: "",
      bloodPressureStatus: "",
      overallHealth: "",
    },
    painAreas: [],
    symptoms: "",
    aiConversation: {
      summary: "",
      recommendations: [],
    },
    diagnosisResult: {
      condition: "",
      severity: "low",
      nextStep: "selfCare",
    },
    feedback: {
      rating: 0,
      comments: "",
    },
  })

  // Removed consent screen from the flow
  const screens = [
    { id: "welcome", title: "Welcome" },
    { id: "identification", title: "Identification" },
    { id: "biometrics", title: "Height & Weight" },
    { id: "temperature", title: "Temperature" },
    { id: "spo2", title: "Oxygen Saturation" },
    { id: "heartRate", title: "Heart Rate" },
    { id: "healthDashboard", title: "Health Dashboard" },
    { id: "painSelection", title: "Pain Areas" },
    { id: "aiConversation", title: "AI Consultation" },
    { id: "summary", title: "Diagnosis Summary" },
    { id: "outcome", title: "Next Steps" },
    { id: "exit", title: "Thank You" },
  ]

  const handleNext = () => {
    setCurrentScreen((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentScreen((prev) => Math.max(0, prev - 1))
  }

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }))
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <WelcomeScreen onNext={handleNext} updateUserData={updateUserData} userData={userData} />
      case 1:
        return (
          <IdentificationScreen
            onNext={handleNext}
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />
        )
      case 2:
        return (
          <BiometricMeasurementScreen
            onNext={handleNext}
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />
        )
      case 3:
        return (
          <TemperatureMeasurementScreen
            onNext={handleNext}
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />
        )
      case 4:
        return (
          <SpO2MeasurementScreen
            onNext={handleNext}
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />
        )
      case 5:
        return (
          <HeartRateMeasurementScreen
            onNext={handleNext}
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />
        )
      case 6:
        return (
          <HealthDashboardScreen
            onNext={handleNext}
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />
        )
      case 7:
        return (
          <BodyPainSelectionScreen
            onNext={handleNext}
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />
        )
      case 8:
        return (
          <AIConversationScreen
            onNext={handleNext}
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />
        )
      case 9:
        return (
          <DiagnosticSummaryScreen
            onNext={handleNext}
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />
        )
      case 10:
        // Render different outcome screens based on diagnosis result
        switch (userData.diagnosisResult.nextStep) {
          case "consultation":
            return <VideoConsultationScreen onNext={handleNext} onBack={handleBack} userData={userData} />
          case "medication":
            return <MedicationScreen onNext={handleNext} onBack={handleBack} userData={userData} />
          case "referral":
            return <ReferralScreen onNext={handleNext} onBack={handleBack} userData={userData} />
          default:
            return <MedicationScreen onNext={handleNext} onBack={handleBack} userData={userData} />
        }
      case 11:
        return <ExitScreen userData={userData} updateUserData={updateUserData} />
      default:
        return <WelcomeScreen onNext={handleNext} updateUserData={updateUserData} userData={userData} />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <KioskLayout
        currentScreen={currentScreen}
        totalScreens={screens.length}
        screenTitle={screens[currentScreen]?.title || ""}
        showAccessibilityOptions={userData.accessibilityOptions.largeText}
      >
        {renderScreen()}
      </KioskLayout>
    </div>
  )
}
