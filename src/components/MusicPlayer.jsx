import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

const parseYouTubeId = (input) => {
  if (!input) return '-Ai3nowbLU8';
  const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : input.trim();
};

export default function MusicPlayer() {
  const { config } = useWedding();
  const { musicTrackId, musicTrackTitle } = config;

  const cleanTrackId = parseYouTubeId(musicTrackId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    function initPlayer() {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player('yt-hidden-player', {
        height: '1',
        width: '1',
        videoId: cleanTrackId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: cleanTrackId,
          modestbranding: 1,
          disablekb: 1,
          fs: 0,
        },
        events: {
          onReady: () => {
            setIsLoaded(true);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          },
        },
      });
    }
  }, [cleanTrackId]);

  const togglePlay = () => {
    if (!playerRef.current || !isLoaded) {
      setIsPlaying(!isPlaying);
      return;
    }
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current || !isLoaded) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  return (
    <>
      {/* Hidden YouTube iframe container */}
      <div
        id="yt-hidden-player"
        style={{
          position: 'fixed',
          top: -100,
          left: -100,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Floating Glassmorphism Audio Control Bar */}
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
            {isPlaying ? musicTrackTitle || 'Romantic Symphony' : 'დააჭირეთ დასაკრავად'}
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
