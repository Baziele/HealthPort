"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { UserData } from "@/app/page"
import { ArrowLeftIcon, ActivityIcon, CheckCircleIcon } from "lucide-react"

interface TestingScreenProps {
  onNext: () => void
  onBack: () => void
  updateUserData: (data: Partial<UserData>) => void
  userData: UserData
}

export default function TestingScreen({ onNext, onBack, updateUserData, userData }: TestingScreenProps) {
  const [testingStage, setTestingStage] = useState<"instructions" | "inProgress" | "complete">("instructions")
  const [progress, setProgress] = useState(0)

  // Simulate testing progress
  useEffect(() => {
    if (testingStage === "inProgress") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTestingStage("complete")
            return 100
          }
          return prev + 5
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [testingStage])

  const startTesting = () => {
    setTestingStage("inProgress")
  }

  const handleContinue = () => {
    onNext()
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <Card className="w-full mb-8 shadow-lg border-teal-100">
        <CardContent className="p-8">
          <h2 className="text-3xl font-semibold text-teal-700 mb-6 text-center">Additional Testing</h2>

          {testingStage === "instructions" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-medium text-blue-700 mb-4 flex items-center">
                  <ActivityIcon className="h-6 w-6 mr-2" />
                  Blood Pressure Measurement
                </h3>
                <p className="text-lg text-blue-600 mb-4">
                  Based on your symptoms, we recommend measuring your blood pressure.
                </p>
                <div className="space-y-4 text-gray-600">
                  <h4 className="font-medium text-gray-800">Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Place your right arm in the blood pressure cuff located on the right side of the kiosk.</li>
                    <li>Make sure your arm is resting at heart level on the armrest.</li>
                    <li>Remain still and quiet during the measurement process.</li>
                    <li>The cuff will automatically inflate and then slowly deflate.</li>
                    <li>Your blood pressure reading will be displayed when complete.</li>
                  </ol>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={startTesting} size="lg" className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700">
                  Start Measurement
                </Button>
              </div>
            </div>
          )}

          {testingStage === "inProgress" && (
            <div className="space-y-8">
              <div className="text-center">
                <ActivityIcon className="h-16 w-16 text-teal-600 mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl font-medium text-teal-700 mb-2">Measuring Blood Pressure</h3>
                <p className="text-lg text-gray-600 mb-6">Please remain still and quiet during the measurement.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Starting</span>
                  <span>Inflating</span>
                  <span>Measuring</span>
                  <span>Complete</span>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-center text-gray-600 mt-2">
                  {progress < 30
                    ? "Preparing measurement..."
                    : progress < 60
                      ? "Inflating cuff..."
                      : progress < 90
                        ? "Taking measurement..."
                        : "Processing results..."}
                </p>
              </div>
            </div>
          )}

          {testingStage === "complete" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-medium text-green-700 mb-2">Measurement Complete</h3>
                <p className="text-lg text-gray-600 mb-6">Your blood pressure reading has been recorded.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-xl font-medium text-gray-800 mb-4">Blood Pressure Results</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500 mb-1">Systolic</p>
                    <p className="text-3xl font-bold text-teal-600">128</p>
                    <p className="text-gray-500">mmHg</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500 mb-1">Diastolic</p>
                    <p className="text-3xl font-bold text-teal-600">82</p>
                    <p className="text-gray-500">mmHg</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-700">
                    Your blood pressure is slightly elevated but within normal range. This information will be included
                    in your assessment.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={handleContinue} size="lg" className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700">
                  Continue to Assessment
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {testingStage === "instructions" && (
        <div className="flex justify-between w-full">
          <Button onClick={onBack} variant="outline" size="lg" className="text-lg py-6 px-8">
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Back
          </Button>
        </div>
      )}
    </div>
  )
}
