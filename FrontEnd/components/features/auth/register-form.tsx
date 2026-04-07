"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/context/auth-context"
import { registerSchema, type RegisterFormData } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, AlertCircle, User, GraduationCap, Eye, EyeOff, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function RegisterForm() {
  const router = useRouter()
  const { register: registerUser } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
    },
  })

  const password = watch("password") || ""
  const confirmPassword = watch("confirmPassword") || ""

  const passwordRequirements = [
    { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
    { label: "At least 1 uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "At least 1 lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
    { label: "At least 1 number", test: (pw: string) => /\d/.test(pw) },
    { label: "At least 1 special character (@$!%*?&)", test: (pw: string) => /[@$!%*?&]/.test(pw) },
  ]

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    const result = await registerUser({
      email: data.email,
      password: data.password,
      fullName: data.name,
      phone: '', // Not required in our simplified schema
      role: 'user'
    })

    if (result.success) {
      toast.success("Account created successfully!")
      router.push("/dashboard")
    } else {
      setError(result.message || "Registration failed. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md border-border shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>Join PetCare to connect with trainers and manage your pets</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="flex items-center gap-2 p-4 border-2 rounded-lg border-primary bg-accent">
              <User className="h-6 w-6" />
              <span className="text-sm font-medium">Pet Owner</span>
            </div>
            <p className="text-xs text-muted-foreground">Sign up as a pet owner to manage your pets and book services.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Smith"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
              data-testid="register-name"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
              data-testid="register-email"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn("pr-10", errors.password ? "border-destructive" : "")}
                  data-testid="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={cn("pr-10", errors.confirmPassword ? "border-destructive" : "")}
                  data-testid="register-confirm-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Password Requirements Checklist */}
          {password && (
            <div className="p-3 bg-accent/50 rounded-lg space-y-2 border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password Requirements</p>
              <div className="grid grid-cols-1 gap-1.5">
                {passwordRequirements.map((req, index) => {
                  const isMet = req.test(password)
                  return (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      {isMet ? (
                        <Check className="h-3.5 w-3.5 text-green-500 stroke-[3]" />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 ml-1" />
                      )}
                      <span className={isMet ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {req.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={watch("acceptTerms")}
              onCheckedChange={(checked) => setValue("acceptTerms", checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="acceptTerms" className="text-sm font-normal leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>}

          <Button type="submit" className="w-full" disabled={isLoading} data-testid="register-submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
