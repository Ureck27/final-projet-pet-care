"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { petApi, type Pet } from "@/lib/api"
import { Loader } from "@/components/common/loader"
import { CameraCapture } from "@/components/common/camera-capture"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Camera, 
  Video, 
  FileText, 
  Upload,
  ArrowLeft,
  Save,
  Eye,
  Calendar,
  MapPin,
  Heart
} from "lucide-react"

interface PetUpdate {
  id: string
  type: 'photo' | 'video' | 'note'
  content: string
  description?: string
  createdAt: Date
  trainer: string
  location?: string
  mood?: string
}

export default function PetUpdatePage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading } = useAuth()
  const [pet, setPet] = useState<Pet | null>(null)
  const [existingUpdates, setExistingUpdates] = useState<PetUpdate[]>([])
  const [updateType, setUpdateType] = useState<'photo' | 'video' | 'note'>('photo')
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [mood, setMood] = useState("")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const petId = params.petId as string
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }

    if (user && user.role !== 'trainer') {
      router.push('/unauthorized')
      return
    }

    if (user && petId) {
      fetchPetData()
    }
  }, [user, isLoading, router, petId])

  const fetchPetData = async () => {
    try {
      setLoading(true)
      const [petData, updatesData] = await Promise.all([
        petApi.getPetById(petId),
        petApi.getPetStatusUpdates(petId)
      ])

      setPet(petData)
      setExistingUpdates(updatesData.data || [])
    } catch (error) {
      console.error('Failed to fetch pet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (type === 'photo' && !file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
      alert('Please select a video file')
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB')
      return
    }

    setMediaFile(file)
    setUpdateType(type)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setMediaPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCameraCapture = (file: File) => {
    setMediaFile(file)
    setUpdateType('photo')
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setMediaPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!pet) return

    // Validation
    if (updateType !== 'note' && !mediaFile) {
      alert('Please select a file to upload')
      return
    }

    if (!description.trim()) {
      alert('Please add a description for this update')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('petId', petId)
      formData.append('type', updateType)
      formData.append('description', description)
      formData.append('location', location)
      formData.append('mood', mood)
      
      if (mediaFile) {
        formData.append('media', mediaFile)
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await petApi.createPetUpdate(formData)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Add new update to existing updates
      const newUpdate: PetUpdate = {
        id: response.data._id || response.data.id,
        type: updateType,
        content: mediaPreview || response.data.content || '',
        description,
        createdAt: new Date(),
        trainer: user?.name || '',
        location,
        mood
      }

      setExistingUpdates(prev => [newUpdate, ...prev])
      
      // Reset form
      setDescription("")
      setLocation("")
      setMood("")
      setMediaFile(null)
      setMediaPreview("")
      setUploadProgress(0)
      
      alert('Pet update posted successfully!')
    } catch (error) {
      console.error('Failed to create pet update:', error)
      alert('Failed to post update. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'photo':
        return 'bg-blue-100 text-blue-800'
      case 'video':
        return 'bg-green-100 text-green-800'
      case 'note':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <Camera className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      case 'note':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pet Not Found</h1>
          <p className="text-muted-foreground mb-4">This pet doesn't exist or you don't have access.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pet Profile
        </Button>
        
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={pet.image} alt={pet.name} />
            <AvatarFallback>{pet.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Add Status Update</h1>
            <p className="text-muted-foreground">{pet.name} • {pet.type}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Update Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Create New Update</CardTitle>
              <CardDescription>Share a photo, video, or note about {pet.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Update Type Selection */}
              <div>
                <Label className="text-base font-medium">Update Type</Label>
                <Tabs value={updateType} onValueChange={(value) => setUpdateType(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="photo" className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Photo
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video
                    </TabsTrigger>
                    <TabsTrigger value="note" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Note
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Media Upload */}
              {updateType !== 'note' && (
                <div>
                  <Label className="text-base font-medium">
                    {updateType === 'photo' ? 'Photo' : 'Video'}
                  </Label>
                  <div className="mt-2">
                    <input
                      ref={updateType === 'photo' ? fileInputRef : videoInputRef}
                      type="file"
                      accept={updateType === 'photo' ? 'image/*' : 'video/*'}
                      onChange={(e) => handleFileSelect(e, updateType)}
                      className="hidden"
                    />
                    
                    {mediaPreview ? (
                      <div className="relative">
                        {updateType === 'photo' ? (
                          <img 
                            src={mediaPreview} 
                            alt="Preview" 
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        ) : (
                          <video 
                            src={mediaPreview} 
                            className="w-full h-64 object-cover rounded-lg"
                            controls
                          />
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setMediaFile(null)
                            setMediaPreview("")
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div 
                          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                          onClick={() => {
                            if (updateType === 'photo') {
                              fileInputRef.current?.click()
                            } else {
                              videoInputRef.current?.click()
                            }
                          }}
                        >
                          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-lg font-medium mb-2">
                            {updateType === 'photo' ? 'Upload Photo' : 'Upload Video'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {updateType === 'photo' 
                              ? 'Click to select an image file (JPG, PNG, etc.)'
                              : 'Click to select a video file (MP4, MOV, etc.)'
                            }
                          </p>
                        </div>

                        {updateType === 'photo' && (
                          <div className="flex items-center justify-center gap-4">
                            <div className="h-px bg-muted-foreground/20 flex-1" />
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">or</span>
                            <div className="h-px bg-muted-foreground/20 flex-1" />
                          </div>
                        )}

                        {updateType === 'photo' && (
                          <div className="flex justify-center">
                            <CameraCapture 
                              onCapture={handleCameraCapture} 
                              buttonText="Take Picture with Camera"
                              className="w-full sm:w-auto bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary h-12 px-8"
                            />
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground text-center mt-2">
                          Maximum file size: 50MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what's happening with the pet..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-base font-medium">
                    Location (Optional)
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Where is the pet?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 mt-2"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="mood" className="text-base font-medium">
                    Mood (Optional)
                  </Label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mood"
                      placeholder="How is the pet feeling?"
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      className="pl-10 mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit} 
                disabled={uploading || (!description.trim() && updateType !== 'note')}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Post Update
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Existing Updates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>Previous status updates for {pet.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {existingUpdates.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No updates yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {existingUpdates.slice(0, 5).map((update) => (
                    <div key={update.id} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(update.type)}>
                          {getStatusIcon(update.type)}
                          <span className="ml-1 capitalize">{update.type}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {update.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      
                      {update.content && update.type !== 'note' && (
                        <div className="mb-2">
                          {update.type === 'photo' ? (
                            <img 
                              src={update.content} 
                              alt="Update" 
                              className="w-full h-32 object-cover rounded"
                            />
                          ) : (
                            <video 
                              src={update.content} 
                              className="w-full h-32 object-cover rounded"
                              controls
                            />
                          )}
                        </div>
                      )}
                      
                      <p className="text-sm">{update.description}</p>
                      
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>By {update.trainer}</span>
                        {update.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {update.location}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {existingUpdates.length > 5 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => router.push(`/pet-profile/${petId}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View All Updates
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
