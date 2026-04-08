"use client"

import { useState, useEffect } from "react"
import { 
  Award, 
  Star, 
  Heart, 
  Trophy, 
  Medal,
  Lock,
  Download,
  Share2,
  Footprints,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

// Badge icons mapping
const badgeIcons: Record<string, React.ElementType> = {
  footprints: Footprints,
  star: Star,
  heart: Heart,
  trophy: Trophy,
  award: Award,
  medal: Medal,
}

// Hexagon SVG component
function Hexagon({ 
  className, 
  filled = false, 
  locked = false,
  children 
}: { 
  className?: string
  filled?: boolean
  locked?: boolean
  children?: React.ReactNode 
}) {
  return (
    <div className={cn("relative", className)}>
      <svg 
        viewBox="0 0 100 115" 
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="honeycombGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <linearGradient id="lockedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="unlockedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
        </defs>
        <polygon 
          points="50,0 100,28.75 100,86.25 50,115 0,86.25 0,28.75" 
          fill={locked ? "url(#lockedGradient)" : filled ? "url(#unlockedGradient)" : "url(#honeycombGradient)"}
          stroke={locked ? "#94a3b8" : filled ? "#f59e0b" : "#fbbf24"}
          strokeWidth="2"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

// Bee component for the journey
function BeeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("w-full h-full", className)}>
      {/* Body */}
      <ellipse cx="32" cy="36" rx="14" ry="18" fill="#fbbf24" />
      {/* Stripes */}
      <rect x="18" y="28" width="28" height="4" fill="#1e293b" rx="2" />
      <rect x="18" y="36" width="28" height="4" fill="#1e293b" rx="2" />
      <rect x="18" y="44" width="28" height="4" fill="#1e293b" rx="2" />
      {/* Head */}
      <circle cx="32" cy="18" r="10" fill="#fbbf24" />
      {/* Eyes */}
      <circle cx="28" cy="16" r="3" fill="#1e293b" />
      <circle cx="36" cy="16" r="3" fill="#1e293b" />
      {/* Eye highlights */}
      <circle cx="29" cy="15" r="1" fill="#ffffff" />
      <circle cx="37" cy="15" r="1" fill="#ffffff" />
      {/* Antennae */}
      <path d="M28 10 Q26 4 22 2" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M36 10 Q38 4 42 2" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Wing left */}
      <ellipse cx="18" cy="30" rx="8" ry="12" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1" opacity="0.8" />
      {/* Wing right */}
      <ellipse cx="46" cy="30" rx="8" ry="12" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1" opacity="0.8" />
      {/* Smile */}
      <path d="M28 22 Q32 26 36 22" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function BadgesView() {
  const { badges, unlockedBadges, completedReports, unlockBadge } = useAppStore()
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const [animateBee, setAnimateBee] = useState(false)

  // Calculate current position based on completed reports
  const currentPosition = completedReports
  
  // Find the next milestone
  const nextBadge = badges.find(b => b.requiredAttendance > completedReports)
  const previousBadge = [...badges].reverse().find(b => b.requiredAttendance <= completedReports)
  
  // Progress to next badge
  const progressToNext = nextBadge 
    ? Math.min(100, (completedReports / nextBadge.requiredAttendance) * 100)
    : 100

  // Auto-unlock badges based on completed reports
  useEffect(() => {
    badges.forEach(badge => {
      if (completedReports >= badge.requiredAttendance && !unlockedBadges.includes(badge.id)) {
        unlockBadge(badge.id)
        setAnimateBee(true)
        setTimeout(() => setAnimateBee(false), 1000)
      }
    })
  }, [completedReports, badges, unlockedBadges, unlockBadge])

  // Journey path positions (honeycomb layout)
  const journeyPositions = [
    { x: 15, y: 10 },   // Start
    { x: 45, y: 10 },   // Badge 1 (1 report)
    { x: 75, y: 10 },   // 
    { x: 60, y: 35 },   // Badge 2 (3 reports)
    { x: 30, y: 35 },   // 
    { x: 15, y: 60 },   // Badge 3 (5 reports)
    { x: 45, y: 60 },   // 
    { x: 75, y: 60 },   // Badge 4 (10 reports)
    { x: 60, y: 85 },   // Badge 5 (15 reports)
    { x: 30, y: 85 },   // Badge 6 (20 reports) - Perfect Attendance
  ]

  // Get bee position based on completed reports
  const getBeePosition = () => {
    // Find the badge positions
    const badgeMilestones = badges.map(b => b.requiredAttendance)
    
    // If no reports, start position
    if (completedReports === 0) return journeyPositions[0]
    
    // Find which segment the bee is on
    for (let i = 0; i < badgeMilestones.length; i++) {
      if (completedReports < badgeMilestones[i]) {
        // Bee is between previous milestone and current
        const prevMilestone = i === 0 ? 0 : badgeMilestones[i - 1]
        const progress = (completedReports - prevMilestone) / (badgeMilestones[i] - prevMilestone)
        
        const startPos = journeyPositions[i]
        const endPos = journeyPositions[i + 1] || journeyPositions[i]
        
        return {
          x: startPos.x + (endPos.x - startPos.x) * progress,
          y: startPos.y + (endPos.y - startPos.y) * progress
        }
      }
    }
    
    // All badges completed
    return journeyPositions[journeyPositions.length - 1]
  }

  const beePos = getBeePosition()

  return (
    <div className="flex flex-col gap-4 pb-24 min-h-screen bg-gradient-to-br from-slate-100 via-teal-50/50 to-slate-100 -mx-4 -mt-4 px-4 pt-4">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-xl font-bold text-slate-700">Badge Journey</h1>
        <p className="text-sm text-slate-500 mt-1">Complete reports to earn badges!</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-white/80 backdrop-blur border-amber-200/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{completedReports}</p>
            <p className="text-xs text-slate-500">Reports</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur border-amber-200/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{unlockedBadges.length}</p>
            <p className="text-xs text-slate-500">Badges</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur border-amber-200/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{nextBadge ? nextBadge.requiredAttendance - completedReports : 0}</p>
            <p className="text-xs text-slate-500">To Next</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {nextBadge && (
        <Card className="bg-white/80 backdrop-blur border-amber-200/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600">Progress to {nextBadge.name}</span>
              <span className="text-xs text-slate-500">{completedReports}/{nextBadge.requiredAttendance}</span>
            </div>
            <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Honeycomb Badge Wall */}
      <Card className="bg-white/60 backdrop-blur border-amber-200/50 overflow-hidden">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-slate-600 mb-4 text-center">Badge Wall</h3>
          
          {/* Honeycomb Grid */}
          <div className="relative" style={{ height: "280px" }}>
            {/* Journey Path Line */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              <path
                d={`M ${journeyPositions.map(p => `${p.x}% ${p.y}%`).join(' L ')}`}
                fill="none"
                stroke="#fde68a"
                strokeWidth="4"
                strokeDasharray="8 4"
                strokeLinecap="round"
              />
            </svg>

            {/* Badge Hexagons */}
            {badges.map((badge, index) => {
              const isUnlocked = unlockedBadges.includes(badge.id)
              const Icon = badgeIcons[badge.icon] || Award
              const pos = journeyPositions[index + 1] || journeyPositions[journeyPositions.length - 1]
              
              return (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge.id === selectedBadge ? null : badge.id)}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110",
                    selectedBadge === badge.id && "scale-110 z-20"
                  )}
                  style={{ 
                    left: `${pos.x}%`, 
                    top: `${pos.y}%`,
                    width: "60px",
                    height: "69px",
                    zIndex: 10
                  }}
                >
                  <Hexagon filled={isUnlocked} locked={!isUnlocked}>
                    {isUnlocked ? (
                      <Icon className="w-6 h-6 text-amber-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </Hexagon>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 whitespace-nowrap font-medium">
                    {badge.requiredAttendance}
                  </span>
                </button>
              )
            })}

            {/* Start Position */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${journeyPositions[0].x}%`, 
                top: `${journeyPositions[0].y}%`,
                width: "40px",
                height: "40px",
                zIndex: 5
              }}
            >
              <div className="w-full h-full rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-emerald-600 whitespace-nowrap font-medium">
                Start
              </span>
            </div>

            {/* Bee Character */}
            <div 
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out",
                animateBee && "animate-bounce"
              )}
              style={{ 
                left: `${beePos.x}%`, 
                top: `${beePos.y}%`,
                width: "48px",
                height: "48px",
                zIndex: 30
              }}
            >
              <BeeIcon />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badge List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-600 px-1">All Badges</h3>
        {badges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id)
          const Icon = badgeIcons[badge.icon] || Award
          const isSelected = selectedBadge === badge.id

          return (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge.id === selectedBadge ? null : badge.id)}
              className={cn(
                "w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3",
                isUnlocked 
                  ? "bg-amber-50/80 border-amber-200" 
                  : "bg-slate-50/80 border-slate-200",
                isSelected && "ring-2 ring-amber-400"
              )}
            >
              <Hexagon 
                filled={isUnlocked} 
                locked={!isUnlocked}
                className="w-12 h-14 shrink-0"
              >
                {isUnlocked ? (
                  <Icon className="w-5 h-5 text-amber-600" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
              </Hexagon>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium text-sm",
                    isUnlocked ? "text-amber-700" : "text-slate-500"
                  )}>
                    {badge.name}
                  </span>
                  {isUnlocked && (
                    <Badge className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0">
                      Earned
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{badge.description}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isUnlocked 
                    ? "Badge unlocked!" 
                    : `${badge.requiredAttendance - completedReports} more reports needed`
                  }
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Badge Detail Modal */}
      {selectedBadge && (
        <Card className="bg-white/90 backdrop-blur border-amber-200 fixed bottom-20 left-4 right-4 z-50 shadow-xl">
          <CardContent className="p-4">
            {(() => {
              const badge = badges.find(b => b.id === selectedBadge)
              if (!badge) return null
              const isUnlocked = unlockedBadges.includes(badge.id)
              const Icon = badgeIcons[badge.icon] || Award

              return (
                <div className="flex items-start gap-4">
                  <Hexagon 
                    filled={isUnlocked} 
                    locked={!isUnlocked}
                    className="w-16 h-[74px] shrink-0"
                  >
                    {isUnlocked ? (
                      <Icon className="w-7 h-7 text-amber-600" />
                    ) : (
                      <Lock className="w-6 h-6 text-slate-400" />
                    )}
                  </Hexagon>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-700">{badge.name}</h4>
                    <p className="text-sm text-slate-500 mb-3">
                      {badge.description}
                    </p>
                    {isUnlocked ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                          <Download className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                        {badge.requiredAttendance - completedReports} more reports to unlock
                      </Badge>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedBadge(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    x
                  </button>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
