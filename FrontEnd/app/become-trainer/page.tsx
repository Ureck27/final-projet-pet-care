'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { trainerRequestApi } from '@/lib/api';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  UserCheck,
  Star,
  Award,
  Clock,
  Users,
  CheckCircle,
  ArrowLeft,
  Upload,
  Phone,
  FileText,
} from 'lucide-react';

export default function BecomeTrainerPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    experience: '',
    certifications: '',
    message: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [certificateImages, setCertificateImages] = useState<(File | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (user.role === 'trainer') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Already a Trainer
          </Badge>
          <h1 className="text-3xl font-bold mb-4">You're already a trainer!</h1>
          <p className="text-muted-foreground mb-6">
            You have already been approved as a trainer. You can access your trainer dashboard.
          </p>
          <Button onClick={() => router.push('/trainer-dashboard')}>Go to Trainer Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.phone.trim() ||
      !formData.experience.trim() ||
      !formData.certifications.trim() ||
      !formData.message.trim()
    ) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('certifications', formData.certifications);
      formDataToSend.append('message', formData.message);

      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      certificateImages.forEach((cert, index) => {
        if (cert) {
          formDataToSend.append(`certificateImage`, cert);
        }
      });

      await trainerRequestApi.createRequest(formDataToSend);

      setSubmitted(true);
    } catch (error: any) {
      setError(error.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Request Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Your trainer application has been submitted successfully. The admin team will review
            your application and get back to you soon.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              You will receive an email notification once your request has been reviewed. You can
              check the status of your application in your profile.
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => router.push('/dashboard')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Apply to Become a Trainer
              </CardTitle>
              <CardDescription>
                Share your experience, upload your documents, and tell us why you'd be a great
                addition to our trainer community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your experience with pets (e.g., '5 years of professional dog training, specialized in behavioral correction...')"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Textarea
                    id="certifications"
                    placeholder="List your professional certifications (e.g., 'Certified Professional Dog Trainer - CPDT-KA, Pet First Aid Certified...')"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Why do you want to join?</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us why you want to become a trainer on our platform and what makes you a good fit..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profile Image</Label>
                    <ImageUpload
                      onChange={(file) => setProfileImage(file)}
                      label="Upload Profile Photo"
                      placeholder="Click to upload or drag and drop"
                      accept="image/*"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Certificate Images</Label>
                    <p className="text-sm text-muted-foreground">
                      Upload your professional certificates (up to 3 files)
                    </p>
                    <div className="grid gap-4">
                      {certificateImages.map((cert, index) => (
                        <ImageUpload
                          key={index}
                          onChange={(file) => {
                            const newCerts = [...certificateImages];
                            newCerts[index] = file;
                            setCertificateImages(newCerts);
                          }}
                          label={`Certificate ${index + 1}`}
                          placeholder="Click to upload or drag and drop"
                          accept="image/*"
                        />
                      ))}
                      {certificateImages.length < 3 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCertificateImages([...certificateImages, null])}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Add Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader size="sm" className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Why Join Our Platform?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Access to Clients</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with pet owners looking for professional training services
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Build Your Reputation</h4>
                    <p className="text-sm text-muted-foreground">
                      Earn ratings and reviews to establish your credibility
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Flexible Schedule</h4>
                    <p className="text-sm text-muted-foreground">
                      Set your own availability and work on your terms
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Professional Growth</h4>
                    <p className="text-sm text-muted-foreground">
                      Join a community of professional pet trainers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Proven experience with pet training
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Professional certifications (preferred)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Good communication skills
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Passion for animal welfare
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    Valid certificates and documentation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
