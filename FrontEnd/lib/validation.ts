import { z } from "zod"

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)"
      ),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    acceptTerms: z.boolean().refine((val) => val === true, "You must accept terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  fullName: z.string().optional(),
  type: z.enum(["dog", "cat", "bird", "rabbit", "other"]), // Changed from species to type
  breed: z.string().min(1, "Breed is required"),
  age: z.number().min(0, "Age must be positive"),
  weight: z.number().optional(), // Changed from string to number
  color: z.string().optional(),
  medicalNotes: z.string().optional(),
  description: z.string().optional(),
  photo: z.string().optional(),
})

export const caregiverApplicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  experience: z.string().min(10, "Please provide detailed experience information"),
  petTypes: z.array(z.string()).min(1, "Please select at least one pet type"),
  certifications: z.string().optional(),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  profileImage: z.string().optional(),
  idDocument: z.string().optional(),
})

export const trainerProfileSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  experience: z.number().min(0, "Experience must be positive"),
  services: z.array(z.string()).min(1, "Select at least one service"),
  pricing: z.number().min(0, "Pricing must be positive"),
})

export const bookingSchema = z.object({
  service: z.string().min(1, "Please select a service"),
  trainerId: z.string().min(1, "Please select a professional caregiver"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
})

export const statusUpdateSchema = z.object({
  walked: z.boolean(),
  fed: z.boolean(),
  played: z.boolean(),
  resting: z.boolean(),
  medication: z.boolean(),
  notes: z.string().optional(),
})

export const trainerApplicationSchema = z.object({
  // Section 1 - Personal Information
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  profilePhoto: z.string().optional(),

  // Section 2 - Experience & Qualifications
  yearsExperience: z.enum(["0-1", "1-3", "3-5", "5+"]),
  petExperience: z.array(z.enum(["dogs", "cats", "both", "special-needs"])).min(1, "Select at least one"),
  education: z.enum(["veterinary", "certification", "online-course", "no-formal"]),
  certificationFile: z.string().optional(),

  // Section 3 - Living & Care Conditions
  canHostPets: z.boolean(),
  homeType: z.enum(["apartment", "house-with-yard"]),
  hasPetsAtHome: z.boolean(),
  maxPetsCapacity: z.number().min(1, "Must be at least 1").max(20, "Maximum 20 pets"),
  allowPetsOnFurniture: z.boolean(),

  // Section 4 - Availability & Services
  availableDays: z.array(z.string()).min(1, "Select at least one day"),
  availableHours: z.array(z.enum(["morning", "afternoon", "night"])).min(1, "Select at least one time"),
  servicesOffered: z
    .array(z.enum(["daily-walking", "overnight-care", "long-term-boarding", "training-sessions", "medical-support"]))
    .min(1, "Select at least one service"),
  emergencyAvailability: z.boolean(),

  // Section 5 - Trust & Safety
  governmentIdFile: z.string().optional(),
  backgroundCheckConsent: z.boolean().refine((val) => val === true, "Background check consent is required"),
  agreeToPlatformRules: z.boolean().refine((val) => val === true, "You must agree to platform rules"),

  // Section 6 - About You
  bio: z.string().min(50, "Bio must be at least 50 characters").max(1000, "Bio must be less than 1000 characters"),
  motivation: z
    .string()
    .min(20, "Motivation must be at least 20 characters")
    .max(500, "Motivation must be less than 500 characters"),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type PetFormData = z.infer<typeof petSchema>
export type BookingFormData = z.infer<typeof bookingSchema>
export type TrainerProfileFormData = z.infer<typeof trainerProfileSchema>
export type StatusUpdateFormData = z.infer<typeof statusUpdateSchema>
export type TrainerApplicationFormData = z.infer<typeof trainerApplicationSchema>
