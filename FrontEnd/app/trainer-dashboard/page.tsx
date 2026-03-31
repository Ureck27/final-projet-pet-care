"use client"

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { petApi, trainerApi, type User, Trainer, type Pet } from "@/lib/api"
import { Loader } from "@/components/common/loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  UserCheck, 
  Calendar,
  MessageCircle,
  Users,
  Star,
  Settings,
  Plus,
  PawPrint,
  DollarSign,
  ClipboardCheck,
  Camera
} from "lucide-react"

export default function TrainerDashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [trainerData, setTrainerData] = useState<Trainer | null>(null)
  const [assignedPets, setAssignedPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'trainer')) {
      router.push('/login')
      return
    }

    if (user && user.role === 'trainer') {
      fetchTrainerData()
    }
  }, [user, isLoading, router])

  const fetchTrainerData = async () => {
    try {
      setLoading(true)
      const data = await trainerApi.getTrainerProfile()
      setTrainerData(data)
      try {
        const petsData = await petApi.getTrainerAssignedPets()
        setAssignedPets(petsData)
      } catch (err) {
        console.error('Failed to fetch assigned pets', err)
      }
    } catch (error) {
      console.error('Failed to fetch trainer data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewProfile = () => {
    router.push('/trainer-profile')
  }

  const handleChatWithUsers = () => {
    router.push('/chat')
  }

  const handleManageSchedule = () => {
    router.push('/trainer-schedule')
  }

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!user || user.role !== 'trainer') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need trainer privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCheck className="h-8 w-8" />
            Trainer Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user.name}! Manage your training services and clients.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleChatWithUsers}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Messages
          </Button>
          <Button onClick={handleViewProfile}>
            <Settings className="mr-2 h-4 w-4" />
            Profile Settings
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Trainer Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge 
              variant={user.status === 'accepted' ? 'default' : user.status === 'rejected' ? 'destructive' : 'secondary'}
              className="text-sm px-3 py-1"
            >
              {user.status?.toUpperCase() || 'PENDING'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {user.status === 'accepted' 
                ? 'Your trainer account is approved. You can accept clients and provide services.'
                : user.status === 'rejected'
                ? 'Your trainer application has been rejected. Please contact support.'
                : 'Your trainer application is pending review.'
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainerData?.rating ? `${trainerData.rating}/5` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Client rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainerData?.experience || '0'} yrs
            </div>
            <p className="text-xs text-muted-foreground">Professional experience</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainerData?.services?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Services offered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user.status}</div>
            <p className="text-xs text-muted-foreground">
              Since {new Date(user.createdAt || Date.now()).getFullYear()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trainer Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your trainer profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="font-medium">{trainerData?.name || user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Experience</label>
              <p className="font-medium">{trainerData?.experience || 'Not specified'} years</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Certifications</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {trainerData?.certifications?.map((cert, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                )) || <span className="text-muted-foreground">No certifications listed</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services Offered</CardTitle>
            <CardDescription>Your available training services</CardDescription>
          </CardHeader>
          <CardContent>
            {trainerData?.services && trainerData.services.length > 0 ? (
              <div className="space-y-3">
                {trainerData.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {typeof service === 'string' ? service : service.serviceName}
                      </p>
                      {typeof service !== 'string' && service.price && (
                        <p className="text-sm text-muted-foreground">
                          ${service.price} {service.priceType || 'per session'}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline">
                      {typeof service !== 'string' && service.isActive !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No services yet</h3>
                <p className="text-muted-foreground mb-4">Add your first service to start accepting clients.</p>
                <Button onClick={handleManageSchedule}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Services
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assigned Pets Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-primary" />
            Assigned Pets
          </h2>
        </div>
        
        {assignedPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedPets.map(pet => (
              <Card key={pet._id || pet.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                      <AvatarImage src={pet.image} alt={pet.name} className="object-cover" />
                      <AvatarFallback className="bg-primary/5 text-primary">{pet.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <CardTitle className="text-lg truncate">{pet.name}</CardTitle>
                      <CardDescription>{pet.type} • {pet.age} years</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="default" className="w-full mt-4 bg-primary/90 hover:bg-primary" onClick={() => router.push(`/pet-update/${pet._id || pet.id}`)}>
                    <Camera className="mr-2 h-4 w-4" />
                    Add Status Update
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <PawPrint className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Pets Assigned</h3>
              <p className="text-muted-foreground text-center">You haven't been assigned any pets yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and management options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col" onClick={handleViewProfile}>
              <Settings className="h-6 w-6 mb-2" />
              Edit Profile
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={handleManageSchedule}>
              <Calendar className="h-6 w-6 mb-2" />
              Manage Schedule
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={handleChatWithUsers}>
              <MessageCircle className="h-6 w-6 mb-2" />
              Messages
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
