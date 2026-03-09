"use client"

import { useState, useEffect, useRef } from "react"

interface PremiumBackgroundProps {
  type?: "video" | "image" | "gradient"
  src?: string
  fallback?: string
  overlay?: "light" | "medium" | "dark" | "none"
  className?: string
  children?: React.ReactNode
}

const premiumBackgrounds = {
  hero: {
    type: "gradient" as const,
    gradient: "from-blue-600 via-purple-600 to-pink-600",
    fallback: "/1.jpg"
  },
  about: {
    type: "image" as const,
    src: "/2.jpg",
    fallback: "/3.jpg"
  },
  services: {
    type: "image" as const,
    src: "/4.jpg",
    fallback: "/5.jpg"
  }
}

export function PremiumBackground({ 
  type = "gradient", 
  src, 
  fallback, 
  overlay = "medium",
  className = "",
  children 
}: PremiumBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (type === "video" && src && videoRef.current) {
      const video = videoRef.current
      
      const handleCanPlay = () => {
        setIsLoaded(true)
        video.play().catch(e => console.log("Autoplay failed"))
      }
      
      const handleError = () => {
        console.error("Premium background video failed")
        setHasError(true)
      }

      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)

      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
      }
    } else if (type === "image" && src) {
      const img = new Image()
      img.onload = () => setIsLoaded(true)
      img.onerror = () => setHasError(true)
      img.src = src
    }
  }, [type, src])

  const getOverlayClass = () => {
    switch (overlay) {
      case "light": return "bg-white/10"
      case "medium": return "bg-black/30"
      case "dark": return "bg-black/50"
      case "none": return ""
      default: return "bg-black/30"
    }
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {type === "gradient" ? (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10" />
        </div>
      ) : type === "video" ? (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 animate-pulse" />
          )}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={src} type="video/mp4" />
          </video>
          {hasError && fallback && (
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${fallback})` }}
            />
          )}
        </>
      ) : (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 animate-pulse" />
          )}
          <div 
            className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${src || fallback})` }}
          />
          {hasError && fallback && (
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${fallback})` }}
            />
          )}
        </>
      )}
      
      <div className={`absolute inset-0 ${getOverlayClass()} transition-colors duration-300`} />
      
      {/* Animated overlay effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  )
}

export function HeroBackground({ children }: { children?: React.ReactNode }) {
  return (
    <PremiumBackground 
      type="gradient" 
      overlay="dark"
      className="min-h-screen"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      {children}
    </PremiumBackground>
  )
}

export function SectionBackground({ 
  section, 
  children 
}: { 
  section: keyof typeof premiumBackgrounds
  children?: React.ReactNode 
}) {
  const config = premiumBackgrounds[section]
  
  return (
    <PremiumBackground 
      type={config.type}
      src={config.src}
      fallback={config.fallback}
      overlay="medium"
      className="min-h-screen"
    >
      {children}
    </PremiumBackground>
  )
}
