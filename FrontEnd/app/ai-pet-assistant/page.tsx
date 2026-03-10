"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader } from "@/components/common/loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageCircle, 
  Camera, 
  Video, 
  Upload, 
  Send, 
  Bot, 
  User, 
  Heart,
  Activity,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Stethoscope,
  Pill,
  Thermometer
} from "lucide-react"
import { api } from "@/lib/api"
import type { Pet, DailyActivity, MoodEntry } from "@/lib/types"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  attachments?: Array<{ type: "image" | "video"; url: string; analysis?: any }>
  petAnalysis?: PetHealthAnalysis
}

interface PetHealthAnalysis {
  petId: string
  overallStatus: "healthy" | "attention-needed" | "concerning" | "urgent"
  confidence: number
  findings: Array<{
    type: "behavior" | "physical" | "environmental"
    concern: string
    severity: "low" | "medium" | "high"
    recommendation: string
  }>
  moodAnalysis?: {
    dominantEmotion: string
    confidence: number
    emotions: Array<{ emotion: string; confidence: number }>
  }
  vitals?: {
    estimatedHeartRate?: number
    activityLevel?: "low" | "moderate" | "high"
    stressLevel?: "low" | "moderate" | "high"
  }
  recommendations: string[]
  followUpActions: string[]
  timestamp: Date
}

