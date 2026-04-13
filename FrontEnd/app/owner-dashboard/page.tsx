'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { petApi, getMediaUrl, type User, Pet } from '@/lib/api';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  User as UserIcon,
  PawPrint,
  Calendar,
  Plus,
  Eye,
  MessageCircle,
  Settings,
  CreditCard,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { bookingApi } from '@/lib/api';

export default function OwnerDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'owner')) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'owner') {
      fetchUserData();
    }
  }, [user, isLoading, router]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [petsData, bookingsData] = await Promise.all([
        petApi.getUserPets(),
        bookingApi.getBookings(),
      ]);

      setPets(Array.isArray(petsData) ? petsData : petsData?.data || []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : bookingsData?.data || []);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = () => {
    router.push('/add-pet');
  };

  const handleViewPet = (petId: string) => {
    router.push(`/pet-profile/${petId}`);
  };

  const handleChatWithTrainer = () => {
    router.push('/chat');
  };

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user || user.role !== 'owner') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need owner privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserIcon className="h-8 w-8" />
            Owner Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Manage your pets and requests.
          </p>
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pets">My Pets</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Pets</CardTitle>
                <PawPrint className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pets.length}</div>
                <p className="text-xs text-muted-foreground">
                  {pets.filter((p) => p.status === 'accepted').length} approved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter((b) => b.status === 'confirmed').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {bookings.filter((b) => b.status === 'pending').length} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{user.status || 'Active'}</div>
                <Badge
                  variant={user.status === 'accepted' ? 'default' : 'secondary'}
                  className="mt-1"
                >
                  Verified
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Stay updated on your pets' status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pets.length > 0 ? (
                  <div className="text-sm text-muted-foreground italic">
                    All pet profiles are up to date.
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p>No recent activity found. Add a pet to get started!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pets">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Pets</CardTitle>
                <CardDescription>View and manage your pet registrations</CardDescription>
              </div>
              <Button size="sm" onClick={handleAddPet}>
                <Plus className="mr-2 h-4 w-4" />
                Add Pet
              </Button>
            </CardHeader>
            <CardContent>
              {pets.length === 0 ? (
                <div className="text-center py-12">
                  <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-semibold mb-2">No pets yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first pet to start using our services!
                  </p>
                  <Button onClick={handleAddPet}>Register a Pet</Button>
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pets.map((pet) => (
                      <TableRow key={pet._id || pet.id}>
                        <TableCell>
                          <img
                            src={getMediaUrl(pet.image)}
                            alt={pet.name}
                            className="h-10 w-10 rounded-lg object-cover border"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{pet.name}</TableCell>
                        <TableCell className="capitalize">{pet.type}</TableCell>
                        <TableCell>{pet.age} years</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              pet.status === 'accepted'
                                ? 'default'
                                : pet.status === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {pet.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPet(pet._id || pet.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Service Bookings</CardTitle>
                <CardDescription>Manage your care and training sessions</CardDescription>
              </div>
              <Button size="sm" onClick={() => router.push('/new-booking')}>
                <Plus className="mr-2 h-4 w-4" />
                New Booking
              </Button>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Book a session with one of our professionals today.
                  </p>
                  <Button variant="outline" onClick={() => router.push('/trainers')}>
                    Browse Caregivers
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking._id || booking.id}>
                        <TableCell className="font-medium">
                          {booking.service || 'Pet Care Session'}
                        </TableCell>
                        <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === 'confirmed'
                                ? 'default'
                                : booking.status === 'cancelled'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${booking.totalPrice || '0.00'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View your past transactions and invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
                <p className="text-muted-foreground">
                  Your transaction history will appear here once you book a service.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
