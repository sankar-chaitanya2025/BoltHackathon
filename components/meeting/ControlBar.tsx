'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, MicOff, Video, VideoOff, ScreenShare, Phone, MessageSquare, Users, Settings, Share2, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCalmMode } from '@/store/useCalmMode';

interface ControlBarProps {
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onScreenShare: () => void;
  onLeaveCall: () => void;
  isMuted: boolean;
  isVideoOff: boolean;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  isScreenSharing: boolean;
}

export default function ControlBar({
  onToggleAudio,
  onToggleVideo,
  onToggleChat,
  onToggleParticipants,
  onScreenShare,
  onLeaveCall,
  isMuted,
  isVideoOff,
  isChatOpen,
  isParticipantsOpen,
  isScreenSharing,
}: ControlBarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isEnabled: isCalmMode, toggle: toggleCalmMode } = useCalmMode();

  return (
    <div className={cn(
      "bg-card/80 backdrop-blur-sm border-t border-border p-4",
      isCalmMode && "calm-mode"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isMuted ? 'destructive' : 'secondary'}
                  size="icon"
                  onClick={onToggleAudio}
                  className={cn(
                    "rounded-full transition-all duration-200",
                    isMuted ? "bg-destructive text-destructive-foreground" : ""
                  )}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{isMuted ? 'Unmute' : 'Mute'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isVideoOff ? 'destructive' : 'secondary'}
                  size="icon"
                  onClick={onToggleVideo}
                  className={cn(
                    "rounded-full transition-all duration-200",
                    isVideoOff ? "bg-destructive text-destructive-foreground" : ""
                  )}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{isVideoOff ? 'Turn on camera' : 'Turn off camera'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isScreenSharing ? 'default' : 'secondary'}
                  size="icon"
                  onClick={onScreenShare}
                  className="rounded-full"
                >
                  <ScreenShare className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{isScreenSharing ? 'Stop sharing' : 'Share screen'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isCalmMode ? 'default' : 'secondary'}
                  size="icon"
                  onClick={toggleCalmMode}
                  className="rounded-full"
                >
                  <Moon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{isCalmMode ? 'Disable Calm Mode' : 'Enable Calm Mode'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isChatOpen ? 'default' : 'secondary'}
                  size="icon"
                  onClick={onToggleChat}
                  className="rounded-full"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isParticipantsOpen ? 'default' : 'secondary'}
                  size="icon"
                  onClick={onToggleParticipants}
                  className="rounded-full"
                >
                  <Users className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Participants</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="rounded-full"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Invite</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="destructive"
            size="icon"
            onClick={onLeaveCall}
            className="rounded-full ml-2"
          >
            <Phone className="h-5 w-5 rotate-135" />
          </Button>
        </div>
      </div>
    </div>
  );
}