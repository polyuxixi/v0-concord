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
  }, [selectedClient, assessmentAnswers, healthStatus, reportDate, polishStyle])

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
    const reportId = `SV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`

    let report = `# Social Work Service Visit Report\n\n`
    report += `**Report ID**: ${reportId}\n`
    report += `**Report Date**: ${formattedDate}\n\n`
    report += `---\n\n`
    
    report += `## I. Basic Information\n\n`
    report += `| Item | Content |\n`
    report += `|------|----------|\n`
    report += `| Client | ${clientName} |\n`
    report += `| Visit Time | ${formattedDate} |\n`
    report += `| Visit Location | ${selectedClient?.address || "N/A"} |\n`
    report += `| Service Category | Home Care Visit |\n\n`
    
    report += `## II. Health Status Assessment\n\n`
    report += `Based on on-site assessment, the client's current health status is as follows:\n\n`
    
    const healthSummary = []
    if (healthStatus.water >= 7) healthSummary.push("good hydration")
    else if (healthStatus.water < 4) healthSummary.push("needs better hydration")
    if (healthStatus.sleep >= 7) healthSummary.push("adequate sleep")
    else if (healthStatus.sleep < 4) healthSummary.push("sleep concerns noted")
    if (healthStatus.eating >= 7) healthSummary.push("good appetite")
    else if (healthStatus.eating < 4) healthSummary.push("appetite needs monitoring")
    if (healthStatus.exercise >= 7) healthSummary.push("active lifestyle")
    else if (healthStatus.exercise < 4) healthSummary.push("limited mobility")
    
    report += `Water intake (${healthStatus.water}/10), Sleep quality (${healthStatus.sleep}/10). `
    report += `${healthSummary.length > 0 ? healthSummary.join(", ") + "." : "Overall status stable."}\n\n`
    
    report += `**Assessment Level**: ${healthStatus.water + healthStatus.sleep + healthStatus.eating + healthStatus.exercise >= 28 ? "Good Condition" : "Requires Continued Monitoring"}\n`
    report += `**Risk Alert**: ${healthStatus.water < 4 || healthStatus.sleep < 4 ? "Some indicators need attention, recommend increased monitoring frequency" : "No immediate concerns"}\n\n`
    
    report += `## III. Service Record\n\n`
    report += `During this visit, the social worker provided the following services:\n\n`
    
    if (assessmentAnswers.length > 0) {
      assessmentAnswers.forEach((answer, index) => {
        const status = answer.completionStatus || "Pending"
        report += `${index + 1}. ${answer.question.split(":")[0] || "Assessment activity"}\n`
      })
    } else {
      report += `1. Health check\n`
      report += `2. Medication guidance\n`
      report += `3. Psychological counseling\n`
      report += `4. Daily care assessment\n`
    }
    report += `\n`
    
    report += `## IV. Professional Recommendations and Follow-up Plan\n\n`
    report += `Client lives alone, children work out of town. Recommend increasing visit frequency, monitor medication compliance. Bring blood pressure monitor for next visit.\n\n`
    report += `**Recommended Actions**:\n`
    report += `- Increase visit frequency to twice per week\n`
    report += `- Contact community hospital to establish health records\n`
    report += `- Assist in contacting family members regarding client care arrangements\n\n`
    
    report += `## V. Signatures\n\n`
    report += `| Visiting Staff | Signature Date | Reviewer | Review Date |\n`
    report += `|----------------|----------------|----------|-------------|\n`
    report += `| __________ | __________ | __________ | __________ |\n`

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
