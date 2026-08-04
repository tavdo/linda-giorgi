import React from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import Countdown from './Countdown';

export default function DetailsSection({ onOpenVenueModal }) {
  const { config } = useWedding();
  const { dateString, timeString, venueName, venueAddress, dressCodeTitle, dressCodeSub } = config;

  const cards = [
    {
      icon: <Calendar size={26} color="var(--gold-accent)" />,
      title: 'თარიღი',
      main: dateString,
      sub: 'შაბათი დღე',
    },
    {
      icon: <Clock size={26} color="var(--gold-accent)" />,
      title: 'დრო',
      main: timeString,
      sub: 'სტუმრების მიღება 17:30-დან',
    },
    {
      icon: <MapPin size={26} color="var(--gold-accent)" />,
      title: 'ადგილი',
      main: venueName,
      sub: venueAddress,
      action: 'რუკის ნახვა',
      onClick: onOpenVenueModal,
    },
    {
      icon: <Sparkles size={26} color="var(--gold-accent)" />,
      title: 'დრესკოდი',
      main: dressCodeTitle,
      sub: dressCodeSub,
    },
  ];

  return (
    <section
      id="details"
      className="section-container"
      style={{
        background: 'linear-gradient(180deg, var(--cream-soft) 0%, var(--cream-base) 100%)',
      }}
    >
      <h2 className="section-title">ღონისძიების დეტალები</h2>
      <p className="section-subtitle">ყველაფერი, რაც უნდა იცოდეთ საქორწინო დღის შესახებ</p>

      {/* Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto 20px',
        }}
      >
        {cards.map((c, i) => (
          <div
            key={i}
            className="glass-card"
            style={{
              padding: '32px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--cream-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(138, 43, 73, 0.06)',
              }}
            >
              {c.icon}
            </div>

            <h3
              className="font-heading"
              style={{
                fontSize: '18px',
                letterSpacing: '1px',
                color: 'var(--burgundy)',
                marginBottom: '8px',
              }}
            >
              {c.title}
            </h3>

            <p
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--ink-dark)',
                marginBottom: '4px',
              }}
            >
              {c.main}
            </p>

            <span
              style={{
                fontSize: '14px',
                color: 'var(--ink-muted)',
                fontStyle: 'italic',
              }}
            >
              {c.sub}
            </span>

            {c.action && (
              <button
                onClick={c.onClick}
                className="btn-secondary"
                style={{
                  marginTop: '16px',
                  padding: '8px 18px',
                  fontSize: '11px',
                }}
              >
                {c.action}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Countdown Timer */}
      <Countdown />
    </section>
  );
}
