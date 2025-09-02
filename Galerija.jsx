import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './Galerija.css';

const API = 'http://localhost:4000';

export default function Galerija() {
  const [slike, setSlike] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  // helper za absolutni URL
  const imgSrc = (url) => {
    if (!url) return '';
    const u = String(url).trim();
    return u.startsWith('http') ? u : `${API}${u}`;
  };

  const fetchGalerija = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await axios.get(`${API}/galerija`);
      setSlike(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr('Greška pri učitavanju galerije.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalerija();
  }, [fetchGalerija]);

  const openLightbox = (i) => {
    setCurrent(i);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prev = (e) => {
    e?.stopPropagation?.();
    setCurrent((i) => (i === 0 ? slike.length - 1 : i - 1));
  };

  const next = (e) => {
    e?.stopPropagation?.();
    setCurrent((i) => (i === slike.length - 1 ? 0 : i + 1));
  };

  // Esc / ← →
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, slike.length]);

  return (
    <div className="galerija-page">
      <div className="galerija-hero">
        <h1>Galerija</h1>
        <p>Momenti sa utakmica, treninga i klupskih dešavanja.</p>
      </div>

      {err && <div className="g-alert">{err}</div>}

      {loading ? (
        <div className="g-skeleton-wrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="g-skeleton" />
          ))}
        </div>
      ) : (
        <div className="masonry">
          {slike.map((s, i) => (
            <figure
              className="masonry-item"
              key={s.id || i}
              onClick={() => openLightbox(i)}
              title="Klik za uvećanje"
            >
              <img
                src={imgSrc(s.slika)}
                alt={`galerija-${s.id}`}
                loading="lazy"
              />
              <figcaption># {s.id}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxOpen && slike.length > 0 && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lb-close" aria-label="Zatvori" onClick={closeLightbox}>×</button>
          <button className="lb-arrow left" aria-label="Prethodna" onClick={prev}>❮</button>
          <img
            className="lb-img"
            src={imgSrc(slike[current]?.slika)}
            alt="fullscreen"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="lb-arrow right" aria-label="Sljedeća" onClick={next}>❯</button>

          <div className="lb-meta" onClick={(e) => e.stopPropagation()}>
            <span>{current + 1} / {slike.length}</span>
            <a
              className="lb-open"
              href={imgSrc(slike[current]?.slika)}
              target="_blank"
              rel="noreferrer"
            >
              Otvori original
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
