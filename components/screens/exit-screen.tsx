"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { UserData } from "@/app/page"
import { StarIcon, SprayCanIcon, CheckCircleIcon } from "lucide-react"
import { motion } from "framer-motion"

interface ExitScreenProps {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
}

export default function ExitScreen({ userData, updateUserData }: ExitScreenProps) {
  const [rating, setRating] = useState<number>(userData.feedback?.rating || 0)
  const [comments, setComments] = useState<string>(userData.feedback?.comments || "")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false)

  const handleRatingChange = (value: number) => {
    setRating(value)
  }

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value)
  }

  const handleSubmitFeedback = () => {
    updateUserData({
      feedback: {
        rating,
        comments,
      },
    })
    setFeedbackSubmitted(true)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <Card className="w-full mb-8 shadow-lg border-teal-100">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-teal-700 mb-4">Thank You for Using AMM</h2>
            <p className="text-xl text-gray-600">We hope you found this service helpful.</p>
          </div>

          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-medium text-blue-700 mb-4">Your Visit Summary</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <span className="text-gray-500 font-medium">Patient:</span>
                  <span className="text-gray-800 md:col-span-2">{userData.name}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <span className="text-gray-500 font-medium">Diagnosis:</span>
                  <span className="text-gray-800 md:col-span-2">{userData.diagnosisResult.condition}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <span className="text-gray-500 font-medium">Recommended Action:</span>
                  <span className="text-gray-800 md:col-span-2">
                    {userData.diagnosisResult.nextStep === "consultation"
                      ? "Video Consultation"
                      : userData.diagnosisResult.nextStep === "medication"
                        ? "Medication"
                        : userData.diagnosisResult.nextStep === "selfCare"
                          ? "Self-Care Advice"
                          : "Referral to Healthcare Provider"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <span className="text-gray-500 font-medium">Date:</span>
                  <span className="text-gray-800 md:col-span-2">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {!feedbackSubmitted ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  Your Feedback
                </h3>
                <p className="text-gray-600 mb-6">
                  Your feedback helps us improve our services. Please take a moment to rate your experience.
                </p>

                <div className="mb-6">
                  <p className="text-gray-700 mb-3">How would you rate your experience with AMM today?</p>
                  <div className="flex justify-center space-x-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <motion.button
                        key={value}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRatingChange(value)}
                        className={`h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${
                          rating === value ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {value}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 mb-3">Do you have any additional comments or suggestions?</p>
                  <Textarea
                    placeholder="Share your thoughts with us..."
                    className="min-h-[100px]"
                    value={comments}
                    onChange={handleCommentsChange}
                  />
                </div>

                <Button
                  onClick={handleSubmitFeedback}
                  size="lg"
                  className="w-full text-lg py-6 bg-teal-600 hover:bg-teal-700"
                  disabled={rating === 0}
                >
                  Submit Feedback
                </Button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-medium text-green-700 mb-2">Thank You for Your Feedback!</h3>
                <p className="text-lg text-gray-600">
                  We appreciate you taking the time to share your experience with us.
                </p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start">
              <SprayCanIcon className="h-6 w-6 text-yellow-500 mr-3 mt-1" />
              <div>
                <h3 className="text-xl font-medium text-yellow-700 mb-2">Sanitization Notice</h3>
                <p className="text-yellow-600">
                  For the health and safety of all users, please use the hand sanitizer provided before leaving. The
                  kiosk will be automatically sanitized after your session.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          size="lg"
          className="text-lg py-6 px-16 bg-teal-600 hover:bg-teal-700"
          onClick={() => window.location.reload()}
        >
          Exit
        </Button>
      </div>
    </div>
  )
}
