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
    <div className="flex flex-col gap-8 pb-28">
      {/* Header with Date and Time */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 text-primary">
            <Calendar className="h-6 w-6" />
            <span className="text-lg font-semibold">Today</span>
          </div>
          <Badge variant="secondary" className="text-xl font-bold px-4 py-2">
            {currentTime}
          </Badge>
        </div>
        <div className="text-base text-muted-foreground mt-1">{today}</div>
        <div className="mt-5 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-emerald-500" />
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-amber-500" />
            <span className="text-sm text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-muted-foreground" />
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
        </div>
      </div>

      {/* Visual Timeline Schedule */}
      <div>
        <h2 className="text-xl font-semibold mb-5 flex items-center gap-3">
          <Clock className="h-6 w-6 text-primary" />
          Visit Schedule
        </h2>

        {/* Timeline Header */}
        <div className="relative mb-8 px-3">
          <div className="flex justify-between text-sm text-muted-foreground mb-3">
            {timeSlots.map((time) => (
              <span key={time} className="font-medium">{time}</span>
            ))}
          </div>
          <div className="relative h-3 bg-muted rounded-full">
            {sortedClients.map((client) => {
              const position = getTimelinePosition(client.scheduledTime)
              return (
                <div
                  key={client.id}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-background cursor-pointer transition-transform hover:scale-125",
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
        <div className="flex flex-col gap-4">
          {sortedClients.map((client, index) => (
            <Card 
              key={client.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md overflow-hidden",
                selectedClient?.id === client.id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedClient(client)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center",
                        client.status === "completed" && "bg-emerald-100",
                        client.status === "in-progress" && "bg-amber-100",
                        client.status === "pending" && "bg-primary/10"
                      )}>
                        <User className={cn(
                          "h-6 w-6",
                          client.status === "completed" && "text-emerald-600",
                          client.status === "in-progress" && "text-amber-600",
                          client.status === "pending" && "text-primary"
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{client.name}</h3>
                          <span className="text-sm text-muted-foreground">#{index + 1}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={cn("text-sm capitalize", getStatusColor(client.status))}
                          >
                            {client.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
                            {client.status === "pending" && <Circle className="h-3.5 w-3.5 mr-1" />}
                            {client.status}
                          </Badge>
                          <Badge variant="secondary" className="text-sm">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {client.scheduledTime}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground ml-15">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{client.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      onStartChat(client)
                    }}
                    className="shrink-0"
                  >
                    Start
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-emerald-600">
              {clients.filter(c => c.status === "completed").length}
            </p>
            <p className="text-sm text-emerald-600/80 mt-1">Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-amber-600">
              {clients.filter(c => c.status === "in-progress").length}
            </p>
            <p className="text-sm text-amber-600/80 mt-1">In Progress</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-muted-foreground">
              {clients.filter(c => c.status === "pending").length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Pending</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
