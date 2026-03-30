"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Camera, Send, ArrowLeft, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useAppStore, Client, AssessmentAnswer } from "@/lib/store"
import { cn } from "@/lib/utils"

interface ChatViewProps {
  client: Client | null
  onBack: () => void
  onProceedToReport: () => void
}

interface Message {
  id: string
  role: "ai" | "user"
  content: string
  questionId?: string
}

const assessmentQuestions = [
  { id: "1.0", question: "Reality Orientation: Share brief news/information. The client may share their thoughts or opinions based on their interests. (5 minutes)" },
  { id: "1.1", question: "Reality Orientation: Ask the client what year, month, day of the week, season, time, location, and district it is today. (Can be done again after exercise)" },
  { id: "2.0", question: "Short-term Memory: Using pictures or physical items, display 3 different objects. Ask the client to repeat the names 2 times. Wait for 5-10 minutes, then ask if they can recall the 3 items." },
  { id: "2.1", question: "Short-term Memory: Ask the client to remember the position of matching cards, flip them over, then ask them to reveal the matching cards with the same number." },
  { id: "3.0", question: "Reminiscence Therapy: Display everyday items from the client's past or Hong Kong landmarks, or play nostalgic songs. Ask the client to share and discuss people, events, and things from their past. (5-10 minutes)" },
  { id: "4.0", question: "Does the client remember the 3 items from question 2.0? Please have the client list them." },
]

const completionOptions = ["100% Complete", "> 50% Complete", "< 50% Complete", "Not Conducted", "Unable to Complete"]

export function ChatView({ client, onBack, onProceedToReport }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [completedAnswers, setCompletedAnswers] = useState<AssessmentAnswer[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const { setAssessmentAnswers, setSelectedClient } = useAppStore()

  useEffect(() => {
    if (client && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "ai",
        content: `Hello! I will now assist you with the cognitive assessment for ${client.name}. Let's begin with the first question.`
      }
      const firstQuestion: Message = {
        id: "q-1.0",
        role: "ai",
        content: assessmentQuestions[0].question,
        questionId: assessmentQuestions[0].id
      }
      setMessages([welcomeMessage, firstQuestion])
    }
  }, [client, messages.length])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue
    }
    setMessages(prev => [...prev, userMessage])

    // Save answer
    const currentQ = assessmentQuestions[currentQuestionIndex]
    const newAnswer: AssessmentAnswer = {
      questionId: currentQ.id,
      question: currentQ.question,
      answer: inputValue,
      completionStatus: ""
    }
    setCompletedAnswers(prev => [...prev, newAnswer])

    setInputValue("")

    // Move to next question or finish
    setTimeout(() => {
      if (currentQuestionIndex < assessmentQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1
        setCurrentQuestionIndex(nextIndex)
        const nextQuestion: Message = {
          id: `q-${assessmentQuestions[nextIndex].id}`,
          role: "ai",
          content: assessmentQuestions[nextIndex].question,
          questionId: assessmentQuestions[nextIndex].id
        }
        setMessages(prev => [...prev, nextQuestion])
      } else {
        const completeMessage: Message = {
          id: "complete",
          role: "ai",
          content: "Great! You have completed all the assessment questions. You can now proceed to generate the report."
        }
        setMessages(prev => [...prev, completeMessage])
      }
    }, 500)
  }

  const handleCompletionSelect = (answerId: string, status: string) => {
    setCompletedAnswers(prev => 
      prev.map(a => a.questionId === answerId ? { ...a, completionStatus: status } : a)
    )
  }

  const handleProceed = () => {
    setAssessmentAnswers(completedAnswers)
    onProceedToReport()
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
  }

  const isComplete = currentQuestionIndex >= assessmentQuestions.length - 1 && completedAnswers.length > 0

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold">{client?.name || "AI Assessment"}</h2>
          <p className="text-xs text-muted-foreground">Cognitive Assessment in Progress</p>
        </div>
        <Badge variant="secondary">
          {currentQuestionIndex + 1}/{assessmentQuestions.length}
        </Badge>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 px-1 py-4">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}
              >
                {message.questionId && (
                  <Badge variant="outline" className="mb-2 text-xs">
                    Q{message.questionId}
                  </Badge>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Answer Summary */}
      {completedAnswers.length > 0 && (
        <Card className="mx-1 mb-3 bg-secondary/50">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Completion Status:</p>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
              {completedAnswers.map((answer) => (
                <div key={answer.questionId} className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs shrink-0">
                    Q{answer.questionId}
                  </Badge>
                  <select
                    value={answer.completionStatus}
                    onChange={(e) => handleCompletionSelect(answer.questionId, e.target.value)}
                    className="flex-1 text-xs bg-background border border-input rounded-md px-2 py-1"
                  >
                    <option value="">Select status...</option>
                    {completionOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Area */}
      <div className="border-t border-border pt-3 pb-2">
        {isComplete ? (
          <Button onClick={handleProceed} className="w-full" size="lg">
            <Check className="h-4 w-4 mr-2" />
            Proceed to Report
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            {/* Camera Button */}
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 rounded-full h-10 w-10 border-accent bg-accent/30"
            >
              <Camera className="h-5 w-5 text-accent-foreground" />
            </Button>

            {/* Voice Button */}
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={handleVoiceToggle}
              className={cn(
                "shrink-0 rounded-full h-10 w-10",
                isRecording && "animate-pulse"
              )}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {/* Text Input */}
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer..."
              className="flex-1 rounded-full"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />

            {/* Send Button */}
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="shrink-0 rounded-full h-10 w-10"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
