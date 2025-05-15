'use client';

import VideoTile from './VideoTile';
import { User } from '@/types';

interface VideoGridProps {
  participants: {
    user: User;
    stream?: MediaStream;
    isMuted: boolean;
    isLocal?: boolean;
    isActive?: boolean;
  }[];
}

export default function VideoGrid({ participants }: VideoGridProps) {
  // Create a grid layout based on the number of participants
  const getGridLayout = () => {
    const count = participants.length;
    
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-3';
  };

  return (
    <div className={`grid ${getGridLayout()} gap-4 h-full`}>
      {participants.map((participant, index) => (
        <VideoTile
          key={participant.user.id}
          stream={participant.stream}
          name={participant.user.name || participant.user.email}
          isMuted={participant.isMuted}
          isLocal={participant.isLocal}
          isActive={participant.isActive}
        />
      ))}
    </div>
  );
}