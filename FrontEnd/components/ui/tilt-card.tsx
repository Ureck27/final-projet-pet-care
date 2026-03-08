"use client"

import React, { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export function TiltCard({ children, className = "", intensity = 15 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  // We use motion values to track mouse position instead of state to prevent re-renders
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth the motion values with a spring physics engine
  const mouseXSpring = useSpring(x, {
    stiffness: 300,
    damping: 30,
    mass: 0.5
  })
  
  const mouseYSpring = useSpring(y, {
    stiffness: 300,
    damping: 30,
    mass: 0.5
  })

  // Transform the mouse position into rotation values
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-intensity, intensity])
  
  // Create a subtle lighting effect that follows the mouse
  const brightness = useTransform(mouseYSpring, [-0.5, 0.5], [1.1, 0.9])
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    
    // Calculate mouse position relative to center of the card (-0.5 to 0.5)
    // We use inner width/height for responsive calculation
    const width = rect.width
    const height = rect.height
    
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const xPct = (mouseX / width) - 0.5
    const yPct = (mouseY / height) - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative perspective-1000 ${className}`}
      style={{
        rotateX,
        rotateY,
        filter: `brightness(${brightness})`,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {/* 
        This inner div creates the 3d separation effect. We push its content forward 
        TranslateZ provides hardware acceleration
      */}
      <div style={{ transform: "translateZ(30px)" }} className="w-full h-full">
        {children}
      </div>
    </motion.div>
  )
}
