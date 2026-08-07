import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PHOTOS = Array.from({ length: 11 }, (_, i) => ({
  src: `/assets/${i + 1}.jpeg`,
  alt: `ლინდა და გიორგი — ფოტო ${i + 1}`,
}));

const LAYOUT = [
  'tall',
  'wide',
  'square',
  'tall',
  'square',
  'wide',
  'square',
  'tall',
  'square',
  'wide',
  'tall',
];

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const items = root.querySelectorAll('.gallery-item');
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
  }, []);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % PHOTOS.length);
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [activeIndex]);

  const openAt = (index) => setActiveIndex(index);
  const close = () => setActiveIndex(null);
  const prev = () => setActiveIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
  const next = () => setActiveIndex((i) => (i + 1) % PHOTOS.length);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="section-container gallery-section"
      style={{ background: 'transparent' }}
    >
      <h2 className="section-title">გალერეა</h2>
      <p className="section-subtitle">ჩვენი მომენტები — სიყვარულის ამბავი ფოტოებში</p>

      <div className="gallery-grid">
        {PHOTOS.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            className={`gallery-item gallery-${LAYOUT[index]}`}
            style={{ '--reveal-delay': `${(index % 6) * 90}ms` }}
            onClick={() => openAt(index)}
            aria-label={photo.alt}
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <span className="gallery-item-veil" aria-hidden="true" />
            <span className="gallery-item-frame" aria-hidden="true" />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="ფოტოს ნახვა">
          <button type="button" className="gallery-lightbox-backdrop" onClick={close} aria-label="დახურვა" />

          <div className="gallery-lightbox-stage">
            <img
              key={PHOTOS[activeIndex].src}
              src={PHOTOS[activeIndex].src}
              alt={PHOTOS[activeIndex].alt}
              className="gallery-lightbox-image"
            />

            <p className="gallery-lightbox-caption">
              {activeIndex + 1} / {PHOTOS.length}
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
