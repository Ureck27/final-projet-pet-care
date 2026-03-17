"use client"

import { useEffect, useState } from "react"

// Hook for detecting mobile device
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Hook for detecting touch device
export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    checkTouch()
  }, [])

  return isTouch
}

// Touch-friendly button wrapper
interface TouchButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
}

export function TouchButton({ 
  children, 
  onClick, 
  className = "", 
  size = "md" 
}: TouchButtonProps) {
  const isTouch = useIsTouch()
  
  const sizeClasses = {
    sm: "min-h-[44px] min-w-[44px] px-3 py-2",
    md: "min-h-[48px] min-w-[48px] px-4 py-3", 
    lg: "min-h-[52px] min-w-[52px] px-6 py-4"
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]} 
        ${isTouch ? 'touch-manipulation' : ''} 
        ${className}
      `}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none'
      }}
    >
      {children}
    </button>
  )
}

// Swipe gesture hook
export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold = 50
) {
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > threshold
    const isRightSwipe = distance < -threshold

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}

// Mobile-optimized card component
interface MobileCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function MobileCard({ children, className = "", onClick }: MobileCardProps) {
  const isMobile = useIsMobile()
  
  return (
    <div 
      className={`
        ${isMobile ? 'active:scale-95' : 'hover:scale-105'} 
        transition-transform 
        cursor-pointer 
        ${className}
      `}
      onClick={onClick}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none'
      }}
    >
      {children}
    </div>
  )
}

// Responsive spacing hook
export function useResponsiveSpacing() {
  const [spacing, setSpacing] = useState({
    section: 'py-16',
    container: 'px-4',
    gap: 'gap-8'
  })

  useEffect(() => {
    const updateSpacing = () => {
      const width = window.innerWidth
      
      if (width < 640) { // sm
        setSpacing({
          section: 'py-12',
          container: 'px-4',
          gap: 'gap-6'
        })
      } else if (width < 1024) { // md
        setSpacing({
          section: 'py-16',
          container: 'px-6',
          gap: 'gap-8'
        })
      } else { // lg+
        setSpacing({
          section: 'py-20',
          container: 'px-8',
          gap: 'gap-12'
        })
      }
    }

    updateSpacing()
    window.addEventListener('resize', updateSpacing)
    return () => window.removeEventListener('resize', updateSpacing)
  }, [])

  return spacing
}
