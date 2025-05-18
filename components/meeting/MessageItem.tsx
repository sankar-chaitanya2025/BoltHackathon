import { cn } from '@/lib/utils';
import { Message, User } from '@/types';
import { format } from 'date-fns';

interface MessageItemProps {
  message: Message;
  currentUser: User;
}

export default function MessageItem({ message, currentUser }: MessageItemProps) {
  const isOwnMessage = message.user_id === currentUser.id;
  
  return (
    <div 
      className={cn(
        "flex mb-4",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "max-w-[80%] px-4 py-2 rounded-2xl",
          isOwnMessage 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted text-foreground rounded-tl-none"
        )}
      >
        {!isOwnMessage && (
          <div className="font-medium text-xs mb-1">
            {message.user?.name || message.user?.email || 'Unknown User'}
          </div>
        )}
        <p className="text-sm">{message.content}</p>
        <div className="text-xs mt-1 opacity-70 text-right">
          {format(new Date(message.created_at), 'h:mm a')}
        </div>
      </div>
    </div>
  );
}