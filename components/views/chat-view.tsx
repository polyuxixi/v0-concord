"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Mic, 
  MicOff, 
  Camera, 
  Send, 
  ArrowLeft, 
  Check,
  Droplets,
  Moon,
  Utensils,
  Dumbbell,
  FileText,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useAppStore, Client, AssessmentAnswer } from "@/lib/store"
import { cn } from "@/lib/utils"

interface ChatViewProps {
  client: Client | null
  onBack: () => void
  onProceedToReport: () => void
  onExportReports?: () => void
}

interface Message {
  id: string
  role: "ai" | "user"
  content: string
  questionId?: string
  source?: "voice" | "camera" | "text"
}

interface HealthIcon {
  key: "water" | "sleep" | "eating" | "exercise"
  icon: React.ElementType
  label: string
  color: string
  bgColor: string
}

const healthIcons: HealthIcon[] = [
  { key: "water", icon: Droplets, label: "Water", color: "text-sky-500", bgColor: "bg-sky-100" },
  { key: "sleep", icon: Moon, label: "Sleep", color: "text-indigo-500", bgColor: "bg-indigo-100" },
  { key: "eating", icon: Utensils, label: "Eating", color: "text-amber-500", bgColor: "bg-amber-100" },
  { key: "exercise", icon: Dumbbell, label: "Exercise", color: "text-emerald-500", bgColor: "bg-emerald-100" },
]

const assessmentQuestions = [
  { id: "1.0", question: "Reality Orientation: Share brief news/information. The client may share their thoughts or opinions based on their interests. (5 minutes)" },
  { id: "1.1", question: "Reality Orientation: Ask the client what year, month, day of the week, season, time, location, and district it is today. (Can be done again after exercise)" },
  { id: "2.0", question: "Short-term Memory: Using pictures or physical items, display 3 different objects. Ask the client to repeat the names 2 times. Wait for 5-10 minutes, then ask if they can recall the 3 items." },
  { id: "2.1", question: "Short-term Memory: Ask the client to remember the position of matching cards, flip them over, then ask them to reveal the matching cards with the same number." },
  { id: "3.0", question: "Reminiscence Therapy: Display everyday items from the client's past or Hong Kong landmarks, or play nostalgic songs. Ask the client to share and discuss people, events, and things from their past. (5-10 minutes)" },
  { id: "4.0", question: "Does the client remember the 3 items from question 2.0? Please have the client list them." },
]

const completionOptions = ["100% Complete", "> 50% Complete", "< 50% Complete", "Not Conducted", "Unable to Complete"]

