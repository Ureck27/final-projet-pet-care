export type UserRole = "visitor" | "user" | "trainer" | "worker" | "admin"

export interface User {
  _id: string
  id: string // for frontend compatibility
  email: string
  name: string
  fullName: string
  phone: string
  role: UserRole
  avatar?: string
  createdAt: Date
}

export interface Pet {
  _id: string
  id: string // for frontend compatibility
  ownerId: string
  name: string
  fullName?: string
  type: "dog" | "cat" | "bird" | "rabbit" | "other" // Changed from species to type
  breed: string
  age: number
  weight?: number // Changed from string to number
  color?: string
  medicalNotes?: string
  photo?: string
  createdAt: Date
  updatedAt: string
}

// Enhanced Pet Profile
export interface PetProfile {
  id: string
  petId: string
  ownerId: string
  // Health & Medical
  dateOfBirth?: Date
  weight?: number
  color?: string
  microchipId?: string
  veterinarian?: {
    name: string
    clinic: string
    phone: string
    email?: string
  }
  medicalHistory: Array<{
    date: Date
    condition: string
    treatment: string
    notes?: string
  }>
  allergies?: string[]
  // Dietary Information
  dietaryRequirements?: string
  foodBrand?: string
  mealsPerDay?: number
  mealTimes?: string[] // e.g., ["08:00", "18:00"]
  restrictions?: string[] // foods to avoid
  treats?: string[]
  waterIntakeGoal?: number // in ml
  // Medications & Supplements
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    startDate: Date
    endDate?: Date
    instructions?: string
    purpose: string
  }>
  supplements: Array<{
    name: string
    dosage: string
    frequency: string
    purpose: string
  }>
  // Behavioral Notes
  temperament?: string[]
  knownBehaviors?: string[]
  fears?: string[]
  triggers?: string[]
  positiveBehaviors?: string[]
  trainingStatus?: string
  // Emergency Information
  emergencyContacts: Array<{
    name: string
    phone: string
    relationship: string
  }>
  insuranceProvider?: string
  insurancePolicyNumber?: string
  // Preferences & Schedule
  preferredActivities?: string[]
  exerciseNeeds?: "low" | "moderate" | "high" | "very-high"
  sleepSchedule?: { bedtime: string; wakeTime: string }
  grooming?: {
    frequency: string
    groomer?: string
    lastGrooming?: Date
  }
  // Medical Records
  vaccinations: Array<{
    name: string
    date: Date
    expiryDate?: Date
    vetName?: string
  }>
  // Special Instructions
  specialInstructions?: string
  createdAt: Date
  updatedAt: Date
}

export interface TrainerService {
  _id?: string;
  serviceName: string;
  price?: number | null;
  priceType?: 'fixed' | 'hourly' | 'custom';
  isActive?: boolean;
}

export interface Trainer {
  _id?: string // Optional _id for new trainers
  id: string
  userId: string
  name?: string
  bio?: string
  experience: number
  certifications: string[]
  services: (string | TrainerService)[]
  pricing?: number
  availability: string[]
  rating: number
}

export interface Booking {
  _id: string
  id: string // for frontend compatibility
  petId: string
  trainerId: string
  ownerId: string
  service: string
  date: Date
  time: string
  notes?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  packageType?: CarePackageType
  customInstructions?: string
  meetAndGreetScheduled?: Date
  meetAndGreetCompleted?: boolean
  totalPrice?: number
  paymentStatus?: "pending" | "paid" | "refunded"
  createdAt: Date
  updatedAt: Date
}

