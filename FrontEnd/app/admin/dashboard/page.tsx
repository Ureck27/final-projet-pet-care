'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, SystemApplication, authApi } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<SystemApplication[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await authApi.getMe();
        if (user && user.role === 'admin') {
          setIsAdmin(true);
          fetchApplications();
        } else {
          toast.error('Access Denied: Admins only');
          router.push('/');
        }
      } catch (error) {
        toast.error('Please login to access this page');
        router.push('/admin-login');
      }
    };
    checkAdmin();
  }, [router]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getApplications();
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string | undefined) => {
    if (!id) return;
    try {
      await adminApi.approveApplication(id);
      toast.success('Application approved successfully');
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: 'approved' } : app)),
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve application');
    }
  };

  const handleReject = async (id: string | undefined) => {
    if (!id) return;
    try {
      await adminApi.rejectApplication(id);
      toast.success('Application rejected');
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: 'rejected' } : app)),
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject application');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const filteredApps =
    activeTab === 'all' ? applications : applications.filter((a) => a.role === activeTab);

  return (
    <main className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage system applications and role requests.
            </p>
          </div>
          <Badge
            variant="outline"
            className="px-4 py-2 bg-primary/10 text-primary border-primary/20 w-fit"
          >
            <ShieldAlert className="w-4 h-4 mr-2" />
            Admin Privileges Active
          </Badge>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>System Applications</CardTitle>
                <CardDescription>Review and manage incoming requests from users.</CardDescription>
              </div>
              <Button onClick={fetchApplications} variant="outline" size="sm" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
              <div className="px-6 py-4 border-b border-border/50">
                <TabsList className="bg-muted/50 border border-border">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="owner">Owners</TabsTrigger>
                  <TabsTrigger value="caregiver">Caregivers</TabsTrigger>
                  <TabsTrigger value="trainer">Trainers</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="p-6 m-0 outline-none">
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : filteredApps.length === 0 ? (
                  <div className="text-center p-12 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No applications found in this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApps.map((app) => (
                      <Card
                        key={app._id}
                        className="flex flex-col border-border/50 hover:border-primary/30 transition-all shadow-sm hover:shadow-md h-full"
                      >
                        <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg line-clamp-1" title={app.name}>
                                {app.name}
                              </CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {app.email}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={
                                app.status === 'pending'
                                  ? 'outline'
                                  : app.status === 'approved'
                                    ? 'default'
                                    : 'destructive'
                              }
                              className={`capitalize ${app.status === 'approved' ? 'bg-success text-success-foreground' : app.status === 'pending' ? 'text-warning border-warning' : ''}`}
                            >
                              {app.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4 flex-grow">
                          <div className="mb-3">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Role Requested
                            </span>
                            <Badge
                              variant="secondary"
                              className="block w-fit mt-1 capitalize font-medium"
                            >
                              {app.role}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Message
                            </span>
                            <p className="text-sm line-clamp-4 leading-relaxed bg-muted/30 p-3 rounded-md border border-border/50 text-foreground/80">
                              {app.message}
                            </p>
                          </div>
                        </CardContent>
                        {app.status === 'pending' && (
                          <CardFooter className="pt-3 pb-4 px-4 flex gap-3 border-t border-border/50 bg-muted/10 mt-auto">
                            <Button
                              onClick={() => handleApprove(app._id)}
                              size="sm"
                              className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(app._id)}
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </CardFooter>
                        )}
                        {app.status !== 'pending' && (
                          <CardFooter className="pt-3 pb-4 px-4 border-t border-border/50 bg-muted/10 mt-auto flex-col items-center justify-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground mb-1" />
                            <p className="text-xs text-center w-full text-muted-foreground">
                              Processed
                            </p>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
