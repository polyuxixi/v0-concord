"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Palette, 
  Eraser, 
  Download, 
  Undo, 
  Trash2,
  Type,
  Heart,
  Star,
  Sun,
  Smile,
  ThumbsUp,
  Gift,
  Flower2,
  Home,
  Users,
  Camera
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

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

export function CreativeView() {
  const { selectedClient, generatedReport, healthStatus } = useAppStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushColor, setBrushColor] = useState("#3b82f6")
  const [brushSize, setBrushSize] = useState([4])
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([])
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [creativeText, setCreativeText] = useState("")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)
    
    // Fill with white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  useEffect(() => {
    // Generate creative text
    if (selectedClient) {
      const text = `Dear Family of ${selectedClient.name},\n\n`
        + `Today's visit was wonderful! Here's a summary of our time together:\n\n`
        + `Health Check:\n`
        + `- Water Intake: ${healthStatus.water}/10\n`
        + `- Sleep Quality: ${healthStatus.sleep}/10\n`
        + `- Eating Status: ${healthStatus.eating}/10\n`
        + `- Exercise Level: ${healthStatus.exercise}/10\n\n`
        + `We had a great cognitive assessment session. ${selectedClient.name} was engaged and responsive throughout.\n\n`
        + `With warm regards,\n`
        + `Your Social Worker`
      setCreativeText(text)
    }
  }, [selectedClient, healthStatus])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (selectedSticker) {
      // Place sticker
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

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const link = document.createElement("a")
    link.download = `creative-report-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Creative Report
        </h2>
        <p className="text-sm text-muted-foreground">
          Create a personalized report for client&apos;s family
        </p>
      </div>

      <Tabs defaultValue="canvas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="text">Text Report</TabsTrigger>
        </TabsList>

        <TabsContent value="canvas" className="mt-4">
          {/* Drawing Tools */}
          <Card className="mb-4">
            <CardContent className="pt-4">
              <div className="flex flex-col gap-4">
                {/* Colors */}
                <div className="flex items-center gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      className={cn(
                        "h-8 w-8 rounded-full border-2 transition-all",
                        brushColor === color ? "border-foreground scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setBrushColor("#ffffff")}
                    className="h-8 w-8"
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                </div>

                {/* Brush Size */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Size:</span>
                  <Slider
                    value={brushSize}
                    onValueChange={setBrushSize}
                    min={1}
                    max={20}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-6">{brushSize[0]}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Canvas */}
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative">
              <canvas
                ref={canvasRef}
                className="w-full h-64 touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
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
                    <Icon className="h-8 w-8" />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Stickers */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Stickers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {stickers.map((sticker) => {
                  const Icon = sticker.icon
                  return (
                    <button
                      key={sticker.id}
                      onClick={() => setSelectedSticker(sticker.id === selectedSticker ? null : sticker.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                        selectedSticker === sticker.id
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      <Icon className={cn("h-6 w-6", sticker.color)} />
                      <span className="text-xs text-muted-foreground">
                        {sticker.label}
                      </span>
                    </button>
                  )
                })}
              </div>
              {selectedSticker && (
                <p className="text-xs text-center text-primary mt-3">
                  Tap on the canvas to place the sticker
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Type className="h-4 w-4" />
                Family Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={creativeText}
                onChange={(e) => setCreativeText(e.target.value)}
                className="min-h-[300px] resize-none"
                placeholder="Write a personalized message for the client's family..."
              />
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button className="flex-1">
                  Share Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
