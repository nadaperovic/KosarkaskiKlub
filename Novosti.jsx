import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Novosti.css';

export default function Novosti() {
  const [novosti, setNovosti] = useState([]);
  const [lightbox, setLightbox] = useState(null); // URL slike
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchNovosti = async () => {
      try {
        const res = await axios.get('http://localhost:4000/novosti');
        setNovosti(res.data);
      } catch (err) {
        console.error('Greška pri učitavanju novosti', err);
      }
    };
    fetchNovosti();
  }, []);

  // Scroll-reveal animacija
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cardsRef.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, [novosti]);

  // Zatvaranje lightboxa tipkom ESC
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') setLightbox(null);
    };
    if (lightbox) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const getImageSrc = slika =>
    !slika ? '' : (slika.startsWith('http') ? slika : `http://localhost:4000${slika}`);

  return (
    <main className="novosti-page">
      <h1 className="page-title">Novosti</h1>

      <div className="novosti-list">
        {novosti.map((n, i) => {
          // Fallback
          let naslov = n.naslov;
          let tekst = n.sadrzaj || '';
          if (!naslov && tekst) {
            const rec = tekst.split('.');
            naslov = (rec[0] || '').trim();
            tekst = rec.slice(1).join('.').trim();
          }

          const imgSrc = getImageSrc(n.slika);

          return (
            <article
              key={n.id}
              className="novost-card reveal"
              ref={el => (cardsRef.current[i] = el)}
            >
              {imgSrc && (
                <div className="novost-cover">
                  <img
                    src={imgSrc}
                    alt={naslov || 'Vijest'}
                    loading="lazy"
                    onClick={() => setLightbox(imgSrc)}
                    style={{ cursor: 'zoom-in' }}
                  />
                </div>
              )}

              <div className="novost-body">
                {naslov && <h2 className="novost-title">{naslov}</h2>}
                {tekst && <p className="novost-text">{tekst}</p>}
                {n.datum_objave && (
                  <time className="novost-date">
                    {new Date(n.datum_objave).toLocaleDateString()}
                  </time>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox – klik bilo gdje zatvara; radi i ESC */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Pregled slike" />
        </div>
      )}
    </main>
  );
}



