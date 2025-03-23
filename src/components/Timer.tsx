
import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  timeRemaining: number;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, isActive }) => {
  const [animatedTime, setAnimatedTime] = useState(timeRemaining);
  
  // For the circle progress animation
  const circumference = 2 * Math.PI * 45; // 45 is the radius of our circle
  const strokeDashoffset = circumference - (animatedTime / 60) * circumference;
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Animate the timer smoother than the actual updates
  useEffect(() => {
    let animationFrame: number;
    
    if (isActive) {
      const animate = () => {
        setAnimatedTime((prev) => {
          // Smoothly approach the target time
          const diff = timeRemaining - prev;
          if (Math.abs(diff) < 0.01) return timeRemaining;
          return prev + diff * 0.2;
        });
        
        animationFrame = requestAnimationFrame(animate);
      };
      
      animationFrame = requestAnimationFrame(animate);
    } else {
      setAnimatedTime(timeRemaining);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [timeRemaining, isActive]);
  
  return (
    <div className="flex items-center justify-center py-4">
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="#F3F4F6"
            stroke="#E5E7EB"
            strokeWidth="2"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isActive ? "#0EA5E9" : "#9CA3AF"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
            className="transition-all duration-500 ease-linear"
          />
          {/* Clock icon in the middle */}
          <foreignObject x="35" y="28" width="30" height="30">
            <Clock className={`w-6 h-6 ${isActive ? "text-blue-500" : "text-gray-400"}`} />
          </foreignObject>
          {/* Time text */}
          <text
            x="50"
            y="65"
            textAnchor="middle"
            className={`${isActive ? "text-blue-600" : "text-gray-500"} font-medium text-xs`}
          >
            {formatTime(Math.ceil(animatedTime))}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Timer;