// Care Plan Types
export interface CarePlan {
  id: string
  bookingId: string
  petId: string
  trainerId: string
  specialNeeds: string[]
  dietaryRequirements?: string
  medications?: Array<{
    name: string
    dosage: string
    frequency: string
    instructions: string
  }>
  emergencyContacts: Array<{
    name: string
    phone: string
    relationship: string
  }>
  behavioralNotes?: string
  preferredActivities: string[]
  restrictions?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface PetStatus {
  id: string
  petId: string
  trainerId: string
  walked: boolean
  fed: boolean
  played: boolean
  resting: boolean
  medication: boolean
  notes: string
  photo?: string
  createdAt: Date
}

// Task Management Types
export type TaskType = "walk" | "play" | "meal" | "training" | "medication" | "rest" | "grooming" | "vet-check" | "custom"
export type TaskFrequency = "daily" | "weekly" | "monthly" | "one-time"
export type TaskPriority = "high" | "medium" | "low"
export type TaskStatus = "pending" | "in-progress" | "completed" | "overdue" | "cancelled"

export interface Task {
  _id: string
  id: string // for frontend compatibility
  petId: string
  ownerId?: string
  caregiverId?: string
  title: string
  type: TaskType
  description?: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: Date
  frequency?: TaskFrequency
  recurrencePattern?: string // Cron pattern for recurring tasks
  timeWindow?: { start: string; end: string } // e.g., "09:00" to "10:00"
  assignedTo: "owner" | "caregiver" | "both"
  completionPhoto?: string
  completionNotes?: string
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Daily Activity Types
export type EmotionType = "happy" | "sad" | "anxious" | "stressed" | "calm" | "playful" | "neutral" | "distressed" | "content"

export interface DailyActivity {
  id: string
  petId: string
  caregiverId: string
  activityType: "walk" | "play" | "meal" | "training" | "rest" | "medication" | "other"
  title: string
  description?: string
  duration?: number // in minutes
  startTime: Date
  endTime?: Date
  photo?: string
  videoUrl?: string
  emotion?: EmotionType
  emotionConfidence?: number // 0-100
  caregiverNotes?: string
  location?: { latitude?: number; longitude?: number; address?: string }
  aiVerified: boolean
  createdAt: Date
}

// Notification Types
export type NotificationType =
  | "task-reminder"
  | "task-overdue"
  | "activity-update"
  | "emotion-alert"
  | "health-alert"
  | "booking-update"
  | "message"
  | "review"
  | "platform-update"

export type NotificationPriority = "critical" | "high" | "medium" | "low"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  actionUrl?: string
  read: boolean
  dismissed?: boolean
  sentAt: Date
  readAt?: Date
  createdAt: Date
}

export interface NotificationPreferences {
  userId: string
  pushNotificationsEnabled: boolean
  emailEnabled: boolean
  emailFrequency: "immediate" | "daily-digest" | "weekly-digest"
  smsEnabled: boolean
  quietHoursStart?: string // e.g., "22:00"
  quietHoursEnd?: string // e.g., "07:00"
  workModeEnabled?: boolean
  workModeStart?: string
  workModeEnd?: string
  notificationTypes: {
    taskReminders: boolean
    activityUpdates: boolean
    behavioralAlerts: boolean
    healthAlerts: boolean
    bookingUpdates: boolean
    messages: boolean
    systemUpdates: boolean
  }
  createdAt: Date
  updatedAt: Date
}

// Emotion Detection & Mood Tracking
export interface MoodEntry {
  id: string
  petId: string
  emotion: EmotionType
  confidence: number // 0-100
  photoUrl?: string
  timestamp: Date
  caregiverNotes?: string
}

export interface MoodTrend {
  petId: string
  date: Date
  dominantEmotion: EmotionType
  emotionBreakdown: Record<EmotionType, number>
  averageHappiness: number // 0-100
}

// Care Package Types
export type CarePackageType = "daily" | "overnight" | "travel" | "custom"

export interface CarePackage {
  id: string
  type: CarePackageType
  name: string
  description: string
  basePrice: number
  visitsPerWeek?: number
  duration?: string
  includedServices: string[]
  features: string[]
}

// Message Types
export interface Conversation {
  id: string
  participantIds: string[]
  lastMessage?: string
  lastMessageDate?: Date
  lastMessageSenderId?: string
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  attachments?: { type: "photo" | "video"; url: string }[]
  read: boolean
  createdAt: Date
}

// Review Types
export interface Review {
  id: string
  bookingId: string
  reviewerId: string
  caregiverId: string
  rating: number // 1-5
  title: string
  comment: string
  categories?: {
    professionalism: number
    communication: number
    careQuality: number
    punctuality: number
  }
  createdAt: Date
}

export interface TrainerApplication {
  id: string
  userId?: string
  // Personal Information
  fullName: string
  email: string
  phone: string
  city: string
  country: string
  profilePhoto?: string
  // Experience & Qualifications
  yearsExperience: "0-1" | "1-3" | "3-5" | "5+"
  petExperience: ("dogs" | "cats" | "both" | "special-needs")[]
  education: "veterinary" | "certification" | "online-course" | "no-formal"
  certificationFile?: string
  // Living & Care Conditions
  canHostPets: boolean
  homeType: "apartment" | "house-with-yard"
  hasPetsAtHome: boolean
  maxPetsCapacity: number
  allowPetsOnFurniture: boolean
  // Availability & Services
  availableDays: string[]
  availableHours: ("morning" | "afternoon" | "night")[]
  servicesOffered: (
    | "daily-walking"
    | "overnight-care"
    | "long-term-boarding"
    | "training-sessions"
    | "medical-support"
  )[]
  emergencyAvailability: boolean
  // Trust & Safety
  governmentIdFile?: string
  backgroundCheckConsent: boolean
  agreeToPlatformRules: boolean
  // About You
  bio: string
  motivation: string
  // Status
  status: "pending" | "approved" | "rejected"
  submittedAt: Date
  reviewedAt?: Date
  reviewNotes?: string
}

// Routine Monitoring Types
export interface Routine {
  id: string
  petId: string
  trainerId: string
  taskName: string
  description: string
  scheduledTime: Date
  status: "pending" | "completed"
  createdAt?: Date
  updatedAt?: Date
}

export interface RoutineLog {
  id: string
  routineId: string
  petId: string
  trainerId: string
  photoUrl: string
  aiStatus: string
  aiMessage: string
  createdAt: Date
}
