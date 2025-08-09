"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { UserData } from "@/app/page"
import { ArrowLeftIcon, MicIcon, StopCircleIcon } from "lucide-react"

interface SymptomInputScreenProps {
  onNext: () => void
  onBack: () => void
  updateUserData: (data: Partial<UserData>) => void
  userData: UserData
}

export default function SymptomInputScreen({ onNext, onBack, updateUserData, userData }: SymptomInputScreenProps) {
  const [inputMethod, setInputMethod] = useState<"text" | "voice" | "body">("text")
  const [symptoms, setSymptoms] = useState(userData.symptoms || "")
  const [affectedArea, setAffectedArea] = useState(userData.affectedArea || "")
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSymptoms(e.target.value)
  }

  const startRecording = () => {
    setIsRecording(true)
    // Simulate voice recording
    setTimeout(() => {
      setTranscript(
        "I've been experiencing a headache for the past two days, mainly on the right side. It gets worse when I bend over. I also feel slightly nauseous in the morning.",
      )
    }, 2000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setSymptoms(transcript)
  }

  const selectBodyPart = (part: string) => {
    setAffectedArea(part)
  }

  const handleContinue = () => {
    updateUserData({
      symptoms,
      affectedArea,
    })
    onNext()
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <Card className="w-full mb-8 shadow-lg border-teal-100">
        <CardContent className="p-8">
          <h2 className="text-3xl font-semibold text-teal-700 mb-6 text-center">Tell Us About Your Symptoms</h2>

          <Tabs
            defaultValue="text"
            onValueChange={(value) => setInputMethod(value as "text" | "voice" | "body")}
            className="w-full mb-6"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="text" className="text-lg py-3">
                Text Input
              </TabsTrigger>
              <TabsTrigger value="voice" className="text-lg py-3">
                Voice Input
              </TabsTrigger>
              <TabsTrigger value="body" className="text-lg py-3">
                Body Diagram
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-6">
              <div className="space-y-4">
                <p className="text-lg text-gray-600">Please describe your symptoms in detail:</p>
                <Textarea
                  placeholder="Describe what you're experiencing, when it started, and any other relevant details..."
                  className="min-h-[200px] text-lg"
                  value={symptoms}
                  onChange={handleTextInput}
                />
              </div>
            </TabsContent>

            <TabsContent value="voice" className="mt-6">
              <div className="space-y-6">
                <p className="text-lg text-gray-600">Speak clearly and describe your symptoms in detail:</p>

                <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-6">
                  {isRecording ? (
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4 animate-pulse">
                        <MicIcon className="h-12 w-12 text-red-500" />
                      </div>
                      <p className="text-lg font-medium text-gray-700 mb-4">Recording... Please speak now</p>
                      <Button onClick={stopRecording} variant="destructive" size="lg" className="text-lg">
                        <StopCircleIcon className="mr-2 h-5 w-5" />
                        Stop Recording
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <MicIcon className="h-12 w-12 text-gray-400" />
                      </div>
                      <Button onClick={startRecording} size="lg" className="text-lg bg-teal-600 hover:bg-teal-700">
                        <MicIcon className="mr-2 h-5 w-5" />
                        Start Recording
                      </Button>
                    </div>
                  )}
                </div>

                {transcript && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Transcript:</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-700">{transcript}</div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="body" className="mt-6">
              <div className="space-y-6">
                <p className="text-lg text-gray-600">Select the area where you're experiencing symptoms:</p>
                <div className="flex justify-center">
                  <div className="relative w-64 h-96">
                    <img
                      src="/placeholder.svg?height=384&width=256"
                      alt="Human body diagram"
                      className="w-full h-full"
                    />
                    <button
                      className={`absolute top-[15%] left-[50%] transform -translate-x-1/2 w-16 h-16 rounded-full ${
                        affectedArea === "head"
                          ? "bg-red-400 opacity-70"
                          : "bg-transparent border-2 border-dashed border-gray-400 opacity-50 hover:opacity-100"
                      }`}
                      onClick={() => selectBodyPart("head")}
                      aria-label="Head"
                    ></button>
                    <button
                      className={`absolute top-[35%] left-[50%] transform -translate-x-1/2 w-20 h-20 rounded-full ${
                        affectedArea === "chest"
                          ? "bg-red-400 opacity-70"
                          : "bg-transparent border-2 border-dashed border-gray-400 opacity-50 hover:opacity-100"
                      }`}
                      onClick={() => selectBodyPart("chest")}
                      aria-label="Chest"
                    ></button>
                    <button
                      className={`absolute top-[50%] left-[50%] transform -translate-x-1/2 w-20 h-16 rounded-full ${
                        affectedArea === "abdomen"
                          ? "bg-red-400 opacity-70"
                          : "bg-transparent border-2 border-dashed border-gray-400 opacity-50 hover:opacity-100"
                      }`}
                      onClick={() => selectBodyPart("abdomen")}
                      aria-label="Abdomen"
                    ></button>
                    <button
                      className={`absolute top-[70%] left-[30%] transform -translate-x-1/2 w-12 h-24 rounded-full ${
                        affectedArea === "leftLeg"
                          ? "bg-red-400 opacity-70"
                          : "bg-transparent border-2 border-dashed border-gray-400 opacity-50 hover:opacity-100"
                      }`}
                      onClick={() => selectBodyPart("leftLeg")}
                      aria-label="Left Leg"
                    ></button>
                    <button
                      className={`absolute top-[70%] left-[70%] transform -translate-x-1/2 w-12 h-24 rounded-full ${
                        affectedArea === "rightLeg"
                          ? "bg-red-400 opacity-70"
                          : "bg-transparent border-2 border-dashed border-gray-400 opacity-50 hover:opacity-100"
                      }`}
                      onClick={() => selectBodyPart("rightLeg")}
                      aria-label="Right Leg"
                    ></button>
                  </div>
                </div>
                {affectedArea && (
                  <div className="text-center text-lg text-teal-600 font-medium">
                    Selected area: {affectedArea.charAt(0).toUpperCase() + affectedArea.slice(1)}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
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
          disabled={!symptoms && !affectedArea}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
