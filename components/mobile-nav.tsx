"use client"

import { Home, MessageSquare, FileText, Palette, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  currentView: string
  onViewChange: (view: string) => void
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "chat", icon: MessageSquare, label: "AI Chat" },
  { id: "report", icon: FileText, label: "Report" },
  { id: "creative", icon: Palette, label: "Creative" },
  { id: "badges", icon: Award, label: "Badges" },
]

export function MobileNav({ currentView, onViewChange }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
