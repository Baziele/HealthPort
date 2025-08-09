"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { UserData } from "@/app/page"
import { ArrowLeftIcon, ClipboardListIcon, PrinterIcon, MapPinIcon, PhoneIcon, ClockIcon } from "lucide-react"

interface ReferralScreenProps {
  onNext: () => void
  onBack: () => void
  userData: UserData
}

export default function ReferralScreen({ onNext, onBack, userData }: ReferralScreenProps) {
  const handleContinue = () => {
    onNext()
  }

  // Sample referral data
  const referral = {
    diagnosis: "Tension Headache with Persistent Symptoms",
    recommendation: "Follow-up with primary care physician for further evaluation and management",
    urgency: "Non-urgent (within 7 days)",
    nearbyClinics: [
      {
        name: "City Health Medical Center",
        address: "123 Main Street, Cityville",
        phone: "(555) 123-4567",
        hours: "Mon-Fri: 8am-6pm, Sat: 9am-1pm",
        distance: "0.8 miles",
      },
      {
        name: "Westside Family Practice",
        address: "456 Oak Avenue, Cityville",
        phone: "(555) 987-6543",
        hours: "Mon-Fri: 9am-5pm",
        distance: "1.2 miles",
      },
      {
        name: "Eastside Urgent Care",
        address: "789 Pine Street, Cityville",
        phone: "(555) 456-7890",
        hours: "Daily: 8am-8pm",
        distance: "2.5 miles",
      },
    ],
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <Card className="w-full mb-8 shadow-lg border-teal-100">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <ClipboardListIcon className="h-8 w-8 text-teal-600 mr-3" />
            <h2 className="text-3xl font-semibold text-teal-700">Referral Information</h2>
          </div>

          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-medium text-blue-700 mb-4">Your Referral Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <span className="text-gray-500 font-medium">Patient:</span>
                  <span className="text-gray-800 md:col-span-2">{userData.name}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <span className="text-gray-500 font-medium">Diagnosis:</span>
                  <span className="text-gray-800 md:col-span-2">{referral.diagnosis}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <span className="text-gray-500 font-medium">Recommendation:</span>
                  <span className="text-gray-800 md:col-span-2">{referral.recommendation}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <span className="text-gray-500 font-medium">Urgency:</span>
                  <span className="text-gray-800 md:col-span-2">{referral.urgency}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-4">Nearby Healthcare Facilities</h3>
              <div className="space-y-4">
                {referral.nearbyClinics.map((clinic, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-lg font-medium text-gray-800 mb-3">
                      {clinic.name} <span className="text-sm font-normal text-gray-500">({clinic.distance})</span>
                    </h4>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-start">
                        <MapPinIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                        <span>{clinic.address}</span>
                      </div>
                      <div className="flex items-start">
                        <PhoneIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                        <span>{clinic.phone}</span>
                      </div>
                      <div className="flex items-start">
                        <ClockIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                        <span>{clinic.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="lg" className="text-lg py-6 px-8">
                <PrinterIcon className="mr-2 h-5 w-5" />
                Print Referral
              </Button>
              <Button onClick={handleContinue} size="lg" className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700">
                Continue
              </Button>
            </div>
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