export default function AIPetAssistantPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("chat")

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login")
    } else if (!isAuthLoading && user) {
      fetchPets()
      // Add welcome message
      setMessages([{
        id: "1",
        content: "Hello! I'm your AI Pet Health Assistant. I can help analyze your pet's health through photos and videos, provide care recommendations, and track their wellbeing. How can I help you today?",
        sender: "ai",
        timestamp: new Date()
      }])
    }
  }, [user, isAuthLoading, router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchPets = async () => {
    if (!user) return
    try {
      const petsData = await api.get<Pet[]>(`/pets?ownerId=${user.id}`)
      setPets(petsData)
      if (petsData.length > 0) {
        setSelectedPet(petsData[0])
      }
    } catch (err) {
      console.error("Failed to fetch pets", err)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setUploadedFile(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        alert("Please upload an image or video file")
      }
    }
  }

  const analyzeMedia = async () => {
    if (!uploadedFile || !selectedPet) return

    setIsAnalyzing(true)
    const formData = new FormData()
    formData.append('file', uploadedFile)
    formData.append('petId', selectedPet.id)
    formData.append('petType', selectedPet.type)
    formData.append('petBreed', selectedPet.breed)
    formData.append('petAge', selectedPet.age.toString())

    try {
      // Simulate AI analysis - in real app, this would call your AI service
      const analysis = await simulateAIAnalysis(uploadedFile, selectedPet)
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: `I've analyzed the ${uploadedFile.type.startsWith('image/') ? 'image' : 'video'} of ${selectedPet.name}. Here's what I found:`,
        sender: "ai",
        timestamp: new Date(),
        attachments: [{
          type: uploadedFile.type.startsWith('image/') ? 'image' : 'video',
          url: previewUrl!,
          analysis
        }],
        petAnalysis: analysis
      }

      setMessages(prev => [...prev, aiMessage])
      
      // Clear upload
      setUploadedFile(null)
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error("Analysis failed", err)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "I'm sorry, I couldn't analyze the media. Please try again.",
        sender: "ai",
        timestamp: new Date()
      }])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const simulateAIAnalysis = async (file: File, pet: Pet): Promise<PetHealthAnalysis> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock AI analysis based on pet type and age
    const isYoung = pet.age < 2
    const isSenior = pet.age > 8
    
    return {
      petId: pet.id,
      overallStatus: isSenior ? "attention-needed" : "healthy",
      confidence: 85 + Math.random() * 10,
      findings: [
        {
          type: "behavior",
          concern: isSenior ? "Reduced activity level detected" : "Normal activity patterns",
          severity: isSenior ? "medium" : "low",
          recommendation: isSenior ? "Consider gentle exercise routines" : "Maintain current activity levels"
        },
        {
          type: "physical",
          concern: "Coat appears healthy and well-groomed",
          severity: "low",
          recommendation: "Continue regular grooming schedule"
        }
      ],
      moodAnalysis: {
        dominantEmotion: "content",
        confidence: 78,
        emotions: [
          { emotion: "content", confidence: 78 },
          { emotion: "calm", confidence: 65 },
          { emotion: "playful", confidence: 45 }
        ]
      },
      vitals: {
        activityLevel: isYoung ? "high" : isSenior ? "low" : "moderate",
        stressLevel: "low"
      },
      recommendations: [
        "Maintain regular feeding schedule",
        "Continue daily exercise appropriate for age",
        "Schedule regular veterinary checkups"
      ],
      followUpActions: [
        "Monitor activity levels over the next week",
        "Note any changes in appetite or behavior",
        "Schedule vet appointment if concerns persist"
      ],
      timestamp: new Date()
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const aiResponse = generateAIResponse(inputMessage, selectedPet)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error("Failed to send message", err)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (message: string, pet: Pet | null): string => {
    const petName = pet ? pet.name : "your pet"
    const responses = [
      `Based on what you've told me about ${petName}, I recommend monitoring their behavior closely. Every pet is unique, and changes in routine can indicate various things.`,
      `That's a great question about ${petName}! Remember that regular observation is key to maintaining their health. Keep track of any patterns you notice.`,
      `I understand your concern for ${petName}. It's always better to be cautious. If you notice any persistent changes, consulting with a veterinarian would be wise.`,
      `${petName} sounds like they're getting good care! Continue maintaining their routine and don't hesitate to ask if you notice anything unusual.`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-50 text-green-700 border-green-200"
      case "attention-needed": return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "concerning": return "bg-orange-50 text-orange-700 border-orange-200"
      case "urgent": return "bg-red-50 text-red-700 border-red-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "attention-needed": return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "concerning": return <AlertCircle className="h-4 w-4 text-orange-600" />
      case "urgent": return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bot className="h-8 w-8 text-blue-600" />
              AI Pet Health Assistant
            </h1>
            <p className="text-muted-foreground">
              Get AI-powered insights about your pet's health through photos and videos
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Pet Selection Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Pet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPet?.id === pet.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedPet(pet)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={pet.photo} alt={pet.name} />
                      <AvatarFallback>{pet.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{pet.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pet.breed} • {pet.age} years
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {pets.length === 0 && (
                <p className="text-sm text-muted-foreground">No pets registered</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Record Video
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Health Timeline
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">AI Assistant</span>
                  {selectedPet && (
                    <Badge variant="secondary">
                      Analyzing: {selectedPet.name}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  Online
                </div>
              </div>
            </CardHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mx-4">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="analyze">Analyze Media</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.sender === "ai" && (
                          <Avatar className="h-8 w-8 mt-1">
                            <Bot className="h-5 w-5 text-blue-600" />
                          </Avatar>
                        )}
                        <div className={`max-w-[70%] ${message.sender === "user" ? "order-first" : ""}`}>
                          <div
                            className={`rounded-lg p-3 ${
                              message.sender === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            
                            {/* Pet Analysis Results */}
                            {message.petAnalysis && (
                              <div className="mt-3 space-y-3">
                                <div className={`p-3 rounded-lg border ${getStatusColor(message.petAnalysis.overallStatus)}`}>
                                  <div className="flex items-center gap-2 mb-2">
                                    {getStatusIcon(message.petAnalysis.overallStatus)}
                                    <span className="font-medium">
                                      {message.petAnalysis.overallStatus.replace("-", " ").toUpperCase()}
                                    </span>
                                    <span className="text-xs opacity-75">
                                      {message.petAnalysis.confidence.toFixed(1)}% confidence
                                    </span>
                                  </div>
                                  
                                  {message.petAnalysis.moodAnalysis && (
                                    <div className="mb-2">
                                      <p className="text-xs font-medium mb-1">Mood Analysis:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {message.petAnalysis.moodAnalysis.emotions.map((emotion) => (
                                          <Badge
                                            key={emotion.emotion}
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {emotion.emotion} ({emotion.confidence.toFixed(0)}%)
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium">Key Findings:</p>
                                    {message.petAnalysis.findings.map((finding, idx) => (
                                      <div key={idx} className="text-xs">
                                        <span className="font-medium">• {finding.concern}</span>
                                        <p className="text-xs opacity-75 ml-4">{finding.recommendation}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Attachments */}
                            {message.attachments && message.attachments.map((attachment, idx) => (
                              <div key={idx} className="mt-2">
                                {attachment.type === "image" ? (
                                  <img
                                    src={attachment.url}
                                    alt="Uploaded image"
                                    className="rounded-lg max-w-full h-40 object-cover"
                                  />
                                ) : (
                                  <video
                                    src={attachment.url}
                                    controls
                                    className="rounded-lg max-w-full h-40"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 px-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {message.sender === "user" && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={user.avatar} alt={user.fullName} />
                            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="h-8 w-8 mt-1">
                          <Bot className="h-5 w-5 text-blue-600" />
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask about your pet's health..."
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      disabled={isLoading}
                    />
                    <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analyze" className="flex-1 mt-0">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {!selectedPet ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Please select a pet first to analyze their photos or videos.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                          {previewUrl ? (
                            <div className="space-y-4">
                              {uploadedFile?.type.startsWith('image/') ? (
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  className="max-w-full max-h-64 mx-auto rounded-lg"
                                />
                              ) : (
                                <video
                                  src={previewUrl}
                                  controls
                                  className="max-w-full max-h-64 mx-auto rounded-lg"
                                />
                              )}
                              <div className="flex gap-2 justify-center">
                                <Button onClick={analyzeMedia} disabled={isAnalyzing}>
                                  {isAnalyzing ? (
                                    <>
                                          <Loader size="sm" />
                                          Analyzing...
                                        </>
                                      ) : (
                                        <>
                                          <Stethoscope className="h-4 w-4 mr-2" />
                                          Analyze for {selectedPet.name}
                                        </>
                                      )}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setUploadedFile(null)
                                    setPreviewUrl(null)
                                    if (fileInputRef.current) {
                                      fileInputRef.current.value = ''
                                    }
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                              <div>
                                <p className="text-lg font-medium">Upload Photo or Video</p>
                                <p className="text-sm text-muted-foreground">
                                  Analyze {selectedPet.name}'s health status through images
                                </p>
                              </div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                              />
                              <Button asChild>
                                <label htmlFor="file-upload" className="cursor-pointer">
                                  <Camera className="h-4 w-4 mr-2" />
                                  Choose File
                                </label>
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                What I Can Detect
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Heart className="h-3 w-3 text-red-500" />
                                <span>Physical health indicators</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Activity className="h-3 w-3 text-blue-500" />
                                <span>Activity and energy levels</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Brain className="h-3 w-3 text-purple-500" />
                                <span>Emotional state and mood</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-3 w-3 text-green-500" />
                                <span>Potential health concerns</span>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Analysis Tips
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                              <p>• Use clear, well-lit photos</p>
                              <p>• Show your pet's face and body</p>
                              <p>• Capture normal behavior</p>
                              <p>• Include multiple angles if possible</p>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
