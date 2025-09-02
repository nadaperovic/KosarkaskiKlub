import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Players() {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:4000/players', {
          headers: { Authorization: 'Bearer ' + token },
        });
        setLista(res.data || []);
      } catch (err) {
        console.error(err);
        alert('Greška pri učitavanju igrača');
      }
    }
    fetchPlayers();
  }, []);

  const srcFor = (val) => {
    const raw = String(val || '').trim();
    if (!raw) return '';
    return raw.startsWith('http') ? raw
      : `http://localhost:4000${raw.startsWith('/') ? '' : '/'}${raw}`;
  };

  return (
    <div style={{ padding: 30 }}>
      <h2 style={{ textAlign: 'center', color: '#0044cc', marginBottom: 24 }}>
        PRVI TIM
      </h2>

      {/* Fiksno 4 kolone, pune pravougaone slike */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {lista.map((i) => {
          const src = srcFor(i.slika);

          return (
            <div
              key={i.id}
              style={{
                border: '1px solid #e5e7eb',
                background: '#fff',
              }}
            >
              <img
  src={src}
  alt={`${i.ime} ${i.prezime}`}
  style={{
    width: '100%',
    height: 450,
    objectFit: 'cover',   
    objectPosition: 'top', 
    display: 'block',
    borderRadius: 0
  }}
/>
              
              

              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700 }}>
                  {i.ime} {i.prezime}
                </div>
                <div style={{ color: '#444', marginTop: 4 }}>
                  {i.pozicija}{i.broj_dresa ? `, #${i.broj_dresa}` : ''}
                </div>
                <div style={{ color: '#666', marginTop: 6, fontSize: 14 }}>
                  Datum rođenja:{' '}
                  {i.datum_rodjenja
                    ? new Date(i.datum_rodjenja).toLocaleDateString()
                    : '—'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
