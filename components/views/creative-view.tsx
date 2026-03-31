"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Palette, 
  Eraser, 
  Download, 
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
  Pencil,
  StickyNote
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

type ToolMode = "draw" | "sticker"

export function CreativeView() {
  const { selectedClient, healthStatus } = useAppStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushColor, setBrushColor] = useState("#3b82f6")
  const [brushSize, setBrushSize] = useState([4])
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([])
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [toolMode, setToolMode] = useState<ToolMode>("draw")
  const [creativeText, setCreativeText] = useState("")

  // Generate creative text report
  useEffect(() => {
    if (selectedClient) {
      const text = `Dear Family of ${selectedClient.name},

Today's visit was wonderful! Here's a summary of our time together:

Health Check:
- Water Intake: ${healthStatus.water}/10
- Sleep Quality: ${healthStatus.sleep}/10
- Eating Status: ${healthStatus.eating}/10
- Exercise Level: ${healthStatus.exercise}/10

We had a great cognitive assessment session. ${selectedClient.name} was engaged and responsive throughout.

With warm regards,
Your Social Worker`
      setCreativeText(text)
    }
  }, [selectedClient, healthStatus])

  // Initialize canvas with text report as background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const container = containerRef.current
    if (!container) return

    // Set canvas size based on container
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = 600 * 2
    ctx.scale(2, 2)
    
    // Fill with white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, rect.width, 600)
    
    // Draw text report on canvas
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px 'Georgia', serif"
    
    const lines = creativeText.split("\n")
    let y = 30
    const lineHeight = 22
    const padding = 20
    
    lines.forEach((line) => {
      ctx.fillText(line, padding, y)
      y += lineHeight
    })
  }, [creativeText])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoordinates(e)

    if (toolMode === "sticker" && selectedSticker) {
      // Place sticker
      setPlacedStickers(prev => [...prev, {
        id: Date.now().toString(),
        stickerId: selectedSticker,
        x,
        y
      }])
      return
    }

    if (toolMode === "draw") {
      setIsDrawing(true)
      const canvas = canvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || toolMode !== "draw") return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const { x, y } = getCoordinates(e)
    
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

    const container = containerRef.current
    if (!container) return
    
    const rect = container.getBoundingClientRect()
    
    // Redraw with white background and text
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, rect.width, 600)
    
    // Redraw text report
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px 'Georgia', serif"
    
    const lines = creativeText.split("\n")
    let y = 30
    const lineHeight = 22
    const padding = 20
    
    lines.forEach((line) => {
      ctx.fillText(line, padding, y)
      y += lineHeight
    })
    
    setPlacedStickers([])
  }

  const handleExport = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Draw stickers onto canvas before export
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create a temporary canvas for export
    const exportCanvas = document.createElement("canvas")
    exportCanvas.width = canvas.width
    exportCanvas.height = canvas.height
    const exportCtx = exportCanvas.getContext("2d")
    if (!exportCtx) return

    // Copy current canvas
    exportCtx.drawImage(canvas, 0, 0)

    // Note: Stickers are rendered as DOM elements, so we export the canvas with drawings only
    // For full export with stickers, we would need to render them to canvas first
    
    const link = document.createElement("a")
    link.download = `creative-report-${selectedClient?.name || "client"}-${new Date().toISOString().split("T")[0]}.png`
    link.href = exportCanvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Palette className="h-5 w-5 text-slate-500" />
          Creative Report
        </h2>
        <p className="text-sm text-muted-foreground">
          Draw and add stickers directly on the text report for client&apos;s family
        </p>
      </div>

      {/* Tool Mode Selection */}
      <div className="flex gap-2">
        <Button
          variant={toolMode === "draw" ? "default" : "outline"}
          onClick={() => { setToolMode("draw"); setSelectedSticker(null) }}
          className={cn(
            "flex-1 gap-2",
            toolMode === "draw" ? "bg-slate-500 hover:bg-slate-600" : "border-slate-300 text-slate-600"
          )}
        >
          <Pencil className="h-4 w-4" />
          Doodle
        </Button>
        <Button
          variant={toolMode === "sticker" ? "default" : "outline"}
          onClick={() => setToolMode("sticker")}
          className={cn(
            "flex-1 gap-2",
            toolMode === "sticker" ? "bg-slate-500 hover:bg-slate-600" : "border-slate-300 text-slate-600"
          )}
        >
          <StickyNote className="h-4 w-4" />
          Stickers
        </Button>
      </div>

      {/* Drawing Tools - Show when in draw mode */}
      {toolMode === "draw" && (
        <Card className="border-slate-200">
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
                      brushColor === color ? "border-slate-700 scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setBrushColor("#ffffff")}
                  className="h-8 w-8 border-slate-300"
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stickers - Show when in sticker mode */}
      {toolMode === "sticker" && (
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-700">Select a Sticker</CardTitle>
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
                        ? "bg-slate-200 ring-2 ring-slate-400"
                        : "bg-slate-50 hover:bg-slate-100"
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
              <p className="text-xs text-center text-slate-600 mt-3">
                Tap on the report below to place the sticker
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Unified Canvas with Text Report */}
      <Card className="overflow-hidden border-slate-200">
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-sm flex items-center justify-between text-slate-700">
            <span>Report Canvas</span>
            <Button variant="outline" size="sm" onClick={clearCanvas} className="gap-1.5 border-slate-300 text-slate-600">
              <Trash2 className="h-3.5 w-3.5" />
              Clear Drawings
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 relative" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className="w-full touch-none bg-white"
            style={{ height: "600px" }}
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

      {/* Export Button */}
      <Button 
        onClick={handleExport} 
        className="w-full gap-2 bg-slate-500 hover:bg-slate-600"
        size="lg"
      >
        <Download className="h-5 w-5" />
        Export Report
      </Button>
    </div>
  )
}
