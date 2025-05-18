import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { HelpCircle, MessageSquare, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAIHelper } from '@/hooks/useAIHelper';

interface AIHelperProps {
  transcript: string;
}

const QUICK_RESPONSES = [
  'Can you explain that differently?',
  "Let's take a 1-minute break",
  'I need more clarification',
  'Great point, let me add to that',
  'Could we circle back to that later?',
];

export default function AIHelper({ transcript }: AIHelperProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { suggestions, analyzeMeeting } = useAIHelper();

  useEffect(() => {
    const interval = setInterval(() => {
      if (transcript) {
        analyzeMeeting(transcript);
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [transcript, analyzeMeeting]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">AI Assistant</h3>
        </div>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setIsHelpOpen(true)}>
            <HelpCircle className="h-5 w-5" />
          </Button>
        </DialogTrigger>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Suggested Topics</h4>
            {suggestions.topics.map((topic, index) => (
              <Card key={index} className="p-3 mb-2">
                <p className="text-sm">{topic}</p>
              </Card>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Key Points</h4>
            {suggestions.keyPoints.map((point, index) => (
              <Card key={index} className="p-3 mb-2">
                <p className="text-sm">{point}</p>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <h4 className="text-sm font-medium mb-2">Quick Responses</h4>
        <div className="grid grid-cols-1 gap-2">
          {QUICK_RESPONSES.map((response, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => {
                // Handle sending the quick response
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {response}
            </Button>
          ))}
        </div>
      </div>

      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Assistant Help</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Features</h4>
              <ul className="list-disc list-inside mt-2 space-y-2 text-sm">
                <li>Meeting analysis every 2 minutes</li>
                <li>Topic suggestions based on conversation</li>
                <li>Key points summary</li>
                <li>Quick response templates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Tips</h4>
              <ul className="list-disc list-inside mt-2 space-y-2 text-sm">
                <li>Click any suggested topic to bring it up in the conversation</li>
                <li>Use quick responses to communicate efficiently</li>
                <li>The AI assistant learns from the meeting context</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}