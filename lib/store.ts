import { create } from 'zustand'

export interface Client {
  id: string
  name: string
  address: string
  phone: string
  scheduledTime: string
  status: "pending" | "in-progress" | "completed"
}

export interface AssessmentAnswer {
  questionId: string
  question: string
  answer: string
  completionStatus: string
}

export interface HealthStatus {
  water: number
  sleep: number
  eating: number
  exercise: number
}

export interface AttendanceRecord {
  id: string
  clientId: string
  startTime: string
  endTime: string
  date: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
  requiredAttendance: number
}

interface AppState {
  currentView: string
  setCurrentView: (view: string) => void
  
  clients: Client[]
  setClients: (clients: Client[]) => void
  selectedClient: Client | null
  setSelectedClient: (client: Client | null) => void
  
  assessmentAnswers: AssessmentAnswer[]
  setAssessmentAnswers: (answers: AssessmentAnswer[]) => void
  addAssessmentAnswer: (answer: AssessmentAnswer) => void
  
  healthStatus: HealthStatus
  setHealthStatus: (status: HealthStatus) => void
  updateHealthMetric: (metric: keyof HealthStatus, value: number) => void
  
  serviceDate: string
  setServiceDate: (date: string) => void
  serviceDateEnabled: boolean
  setServiceDateEnabled: (enabled: boolean) => void
  
  attendanceRecords: AttendanceRecord[]
  addAttendanceRecord: (record: AttendanceRecord) => void
  
  badges: Badge[]
  unlockedBadges: string[]
  unlockBadge: (badgeId: string) => void
  
  generatedReport: string
  setGeneratedReport: (report: string) => void
}

const defaultClients: Client[] = [
  {
    id: "1",
    name: "Chan Tai Man",
    address: "3 Tin Kwai Road, Tin Shui Wai, New Territories",
    phone: "+852 9123 4567",
    scheduledTime: "09:00 - 10:30",
    status: "pending"
  },
  {
    id: "2", 
    name: "Wong Mei Ling",
    address: "1 Austin Road West, Tsim Sha Tsui, Kowloon",
    phone: "+852 9234 5678",
    scheduledTime: "11:00 - 12:30",
    status: "pending"
  },
  {
    id: "3",
    name: "Lee Siu Fong",
    address: "8 Aberdeen Main Road, Aberdeen",
    phone: "+852 9345 6789",
    scheduledTime: "14:00 - 15:30",
    status: "pending"
  },
  {
    id: "4",
    name: "Ng Ka Wai",
    address: "21 Borrett Road, Mid-Levels, Central, Hong Kong",
    phone: "+852 9456 7890",
    scheduledTime: "16:00 - 17:30",
    status: "pending"
  }
]

const defaultBadges: Badge[] = [
  { id: "1", name: "First Steps", description: "Complete your first attendance", icon: "star", requiredAttendance: 1 },
  { id: "2", name: "Dedicated Helper", description: "Complete 5 attendances", icon: "heart", requiredAttendance: 5 },
  { id: "3", name: "Community Champion", description: "Complete 10 attendances", icon: "trophy", requiredAttendance: 10 },
  { id: "4", name: "Service Star", description: "Complete 25 attendances", icon: "award", requiredAttendance: 25 },
  { id: "5", name: "Golden Heart", description: "Complete 50 attendances", icon: "medal", requiredAttendance: 50 },
]

export const useAppStore = create<AppState>((set) => ({
  currentView: "home",
  setCurrentView: (view) => set({ currentView: view }),
  
  clients: defaultClients,
  setClients: (clients) => set({ clients }),
  selectedClient: null,
  setSelectedClient: (client) => set({ selectedClient: client }),
  
  assessmentAnswers: [],
  setAssessmentAnswers: (answers) => set({ assessmentAnswers: answers }),
  addAssessmentAnswer: (answer) => set((state) => ({ 
    assessmentAnswers: [...state.assessmentAnswers, answer] 
  })),
  
  healthStatus: { water: 0, sleep: 0, eating: 0, exercise: 0 },
  setHealthStatus: (status) => set({ healthStatus: status }),
  updateHealthMetric: (metric, value) => set((state) => ({
    healthStatus: { ...state.healthStatus, [metric]: Math.min(10, Math.max(0, value)) }
  })),
  
  serviceDate: new Date().toISOString().split('T')[0],
  setServiceDate: (date) => set({ serviceDate: date }),
  serviceDateEnabled: false,
  setServiceDateEnabled: (enabled) => set({ serviceDateEnabled: enabled }),
  
  attendanceRecords: [],
  addAttendanceRecord: (record) => set((state) => ({
    attendanceRecords: [...state.attendanceRecords, record]
  })),
  
  badges: defaultBadges,
  unlockedBadges: [],
  unlockBadge: (badgeId) => set((state) => ({
    unlockedBadges: state.unlockedBadges.includes(badgeId) 
      ? state.unlockedBadges 
      : [...state.unlockedBadges, badgeId]
  })),
  
  generatedReport: "",
  setGeneratedReport: (report) => set({ generatedReport: report })
}))
