"use client"

import { useState, useEffect } from "react"
import { 
  Clock, 
  Play, 
  Square, 
  Droplets, 
  Moon, 
  Utensils, 
  Dumbbell,
  Save,
  FileText,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface ReportViewProps {
  onProceedToCreative: () => void
}

interface HealthIcon {
  key: "water" | "sleep" | "eating" | "exercise"
  icon: React.ElementType
  label: string
  color: string
  bgColor: string
}

const healthIcons: HealthIcon[] = [
  { key: "water", icon: Droplets, label: "Water Intake", color: "text-sky-500", bgColor: "bg-sky-100" },
  { key: "sleep", icon: Moon, label: "Sleep Quality", color: "text-indigo-500", bgColor: "bg-indigo-100" },
  { key: "eating", icon: Utensils, label: "Eating Status", color: "text-amber-500", bgColor: "bg-amber-100" },
  { key: "exercise", icon: Dumbbell, label: "Exercise", color: "text-emerald-500", bgColor: "bg-emerald-100" },
]

export function ReportView({ onProceedToCreative }: ReportViewProps) {
  const { 
    selectedClient, 
    assessmentAnswers, 
    healthStatus, 
    updateHealthMetric,
    generatedReport,
    setGeneratedReport,
    addAttendanceRecord
  } = useAppStore()

  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [reportText, setReportText] = useState("")

  // Generate AI report on mount
  useEffect(() => {
    if (assessmentAnswers.length > 0 && !reportText) {
      const generatedText = generateReport()
      setReportText(generatedText)
      setGeneratedReport(generatedText)
    }
  }, [assessmentAnswers])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking, startTime])

  const generateReport = () => {
    const clientName = selectedClient?.name || "Client"
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })

    let report = `COGNITIVE ASSESSMENT REPORT\n`
    report += `Date: ${date}\n`
    report += `Client: ${clientName}\n`
    report += `Location: ${selectedClient?.address || "N/A"}\n\n`
    report += `ASSESSMENT SUMMARY\n`
    report += `─────────────────────────────────────\n\n`

    assessmentAnswers.forEach((answer, index) => {
      report += `${index + 1}. ${answer.question}\n`
      report += `   Response: ${answer.answer}\n`
      report += `   Status: ${answer.completionStatus || "Pending"}\n\n`
    })

    report += `\nOVERALL OBSERVATIONS\n`
    report += `─────────────────────────────────────\n`
    report += `The client demonstrated varying levels of cognitive engagement throughout the assessment. `
    report += `Further monitoring and follow-up sessions are recommended to track progress.\n\n`
    report += `\nRECOMMENDATIONS\n`
    report += `─────────────────────────────────────\n`
    report += `1. Continue regular cognitive exercises\n`
    report += `2. Maintain social engagement activities\n`
    report += `3. Schedule follow-up assessment in 2 weeks\n`

    return report
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartTracking = () => {
    setStartTime(new Date())
    setIsTracking(true)
  }

  const handleStopTracking = () => {
    if (startTime && selectedClient) {
      const endTime = new Date()
      addAttendanceRecord({
        id: Date.now().toString(),
        clientId: selectedClient.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        date: new Date().toISOString().split("T")[0]
      })
    }
    setIsTracking(false)
    setStartTime(null)
    setElapsedTime(0)
  }

  const handleHealthClick = (key: "water" | "sleep" | "eating" | "exercise") => {
    const currentValue = healthStatus[key]
    const newValue = currentValue >= 10 ? 0 : currentValue + 1
    updateHealthMetric(key, newValue)
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Report Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Generated Report
          </h2>
          <p className="text-sm text-muted-foreground">
            Review and edit the assessment report
          </p>
        </div>
        <Badge variant="outline">{selectedClient?.name || "No Client"}</Badge>
      </div>

      {/* Editable Report */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Assessment Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            className="min-h-[200px] font-mono text-sm resize-none"
            placeholder="Report will be generated based on your assessment..."
          />
        </CardContent>
      </Card>

      {/* Time Tracking Module */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Attendance Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-3xl font-bold font-mono">
                {formatTime(elapsedTime)}
              </span>
              <span className="text-xs text-muted-foreground">
                {isTracking ? "Recording..." : "Ready to track"}
              </span>
            </div>
            <div className="flex gap-2">
              {!isTracking ? (
                <Button onClick={handleStartTracking} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start
                </Button>
              ) : (
                <Button onClick={handleStopTracking} variant="destructive" className="gap-2">
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Status Icons */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Client Health Status</CardTitle>
          <p className="text-xs text-muted-foreground">
            Tap icons to rate (0-10 scale)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {healthIcons.map((item) => {
              const Icon = item.icon
              const value = healthStatus[item.key]
              
              return (
                <button
                  key={item.key}
                  onClick={() => handleHealthClick(item.key)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all active:scale-95"
                >
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center",
                    item.bgColor
                  )}>
                    <Icon className={cn("h-6 w-6", item.color)} />
                  </div>
                  <span className="text-xs text-center text-muted-foreground line-clamp-1">
                    {item.label}
                  </span>
                  <Badge 
                    variant={value > 0 ? "default" : "outline"}
                    className={cn(
                      "text-xs min-w-[2rem]",
                      value >= 7 && "bg-emerald-500",
                      value >= 4 && value < 7 && "bg-amber-500",
                      value > 0 && value < 4 && "bg-red-500"
                    )}
                  >
                    {value}/10
                  </Badge>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 gap-2">
          <Save className="h-4 w-4" />
          Save Draft
        </Button>
        <Button onClick={onProceedToCreative} className="flex-1 gap-2">
          Creative Report
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
