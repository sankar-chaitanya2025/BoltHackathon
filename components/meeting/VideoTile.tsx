'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCalmMode } from '@/store/useCalmMode';

interface VideoTileProps {
  stream?: MediaStream;
  name: string;
  isMuted: boolean;
  isLocal?: boolean;
  isActive?: boolean;
}

export default function VideoTile({ stream, name, isMuted, isLocal = false, isActive = false }: VideoTileProps) {
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isEnabled: isCalmMode } = useCalmMode();

  useEffect(() => {
    if (videoRef && stream) {
      videoRef.srcObject = stream;
    }

    if (audioRef.current && stream) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        const speechFilter = audioContext.createBiquadFilter();

        speechFilter.type = 'bandpass';
        speechFilter.frequency.value = 1000;
        speechFilter.Q.value = 0.7;

        source.connect(analyser);
        if (isCalmMode) {
          source.connect(speechFilter);
          speechFilter.connect(audioContext.destination);
        } else {
          source.connect(audioContext.destination);
        }

        return () => {
          audioContext.close();
        };
      }
    }
  }, [stream, videoRef, isCalmMode]);

  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden bg-card/80 border border-border transition-all duration-200",
        isActive ? "ring-2 ring-primary" : "",
        "aspect-video",
        isCalmMode && "video-feed"
      )}
    >
      {stream ? (
        <>
          <video
            ref={setVideoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className="w-full h-full object-cover"
          />
          <audio
            ref={audioRef}
            autoPlay
            data-type="speech"
            className="hidden"
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="rounded-full bg-background/80 p-4">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <div className="text-white font-medium text-sm truncate">
            {name} {isLocal && '(You)'}
          </div>
          <div className="flex items-center">
            {isMuted ? (
              <div className="bg-destructive/80 rounded-full p-1 flex items-center justify-center">
                <MicOff className="h-3 w-3 text-white" />
              </div>
            ) : (
              <div className="bg-background/80 rounded-full p-1 flex items-center justify-center">
                <Mic className="h-3 w-3 text-foreground" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}