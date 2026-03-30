"use client"

import { useState, useEffect } from "react"
import { MapPin, Clock, Phone, ChevronRight, Calendar, User, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore, Client } from "@/lib/store"
import { cn } from "@/lib/utils"

interface HomeViewProps {
  onStartChat: (client: Client) => void
}

export function HomeView({ onStartChat }: HomeViewProps) {
  const [today, setToday] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const { clients, selectedClient, setSelectedClient } = useAppStore()

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setToday(now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }))
      setCurrentTime(now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      }))
    }
    updateDateTime()
    const interval = setInterval(updateDateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "in-progress":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getTimelinePosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const totalMinutes = hours * 60 + minutes
    const startMinutes = 8 * 60 // 8:00 AM
    const endMinutes = 18 * 60 // 6:00 PM
    return ((totalMinutes - startMinutes) / (endMinutes - startMinutes)) * 100
  }

  // Sort clients by scheduled time
  const sortedClients = [...clients].sort((a, b) => {
    return a.scheduledTime.localeCompare(b.scheduledTime)
  })

  // Generate time slots for the schedule
  const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header with Date and Time */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-primary">
            <Calendar className="h-5 w-5" />
            <span className="font-semibold">Today</span>
          </div>
          <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
            {currentTime}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{today}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-xs text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
        </div>
      </div>

      {/* Visual Timeline Schedule */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Visit Schedule
        </h2>

        {/* Timeline Header */}
        <div className="relative mb-6 px-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            {timeSlots.map((time) => (
              <span key={time}>{time}</span>
            ))}
          </div>
          <div className="relative h-2 bg-muted rounded-full">
            {sortedClients.map((client) => {
              const position = getTimelinePosition(client.scheduledTime)
              return (
                <div
                  key={client.id}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-background cursor-pointer transition-transform hover:scale-125",
                    client.status === "completed" && "bg-emerald-500",
                    client.status === "in-progress" && "bg-amber-500",
                    client.status === "pending" && "bg-muted-foreground"
                  )}
                  style={{ left: `${Math.max(0, Math.min(100, position))}%` }}
                  title={`${client.name} - ${client.scheduledTime}`}
                />
              )
            })}
          </div>
        </div>

        {/* Client Cards */}
        <div className="flex flex-col gap-3">
          {sortedClients.map((client, index) => (
            <Card 
              key={client.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md overflow-hidden",
                selectedClient?.id === client.id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedClient(client)}
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* Time indicator */}
                  <div className={cn(
                    "w-20 shrink-0 flex flex-col items-center justify-center py-4 text-white",
                    client.status === "completed" && "bg-emerald-500",
                    client.status === "in-progress" && "bg-amber-500",
                    client.status === "pending" && "bg-muted-foreground"
                  )}>
                    <Clock className="h-4 w-4 mb-1" />
                    <span className="text-sm font-bold">{client.scheduledTime}</span>
                    <span className="text-xs opacity-80">#{index + 1}</span>
                  </div>

                  {/* Client Info */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{client.name}</h3>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs capitalize", getStatusColor(client.status))}
                            >
                              {client.status === "completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {client.status === "pending" && <Circle className="h-3 w-3 mr-1" />}
                              {client.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{client.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 shrink-0" />
                            <span>{client.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onStartChat(client)
                        }}
                        className="shrink-0"
                      >
                        Start
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {clients.filter(c => c.status === "completed").length}
            </p>
            <p className="text-xs text-emerald-600/80">Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">
              {clients.filter(c => c.status === "in-progress").length}
            </p>
            <p className="text-xs text-amber-600/80">In Progress</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {clients.filter(c => c.status === "pending").length}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
