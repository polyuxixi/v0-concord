"use client"

import { useState } from "react"
import { 
  Award, 
  Star, 
  Heart, 
  Trophy, 
  Medal,
  Lock,
  Download,
  Share2,
  User,
  Calendar,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const badgeIcons: Record<string, React.ElementType> = {
  star: Star,
  heart: Heart,
  trophy: Trophy,
  award: Award,
  medal: Medal,
}

const badgeColors: Record<string, { bg: string; text: string; border: string }> = {
  star: { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200" },
  heart: { bg: "bg-rose-100", text: "text-rose-600", border: "border-rose-200" },
  trophy: { bg: "bg-yellow-100", text: "text-yellow-600", border: "border-yellow-200" },
  award: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
  medal: { bg: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-200" },
}

export function BadgesView() {
  const { badges, unlockedBadges, attendanceRecords } = useAppStore()
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)

  const totalAttendance = attendanceRecords.length
  
  // Calculate progress to next badge
  const nextLockedBadge = badges.find(b => !unlockedBadges.includes(b.id))
  const progressToNext = nextLockedBadge 
    ? Math.min(100, (totalAttendance / nextLockedBadge.requiredAttendance) * 100)
    : 100

  const stats = {
    totalVisits: totalAttendance,
    totalHours: Math.round(attendanceRecords.reduce((acc, record) => {
      const start = new Date(record.startTime)
      const end = new Date(record.endTime)
      return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }, 0) * 10) / 10,
    badgesEarned: unlockedBadges.length,
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/20 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                SW
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Social Worker</h2>
              <p className="text-sm text-muted-foreground">Concord App User</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Level {Math.min(unlockedBadges.length + 1, 5)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.totalVisits}</p>
            <p className="text-xs text-muted-foreground">Total Visits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="h-10 w-10 rounded-full bg-accent/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.totalHours}</p>
            <p className="text-xs text-muted-foreground">Hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.badgesEarned}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Badge */}
      {nextLockedBadge && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress to {nextLockedBadge.name}</span>
              <span className="text-sm text-muted-foreground">
                {totalAttendance}/{nextLockedBadge.requiredAttendance}
              </span>
            </div>
            <Progress value={progressToNext} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Badges Collection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Badge Collection</h3>
        <div className="grid grid-cols-3 gap-4">
          {badges.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id)
            const Icon = badgeIcons[badge.icon] || Award
            const colors = badgeColors[badge.icon] || badgeColors.star

            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge.id === selectedBadge ? null : badge.id)}
                className={cn(
                  "flex flex-col items-center p-4 rounded-2xl border-2 transition-all",
                  isUnlocked 
                    ? `${colors.bg} ${colors.border}` 
                    : "bg-muted/50 border-muted",
                  selectedBadge === badge.id && "ring-2 ring-primary"
                )}
              >
                <div className={cn(
                  "h-14 w-14 rounded-full flex items-center justify-center mb-2",
                  isUnlocked ? "bg-white/60" : "bg-muted"
                )}>
                  {isUnlocked ? (
                    <Icon className={cn("h-8 w-8", colors.text)} />
                  ) : (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium text-center",
                  isUnlocked ? colors.text : "text-muted-foreground"
                )}>
                  {badge.name}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  {badge.requiredAttendance} visits
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Badge Detail */}
      {selectedBadge && (
        <Card>
          <CardContent className="pt-4">
            {(() => {
              const badge = badges.find(b => b.id === selectedBadge)
              if (!badge) return null
              const isUnlocked = unlockedBadges.includes(badge.id)
              const Icon = badgeIcons[badge.icon] || Award
              const colors = badgeColors[badge.icon] || badgeColors.star

              return (
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center shrink-0",
                    isUnlocked ? colors.bg : "bg-muted"
                  )}>
                    {isUnlocked ? (
                      <Icon className={cn("h-8 w-8", colors.text)} />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{badge.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {badge.description}
                    </p>
                    {isUnlocked ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="secondary">
                        {badge.requiredAttendance - totalAttendance} more visits to unlock
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
