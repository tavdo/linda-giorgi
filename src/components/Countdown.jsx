import React, { useEffect, useState } from 'react';
import { useWedding } from '../context/WeddingContext';

export default function Countdown() {
  const { config } = useWedding();
  const { countdownTarget } = config;

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const updateTimer = () => {
      const targetTime = new Date(countdownTarget).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (isNaN(difference) || difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [countdownTarget]);

  const units = [
    { label: 'დღე', value: timeLeft.days },
    { label: 'საათი', value: timeLeft.hours },
    { label: 'წუთი', value: timeLeft.minutes },
    { label: 'წამი', value: timeLeft.seconds },
  ];

  return (
    <div style={{ marginTop: '40px', textAlign: 'center' }}>
      <h3
        className="font-heading"
        style={{
          fontSize: '18px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'var(--burgundy)',
          marginBottom: '24px',
        }}
      >
        ჩვენს დღემდე დარჩა
      </h3>

      <div
        style={{
          display: 'flex',
          gap: '18px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {units.map((u, i) => (
          <div
            key={i}
            className="glass-card"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid var(--glass-border)',
              boxShadow: '0 10px 25px rgba(138, 43, 73, 0.08)',
            }}
          >
            <span
              className="font-heading"
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: 'var(--burgundy)',
                lineHeight: 1.1,
              }}
            >
              {u.value}
            </span>
            <span
              className="font-sans"
              style={{
                fontSize: '11px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
                marginTop: '2px',
              }}
            >
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
