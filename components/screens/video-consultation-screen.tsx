"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { UserData } from "@/app/page"
import { ArrowLeftIcon, VideoIcon, MicIcon, MicOffIcon, VideoOffIcon, PhoneOffIcon } from "lucide-react"

interface VideoConsultationScreenProps {
  onNext: () => void
  onBack: () => void
  userData: UserData
}

export default function VideoConsultationScreen({ onNext, onBack, userData }: VideoConsultationScreenProps) {
  const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "ended">("connecting")
  const [micEnabled, setMicEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [waitTime, setWaitTime] = useState(60)

  // Simulate connecting to a doctor
  useEffect(() => {
    if (callStatus === "connecting") {
      const timer = setInterval(() => {
        setWaitTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setCallStatus("connected")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [callStatus])

  const toggleMic = () => {
    setMicEnabled((prev) => !prev)
  }

  const toggleVideo = () => {
    setVideoEnabled((prev) => !prev)
  }

  const endCall = () => {
    setCallStatus("ended")
  }

  const handleContinue = () => {
    onNext()
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <Card className="w-full mb-8 shadow-lg border-teal-100">
        <CardContent className="p-8">
          <h2 className="text-3xl font-semibold text-teal-700 mb-6 text-center">Video Consultation</h2>

          {callStatus === "connecting" && (
            <div className="space-y-6 text-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <VideoIcon className="h-12 w-12 text-blue-500 animate-pulse" />
              </div>
              <h3 className="text-2xl font-medium text-blue-700">Connecting to Doctor</h3>
              <p className="text-lg text-gray-600">
                Estimated wait time: {Math.floor(waitTime / 60)}:
                {waitTime % 60 < 10 ? `0${waitTime % 60}` : waitTime % 60}
              </p>
              <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${100 - (waitTime / 60) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-gray-500">
                Please wait while we connect you with the next available healthcare provider.
              </p>
            </div>
          )}

          {callStatus === "connected" && (
            <div className="space-y-6">
              <div className="relative w-full h-96 bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=384&width=640"
                    alt="Doctor video feed"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
                  {videoEnabled ? (
                    <img
                      src="/placeholder.svg?height=96&width=128"
                      alt="Your video feed"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <VideoOffIcon className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  Dr. Sarah Johnson
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={toggleMic}
                  variant={micEnabled ? "outline" : "destructive"}
                  size="lg"
                  className="rounded-full w-14 h-14 p-0"
                >
                  {micEnabled ? <MicIcon className="h-6 w-6" /> : <MicOffIcon className="h-6 w-6" />}
                </Button>
                <Button
                  onClick={toggleVideo}
                  variant={videoEnabled ? "outline" : "destructive"}
                  size="lg"
                  className="rounded-full w-14 h-14 p-0"
                >
                  {videoEnabled ? <VideoIcon className="h-6 w-6" /> : <VideoOffIcon className="h-6 w-6" />}
                </Button>
                <Button onClick={endCall} variant="destructive" size="lg" className="rounded-full w-14 h-14 p-0">
                  <PhoneOffIcon className="h-6 w-6" />
                </Button>
              </div>
            </div>
          )}

          {callStatus === "ended" && (
            <div className="space-y-6 text-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <VideoIcon className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-medium text-green-700">Consultation Complete</h3>
              <p className="text-lg text-gray-600 mb-6">Your video consultation with Dr. Sarah Johnson has ended.</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left">
                <h4 className="text-xl font-medium text-gray-800 mb-4">Doctor's Recommendations</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Take over-the-counter pain relievers as directed for your headache</li>
                  <li>Stay hydrated and get adequate rest</li>
                  <li>Practice stress-reduction techniques such as deep breathing or meditation</li>
                  <li>Follow up with your primary care physician if symptoms persist for more than 3 days</li>
                </ul>
              </div>
              <Button
                onClick={handleContinue}
                size="lg"
                className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700 mt-4"
              >
                Continue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {callStatus === "connecting" && (
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
