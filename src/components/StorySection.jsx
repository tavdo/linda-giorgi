import React from 'react';
import { useWedding } from '../context/WeddingContext';

export default function StorySection() {
  const { config } = useWedding();
  const { storyTitle, storyText, storySignature } = config;

  return (
    <section
      id="story"
      className="section-container"
      style={{
        background: 'linear-gradient(180deg, var(--cream-soft) 0%, var(--cream-base) 100%)',
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '780px',
          padding: '60px 40px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: '40px',
            color: 'var(--gold-accent)',
            fontFamily: 'Cormorant Garamond, serif',
            lineHeight: 0.5,
            marginBottom: '20px',
            opacity: 0.6,
          }}
        >
          “
        </div>

        <h2 className="section-title">{storyTitle}</h2>

        <p
          style={{
            fontSize: 'clamp(19px, 2.6vw, 24px)',
            lineHeight: 1.9,
            color: 'var(--ink-dark)',
            fontStyle: 'italic',
            marginBottom: '32px',
            fontWeight: 400,
          }}
        >
          {storyText}
        </p>

        <div
          className="font-script"
          style={{
            fontSize: 'clamp(36px, 5vw, 48px)',
            color: 'var(--burgundy)',
            marginTop: '20px',
          }}
        >
          {storySignature}
        </div>
      </div>
    </section>
  );
}
