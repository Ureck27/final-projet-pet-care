"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const backgrounds = [
  { type: "video", src: "/3.mp4" }, // Only use existing video
  { type: "image", src: "/1.jpg" },
  { type: "image", src: "/2.jpg" },
  { type: "image", src: "/3.jpg" },
  { type: "image", src: "/4.jpg" },
  { type: "image", src: "/5.jpg" },
  { type: "image", src: "/6.jpg" },
  { type: "image", src: "/7.jpg" },
  { type: "image", src: "/8.jpg" },
  { type: "image", src: "/9.jpg" },
]

export function GlobalBackground() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  useEffect(() => {
    // Only cycle backgrounds if not on the dashboard (to keep dashboard clean)
    if (isDashboard) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length)
      setHasError(false)
      setIsLoaded(false)
      setVideoReady(false)
    }, 12000) // Change background every 12 seconds

    return () => clearInterval(interval)
  }, [isDashboard])

  // Handle video loading
  useEffect(() => {
    const currentBg = backgrounds[currentIndex]
    if (currentBg.type === "video" && videoRef.current) {
      const video = videoRef.current
      
      const handleCanPlay = () => {
        setVideoReady(true)
        setIsLoaded(true)
      }
      
      const handleError = () => {
        console.error("Video failed to load, skipping to next background")
        setHasError(true)
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % backgrounds.length)
        }, 1000)
      }

      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)
      
      // Reset video and try to play
      video.currentTime = 0
      video.play().catch((error) => {
        console.log("Video autoplay failed, using fallback")
        setHasError(true)
      })

      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
      }
    } else if (currentBg.type === "image") {
      // Preload image
      const img = new Image()
      img.onload = () => setIsLoaded(true)
      img.onerror = () => {
        console.error("Image failed to load, skipping to next background")
        setHasError(true)
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % backgrounds.length)
        }, 1000)
      }
      img.src = currentBg.src
    }
  }, [currentIndex])

  // Don't render video/image background on dashboard to keep the UI clean and readable
  if (isDashboard) {
    return (
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pointer-events-none transition-all duration-700" />
    )
  }

  const currentBg = backgrounds[currentIndex]

  return (
    <>
      <div className="fixed inset-0 -z-20 w-screen h-screen overflow-hidden bg-black transition-opacity duration-1000">
        {currentBg.type === "video" ? (
          <>
            {!videoReady && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-green-900 animate-pulse" />
            )}
            <video
              ref={videoRef}
              key={currentBg.src}
              autoPlay
              loop
              muted
              playsInline
              className={`absolute min-w-full min-h-full object-cover transition-opacity duration-1000 ${
                videoReady ? 'opacity-80' : 'opacity-0'
              }`}
            >
              <source src={currentBg.src} type="video/mp4" />
              {/* Fallback message if video doesn't load */}
              Your browser does not support the video tag.
            </video>
          </>
        ) : (
          <>
            {!isLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-green-900 animate-pulse" />
            )}
            <div 
              key={currentBg.src}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${
                isLoaded ? 'opacity-80' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${currentBg.src})` }}
            />
          </>
        )}
        
        {/* Enhanced gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
      </div>
      
      {/* Enhanced dark semi-transparent overlay to ensure text readability */}
      <div className="fixed inset-0 -z-10 bg-black/20 dark:bg-black/40 backdrop-blur-[1px] pointer-events-none transition-colors duration-500" />
    </>
  )
}
