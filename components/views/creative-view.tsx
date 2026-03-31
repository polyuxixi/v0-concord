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
  StickyNote,
  ImagePlus,
  X,
  Move
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

interface UploadedImage {
  id: string
  src: string
  x: number
  y: number
  width: number
  height: number
}

type ToolMode = "draw" | "sticker" | "image"

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
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [draggingImage, setDraggingImage] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    setUploadedImages([])
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const src = event.target?.result as string
        if (!src) return

        // Create image to get dimensions
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          // Scale image to fit nicely (max 150px width)
          const maxWidth = 150
          const scale = Math.min(1, maxWidth / img.width)
          const width = img.width * scale
          const height = img.height * scale

          setUploadedImages(prev => [...prev, {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            src,
            x: 20,
            y: 20,
            width,
            height
          }])
        }
        img.src = src
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle image drag start
  const handleImageDragStart = (e: React.MouseEvent | React.TouchEvent, imageId: string) => {
    e.stopPropagation()
    const image = uploadedImages.find(img => img.id === imageId)
    if (!image) return

    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    setDraggingImage(imageId)
    setDragOffset({
      x: clientX - rect.left - image.x,
      y: clientY - rect.top - image.y
    })
  }

  // Handle image drag move
  const handleImageDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingImage) return

    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    const newX = Math.max(0, Math.min(rect.width - 50, clientX - rect.left - dragOffset.x))
    const newY = Math.max(0, Math.min(600 - 50, clientY - rect.top - dragOffset.y))

    setUploadedImages(prev => prev.map(img => 
      img.id === draggingImage ? { ...img, x: newX, y: newY } : img
    ))
  }

  // Handle image drag end
  const handleImageDragEnd = () => {
    setDraggingImage(null)
  }

  // Remove image
  const removeImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId))
  }

  const handleExport = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()

    // Create a temporary canvas for export
    const exportCanvas = document.createElement("canvas")
    exportCanvas.width = rect.width * 2
    exportCanvas.height = 600 * 2
    const exportCtx = exportCanvas.getContext("2d")
    if (!exportCtx) return

    exportCtx.scale(2, 2)

    // Copy current canvas (includes drawings and text)
    exportCtx.drawImage(canvas, 0, 0, rect.width, 600)

    // Draw uploaded images
    const imagePromises = uploadedImages.map(img => {
      return new Promise<void>((resolve) => {
        const image = new window.Image()
        image.crossOrigin = "anonymous"
        image.onload = () => {
          exportCtx.drawImage(image, img.x, img.y, img.width, img.height)
          resolve()
        }
        image.onerror = () => resolve()
        image.src = img.src
      })
    })

    await Promise.all(imagePromises)

    // Draw stickers as colored circles with icons representation
    placedStickers.forEach((placed) => {
      const sticker = stickers.find(s => s.id === placed.stickerId)
      if (!sticker) return
      
      // Draw a colored circle to represent the sticker
      exportCtx.beginPath()
      exportCtx.arc(placed.x, placed.y, 16, 0, Math.PI * 2)
      
      // Get color from class
      const colorMap: Record<string, string> = {
        "text-rose-500": "#f43f5e",
        "text-amber-500": "#f59e0b",
        "text-yellow-500": "#eab308",
        "text-emerald-500": "#22c55e",
        "text-blue-500": "#3b82f6",
        "text-purple-500": "#a855f7",
        "text-pink-500": "#ec4899",
        "text-orange-500": "#f97316",
        "text-teal-500": "#14b8a6",
        "text-indigo-500": "#6366f1"
      }
      exportCtx.fillStyle = colorMap[sticker.color] || "#3b82f6"
      exportCtx.fill()
      
      // Draw label
      exportCtx.fillStyle = "#ffffff"
      exportCtx.font = "10px sans-serif"
      exportCtx.textAlign = "center"
      exportCtx.fillText(sticker.label.charAt(0), placed.x, placed.y + 4)
    })
    
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
        <Button
          variant={toolMode === "image" ? "default" : "outline"}
          onClick={() => setToolMode("image")}
          className={cn(
            "flex-1 gap-2",
            toolMode === "image" ? "bg-slate-500 hover:bg-slate-600" : "border-slate-300 text-slate-600"
          )}
        >
          <ImagePlus className="h-4 w-4" />
          Images
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

      {/* Image Upload - Show when in image mode */}
      {toolMode === "image" && (
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-700">Upload Images</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors"
            >
              <ImagePlus className="h-8 w-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">Click to upload images</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF supported</p>
            </div>
            
            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                  <Move className="h-3 w-3" />
                  Drag images on the report to reposition
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {uploadedImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img 
                        src={img.src} 
                        alt="Uploaded"
                        className="w-full h-16 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
              Clear All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent 
          className="p-0 relative" 
          ref={containerRef}
          onMouseMove={handleImageDragMove}
          onMouseUp={handleImageDragEnd}
          onMouseLeave={handleImageDragEnd}
          onTouchMove={handleImageDragMove}
          onTouchEnd={handleImageDragEnd}
        >
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
          
          {/* Placed Images - Draggable */}
          {uploadedImages.map((img) => (
            <div
              key={img.id}
              className={cn(
                "absolute cursor-move group",
                draggingImage === img.id && "opacity-75 z-50"
              )}
              style={{ 
                left: img.x, 
                top: img.y, 
                width: img.width, 
                height: img.height 
              }}
              onMouseDown={(e) => handleImageDragStart(e, img.id)}
              onTouchStart={(e) => handleImageDragStart(e, img.id)}
            >
              <img 
                src={img.src} 
                alt="Uploaded"
                className="w-full h-full object-cover rounded-lg shadow-md border-2 border-white"
                draggable={false}
              />
              <button
                onClick={(e) => { e.stopPropagation(); removeImage(img.id) }}
                className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute inset-0 border-2 border-slate-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}

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
