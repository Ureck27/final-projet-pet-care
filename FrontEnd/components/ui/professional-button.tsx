"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { forwardRef } from "react"

interface ProfessionalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient"
  size?: "sm" | "md" | "lg" | "xl"
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  fullWidth?: boolean
  glow?: boolean
  shine?: boolean
}

export const ProfessionalButton = forwardRef<HTMLButtonElement, ProfessionalButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      glow = false,
      shine = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-medium hover:shadow-large",
      secondary: "bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 text-foreground border border-border/30",
      outline: "border-2 border-primary/30 hover:border-primary/50 text-primary hover:bg-primary/10",
      ghost: "text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10",
      gradient: "bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white shadow-large glow-primary",
    }

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-sm",
      lg: "h-13 px-8 text-base",
      xl: "h-15 px-10 text-lg",
    }

    const MotionButton = motion(Button)

    return (
      <MotionButton
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl font-medium transition-all duration-300",
          "hover-lift active:scale-95",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          glow && "glow-primary",
          shine && "btn-shine",
          (disabled || loading) && "opacity-50 cursor-not-allowed hover:transform-none",
          className
        )}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        
        <span className={cn("flex items-center justify-center gap-2", loading && "opacity-0")}>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </span>
      </MotionButton>
    )
  }
)

ProfessionalButton.displayName = "ProfessionalButton"

// Specialized button components
export const CTAButton = forwardRef<HTMLButtonElement, Omit<ProfessionalButtonProps, "variant">>(
  (props, ref) => (
    <ProfessionalButton
      ref={ref}
      variant="gradient"
      size="lg"
      glow
      shine
      {...props}
    />
  )
)

CTAButton.displayName = "CTAButton"

export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<ProfessionalButtonProps, "variant">>(
  (props, ref) => (
    <ProfessionalButton
      ref={ref}
      variant="secondary"
      size="md"
      {...props}
    />
  )
)

SecondaryButton.displayName = "SecondaryButton"
