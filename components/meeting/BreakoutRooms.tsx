import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, ArrowLeft } from 'lucide-react';
import { useBreakoutRooms, BreakoutRoom } from '@/store/useBreakoutRooms';
import { User } from '@/types';

interface BreakoutRoomsProps {
  currentUser: User;
  onClose: () => void;
}

export default function BreakoutRooms({ currentUser, onClose }: BreakoutRoomsProps) {
  const { rooms, currentRoomId, joinRoom, leaveRoom } = useBreakoutRooms();

  const handleJoinRoom = (room: BreakoutRoom) => {
    joinRoom(room.id, currentUser);
  };

  const handleLeaveRoom = () => {
    leaveRoom(currentUser);
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">Breakout Rooms</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {rooms.map((room) => (
            <Card key={room.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{room.name}</h4>
                {currentRoomId === room.id ? (
                  <Button variant="destructive" size="sm" onClick={handleLeaveRoom}>
                    Leave Room
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleJoinRoom(room)}>
                    Join Room
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Participants ({room.participants.length}):
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {room.participants.map((participant) => (
                      <span
                        key={participant.id}
                        className="text-xs bg-muted px-2 py-1 rounded-full"
                      >
                        {participant.name || participant.email}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">
                    Common Interests:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {room.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {currentRoomId && (
        <div className="p-4 border-t border-border">
          <Button
            variant="default"
            className="w-full"
            onClick={handleLeaveRoom}
          >
            Rejoin Main Session
          </Button>
        </div>
      )}
    </div>
  );
}