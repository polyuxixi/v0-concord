"use client"

import { useState, useEffect, useRef } from "react"
import { 
  FileText,
  ArrowRight,
  Sparkles,
  Download,
  Droplets,
  Moon,
  Utensils,
  Dumbbell,
  ClipboardCopy,
  CheckCircle2,
  User,
  MapPin,
  Phone,
  Calendar,
  FileStack,
  Zap,
  AlignLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts"

interface ReportViewProps {
  onProceedToCreative: () => void
}

type PolishStyle = "professional" | "concise" | "detailed"

const healthIcons = [
  { key: "water" as const, icon: Droplets, label: "Water", color: "text-sky-500", bgColor: "bg-sky-100", chartColor: "#0ea5e9" },
  { key: "sleep" as const, icon: Moon, label: "Sleep", color: "text-indigo-500", bgColor: "bg-indigo-100", chartColor: "#6366f1" },
  { key: "eating" as const, icon: Utensils, label: "Eating", color: "text-amber-500", bgColor: "bg-amber-100", chartColor: "#f59e0b" },
  { key: "exercise" as const, icon: Dumbbell, label: "Exercise", color: "text-emerald-500", bgColor: "bg-emerald-100", chartColor: "#22c55e" },
]

const chartConfig = {
  water: { label: "Water", color: "#0ea5e9" },
  sleep: { label: "Sleep", color: "#6366f1" },
  eating: { label: "Eating", color: "#f59e0b" },
  exercise: { label: "Exercise", color: "#22c55e" },
}

export function ReportView({ onProceedToCreative }: ReportViewProps) {
  const { 
    selectedClient, 
    assessmentAnswers, 
    healthStatus, 
    setGeneratedReport
  } = useAppStore()

  const [reportText, setReportText] = useState("")
  const [copied, setCopied] = useState(false)
  const [polishStyle, setPolishStyle] = useState<PolishStyle>("professional")
  const [isPolishing, setIsPolishing] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // Generate comprehensive report on mount and when dependencies change
  useEffect(() => {
    const generatedText = generateComprehensiveReport()
    setReportText(generatedText)
    setGeneratedReport(generatedText)
  }, [assessmentAnswers, healthStatus, selectedClient, polishStyle])

  const generateComprehensiveReport = () => {
    const clientName = selectedClient?.name || "Client"
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    const reportId = `SV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}${String(Math.floor(Math.random() * 100)).padStart(2, "0")}`
    
    const totalHealth = healthStatus.water + healthStatus.sleep + healthStatus.eating + healthStatus.exercise
    const healthLevel = totalHealth >= 28 ? "Good Condition" : totalHealth >= 20 ? "Needs Monitoring" : "Needs Support"
    const riskLevel = totalHealth < 20 ? "High" : totalHealth < 28 ? "Medium" : "Low"

    let report = ""
    
    if (polishStyle === "professional") {
      report = generateProfessionalReport(clientName, date, reportId, totalHealth, healthLevel, riskLevel)
    } else if (polishStyle === "concise") {
      report = generateConciseReport(clientName, date, reportId, totalHealth, healthLevel, riskLevel)
    } else {
      report = generateDetailedReport(clientName, date, reportId, totalHealth, healthLevel, riskLevel)
    }

    return report
  }

  const generateProfessionalReport = (clientName: string, date: string, reportId: string, totalHealth: number, healthLevel: string, riskLevel: string) => {
    let report = `════════════════════════════════════════\n`
    report += `        Social Work Service Visit Report\n`
    report += `════════════════════════════════════════\n\n`

    report += `[Report ID] ${reportId}\n`
    report += `[Report Date] ${date}\n`
    report += `[Prepared By] Social Work Service Team\n`
    report += `[Classification] Internal Use Only\n\n`

    report += `────────────────────────────────────────\n`
    report += `1. Basic Information\n`
    report += `────────────────────────────────────────\n\n`
    report += `Client Name: ${clientName}\n`
    report += `Visit Date: ${date}\n`
    report += `Visit Location: ${selectedClient?.address || "Not Provided"}\n`
    report += `Contact Phone: ${selectedClient?.phone || "Not Provided"}\n`
    report += `Service Type: Home Care Visit\n`
    report += `Expected Duration: Approximately 60 minutes\n\n`

    report += `────────────────────────────────────────\n`
    report += `2. Health Status Assessment\n`
    report += `────────────────────────────────────────\n\n`
    report += `Based on direct assessment during this visit, the client's current health status is recorded as follows:\n\n`
    report += `[Quantified Health Indicators]\n`
    report += `┌─────────────────┬────────┬─────────────────────┐\n`
    report += `│    Indicator    │ Score  │       Status        │\n`
    report += `├─────────────────┼────────┼─────────────────────┤\n`
    report += `│ Water Intake    │ ${healthStatus.water}/10  │ ${healthStatus.water >= 7 ? "Adequate" : healthStatus.water >= 4 ? "Needs Improvement" : "Insufficient - Attention"} │\n`
    report += `│ Sleep Quality   │ ${healthStatus.sleep}/10  │ ${healthStatus.sleep >= 7 ? "Good" : healthStatus.sleep >= 4 ? "Fair" : "Poor - Intervention Advised"} │\n`
    report += `│ Eating Habits   │ ${healthStatus.eating}/10  │ ${healthStatus.eating >= 7 ? "Good Appetite" : healthStatus.eating >= 4 ? "Moderate" : "Poor Appetite - Nutrition Risk"} │\n`
    report += `│ Exercise Level  │ ${healthStatus.exercise}/10  │ ${healthStatus.exercise >= 7 ? "Active" : healthStatus.exercise >= 4 ? "Light Activity" : "Sedentary - Mobility Concern"} │\n`
    report += `└─────────────────┴────────┴─────────────────────┘\n\n`
    report += `[Overall Score] ${totalHealth}/40 - ${healthLevel}\n`
    report += `[Risk Level] ${riskLevel} Risk\n\n`

    report += `────────────────────────────────────────\n`
    report += `3. Cognitive Assessment Records\n`
    report += `────────────────────────────────────────\n\n`
    report += `The following standardized assessment activities were conducted during this visit according to the cognitive care plan:\n\n`

    if (assessmentAnswers.length > 0) {
      assessmentAnswers.forEach((answer, index) => {
        const activityName = answer.question.split(":")[0]?.trim() || `Activity ${index + 1}`
        report += `[${index + 1}. ${activityName}]\n`
        report += `Question: ${answer.question}\n`
        report += `Client Response: ${answer.answer || "No response recorded"}\n`
        report += `Completion Status: ${answer.completionStatus || "Pending Review"}\n\n`
      })

      const completed = assessmentAnswers.filter(a => a.completionStatus === "100% Complete").length
      const partial = assessmentAnswers.filter(a => a.completionStatus === "> 50% Complete").length
      report += `[Assessment Summary]\n`
      report += `Total ${assessmentAnswers.length} activities: ${completed} fully completed, ${partial} partially completed\n\n`
    } else {
      report += `No standardized assessment activities were conducted during this visit.\n\n`
    }

    report += `────────────────────────────────────────\n`
    report += `4. Service Content Records\n`
    report += `────────────────────────────────────────\n\n`
    report += `During this home visit, the social worker provided the following professional services:\n\n`
    report += `1. Health Monitoring - Comprehensive vital signs check, medication adherence review, symptom screening\n`
    report += `2. Cognitive Activity Facilitation - Structured cognitive stimulation exercises per care plan\n`
    report += `3. Psychosocial Support - Active listening, emotional support, and social engagement activities\n`
    report += `4. Nutritional Guidance - Dietary intake review, meal preparation support, and recommendations\n`
    report += `5. Safety Assessment - Home environment safety check and fall risk evaluation\n`
    report += `6. Family Liaison - Progress update prepared for primary family contact\n\n`

    report += `────────────────────────────────────────\n`
    report += `5. Professional Recommendations & Follow-up Plan\n`
    report += `────────────────────────────────────────\n\n`
    report += `[Short-term Actions (Within 1 Week)]\n`
    report += `- ${healthStatus.water < 5 ? "Arrange daily hydration reminder system or caregiver support" : "Continue encouraging regular water intake throughout the day"}\n`
    report += `- ${healthStatus.sleep < 5 ? "Refer to GP for sleep assessment and possible intervention" : "Maintain current sleep hygiene practices"}\n`
    report += `- ${healthStatus.eating < 5 ? "Consult nutritionist; consider meal delivery service enrollment" : "Monitor appetite at next visit"}\n`
    report += `- Schedule follow-up visit within 7 days to monitor progress\n\n`

    report += `[Medium-term Actions (Within 1 Month)]\n`
    report += `- Increase visit frequency to twice weekly if indicators do not improve\n`
    report += `- Contact ${clientName}'s primary family contact to discuss care arrangements\n`
    report += `- Coordinate with community hospital to establish or update health records\n`
    report += `- Review and update personalized care plan based on this assessment\n\n`

    report += `════════════════════════════════════════\n`
    report += `This report is confidential and for authorized personnel only.\n`
    report += `Please handle according to your organization's data protection policy.\n`
    report += `════════════════════════════════════════\n`

    return report
  }

  const generateConciseReport = (clientName: string, date: string, reportId: string, totalHealth: number, healthLevel: string, riskLevel: string) => {
    let report = `[Visit Brief] ${reportId}\n`
    report += `━━━━━━━━━━━━━━━━━━━━\n\n`
    
    report += `Client: ${clientName}\n`
    report += `Date: ${date}\n`
    report += `Location: ${selectedClient?.address || "Not Provided"}\n\n`
    
    report += `[Health Score] ${totalHealth}/40 (${healthLevel})\n`
    report += `Water: ${healthStatus.water}/10 | Sleep: ${healthStatus.sleep}/10 | Eating: ${healthStatus.eating}/10 | Exercise: ${healthStatus.exercise}/10\n\n`
    
    report += `[Assessment Summary]\n`
    if (assessmentAnswers.length > 0) {
      assessmentAnswers.forEach((answer, index) => {
        report += `${index + 1}. ${answer.completionStatus || "Pending"}\n`
      })
    } else {
      report += `No assessment activities conducted\n`
    }
    report += `\n[Risk Level] ${riskLevel}\n`
    report += `[Next Follow-up] Within 7 days\n`

    return report
  }

  const generateDetailedReport = (clientName: string, date: string, reportId: string, totalHealth: number, healthLevel: string, riskLevel: string) => {
    let report = generateProfessionalReport(clientName, date, reportId, totalHealth, healthLevel, riskLevel)
    
    report += `\n────────────────────────────────────────\n`
    report += `6. Detailed Observation Records\n`
    report += `────────────────────────────────────────\n\n`
    
    report += `[Environmental Observations]\n`
    report += `Home Environment Cleanliness: Good / Fair / Needs Attention\n`
    report += `Safety Hazards: None Identified / Found and Documented\n`
    report += `Assistive Equipment Status: Normal Use / Needs Maintenance / Needs Update\n\n`
    
    report += `[Emotional State]\n`
    report += `During the visit, the client exhibited ${totalHealth >= 28 ? "cooperative behavior and stable mood" : totalHealth >= 20 ? "general cooperation with occasional mood fluctuations" : "a need for additional emotional support"}.\n`
    report += `Social Interaction Ability: ${totalHealth >= 25 ? "Good" : "Needs Strengthening"}\n\n`
    
    report += `[Family Communication Recommendations]\n`
    report += `The following matters are recommended for discussion with family:\n`
    if (healthStatus.water < 5) report += `- Increase daily water intake monitoring\n`
    if (healthStatus.sleep < 5) report += `- Monitor sleep issues, seek medical attention if necessary\n`
    if (healthStatus.eating < 5) report += `- Improve dietary structure, increase nutritional intake\n`
    if (healthStatus.exercise < 5) report += `- Increase moderate exercise to prevent functional decline\n`
    if (totalHealth >= 28) report += `- Maintain current good condition, continue regular visits\n`

    return report
  }

  const handleAIPolish = () => {
    setIsPolishing(true)
    setTimeout(() => {
      const newReport = generateComprehensiveReport()
      setReportText(newReport)
      setGeneratedReport(newReport)
      setIsPolishing(false)
    }, 1000)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" })
    const link = document.createElement("a")
    link.download = `Work-Report-${selectedClient?.name || "Client"}-${new Date().toISOString().split("T")[0]}.txt`
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  const handleExportPDF = () => {
    // Create a printable version
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Work Report - ${selectedClient?.name || "Client"}</title>
            <style>
              body { font-family: 'Georgia', serif; padding: 40px; line-height: 1.8; }
              pre { white-space: pre-wrap; word-wrap: break-word; }
            </style>
          </head>
          <body>
            <pre>${reportText}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Prepare chart data
  const healthChartData = healthIcons.map(item => ({
    name: item.label,
    value: healthStatus[item.key],
    fill: item.chartColor
  }))

  const radialData = [{
    name: "Overall Score",
    value: ((healthStatus.water + healthStatus.sleep + healthStatus.eating + healthStatus.exercise) / 40) * 100,
    fill: "url(#healthGradient)"
  }]

  const polishOptions = [
    { id: "professional" as PolishStyle, icon: FileStack, label: "Professional", desc: "Suitable for formal reports and archiving" },
    { id: "concise" as PolishStyle, icon: Zap, label: "Concise", desc: "Highlights key points, streamlined content" },
    { id: "detailed" as PolishStyle, icon: AlignLeft, label: "Detailed", desc: "Supplements with details and background" },
  ]

  return (
    <div className="flex flex-col gap-4 pb-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen -mx-4 -mt-4 px-4 pt-4">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-slate-400 to-slate-500 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Work Report Generated</h2>
            <p className="text-sm text-white/90">Professional work report auto-generated based on assessment data</p>
          </div>
        </div>
      </div>

      {/* Client Info Card */}
      <Card className="bg-white/80 backdrop-blur border-slate-200/60 shadow-sm">
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{selectedClient?.name || "No Client Selected"}</h3>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{selectedClient?.address || "Address Not Provided"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{selectedClient?.phone || "Phone Not Provided"}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {new Date().toLocaleDateString("en-US")}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Health Status Visualization */}
      <Card className="bg-white/80 backdrop-blur border-slate-200/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Client Health Status (Tap to Rate 0-10)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Radial Chart for Overall Health */}
            <div className="flex flex-col items-center">
              <ChartContainer config={chartConfig} className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="100%"
                    barSize={12}
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <defs>
                      <linearGradient id="healthGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                      fill="url(#healthGradient)"
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-2xl font-bold"
                    >
                      {healthStatus.water + healthStatus.sleep + healthStatus.eating + healthStatus.exercise}/40
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <p className="text-xs text-muted-foreground mt-1">Overall Health Score</p>
            </div>

            {/* Bar Chart for Individual Metrics */}
            <div className="flex flex-col">
              <ChartContainer config={chartConfig} className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" width={50} tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {healthChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <p className="text-xs text-muted-foreground mt-1 text-center">Individual Metric Scores</p>
            </div>
          </div>

          {/* Health Icons with Values */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {healthIcons.map((item) => {
              const Icon = item.icon
              const value = healthStatus[item.key]
              return (
                <div key={item.key} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/50">
                  <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", item.bgColor)}>
                    <Icon className={cn("h-5 w-5", item.color)} />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <Badge 
                    variant={value > 0 ? "default" : "outline"}
                    className={cn(
                      "text-xs px-2",
                      value >= 7 && "bg-emerald-500",
                      value >= 4 && value < 7 && "bg-amber-500",
                      value > 0 && value < 4 && "bg-red-500"
                    )}
                  >
                    {value}/10
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Answers Summary */}
      {assessmentAnswers.length > 0 && (
        <Card className="bg-white/80 backdrop-blur border-slate-200/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
              <FileText className="h-4 w-4 text-primary" />
              Assessment Q&A Records
              <Badge variant="secondary" className="ml-auto">{assessmentAnswers.length} Items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
              {assessmentAnswers.map((answer) => (
                <div key={answer.questionId} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default" className="bg-slate-400 text-xs">Q{answer.questionId}</Badge>
                    <Badge variant={answer.completionStatus ? "default" : "outline"} className={cn("text-xs", answer.completionStatus && "bg-slate-500")}>
                      {answer.completionStatus || "Pending Review"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mb-1 line-clamp-2">{answer.question}</p>
                  <p className="text-xs text-slate-800 bg-white rounded-lg p-2 border border-slate-100">
                    <span className="font-medium text-primary">Response: </span>
                    {answer.answer || "Not Recorded"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Document */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Report Preview */}
        <Card className="md:col-span-2 bg-white shadow-sm border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-700">
                <FileText className="h-4 w-4" />
                Work Report Preview
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 border-slate-300 text-slate-600 hover:bg-slate-100">
                  <ClipboardCopy className="h-3.5 w-3.5" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5 border-slate-300 text-slate-600 hover:bg-slate-100">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div 
              ref={reportRef}
              className="prose prose-sm prose-slate max-w-none bg-slate-50 rounded-lg p-4 border border-slate-100 max-h-[400px] overflow-y-auto"
            >
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-700">
                {reportText}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* AI Polish Panel */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
              <Sparkles className="h-4 w-4 text-amber-500" />
              AI Polish
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Select a style and AI will optimize the report format and expression
            </p>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {polishOptions.map((option) => {
              const Icon = option.icon
              const isSelected = polishStyle === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => setPolishStyle(option.id)}
                  className={cn(
                    "w-full p-3 rounded-xl border-2 text-left transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center",
                      isSelected ? "bg-primary/10" : "bg-slate-100"
                    )}>
                      <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-slate-500")} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn("font-medium text-sm", isSelected ? "text-primary" : "text-slate-700")}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <Badge variant="secondary" className="text-xs bg-slate-200 text-slate-600">Applied</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
                    </div>
                  </div>
                </button>
              )
            })}

            <Button 
              onClick={handleAIPolish} 
              className="w-full gap-2 bg-slate-500 hover:bg-slate-600 mt-4"
              disabled={isPolishing}
            >
              <Sparkles className={cn("h-4 w-4", isPolishing && "animate-spin")} />
              {isPolishing ? "Polishing..." : "Regenerate"}
            </Button>

            <Button variant="outline" onClick={handleExportPDF} className="w-full gap-2 border-slate-300 text-slate-600 hover:bg-slate-100">
              <Download className="h-4 w-4" />
              Export to Print
            </Button>

            {/* Tips */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-600 mb-2">Tips</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>Report auto-generated from assessment data</li>
                <li>Multiple style options available</li>
                <li>Copy or download directly</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleDownload} className="flex-1 gap-2 border-slate-300 text-slate-600 hover:bg-slate-100">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
        <Button onClick={onProceedToCreative} className="flex-1 gap-2 bg-slate-500 hover:bg-slate-600">
          Creative Report
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
