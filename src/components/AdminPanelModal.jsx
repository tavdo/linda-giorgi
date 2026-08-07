import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import {
  Settings,
  X,
  User,
  Clock,
  MapPin,
  Music,
  Plus,
  Trash2,
  RotateCcw,
  Users,
  Download,
  FileText,
  Lock,
  KeyRound,
  ShieldCheck,
  Images,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export default function AdminPanelModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const { config, updateConfig, resetToDefaults, rsvpResponses, deleteRsvpResponse, clearRsvps } = useWedding();

  const handleUnlock = (e) => {
    e.preventDefault();
    const correctPin = config.adminPin || '2026';
    if (pinInput.trim() === correctPin) {
      setIsUnlocked(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('არასწორი PIN კოდი!');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setPinInput('');
    setPinError('');
  };

  // Helper for timeline events edit
  const handleTimelineChange = (id, field, value) => {
    const updated = config.timelineEvents.map((ev) =>
      ev.id === id ? { ...ev, [field]: value } : ev
    );
    updateConfig('timelineEvents', updated);
  };

  const addTimelineEvent = () => {
    const newEv = {
      id: Date.now().toString(),
      time: '20:00',
      title: 'ახალი მოვლენა',
      desc: 'აღწერა...',
      iconName: 'Sparkles',
    };
    updateConfig('timelineEvents', [...config.timelineEvents, newEv]);
  };

  const removeTimelineEvent = (id) => {
    updateConfig(
      'timelineEvents',
      config.timelineEvents.filter((ev) => ev.id !== id)
    );
  };

  const galleryPhotos = Array.isArray(config.galleryPhotos) ? config.galleryPhotos : [];

  const handleGalleryPhotoChange = (id, field, value) => {
    updateConfig(
      'galleryPhotos',
      galleryPhotos.map((photo) => (photo.id === id ? { ...photo, [field]: value } : photo))
    );
  };

  const addGalleryPhoto = () => {
    const nextNum = galleryPhotos.length + 1;
    updateConfig('galleryPhotos', [
      ...galleryPhotos,
      {
        id: Date.now().toString(),
        src: `/assets/${nextNum}.jpeg`,
        alt: `ლინდა და გიორგი — ფოტო ${nextNum}`,
        layout: 'square',
      },
    ]);
  };

  const removeGalleryPhoto = (id) => {
    updateConfig(
      'galleryPhotos',
      galleryPhotos.filter((photo) => photo.id !== id)
    );
  };

  const moveGalleryPhoto = (id, direction) => {
    const index = galleryPhotos.findIndex((photo) => photo.id === id);
    if (index < 0) return;
    const target = index + direction;
    if (target < 0 || target >= galleryPhotos.length) return;
    const next = [...galleryPhotos];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    updateConfig('galleryPhotos', next);
  };

  const handleGalleryUpload = (id, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleGalleryPhotoChange(id, 'src', reader.result);
    };
    reader.readAsDataURL(file);
  };

  // CSV Export for RSVPs
  const exportRsvpsCsv = () => {
    if (rsvpResponses.length === 0) return;
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'თარიღი,სახელი,სტატუსი,სტუმრები,კვება/ალერგია,სურვილი\n';

    rsvpResponses.forEach((r) => {
      const row = [
        `"${r.timestamp || ''}"`,
        `"${r.name || ''}"`,
        `"${r.attendance === 'attending' ? 'ესწრება' : 'ვერ ესწრება'}"`,
        `"${r.guestCount || '1'}"`,
        `"${(r.dietary || '').replace(/"/g, '""')}"`,
        `"${(r.message || '').replace(/"/g, '""')}"`,
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wedding_rsvps_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const attendingCount = rsvpResponses.filter((r) => r.attendance === 'attending').length;
  const totalGuestsCount = rsvpResponses
    .filter((r) => r.attendance === 'attending')
    .reduce((acc, curr) => {
      const count = parseInt(curr.guestCount) || 1;
      return acc + count;
    }, 0);

  return (
    <>
      {/* Floating Admin Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="ადმინ პანელი"
        title="საიტის ტექსტებისა და პარამეტრების რედაქტირება (PIN დაცული)"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 60,
          background: 'linear-gradient(135deg, #3A2E32, #591629)',
          color: '#FAF4EE',
          border: '1px solid rgba(229, 200, 140, 0.4)',
          borderRadius: '30px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '1px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.3s ease',
        }}
      >
        <Lock size={15} color="#EAD08B" />
        ადმინ პანელი
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 150,
            background: 'rgba(30, 22, 25, 0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={handleClose}
        >
          {!isUnlocked ? (
            /* PIN UNLOCK SCREEN */
            <div
              className="glass-card"
              style={{
                background: '#FFFFFF',
                maxWidth: '400px',
                width: '100%',
                padding: '36px 28px',
                borderRadius: '24px',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--ink-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>

              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--cream-soft)',
                  color: 'var(--burgundy)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <KeyRound size={28} />
              </div>

              <h3 className="font-heading" style={{ fontSize: '22px', color: 'var(--burgundy)', marginBottom: '8px' }}>
                ადმინ პანელზე წვდომა
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '24px' }}>
                შეიყვანეთ უსაფრთხოების PIN კოდი (Default PIN: <b>2026</b>)
              </p>

              <form onSubmit={handleUnlock}>
                <input
                  type="password"
                  autoFocus
                  placeholder="PIN კოდი"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: pinError ? '2px solid #DC2626' : '1px solid var(--glass-border)',
                    fontSize: '18px',
                    textAlign: 'center',
                    letterSpacing: '4px',
                    outline: 'none',
                    marginBottom: '12px',
                  }}
                />

                {pinError && (
                  <div style={{ color: '#DC2626', fontSize: '13px', marginBottom: '14px' }}>
                    {pinError}
                  </div>
                )}

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <ShieldCheck size={16} /> განბლოკვა
                </button>
              </form>
            </div>
          ) : (
            /* FULL UNLOCKED ADMIN CMS PANEL */
            <div
              className="glass-card"
              style={{
                background: '#FFFFFF',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: '20px 28px',
                  background: 'var(--cream-soft)',
                  borderBottom: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--burgundy)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Settings size={18} />
                  </div>
                  <div>
                    <h3
                      className="font-heading"
                      style={{ fontSize: '20px', color: 'var(--burgundy)', margin: 0 }}
                    >
                      მართვის პანელი (Admin CMS)
                    </h3>
                    <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                      შეცვალეთ ნებისმიერი ტექსტი &amp; მონაცემი რეალურ დროში
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => {
                      if (window.confirm('დარწმუნებული ხართ, რომ გსურთ საწყისი პარამეტრების აღდგენა?')) {
                        resetToDefaults();
                      }
                    }}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '11px' }}
                    title="საწყისი ტექსტების დაბრუნება"
                  >
                    <RotateCcw size={14} />
                    აღდგენა
                  </button>

                  <button
                    onClick={handleClose}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--ink-dark)',
                      cursor: 'pointer',
                      padding: '6px',
                      display: 'flex',
                    }}
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid #EAE2D9',
                  background: '#FDFBF7',
                  overflowX: 'auto',
                  padding: '0 16px',
                }}
              >
                {[
                  { id: 'general', label: '💑 წყვილი & ჰერო', icon: <User size={15} /> },
                  { id: 'story', label: '📖 ისტორია', icon: <FileText size={15} /> },
                  { id: 'gallery', label: '🖼️ გალერეა', icon: <Images size={15} /> },
                  { id: 'venue', label: '📍 დეტალები & რუკა', icon: <MapPin size={15} /> },
                  { id: 'timeline', label: '🕒 განრიგი', icon: <Clock size={15} /> },
                  { id: 'music', label: '🎵 მუსიკა', icon: <Music size={15} /> },
                  { id: 'rsvp', label: `💌 RSVP (${rsvpResponses.length})`, icon: <Users size={15} /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '14px 18px',
                      border: 'none',
                      background: 'transparent',
                      borderBottom: activeTab === tab.id ? '2px solid var(--burgundy)' : '2px solid transparent',
                      color: activeTab === tab.id ? 'var(--burgundy)' : 'var(--ink-muted)',
                      fontWeight: activeTab === tab.id ? 600 : 500,
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Body Contents */}
              <div
                style={{
                  padding: '28px',
                  overflowY: 'auto',
                  flex: 1,
                }}
              >
                {/* TAB 1: GENERAL & HERO */}
                {activeTab === 'general' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label className="admin-label">პატარძლის სახელი</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.brideName}
                        onChange={(e) => updateConfig('brideName', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="admin-label">სიძის სახელი</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.groomName}
                        onChange={(e) => updateConfig('groomName', e.target.value)}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="admin-label">ადმინ PIN კოდი (Admin Password)</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.adminPin || '2026'}
                        onChange={(e) => updateConfig('adminPin', e.target.value)}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="admin-label">სათაური / ქვესათაური (Hero Tagline)</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.heroSubtitle}
                        onChange={(e) => updateConfig('heroSubtitle', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="admin-label">თარიღის ტექსტი (Hero Date)</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.dateString}
                        onChange={(e) => updateConfig('dateString', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="admin-label">დროის ტექსტი (Hero Time)</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.timeString}
                        onChange={(e) => updateConfig('timeString', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="admin-label">ქალაქი / ქვეყანა</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.locationCity}
                        onChange={(e) => updateConfig('locationCity', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="admin-label">Countdown სამიზნე თარიღი</label>
                      <input
                        className="admin-input"
                        type="datetime-local"
                        value={config.countdownTarget.slice(0, 16)}
                        onChange={(e) => updateConfig('countdownTarget', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: STORY */}
                {activeTab === 'story' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label className="admin-label">სექციის სათაური</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.storyTitle}
                        onChange={(e) => updateConfig('storyTitle', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="admin-label">ისტორიის ტექსტი</label>
                      <textarea
                        className="admin-input"
                        rows="5"
                        value={config.storyText}
                        onChange={(e) => updateConfig('storyText', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="admin-label">ხელმოწერა / ხელმოწერები</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.storySignature}
                        onChange={(e) => updateConfig('storySignature', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* TAB: GALLERY */}
                {activeTab === 'gallery' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label className="admin-label">სექციის სათაური</label>
                        <input
                          className="admin-input"
                          type="text"
                          value={config.galleryTitle || ''}
                          onChange={(e) => updateConfig('galleryTitle', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="admin-label">ქვესათაური</label>
                        <input
                          className="admin-input"
                          type="text"
                          value={config.gallerySubtitle || ''}
                          onChange={(e) => updateConfig('gallerySubtitle', e.target.value)}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                        ფოტოები ({galleryPhotos.length}) — გზა `/assets/...` ან ატვირთვა
                      </span>
                      <button
                        onClick={addGalleryPhoto}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '12px' }}
                      >
                        <Plus size={14} /> ფოტოს დამატება
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {galleryPhotos.map((photo, index) => (
                        <div
                          key={photo.id}
                          style={{
                            padding: '16px',
                            border: '1px solid #EAE2D9',
                            borderRadius: '12px',
                            background: '#FDFBF7',
                            display: 'grid',
                            gridTemplateColumns: '88px 1fr auto',
                            gap: '14px',
                            alignItems: 'start',
                          }}
                        >
                          <div
                            style={{
                              width: '88px',
                              height: '88px',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              background: '#EAE2D9',
                              border: '1px solid #EAE2D9',
                            }}
                          >
                            {photo.src ? (
                              <img
                                src={photo.src}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : null}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
                            <div>
                              <label className="admin-label">ფოტოს გზა / URL</label>
                              <input
                                className="admin-input"
                                type="text"
                                value={photo.src || ''}
                                placeholder="/assets/1.jpeg"
                                onChange={(e) => handleGalleryPhotoChange(photo.id, 'src', e.target.value)}
                              />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '10px' }}>
                              <div>
                                <label className="admin-label">აღწერა (Alt)</label>
                                <input
                                  className="admin-input"
                                  type="text"
                                  value={photo.alt || ''}
                                  onChange={(e) => handleGalleryPhotoChange(photo.id, 'alt', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="admin-label">ზომა</label>
                                <select
                                  className="admin-input"
                                  value={photo.layout || 'square'}
                                  onChange={(e) => handleGalleryPhotoChange(photo.id, 'layout', e.target.value)}
                                >
                                  <option value="tall">მაღალი</option>
                                  <option value="wide">ფართო</option>
                                  <option value="square">კვადრატი</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="admin-label">ახალი ფოტოს ატვირთვა</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleGalleryUpload(photo.id, file);
                                  e.target.value = '';
                                }}
                                style={{ fontSize: '13px', color: 'var(--ink-muted)' }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => moveGalleryPhoto(photo.id, -1)}
                              disabled={index === 0}
                              title="ზემოთ"
                              style={{
                                background: '#FFFFFF',
                                border: '1px solid #EAE2D9',
                                borderRadius: '8px',
                                padding: '8px',
                                cursor: index === 0 ? 'not-allowed' : 'pointer',
                                opacity: index === 0 ? 0.4 : 1,
                              }}
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveGalleryPhoto(photo.id, 1)}
                              disabled={index === galleryPhotos.length - 1}
                              title="ქვემოთ"
                              style={{
                                background: '#FFFFFF',
                                border: '1px solid #EAE2D9',
                                borderRadius: '8px',
                                padding: '8px',
                                cursor: index === galleryPhotos.length - 1 ? 'not-allowed' : 'pointer',
                                opacity: index === galleryPhotos.length - 1 ? 0.4 : 1,
                              }}
                            >
                              <ArrowDown size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeGalleryPhoto(photo.id)}
                              title="წაშლა"
                              style={{
                                background: '#FEE2E2',
                                color: '#DC2626',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: VENUE & DETAILS */}
                {activeTab === 'venue' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label className="admin-label">რესტორანი / ადგილის დასახელება</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.venueName}
                        onChange={(e) => updateConfig('venueName', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="admin-label">მისამართი / ქალაქი</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.venueAddress}
                        onChange={(e) => updateConfig('venueAddress', e.target.value)}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="admin-label">Google Maps რუკის ბმული (URL)</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.venueMapsUrl}
                        onChange={(e) => updateConfig('venueMapsUrl', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="admin-label">დრესკოდის სათაური</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.dressCodeTitle}
                        onChange={(e) => updateConfig('dressCodeTitle', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="admin-label">დრესკოდის აღწერა</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.dressCodeSub}
                        onChange={(e) => updateConfig('dressCodeSub', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 4: TIMELINE */}
                {activeTab === 'timeline' && (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                      }}
                    >
                      <span style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                        დღის განრიგის მოვლენები
                      </span>
                      <button onClick={addTimelineEvent} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                        <Plus size={14} /> მოვლენის დამატება
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {config.timelineEvents.map((ev) => (
                        <div
                          key={ev.id}
                          style={{
                            padding: '16px',
                            border: '1px solid #EAE2D9',
                            borderRadius: '12px',
                            background: '#FDFBF7',
                            display: 'grid',
                            gridTemplateColumns: '100px 1fr 2fr 40px',
                            gap: '12px',
                            alignItems: 'center',
                          }}
                        >
                          <input
                            className="admin-input"
                            type="text"
                            value={ev.time}
                            placeholder="18:00"
                            onChange={(e) => handleTimelineChange(ev.id, 'time', e.target.value)}
                          />
                          <input
                            className="admin-input"
                            type="text"
                            value={ev.title}
                            placeholder="სათაური"
                            onChange={(e) => handleTimelineChange(ev.id, 'title', e.target.value)}
                          />
                          <input
                            className="admin-input"
                            type="text"
                            value={ev.desc}
                            placeholder="აღწერა"
                            onChange={(e) => handleTimelineChange(ev.id, 'desc', e.target.value)}
                          />
                          <button
                            onClick={() => removeTimelineEvent(ev.id)}
                            style={{
                              background: '#FEE2E2',
                              color: '#DC2626',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5: MUSIC */}
                {activeTab === 'music' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label className="admin-label">აუდიო ფაილის გზა / URL</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.musicTrackSrc || '/assets/background-music.mp3'}
                        onChange={(e) => updateConfig('musicTrackSrc', e.target.value)}
                      />
                      <span style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '4px', display: 'block' }}>
                        მაგ: <b>/assets/background-music.mp3</b>
                      </span>
                    </div>

                    <div>
                      <label className="admin-label">სიმღერის დასახელება (Player Label)</label>
                      <input
                        className="admin-input"
                        type="text"
                        value={config.musicTrackTitle}
                        onChange={(e) => updateConfig('musicTrackTitle', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 6: RSVP RESPONSES LIST */}
                {activeTab === 'rsvp' && (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: 600 }}>
                        <span style={{ color: 'var(--burgundy)' }}>
                          ესწრება: {attendingCount} განაცხადი (სულ {totalGuestsCount} პერსონა)
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={exportRsvpsCsv}
                          disabled={rsvpResponses.length === 0}
                          className="btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '12px' }}
                        >
                          <Download size={14} /> CSV ექსპორტი
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm('დარწმუნებული ხართ, რომ გსურთ RSVP სიის სრულად წაშლა?')) {
                              clearRsvps();
                            }
                          }}
                          style={{
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            borderRadius: '50px',
                            padding: '8px 16px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          სიის გასუფთავება
                        </button>
                      </div>
                    </div>

                    {rsvpResponses.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-muted)' }}>
                        ჯერ არ არის RSVP განაცხადები.
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table
                          style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '14px',
                            textAlign: 'left',
                          }}
                        >
                          <thead>
                            <tr style={{ background: '#FAF4EE', color: 'var(--burgundy)' }}>
                              <th style={{ padding: '12px' }}>თარიღი</th>
                              <th style={{ padding: '12px' }}>სახელი</th>
                              <th style={{ padding: '12px' }}>სტატუსი</th>
                              <th style={{ padding: '12px' }}>სტუმრები</th>
                              <th style={{ padding: '12px' }}>კვება / შენიშვნა</th>
                              <th style={{ padding: '12px' }}>სურვილი</th>
                              <th style={{ padding: '12px' }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {rsvpResponses.map((item) => (
                              <tr key={item.id} style={{ borderBottom: '1px solid #EAE2D9' }}>
                                <td style={{ padding: '12px', fontSize: '12px', color: 'var(--ink-muted)' }}>
                                  {item.timestamp}
                                </td>
                                <td style={{ padding: '12px', fontWeight: 600 }}>{item.name}</td>
                                <td style={{ padding: '12px' }}>
                                  <span
                                    style={{
                                      padding: '4px 10px',
                                      borderRadius: '12px',
                                      fontSize: '12px',
                                      background: item.attendance === 'attending' ? '#D1FAE5' : '#FEE2E2',
                                      color: item.attendance === 'attending' ? '#065F46' : '#991B1B',
                                    }}
                                  >
                                    {item.attendance === 'attending' ? 'ესწრება' : 'ვერ შეძლებს'}
                                  </span>
                                </td>
                                <td style={{ padding: '12px' }}>{item.guestCount}</td>
                                <td style={{ padding: '12px' }}>{item.dietary || '-'}</td>
                                <td style={{ padding: '12px', fontStyle: 'italic' }}>{item.message || '-'}</td>
                                <td style={{ padding: '12px' }}>
                                  <button
                                    onClick={() => deleteRsvpResponse(item.id)}
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      color: '#DC2626',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .admin-label {
          display: block;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: var(--burgundy);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .admin-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #EAE2D9;
          background: #FFFFFF;
          font-size: 15px;
          font-family: 'Cormorant Garamond', serif;
          color: var(--ink-dark);
          outline: none;
          box-sizing: border-box;
        }
        .admin-input:focus {
          border-color: var(--burgundy);
        }
      `}</style>
    </>
  );
}