export function ChatView({ client, onBack, onProceedToReport, onExportReports }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [completedAnswers, setCompletedAnswers] = useState<AssessmentAnswer[]>([])
  const [recognitionText, setRecognitionText] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  
  const { 
    setAssessmentAnswers, 
    healthStatus, 
    updateHealthMetric 
  } = useAppStore()

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

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setInputValue(prev => prev + finalTranscript)
          setRecognitionText("")
        } else {
          setRecognitionText(interimTranscript)
        }
      }

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error)
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current?.start()
        }
      }
    }

    return () => {
      recognitionRef.current?.stop()
    }
  }, [isRecording])

  const handleSendMessage = (source: "voice" | "camera" | "text" = "text") => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      source
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
    setRecognitionText("")

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
          content: "Great! You have completed all the assessment questions. Please set completion status for each question, then proceed to export reports."
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

  const handleExportReports = () => {
    setAssessmentAnswers(completedAnswers)
    if (onExportReports) {
      onExportReports()
    }
  }

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.")
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
      // Submit the voice input if there's content
      if (inputValue.trim()) {
        handleSendMessage("voice")
      }
    } else {
      setIsRecording(true)
      recognitionRef.current.start()
    }
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simulated OCR - in production, this would call an OCR API
    // For demo, we'll simulate text recognition
    const simulatedOCRText = `[Recognized from image: Client showed good engagement. Memory recall was partially successful. Orientation questions answered correctly.]`
    
    setInputValue(prev => {
      const newValue = prev ? `${prev}\n${simulatedOCRText}` : simulatedOCRText
      return newValue
    })

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleHealthClick = (key: "water" | "sleep" | "eating" | "exercise") => {
    const currentValue = healthStatus[key]
    const newValue = currentValue >= 10 ? 0 : currentValue + 1
    updateHealthMetric(key, newValue)
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

      {/* Health Status Icons for Current Client */}
      <div className="py-3 border-b border-border">
        <p className="text-xs text-muted-foreground mb-2">Client Health Status (tap to rate 0-10):</p>
        <div className="grid grid-cols-4 gap-2">
          {healthIcons.map((item) => {
            const Icon = item.icon
            const value = healthStatus[item.key]
            
            return (
              <button
                key={item.key}
                onClick={() => handleHealthClick(item.key)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/50 hover:bg-muted transition-all active:scale-95"
              >
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  item.bgColor
                )}>
                  <Icon className={cn("h-5 w-5", item.color)} />
                </div>
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <Badge 
                  variant={value > 0 ? "default" : "outline"}
                  className={cn(
                    "text-xs px-1.5 py-0",
                    value >= 7 && "bg-emerald-500",
                    value >= 4 && value < 7 && "bg-amber-500",
                    value > 0 && value < 4 && "bg-red-500"
                  )}
                >
                  {value}
                </Badge>
              </button>
            )
          })}
        </div>
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
                {message.source && message.role === "user" && (
                  <Badge variant="secondary" className="mb-2 text-xs ml-2">
                    {message.source === "voice" ? "Voice" : message.source === "camera" ? "OCR" : "Text"}
                  </Badge>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Answer Summary with Completion Status */}
      {completedAnswers.length > 0 && (
        <Card className="mx-1 mb-3 bg-secondary/50">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Question Answers & Completion Status:
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
              {completedAnswers.map((answer) => (
                <div key={answer.questionId} className="flex flex-col gap-1 p-2 bg-background rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs shrink-0">
                      Q{answer.questionId}
                    </Badge>
                    <p className="text-xs text-muted-foreground truncate flex-1">
                      {answer.answer.substring(0, 50)}...
                    </p>
                  </div>
                  <select
                    value={answer.completionStatus}
                    onChange={(e) => handleCompletionSelect(answer.questionId, e.target.value)}
                    className="text-xs bg-muted border border-input rounded-md px-2 py-1"
                  >
                    <option value="">Select completion status...</option>
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

      {/* Hidden file input for camera/image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Input Area */}
      <div className="border-t border-border pt-3 pb-2">
        {/* Voice Recognition Status */}
        {isRecording && (
          <div className="mb-2 p-2 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-primary font-medium">Recording...</span>
            </div>
            {recognitionText && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                {recognitionText}
              </p>
            )}
          </div>
        )}

        {/* Main Input Controls */}
        <div className="flex items-center gap-2">
          {/* Large Prominent Camera Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleCameraClick}
            className="shrink-0 rounded-full h-14 w-14 border-2 border-accent bg-accent/30 hover:bg-accent/50 shadow-lg"
          >
            <Camera className="h-7 w-7 text-accent-foreground" />
          </Button>

          {/* Voice Input Button - Direct Speech-to-Text */}
          <Button
            variant={isRecording ? "destructive" : "default"}
            size="icon"
            onClick={handleVoiceToggle}
            className={cn(
              "shrink-0 rounded-full h-12 w-12",
              isRecording && "animate-pulse"
            )}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          {/* Text Input */}
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Voice or OCR text appears here..."
            className="flex-1 rounded-full"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage("text")}
          />

          {/* Send Button */}
          <Button
            size="icon"
            onClick={() => handleSendMessage("text")}
            disabled={!inputValue.trim()}
            className="shrink-0 rounded-full h-10 w-10"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        {/* Export Two Reports Button */}
        {isComplete && (
          <Button 
            onClick={handleExportReports} 
            className="w-full mt-4 gap-2" 
            size="lg"
          >
            <FileText className="h-5 w-5" />
            Export Two Reports
            <MessageSquare className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
