"use client"

import { useState } from "react"
import { FontSizeProvider } from "@/contexts/font-size-context"
import { AppHeader } from "@/components/app-header"
import { MobileNav } from "@/components/mobile-nav"
import { HomeView } from "@/components/views/home-view"
import { ChatView } from "@/components/views/chat-view"
import { ReportView } from "@/components/views/report-view"
import { CreativeView } from "@/components/views/creative-view"
import { BadgesView } from "@/components/views/badges-view"
import { ExportReportsView } from "@/components/views/export-reports-view"
import { useAppStore, Client } from "@/lib/store"

const viewTitles: Record<string, string> = {
  home: "Concord",
  chat: "AI Assessment",
  report: "Report",
  creative: "Creative Report",
  badges: "My Profile",
  export: "Export Reports",
}

export default function ConcordApp() {
  const [currentView, setCurrentView] = useState("home")
  const { selectedClient, setSelectedClient } = useAppStore()

  const handleStartChat = (client: Client) => {
    setSelectedClient(client)
    setCurrentView("chat")
  }

  const handleBackFromChat = () => {
    setCurrentView("home")
  }

  const handleProceedToReport = () => {
    setCurrentView("report")
  }

  const handleProceedToCreative = () => {
    setCurrentView("creative")
  }

  const handleExportReports = () => {
    setCurrentView("export")
  }

  const handleBackFromExport = () => {
    setCurrentView("chat")
  }

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView onStartChat={handleStartChat} />
      case "chat":
        return (
          <ChatView 
            client={selectedClient} 
            onBack={handleBackFromChat}
            onProceedToReport={handleProceedToReport}
            onExportReports={handleExportReports}
          />
        )
      case "report":
        return <ReportView onProceedToCreative={handleProceedToCreative} />
      case "creative":
        return <CreativeView />
      case "badges":
        return <BadgesView />
      case "export":
        return <ExportReportsView onBack={handleBackFromExport} />
      default:
        return <HomeView onStartChat={handleStartChat} />
    }
  }

  return (
    <FontSizeProvider>
      <div className="min-h-screen bg-background">
        <AppHeader title={viewTitles[currentView] || "Concord"} />
        <main className="px-4 py-4 max-w-lg mx-auto">
          {renderView()}
        </main>
        <MobileNav currentView={currentView} onViewChange={setCurrentView} />
      </div>
    </FontSizeProvider>
  )
}
