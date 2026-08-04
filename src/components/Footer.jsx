import React from 'react';
import { Heart } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export default function Footer() {
  const { config } = useWedding();
  const { footerMessage, brideName, groomName } = config;

  return (
    <footer
      style={{
        background: `
          radial-gradient(circle at 50% 50%, rgba(234, 185, 195, 0.25) 0%, transparent 70%),
          var(--cream-soft)
        `,
        padding: '80px 24px 40px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
        borderTop: '1px solid var(--glass-border)',
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--cream-base)',
            color: 'var(--burgundy)',
            marginBottom: '24px',
            boxShadow: '0 4px 15px rgba(138, 43, 73, 0.1)',
          }}
        >
          <Heart size={24} fill="currentColor" />
        </div>

        <p
          style={{
            fontSize: 'clamp(18px, 2.4vw, 22px)',
            lineHeight: 1.8,
            color: 'var(--ink-dark)',
            fontStyle: 'italic',
            marginBottom: '24px',
          }}
        >
          {footerMessage}
        </p>

        <div
          className="font-script"
          style={{
            fontSize: 'clamp(42px, 7vw, 64px)',
            color: 'var(--burgundy)',
            marginBottom: '40px',
          }}
        >
          {brideName} &amp; {groomName}
        </div>

        <div
          className="font-sans"
          style={{
            fontSize: '12px',
            letterSpacing: '2px',
            color: 'var(--ink-muted)',
            textTransform: 'uppercase',
          }}
        >
          დაგეგმილია სიყვარულით &bull; 2026
        </div>
      </div>
    </footer>
  );
}
