'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, FileDown, RefreshCw } from 'lucide-react';
import { useAccessibilityChecker } from '@/hooks/useAccessibilityChecker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function AccessibilityReport() {
  const { issues, colorSuggestions, isScanning, scanPage, generateReport } = useAccessibilityChecker();

  useEffect(() => {
    // Initial scan when component mounts
    scanPage();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <AlertTriangle className="h-4 w-4" />
          Accessibility
          {issues.length > 0 && (
            <span className="ml-1 rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
              {issues.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Accessibility Report</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={scanPage}
            disabled={isScanning}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Rescan'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={generateReport}
            disabled={isScanning || issues.length === 0}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            Download PDF Report
          </Button>
        </div>

        <ScrollArea className="h-[60vh]">
          {issues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No accessibility issues found
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Issues Found ({issues.length})</h3>
                {issues.map((issue) => (
                  <Card key={issue.id} className="p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">{issue.description}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Impact: <span className="font-medium">{issue.impact}</span>
                        </p>
                        <p className="text-sm font-mono bg-muted p-2 rounded mt-2">
                          {issue.element}
                        </p>
                        <p className="text-sm mt-2">{issue.help}</p>
                        <a
                          href={issue.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline mt-2 inline-block"
                        >
                          Learn more
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {colorSuggestions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Color Contrast Suggestions
                  </h3>
                  {colorSuggestions.map((suggestion, index) => (
                    <Card key={index} className="p-4 mb-4">
                      <h4 className="font-medium">Element</h4>
                      <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                        {suggestion.element}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm font-medium">Current Color</p>
                          <div className="flex items-center mt-1">
                            <div
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: suggestion.currentColor }}
                            />
                            <code className="text-sm ml-2">
                              {suggestion.currentColor}
                            </code>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Suggested Color</p>
                          <div className="flex items-center mt-1">
                            <div
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: suggestion.suggestedColor }}
                            />
                            <code className="text-sm ml-2">
                              {suggestion.suggestedColor}
                            </code>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mt-2">
                        Current Contrast Ratio:{' '}
                        <span className="font-medium">{suggestion.contrastRatio}</span>
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}