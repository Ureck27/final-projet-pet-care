"use client"

import { useEffect, useRef } from "react"
// @ts-ignore
const anime = require('animejs')

interface ModernLoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ModernLoader({ size = "md", className = "" }: ModernLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLSpanElement[]>([])
  const dotRefs = [
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null)
  ]

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  }

  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  }

  useEffect(() => {
    const dots = dotRefs.map(ref => ref.current).filter(Boolean) as HTMLSpanElement[]
    
    if (dots.length === 0) return

    // Animate dots
    anime({
      targets: dots,
      translateY: [0, -10, 0],
      opacity: [0.5, 1, 0.5],
      duration: 1000,
      easing: 'easeInOutSine',
      loop: true,
      delay: anime.stagger(100)
    })

    // Rotate container
    if (containerRef.current) {
      anime({
        targets: containerRef.current,
        rotate: 360,
        duration: 2000,
        easing: 'linear',
        loop: true
      })
    }
  }, [])

  return (
    <div ref={containerRef} className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full">
        <span 
          ref={dotRefs[0]}
          className={`absolute top-0 left-1/2 -translate-x-1/2 ${dotSizes[size]} bg-primary rounded-full`}
        />
        <span 
          ref={dotRefs[1]}
          className={`absolute right-0 top-1/2 -translate-y-1/2 ${dotSizes[size]} bg-secondary rounded-full`}
        />
        <span 
          ref={dotRefs[2]}
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${dotSizes[size]} bg-accent rounded-full`}
        />
        <span 
          ref={dotRefs[3]}
          className={`absolute left-0 top-1/2 -translate-y-1/2 ${dotSizes[size]} bg-primary rounded-full`}
        />
      </div>
    </div>
  )
}

export function PulseLoader({ size = "md", className = "" }: ModernLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  }

  useEffect(() => {
    if (!containerRef.current) return

    anime({
      targets: containerRef.current,
      scale: [0.8, 1.2, 0.8],
      opacity: [0.5, 1, 0.5],
      duration: 1500,
      easing: 'easeInOutSine',
      loop: true
    })
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`${sizeClasses[size]} gradient-primary rounded-full ${className}`}
    />
  )
}

export function SkeletonLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded-lg ${className}`}>
      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
    </div>
  )
}
