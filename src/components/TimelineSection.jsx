import React from 'react';
import { useWedding } from '../context/WeddingContext';
import { GlassWater, Heart, Utensils, Cake, Music, Sparkles } from 'lucide-react';

export default function TimelineSection() {
  const { config } = useWedding();
  const { timelineEvents } = config;

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'GlassWater': return <GlassWater size={20} color="#8A2B49" />;
      case 'Heart': return <Heart size={20} color="#8A2B49" fill="#8A2B49" />;
      case 'Utensils': return <Utensils size={20} color="#8A2B49" />;
      case 'Cake': return <Cake size={20} color="#8A2B49" />;
      case 'Music': return <Music size={20} color="#8A2B49" />;
      default: return <Sparkles size={20} color="#8A2B49" />;
    }
  };

  return (
    <section
      id="timeline"
      className="section-container"
      style={{
        background: 'transparent',
      }}
    >
      <h2 className="section-title">დღის განრიგი</h2>
      <p className="section-subtitle">სადღესასწაულო დღის განრიგი</p>

      <div
        style={{
          position: 'relative',
          maxWidth: '700px',
          width: '100%',
          margin: '0 auto',
          padding: '20px 0',
        }}
      >
        {/* Vertical Center Line */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            bottom: '0',
            width: '2px',
            background: 'linear-gradient(180deg, transparent 0%, var(--gold-accent) 15%, var(--rose-quartz) 85%, transparent 100%)',
            transform: 'translateX(-50%)',
          }}
        />

        {timelineEvents.map((ev, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={ev.id || index}
              style={{
                display: 'flex',
                justifyContent: isEven ? 'flex-end' : 'flex-start',
                paddingLeft: isEven ? '0' : '50%',
                paddingRight: isEven ? '50%' : '0',
                position: 'relative',
                marginBottom: '40px',
              }}
            >
              {/* Timeline Center Badge */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '16px',
                  transform: 'translate(-50%, -50%)',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '2px solid var(--gold-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(138, 43, 73, 0.15)',
                  zIndex: 3,
                }}
              >
                {getIcon(ev.iconName)}
              </div>

              {/* Event Content Card */}
              <div
                className="glass-card"
                style={{
                  width: 'calc(100% - 30px)',
                  maxWidth: '300px',
                  padding: '20px 24px',
                  margin: isEven ? '0 30px 0 0' : '0 0 0 30px',
                  textAlign: isEven ? 'right' : 'left',
                }}
              >
                <div
                  className="font-heading"
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--gold-accent)',
                    marginBottom: '4px',
                  }}
                >
                  {ev.time}
                </div>
                <h3
                  className="font-heading"
                  style={{
                    fontSize: '18px',
                    color: 'var(--burgundy)',
                    marginBottom: '6px',
                  }}
                >
                  {ev.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--ink-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  {ev.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 640px) {
          #timeline .glass-card {
            max-width: 100% !important;
            margin: 0 0 0 45px !important;
            text-align: left !important;
          }
          #timeline > div > div:nth-child(n) {
            padding-left: 0 !important;
            padding-right: 0 !important;
            justify-content: flex-start !important;
          }
          #timeline div[style*="left: 50%"] {
            left: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
