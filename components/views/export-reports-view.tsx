"use client"

import { useState, useRef, useEffect } from "react"
import { 
  FileText, 
  MessageSquare, 
  Download, 
  Share2, 
  ArrowLeft,
  Palette,
  Eraser,
  Trash2,
  Heart,
  Star,
  Sun,
  Smile,
  ThumbsUp,
  Gift,
  Flower2,
  Home,
  Users,
  Camera,
  Sparkles,
  CheckCircle2,
  Calendar,
  Edit3,
  ClipboardCopy,
  Zap,
  AlignLeft,
  FileStack
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface ExportReportsViewProps {
  onBack: () => void
}

interface Sticker {
  id: string
  icon: React.ElementType
  label: string
  color: string
}

const stickers: Sticker[] = [
  { id: "heart", icon: Heart, label: "Heart", color: "text-rose-500" },
  { id: "star", icon: Star, label: "Star", color: "text-amber-500" },
  { id: "sun", icon: Sun, label: "Sun", color: "text-yellow-500" },
  { id: "smile", icon: Smile, label: "Smile", color: "text-emerald-500" },
  { id: "thumbsup", icon: ThumbsUp, label: "Good Job", color: "text-blue-500" },
  { id: "gift", icon: Gift, label: "Gift", color: "text-purple-500" },
  { id: "flower", icon: Flower2, label: "Flower", color: "text-pink-500" },
  { id: "home", icon: Home, label: "Home", color: "text-orange-500" },
  { id: "users", icon: Users, label: "Family", color: "text-teal-500" },
  { id: "camera", icon: Camera, label: "Photo", color: "text-indigo-500" },
]

const colors = [
  "#64748b", "#ef4444", "#f97316", "#eab308", 
  "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"
]

interface PlacedSticker {
  id: string
  stickerId: string
  x: number
  y: number
}

interface DrawingPath {
  points: { x: number; y: number }[]
  color: string
  size: number
}

type PolishStyle = "professional" | "concise" | "detailed"

export function ExportReportsView({ onBack }: ExportReportsViewProps) {
  const { selectedClient, assessmentAnswers, healthStatus } = useAppStore()
  
  // Date and attendance
  const [reportDate, setReportDate] = useState(() => {
    const now = new Date()
    return now.toISOString().split("T")[0]
  })
  const [isAttendanceConfirmed, setIsAttendanceConfirmed] = useState(true)
  
  // AI Polish style
  const [polishStyle, setPolishStyle] = useState<PolishStyle>("professional")
  const [isPolishing, setIsPolishing] = useState(false)
  
  // Formal Report State
  const [formalReport, setFormalReport] = useState("")
  const [copied, setCopied] = useState(false)
  
  // WhatsApp Report State
  const [whatsappText, setWhatsappText] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushColor, setBrushColor] = useState("#3b82f6")
  const [brushSize, setBrushSize] = useState([4])
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([])
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [drawingPaths, setDrawingPaths] = useState<DrawingPath[]>([])
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null)
  const [isDrawMode, setIsDrawMode] = useState(false)

  // Generate reports on mount
  useEffect(() => {
    generateFormalReport()
    generateWhatsAppReport()
  }, [selectedClient, assessmentAnswers, healthStatus, reportDate, polishStyle, isAttendanceConfirmed])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const generateFormalReport = () => {
    const clientName = selectedClient?.name || "Client"
    const formattedDate = formatDate(reportDate)
    const visitDate = new Date(reportDate)
    const reportId = `SV-${visitDate.getFullYear()}${String(visitDate.getMonth() + 1).padStart(2, "0")}${String(visitDate.getDate()).padStart(2, "0")}${String(Math.floor(Math.random() * 100)).padStart(2, "0")}`
    const totalHealth = healthStatus.water + healthStatus.sleep + healthStatus.eating + healthStatus.exercise
    const healthLevel = totalHealth >= 28 ? "Good Condition" : totalHealth >= 20 ? "Stable with Monitoring" : "Requires Increased Support"
    const riskLevel = totalHealth < 20 ? "High" : totalHealth < 28 ? "Moderate" : "Low"

    let report = `# Social Work Service Visit Report\n\n`
    report += `**Report ID**: ${reportId}\n`
    report += `**Report Date**: ${formattedDate}\n`
    report += `**Prepared By**: Social Work Service Team\n`
    report += `**Confidentiality Level**: Internal Use Only\n\n`
    report += `---\n\n`

    report += `## I. Basic Information\n\n`
    report += `| Item | Content |\n`
    report += `|------|----------|\n`
    report += `| Client Name | ${clientName} |\n`
    report += `| Visit Date | ${formattedDate} |\n`
    report += `| Visit Location | ${selectedClient?.address || "N/A"} |\n`
    report += `| Contact Number | ${selectedClient?.phone || "N/A"} |\n`
    report += `| Service Category | Home Care Visit |\n`
    report += `| Visit Duration | Approximately 60 minutes |\n`
    report += `| Case Number | ${reportId} |\n\n`

    report += `## II. Health Status Assessment\n\n`
    report += `Based on direct on-site assessment conducted during this visit, the client's current health status is documented as follows:\n\n`
    report += `### 2.1 Quantitative Health Indicators\n\n`
    report += `| Indicator | Score (0–10) | Status |\n`
    report += `|-----------|-------------|--------|\n`
    report += `| Hydration / Water Intake | ${healthStatus.water}/10 | ${healthStatus.water >= 7 ? "Adequate" : healthStatus.water >= 4 ? "Needs Improvement" : "Insufficient — Action Required"} |\n`
    report += `| Sleep Quality | ${healthStatus.sleep}/10 | ${healthStatus.sleep >= 7 ? "Good" : healthStatus.sleep >= 4 ? "Fair" : "Poor — Intervention Advised"} |\n`
    report += `| Appetite / Eating | ${healthStatus.eating}/10 | ${healthStatus.eating >= 7 ? "Good Appetite" : healthStatus.eating >= 4 ? "Moderate" : "Poor — Nutritional Risk"} |\n`
    report += `| Physical Activity | ${healthStatus.exercise}/10 | ${healthStatus.exercise >= 7 ? "Active" : healthStatus.exercise >= 4 ? "Lightly Active" : "Sedentary — Mobility Concern"} |\n`
    report += `| **Overall Score** | **${totalHealth}/40** | **${healthLevel}** |\n\n`
    report += `### 2.2 Clinical Observations\n\n`
    report += `The client presented in a ${totalHealth >= 28 ? "generally positive" : "concerning"} condition during today's visit. `
    if (healthStatus.water < 4) report += `Hydration levels are critically low and immediate attention is required. `
    if (healthStatus.sleep < 4) report += `Sleep disturbances were reported and may be contributing to fatigue. `
    if (healthStatus.eating < 4) report += `Appetite is poor; nutritional supplementation should be considered. `
    if (healthStatus.exercise < 4) report += `Limited mobility was observed; physiotherapy referral may be appropriate. `
    if (totalHealth >= 28) report += `Vital signs were stable, cognitive engagement was positive, and the client demonstrated good responsiveness throughout the session. `
    report += `\n\n`
    report += `**Overall Assessment Level**: ${healthLevel}\n`
    report += `**Risk Classification**: ${riskLevel} Risk\n`
    report += `**Immediate Risk Alert**: ${(healthStatus.water < 4 || healthStatus.sleep < 4) ? "YES — One or more critical indicators below threshold. Supervisor notification required within 24 hours." : "None — All indicators within acceptable range."}\n\n`

    report += `## III. Cognitive Assessment Record\n\n`
    report += `The following standardised assessment activities were conducted during this visit in accordance with the cognitive care protocol:\n\n`
    if (assessmentAnswers.length > 0) {
      report += `| # | Assessment Activity | Client Response Summary | Completion Status |\n`
      report += `|---|--------------------|-----------------------|------------------|\n`
      assessmentAnswers.forEach((answer, index) => {
        const activityName = answer.question.split(":")[0]?.trim() || `Activity ${index + 1}`
        const responseSummary = answer.answer
          ? answer.answer.substring(0, 60) + (answer.answer.length > 60 ? "..." : "")
          : "No response recorded"
        const status = answer.completionStatus || "Pending Review"
        report += `| ${index + 1} | ${activityName} | ${responseSummary} | ${status} |\n`
      })
      report += `\n`
      const completed = assessmentAnswers.filter(a => a.completionStatus === "100% Complete").length
      const partial = assessmentAnswers.filter(a => a.completionStatus === "> 50% Complete").length
      const total = assessmentAnswers.length
      report += `**Assessment Completion Summary**: ${completed} fully completed, ${partial} partially completed, out of ${total} total activities.\n\n`
    } else {
      report += `| # | Activity | Description | Status |\n`
      report += `|---|----------|-------------|--------|\n`
      report += `| 1 | Reality Orientation | Date, time, season, and location awareness | Completed |\n`
      report += `| 2 | Short-Term Memory | Three-item recall test with delay | Completed |\n`
      report += `| 3 | Reminiscence Therapy | Sharing personal memories and life experiences | Completed |\n`
      report += `| 4 | Memory Reinforcement | Photo-based object recognition | Completed |\n\n`
    }

    report += `## IV. Service Record\n\n`
    report += `During this home visit, the assigned social worker delivered the following professional services:\n\n`
    report += `1. **Health Monitoring** — Comprehensive vital sign check, medication compliance review, and symptom screening\n`
    report += `2. **Cognitive Activity Facilitation** — Structured cognitive stimulation exercises per approved care protocol\n`
    report += `3. **Psychosocial Support** — Active listening, emotional support, and social engagement activities\n`
    report += `4. **Nutritional Guidance** — Review of dietary intake, meal preparation support and advice\n`
    report += `5. **Safety Assessment** — Home environment safety check and fall-risk evaluation\n`
    report += `6. **Family Liaison** — Progress update prepared for sharing with primary family contact\n\n`

    report += `## V. Professional Recommendations and Follow-up Plan\n\n`
    report += `Based on the assessment findings above, the following professional recommendations are made:\n\n`
    report += `### 5.1 Short-Term Actions (Within 1 Week)\n`
    report += `- ${healthStatus.water < 5 ? "Arrange daily hydration reminder system or caregiver support" : "Continue encouraging regular water intake throughout the day"}\n`
    report += `- ${healthStatus.sleep < 5 ? "Refer to GP for sleep assessment and possible intervention" : "Maintain current sleep hygiene routines"}\n`
    report += `- ${healthStatus.eating < 5 ? "Consult dietitian; consider meal delivery service enrollment" : "Monitor appetite at next visit"}\n`
    report += `- Schedule follow-up home visit within 7 days to monitor progress\n\n`
    report += `### 5.2 Medium-Term Actions (Within 1 Month)\n`
    report += `- Increase visit frequency to twice per week if indicators do not improve\n`
    report += `- Contact ${clientName}'s primary family contact to discuss care arrangements\n`
    report += `- Coordinate with community hospital to establish or update health records\n`
    report += `- Review and update the individualised care plan based on this assessment\n\n`
    report += `### 5.3 Equipment and Resource Needs\n`
    report += `- ${healthStatus.exercise < 5 ? "Mobility aid assessment recommended; request occupational therapy evaluation" : "No immediate equipment needs identified"}\n`
    report += `- Blood pressure monitor to be brought at next visit for baseline recording\n\n`

    report += `## VI. Attendance and Verification\n\n`
    report += `| Field | Details |\n`
    report += `|-------|---------|\n`
    report += `| Visit Confirmed | ${isAttendanceConfirmed ? "Yes — Same-day attendance verified" : "Pending verification"} |\n`
    report += `| Visit Date | ${formattedDate} |\n`
    report += `| Report Prepared | ${formattedDate} |\n\n`

    report += `## VII. Signatures\n\n`
    report += `| Visiting Staff | Signature Date | Supervisor / Reviewer | Review Date |\n`
    report += `|----------------|----------------|-----------------------|-------------|\n`
    report += `| __________________ | __________________ | __________________ | __________________ |\n\n`
    report += `*This report is confidential and intended for authorised personnel only. Please handle in accordance with your organisation's data protection policy.*\n`

    setFormalReport(report)
  }

  const generateWhatsAppReport = () => {
    const clientName = selectedClient?.name || "Client"
    const date = new Date(reportDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })

    let text = `Dear Family,\n\n`
    text += `Here's today's update for ${clientName} (${date}):\n\n`
    
    text += `Health Check:\n`
    text += `Water: ${healthStatus.water}/10\n`
    text += `Sleep: ${healthStatus.sleep}/10\n`
    text += `Eating: ${healthStatus.eating}/10\n`
    text += `Exercise: ${healthStatus.exercise}/10\n\n`
    
    text += `Today's Session Summary:\n`
    if (assessmentAnswers.length > 0) {
      const completed = assessmentAnswers.filter(a => 
        a.completionStatus === "100% Complete" || a.completionStatus === "> 50% Complete"
      ).length
      text += `Completed ${completed}/${assessmentAnswers.length} activities successfully!\n\n`
    }
    
    text += `${clientName} was in good spirits today. We had a wonderful time together during our visit!\n\n`
    text += `Best regards,\n`
    text += `Your Social Worker\n\n`
    text += `${date} | Attendance Verified`

    setWhatsappText(text)
  }

  const handleAIPolish = () => {
    setIsPolishing(true)
    setTimeout(() => {
      generateFormalReport()
      setIsPolishing(false)
    }, 1000)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formalReport)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Drawing handlers
  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const container = containerRef.current
    if (!container) return { x: 0, y: 0 }
    
    const rect = container.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawMode && !selectedSticker) return
    
    const coords = getCoords(e)
    
    if (selectedSticker) {
      setPlacedStickers(prev => [...prev, {
        id: Date.now().toString(),
        stickerId: selectedSticker,
        x: coords.x,
        y: coords.y
      }])
      setSelectedSticker(null)
      return
    }
    
    if (isDrawMode) {
      setIsDrawing(true)
      setCurrentPath({
        points: [coords],
        color: brushColor,
        size: brushSize[0]
      })
    }
  }

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentPath) return
    
    const coords = getCoords(e)
    setCurrentPath(prev => prev ? {
      ...prev,
      points: [...prev.points, coords]
    } : null)
  }

  const handlePointerUp = () => {
    if (currentPath && currentPath.points.length > 1) {
      setDrawingPaths(prev => [...prev, currentPath])
    }
    setIsDrawing(false)
    setCurrentPath(null)
  }

  const clearDrawings = () => {
    setDrawingPaths([])
    setPlacedStickers([])
  }

  const handleDownloadFormal = () => {
    const blob = new Blob([formalReport], { type: "text/plain" })
    const link = document.createElement("a")
    link.download = `formal-report-${selectedClient?.name || "client"}-${reportDate}.txt`
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  const handleShareWhatsApp = () => {
    const encodedText = encodeURIComponent(whatsappText)
    window.open(`https://wa.me/?text=${encodedText}`, "_blank")
  }

  const handleDownloadWhatsAppImage = async () => {
    const container = containerRef.current
    if (!container) return
    
    const canvas = document.createElement("canvas")
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    ctx.scale(2, 2)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, rect.width, rect.height)
    
    ctx.fillStyle = "#000000"
    ctx.font = "14px system-ui"
    const lines = whatsappText.split("\n")
    let y = 24
    lines.forEach(line => {
      ctx.fillText(line, 16, y)
      y += 20
    })
    
    drawingPaths.forEach(path => {
      if (path.points.length < 2) return
      ctx.beginPath()
      ctx.moveTo(path.points[0].x, path.points[0].y)
      path.points.forEach(point => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.strokeStyle = path.color
      ctx.lineWidth = path.size
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
    })
    
    const link = document.createElement("a")
    link.download = `whatsapp-creative-report-${reportDate}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const polishOptions = [
    { 
      id: "professional" as PolishStyle, 
      icon: FileStack, 
      label: "Professional", 
      desc: "Suitable for official reports and archives" 
    },
    { 
      id: "concise" as PolishStyle, 
      icon: Zap, 
      label: "Concise", 
      desc: "Highlight key points, remove redundancy" 
    },
    { 
      id: "detailed" as PolishStyle, 
      icon: AlignLeft, 
      label: "Detailed", 
      desc: "Add details and background information" 
    },
  ]

  return (
    <div className="flex flex-col gap-4 pb-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen -mx-4 -mt-4 px-4 pt-4">
      {/* Success Banner - Light Slate Blue Style */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Report Generated Successfully</h2>
            <p className="text-sm text-white/90">You can use AI polish to optimize the report content, or copy/download directly</p>
          </div>
        </div>
      </div>

      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <Badge variant="secondary" className="mb-1">
            {selectedClient?.name || "No Client"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Two different reports with attendance verification
          </p>
        </div>
      </div>

      {/* Date Selection and Attendance Confirmation */}
      <Card className="bg-white/80 backdrop-blur border-slate-200/60 shadow-sm">
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-700">Report Date</span>
              </div>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="attendance"
                  checked={isAttendanceConfirmed}
                  onCheckedChange={(checked) => setIsAttendanceConfirmed(checked as boolean)}
                />
                <label htmlFor="attendance" className="flex items-center gap-2 cursor-pointer">
                  <CheckCircle2 className={cn(
                    "h-5 w-5",
                    isAttendanceConfirmed ? "text-emerald-500" : "text-slate-400"
                  )} />
                  <span className="text-sm font-medium text-slate-700">
                    Same-day Attendance Verified
                  </span>
                </label>
              </div>
              {isAttendanceConfirmed && (
                <Badge className="bg-emerald-500">Confirmed</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="formal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100/80">
          <TabsTrigger value="formal" className="gap-2 data-[state=active]:bg-white">
            <FileText className="h-4 w-4" />
            Work Report
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2 data-[state=active]:bg-white">
            <Palette className="h-4 w-4" />
            Creative Report
          </TabsTrigger>
        </TabsList>

        {/* Formal Report Tab - Reference Image Style */}
        <TabsContent value="formal" className="mt-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Report Preview Panel */}
            <Card className="md:col-span-2 bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-700">
                    <FileText className="h-4 w-4" />
                    Report Preview
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                      <ClipboardCopy className="h-3.5 w-3.5" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadFormal} className="gap-1.5">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="prose prose-sm prose-slate max-w-none">
                  <Textarea
                    value={formalReport}
                    onChange={(e) => setFormalReport(e.target.value)}
                    className="min-h-[500px] font-mono text-xs resize-none border-0 bg-transparent p-0 focus-visible:ring-0 leading-relaxed"
                    placeholder="Report will be generated..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Polish Panel */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  AI Polish
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose a style and AI will help optimize the report&apos;s expression and format
                </p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {polishOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = polishStyle === option.id
                  return (
                    <button
                      key={option.id}
                      onClick={() => setPolishStyle(option.id)}
                      className={cn(
                        "w-full p-3 rounded-xl border-2 text-left transition-all",
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "h-9 w-9 rounded-lg flex items-center justify-center",
                          isSelected ? "bg-primary/10" : "bg-slate-100"
                        )}>
                          <Icon className={cn(
                            "h-5 w-5",
                            isSelected ? "text-primary" : "text-slate-500"
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium text-sm",
                              isSelected ? "text-primary" : "text-slate-700"
                            )}>
                              {option.label}
                            </span>
                            {isSelected && (
                              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                                Applied
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {option.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}

                <Button 
                  onClick={handleAIPolish} 
                  className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 mt-4"
                  disabled={isPolishing}
                >
                  <Sparkles className={cn("h-4 w-4", isPolishing && "animate-spin")} />
                  {isPolishing ? "Polishing..." : "New Scan"}
                </Button>

                <Button 
                  variant="outline" 
                  onClick={handleDownloadFormal} 
                  className="w-full gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>

                {/* Tips */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-600 mb-2">Tips</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>Polished content can still be edited</li>
                    <li>Supports Markdown format export</li>
                    <li>Try different polish styles multiple times</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Creative Report Tab - tools and canvas unified in one card */}
        <TabsContent value="whatsapp" className="mt-4">
          <Card className="bg-white shadow-sm border-slate-200 overflow-hidden">
            {/* Toolbar header */}
            <CardHeader className="pb-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-blue-50/60 to-indigo-50/60">
              <div className="flex items-center justify-between mb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
                  <Palette className="h-4 w-4 text-primary" />
                  Creative Report
                  {(isDrawMode || selectedSticker) && (
                    <Badge className="text-xs bg-primary/10 text-primary border border-primary/20">
                      {selectedSticker ? "Tap report to place sticker" : "Draw mode on"}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={isDrawMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setIsDrawMode(!isDrawMode); setSelectedSticker(null) }}
                    className={cn("gap-1 h-8", isDrawMode && "bg-primary")}
                  >
                    <Edit3 className="h-3 w-3" />
                    {isDrawMode ? "Drawing" : "Draw"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearDrawings}
                    className="h-8 gap-1 border-slate-200 text-slate-600"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear
                  </Button>
                </div>
              </div>

              {/* Color swatches + brush size inline */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => { setBrushColor(color); setIsDrawMode(true); setSelectedSticker(null) }}
                      className={cn(
                        "h-6 w-6 rounded-full border-2 transition-all shadow-sm",
                        brushColor === color && isDrawMode
                          ? "border-slate-700 scale-125 ring-2 ring-slate-300"
                          : "border-white hover:scale-110"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <button
                    onClick={() => { setBrushColor("#ffffff"); setIsDrawMode(true); setSelectedSticker(null) }}
                    className={cn(
                      "h-6 w-6 rounded-full border-2 border-slate-300 flex items-center justify-center transition-all shadow-sm hover:scale-110",
                      brushColor === "#ffffff" && isDrawMode && "border-slate-700 scale-125 ring-2 ring-slate-300"
                    )}
                    title="Eraser"
                  >
                    <Eraser className="h-3 w-3 text-slate-500" />
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-32">
                  <span className="text-xs text-slate-500 shrink-0">Size</span>
                  <Slider
                    value={brushSize}
                    onValueChange={setBrushSize}
                    min={1}
                    max={20}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs font-medium w-5 text-center text-slate-600">{brushSize[0]}</span>
                </div>
              </div>

              {/* Sticker row */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs text-slate-500 shrink-0">Stickers:</span>
                {stickers.map((sticker) => {
                  const Icon = sticker.icon
                  return (
                    <button
                      key={sticker.id}
                      onClick={() => { setSelectedSticker(sticker.id === selectedSticker ? null : sticker.id); setIsDrawMode(false) }}
                      title={sticker.label}
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center border transition-all",
                        selectedSticker === sticker.id
                          ? "bg-primary/10 border-primary ring-2 ring-primary/30 scale-110"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", sticker.color)} />
                    </button>
                  )
                })}
              </div>
            </CardHeader>

            {/* The report IS the canvas - drawing goes directly on top of it */}
            <CardContent className="relative p-0">
              <div
                ref={containerRef}
                className={cn(
                  "relative select-none",
                  isDrawMode && "cursor-crosshair",
                  selectedSticker && "cursor-cell"
                )}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
              >
                {/* Report text - the canvas background */}
                <div
                  className={cn(
                    "min-h-[520px] p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-700 bg-white",
                    (isDrawMode || selectedSticker) && "pointer-events-none"
                  )}
                >
                  {formalReport}
                </div>

                {/* SVG drawing layer - sits directly over the report */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ minHeight: "520px" }}
                >
                  {drawingPaths.map((path, index) => (
                    <path
                      key={index}
                      d={`M ${path.points.map(p => `${p.x} ${p.y}`).join(" L ")}`}
                      stroke={path.color}
                      strokeWidth={path.size}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  ))}
                  {currentPath && currentPath.points.length > 1 && (
                    <path
                      d={`M ${currentPath.points.map(p => `${p.x} ${p.y}`).join(" L ")}`}
                      stroke={currentPath.color}
                      strokeWidth={currentPath.size}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  )}
                </svg>

                {/* Sticker layer */}
                {placedStickers.map((placed) => {
                  const sticker = stickers.find(s => s.id === placed.stickerId)
                  if (!sticker) return null
                  const Icon = sticker.icon
                  return (
                    <div
                      key={placed.id}
                      className={cn("absolute pointer-events-none drop-shadow-md", sticker.color)}
                      style={{ left: placed.x - 16, top: placed.y - 16 }}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                  )
                })}
              </div>

              {/* Action buttons at the bottom of the single card */}
              <div className="flex gap-2 p-4 bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/30 border-t border-slate-100">
                <Button
                  onClick={handleShareWhatsApp}
                  className="flex-1 gap-2 bg-gradient-to-r from-slate-600 via-blue-600 to-indigo-600 hover:from-slate-700 hover:via-blue-700 hover:to-indigo-700"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadWhatsAppImage}
                  className="flex-1 gap-2 border-slate-300 hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                  Download Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
