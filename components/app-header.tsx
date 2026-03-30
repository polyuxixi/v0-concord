"use client"

import { useState } from "react"
import { Type, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  title: string
}

export function AppHeader({ title }: AppHeaderProps) {
  const { fontSize, setFontSize } = useFontSize()
  
  const fontSizeOptions = [
    { value: "small" as const, label: "Small (A)", size: "text-sm" },
    { value: "medium" as const, label: "Medium (A)", size: "text-base" },
    { value: "large" as const, label: "Large (A)", size: "text-lg" },
    { value: "xlarge" as const, label: "Extra Large (A)", size: "text-xl" },
  ]

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Type className="h-4 w-4" />
              <span className="text-sm">Font</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {fontSizeOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setFontSize(option.value)}
                className={cn(
                  option.size,
                  fontSize === option.value && "bg-accent"
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
