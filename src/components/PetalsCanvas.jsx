import React, { useEffect, useState } from 'react';

export default function PetalsCanvas() {
  const [petals, setPetals] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const count = 30;
    const initialPetals = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: 10 + Math.random() * 14, // px
      duration: 9 + Math.random() * 10, // seconds
      delay: Math.random() * 12, // seconds
      type: i % 3 === 0 ? 'rose' : i % 3 === 1 ? 'blue' : 'gold',
      rotation: Math.random() * 360,
    }));
    setPetals(initialPetals);
  }, []);

  if (!isEnabled) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      {petals.map((p) => (
        <div
          key={p.id}
          className={`petal-item petal-${p.type}`}
          style={{
            position: 'absolute',
            top: '-30px',
            left: `${p.left}vw`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '150% 0 150% 0',
            opacity: 0.75,
            animation: `petalFall ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}

      <style>{`
        .petal-rose {
          background: radial-gradient(circle at 30% 30%, #FFD6E4, #D9789E 75%);
          box-shadow: 0 2px 6px rgba(217, 120, 158, 0.3);
        }
        .petal-blue {
          background: radial-gradient(circle at 30% 30%, #EAF7FC, #A9D4E6 75%);
          box-shadow: 0 2px 6px rgba(169, 212, 230, 0.3);
        }
        .petal-gold {
          background: radial-gradient(circle at 30% 30%, #FFF5D6, #EAD08B 75%);
          box-shadow: 0 2px 6px rgba(234, 208, 139, 0.3);
        }

        @keyframes petalFall {
          0% {
            transform: translateY(-5vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          50% {
            transform: translateY(50vh) translateX(40px) rotate(180deg);
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(105vh) translateX(-20px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
