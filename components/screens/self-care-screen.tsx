"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { UserData } from "@/app/page"
import { ArrowLeftIcon, HeartPulseIcon, PrinterIcon, DownloadIcon } from "lucide-react"

interface SelfCareScreenProps {
  onNext: () => void
  onBack: () => void
  userData: UserData
}

export default function SelfCareScreen({ onNext, onBack, userData }: SelfCareScreenProps) {
  const handleContinue = () => {
    onNext()
  }

  // Sample self-care advice for tension headache
  const selfCareAdvice = [
    {
      title: "Rest and Relaxation",
      description:
        "Find a quiet, comfortable place to rest. Close your eyes and try to release tension in your neck and shoulders.",
      icon: "🧘‍♀️",
    },
    {
      title: "Stay Hydrated",
      description: "Drink plenty of water throughout the day. Dehydration can trigger or worsen headaches.",
      icon: "💧",
    },
    {
      title: "Over-the-Counter Pain Relief",
      description:
        "Take ibuprofen, aspirin, or acetaminophen as directed for pain relief. Always follow package instructions.",
      icon: "💊",
    },
    {
      title: "Apply Heat or Cold",
      description: "Use a warm compress on your neck or a cold pack on your forehead to help relieve pain.",
      icon: "🧊",
    },
    {
      title: "Gentle Stretching",
      description: "Perform gentle neck and shoulder stretches to release tension in these areas.",
      icon: "🤸‍♂️",
    },
    {
      title: "Limit Screen Time",
      description: "Take breaks from screens and ensure proper lighting to reduce eye strain.",
      icon: "📱",
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <Card className="w-full mb-8 shadow-lg border-teal-100">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <HeartPulseIcon className="h-8 w-8 text-teal-600 mr-3" />
            <h2 className="text-3xl font-semibold text-teal-700">Self-Care Advice</h2>
          </div>

          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-medium text-blue-700 mb-2">For Your Tension Headache</h3>
              <p className="text-lg text-blue-600">
                Based on your assessment, we recommend the following self-care measures to help manage your symptoms. If
                your symptoms worsen or persist for more than 3 days, please consult with a healthcare provider.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selfCareAdvice.map((advice, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <span className="text-3xl mr-4">{advice.icon}</span>
                    <div>
                      <h4 className="text-xl font-medium text-gray-800 mb-2">{advice.title}</h4>
                      <p className="text-gray-600">{advice.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="lg" className="text-lg py-6 px-8">
              <PrinterIcon className="mr-2 h-5 w-5" />
              Print Advice
            </Button>
            <Button variant="outline" size="lg" className="text-lg py-6 px-8">
              <DownloadIcon className="mr-2 h-5 w-5" />
              Download PDF
            </Button>
            <Button onClick={handleContinue} size="lg" className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between w-full">
        <Button onClick={onBack} variant="outline" size="lg" className="text-lg py-6 px-8">
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Back
        </Button>
      </div>
    </div>
  )
}
