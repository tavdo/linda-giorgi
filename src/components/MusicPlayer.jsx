import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

const DEFAULT_TRACK = '/assets/background-music.mp3';

export default function MusicPlayer() {
  const { config } = useWedding();
  const {
    musicTrackSrc = DEFAULT_TRACK,
    musicTrackTitle = 'საარშიყო',
  } = config;

  const trackSrc = musicTrackSrc || DEFAULT_TRACK;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);
  const userPausedRef = useRef(false);
  const gestureCleanupRef = useRef(null);

  const hasSound = () => {
    const audio = audioRef.current;
    return !!(audio && !audio.paused && !audio.muted && audio.volume > 0);
  };

  const startWithSound = async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      audio.muted = false;
      audio.volume = 1;
      setIsMuted(false);
      await audio.play();
      setIsPlaying(true);
      return true;
    } catch {
      // Browser blocked autoplay until a user gesture
      setIsPlaying(false);
      return false;
    }
  };

  const armGestureFallback = () => {
    if (gestureCleanupRef.current) return;

    const onGesture = async () => {
      if (userPausedRef.current) return;
      const started = await startWithSound();
      if (started || hasSound()) cleanup();
    };

    const events = ['pointerdown', 'touchstart', 'keydown', 'click'];
    const cleanup = () => {
      events.forEach((eventName) => document.removeEventListener(eventName, onGesture));
      gestureCleanupRef.current = null;
    };

    events.forEach((eventName) =>
      document.addEventListener(eventName, onGesture, { passive: true })
    );
    gestureCleanupRef.current = cleanup;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    userPausedRef.current = false;
    audio.loop = true;
    audio.preload = 'auto';
    audio.src = trackSrc;
    audio.load();

    const onCanPlay = async () => {
      setIsLoaded(true);
      const started = await startWithSound();
      if (!started && !userPausedRef.current) {
        armGestureFallback();
      } else {
        gestureCleanupRef.current?.();
      }
    };

    const onPlay = () => {
      setIsPlaying(true);
      if (!audio.muted) gestureCleanupRef.current?.();
    };

    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => setIsMuted(audio.muted || audio.volume === 0);

    audio.addEventListener('canplaythrough', onCanPlay);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('volumechange', onVolumeChange);

    // Try immediately as well (in case already buffered)
    startWithSound().then((started) => {
      if (!started && !userPausedRef.current) armGestureFallback();
    });

    return () => {
      gestureCleanupRef.current?.();
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('volumechange', onVolumeChange);
      audio.pause();
    };
  }, [trackSrc]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      userPausedRef.current = true;
      gestureCleanupRef.current?.();
      audio.pause();
      setIsPlaying(false);
      return;
    }

    userPausedRef.current = false;
    await startWithSound();
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;
    audio.muted = !audio.muted;
    if (!audio.muted) audio.volume = 1;
    setIsMuted(audio.muted);
  };

  return (
    <>
      <audio ref={audioRef} playsInline preload="auto" style={{ display: 'none' }} />

      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(229, 200, 140, 0.5)',
          borderRadius: '40px',
          padding: '8px 16px',
          boxShadow: '0 10px 30px rgba(138, 43, 73, 0.12)',
          transition: 'all 0.3s ease',
        }}
      >
        <button
          onClick={togglePlay}
          aria-label="მუსიკის ჩართვა/გამორთვა"
          title={isPlaying ? 'მუსიკის შეჩერება' : 'ფონური მუსიკის ჩართვა'}
          style={{
            background: isPlaying ? 'linear-gradient(135deg, #8A2B49, #D9789E)' : '#FAF4EE',
            color: isPlaying ? '#FFFFFF' : '#8A2B49',
            border: 'none',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isPlaying ? '0 4px 15px rgba(217, 120, 158, 0.4)' : 'none',
          }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: '#8A2B49',
              textTransform: 'uppercase',
            }}
          >
            {isPlaying ? 'ფონური მუსიკა' : 'მუსიკა'}
          </span>
          <span
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '13px',
              color: '#7E6F74',
              fontStyle: 'italic',
            }}
          >
            {isPlaying ? musicTrackTitle : 'დააჭირეთ დასაკრავად'}
          </span>
        </div>

        {isPlaying && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '6px' }}>
            <span className="eq-bar eq-bar-1" />
            <span className="eq-bar eq-bar-2" />
            <span className="eq-bar eq-bar-3" />
          </div>
        )}

        <button
          onClick={toggleMute}
          title={isMuted ? 'ხმის ჩართვა' : 'ხმის გათიშვა'}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#8A2B49',
            cursor: 'pointer',
            padding: '4px',
            marginLeft: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <style>{`
        .eq-bar {
          width: 3px;
          height: 14px;
          background: #D9789E;
          border-radius: 2px;
          animation: eqPulse 1.2s ease-in-out infinite alternate;
        }
        .eq-bar-1 { animation-delay: 0.1s; }
        .eq-bar-2 { animation-delay: 0.3s; }
        .eq-bar-3 { animation-delay: 0.5s; }

        @keyframes eqPulse {
          0% { height: 4px; }
          100% { height: 16px; }
        }
      `}</style>
    </>
  );
}
