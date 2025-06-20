import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgressRing from '@/components/atoms/ProgressRing';

export default function FocusTimer({ 
  task,
  duration = 25,
  onComplete, 
  onPause,
  onStop,
  className = '' 
}) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const totalSeconds = duration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
    onPause?.();
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(totalSeconds);
    onStop?.();
  };

  const formatTime = (time) => {
    return `${time.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center ${className}`}
    >
      {/* Task Info */}
      {task && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Focus Session
          </h2>
          <p className="text-white/80 text-lg">
            {task.title}
          </p>
        </div>
      )}

      {/* Timer Display */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-6">
          <ProgressRing
            progress={progress}
            size={200}
            strokeWidth={8}
            color="rgba(255, 255, 255, 0.9)"
            backgroundColor="rgba(255, 255, 255, 0.3)"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-white font-mono">
                {formatTime(minutes)}:{formatTime(seconds)}
              </div>
              <div className="text-white/60 text-sm mt-1">
                {duration} minute session
              </div>
            </div>
          </div>
        </div>

        {/* Progress Text */}
        <div className="text-white/80">
          {timeLeft === 0 ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-2xl font-semibold"
            >
              🎉 Session Complete!
            </motion.div>
          ) : (
            <div>
              {isRunning ? 'Focus time...' : isPaused ? 'Paused' : 'Ready to focus?'}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRunning && !isPaused && timeLeft === totalSeconds && (
          <Button
            onClick={handleStart}
            variant="success"
            size="lg"
            icon="Play"
            className="bg-white text-primary hover:bg-white/90"
          >
            Start Focus
          </Button>
        )}

        {!isRunning && isPaused && (
          <>
            <Button
              onClick={handleStart}
              variant="success"
              size="lg"
              icon="Play"
              className="bg-white text-primary hover:bg-white/90"
            >
              Resume
            </Button>
            <Button
              onClick={handleStop}
              variant="outline"
              size="lg"
              icon="Square"
              className="border-white text-white hover:bg-white/10"
            >
              Reset
            </Button>
          </>
        )}

        {isRunning && (
          <>
            <Button
              onClick={handlePause}
              variant="outline"
              size="lg"
              icon="Pause"
              className="border-white text-white hover:bg-white/10"
            >
              Pause
            </Button>
            <Button
              onClick={handleStop}
              variant="outline"
              size="lg"
              icon="Square"
              className="border-white text-white hover:bg-white/10"
            >
              Stop
            </Button>
          </>
        )}

        {timeLeft === 0 && (
          <Button
            onClick={handleStop}
            variant="success"
            size="lg"
            icon="RotateCcw"
            className="bg-white text-primary hover:bg-white/90"
          >
            New Session
          </Button>
        )}
      </div>

      {/* Breathing Animation */}
      {isRunning && (
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 border-2 border-white/20 rounded-full pointer-events-none"
        />
      )}
    </motion.div>
  );
}