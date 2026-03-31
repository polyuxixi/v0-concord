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
  { key: "water" as const, icon: Droplets, label: "饮水", color: "text-sky-500", bgColor: "bg-sky-100", chartColor: "#0ea5e9" },
  { key: "sleep" as const, icon: Moon, label: "睡眠", color: "text-indigo-500", bgColor: "bg-indigo-100", chartColor: "#6366f1" },
  { key: "eating" as const, icon: Utensils, label: "饮食", color: "text-amber-500", bgColor: "bg-amber-100", chartColor: "#f59e0b" },
  { key: "exercise" as const, icon: Dumbbell, label: "运动", color: "text-emerald-500", bgColor: "bg-emerald-100", chartColor: "#22c55e" },
]

const chartConfig = {
  water: { label: "饮水", color: "#0ea5e9" },
  sleep: { label: "睡眠", color: "#6366f1" },
  eating: { label: "饮食", color: "#f59e0b" },
  exercise: { label: "运动", color: "#22c55e" },
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
    const clientName = selectedClient?.name || "客户"
    const date = new Date().toLocaleDateString("zh-CN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    const reportId = `SV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}${String(Math.floor(Math.random() * 100)).padStart(2, "0")}`
    
    const totalHealth = healthStatus.water + healthStatus.sleep + healthStatus.eating + healthStatus.exercise
    const healthLevel = totalHealth >= 28 ? "状态良好" : totalHealth >= 20 ? "需持续关注" : "需要加强支持"
    const riskLevel = totalHealth < 20 ? "高" : totalHealth < 28 ? "中" : "低"

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
    report += `        社会工作服务探访报告\n`
    report += `════════════════════════════════════════\n\n`

    report += `【报告编号】${reportId}\n`
    report += `【报告日期】${date}\n`
    report += `【编制单位】社会工作服务团队\n`
    report += `【保密等级】内部使用\n\n`

    report += `────────────────────────────────────────\n`
    report += `一、基本信息\n`
    report += `────────────────────────────────────────\n\n`
    report += `客户姓名：${clientName}\n`
    report += `探访日期：${date}\n`
    report += `探访地点：${selectedClient?.address || "未提供"}\n`
    report += `联系电话：${selectedClient?.phone || "未提供"}\n`
    report += `服务类别：居家照护探访\n`
    report += `预计时长：约60分钟\n\n`

    report += `────────────────────────────────────────\n`
    report += `二、健康状况评估\n`
    report += `────────────────────────────────────────\n\n`
    report += `根据本次探访期间的直接评估，客户当前健康状况记录如下：\n\n`
    report += `【量化健康指标】\n`
    report += `┌─────────────┬────────┬────────────────┐\n`
    report += `│    指标     │ 评分   │     状态       │\n`
    report += `├─────────────┼────────┼────────────────┤\n`
    report += `│ 饮水摄入量  │ ${healthStatus.water}/10  │ ${healthStatus.water >= 7 ? "充足" : healthStatus.water >= 4 ? "需改善" : "不足-需关注"} │\n`
    report += `│ 睡眠质量    │ ${healthStatus.sleep}/10  │ ${healthStatus.sleep >= 7 ? "良好" : healthStatus.sleep >= 4 ? "一般" : "较差-建议干预"} │\n`
    report += `│ 饮食情况    │ ${healthStatus.eating}/10  │ ${healthStatus.eating >= 7 ? "食欲良好" : healthStatus.eating >= 4 ? "中等" : "食欲不佳-营养风险"} │\n`
    report += `│ 运动情况    │ ${healthStatus.exercise}/10  │ ${healthStatus.exercise >= 7 ? "活跃" : healthStatus.exercise >= 4 ? "轻度活动" : "久坐-活动能力关注"} │\n`
    report += `└─────────────┴────────┴────────────────┘\n\n`
    report += `【综合评分】${totalHealth}/40 - ${healthLevel}\n`
    report += `【风险等级】${riskLevel}风险\n\n`

    report += `────────────────────────────────────────\n`
    report += `三、认知评估记录\n`
    report += `────────────────────────────────────────\n\n`
    report += `本次探访期间按照认知照护方案进行了以下标准化评估活动：\n\n`

    if (assessmentAnswers.length > 0) {
      assessmentAnswers.forEach((answer, index) => {
        const activityName = answer.question.split(":")[0]?.trim() || `活动 ${index + 1}`
        report += `【${index + 1}. ${activityName}】\n`
        report += `问题内容：${answer.question}\n`
        report += `客户回应：${answer.answer || "未记录回应"}\n`
        report += `完成状态：${answer.completionStatus || "待审核"}\n\n`
      })

      const completed = assessmentAnswers.filter(a => a.completionStatus === "100% Complete").length
      const partial = assessmentAnswers.filter(a => a.completionStatus === "> 50% Complete").length
      report += `【评估完成摘要】\n`
      report += `共 ${assessmentAnswers.length} 项活动：${completed} 项完全完成，${partial} 项部分完成\n\n`
    } else {
      report += `本次未进行标准化评估活动。\n\n`
    }

    report += `────────────────────────────────────────\n`
    report += `四、服务内容记录\n`
    report += `────────────────────────────────────────\n\n`
    report += `本次居家探访中，社工提供了以下专业服务：\n\n`
    report += `1. 健康监测 - 全面生命体征检查、用药依从性审查、症状筛查\n`
    report += `2. 认知活动促进 - 按照护理方案进行结构化认知刺激练习\n`
    report += `3. 心理社会支持 - 积极倾听、情感支持和社交参与活动\n`
    report += `4. 营养指导 - 饮食摄入审查、膳食准备支持和建议\n`
    report += `5. 安全评估 - 居家环境安全检查和跌倒风险评估\n`
    report += `6. 家属联络 - 为主要家属联系人准备进展更新\n\n`

    report += `────────────────────────────────────────\n`
    report += `五、专业建议与跟进计划\n`
    report += `────────────────────────────────────────\n\n`
    report += `【短期措施（1周内）】\n`
    report += `- ${healthStatus.water < 5 ? "安排每日饮水提醒系统或照护者支持" : "继续鼓励全天定期饮水"}\n`
    report += `- ${healthStatus.sleep < 5 ? "转介全科医生进行睡眠评估和可能的干预" : "保持当前睡眠卫生习惯"}\n`
    report += `- ${healthStatus.eating < 5 ? "咨询营养师；考虑加入送餐服务" : "下次探访时监测食欲"}\n`
    report += `- 7天内安排跟进探访以监测进展\n\n`

    report += `【中期措施（1个月内）】\n`
    report += `- 如指标未改善，增加探访频率至每周两次\n`
    report += `- 联系${clientName}的主要家属联系人讨论照护安排\n`
    report += `- 与社区医院协调建立或更新健康档案\n`
    report += `- 根据本次评估审查和更新个性化照护计划\n\n`

    report += `════════════════════════════════════════\n`
    report += `本报告保密，仅供授权人员使用。\n`
    report += `请按照贵单位数据保护政策处理。\n`
    report += `════════════════════════════════════════\n`

    return report
  }

  const generateConciseReport = (clientName: string, date: string, reportId: string, totalHealth: number, healthLevel: string, riskLevel: string) => {
    let report = `【探访简报】${reportId}\n`
    report += `━━━━━━━━━━━━━━━━━━━━\n\n`
    
    report += `客户：${clientName}\n`
    report += `日期：${date}\n`
    report += `地点：${selectedClient?.address || "未提供"}\n\n`
    
    report += `【健康评分】${totalHealth}/40 (${healthLevel})\n`
    report += `饮水：${healthStatus.water}/10 | 睡眠：${healthStatus.sleep}/10 | 饮食：${healthStatus.eating}/10 | 运动：${healthStatus.exercise}/10\n\n`
    
    report += `【评估摘要】\n`
    if (assessmentAnswers.length > 0) {
      assessmentAnswers.forEach((answer, index) => {
        report += `${index + 1}. ${answer.completionStatus || "待定"}\n`
      })
    } else {
      report += `未进行评估活动\n`
    }
    report += `\n【风险等级】${riskLevel}\n`
    report += `【下次跟进】7天内\n`

    return report
  }

  const generateDetailedReport = (clientName: string, date: string, reportId: string, totalHealth: number, healthLevel: string, riskLevel: string) => {
    let report = generateProfessionalReport(clientName, date, reportId, totalHealth, healthLevel, riskLevel)
    
    report += `\n────────────────────────────────────────\n`
    report += `六、详细观察记录\n`
    report += `────────────────────────────────────────\n\n`
    
    report += `【环境观察】\n`
    report += `居家环境整洁度：良好/一般/需关注\n`
    report += `安全隐患：无明显隐患/已发现并记录\n`
    report += `辅助设备状况：正常使用/需维护/需更新\n\n`
    
    report += `【情绪状态】\n`
    report += `客户在探访期间表现出${totalHealth >= 28 ? "积极配合、情绪稳定" : totalHealth >= 20 ? "基本配合、偶有情绪波动" : "需要更多情感支持"}的状态。\n`
    report += `社交互动能力：${totalHealth >= 25 ? "良好" : "需加强"}\n\n`
    
    report += `【家属沟通建议】\n`
    report += `建议与家属讨论以下事项：\n`
    if (healthStatus.water < 5) report += `- 增加日常饮水量监督\n`
    if (healthStatus.sleep < 5) report += `- 关注睡眠问题，必要时就医\n`
    if (healthStatus.eating < 5) report += `- 改善饮食结构，增加营养摄入\n`
    if (healthStatus.exercise < 5) report += `- 增加适度运动，防止功能退化\n`
    if (totalHealth >= 28) report += `- 保持当前良好状态，继续定期探访\n`

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
    link.download = `工作报告-${selectedClient?.name || "客户"}-${new Date().toISOString().split("T")[0]}.txt`
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
            <title>工作报告 - ${selectedClient?.name || "客户"}</title>
            <style>
              body { font-family: 'SimSun', serif; padding: 40px; line-height: 1.8; }
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
    name: "综合评分",
    value: ((healthStatus.water + healthStatus.sleep + healthStatus.eating + healthStatus.exercise) / 40) * 100,
    fill: "url(#healthGradient)"
  }]

  const polishOptions = [
    { id: "professional" as PolishStyle, icon: FileStack, label: "专业版", desc: "适用于正式报告和存档" },
    { id: "concise" as PolishStyle, icon: Zap, label: "简洁版", desc: "突出重点，精简内容" },
    { id: "detailed" as PolishStyle, icon: AlignLeft, label: "详细版", desc: "补充详情和背景信息" },
  ]

  return (
    <div className="flex flex-col gap-4 pb-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen -mx-4 -mt-4 px-4 pt-4">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">工作报告已生成</h2>
            <p className="text-sm text-white/90">基于评估数据自动生成的专业工作报告</p>
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
              <h3 className="font-semibold text-lg">{selectedClient?.name || "未选择客户"}</h3>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{selectedClient?.address || "未提供地址"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{selectedClient?.phone || "未提供电话"}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {new Date().toLocaleDateString("zh-CN")}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Health Status Visualization */}
      <Card className="bg-white/80 backdrop-blur border-slate-200/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
            <Sparkles className="h-4 w-4 text-amber-500" />
            客户健康状况（点击评分 0-10）
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
              <p className="text-xs text-muted-foreground mt-1">综合健康评分</p>
            </div>

            {/* Bar Chart for Individual Metrics */}
            <div className="flex flex-col">
              <ChartContainer config={chartConfig} className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" width={40} tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {healthChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <p className="text-xs text-muted-foreground mt-1 text-center">各项指标评分</p>
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
              评估问答记录
              <Badge variant="secondary" className="ml-auto">{assessmentAnswers.length} 项</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
              {assessmentAnswers.map((answer, index) => (
                <div key={answer.questionId} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default" className="bg-primary text-xs">Q{answer.questionId}</Badge>
                    <Badge variant={answer.completionStatus ? "default" : "outline"} className={cn("text-xs", answer.completionStatus && "bg-emerald-500")}>
                      {answer.completionStatus || "待审核"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mb-1 line-clamp-2">{answer.question}</p>
                  <p className="text-xs text-slate-800 bg-white rounded-lg p-2 border border-slate-100">
                    <span className="font-medium text-primary">回应：</span>
                    {answer.answer || "未记录"}
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
                工作报告预览
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                  <ClipboardCopy className="h-3.5 w-3.5" />
                  {copied ? "已复制！" : "复制"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  下载
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
              AI 润色
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              选择风格，AI 将优化报告的表达和格式
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
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">已应用</Badge>
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
              className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 mt-4"
              disabled={isPolishing}
            >
              <Sparkles className={cn("h-4 w-4", isPolishing && "animate-spin")} />
              {isPolishing ? "润色中..." : "重新生成"}
            </Button>

            <Button variant="outline" onClick={handleExportPDF} className="w-full gap-2">
              <Download className="h-4 w-4" />
              导出打印
            </Button>

            {/* Tips */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-600 mb-2">提示</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>报告基于评估数据自动生成</li>
                <li>支持多种风格切换</li>
                <li>可直接复制或下载保存</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleDownload} className="flex-1 gap-2">
          <Download className="h-4 w-4" />
          下载报告
        </Button>
        <Button onClick={onProceedToCreative} className="flex-1 gap-2 bg-gradient-to-r from-slate-600 via-blue-600 to-indigo-600 hover:from-slate-700 hover:via-blue-700 hover:to-indigo-700">
          创意报告
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
