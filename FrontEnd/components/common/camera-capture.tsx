"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, X, Check, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CameraCaptureProps {
  onCapture: (file: File) => void
  buttonText?: string
  className?: string
}

export function CameraCapture({ onCapture, buttonText = "Open Camera", className }: CameraCaptureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: { ideal: "environment" }, // Prefer back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setError(null)
    } catch (err: any) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please check your permissions and ensure no other app is using it.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera()
    }
    return () => {
      if (stream) {
        stopCamera()
      }
    }
  }, [isOpen, capturedImage])

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Match canvas size to video size
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // Horizontal flip if using front camera (optional, but good for UX)
        // For now, keep it simple
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImage(dataUrl)
        stopCamera()
      }
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
    startCamera()
  }

  const handleUsePhoto = async () => {
    if (capturedImage) {
      try {
        const res = await fetch(capturedImage)
        const blob = await res.blob()
        const file = new File([blob], `pet-photo-${Date.now()}.jpg`, { type: "image/jpeg" })
        onCapture(file)
        setIsOpen(false)
        setCapturedImage(null)
      } catch (err) {
        console.error("Error processing captured image:", err)
        setError("Failed to process image. Please try again.")
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        stopCamera()
        setCapturedImage(null)
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className={className}>
          <Camera className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-zinc-950 border-zinc-800">
        <DialogHeader className="p-4 bg-zinc-900 border-b border-zinc-800">
          <DialogTitle className="text-white">Capture Pet Photo</DialogTitle>
        </DialogHeader>
        
        <div className="relative aspect-[4/3] w-full bg-black flex items-center justify-center">
          {error ? (
            <div className="p-6 text-center w-full max-w-xs">
              <Alert variant="destructive" className="bg-red-950/50 border-red-900 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Camera Error</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
              <Button onClick={startCamera} variant="outline" className="mt-4 border-zinc-700 hover:bg-zinc-800">
                Try Again
              </Button>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured" className="h-full w-full object-contain" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/20 pointer-events-none m-8 rounded-xl" />
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <DialogFooter className="p-6 bg-zinc-900 border-t border-zinc-800 flex flex-row items-center justify-center gap-4">
          {!capturedImage && !error && (
            <div className="flex flex-col items-center gap-3">
              <Button 
                onClick={capturePhoto} 
                className="h-16 w-16 rounded-full bg-white hover:bg-zinc-200 text-black border-4 border-zinc-800 shadow-xl"
              >
                 <Camera className="h-8 w-8" />
              </Button>
              <span className="text-xs text-zinc-400 font-medium">Capture Photo</span>
            </div>
          )}
          {capturedImage && (
            <div className="flex gap-3 w-full">
              <Button variant="outline" onClick={handleRetake} className="flex-1 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <Button onClick={handleUsePhoto} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Check className="mr-2 h-4 w-4" />
                Use Photo
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
