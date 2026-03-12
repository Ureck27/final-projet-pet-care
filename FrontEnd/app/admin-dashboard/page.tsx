"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { adminApi, caregiverApi, type User, Pet, TrainerRequest, DashboardStats, type CaregiverApplication } from "@/lib/api"
import { Loader } from "@/components/common/loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  PawPrint, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Trash2,
  Shield,
  Heart
} from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [trainerRequests, setTrainerRequests] = useState<TrainerRequest[]>([])
  const [caregiverApplications, setCaregiverApplications] = useState<CaregiverApplication[]>([])
  const [caregiverStats, setCaregiverStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login')
      return
    }

    if (user && user.role === 'admin') {
      fetchDashboardData()
    }
  }, [user, isLoading, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, usersData, petsData, requestsData, caregiverAppsData, caregiverStatsData] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getUsers(),
        adminApi.getPets(),
        adminApi.getTrainerRequests(),
        caregiverApi.getApplications(),
        caregiverApi.getStats()
      ])
      
      setStats(statsData)
      setUsers(usersData)
      setPets(petsData)
      setTrainerRequests(requestsData)
      setCaregiverApplications(caregiverAppsData)
      setCaregiverStats(caregiverStatsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      await adminApi.acceptTrainerRequest(requestId)
      fetchDashboardData()
    } catch (error) {
      console.error('Failed to approve request:', error)
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      await adminApi.rejectTrainerRequest(requestId)
      fetchDashboardData()
    } catch (error) {
      console.error('Error rejecting trainer request:', error)
    }
  }

  const handleApproveCaregiverApplication = async (applicationId: string) => {
    try {
      await caregiverApi.approveApplication(applicationId)
      fetchDashboardData()
    } catch (error) {
      console.error('Error approving caregiver application:', error)
    }
  }

  const handleRejectCaregiverApplication = async (applicationId: string) => {
    try {
      await caregiverApi.rejectApplication(applicationId)
      fetchDashboardData()
    } catch (error) {
      console.error('Error rejecting caregiver application:', error)
    }
  }

  const handleDeleteCaregiverApplication = async (applicationId: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await caregiverApi.deleteApplication(applicationId)
        fetchDashboardData()
      } catch (error) {
        console.error('Error deleting caregiver application:', error)
      }
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This will also delete all their pets.')) {
      try {
        await adminApi.deleteUser(userId)
        fetchDashboardData()
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }
  }

  const handleDeletePet = async (petId: string) => {
    if (confirm('Are you sure you want to delete this pet?')) {
      try {
        await petApi.deletePet(petId)
        fetchDashboardData()
      } catch (error) {
        console.error('Failed to delete pet:', error)
      }
    }
  }

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage users, pets, and trainer requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && caregiverStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
              <PawPrint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPets}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTrainers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Caregiver Apps</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{caregiverStats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">{caregiverStats.pendingApplications} pending</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingTrainerRequests}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Tables */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="pets">Pets</TabsTrigger>
          <TabsTrigger value="trainer-requests">Trainer Requests</TabsTrigger>
          <TabsTrigger value="caregiver-applications">Caregiver Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage registered users and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id || user.id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : user.role === 'trainer' ? 'secondary' : 'outline'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteUser(user._id || user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pets">
          <Card>
            <CardHeader>
              <CardTitle>All Pets</CardTitle>
              <CardDescription>View all registered pets in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Owner ID</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pets.map((pet) => (
                    <TableRow key={pet._id || pet.id}>
                      <TableCell className="font-medium">{pet.name}</TableCell>
                      <TableCell>{pet.type}</TableCell>
                      <TableCell>{pet.breed || 'N/A'}</TableCell>
                      <TableCell>{pet.age || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate">{pet.description || 'N/A'}</TableCell>
                      <TableCell>
                        {pet.image || pet.photo ? (
                          <img 
                            src={pet.image || pet.photo} 
                            alt={pet.name} 
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs">
                            No Image
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{pet.userId}</TableCell>
                      <TableCell>{new Date(pet.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeletePet(pet._id || pet.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainer-requests">
          <Card>
            <CardHeader>
              <CardTitle>Trainer Requests</CardTitle>
              <CardDescription>Review trainer applications with documents and images</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Certifications</TableHead>
                    <TableHead>Profile</TableHead>
                    <TableHead>Certificates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainerRequests.map((request) => (
                    <TableRow key={request._id || request.id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.phone || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.experience}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.certifications || 'N/A'}</TableCell>
                      <TableCell>
                        {request.profileImage ? (
                          <img 
                            src={request.profileImage} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                            No Image
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {request.certificateImages && request.certificateImages.length > 0 ? (
                            request.certificateImages.slice(0, 2).map((cert, index) => (
                              <img 
                                key={index}
                                src={cert} 
                                alt={`Certificate ${index + 1}`} 
                                className="w-8 h-8 rounded object-cover"
                              />
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">None</span>
                          )}
                          {request.certificateImages && request.certificateImages.length > 2 && (
                            <span className="text-xs text-gray-500">+{request.certificateImages.length - 2}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                        {request.status === 'accepted' && (
                          <Badge variant="default">Accepted</Badge>
                        )}
                        {request.status === 'rejected' && (
                          <Badge variant="destructive">Rejected</Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApproveRequest(request._id || request.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRejectRequest(request._id || request.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="caregiver-applications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Caregiver Applications
              </CardTitle>
              <CardDescription>Review and manage caregiver applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Pet Types</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caregiverApplications.map((application) => (
                    <TableRow key={application._id}>
                      <TableCell className="font-medium">{application.name}</TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{application.phone}</TableCell>
                      <TableCell>{application.location}</TableCell>
                      <TableCell className="max-w-xs truncate">{application.experience}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {application.petTypes.map((type, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            application.status === 'approved' ? 'default' : 
                            application.status === 'rejected' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {application.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleApproveCaregiverApplication(application._id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRejectCaregiverApplication(application._id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteCaregiverApplication(application._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
