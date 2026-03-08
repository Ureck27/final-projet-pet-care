"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const images = [
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
  "/5.jpg",
  "/6.jpg",
]

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl border border-border/50 dark:border-slate-800 bg-muted">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Happy pets ${index + 1}`}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}
