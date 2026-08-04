import React from 'react';
import { X, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export default function VenueModal({ isOpen, onClose }) {
  const { config } = useWedding();
  const { venueName, venueAddress, venueMapsUrl } = config;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(58, 46, 50, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeInModal 0.3s ease forwards',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          background: '#FFFFFF',
          maxWidth: '520px',
          width: '100%',
          padding: '36px 30px',
          borderRadius: '20px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--cream-soft)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--ink-dark)',
            transition: 'all 0.2s ease',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'var(--cream-soft)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              color: 'var(--burgundy)',
            }}
          >
            <MapPin size={24} />
          </div>

          <h3
            className="font-heading"
            style={{
              fontSize: '24px',
              color: 'var(--burgundy)',
              marginBottom: '6px',
            }}
          >
            ღონისძიების ადგილი
          </h3>
          <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
            {venueName} &bull; {venueAddress}
          </p>
        </div>

        {/* Map Preview Box */}
        <div
          style={{
            width: '100%',
            height: '200px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#F0EBE5',
            position: 'relative',
            marginBottom: '24px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'radial-gradient(#C59B27 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <MapPin size={32} color="#8A2B49" style={{ animation: 'bounceDown 2s infinite' }} />
          <span
            className="font-heading"
            style={{ marginTop: '10px', fontSize: '14px', color: 'var(--burgundy)', fontWeight: 600 }}
          >
            {venueName}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{venueAddress}</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <a
            href={venueMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}
          >
            <Navigation size={16} />
            ნავიგაციის გახსნა (Google Maps)
            <ExternalLink size={14} style={{ marginLeft: '4px' }} />
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
