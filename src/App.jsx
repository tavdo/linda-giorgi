import React, { useState } from 'react';
import { WeddingProvider } from './context/WeddingContext';
import PetalsCanvas from './components/PetalsCanvas';
import MusicPlayer from './components/MusicPlayer';
import Hero from './components/Hero';
import StorySection from './components/StorySection';
import GallerySection from './components/GallerySection';
import TimelineSection from './components/TimelineSection';
import DetailsSection from './components/DetailsSection';
import RsvpSection from './components/RsvpSection';
import Footer from './components/Footer';
import VenueModal from './components/VenueModal';
import AdminPanelModal from './components/AdminPanelModal';

function MainLayout() {
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);

  const scrollToRsvp = () => {
    const el = document.getElementById('rsvp');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDetails = () => {
    const el = document.getElementById('details');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* Full Website Fixed Background Image & Overlay */}
      <div className="bg-fixed-image" />
      <div className="bg-overlay" />

      {/* Floating Petals Animation */}
      <PetalsCanvas />

      {/* Floating Background Music Player */}
      <MusicPlayer />

      {/* Hero Section */}
      <Hero onRsvpClick={scrollToRsvp} onDetailsClick={scrollToDetails} />

      {/* Story Section */}
      <StorySection />

      {/* Photo Gallery */}
      <GallerySection />

      {/* Day Schedule / Timeline Section */}
      <TimelineSection />

      {/* Event Details & Countdown */}
      <DetailsSection onOpenVenueModal={() => setIsVenueModalOpen(true)} />

      {/* RSVP Section */}
      <RsvpSection />

      {/* Footer */}
      <Footer />

      {/* Venue Location Modal */}
      <VenueModal isOpen={isVenueModalOpen} onClose={() => setIsVenueModalOpen(false)} />

      {/* Admin Panel Drawer & Trigger Button */}
      <AdminPanelModal />
    </div>
  );
}

export default function App() {
  return (
    <WeddingProvider>
      <MainLayout />
    </WeddingProvider>
  );
}
