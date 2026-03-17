import { ForgotPasswordForm } from "@/components/features/auth/forgot-password-form"
import { PawPrint } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <PawPrint className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold">PetCare</span>
      </Link>
      <ForgotPasswordForm />
    </div>
  )
}
