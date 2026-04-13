'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { petApi, routineApi, getMediaUrl, type Pet } from '@/lib/api';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  UserCheck,
  Calendar,
  MessageCircle,
  Settings,
  PawPrint,
  ClipboardCheck,
  Camera,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function CaregiverDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [assignedPets, setAssignedPets] = useState<Pet[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'caregiver')) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'caregiver') {
      fetchCaregiverData();
    }
  }, [user, isLoading, router]);

  const fetchCaregiverData = async () => {
    try {
      setLoading(true);
      const [petsData, routinesData] = await Promise.all([
        petApi.getTrainerAssignedPets(),
        routineApi.getRoutines(),
      ]);
      setAssignedPets(petsData);
      setRoutines(routinesData);
    } catch (error) {
      console.error('Failed to fetch caregiver data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatWithUsers = () => {
    router.push('/chat');
  };

  const handleViewSchedule = () => {
    router.push('/schedule');
  };

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user || user.role !== 'caregiver') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You need caregiver privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  const pendingRoutines = routines.filter((r) => r.status === 'pending');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-primary" />
            Caregiver Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Your care support is valued.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleChatWithUsers}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Messages
          </Button>
          <Button variant="outline" onClick={() => router.push('/profile')}>
            <Settings className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedPets.length}</div>
            <p className="text-xs text-muted-foreground">Currently under your care</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRoutines.length}</div>
            <p className="text-xs text-muted-foreground">Due today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {routines.length > 0
                ? `${Math.round(((routines.length - pendingRoutines.length) / routines.length) * 100)}%`
                : '100%'}
            </div>
            <p className="text-xs text-muted-foreground">Of weekly goals</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed: Tasks & Updates */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today's Care Tasks</CardTitle>
                <CardDescription>Scheduled routines for your assigned pets</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={handleViewSchedule}>
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </CardHeader>
            <CardContent>
              {pendingRoutines.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground">No pending tasks for today!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRoutines.map((routine) => (
                    <div
                      key={routine._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={getMediaUrl(routine.petId?.image)} />
                          <AvatarFallback>{routine.petId?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{routine.taskName}</p>
                          <p className="text-sm text-muted-foreground">For {routine.petId?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium">
                            {new Date(routine.scheduledTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">Scheduled</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => router.push(`/routine/complete/${routine._id}`)}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Assigned Pets</CardTitle>
              <CardDescription>Direct access to pet profiles and status logs</CardDescription>
            </CardHeader>
            <CardContent>
              {assignedPets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No pets assigned yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {assignedPets.map((pet) => (
                    <div key={pet._id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar className="h-12 w-12 object-cover">
                        <AvatarImage src={getMediaUrl(pet.image)} />
                        <AvatarFallback>{pet.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{pet.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {pet.type} • {pet.age}y
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => router.push(`/pet-profile/${pet._id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Messages & Status */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Verification</span>
                  <Badge variant={user.status === 'accepted' ? 'default' : 'secondary'}>
                    {user.status || 'Pending'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg text-xs">
                  <AlertCircle className="h-4 w-4 text-primary shrink-0" />
                  <p>Remember to upload photos for all completed tasks to verify service.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                <p className="text-sm text-muted-foreground mb-4">
                  No unread messages from owners.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleChatWithUsers}
                >
                  Open Inbox
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
