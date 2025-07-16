import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Target, Zap, AlertCircle } from "lucide-react";

interface StatsPanelProps {
  wpm: number;
  accuracy: number;
  timer?: string;
  errors: number;
  elapsedTime?: number;
}

const StatsPanel = ({
  wpm = 0,
  accuracy = 99,
  timer,
  errors = 1,
  elapsedTime = 0,
}: StatsPanelProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const displayTime = timer || formatTime(elapsedTime);
  return (
    <Card className="w-full bg-background shadow-md">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">WPM</span>
            </div>
            <p className="text-2xl font-bold">{wpm}</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Accuracy</span>
            </div>
            <p className="text-2xl font-bold">{accuracy}%</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Timer</span>
            </div>
            <p className="text-2xl font-bold">{displayTime}</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Errors</span>
            </div>
            <p className="text-2xl font-bold">{errors}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsPanel;
