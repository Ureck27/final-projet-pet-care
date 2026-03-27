"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { adminApi, petApi, trainerApi, type User, Pet, Trainer } from "@/lib/api"
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
  Shield,
  Plus
} from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [requests, setRequests] = useState<any[]>([])
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
      const [petsData, trainersData, usersData, requestsData] = await Promise.all([
        petApi.getAllPets(),
        trainerApi.getTrainers(),
        adminApi.getUsers(),
        adminApi.getPendingRequests()
      ])

      setPets(petsData)
      setTrainers(trainersData)
      setUsers(usersData)
      setRequests(requestsData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (type: string, id: string) => {
    try {
      await adminApi.acceptRequest(type, id)
      fetchDashboardData()
    } catch (error) {
      console.error('Failed to accept request:', error)
    }
  }

  const handleRejectRequest = async (type: string, id: string) => {
    try {
      await adminApi.rejectRequest(type, id)
      fetchDashboardData()
    } catch (error) {
      console.error('Failed to reject request:', error)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminApi.deleteUser(id)
      fetchDashboardData()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleAddTrainer = async () => {
    router.push('/admin/add-trainer')
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pets.length}</div>
            <p className="text-xs text-muted-foreground">
              {pets.filter(p => p.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainers.length}</div>
            <p className="text-xs text-muted-foreground">Registered trainers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pets</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pets.filter(p => p.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="pets">Pets</TabsTrigger>
          <TabsTrigger value="trainers">Trainers</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Review and approve pending users, pets, and trainers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name/Title</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req, index) => (
                    <TableRow key={req._id || req.id || index}>
                      <TableCell className="capitalize font-medium">{req.requestType}</TableCell>
                      <TableCell>{req.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {req.requestType === 'user' && <p>{req.email}</p>}
                        {req.requestType === 'pet' && <p>{req.type} - {(req.userId as any)?.name}</p>}
                        {req.requestType === 'trainer' && <p>{req.email}</p>}
                      </TableCell>
                      <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAcceptRequest(req.requestType, req._id || req.id)}
                            title="Accept"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRejectRequest(req.requestType, req._id || req.id)}
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {requests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No pending requests.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u, index) => {
                    const status = u.status || 'accepted';
                    return (
                    <TableRow key={u._id || u.id || index}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell className="capitalize">{u.role}</TableCell>
                      <TableCell>
                         <Badge variant={status === 'accepted' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary'}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {status === 'pending' && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleAcceptRequest('user', u._id || u.id)}>
                                Accept
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleRejectRequest('user', u._id || u.id)}>
                                Reject
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteUser(u._id || u.id)}
                            disabled={user?._id === (u._id || u.id) || user?.id === (u._id || u.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pets">
          <Card>
            <CardHeader>
              <CardTitle>All Pets</CardTitle>
              <CardDescription>View all registered pets</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pets.map((pet, index) => (
                    <TableRow key={pet._id || pet.id || index}>
                      <TableCell>
                        <img src={pet.image || "/placeholder.svg"} alt={pet.name} className="h-10 w-10 rounded object-cover" />
                      </TableCell>
                      <TableCell className="font-medium">{pet.name}</TableCell>
                      <TableCell>{pet.type}</TableCell>
                      <TableCell>{(pet as any).userId?.name || 'Unknown'}</TableCell>
                      <TableCell>
                         <Badge variant={pet.status === 'accepted' ? 'default' : pet.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {pet.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Trainers</CardTitle>
                <CardDescription>Manage registered trainers</CardDescription>
              </div>
              <Button onClick={handleAddTrainer}>
                <Plus className="mr-2 h-4 w-4" />
                Add Trainer
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Services</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainers.map((trainer, index) => (
                    <TableRow key={trainer._id || trainer.id || index}>
                      <TableCell className="font-medium">{trainer.name}</TableCell>
                      <TableCell>{trainer.email}</TableCell>
                      <TableCell>
                        <Badge variant={trainer.status === 'accepted' ? 'default' : trainer.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {trainer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {trainer.services.map((service, serviceIndex) => (
                            <Badge key={serviceIndex} variant="outline" className="text-xs">
                              {typeof service === 'string' ? service : service.serviceName}
                            </Badge>
                          ))}
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
