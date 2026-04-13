'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield,
  UserPlus,
  HeartHandshake,
  Dumbbell,
  Star,
  ChevronRight,
  Check,
} from 'lucide-react';
import { applicationApi } from '@/lib/api';
import { toast } from 'sonner';

export default function ApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'caregiver',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (val: string) => {
    setFormData((prev) => ({ ...prev, role: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await applicationApi.submitApplication(formData as any);
      setIsSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-primary/5">
        <Card className="max-w-md w-full shadow-2xl border-primary/20 bg-background/60 backdrop-blur-xl">
          <CardContent className="pt-12 pb-12 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
              <Check className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Application Received!</h2>
            <p className="text-muted-foreground mb-8">
              Thank you for applying as a {formData.role}. Our team will review your details and get
              back to you within 48 hours.
            </p>
            <Button
              onClick={() => (window.location.href = '/')}
              variant="outline"
              className="w-full items-center justify-center group text-primary border-primary hover:bg-primary hover:text-white transition-all"
            >
              Return Home
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background visual effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-primary/10 via-secondary/10 to-background z-0 pointer-events-none" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50 z-0 animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50 z-0 pointer-events-none" />

      <section className="relative z-10 pt-20 pb-10 border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm">
            <Shield className="mr-2 h-4 w-4" />
            Join Our Community
          </Badge>
          <h1 className="mb-6 text-balance text-4xl md:text-6xl font-extrabold tracking-tight">
            Apply to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Join Us
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Whether you&apos;re an experienced pet trainer, a loving caregiver, or a devoted pet
            owner wanting to join our exclusive network. Apply below to get started.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              { text: 'Verified Professionals', icon: Star },
              { text: 'Safe & Secure', icon: Shield },
              { text: 'Loving Environment', icon: HeartHandshake },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 bg-background shadow-sm rounded-full border border-border/50 text-sm font-medium"
              >
                <item.icon className="h-4 w-4 text-primary" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 relative z-10 flex justify-center">
        <Card className="w-full max-w-2xl shadow-xl border-border/60 bg-background/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-8 border-b border-border/50">
            <CardTitle className="text-2xl font-bold">Application Form</CardTitle>
            <CardDescription className="text-base mt-2">
              Fill out your details to submit your application for review.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="h-12 bg-background/50 border-primary/20 focus-visible:ring-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="h-12 bg-background/50 border-primary/20 focus-visible:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-sm font-semibold block">I want to apply as a:</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'owner', label: 'Pet Owner', icon: UserPlus, desc: 'Join network' },
                    {
                      id: 'caregiver',
                      label: 'Caregiver',
                      icon: HeartHandshake,
                      desc: 'Provide care',
                    },
                    { id: 'trainer', label: 'Trainer', icon: Dumbbell, desc: 'Train pets' },
                  ].map((role) => (
                    <label
                      key={role.id}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.role === role.id
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]'
                          : 'border-border/50 hover:border-primary/50 hover:bg-background/80 bg-background/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.id}
                        checked={formData.role === role.id}
                        onChange={() => handleRoleChange(role.id)}
                        className="sr-only"
                      />
                      <role.icon
                        className={`w-8 h-8 mb-3 ${formData.role === role.id ? 'text-primary' : 'text-muted-foreground'}`}
                      />
                      <span
                        className={`font-bold ${formData.role === role.id ? 'text-foreground' : 'text-muted-foreground'}`}
                      >
                        {role.label}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1 text-center">
                        {role.desc}
                      </span>

                      {formData.role === role.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="message" className="text-sm font-semibold">
                  Why do you want to join? (Message / Motivation)
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us a little bit about yourself, your experience, and why you're a great fit..."
                  className="min-h-[150px] bg-background/50 border-primary/20 focus-visible:ring-primary/50 transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 text-primary-foreground">
                    Processing<span className="animate-pulse">...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-primary-foreground">
                    Submit Application{' '}
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
