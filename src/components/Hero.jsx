import React from 'react';
import { Calendar, ChevronDown, Heart } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export default function Hero({ onRsvpClick, onDetailsClick }) {
  const { config } = useWedding();
  const { brideName, groomName, heroSubtitle, dateString, timeString, locationCity, venueName } = config;

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`${brideName} & ${groomName}-ს ქორწილი 💍`);
    const details = encodeURIComponent('გვიხარია, რომ ჩვენთან ერთად იზეიმებთ ამ განსაკუთრებულ დღეს!');
    const location = encodeURIComponent(`${venueName}, ${locationCity}`);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260829T140000Z/20260829T200000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <section
      id="hero"
      className="section-container"
      style={{
        background: `
          radial-gradient(circle at 50% 20%, rgba(234, 185, 195, 0.25) 0%, transparent 60%),
          radial-gradient(circle at 20% 80%, rgba(169, 212, 230, 0.25) 0%, transparent 60%),
          linear-gradient(180deg, var(--cream-base) 0%, var(--cream-soft) 100%)
        `,
        textAlign: 'center',
        paddingTop: '100px',
        paddingBottom: '80px',
      }}
    >
      {/* Decorative Monogram Crest */}
      <div style={{ marginBottom: '24px', opacity: 0, animation: 'fadeIn 1.2s ease forwards 0.2s' }}>
        <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="#C59B27" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="41" stroke="#EAB9C3" strokeWidth="1.5" />
          <path d="M50 12 C35 30, 20 40, 50 88 C80 40, 65 30, 50 12" stroke="#8A2B49" strokeWidth="1" fill="none" opacity="0.4" />
          <text x="50" y="55" textAnchor="middle" dominantBaseline="middle" fontFamily="Great Vibes, cursive" fontSize="30" fill="#8A2B49">
            {brideName ? brideName[0] : 'L'} &amp; {groomName ? groomName[0] : 'G'}
          </text>
        </svg>
      </div>

      {/* Pre-title */}
      <p
        className="font-heading"
        style={{
          fontSize: '14px',
          letterSpacing: '5px',
          textTransform: 'uppercase',
          color: 'var(--ink-muted)',
          marginBottom: '16px',
          opacity: 0,
          animation: 'fadeIn 1.2s ease forwards 0.5s',
        }}
      >
        {heroSubtitle}
      </p>

      {/* Names */}
      <h1
        className="font-script"
        style={{
          fontSize: 'clamp(64px, 13vw, 136px)',
          lineHeight: 1.05,
          color: 'var(--burgundy)',
          margin: '10px 0',
          textShadow: '0 4px 20px rgba(138, 43, 73, 0.1)',
          opacity: 0,
          animation: 'fadeInScale 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.8s',
        }}
      >
        {brideName}
        <span
          style={{
            display: 'block',
            fontSize: '0.45em',
            color: 'var(--gold-accent)',
            margin: '-10px 0',
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
          }}
        >
          &amp;
        </span>
        {groomName}
      </h1>

      {/* Date & Location */}
      <div
        className="font-heading"
        style={{
          fontSize: 'clamp(17px, 2.5vw, 24px)',
          letterSpacing: '3px',
          color: 'var(--ink-dark)',
          marginTop: '20px',
          marginBottom: '32px',
          opacity: 0,
          animation: 'fadeIn 1.2s ease forwards 1.2s',
        }}
      >
        {dateString} &nbsp;•&nbsp; {timeString}
        <div style={{ fontSize: '15px', color: 'var(--ink-muted)', marginTop: '8px', letterSpacing: '2px' }}>
          {locationCity}
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0,
          animation: 'fadeIn 1.2s ease forwards 1.5s',
          marginTop: '10px',
        }}
      >
        <button onClick={onRsvpClick} className="btn-primary">
          <Heart size={16} fill="currentColor" />
          დასწრების დადასტურება (RSVP)
        </button>

        <button onClick={handleAddToCalendar} className="btn-secondary">
          <Calendar size={16} />
          კალენდარში დამატება
        </button>
      </div>

      {/* Scroll Hint */}
      <a
        href="#story"
        style={{
          position: 'absolute',
          bottom: '28px',
          textDecoration: 'none',
          color: 'var(--ink-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontFamily: 'Montserrat, sans-serif',
          opacity: 0,
          animation: 'fadeIn 1.2s ease forwards 1.8s, bounceDown 2.5s ease-in-out infinite 2s',
        }}
      >
        <span>გაიგეთ მეტი</span>
        <ChevronDown size={18} color="var(--burgundy)" />
      </a>

      <style>{`
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.88) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
}
