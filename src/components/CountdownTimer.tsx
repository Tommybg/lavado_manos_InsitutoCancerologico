
import React from "react";
import { cn } from "@/lib/utils";
import { TOTAL_DURATION } from "@/lib/constants";

interface CountdownTimerProps {
  timeRemaining: number;
  isRunning: boolean;
  isCompleted: boolean;
}

const CountdownTimer = ({
  timeRemaining,
  isRunning,
  isCompleted,
}: CountdownTimerProps) => {
  const formattedTime = () => {
    const totalSeconds = Math.ceil(timeRemaining);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = ((TOTAL_DURATION - timeRemaining) / TOTAL_DURATION) * 100;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Outer ring */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="fill-transparent stroke-gray-200 stroke-[4]"
            cx="50"
            cy="50"
            r="46"
          />
          {/* Progress circle */}
          <circle
            className={cn(
              "fill-transparent stroke-[4] transition-all duration-300",
              isRunning ? "stroke-primary" : "stroke-muted-foreground",
              isCompleted && "stroke-success"
            )}
            cx="50"
            cy="50"
            r="46"
            strokeDasharray="289.02"
            strokeDashoffset={289.02 * (1 - progressPercent / 100)}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className={cn(
              "countdown-text transition-colors duration-300",
              isCompleted && "text-success",
              !isRunning && !isCompleted && "text-muted-foreground"
            )}
          >
            {formattedTime()}
          </div>
          <div 
            className={cn(
              "text-sm font-medium mt-2",
              isRunning ? "text-primary" : "text-muted-foreground",
              isCompleted && "text-success"
            )}
          >
            {isCompleted ? "Completado" : "Tiempo Restante"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
