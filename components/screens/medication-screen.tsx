"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { UserData } from "@/app/page"
import { ArrowLeftIcon, PillIcon, PrinterIcon, CheckCircleIcon } from "lucide-react"

interface MedicationScreenProps {
  onNext: () => void
  onBack: () => void
  userData: UserData
}

export default function MedicationScreen({ onNext, onBack, userData }: MedicationScreenProps) {
  const [dispensed, setDispensed] = useState(false)

  const handleDispense = () => {
    // Simulate medication dispensing
    setTimeout(() => {
      setDispensed(true)
    }, 2000)
  }

  const handleContinue = () => {
    onNext()
  }

  // Sample medication data
  const medication = {
    name: "Ibuprofen",
    dosage: "200mg",
    quantity: "10 tablets",
    instructions: "Take 1-2 tablets every 4-6 hours as needed for pain. Do not exceed 6 tablets in 24 hours.",
    sideEffects: ["Upset stomach", "Heartburn", "Dizziness", "Mild headache"],
    warnings: [
      "Do not use if you have a history of stomach ulcers",
      "Do not use if you are allergic to aspirin or other NSAIDs",
      "Consult a doctor if you are pregnant or breastfeeding",
    ],
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <Card className="w-full mb-8 shadow-lg border-teal-100">
        <CardContent className="p-8">
          <h2 className="text-3xl font-semibold text-teal-700 mb-6 text-center">Medication Dispensing</h2>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <PillIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-medium text-gray-800 mb-2">
                  {medication.name} {medication.dosage}
                </h3>
                <p className="text-lg text-gray-600">Quantity: {medication.quantity}</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="text-xl font-medium text-gray-800 mb-4">Instructions</h4>
              <p className="text-lg text-gray-600 mb-6">{medication.instructions}</p>

              <h4 className="text-xl font-medium text-gray-800 mb-4">Possible Side Effects</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                {medication.sideEffects.map((effect, index) => (
                  <li key={index} className="text-lg">
                    {effect}
                  </li>
                ))}
              </ul>

              <h4 className="text-xl font-medium text-gray-800 mb-4">Warnings</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {medication.warnings.map((warning, index) => (
                  <li key={index} className="text-lg">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>

            {!dispensed ? (
              <div className="text-center">
                <Button onClick={handleDispense} size="lg" className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700">
                  Dispense Medication
                </Button>
                <p className="text-gray-500 mt-2">Medication will be dispensed from the tray below</p>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircleIcon className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-medium text-green-700">Medication Dispensed</h3>
                <p className="text-lg text-gray-600 mb-6">Please collect your medication from the tray below.</p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="lg" className="text-lg py-6 px-8">
                    <PrinterIcon className="mr-2 h-5 w-5" />
                    Print Instructions
                  </Button>
                  <Button
                    onClick={handleContinue}
                    size="lg"
                    className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!dispensed && (
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
