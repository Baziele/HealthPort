"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { UserData } from "@/app/page"
import { ArrowLeftIcon, ShieldIcon } from "lucide-react"

interface ConsentScreenProps {
  onNext: () => void
  onBack: () => void
  updateUserData: (data: Partial<UserData>) => void
  userData: UserData
}

export default function ConsentScreen({ onNext, onBack, updateUserData, userData }: ConsentScreenProps) {
  const [consentGiven, setConsentGiven] = useState(userData.consentGiven || false)

  const handleConsent = (checked: boolean) => {
    setConsentGiven(checked)
  }

  const handleContinue = () => {
    updateUserData({ consentGiven })
    onNext()
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <Card className="w-full mb-8 shadow-lg border-teal-100">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <ShieldIcon className="h-12 w-12 text-teal-600 mr-3" />
            <h2 className="text-3xl font-semibold text-teal-700">Privacy & Consent</h2>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 max-h-80 overflow-y-auto">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Terms of Service & Privacy Policy</h3>
            <div className="space-y-4 text-gray-600">
              <p>
                Welcome to the Automated Medical Machine (AMM). Before proceeding with your medical evaluation, please
                read and agree to the following terms and privacy policy.
              </p>
              <h4 className="font-medium text-gray-800">Data Collection</h4>
              <p>
                The AMM collects personal information including your name, age, gender, and medical symptoms. This
                information is used solely for the purpose of providing you with an accurate medical evaluation.
              </p>
              <h4 className="font-medium text-gray-800">Data Security</h4>
              <p>
                All data collected is encrypted and stored securely in compliance with HIPAA regulations. Your
                information will only be shared with healthcare providers directly involved in your care.
              </p>
              <h4 className="font-medium text-gray-800">AI Diagnosis</h4>
              <p>
                The AMM uses artificial intelligence to assist in diagnosing your symptoms. While our AI is highly
                accurate, it is not a replacement for professional medical advice. The AMM may recommend you seek
                further medical attention when appropriate.
              </p>
              <h4 className="font-medium text-gray-800">Limitations</h4>
              <p>
                The AMM is designed to assist with non-emergency medical evaluations. If you are experiencing a medical
                emergency, please call emergency services immediately.
              </p>
              <h4 className="font-medium text-gray-800">Your Rights</h4>
              <p>
                You have the right to access, correct, and delete your personal information. To exercise these rights,
                please contact our privacy officer at privacy@amm-health.com.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 mb-6">
            <Checkbox id="consent" checked={consentGiven} onCheckedChange={handleConsent} className="mt-1" />
            <label htmlFor="consent" className="text-lg text-gray-700 cursor-pointer">
              I have read and agree to the Terms of Service and Privacy Policy. I consent to the collection and
              processing of my personal and medical information as described.
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between w-full">
        <Button onClick={onBack} variant="outline" size="lg" className="text-lg py-6 px-8">
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          size="lg"
          className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700"
          disabled={!consentGiven}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
