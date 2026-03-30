"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

type FontSize = "small" | "medium" | "large" | "xlarge"

interface FontSizeContextType {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  scale: number
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

const scaleConfig: Record<FontSize, number> = {
  small: 0.875,
  medium: 1,
  large: 1.125,
  xlarge: 1.25
}

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("medium")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved preference
    const saved = localStorage.getItem("concord-font-size") as FontSize
    if (saved && scaleConfig[saved] !== undefined) {
      setFontSize(saved)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("concord-font-size", fontSize)
      // Apply CSS custom property to document root for global scaling
      document.documentElement.style.setProperty("--font-scale", String(scaleConfig[fontSize]))
    }
  }, [fontSize, mounted])

  const scale = scaleConfig[fontSize]

  return (
    <FontSizeContext.Provider 
      value={{ 
        fontSize, 
        setFontSize, 
        scale
      }}
    >
      <div 
        style={{
          fontSize: `${scale}rem`
        }}
      >
        {children}
      </div>
    </FontSizeContext.Provider>
  )
}

export function useFontSize() {
  const context = useContext(FontSizeContext)
  if (!context) {
    throw new Error("useFontSize must be used within a FontSizeProvider")
  }
  return context
}
