"use client"

import { useState } from "react"
import { Mic, MicOff, MapPin, Clock, Phone, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore, Client } from "@/lib/store"
import { cn } from "@/lib/utils"

interface HomeViewProps {
  onStartChat: (client: Client) => void
}

export function HomeView({ onStartChat }: HomeViewProps) {
  const [isRecording, setIsRecording] = useState(false)
  const { clients, selectedClient, setSelectedClient } = useAppStore()

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)
  }

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "in-progress":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Voice Input Section */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/20 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Tap to speak</p>
            <button
              onClick={handleVoiceInput}
              className={cn(
                "relative h-24 w-24 rounded-full flex items-center justify-center transition-all duration-300",
                isRecording 
                  ? "bg-destructive text-destructive-foreground animate-pulse shadow-lg shadow-destructive/30" 
                  : "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105"
              )}
            >
              {isRecording ? (
                <MicOff className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
              {isRecording && (
                <span className="absolute inset-0 rounded-full animate-ping bg-destructive/30" />
              )}
            </button>
            <p className="text-sm font-medium">
              {isRecording ? "Recording... Tap to stop" : "Voice Input Ready"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Today&apos;s Schedule</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {today}
            </p>
          </div>
          <Badge variant="secondary" className="font-medium">
            {clients.length} Clients
          </Badge>
        </div>

        <div className="flex flex-col gap-3">
          {clients.map((client) => (
            <Card 
              key={client.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedClient?.id === client.id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedClient(client)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold truncate">{client.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs capitalize", getStatusColor(client.status))}
                      >
                        {client.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{client.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>{client.scheduledTime}</span>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
