import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaSearch } from 'react-icons/fa';

function NavSearch() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const s = q.trim();
    if (!s) return;
    navigate(`/pretraga?q=${encodeURIComponent(s)}`);
    setQ('');
  };

  return (
    <form onSubmit={onSubmit} style={styles.searchForm}>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Pretraži sajt…"
        style={styles.searchInput}
      />
      <button type="submit" aria-label="Pretraži" style={styles.searchBtn}>
        <FaSearch />
      </button>
    </form>
  );
}

export default function Header() {
  return (
    <header style={styles.header}>
      {/* Login / Register umjesto grba */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link to="/login" style={styles.authLink}>Prijava</Link>
        <span style={styles.separator}>/</span>
        <Link to="/register" style={styles.authLink}>Registracija</Link>
      </div>

      {/* Navigacija */}
      <nav style={{ display: 'flex', gap: 25, alignItems: 'center' }}>
        <Link to="/" style={styles.link}>Početna</Link>
        <Link to="/novosti" style={styles.link}>Novosti</Link>
        <Link to="/players" style={styles.link}>Tim</Link>
        <Link to="/galerija" style={styles.link}>Galerija</Link>
        <Link to="/oklubu" style={styles.link}>O klubu</Link>
        <Link to="/utakmice" style={styles.link}>Utakmice</Link>
        <Link to="/kontakt" style={styles.link}>Kontakt</Link>
      </nav>

      {/* GLOBALNA PRETRAGA */}
      <NavSearch />

      {/* Društvene mreže */}
      <div style={{ display: 'flex', gap: '15px' }}>
        <a href="https://www.facebook.com/kksutjeskazvanicnastranica/?locale=sr_RS" target="_blank" rel="noopener noreferrer" style={styles.icon}>
          <FaFacebookF />
        </a>
        <a href="https://www.instagram.com/sutjeskakk/?hl=hr" target="_blank" rel="noopener noreferrer" style={styles.icon}>
          <FaInstagram />
        </a>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    padding: '12px 30px',
    background: 'linear-gradient(90deg, #004aad, #0073e6)',
    color: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
    flexWrap: 'wrap',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  authLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: '0.3s',
  },
  separator: {
    color: '#fff',
    fontWeight: 'bold',
  },
  icon: {
    color: '#fff',
    fontSize: '1.2rem',
    transition: '0.3s',
  },
  // --- novo ---
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#ffffff',
    borderRadius: 20,
    padding: '2px 6px 2px 10px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    minWidth: 180,
  },
  searchBtn: {
    border: 'none',
    background: 'transparent',
    color: '#004aad',
    cursor: 'pointer',
    fontSize: 16,
    padding: 4,
  },
};
