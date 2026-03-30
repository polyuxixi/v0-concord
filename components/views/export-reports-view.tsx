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
  Edit3
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

export function ExportReportsView({ onBack }: ExportReportsViewProps) {
  const { selectedClient, assessmentAnswers, healthStatus } = useAppStore()
  
  // Date and attendance
  const [reportDate, setReportDate] = useState(() => {
    const now = new Date()
    return now.toISOString().split("T")[0]
  })
  const [isAttendanceConfirmed, setIsAttendanceConfirmed] = useState(true)
  
  // Formal Report State
  const [formalReport, setFormalReport] = useState("")
  
  // WhatsApp Report State - Drawing directly on report
  const [whatsappText, setWhatsappText] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
  }, [selectedClient, assessmentAnswers, healthStatus, reportDate])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const generateFormalReport = () => {
    const clientName = selectedClient?.name || "Client"
    const formattedDate = formatDate(reportDate)

    let report = `COGNITIVE ASSESSMENT REPORT\n`
    report += `══════════════════════════════════════\n\n`
    report += `Date: ${formattedDate}\n`
    report += `Attendance: ${isAttendanceConfirmed ? "✓ Confirmed" : "○ Not Confirmed"}\n`
    report += `Client: ${clientName}\n`
    report += `Location: ${selectedClient?.address || "N/A"}\n`
    report += `Social Worker: [Your Name]\n\n`
    
    report += `HEALTH STATUS SUMMARY\n`
    report += `──────────────────────────────────────\n`
    report += `Water Intake: ${healthStatus.water}/10\n`
    report += `Sleep Quality: ${healthStatus.sleep}/10\n`
    report += `Eating Status: ${healthStatus.eating}/10\n`
    report += `Exercise Level: ${healthStatus.exercise}/10\n\n`
    
    report += `ASSESSMENT DETAILS\n`
    report += `──────────────────────────────────────\n\n`

    if (assessmentAnswers.length > 0) {
      assessmentAnswers.forEach((answer, index) => {
        report += `${index + 1}. ${answer.question}\n`
        report += `   Response: ${answer.answer}\n`
        report += `   Status: ${answer.completionStatus || "Pending"}\n\n`
      })
    } else {
      report += `No assessment data available.\n\n`
    }

    report += `OVERALL OBSERVATIONS\n`
    report += `──────────────────────────────────────\n`
    report += `The client demonstrated varying levels of cognitive engagement throughout the assessment. `
    report += `Further monitoring and follow-up sessions are recommended to track progress.\n\n`
    
    report += `RECOMMENDATIONS\n`
    report += `──────────────────────────────────────\n`
    report += `1. Continue regular cognitive exercises\n`
    report += `2. Maintain social engagement activities\n`
    report += `3. Schedule follow-up assessment in 2 weeks\n`
    report += `4. Monitor health indicators regularly\n\n`
    
    report += `══════════════════════════════════════\n`
    report += `Report generated by Concord App\n`
    report += `Attendance Record: ${isAttendanceConfirmed ? "Same-day verified" : "Pending verification"}\n`

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
    text += `💧 Water: ${healthStatus.water}/10\n`
    text += `😴 Sleep: ${healthStatus.sleep}/10\n`
    text += `🍽️ Eating: ${healthStatus.eating}/10\n`
    text += `🏃 Exercise: ${healthStatus.exercise}/10\n\n`
    
    text += `Today's Session Summary:\n`
    if (assessmentAnswers.length > 0) {
      const completed = assessmentAnswers.filter(a => 
        a.completionStatus === "100% Complete" || a.completionStatus === "> 50% Complete"
      ).length
      text += `✅ Completed ${completed}/${assessmentAnswers.length} activities successfully!\n\n`
    }
    
    text += `${clientName} was in good spirits today. We had a wonderful time together during our visit!\n\n`
    text += `Best regards,\n`
    text += `Your Social Worker\n\n`
    text += `📅 ${date} | ✓ Attendance Verified`

    setWhatsappText(text)
  }

  // Drawing handlers for overlay on WhatsApp report
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
    
    // Use html2canvas-like approach (simplified for demo)
    const canvas = document.createElement("canvas")
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    ctx.scale(2, 2)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, rect.width, rect.height)
    
    // Draw text
    ctx.fillStyle = "#000000"
    ctx.font = "14px system-ui"
    const lines = whatsappText.split("\n")
    let y = 24
    lines.forEach(line => {
      ctx.fillText(line, 16, y)
      y += 20
    })
    
    // Draw paths
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

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Export Reports
          </h2>
          <p className="text-sm text-muted-foreground">
            Two different reports with attendance verification
          </p>
        </div>
      </div>

      {/* Date Selection and Attendance Confirmation */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/10 border-primary/20">
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Report Date</span>
              </div>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="border border-input rounded-md px-3 py-1.5 text-sm bg-background"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="attendance"
                  checked={isAttendanceConfirmed}
                  onCheckedChange={(checked) => setIsAttendanceConfirmed(checked as boolean)}
                />
                <label htmlFor="attendance" className="flex items-center gap-2 cursor-pointer">
                  <CheckCircle2 className={cn(
                    "h-5 w-5",
                    isAttendanceConfirmed ? "text-emerald-500" : "text-muted-foreground"
                  )} />
                  <span className="text-sm font-medium">
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="formal" className="gap-2">
            <FileText className="h-4 w-4" />
            Formal Report
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp Report
          </TabsTrigger>
        </TabsList>

        {/* Formal Report Tab - Direct Export */}
        <TabsContent value="formal" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Professional Work Report
                </span>
                <Badge variant="outline">{selectedClient?.name || "No Client"}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formalReport}
                onChange={(e) => setFormalReport(e.target.value)}
                className="min-h-[350px] font-mono text-xs resize-none"
                placeholder="Report will be generated based on assessment data..."
              />
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleDownloadFormal}>
                  <Download className="h-4 w-4" />
                  Download TXT
                </Button>
                <Button className="flex-1 gap-2">
                  <Share2 className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Report Tab - Drawing directly on report */}
        <TabsContent value="whatsapp" className="mt-4 space-y-4">
          {/* Drawing Tools */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Creative Tools
                </span>
                <Button
                  variant={isDrawMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsDrawMode(!isDrawMode)}
                  className="gap-1"
                >
                  <Edit3 className="h-3 w-3" />
                  {isDrawMode ? "Drawing On" : "Draw"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Colors */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Color:</span>
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBrushColor(color)}
                    className={cn(
                      "h-6 w-6 rounded-full border-2 transition-all",
                      brushColor === color ? "border-foreground scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setBrushColor("#ffffff")}
                  className="h-6 w-6"
                >
                  <Eraser className="h-3 w-3" />
                </Button>
              </div>

              {/* Brush Size */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Size:</span>
                <Slider
                  value={brushSize}
                  onValueChange={setBrushSize}
                  min={1}
                  max={20}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs font-medium w-4">{brushSize[0]}</span>
              </div>

              {/* Stickers */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Stickers (tap to select, then tap on report):</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {stickers.map((sticker) => {
                    const Icon = sticker.icon
                    return (
                      <button
                        key={sticker.id}
                        onClick={() => setSelectedSticker(sticker.id === selectedSticker ? null : sticker.id)}
                        className={cn(
                          "flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all",
                          selectedSticker === sticker.id
                            ? "bg-primary/20 ring-2 ring-primary"
                            : "bg-muted/50 hover:bg-muted"
                        )}
                      >
                        <Icon className={cn("h-5 w-5", sticker.color)} />
                        <span className="text-[10px] text-muted-foreground">
                          {sticker.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Clear Button */}
              <Button variant="outline" size="sm" onClick={clearDrawings} className="w-full">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All Drawings & Stickers
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp Report with Drawing Overlay */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                <MessageSquare className="h-4 w-4" />
                WhatsApp Creative Report
                {(isDrawMode || selectedSticker) && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {selectedSticker ? "Tap to place sticker" : "Draw on report"}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              {/* Report Container with Drawing Overlay */}
              <div 
                ref={containerRef}
                className={cn(
                  "relative bg-white rounded-lg border overflow-hidden select-none",
                  (isDrawMode || selectedSticker) && "cursor-crosshair"
                )}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
              >
                {/* Text Report (Editable when not drawing) */}
                <Textarea
                  value={whatsappText}
                  onChange={(e) => setWhatsappText(e.target.value)}
                  className={cn(
                    "min-h-[300px] text-sm resize-none border-0 bg-transparent",
                    (isDrawMode || selectedSticker) && "pointer-events-none"
                  )}
                  placeholder="Message for client's family..."
                />

                {/* Drawing Overlay - SVG for paths */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ minHeight: "300px" }}
                >
                  {/* Completed paths */}
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
                  {/* Current drawing path */}
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

                {/* Placed Stickers */}
                {placedStickers.map((placed) => {
                  const sticker = stickers.find(s => s.id === placed.stickerId)
                  if (!sticker) return null
                  const Icon = sticker.icon
                  return (
                    <div
                      key={placed.id}
                      className={cn("absolute pointer-events-none", sticker.color)}
                      style={{ left: placed.x - 16, top: placed.y - 16 }}
                    >
                      <Icon className="h-8 w-8 drop-shadow-md" />
                    </div>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={handleShareWhatsApp}
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  Share WhatsApp
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleDownloadWhatsAppImage}
                  className="flex-1 gap-2"
                >
                  <Download className="h-4 w-4" />
                  Save Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
