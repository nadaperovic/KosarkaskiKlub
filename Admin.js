import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';


export default function Admin() {
  
  
const token = localStorage.getItem('token');
  // --- Igrači ---
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [pozicija, setPozicija] = useState('');
  const [broj, setBroj] = useState('');
  const [datumRodjenja, setDatum] = useState('');
  const [slikaUrl, setSlikaUrl] = useState('');
  const [idZaBrisanje, setIdZaBrisanje] = useState('');
  const [lista, setLista] = useState([]);

  // --- Vijesti ---
  const [naslov, setNaslov] = useState('');
  const [tekst, setTekst] = useState('');
  const [fajl, setFajl] = useState(null);
  const [vijesti, setVijesti] = useState([]);
  const [vijestIdZaBrisanje, setVijestIdZaBrisanje] = useState('');
  // --- TABELA (pozicija/klub/poeni) ---
const [tabela, setTabela] = useState([]);
const [tbPozicija, setTbPozicija] = useState('');
const [tbKlub, setTbKlub] = useState('');
const [tbPoeni, setTbPoeni] = useState('');
const [tbIdZaBrisanje, setTbIdZaBrisanje] = useState('');


  // --- Galerija ---
 const [galerija, setGalerija] = useState([]);           // lista slika iz baze
const [galerijaFajl, setGalerijaFajl] = useState(null); // izabrani fajl za upload
const [galerijaIdZaBrisanje, setGalerijaIdZaBrisanje] = useState(''); // ID za brisanje

// --- Treneri state ---
const [treneri, setTreneri] = useState([]);
const [trenerIme, setTrenerIme] = useState('');
const [trenerPrezime, setTrenerPrezime] = useState('');
const [trenerUloga, setTrenerUloga] = useState('');
const [trenerSlika, setTrenerSlika] = useState(null);



  useEffect(() => {
    fetchPlayers();
    fetchVijesti();
    fetchGalerija();
     fetchTabela(); 
      fetchTreneri();
  }, []);

  // ---- IGRAČI ----
  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/players', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLista(res.data);
    } catch {
      alert('Greška pri učitavanju igrača');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
     console.log("Klik na dugme radi!");
    const token = localStorage.getItem('token');
    if (!token) return alert('Niste ulogovani');

    try {
      await axios.post('http://localhost:4000/players', {
        ime, prezime, pozicija, broj_dresa: broj,
        datum_rodjenja: datumRodjenja,
        slika: slikaUrl
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert('Igrač dodat');
      setIme(''); setPrezime(''); setPozicija('');
      setBroj(''); setDatum(''); setSlikaUrl('');
      fetchPlayers();
    } catch {
      alert('Greška pri dodavanju igrača');
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!idZaBrisanje || !token) return;
    try {
      await axios.delete(`http://localhost:4000/players/${idZaBrisanje}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Igrač obrisan');
      setIdZaBrisanje('');
      fetchPlayers();
    } catch {
      alert('Greška pri brisanju');
    }
  };

  



// === TRENERI ===
async function fetchTreneri() {
  const res = await axios.get('http://localhost:4000/treneri');
  setTreneri(res.data);
}

async function dodajTrenera(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('ime', trenerIme);
  formData.append('prezime', trenerPrezime);
  formData.append('uloga', trenerUloga);
  if (trenerSlika) formData.append('slika', trenerSlika);

  await axios.post('http://localhost:4000/treneri', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  setTrenerIme('');
  setTrenerPrezime('');
  setTrenerUloga('');
  setTrenerSlika(null);
  fetchTreneri();
}

async function obrisiTrenera(id) {
  const token = localStorage.getItem('token');
  await axios.delete(`http://localhost:4000/treneri/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  fetchTreneri();
}









  // --- Upload za vijesti i galeriju ---
  const uploadSlike = async (fajl) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('slika', fajl);
    const res = await axios.post('http://localhost:4000/galerija', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.slika;
  };

  // ---- VIJESTI ----
  const fetchVijesti = async () => {
    try {
      const res = await axios.get('http://localhost:4000/novosti');
      setVijesti(res.data);
    } catch {
      alert('Greška pri učitavanju vijesti');
    }
  };

  const handleVijestAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!naslov || !tekst || !fajl || !token) return;

    try {
      const imageUrl = await uploadSlike(fajl);
      await axios.post('http://localhost:4000/novosti', {
        naslov, sadrzaj: tekst, slika: imageUrl
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert('Vijest dodata');
      setNaslov(''); setTekst(''); setFajl(null);
      fetchVijesti();
    } catch {
      alert('Greška pri dodavanju vijesti');
    }
  };

  const handleVijestDelete = async () => {
    const token = localStorage.getItem('token');
    if (!vijestIdZaBrisanje || !token) return;
    try {
      await axios.delete(`http://localhost:4000/novosti/${vijestIdZaBrisanje}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Vijest obrisana');
      setVijestIdZaBrisanje('');
      fetchVijesti();
    } catch {
      alert('Greška pri brisanju vijesti');
    }
  };
  // === TABELA ===
const fetchTabela = async () => {
  try {
    const res = await axios.get('http://localhost:4000/tabela');
    setTabela(res.data || []);
  } catch (err) {
    alert('Greška pri učitavanju tabele');
  }
};

const handleTabelaAdd = async (e) => {
  e.preventDefault();
  try {
    if (!tbPozicija || !tbKlub) {
      return alert('Unesi poziciju i klub (poeni može biti 0).');
    }
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:4000/tabela',
      {
        pozicija: Number(tbPozicija),
        klub: tbKlub,
        poeni: Number(tbPoeni || 0),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTbPozicija('');
    setTbKlub('');
    setTbPoeni('');
    await fetchTabela();
    alert('Red dodat u tabelu!');
  } catch (err) {
    console.error(err);
    alert('Greška pri dodavanju reda');
  }
};

const handleTabelaDelete = async () => {
  try {
    if (!tbIdZaBrisanje) return alert('Unesi ID reda za brisanje');
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:4000/tabela/${tbIdZaBrisanje}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTbIdZaBrisanje('');
    await fetchTabela();
    alert('Red obrisan');
  } catch (err) {
    console.error(err);
    alert('Greška pri brisanju reda');
  }
};


  // ---- GALERIJA ----
  const fetchGalerija = async () => {
    try {
      const res = await axios.get('http://localhost:4000/galerija');
      setGalerija(res.data);
    } catch {
      alert('Greška pri učitavanju galerije');
    }
  };

// --- GALERIJA
const handleGalerijaAdd = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Nisi ulogovan (nema tokena). Prijavi se pa probaj opet.');
    return;
  }
  if (!galerijaFajl) {
    alert('Prvo izaberi sliku.');
    return;
  }

  try {
    console.log('[GALERIJA] start upload', { fajl: galerijaFajl?.name });

    const formData = new FormData();
    
    formData.append('slika', galerijaFajl);

    const res = await axios.post('http://localhost:4000/galerija', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[GALERIJA] OK:', res.data);
    alert(res.data?.msg || 'Slika dodata!');
    setGalerijaFajl(null);
    
    if (e?.target?.reset) e.target.reset();
    fetchGalerija();
  } catch (err) {
    console.error('[GALERIJA] ERROR:', err?.response?.data || err);
    const msg =
      err?.response?.data?.msg ||
      err?.message ||
      'Greška pri dodavanju slike u galeriju';
    alert(msg);
  }
};


const handleGalerijaDelete = async () => {
  const token = localStorage.getItem('token');
  if (!galerijaIdZaBrisanje) {
    alert('Unesi ID slike za brisanje.');
    return;
  }
  try {
    const res = await axios.delete(
      `http://localhost:4000/galerija/${galerijaIdZaBrisanje}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('[GALERIJA DELETE] OK:', res.data);
    alert(res.data?.msg || 'Slika obrisana!');
    setGalerijaIdZaBrisanje('');
    fetchGalerija();
  } catch (err) {
    console.error('[GALERIJA DELETE] ERROR:', err?.response?.data || err);
    alert(err?.response?.data?.msg || 'Greška pri brisanju slike');
  }
};


  return (
    <div className="admin-container">
     {/* IGRAČI */}
      <section className="admin-section">
        <h3>Dodavanje igrača</h3>
        <form onSubmit={handleAdd}>
          <input type="text" placeholder="Ime" value={ime} onChange={e => setIme(e.target.value)} required />
          <input type="text" placeholder="Prezime" value={prezime} onChange={e => setPrezime(e.target.value)} required />
          <input type="text" placeholder="Pozicija" value={pozicija} onChange={e => setPozicija(e.target.value)} required />
          <input type="number" placeholder="Broj dresa" value={broj} onChange={e => setBroj(e.target.value)} required />
          <input type="date" placeholder="Datum rođenja" value={datumRodjenja} onChange={e => setDatum(e.target.value)} required />
          <input type="url" placeholder="https://link-na-sliku.jpg" value={slikaUrl} onChange={e => setSlikaUrl(e.target.value)} required />
          <button type="submit" className="btn">Dodaj igrača</button>
        </form>
      </section>

      <section className="admin-section">
        <h3>Brisanje igrača</h3>
        <input type="number" placeholder="ID igrača" value={idZaBrisanje} onChange={e => setIdZaBrisanje(e.target.value)} />
        <button className="btn delete-btn" onClick={handleDelete}>Obriši igrača</button>
      </section>

      <section className="admin-section">
        <h3>Lista igrača</h3>
        <ul>
          {lista.map(p => {
            const src = p.slika?.trim
              ? (p.slika.trim().startsWith('http') ? p.slika.trim() : `http://localhost:4000${p.slika.trim()}`)
              : '';
            return (
              <li key={p.id}>
                {p.id}: {p.ime} {p.prezime} ({p.pozicija} #{p.broj_dresa})<br />
                {src && <img src={src} alt={p.ime} style={{ width: '100px', marginTop: '5px' }} />}
              </li>
            );
          })}
        </ul>
      </section>

      {/* VIJESTI */}
      <section className="admin-section">
        <h3>Dodavanje vijesti</h3>
        <form onSubmit={handleVijestAdd}>
          <input
            type="text"
            placeholder="Naslov vijesti"
            value={naslov}
            onChange={e => setNaslov(e.target.value)}
            required
          />
          <textarea placeholder="Tekst vijesti" value={tekst} onChange={e => setTekst(e.target.value)} required />
          <input
            type="file"
            onChange={e => setFajl(e.target.files[0])}
            accept="image/*"
            required
          />
          <button type="submit" className="btn">Dodaj vijest</button>
        </form>
      </section>

      <section className="admin-section">
        <h3>Brisanje vijesti</h3>
        <input type="number" placeholder="ID vijesti" value={vijestIdZaBrisanje} onChange={e => setVijestIdZaBrisanje(e.target.value)} />
        <button className="btn delete-btn" onClick={handleVijestDelete}>Obriši vijest</button>
      </section>

      <section className="admin-section">
        <h3>Lista vijesti</h3>
        <ul>
          {vijesti.map(v => (
            <li key={v.id} style={{ marginBottom: 12 }}>
              <strong>{v.naslov || '(Bez naslova)'}</strong><br />
              {v.sadrzaj}<br />
              {v.slika && (
                <img
                  src={v.slika.startsWith('http') ? v.slika : `http://localhost:4000${v.slika}`}
                  alt="vijest"
                  style={{ width: '120px', marginTop: '5px', borderRadius: 8 }}
                />
              )}
            </li>
          ))}
        </ul>
      </section>
      {/* ================== TABELA (pozicija/klub/poeni) ================== */}
<section className="admin-section">
  <h3>Dodavanje reda u tabelu</h3>
  <form onSubmit={handleTabelaAdd} className="grid" style={{gap: 8}}>
    <input
      type="number"
      placeholder="Pozicija"
      value={tbPozicija}
      onChange={(e) => setTbPozicija(e.target.value)}
      required
    />
    <input
      type="text"
      placeholder="Klub"
      value={tbKlub}
      onChange={(e) => setTbKlub(e.target.value)}
      required
    />
    <input
      type="number"
      placeholder="Poeni"
      value={tbPoeni}
      onChange={(e) => setTbPoeni(e.target.value)}
      min="0"
    />
    <button type="submit" className="btn">Dodaj red</button>
  </form>
</section>

<section className="admin-section">
  <h3>Brisanje reda iz tabele</h3>
  <div className="grid" style={{gap: 8}}>
    <input
      type="number"
      placeholder="ID reda"
      value={tbIdZaBrisanje}
      onChange={(e) => setTbIdZaBrisanje(e.target.value)}
    />
    <button className="btn delete-btn" onClick={handleTabelaDelete}>Obriši red</button>
  </div>
</section>

<section className="admin-section">
  <h3>Tabela (pregled)</h3>
  <div style={{overflowX: 'auto'}}>
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Pozicija</th>
          <th>Klub</th>
          <th>Poeni</th>
        </tr>
      </thead>
      <tbody>
        {tabela.map((r) => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.pozicija}</td>
            <td>{r.klub}</td>
            <td>{r.poeni}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
<h2>Treneri</h2>
<form onSubmit={dodajTrenera}>
  <input type="text" placeholder="Ime" value={trenerIme} onChange={(e) => setTrenerIme(e.target.value)} required />
  <input type="text" placeholder="Prezime" value={trenerPrezime} onChange={(e) => setTrenerPrezime(e.target.value)} required />
  <input type="text" placeholder="Uloga" value={trenerUloga} onChange={(e) => setTrenerUloga(e.target.value)} required />
  <input type="file" onChange={(e) => setTrenerSlika(e.target.files[0])} />
  <button type="submit">Dodaj trenera</button>
</form>

<ul>
  {treneri.map((t) => (
    <li key={t.id}>
      {t.ime} {t.prezime} - {t.uloga}
      {t.slika && <img src={`http://localhost:4000${t.slika}`} alt={t.ime} width="80" />}
      <button onClick={() => obrisiTrenera(t.id)}>Obriši</button>
    </li>
  ))}
</ul>







   


      {/* GALERIJA */}
    {/* GALERIJA */}
<section className="admin-section">
  <h3>Dodavanje slika u galeriju</h3>
  <form onSubmit={handleGalerijaAdd}>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setGalerijaFajl(e.target.files[0])}
      required
    />
    {/* VAŽNO: type="submit" */}
    <button type="submit" className="btn">Dodaj u galeriju</button>
  </form>
</section>



      <section className="admin-section">
        <h3>Brisanje slike iz galerije</h3>
        <input type="number" placeholder="ID slike" value={galerijaIdZaBrisanje} onChange={e => setGalerijaIdZaBrisanje(e.target.value)} />
        <button className="btn delete-btn" onClick={handleGalerijaDelete}>Obriši sliku</button>
      </section>

      <section className="admin-section">
        <h3>Galerija (preview)</h3>
        <ul>
          {galerija.map(g => (
            <li key={g.id}>
              {g.id}<br />
              {g.slika && (
                <img
                  src={g.slika.startsWith('http') ? g.slika : `http://localhost:4000${g.slika}`}
                  alt="galerija"
                  style={{ width: '120px', marginTop: '5px', borderRadius: 8 }}
                />
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
