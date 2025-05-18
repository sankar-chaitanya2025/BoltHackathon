'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Video, Copy, CalendarDays, Users, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [meetings, setMeetings] = useState([
    {
      id: 'abcd-1234-efgh-5678',
      title: 'Weekly Team Sync',
      date: new Date().toISOString(),
      participants: 5
    },
    {
      id: 'ijkl-9012-mnop-3456',
      title: 'Project Planning',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      participants: 3
    }
  ]);
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const createMeeting = () => {
    const newMeeting = {
      id: Math.random().toString(36).substring(2, 15),
      title: meetingTitle || 'New Meeting',
      date: new Date().toISOString(),
      participants: 0
    };

    setMeetings([newMeeting, ...meetings]);
    setMeetingTitle('');
    setIsDialogOpen(false);
    
    router.push(`/meeting/${newMeeting.id}`);
  };

  const joinMeeting = (id: string) => {
    router.push(`/meeting/${id}`);
  };

  const copyMeetingLink = (id: string) => {
    const link = `${window.location.origin}/meeting/${id}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied!",
      description: "Meeting link has been copied to clipboard.",
    });
  };

  if (loading || !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-xl">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-lg text-muted-foreground mt-1">Manage your meetings and join conversations</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  New Meeting
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Meeting</DialogTitle>
                  <DialogDescription>
                    Enter a title for your meeting to get started.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="meetingTitle" className="mb-2 block">
                    Meeting Title
                  </Label>
                  <Input
                    id="meetingTitle"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="Weekly Team Meeting"
                    className="w-full"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createMeeting}>
                    Create & Join
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 border-dashed border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]" onClick={() => setIsDialogOpen(true)}>
              <div className="rounded-full bg-primary/10 p-3 mb-4 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl mb-2">Start a new meeting</CardTitle>
              <CardDescription>Create a new meeting and invite others</CardDescription>
            </CardContent>
          </Card>

          {meetings.map((meeting) => (
            <Card key={meeting.id} className="overflow-hidden group hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2 text-primary" />
                  {meeting.title}
                </CardTitle>
                <CardDescription className="flex items-center mt-2">
                  <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
                  {new Date(meeting.date).toLocaleDateString()}
                  <Clock className="h-4 w-4 ml-3 mr-1 text-muted-foreground" />
                  {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {meeting.participants} {meeting.participants === 1 ? 'participant' : 'participants'}
                </div>
                <div className="mt-2 bg-muted/50 rounded p-2 text-xs font-mono text-muted-foreground truncate">
                  {meeting.id}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => copyMeetingLink(meeting.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button size="sm" onClick={() => joinMeeting(meeting.id)}>
                  Join
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}