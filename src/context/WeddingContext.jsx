import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_CONFIG = {
  adminPin: '2026',
  brideName: 'ლინდა',
  groomName: 'გიორგი',
  heroSubtitle: 'სიყვარულით გიწვევთ საქორწილო ზეიმზე',
  dateString: '29 აგვისტო, 2026',
  timeString: '18:00 საათი',
  locationCity: 'ბათუმი, საქართველო',
  countdownTarget: '2026-08-29T18:00:00',

  storyTitle: 'ჩვენი ისტორია',
  storyText:
    'ერთ დღეს უბრალოდ ერთმანეთს შევხვდით, დღეს კი გვინდა, მთელი ცხოვრება ერთად გავატაროთ. ჩვენი სიყვარულის ყველაზე მნიშვნელოვანი დღე ახლოვდება და გვინდა, ეს სიხარული თქვენთან ერთად გავიზიაროთ.',
  storySignature: 'ლინდა & გიორგი',

  venueName: 'რესტორანი „ძველი ბათუმი“',
  venueAddress: 'ბათუმი, საქართველო',
  venueMapsUrl: 'https://maps.app.goo.gl/FtD6MSLd7C3dC8zC6',

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

  footerMessage:
    'თქვენი თანადგომა და სითბო ჩვენთვის ამ დღეს კიდევ უფრო განსაკუთრებულს გახდის. მოუთმენლად გელოდებით!',

  timelineEvents: [
    {
      id: '1',
      time: '13:00',
      title: 'შეხვედრა სამი სტუდიაში',
      desc: 'შეხვედრა',
      iconName: 'GlassWater',
    },
    {
      id: '2',
      time: '13:30',
      title: 'ფოტოსესია სამი სტუდიაში',
      desc: 'ფოტოსესია',
      iconName: 'Sparkles',
    },
    {
      id: '3',
      time: '15:30',
      title: 'ხელის მოწერის ცერემონია',
      desc: 'სიყვარულის ფიცის დადება & ფურშეტი',
      iconName: 'Heart',
    },
    {
      id: '4',
      time: '17:00',
      title: 'ფოტოსესია ძველი ბათუმში',
      desc: 'ფოტოსესია',
      iconName: 'Sparkles',
    },
    {
      id: '5',
      time: '18:00',
      title: 'საქორწილო წვეულება',
      desc: 'ცეკვები & გართობა გვიანობამდე',
      iconName: 'Music',
    },
    {
      id: '6',
      time: '21:30',
      title: 'ტორტის გაჭრა',
      desc: 'ტორტის გაჭრა',
      iconName: 'Cake',
    },
  ],
};

// Wedding content that must stay fixed (not overwritten by localStorage / admin edits)
const STATIC_KEYS = [
  'brideName',
  'groomName',
  'heroSubtitle',
  'dateString',
  'timeString',
  'locationCity',
  'countdownTarget',
  'storyTitle',
  'storyText',
  'storySignature',
  'venueName',
  'venueAddress',
  'venueMapsUrl',
  'timelineEvents',
];

const EDITABLE_KEYS = [
  'adminPin',
  'dressCodeTitle',
  'dressCodeSub',
  'musicTrackSrc',
  'musicTrackTitle',
  'galleryTitle',
  'gallerySubtitle',
  'galleryPhotos',
  'footerMessage',
];

const pickEditable = (source = {}) => {
  const next = {};
  EDITABLE_KEYS.forEach((key) => {
    if (source[key] !== undefined) next[key] = source[key];
  });
  return next;
};

const withStaticConfig = (source = {}) => ({
  ...DEFAULT_CONFIG,
  ...pickEditable(source),
  galleryPhotos:
    Array.isArray(source.galleryPhotos) && source.galleryPhotos.length
      ? source.galleryPhotos
      : DEFAULT_CONFIG.galleryPhotos,
  // Always lock wedding details to the fixed defaults
  ...Object.fromEntries(STATIC_KEYS.map((key) => [key, DEFAULT_CONFIG[key]])),
});

const WeddingContext = createContext();

export function WeddingProvider({ children }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('wedding_site_config_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
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
        return withStaticConfig(parsed);
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
      localStorage.setItem('wedding_site_config_v1', JSON.stringify(withStaticConfig(config)));
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
    setConfig((prev) => {
      if (typeof keyOrObject === 'object') {
        const allowed = pickEditable(keyOrObject);
        return withStaticConfig({ ...prev, ...allowed });
      }
      if (!EDITABLE_KEYS.includes(keyOrObject)) {
        return prev;
      }
      return withStaticConfig({ ...prev, [keyOrObject]: value });
    });
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
        isStaticKey: (key) => STATIC_KEYS.includes(key),
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
