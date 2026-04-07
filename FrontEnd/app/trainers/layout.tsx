import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Caregivers & Trainers | PetCare",
  description: "Browse verified and certified pet care professionals in your area. Find the perfect caregiver for your pet.",
}

export default function TrainersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
