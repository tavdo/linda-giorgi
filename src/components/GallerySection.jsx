import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export default function GallerySection() {
  const { config } = useWedding();
  const {
    galleryTitle = 'გალერეა',
    gallerySubtitle = 'ჩვენი მომენტები — სიყვარულის ამბავი ფოტოებში',
    galleryPhotos = [],
  } = config;

  const photos = galleryPhotos.filter((p) => p?.src);
  const [activeIndex, setActiveIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const items = root.querySelectorAll('.gallery-item');
    items.forEach((item) => item.classList.remove('is-visible'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [photos.length, photos.map((p) => p.src).join('|')]);

  useEffect(() => {
    if (activeIndex === null || photos.length === 0) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [activeIndex, photos.length]);

  useEffect(() => {
    if (activeIndex !== null && activeIndex >= photos.length) {
      setActiveIndex(photos.length ? photos.length - 1 : null);
    }
  }, [activeIndex, photos.length]);

  if (!photos.length) return null;

  const openAt = (index) => setActiveIndex(index);
  const close = () => setActiveIndex(null);
  const prev = () => setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setActiveIndex((i) => (i + 1) % photos.length);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="section-container gallery-section"
      style={{ background: 'transparent' }}
    >
      <h2 className="section-title">{galleryTitle}</h2>
      <p className="section-subtitle">{gallerySubtitle}</p>

      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <button
            key={photo.id || `${photo.src}-${index}`}
            type="button"
            className={`gallery-item gallery-${photo.layout || 'square'}`}
            style={{ '--reveal-delay': `${(index % 6) * 90}ms` }}
            onClick={() => openAt(index)}
            aria-label={photo.alt || `ფოტო ${index + 1}`}
          >
            <img src={photo.src} alt={photo.alt || `ფოტო ${index + 1}`} loading="lazy" />
            <span className="gallery-item-veil" aria-hidden="true" />
            <span className="gallery-item-frame" aria-hidden="true" />
          </button>
        ))}
      </div>

      {activeIndex !== null && photos[activeIndex] && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="ფოტოს ნახვა">
          <button type="button" className="gallery-lightbox-backdrop" onClick={close} aria-label="დახურვა" />

          <div className="gallery-lightbox-stage">
            <img
              key={photos[activeIndex].src}
              src={photos[activeIndex].src}
              alt={photos[activeIndex].alt || `ფოტო ${activeIndex + 1}`}
              className="gallery-lightbox-image"
            />

            <p className="gallery-lightbox-caption">
              {activeIndex + 1} / {photos.length}
            </p>
          </div>

          <button type="button" className="gallery-lightbox-close" onClick={close} aria-label="დახურვა">
            <X size={22} />
          </button>

          <button type="button" className="gallery-lightbox-nav gallery-lightbox-prev" onClick={prev} aria-label="წინა">
            <ChevronLeft size={28} />
          </button>

          <button type="button" className="gallery-lightbox-nav gallery-lightbox-next" onClick={next} aria-label="შემდეგი">
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </section>
  );
}
