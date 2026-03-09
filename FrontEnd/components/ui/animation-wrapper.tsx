"use client"

import { useEffect, useRef, ReactNode } from 'react'

interface AnimationWrapperProps {
  children: ReactNode
  animation?: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'rotateIn' | 'bounce' | 'float' | 'pulse' | 'shimmer'
  delay?: number
  className?: string
}

export function AnimationWrapper({ 
  children, 
  animation, 
  delay = 0, 
  className 
}: AnimationWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !animation) return

    const timer = setTimeout(() => {
      if (containerRef.current) {
        // Add animation classes based on type
        const element = containerRef.current
        element.classList.add('animate-' + animation)
        
        // Force reflow to ensure animation plays
        void element.offsetWidth
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [animation, delay])

  const getAnimationClass = () => {
    switch (animation) {
      case 'fadeIn':
        return 'animate-fade-in'
      case 'slideInLeft':
        return 'animate-slide-in-left'
      case 'slideInRight':
        return 'animate-slide-in-right'
      case 'scaleIn':
        return 'animate-scale-in'
      case 'rotateIn':
        return 'animate-rotate-in'
      case 'bounce':
        return 'animate-bounce'
      case 'float':
        return 'animate-float'
      case 'pulse':
        return 'animate-pulse'
      case 'shimmer':
        return 'animate-shimmer'
      default:
        return ''
    }
  }

  return (
    <div 
      ref={containerRef} 
      className={`${className} ${animation ? getAnimationClass() : ''}`}
    >
      {children}
    </div>
  )
}

// Common animation presets for direct use
export const animationPresets = {
  fadeIn: 'animate-fade-in',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  scaleIn: 'animate-scale-in',
  rotateIn: 'animate-rotate-in',
  bounce: 'animate-bounce',
  float: 'animate-float',
  pulse: 'animate-pulse',
  shimmer: 'animate-shimmer'
} as const

// Stagger animation for multiple elements
export function useStaggeredAnimation(
  selector: string,
  animation: string,
  delay = 100
) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector)
    
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-' + animation)
        void (element as HTMLElement).offsetWidth // Force reflow
      }, index * delay)
    })
  }, [selector, animation, delay])
}
