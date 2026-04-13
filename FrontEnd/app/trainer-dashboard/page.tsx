'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { petApi, trainerApi, getMediaUrl, type User, Trainer, type Pet } from '@/lib/api';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Camera,
} from 'lucide-react';

export default function TrainerDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [trainerData, setTrainerData] = useState<Trainer | null>(null);
  const [assignedPets, setAssignedPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'trainer')) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'trainer') {
      fetchTrainerData();
    }
  }, [user, isLoading, router]);

  const fetchTrainerData = async () => {
    try {
      setLoading(true);
      const data = await trainerApi.getTrainerProfile();
      setTrainerData(data);
      try {
        const petsData = await petApi.getTrainerAssignedPets();
        setAssignedPets(petsData);
      } catch (err) {
        console.error('Failed to fetch assigned pets', err);
      }
    } catch (error) {
      console.error('Failed to fetch trainer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = () => {
    router.push('/trainer-profile');
  };

  const handleChatWithUsers = () => {
    router.push('/chat');
  };

  const handleManageSchedule = () => {
    router.push('/trainer-schedule');
  };

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user || user.role !== 'trainer') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need trainer privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCheck className="h-8 w-8" />
            Trainer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Manage your training services and clients.
          </p>
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Active Clients</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trainerData?.rating ? `${trainerData.rating}/5` : '4.8/5'}
                </div>
                <p className="text-xs text-muted-foreground">Recent feedback</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Experience</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trainerData?.experience || '5'} yrs</div>
                <p className="text-xs text-muted-foreground">Professional track</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignedPets.length}</div>
                <p className="text-xs text-muted-foreground">Pets in training</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,240</div>
                <p className="text-xs text-muted-foreground">Estimated this month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Next Sessions</CardTitle>
                <CardDescription>Upcoming training appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
                  <p className="text-muted-foreground">
                    No sessions scheduled for the next 24 hours.
                  </p>
                  <Button variant="link" onClick={handleManageSchedule}>
                    View Full Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Programs</CardTitle>
                <CardDescription>Quick overview of your training tracks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainerData?.services?.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <p className="font-medium text-sm">
                        {typeof service === 'string' ? service : service.serviceName}
                      </p>
                      <Badge variant="outline" className="text-[10px]">
                        Active
                      </Badge>
                    </div>
                  )) || <p className="text-sm text-center py-4">No active programs.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Managed Pets</CardTitle>
              <CardDescription>Direct access to your training clients</CardDescription>
            </CardHeader>
            <CardContent>
              {assignedPets.length === 0 ? (
                <div className="text-center py-12">
                  <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-10" />
                  <p className="text-muted-foreground">No pets currently assigned for training.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {assignedPets.map((pet) => (
                    <div
                      key={pet._id || pet.id}
                      className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/30 transition-colors"
                    >
                      <Avatar className="h-16 w-16 border">
                        <AvatarImage src={getMediaUrl(pet.image)} />
                        <AvatarFallback>{pet.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg">{pet.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {pet.type} • {pet.age} years
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="default"
                            className="h-8"
                            onClick={() => router.push(`/pet-update/${pet._id}`)}
                          >
                            Track Progress
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 shadow-none"
                            onClick={() => router.push(`/pet-profile/${pet._id}`)}
                          >
                            Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Training Programs</CardTitle>
                <CardDescription>Manage your specialized training tracks</CardDescription>
              </div>
              <Button size="sm" onClick={() => router.push('/new-program')}>
                <Plus className="mr-2 h-4 w-4" />
                New Program
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trainerData?.services?.map((service, index) => (
                  <Card key={index} className="bg-primary/5 border-primary/10">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">
                        {typeof service === 'string' ? service : service.serviceName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-muted-foreground mb-4">
                        Customized training track for pets.
                      </p>
                      <Button variant="outline" size="sm" className="w-full h-8 text-[11px]">
                        Edit Track
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your professional public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-3">Core Information</h4>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Display Name</p>
                      <p className="font-medium">{trainerData?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Professional Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-3">Qualifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {trainerData?.certifications?.map((cert, index) => (
                      <Badge key={index} variant="secondary">
                        {cert}
                      </Badge>
                    )) || (
                      <p className="text-xs text-muted-foreground">No certifications listed.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button onClick={handleViewProfile}>Update Public Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
