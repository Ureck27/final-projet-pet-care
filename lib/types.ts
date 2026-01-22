export type UserRole = "owner" | "trainer"

export interface User {
  id: string
  email: string
  fullName: string
  phone: string
  role: UserRole
  avatar?: string
  createdAt: Date
}

export interface Pet {
  id: string
  ownerId: string
  name: string
  species: "dog" | "cat"
  breed: string
  age: number
  medicalNotes?: string
  photo?: string
  createdAt: Date
}

export interface Trainer {
  id: string
  userId: string
  bio: string
  experience: number
  certifications: string[]
  services: string[]
  pricing: number
  availability: string[]
  rating: number
}

export interface Booking {
  id: string
  petId: string
  trainerId: string
  ownerId: string
  service: string
  date: Date
  time: string
  notes?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
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

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  read: boolean
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
