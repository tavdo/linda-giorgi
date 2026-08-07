import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_CONFIG = {
  adminPin: '2026',
  brideName: 'ლინდა',
  groomName: 'გიორგი',
  heroSubtitle: 'სიყვარულით გიწვევთ საქორწილო ზეიმზე',
  dateString: '29 აგვისტო, 2026',
  timeString: '18:00 საათი',
  locationCity: 'თბილისი, საქართველო',
  countdownTarget: '2026-08-29T18:00:00',
  
  storyTitle: 'ჩვენი ისტორია',
  storyText: 'ორი გული, ერთი გზა — და დღეს ის გზა თქვენც გვინდა გაგვიზიაროთ. ვწერთ ახალ თავს ჩვენი ცხოვრების წიგნში და გვსურს, რომ ეს დღე თქვენთან ერთად, სიყვარულითა და სიხარულით სავსე გავიხადოთ.',
  storySignature: 'ლინდა & გიორგი',

  venueName: 'რესტორანი „XXXXX“',
  venueAddress: 'თბილისი, საქართველო',
  venueMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tbilisi+Georgia+Wedding+Venue',
  
  dressCodeTitle: 'სადღესასწაულო & ელეგანტური',
  dressCodeSub: 'პასტელური & ნაზი ტონები',
  
  musicTrackSrc: '/assets/background-music.mp3',
  musicTrackTitle: 'საარშიყო — ჯანსუღ კახიძე',

  galleryTitle: 'გალერეა',
  gallerySubtitle: 'ჩვენი მომენტები — სიყვარულის ამბავი ფოტოებში',
  galleryPhotos: [
    { id: '1', src: '/assets/1.jpeg', alt: 'ლინდა და გიორგი — ფოტო 1', layout: 'tall' },
    { id: '2', src: '/assets/2.jpeg', alt: 'ლინდა და გიორგი — ფოტო 2', layout: 'wide' },
    { id: '3', src: '/assets/3.jpeg', alt: 'ლინდა და გიორგი — ფოტო 3', layout: 'square' },
    { id: '4', src: '/assets/4.jpeg', alt: 'ლინდა და გიორგი — ფოტო 4', layout: 'tall' },
    { id: '5', src: '/assets/5.jpeg', alt: 'ლინდა და გიორგი — ფოტო 5', layout: 'square' },
    { id: '6', src: '/assets/6.jpeg', alt: 'ლინდა და გიორგი — ფოტო 6', layout: 'wide' },
    { id: '7', src: '/assets/7.jpeg', alt: 'ლინდა და გიორგი — ფოტო 7', layout: 'square' },
    { id: '8', src: '/assets/8.jpeg', alt: 'ლინდა და გიორგი — ფოტო 8', layout: 'tall' },
    { id: '9', src: '/assets/9.jpeg', alt: 'ლინდა და გიორგი — ფოტო 9', layout: 'square' },
    { id: '10', src: '/assets/10.jpeg', alt: 'ლინდა და გიორგი — ფოტო 10', layout: 'wide' },
    { id: '11', src: '/assets/11.jpeg', alt: 'ლინდა და გიორგი — ფოტო 11', layout: 'tall' },
  ],

  footerMessage: 'თქვენი თანადგომა და სითბო ჩვენთვის ამ დღეს კიდევ უფრო განსაკუთრებულს გახდის. მოუთმენლად გელოდებით!',

  timelineEvents: [
    {
      id: '1',
      time: '17:30',
      title: 'სტუმრების მიღება',
      desc: 'მისალმება, კოქტეილი & მისასალმებელი სასმელები',
      iconName: 'GlassWater',
    },
    {
      id: '2',
      time: '18:00',
      title: 'საქორწინო ცერემონია',
      desc: 'სიყვარულის ფიცის დადება & ჯვრისწერა',
      iconName: 'Heart',
    },
    {
      id: '3',
      time: '19:30',
      title: 'სადღესასწაულო ვახშამი',
      desc: 'ქართული სუფრა, პირველი ცეკვა & სადღეგრძელოები',
      iconName: 'Utensils',
    },
    {
      id: '4',
      time: '22:00',
      title: 'ტორტის ჭრა',
      desc: 'საქორწინო ტორტი & ფეიერვერკი',
      iconName: 'Cake',
    },
    {
      id: '5',
      time: '22:30',
      title: 'წვეულება & DJ',
      desc: 'ცეკვები & გართობა გვიანობამდე',
      iconName: 'Music',
    },
  ],
};

const WeddingContext = createContext();

export function WeddingProvider({ children }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('wedding_site_config_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate from YouTube IDs to local MP3 background track
        if (!parsed.musicTrackSrc) {
          parsed.musicTrackSrc = DEFAULT_CONFIG.musicTrackSrc;
          if (
            !parsed.musicTrackTitle ||
            parsed.musicTrackTitle === 'Romantic Symphony' ||
            parsed.musicTrackTitle === 'საქორწინო მელოდია'
          ) {
            parsed.musicTrackTitle = DEFAULT_CONFIG.musicTrackTitle;
          }
        }
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          galleryPhotos: Array.isArray(parsed.galleryPhotos) && parsed.galleryPhotos.length
            ? parsed.galleryPhotos
            : DEFAULT_CONFIG.galleryPhotos,
          timelineEvents: Array.isArray(parsed.timelineEvents) && parsed.timelineEvents.length
            ? parsed.timelineEvents
            : DEFAULT_CONFIG.timelineEvents,
        };
      }
      return DEFAULT_CONFIG;
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  });

  const [rsvpResponses, setRsvpResponses] = useState(() => {
    try {
      const saved = localStorage.getItem('wedding_rsvp_list_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync config to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('wedding_site_config_v1', JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save wedding config to localStorage:', e);
    }
  }, [config]);

  // Sync RSVPs to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('wedding_rsvp_list_v1', JSON.stringify(rsvpResponses));
    } catch (e) {
      console.error('Failed to save RSVP list to localStorage:', e);
    }
  }, [rsvpResponses]);

  const updateConfig = (keyOrObject, value) => {
    if (typeof keyOrObject === 'object') {
      setConfig((prev) => ({ ...prev, ...keyOrObject }));
    } else {
      setConfig((prev) => ({ ...prev, [keyOrObject]: value }));
    }
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const addRsvpResponse = (response) => {
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('ka-GE'),
      ...response,
    };
    setRsvpResponses((prev) => [newEntry, ...prev]);
  };

  const deleteRsvpResponse = (id) => {
    setRsvpResponses((prev) => prev.filter((item) => item.id !== id));
  };

  const clearRsvps = () => {
    setRsvpResponses([]);
  };

  return (
    <WeddingContext.Provider
      value={{
        config,
        updateConfig,
        resetToDefaults,
        rsvpResponses,
        addRsvpResponse,
        deleteRsvpResponse,
        clearRsvps,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
}
