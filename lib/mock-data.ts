import type { User, Pet, Trainer, Booking, PetStatus, Notification } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    fullName: "John Smith",
    phone: "1234567890",
    role: "owner",
    avatar: "/man-profile.png",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    email: "sarah@example.com",
    fullName: "Sarah Johnson",
    phone: "0987654321",
    role: "trainer",
    avatar: "/woman-trainer-profile.jpg",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    email: "mike@example.com",
    fullName: "Mike Wilson",
    phone: "5555555555",
    role: "trainer",
    avatar: "/man-trainer-profile.jpg",
    createdAt: new Date("2024-02-10"),
  },
]

export const mockPets: Pet[] = [
  {
    id: "1",
    ownerId: "1",
    name: "Max",
    species: "dog",
    breed: "Golden Retriever",
    age: 3,
    medicalNotes: "Allergic to chicken",
    photo: "/golden-retriever.png",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    ownerId: "1",
    name: "Luna",
    species: "cat",
    breed: "Persian",
    age: 2,
    photo: "/fluffy-persian-cat.png",
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "3",
    ownerId: "1",
    name: "Buddy",
    species: "dog",
    breed: "Labrador",
    age: 5,
    medicalNotes: "Takes daily vitamins",
    photo: "/labrador-dog.png",
    createdAt: new Date("2024-02-05"),
  },
]

export const mockTrainers: Trainer[] = [
  {
    id: "1",
    userId: "2",
    bio: "Certified dog trainer with 10+ years of experience. Specializing in behavioral training and puppy development.",
    experience: 10,
    certifications: ["CPDT-KA", "AKC CGC Evaluator"],
    services: ["Basic Training", "Behavioral Modification", "Puppy Training"],
    pricing: 75,
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    rating: 4.9,
  },
  {
    id: "2",
    userId: "3",
    bio: "Animal behavior specialist focusing on both dogs and cats. Gentle, positive reinforcement methods.",
    experience: 7,
    certifications: ["CAAB", "Fear Free Certified"],
    services: ["Cat Training", "Dog Walking", "Pet Sitting"],
    pricing: 60,
    availability: ["Monday", "Wednesday", "Friday", "Saturday"],
    rating: 4.7,
  },
]

export const mockBookings: Booking[] = [
  {
    id: "1",
    petId: "1",
    trainerId: "1",
    ownerId: "1",
    service: "Basic Training",
    date: new Date("2024-03-15"),
    time: "10:00",
    notes: "Focus on leash training",
    status: "confirmed",
  },
  {
    id: "2",
    petId: "2",
    trainerId: "2",
    ownerId: "1",
    service: "Cat Training",
    date: new Date("2024-03-16"),
    time: "14:00",
    status: "pending",
  },
]

export const mockPetStatuses: PetStatus[] = [
  {
    id: "1",
    petId: "1",
    trainerId: "1",
    walked: true,
    fed: true,
    played: true,
    resting: false,
    medication: false,
    notes: "Max had a great training session today!",
    createdAt: new Date("2024-03-15T12:00:00"),
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    title: "Booking Confirmed",
    message: "Your training session with Sarah has been confirmed for March 15.",
    read: false,
    createdAt: new Date("2024-03-14"),
  },
  {
    id: "2",
    userId: "1",
    title: "Status Update",
    message: "Max just completed his morning walk!",
    read: true,
    createdAt: new Date("2024-03-15"),
  },
]

export const services = [
  "Basic Training",
  "Behavioral Modification",
  "Puppy Training",
  "Cat Training",
  "Dog Walking",
  "Pet Sitting",
  "Grooming",
  "Veterinary Care",
]

export const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
