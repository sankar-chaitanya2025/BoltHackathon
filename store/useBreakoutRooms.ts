import { create } from 'zustand';
import { User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export interface BreakoutRoom {
  id: string;
  name: string;
  participants: User[];
  interests: string[];
}

interface BreakoutRoomState {
  rooms: BreakoutRoom[];
  currentRoomId: string | null;
  createRooms: (participants: User[], interests: Map<string, string[]>) => void;
  joinRoom: (roomId: string, user: User) => void;
  leaveRoom: (user: User) => void;
}

export const useBreakoutRooms = create<BreakoutRoomState>((set) => ({
  rooms: [],
  currentRoomId: null,
  createRooms: (participants, interests) => {
    // Group users by shared interests
    const userGroups: User[][] = [];
    const usedUsers = new Set<string>();

    // Convert interests map to array of entries for easier processing
    const interestEntries = Array.from(interests.entries());

    // For each interest, find users who share it
    interestEntries.forEach(([interest, users]) => {
      const availableUsers = users.filter(userId => {
        const user = participants.find(p => p.id === userId);
        return user && !usedUsers.has(userId);
      });

      if (availableUsers.length >= 2) {
        // Create groups of 3-4 users with shared interests
        while (availableUsers.length >= 3) {
          const groupSize = Math.min(4, availableUsers.length);
          const group = availableUsers.splice(0, groupSize)
            .map(userId => participants.find(p => p.id === userId)!)
            .filter(Boolean);
          
          if (group.length >= 3) {
            userGroups.push(group);
            group.forEach(user => usedUsers.add(user.id));
          }
        }
      }
    });

    // Create rooms from the groups
    const rooms = userGroups.map((group, index) => ({
      id: uuidv4(),
      name: `Breakout Room ${index + 1}`,
      participants: group,
      interests: Array.from(interests.entries())
        .filter(([_, users]) => 
          group.some(user => users.includes(user.id)))
        .map(([interest]) => interest),
    }));

    set({ rooms });
  },
  joinRoom: (roomId, user) => {
    set(state => ({
      currentRoomId: roomId,
      rooms: state.rooms.map(room => {
        if (room.id === roomId && !room.participants.find(p => p.id === user.id)) {
          return { ...room, participants: [...room.participants, user] };
        }
        return room;
      }),
    }));
  },
  leaveRoom: (user) => {
    set(state => ({
      currentRoomId: null,
      rooms: state.rooms.map(room => ({
        ...room,
        participants: room.participants.filter(p => p.id !== user.id),
      })),
    }));
  },
}));