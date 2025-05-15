'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import VideoGrid from '@/components/meeting/VideoGrid';
import ChatPanel from '@/components/meeting/ChatPanel';
import ControlBar from '@/components/meeting/ControlBar';
import ParticipantsList from '@/components/meeting/ParticipantsList';
import { Message, User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for demo purposes
const mockUsers: User[] = [
  { id: '1', email: 'john@example.com', name: 'John Doe' },
  { id: '2', email: 'jane@example.com', name: 'Jane Smith' },
  { id: '3', email: 'mike@example.com', name: 'Mike Johnson' },
  { id: '4', email: 'sarah@example.com', name: 'Sarah Williams' },
];

export default function MeetingRoom() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const meetingId = params.id as string;

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | undefined>(undefined);
  
  // Mock data for demo
  const [participants, setParticipants] = useState<{
    user: User;
    stream?: MediaStream;
    isMuted: boolean;
    isVideoOff: boolean;
    isLocal?: boolean;
    isActive?: boolean;
  }[]>([]);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello everyone! Welcome to the meeting.',
      user_id: '2',
      meeting_id: meetingId,
      created_at: new Date(Date.now() - 600000).toISOString(),
      user: mockUsers[1],
    },
    {
      id: '2',
      content: 'Hi Jane! Thanks for organizing this.',
      user_id: '3',
      meeting_id: meetingId,
      created_at: new Date(Date.now() - 540000).toISOString(),
      user: mockUsers[2],
    },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    // Initialize mock participants
    if (user) {
      const mockParticipants = [
        {
          user: user,
          stream: localStream,
          isMuted: isMuted,
          isVideoOff: isVideoOff,
          isLocal: true,
          isActive: true,
        },
        ...mockUsers.slice(0, 3).map((mockUser) => ({
          user: mockUser,
          stream: undefined,
          isMuted: Math.random() > 0.5,
          isVideoOff: Math.random() > 0.5,
          isLocal: false,
          isActive: false,
        })),
      ];
      setParticipants(mockParticipants);
    }
  }, [user, loading, router, localStream, isMuted, isVideoOff]);

  useEffect(() => {
    // Initialize local video stream
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    if (user) {
      initLocalStream();
    }

    return () => {
      // Clean up local stream
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [user]);

  const handleToggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const handleToggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      // Return to camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        setIsScreenSharing(false);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    } else {
      // Share screen
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        setLocalStream(stream);
        setIsScreenSharing(true);
        
        // When user stops screen sharing
        stream.getVideoTracks()[0].onended = async () => {
          try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });
            setLocalStream(cameraStream);
            setIsScreenSharing(false);
          } catch (error) {
            console.error('Error accessing media devices:', error);
          }
        };
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    }
  };

  const handleLeaveCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    router.push('/dashboard');
  };

  const handleSendMessage = (content: string) => {
    if (user) {
      const newMessage: Message = {
        id: uuidv4(),
        content,
        user_id: user.id,
        meeting_id: meetingId,
        created_at: new Date().toISOString(),
        user,
      };
      setMessages([...messages, newMessage]);
    }
  };

  const toggleSidebar = (sidebar: 'chat' | 'participants') => {
    if (sidebar === 'chat') {
      setIsChatOpen(!isChatOpen);
      if (!isChatOpen) setIsParticipantsOpen(false);
    } else {
      setIsParticipantsOpen(!isParticipantsOpen);
      if (!isParticipantsOpen) setIsChatOpen(false);
    }
  };

  if (loading || !user) {
    return (
      <MainLayout hideFooter>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-xl">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideFooter>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 flex overflow-hidden">
          <div className={`flex-1 p-4 ${isChatOpen || isParticipantsOpen ? 'md:pr-0' : ''}`}>
            <VideoGrid participants={participants} />
          </div>
          
          {isChatOpen && (
            <div className="w-full md:w-80 h-full bg-background">
              <ChatPanel 
                messages={messages} 
                currentUser={user} 
                onSendMessage={handleSendMessage}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          )}
          
          {isParticipantsOpen && (
            <div className="w-full md:w-80 h-full bg-background">
              <ParticipantsList 
                participants={participants}
                onClose={() => setIsParticipantsOpen(false)}
              />
            </div>
          )}
        </div>
        
        <ControlBar
          onToggleAudio={handleToggleAudio}
          onToggleVideo={handleToggleVideo}
          onToggleChat={() => toggleSidebar('chat')}
          onToggleParticipants={() => toggleSidebar('participants')}
          onScreenShare={handleScreenShare}
          onLeaveCall={handleLeaveCall}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          isChatOpen={isChatOpen}
          isParticipantsOpen={isParticipantsOpen}
          isScreenSharing={isScreenSharing}
        />
      </div>
    </MainLayout>
  );
}