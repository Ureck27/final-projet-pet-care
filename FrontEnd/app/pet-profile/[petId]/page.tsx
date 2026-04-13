'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { petApi, getMediaUrl, type Pet, User } from '@/lib/api';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  PawPrint,
  Calendar,
  Heart,
  MessageCircle,
  Edit,
  ArrowLeft,
  Camera,
  Video,
  FileText,
  User as UserIcon,
} from 'lucide-react';

interface PetStatusUpdate {
  id: string;
  type: 'photo' | 'video' | 'note';
  content: string;
  description?: string;
  createdAt: Date;
  trainer?: string;
}

export default function PetProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<PetStatusUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  const petId = params.petId as string;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && petId) {
      fetchPetData();
    }
  }, [user, isLoading, router, petId]);

  const fetchPetData = async () => {
    try {
      setLoading(true);
      const [petData, ownerData, updatesData] = await Promise.all([
        petApi.getPetById(petId),
        petApi.getPetOwner(petId),
        petApi.getPetStatusUpdates(petId),
      ]);

      setPet(petData);
      setOwner(ownerData);
      setStatusUpdates(updatesData);
    } catch (error) {
      console.error('Failed to fetch pet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactTrainer = () => {
    router.push(`/chat?petId=${petId}`);
  };

  const handleEditPet = () => {
    router.push(`/edit-pet/${petId}`);
  };

  const handleAddUpdate = () => {
    router.push(`/pet-update/${petId}`);
  };

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pet Not Found</h1>
          <p className="text-muted-foreground mb-4">
            This pet profile doesn't exist or you don't have access.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <PawPrint className="h-8 w-8" />
              {pet.name}
            </h1>
            <p className="text-muted-foreground">Pet profile and status updates</p>
          </div>

          <div className="flex gap-2">
            {user?.role === 'trainer' && (
              <Button onClick={handleAddUpdate}>
                <Camera className="mr-2 h-4 w-4" />
                Add Update
              </Button>
            )}
            {user?.role === 'owner' && pet.userId === user.id && (
              <Button variant="outline" onClick={handleEditPet}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Pet
              </Button>
            )}
            {user?.role === 'owner' && (
              <Button onClick={handleContactTrainer}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Trainer
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Pet Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge
              variant={
                pet.status === 'accepted'
                  ? 'default'
                  : pet.status === 'rejected'
                    ? 'destructive'
                    : 'secondary'
              }
              className="text-sm px-3 py-1"
            >
              {pet.status?.toUpperCase() || 'PENDING'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {pet.status === 'accepted'
                ? 'This pet has been approved and can receive care services.'
                : pet.status === 'rejected'
                  ? 'This pet application has been rejected.'
                  : 'This pet application is pending review.'}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pet Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pet Information</CardTitle>
              <CardDescription>Basic details about {pet.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="font-semibold text-lg">{pet.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <p className="font-medium">{pet.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Age</label>
                    <p className="font-medium">{pet.age} years old</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Breed</label>
                    <p className="font-medium">{pet.breed || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Weight</label>
                    <p className="font-medium">
                      {pet.weight ? `${pet.weight} kg` : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Added</label>
                    <p className="font-medium">
                      {new Date(pet.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {pet.description && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1 text-sm leading-relaxed">{pet.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Updates Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Status Updates
              </CardTitle>
              <CardDescription>Latest updates and activities</CardDescription>
            </CardHeader>
            <CardContent>
              {statusUpdates.length === 0 ? (
                <div className="text-center py-8">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No updates yet</h3>
                  <p className="text-muted-foreground">
                    {user?.role === 'trainer'
                      ? 'Add your first status update to keep the owner informed.'
                      : 'Status updates will appear here once trainers start caring for this pet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {statusUpdates.map((update) => (
                    <div key={update.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {update.type === 'photo' && <Camera className="h-5 w-5 text-blue-500" />}
                        {update.type === 'video' && <Video className="h-5 w-5 text-green-500" />}
                        {update.type === 'note' && <FileText className="h-5 w-5 text-orange-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium capitalize">{update.type} Update</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(update.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {update.description && (
                          <p className="text-sm text-muted-foreground mb-2">{update.description}</p>
                        )}
                        {update.content && (
                          <div className="mt-2">
                            {update.type === 'photo' && (
                              <img
                                src={getMediaUrl(update.content)}
                                alt="Pet update"
                                className="rounded-lg max-w-full h-auto"
                              />
                            )}
                            {update.type === 'video' && (
                              <video
                                src={getMediaUrl(update.content)}
                                controls
                                className="rounded-lg max-w-full h-auto"
                              />
                            )}
                            {update.type === 'note' && <p className="text-sm">{update.content}</p>}
                          </div>
                        )}
                        {update.trainer && (
                          <p className="text-xs text-muted-foreground mt-2">By {update.trainer}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pet Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square">
                <img
                  src={getMediaUrl(pet.image)}
                  alt={pet.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Owner Information */}
          {owner && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={getMediaUrl((owner as any).avatar)} alt={owner.name} />
                    <AvatarFallback>{owner.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{owner.name}</p>
                    <p className="text-sm text-muted-foreground">{owner.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className="text-xs">
                      {owner.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Member Since</span>
                    <span>{new Date(owner.createdAt || Date.now()).getFullYear()}</span>
                  </div>
                </div>
                {user?.role === 'trainer' && (
                  <Button className="w-full mt-4" onClick={handleContactTrainer}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Owner
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {user?.role === 'owner' && (
                <Button variant="outline" className="w-full" onClick={handleContactTrainer}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message Trainer
                </Button>
              )}
              {user?.role === 'trainer' && (
                <Button variant="outline" className="w-full" onClick={handleAddUpdate}>
                  <Camera className="mr-2 h-4 w-4" />
                  Add Update
                </Button>
              )}
              {user?.role === 'owner' && pet.userId === user.id && (
                <Button variant="outline" className="w-full" onClick={handleEditPet}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Information
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
