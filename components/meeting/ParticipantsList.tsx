'use client';

import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, X } from 'lucide-react';

interface ParticipantsListProps {
  participants: {
    user: User;
    isMuted: boolean;
    isVideoOff: boolean;
    isLocal?: boolean;
  }[];
  onClose: () => void;
}

export default function ParticipantsList({ participants, onClose }: ParticipantsListProps) {
  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-medium text-foreground">Participants ({participants.length})</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {participants.map((participant) => (
          <div 
            key={participant.user.id} 
            className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                {participant.user.name ? (
                  <span className="text-primary font-medium">
                    {participant.user.name.substring(0, 2).toUpperCase()}
                  </span>
                ) : (
                  <span className="text-primary font-medium">
                    {participant.user.email.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium text-foreground">
                  {participant.user.name || participant.user.email}
                  {participant.isLocal && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {participant.isMuted ? (
                <MicOff className="h-4 w-4 text-destructive" />
              ) : (
                <Mic className="h-4 w-4 text-muted-foreground" />
              )}
              
              {participant.isVideoOff ? (
                <VideoOff className="h-4 w-4 text-destructive" />
              ) : (
                <Video className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}