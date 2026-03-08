"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

const backgrounds = [
  { type: "video", src: "/1.mp4" },
  { type: "video", src: "/2.mp4" },
  { type: "video", src: "/3.mp4" },
  { type: "video", src: "/4.mp4" },
  { type: "image", src: "/7.jpg" },
  { type: "image", src: "/8.jpg" },
  { type: "image", src: "/9.jpg" },
]

export function GlobalBackground() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  useEffect(() => {
    // Only cycle backgrounds if not on the dashboard (to keep dashboard clean)
    if (isDashboard) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length)
    }, 15000) // Change background every 15 seconds

    return () => clearInterval(interval)
  }, [isDashboard])

  // Don't render video/image background on dashboard to keep the UI clean and readable
  if (isDashboard) {
    return (
      <div className="fixed inset-0 -z-20 bg-background/95 backdrop-blur-sm pointer-events-none transition-colors duration-500" />
    )
  }

  const currentBg = backgrounds[currentIndex]

  return (
    <>
      <div className="fixed inset-0 -z-20 w-screen h-screen overflow-hidden bg-black transition-opacity duration-1000">
        {currentBg.type === "video" ? (
          <video
            key={currentBg.src}
            autoPlay
            loop
            muted
            playsInline
            className="absolute min-w-full min-h-full object-cover opacity-80 animate-fade-in"
          >
            <source src={currentBg.src} type="video/mp4" />
          </video>
        ) : (
          <div 
            key={currentBg.src}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 animate-fade-in transition-all duration-1000"
            style={{ backgroundImage: `url(${currentBg.src})` }}
          />
        )}
      </div>
      
      {/* Dark semi-transparent overlay to ensure text readability */}
      <div className="fixed inset-0 -z-10 bg-black/40 dark:bg-black/60 backdrop-blur-[2px] pointer-events-none transition-colors duration-500" />
    </>
  )
}
