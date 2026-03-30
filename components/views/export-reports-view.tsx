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
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
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

export function ExportReportsView({ onBack }: ExportReportsViewProps) {
  const { selectedClient, assessmentAnswers, healthStatus } = useAppStore()
  
  // Formal Report State
  const [formalReport, setFormalReport] = useState("")
  
  // WhatsApp Report State
  const [whatsappText, setWhatsappText] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushColor, setBrushColor] = useState("#3b82f6")
  const [brushSize, setBrushSize] = useState([4])
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([])
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)

  // Generate reports on mount
  useEffect(() => {
    generateFormalReport()
    generateWhatsAppReport()
  }, [selectedClient, assessmentAnswers, healthStatus])

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)
    
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const generateFormalReport = () => {
    const clientName = selectedClient?.name || "Client"
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })

    let report = `COGNITIVE ASSESSMENT REPORT\n`
    report += `══════════════════════════════════════\n\n`
    report += `Date: ${date}\n`
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

    setFormalReport(report)
  }

  const generateWhatsAppReport = () => {
    const clientName = selectedClient?.name || "Client"
    const date = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })

    let text = `Hi! Here's today's update for ${clientName} (${date}):\n\n`
    
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
    
    text += `${clientName} was in good spirits today. We had a wonderful time together!\n\n`
    text += `Best regards,\n`
    text += `Your Social Worker`

    setWhatsappText(text)
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (selectedSticker) {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const rect = canvas.getBoundingClientRect()
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
      const x = clientX - rect.left
      const y = clientY - rect.top
      
      setPlacedStickers(prev => [...prev, {
        id: Date.now().toString(),
        stickerId: selectedSticker,
        x,
        y
      }])
      setSelectedSticker(null)
      return
    }

    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    const x = clientX - rect.left
    const y = clientY - rect.top
    
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    const x = clientX - rect.left
    const y = clientY - rect.top
    
    ctx.lineTo(x, y)
    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushSize[0]
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setPlacedStickers([])
  }

  const handleDownloadFormal = () => {
    const blob = new Blob([formalReport], { type: "text/plain" })
    const link = document.createElement("a")
    link.download = `formal-report-${selectedClient?.name || "client"}-${Date.now()}.txt`
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  const handleShareWhatsApp = () => {
    const encodedText = encodeURIComponent(whatsappText)
    window.open(`https://wa.me/?text=${encodedText}`, "_blank")
  }

  const handleDownloadWhatsAppImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const link = document.createElement("a")
    link.download = `whatsapp-report-${Date.now()}.png`
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
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Export Reports
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose between formal work report or WhatsApp report
          </p>
        </div>
      </div>

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

        {/* Formal Report Tab */}
        <TabsContent value="formal" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Formal Work Report
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

        {/* WhatsApp Report Tab */}
        <TabsContent value="whatsapp" className="mt-4 space-y-4">
          {/* Client Info Card */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                <MessageSquare className="h-4 w-4" />
                WhatsApp Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={whatsappText}
                onChange={(e) => setWhatsappText(e.target.value)}
                className="min-h-[150px] text-sm resize-none bg-white"
                placeholder="Message for client's family..."
              />
              <Button 
                onClick={handleShareWhatsApp}
                className="w-full mt-3 gap-2 bg-green-600 hover:bg-green-700"
              >
                <MessageSquare className="h-4 w-4" />
                Share via WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* Drawing Canvas for WhatsApp Image */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Add Drawing & Stickers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Drawing Tools */}
              <div className="flex flex-col gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      className={cn(
                        "h-7 w-7 rounded-full border-2 transition-all",
                        brushColor === color ? "border-foreground scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setBrushColor("#ffffff")}
                    className="h-7 w-7"
                  >
                    <Eraser className="h-3 w-3" />
                  </Button>
                </div>

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
              </div>

              {/* Canvas */}
              <div className="relative border rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-48 touch-none bg-white"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
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
                      <Icon className="h-8 w-8" />
                    </div>
                  )
                })}
              </div>

              {/* Stickers */}
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">Stickers:</p>
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
                {selectedSticker && (
                  <p className="text-xs text-center text-primary mt-2">
                    Tap on the canvas to place the sticker
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={clearCanvas} className="flex-1">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
                <Button size="sm" onClick={handleDownloadWhatsAppImage} className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
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
