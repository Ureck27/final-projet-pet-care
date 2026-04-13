'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { petApi, trainerApi, trainerRequestApi, type Pet, TrainerRequest } from '@/lib/api';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  FileText,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Eye,
} from 'lucide-react';

interface TrackingItem {
  id: string;
  type: 'pet' | 'trainer';
  title: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  rejectionReason?: string;
  progress: number;
  timeline: TimelineEvent[];
}

interface TimelineEvent {
  status: string;
  date: Date;
  description: string;
  icon: React.ReactNode;
}

export default function TrackingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [trackingItems, setTrackingItems] = useState<TrackingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchTrackingData();
    }
  }, [user, isLoading, router]);

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      const [petsData, trainerRequestData] = await Promise.all([
        petApi.getUserPets(),
        trainerRequestApi.getUserRequest(),
      ]);

      const items: TrackingItem[] = [];

      // Process pet applications
      petsData.forEach((pet: Pet) => {
        const timeline = generatePetTimeline(pet);
        items.push({
          id: pet._id || pet.id,
          type: 'pet',
          title: `Pet Application: ${pet.name}`,
          status: pet.status as 'pending' | 'accepted' | 'rejected',
          createdAt: new Date(pet.createdAt || Date.now()),
          updatedAt: new Date(pet.updatedAt || Date.now()),
          description: `${pet.type} - ${pet.age} years old`,
          progress: calculateProgress(pet.status),
          timeline,
        });
      });

      // Process trainer application (only if exists)
      if (trainerRequestData?.data) {
        const request = trainerRequestData.data;
        const timeline = generateTrainerTimeline(request);
        items.push({
          id: request._id || request.id,
          type: 'trainer',
          title: `Trainer Application: ${request.name}`,
          status: request.status as 'pending' | 'accepted' | 'rejected',
          createdAt: new Date(request.createdAt || Date.now()),
          updatedAt: new Date(request.updatedAt || Date.now()),
          description: `${request.experience} experience`,
          rejectionReason: request.rejectionReason,
          progress: calculateProgress(request.status),
          timeline,
        });
      }

      // Sort by creation date (newest first)
      items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setTrackingItems(items);
    } catch (error) {
      console.error('Failed to fetch tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePetTimeline = (pet: Pet): TimelineEvent[] => {
    const timeline: TimelineEvent[] = [
      {
        status: 'submitted',
        date: new Date(pet.createdAt || Date.now()),
        description: 'Pet application submitted',
        icon: <FileText className="h-4 w-4" />,
      },
    ];

    if (pet.status !== 'pending') {
      timeline.push({
        status: pet.status,
        date: new Date(pet.updatedAt || Date.now()),
        description:
          pet.status === 'accepted' ? 'Pet application approved' : 'Pet application rejected',
        icon:
          pet.status === 'accepted' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          ),
      });
    }

    return timeline;
  };

  const generateTrainerTimeline = (request: TrainerRequest): TimelineEvent[] => {
    const timeline: TimelineEvent[] = [
      {
        status: 'submitted',
        date: new Date(request.createdAt || Date.now()),
        description: 'Trainer application submitted',
        icon: <FileText className="h-4 w-4" />,
      },
    ];

    if (request.status !== 'pending') {
      timeline.push({
        status: request.status,
        date: new Date(request.updatedAt || Date.now()),
        description:
          request.status === 'accepted'
            ? 'Trainer application approved'
            : `Trainer application rejected${request.rejectionReason ? ': ' + request.rejectionReason : ''}`,
        icon:
          request.status === 'accepted' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          ),
      });
    }

    return timeline;
  };

  const calculateProgress = (status: string): number => {
    switch (status) {
      case 'pending':
        return 33;
      case 'accepted':
        return 100;
      case 'rejected':
        return 100;
      default:
        return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredItems = trackingItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to track your requests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Search className="h-8 w-8" />
          Request Tracking
        </h1>
        <p className="text-muted-foreground">
          Track the status of your pet and trainer applications
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trackingItems.length}</div>
            <p className="text-xs text-muted-foreground">All submitted requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trackingItems.filter((item) => item.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trackingItems.filter((item) => item.status === 'accepted').length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Tracking Items */}
      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? 'No applications match your search criteria.'
                  : "You haven't submitted any applications yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {item.type === 'pet' ? (
                        <FileText className="h-5 w-5 text-blue-500" />
                      ) : (
                        <UserCheck className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getStatusColor(item.status)}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(item.status)}
                      {item.status?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Timeline
                  </h4>
                  <div className="relative pl-6">
                    {item.timeline.map((event, index) => (
                      <div key={index} className="relative pb-4 last:pb-0">
                        {/* Timeline line */}
                        {index < item.timeline.length - 1 && (
                          <div className="absolute left-0 top-6 w-px h-full bg-border" />
                        )}

                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-background border-2 border-border flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>

                        {/* Timeline content */}
                        <div className="ml-6">
                          <div className="flex items-center gap-2 mb-1">
                            {event.icon}
                            <span className="font-medium text-sm capitalize">{event.status}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rejection Reason */}
                {item.status === 'rejected' && item.rejectionReason && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm font-medium text-destructive mb-1">Rejection Reason:</p>
                    <p className="text-sm text-muted-foreground">{item.rejectionReason}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (item.type === 'pet') {
                        router.push(`/pet-profile/${item.id}`);
                      } else {
                        router.push('/trainer-dashboard');
                      }
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  {item.status === 'rejected' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (item.type === 'pet') {
                          router.push('/add-pet');
                        } else {
                          router.push('/become-trainer');
                        }
                      }}
                    >
                      Submit New Application
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
