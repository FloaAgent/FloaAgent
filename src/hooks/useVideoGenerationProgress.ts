import { useState, useEffect, useRef } from "react";


export const useVideoGenerationProgress = (
  isGenerating: boolean,
  isCompleted: boolean
): number => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    
    if (isCompleted) {
      setProgress(100);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    
    if (isGenerating) {
      
      startTimeRef.current = Date.now();
      setProgress(0);

      
      const updateProgress = () => {
        const elapsed = Date.now() - startTimeRef.current; 
        const totalDuration = 120000; 
        const targetProgress = 99.99; 

        
        const idealProgress = Math.min(
          (elapsed / totalDuration) * targetProgress,
          targetProgress
        );

        
        const randomOffset = (Math.random() - 0.5) * 0.5; 
        let newProgress = idealProgress + randomOffset;

        
        setProgress((prev) => {
          newProgress = Math.max(prev, newProgress); 
          newProgress = Math.min(newProgress, targetProgress); 
          
          return Math.round(newProgress * 10000) / 10000;
        });
      };

      
      updateProgress();

      
      const scheduleNext = () => {
        const randomDelay = 500 + Math.random() * 1000; 
        intervalRef.current = setTimeout(() => {
          updateProgress();
          scheduleNext();
        }, randomDelay);
      };

      scheduleNext();

      
      return () => {
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      
      setProgress(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isGenerating, isCompleted]);

  return progress;
};
