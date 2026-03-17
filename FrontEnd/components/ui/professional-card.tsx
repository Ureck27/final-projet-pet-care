"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface ProfessionalCardProps {
  title: string
  description: string
  icon?: LucideIcon
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
  children?: React.ReactNode
  variant?: "default" | "glass" | "gradient" | "elevated"
  hover?: boolean
}

export function ProfessionalCard({
  title,
  description,
  icon: Icon,
  badge,
  badgeVariant = "secondary",
  action,
  className,
  children,
  variant = "default",
  hover = true,
}: ProfessionalCardProps) {
  const cardVariants = {
    default: "bg-card border-border shadow-soft",
    glass: "glass-effect border-border/30",
    gradient: "bg-gradient-to-br from-primary/5 to-secondary/5 border-border/20",
    elevated: "bg-card shadow-large",
  }

  const MotionCard = motion(Card)

  return (
    <MotionCard
      className={cn(
        cardVariants[variant],
        "rounded-2xl transition-all duration-300",
        hover && "hover-lift hover:shadow-large",
        className
      )}
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            )}
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold leading-tight">
                {title}
              </CardTitle>
              {badge && (
                <Badge variant={badgeVariant} className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground mt-3">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {children}
        
        {action && (
          <div className="mt-6">
            <Button
              asChild={!!action.href}
              onClick={action.onClick}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-medium hover:shadow-large transition-all duration-300"
              size="lg"
            >
              {action.href ? (
                <a href={action.href}>{action.label}</a>
              ) : (
                action.label
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </MotionCard>
  )
}

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  delay?: number
}

export function FeatureCard({ icon: Icon, title, description, className, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn("feature-card", className)}
    >
      <ProfessionalCard
        title={title}
        description={description}
        icon={Icon}
        variant="glass"
        hover
        className="h-full"
      />
    </motion.div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  className?: string
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      <ProfessionalCard
        title={title}
        description=""
        icon={Icon}
        variant="gradient"
        hover={false}
        className="text-center"
      >
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {value}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center justify-center gap-1 text-sm font-medium",
              trend.positive ? "text-green-600" : "text-red-600"
            )}>
              <span>{trend.value}</span>
              <span>{trend.positive ? "↑" : "↓"}</span>
            </div>
          )}
        </div>
      </ProfessionalCard>
    </motion.div>
  )
}
