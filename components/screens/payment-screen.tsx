"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { UserData } from "@/app/page"
import { ArrowLeftIcon, CreditCardIcon, SmartphoneIcon, CheckCircleIcon } from "lucide-react"

interface PaymentScreenProps {
  onNext: () => void
  onBack: () => void
  userData: UserData
}

export default function PaymentScreen({ onNext, onBack, userData }: PaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile" | "insurance" | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const handleSelectPaymentMethod = (method: "card" | "mobile" | "insurance") => {
    setPaymentMethod(method)
  }

  const handleProcessPayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentComplete(true)
    }, 2000)
  }

  const handleContinue = () => {
    onNext()
  }

  // Sample payment data
  const paymentDetails = {
    consultation: 25.0,
    medication: 15.0,
    total: 40.0,
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <Card className="w-full mb-8 shadow-lg border-teal-100">
        <CardContent className="p-8">
          <h2 className="text-3xl font-semibold text-teal-700 mb-6 text-center">Payment</h2>

          {!paymentComplete ? (
            <div className="space-y-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-800 mb-4">Service Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="text-gray-800">${paymentDetails.consultation.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Medication:</span>
                    <span className="text-gray-800">${paymentDetails.medication.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-medium">
                    <span>Total:</span>
                    <span>${paymentDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Select Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className={`h-auto p-6 flex flex-col items-center justify-center gap-3 ${
                      paymentMethod === "card" ? "border-teal-500 bg-teal-50" : ""
                    }`}
                    onClick={() => handleSelectPaymentMethod("card")}
                  >
                    <CreditCardIcon className="h-10 w-10 text-teal-600" />
                    <span className="text-lg font-medium">Credit/Debit Card</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={`h-auto p-6 flex flex-col items-center justify-center gap-3 ${
                      paymentMethod === "mobile" ? "border-teal-500 bg-teal-50" : ""
                    }`}
                    onClick={() => handleSelectPaymentMethod("mobile")}
                  >
                    <SmartphoneIcon className="h-10 w-10 text-teal-600" />
                    <span className="text-lg font-medium">Mobile Payment</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={`h-auto p-6 flex flex-col items-center justify-center gap-3 ${
                      paymentMethod === "insurance" ? "border-teal-500 bg-teal-50" : ""
                    }`}
                    onClick={() => handleSelectPaymentMethod("insurance")}
                  >
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-teal-600 text-xl font-bold">+</span>
                    </div>
                    <span className="text-lg font-medium">Insurance</span>
                  </Button>
                </div>
              </div>

              {paymentMethod && (
                <div className="text-center">
                  <Button
                    onClick={handleProcessPayment}
                    size="lg"
                    className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700"
                  >
                    Process Payment
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-medium text-green-700">Payment Complete</h3>
              <p className="text-lg text-gray-600 mb-6">
                Your payment of ${paymentDetails.total.toFixed(2)} has been processed successfully.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left mb-6">
                <h4 className="text-xl font-medium text-gray-800 mb-4">Receipt Details</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-500 font-medium">Transaction ID:</span>
                    <span className="text-gray-800">AMM-{Math.floor(Math.random() * 1000000)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-500 font-medium">Date:</span>
                    <span className="text-gray-800">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-500 font-medium">Amount:</span>
                    <span className="text-gray-800">${paymentDetails.total.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-500 font-medium">Payment Method:</span>
                    <span className="text-gray-800">
                      {paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : paymentMethod === "mobile"
                          ? "Mobile Payment"
                          : "Insurance"}
                    </span>
                  </div>
                </div>
              </div>
              <Button onClick={handleContinue} size="lg" className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700">
                Continue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {!paymentComplete && (
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
