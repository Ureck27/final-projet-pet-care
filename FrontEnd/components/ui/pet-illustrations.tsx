"use client"

import { 
  PawPrint, Heart, Star, Sparkles, Cloud, Sun, Moon, 
  Home, Users, Calendar, Shield, Award, Zap, TrendingUp,
  Dog, Cat, Bird, Fish, Rabbit
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const petIcons = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  fish: Fish,
  rabbit: Rabbit
}

const pawPositions = [
  { top: "10%", left: "5%", size: 20, delay: 0 },
  { top: "20%", right: "8%", size: 16, delay: 0.5 },
  { top: "60%", left: "3%", size: 24, delay: 1 },
  { top: "80%", right: "6%", size: 18, delay: 1.5 },
  { top: "40%", left: "8%", size: 14, delay: 2 },
  { top: "70%", left: "12%", size: 22, delay: 2.5 },
]

export function PawPrintBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {pawPositions.map((pos, index) => (
        <motion.div
          key={index}
          className="absolute opacity-10"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ 
            opacity: [0, 0.1, 0.1, 0], 
            scale: [0, 1, 1, 0.8],
            rotate: [-45, 0, 0, 45]
          }}
          transition={{
            duration: 8,
            delay: pos.delay,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        >
          <PawPrint 
            size={pos.size} 
            className="text-purple-400"
            style={{ filter: "blur(0.5px)" }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export function FloatingPets({ className }: { className?: string }) {
  const pets = Object.values(petIcons)
  
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {pets.map((PetIcon, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            top: `${20 + (index * 15)}%`,
            left: `${10 + (index * 20)}%`,
          }}
          initial={{ opacity: 0, y: 100, rotate: 0 }}
          animate={{ 
            opacity: [0, 0.2, 0.2, 0],
            y: [100, -50, -50, 100],
            rotate: [0, 360, 360, 720],
            x: [0, 50, -50, 0]
          }}
          transition={{
            duration: 20 + (index * 2),
            delay: index * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <PetIcon 
            size={24 + (index * 4)} 
            className="text-purple-300 opacity-30"
            style={{ filter: "blur(1px)" }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export function AnimatedPawTrail({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <motion.svg
        className="absolute w-full h-full"
        viewBox="0 0 400 400"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <motion.path
          d="M50,200 Q100,100 200,200 T350,200"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5 5"
        />
      </motion.svg>
      
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${180 + Math.sin(i * 0.5) * 50}px`,
            left: `${50 + i * 70}px`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0.5]
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeOut"
          }}
        >
          <PawPrint size={16} className="text-purple-400" />
        </motion.div>
      ))}
    </div>
  )
}

export function PetCareIcons({ className }: { className?: string }) {
  const careIcons = [
    { icon: Heart, color: "text-blue-400", delay: 0 },
    { icon: Shield, color: "text-blue-400", delay: 0.5 },
    { icon: Award, color: "text-yellow-400", delay: 1 },
    { icon: Zap, color: "text-green-400", delay: 1.5 },
    { icon: Sparkles, color: "text-purple-400", delay: 2 },
  ]

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {careIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            top: `${15 + (index * 15)}%`,
            right: `${5 + (index * 10)}%`,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ 
            opacity: [0, 0.4, 0.4, 0],
            scale: [0, 1, 1, 0],
            rotate: [-180, 0, 0, 180]
          }}
          transition={{
            duration: 6,
            delay: item.delay,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut"
          }}
        >
          <item.icon 
            size={20 + (index * 2)} 
            className={item.color}
            style={{ filter: "blur(0.5px)" }}
          />
        </motion.div>
      ))}
    </div>
  )
}
