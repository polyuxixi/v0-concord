"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type FontSize = "small" | "medium" | "large"

interface FontSizeContextType {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  fontSizeClass: string
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("medium")

  const fontSizeClass = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg"
  }[fontSize]

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, fontSizeClass }}>
      <div className={fontSizeClass}>
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
