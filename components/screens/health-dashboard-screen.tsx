"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { UserData } from "@/app/page"
import {
  ArrowLeftIcon,
  HeartIcon,
  ThermometerIcon,
  ActivityIcon,
  ScaleIcon,
  HeartPulseIcon,
  ArrowRightIcon,
} from "lucide-react"

interface HealthDashboardScreenProps {
  onNext: () => void
  onBack: () => void
  updateUserData: (data: Partial<UserData>) => void
  userData: UserData
}

export default function HealthDashboardScreen({
  onNext,
  onBack,
  updateUserData,
  userData,
}: HealthDashboardScreenProps) {
  // Calculate overall health status based on all metrics
  const calculateOverallHealth = () => {
    const metrics = [
      userData.healthMetrics.bmiCategory,
      userData.healthMetrics.temperatureStatus,
      userData.healthMetrics.spO2Status,
      userData.healthMetrics.heartRateStatus,
      userData.healthMetrics.bloodPressureStatus,
    ]

    if (metrics.includes("Critical") || metrics.filter((m) => m === "Elevated" || m === "Low").length > 2) {
      return "Needs Attention"
    } else if (metrics.filter((m) => m === "Elevated" || m === "Low").length > 0) {
      return "Fair"
    } else {
      return "Good"
    }
  }

  const overallHealth = calculateOverallHealth()

  const handleContinue = () => {
    updateUserData({
      healthMetrics: {
        ...userData.healthMetrics,
        overallHealth,
      },
    })
    onNext()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Low":
      case "Underweight":
        return "text-blue-600"
      case "Elevated":
      case "Overweight":
      case "Obese":
        return "text-yellow-600"
      case "Critical":
        return "text-red-600"
      case "Normal":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getOverallHealthColor = (status: string) => {
    switch (status) {
      case "Good":
        return "bg-green-100 text-green-800 border-green-200"
      case "Fair":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Needs Attention":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Calculate BMI category if not already set
  const bmiCategory =
    userData.healthMetrics.bmiCategory ||
    (userData.biometrics.bmi < 18.5
      ? "Underweight"
      : userData.biometrics.bmi < 25
        ? "Normal"
        : userData.biometrics.bmi < 30
          ? "Overweight"
          : "Obese")

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <Card className="w-full mb-8 shadow-lg border-teal-100">
        <CardContent className="p-8">
          <h2 className="text-3xl font-semibold text-teal-700 mb-6 text-center">Your Health Dashboard</h2>

          <div className="space-y-8">
            <div className={`p-6 rounded-lg ${getOverallHealthColor(overallHealth)}`}>
              <h3 className="text-2xl font-medium mb-2 text-center">Overall Health Status</h3>
              <p className="text-4xl font-bold text-center">{overallHealth}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BMI Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <ScaleIcon className="h-8 w-8 text-teal-600 mr-3" />
                  <div>
                    <h4 className="text-xl font-medium text-gray-800 mb-1">Body Mass Index (BMI)</h4>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-teal-600 mr-2">{userData.biometrics.bmi}</p>
                      <p className={`text-lg font-medium ${getStatusColor(bmiCategory)}`}>{bmiCategory}</p>
                    </div>
                    <p className="text-gray-500 mt-2">
                      Height: {userData.biometrics.height} cm | Weight: {userData.biometrics.weight} kg
                    </p>
                  </div>
                </div>
              </div>

              {/* Temperature Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <ThermometerIcon className="h-8 w-8 text-teal-600 mr-3" />
                  <div>
                    <h4 className="text-xl font-medium text-gray-800 mb-1">Body Temperature</h4>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-teal-600 mr-2">{userData.biometrics.temperature}°C</p>
                      <p
                        className={`text-lg font-medium ${getStatusColor(userData.healthMetrics.temperatureStatus || "Normal")}`}
                      >
                        {userData.healthMetrics.temperatureStatus || "Normal"}
                      </p>
                    </div>
                    <p className="text-gray-500 mt-2">Normal range: 36.1°C - 37.5°C</p>
                  </div>
                </div>
              </div>

              {/* SpO2 Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <HeartPulseIcon className="h-8 w-8 text-teal-600 mr-3" />
                  <div>
                    <h4 className="text-xl font-medium text-gray-800 mb-1">Oxygen Saturation (SpO2)</h4>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-teal-600 mr-2">{userData.biometrics.spO2}%</p>
                      <p
                        className={`text-lg font-medium ${getStatusColor(userData.healthMetrics.spO2Status || "Normal")}`}
                      >
                        {userData.healthMetrics.spO2Status || "Normal"}
                      </p>
                    </div>
                    <p className="text-gray-500 mt-2">Normal range: 95% - 100%</p>
                  </div>
                </div>
              </div>

              {/* Heart Rate Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <HeartIcon className="h-8 w-8 text-teal-600 mr-3" />
                  <div>
                    <h4 className="text-xl font-medium text-gray-800 mb-1">Heart Rate</h4>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-teal-600 mr-2">{userData.biometrics.heartRate} BPM</p>
                      <p
                        className={`text-lg font-medium ${getStatusColor(userData.healthMetrics.heartRateStatus || "Normal")}`}
                      >
                        {userData.healthMetrics.heartRateStatus || "Normal"}
                      </p>
                    </div>
                    <p className="text-gray-500 mt-2">Normal range: 60 - 100 BPM</p>
                  </div>
                </div>
              </div>

              {/* Blood Pressure Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow col-span-1 md:col-span-2">
                <div className="flex items-start">
                  <ActivityIcon className="h-8 w-8 text-teal-600 mr-3" />
                  <div>
                    <h4 className="text-xl font-medium text-gray-800 mb-1">Blood Pressure</h4>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-teal-600 mr-2">
                        {userData.biometrics.bloodPressure.systolic}/{userData.biometrics.bloodPressure.diastolic} mmHg
                      </p>
                      <p
                        className={`text-lg font-medium ${getStatusColor(userData.healthMetrics.bloodPressureStatus || "Normal")}`}
                      >
                        {userData.healthMetrics.bloodPressureStatus || "Normal"}
                      </p>
                    </div>
                    <p className="text-gray-500 mt-2">Normal range: 90/60 mmHg - 140/90 mmHg</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-medium text-blue-700 mb-4">What's Next?</h3>
              <p className="text-lg text-blue-600 mb-4">
                Now that we've measured your vital signs, we'd like to understand more about any symptoms or pain you
                may be experiencing.
              </p>
              <p className="text-lg text-blue-600">
                On the next screen, you'll be able to indicate areas of pain or discomfort on a body diagram.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between w-full">
        <Button onClick={onBack} variant="outline" size="lg" className="text-lg py-6 px-8">
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button onClick={handleContinue} size="lg" className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700">
          Continue
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
