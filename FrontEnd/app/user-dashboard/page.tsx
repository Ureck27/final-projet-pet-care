"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { petApi, type User, Pet } from "@/lib/api"
import { Loader } from "@/components/common/loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  User as UserIcon, 
  PawPrint, 
  Calendar,
  Plus,
  Eye,
  MessageCircle,
  Settings
} from "lucide-react"

export default function UserDashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'user')) {
      router.push('/login')
      return
    }

    if (user && user.role === 'user') {
      fetchUserData()
    }
  }, [user, isLoading, router])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const petsData = await petApi.getUserPets()
      setPets(petsData)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPet = () => {
    router.push('/add-pet')
  }

  const handleViewPet = (petId: string) => {
    router.push(`/pet-profile/${petId}`)
  }

  const handleChatWithTrainer = () => {
    router.push('/chat')
  }

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!user || user.role !== 'user') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need user privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserIcon className="h-8 w-8" />
            User Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user.name}! Manage your pets and requests.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleChatWithTrainer}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Messages
          </Button>
          <Button onClick={handleAddPet}>
            <Plus className="mr-2 h-4 w-4" />
            Add Pet
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Status
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
                ? 'Your account is approved. You can add pets and interact with trainers.'
                : user.status === 'rejected'
                ? 'Your account has been rejected. Please contact support.'
                : 'Your account is pending approval.'
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pets.length}</div>
            <p className="text-xs text-muted-foreground">
              {pets.filter(p => p.status === 'accepted').length} approved
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pets</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pets.filter(p => p.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user.status}</div>
            <p className="text-xs text-muted-foreground">
              Member since {new Date(user.createdAt || Date.now()).getFullYear()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* My Pets Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Pets</CardTitle>
          <CardDescription>View and manage your pet applications</CardDescription>
        </CardHeader>
        <CardContent>
          {pets.length === 0 ? (
            <div className="text-center py-8">
              <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No pets yet</h3>
              <p className="text-muted-foreground mb-4">Add your first pet to get started!</p>
              <Button onClick={handleAddPet}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Pet
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pets.map((pet, index) => (
                  <TableRow key={pet._id || pet.id || index}>
                    <TableCell>
                      <img 
                        src={pet.image || "/placeholder.svg"} 
                        alt={pet.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{pet.name}</TableCell>
                    <TableCell>{pet.type}</TableCell>
                    <TableCell>{pet.age} years</TableCell>
                    <TableCell>
                      <Badge variant={pet.status === 'accepted' ? 'default' : pet.status === 'rejected' ? 'destructive' : 'secondary'}>
                        {pet.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(pet.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewPet(pet._id || pet.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
