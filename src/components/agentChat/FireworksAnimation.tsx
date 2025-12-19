import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface FireworksAnimationProps {
  isVisible: boolean;
  duration?: number; 
  onComplete?: () => void;
}

interface DanmakuItem {
  id: number;
  top: number; 
  delay: number; 
  duration: number; 
  fontSize: number; 
}


export const FireworksAnimation: React.FC<FireworksAnimationProps> = ({
  isVisible,
  duration = 5000,
  onComplete,
}) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  
  const danmakuItems: DanmakuItem[] = useMemo(() => {
    const items: DanmakuItem[] = [];
    const count = 20; 

    
    const isMobile = window.innerWidth < 640; 

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        top: Math.random() * 80 + 5, 
        delay: Math.random() * 2000, 
        duration: 3000 + Math.random() * 2000, 
        fontSize: isMobile
          ? 12 + Math.random() * 8 
          : 16 + Math.random() * 16, 
      });
    }
    return items;
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onComplete]);

  if (!show) return null;

  const successText = `🎉 ${t("agentChat.trainingSuccess")}`;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/img/fireworks.gif"
          alt="Training Success"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {}
      {danmakuItems.map((item) => (
        <div
          key={item.id}
          className="absolute whitespace-nowrap"
          style={{
            top: `${item.top}%`,
            right: "-300px",
            fontSize: `${item.fontSize}px`,
            animation: `danmaku-scroll ${item.duration}ms linear ${item.delay}ms forwards`,
          }}
        >
          <span
            className="font-bold drop-shadow-lg"
            style={{
              color: getRandomColor(),
              textShadow: "2px 2px 4px rgba(0,0,0,0.5), 0 0 20px currentColor",
            }}
          >
            {successText}
          </span>
        </div>
      ))}

      {}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="text-2xl sm:text-4xl md:text-6xl font-bold text-yellow-400 animate-pulse px-4"
          style={{
            textShadow: "0 0 20px #facc15, 0 0 40px #facc15, 0 0 60px #facc15",
          }}
        >
          🎊 {t("agentChat.trainingSuccess")} 🎊
        </div>
      </div>

      {}
      <style>{`
        @keyframes danmaku-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100vw - 300px));
          }
        }
      `}</style>
    </div>
  );
};


const colors = [
  "#facc15", 
  "#22c55e", 
  "#3b82f6", 
  "#f472b6", 
  "#a855f7", 
  "#f97316", 
  "#14b8a6", 
  "#ef4444", 
];

function getRandomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

export default FireworksAnimation;
