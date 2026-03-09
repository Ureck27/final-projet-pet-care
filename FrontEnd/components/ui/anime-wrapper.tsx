"use client"

import { useEffect, useRef, ReactNode } from 'react'
// @ts-ignore
const anime = require('animejs')

interface AnimeWrapperProps {
  children: ReactNode
  animation?: any
  delay?: number
  className?: string
}

export function AnimeWrapper({ 
  children, 
  animation, 
  delay = 0, 
  className 
}: AnimeWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !animation) return

    const timer = setTimeout(() => {
      anime({
        targets: containerRef.current,
        ...animation,
      })
    }, delay)

    return () => clearTimeout(timer)
  }, [animation, delay])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Common animation presets
export const animePresets = {
  fadeIn: {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    easing: 'easeOutQuad'
  },
  slideInLeft: {
    translateX: [-50, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutQuad'
  },
  slideInRight: {
    translateX: [50, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutQuad'
  },
  scaleIn: {
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 500,
    easing: 'easeOutElastic(1, .5)'
  },
  rotateIn: {
    rotate: [-15, 0],
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 700,
    easing: 'easeOutQuad'
  },
  bounce: {
    translateY: [-20, 0],
    duration: 800,
    easing: 'easeOutBounce'
  },
  float: {
    translateY: [0, -10, 0],
    duration: 3000,
    easing: 'easeInOutSine',
    loop: true
  },
  pulse: {
    scale: [1, 1.05, 1],
    duration: 2000,
    easing: 'easeInOutSine',
    loop: true
  },
  shimmer: {
    translateX: ['-100%', '100%'],
    duration: 1500,
    easing: 'easeInOutQuad',
    loop: true
  }
} as const

// Stagger animation for multiple elements
export function useStaggeredAnimation(
  selector: string,
  animation: any,
  delay = 100
) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector)
    
    anime({
      targets: elements,
      delay: anime.stagger(delay),
      ...animation,
    })
  }, [selector, animation, delay])
}
