"use client"

import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'

export function useScrollAnimation(
  animation: any,
  options?: {
    threshold?: number
    rootMargin?: string
    delay?: number
  }
) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      {
        threshold: options?.threshold || 0.1,
        rootMargin: options?.rootMargin || '0px 0px -50px 0px',
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || !ref.current) return

    const timer = setTimeout(() => {
      anime({
        targets: ref.current,
        ...animation,
      })
    }, options?.delay || 0)

    return () => clearTimeout(timer)
  }, [isVisible, animation, options?.delay])

  return ref
}

// Parallax scroll effect
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * speed
      element.style.transform = `translateY(${rate}px)`
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return ref
}

// Mouse follow effect
export function useMouseFollow(strength = 0.1) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { left, top, width, height } = element.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2
      const deltaX = (clientX - centerX) * strength
      const deltaY = (clientY - centerY) * strength

      anime({
        targets: element,
        translateX: deltaX,
        translateY: deltaY,
        duration: 1000,
        easing: 'easeOutQuad'
      })
    }

    const handleMouseLeave = () => {
      anime({
        targets: element,
        translateX: 0,
        translateY: 0,
        duration: 1000,
        easing: 'easeOutQuad'
      })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength])

  return ref
}
