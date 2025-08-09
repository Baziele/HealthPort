"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { UserData } from "@/app/page"
import { ArrowLeftIcon, RefreshCwIcon, AudioWaveformIcon as WaveformIcon } from "lucide-react"

interface DiagnosticConversationScreenProps {
  onNext: () => void
  onBack: () => void
  updateUserData: (data: Partial<UserData>) => void
  userData: UserData
}

interface Message {
  role: "ai" | "user"
  content: string
}

export default function DiagnosticConversationScreen({
  onNext,
  onBack,
  updateUserData,
  userData,
}: DiagnosticConversationScreenProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isThinking, setIsThinking] = useState(false)
  const [conversationComplete, setConversationComplete] = useState(false)

  // Predefined conversation flow
  const aiQuestions = [
    `Hello ${userData.name}, I'm going to ask you a few questions about your symptoms. ${userData.symptoms ? `I see you mentioned: "${userData.symptoms}"` : ""} ${userData.affectedArea ? `And you indicated discomfort in your ${userData.affectedArea}.` : ""} How long have you been experiencing these symptoms?`,
    "Have you taken any medication for these symptoms?",
    "On a scale of 1 to 10, how would you rate your pain or discomfort?",
    "Do these symptoms interfere with your daily activities?",
    "Have you experienced these symptoms before?",
  ]

  // Simulate AI thinking and response
  const simulateAiResponse = () => {
    setIsThinking(true)
    setTimeout(() => {
      if (currentQuestion < aiQuestions.length) {
        setMessages((prev) => [...prev, { role: "ai", content: aiQuestions[currentQuestion] }])
        setIsThinking(false)
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content:
              "Thank you for answering all my questions. Based on your responses, I have enough information to provide a preliminary assessment. Let's proceed to the next step.",
          },
        ])
        setIsThinking(false)
        setConversationComplete(true)
      }
    }, 1500)
  }

  // Start conversation when component mounts
  useEffect(() => {
    simulateAiResponse()
  }, [])

  const handleUserResponse = (response: string) => {
    // Add user response to messages
    setMessages((prev) => [...prev, { role: "user", content: response }])

    // Move to next question
    setCurrentQuestion((prev) => prev + 1)

    // Simulate AI thinking and response
    simulateAiResponse()
  }

  const handleRepeatQuestion = () => {
    // Just repeat the last AI message
    const lastAiMessage = messages.filter((m) => m.role === "ai").pop()
    if (lastAiMessage) {
      setMessages((prev) => [...prev, { ...lastAiMessage }])
    }
  }

  const handleContinue = () => {
    // Update user data with a simulated diagnosis result
    updateUserData({
      diagnosisResult: {
        condition: "Tension Headache",
        severity: "medium",
        nextStep: "selfCare",
      },
    })
    onNext()
  }

  // Predefined user responses for demo
  const quickResponses = [
    "About 2 days now",
    "I took some over-the-counter pain relievers",
    "It's about a 6 out of 10",
    "Yes, it's making it hard to concentrate at work",
    "I've had similar headaches before, but not this severe",
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <Card className="w-full mb-8 shadow-lg border-teal-100">
        <CardContent className="p-8">
          <h2 className="text-3xl font-semibold text-teal-700 mb-6 text-center">AI Diagnostic Conversation</h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 h-96 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "ai" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === "ai" ? "bg-teal-100 text-teal-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {message.role === "ai" && (
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center mr-2">
                          <WaveformIcon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium">AMM AI Assistant</span>
                      </div>
                    )}
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-lg bg-teal-100 text-teal-800">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center mr-2">
                        <WaveformIcon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium">AMM AI Assistant</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce delay-100"></div>
                      <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!conversationComplete ? (
            <div>
              <div className="flex justify-between mb-4">
                <Button onClick={handleRepeatQuestion} variant="outline" className="text-gray-600">
                  <RefreshCwIcon className="mr-2 h-4 w-4" />
                  Repeat Question
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {quickResponses
                  .slice(Math.max(0, currentQuestion - 1), Math.min(quickResponses.length, currentQuestion + 2))
                  .map((response, index) => (
                    <Button
                      key={index}
                      onClick={() => handleUserResponse(response)}
                      variant="outline"
                      className="text-left justify-start h-auto py-3 text-gray-700 hover:bg-gray-100"
                      disabled={isThinking}
                    >
                      {response}
                    </Button>
                  ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-4">The AI has completed its assessment based on your responses.</p>
              <Button onClick={handleContinue} size="lg" className="text-lg py-6 px-8 bg-teal-600 hover:bg-teal-700">
                View Assessment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {!conversationComplete && (
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
