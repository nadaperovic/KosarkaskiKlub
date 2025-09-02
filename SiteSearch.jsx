import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:4000';


const toImg = (val) => {
  if (!val) return '';
  const v = String(val).trim();
  if (/^https?:\/\//i.test(v)) return v;           // apsolutni URL
  const clean = v.replace(/^\/+/, '');             
  const rel = clean.startsWith('uploads/') ? `/${clean}` : `/uploads/${clean}`;
  return `${API_BASE}${rel}`;
};

export default function SiteSearch() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const [q, setQ] = useState(new URLSearchParams(search).get('q') || '');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ vijesti: [], igraci: [], treneri: [] });

  const fetchAll = async (query) => {
    const text = (query || '').trim();
    if (!text) { setData({ vijesti: [], igraci: [], treneri: [] }); return; }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/search?q=${encodeURIComponent(text)}`);
      setData(res.data || { vijesti: [], igraci: [], treneri: [] });
    } catch (err) {
      console.error('Greška pri pretrazi:', err.response?.data || err.message);
      setData({ vijesti: [], igraci: [], treneri: [] });
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const text = new URLSearchParams(search).get('q') || '';
    setQ(text);
    fetchAll(text);
  }, [search]);

  // submit forme na ovoj stranici
  const onSubmit = (e) => {
    e.preventDefault();
    const text = (q || '').trim();
    if (!text) return;
    navigate(`/pretraga?q=${encodeURIComponent(text)}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Pretraga</h2>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, margin: '12px 0 24px' }}>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Upiši pojam"
          style={{ padding: 8, flex: 1, borderRadius: 8, border: '1px solid #ccc' }}
        />
        
      </form>

      {loading && <div>Učitavanje…</div>}

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {/* VIJESTI */}
          <section>
            <h3>Vijesti ({data.vijesti?.length || 0})</h3>
            {(!data.vijesti || data.vijesti.length === 0) && <div>Nema rezultata.</div>}
            <ul>
              {(data.vijesti || []).map(v => {
                const src = toImg(v.slika);
                const preview = (v.sadrzaj || '').slice(0, 180);
                return (
                  <li key={v.id} style={{ marginBottom: 14 }}>
                    <Link
                      to={`/novosti?id=${v.id}`}
                      style={{ fontWeight: 700, textDecoration: 'none', color: '#0a58ca' }}
                    >
                      {v.naslov}
                    </Link>
                    {src && (
                      <div style={{ marginTop: 6 }}>
                        <Link to={`/novosti?id=${v.id}`}>
                          <img src={src} alt={v.naslov} style={{ maxWidth: 240, height: 'auto' }} />
                        </Link>
                      </div>
                    )}
                    {v.sadrzaj && (
                      <div style={{ whiteSpace: 'pre-wrap', marginTop: 6 }}>
                        {preview}{(v.sadrzaj || '').length > 180 ? '…' : ''}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* IGRAČI */}
          <section>
            <h3>Igrači ({data.igraci?.length || 0})</h3>
            {(!data.igraci || data.igraci.length === 0) && <div>Nema rezultata.</div>}
            <ul>
              {(data.igraci || []).map(p => {
                const src = toImg(p.slika);
                return (
                  <li key={p.id} style={{ marginBottom: 12 }}>
                    <Link
                      to={`/players?id=${p.id}`}
                      style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                    >
                      {src && (
                        <img
                          src={src}
                          alt={`${p.ime} ${p.prezime}`}
                          style={{ width: 60, height: 'auto', borderRadius: 6 }}
                        />
                      )}
                      <div>
                        <div><strong>{p.ime} {p.prezime}</strong> ({p.pozicija} #{p.broj_dresa})</div>
                        {p.datum_rodjenja && (
                          <small>Datum rođenja: {new Date(p.datum_rodjenja).toLocaleDateString()}</small>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* TRENERI */}
          <section>
            <h3>Treneri({data.treneri?.length || 0})</h3>
            {(!data.treneri || data.treneri.length === 0) && <div>Nema rezultata.</div>}
            <ul>
              {(data.treneri || []).map(t => {
                const src = toImg(t.slika);
                return (
                  <li key={t.id} style={{ marginBottom: 12 }}>
                    <Link
                      to={`/oklubu?trener=${t.id}`}
                      style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                    >
                      {src && (
                        <img
                          src={src}
                          alt={`${t.ime} ${t.prezime}`}
                          style={{ width: 60, height: 'auto', borderRadius: 6 }}
                        />
                      )}
                      <div>
                        <div><strong>{t.ime} {t.prezime}</strong> — {t.uloga}</div>
                        {t.datum_rodjenja && (
                          <small>Datum rođenja: {new Date(t.datum_rodjenja).toLocaleDateString()}</small>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}

