// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerService } from '../services/api';
import './Register.css';

export default function Register() {
  const [ime, setIme]         = useState('');      
  const [prezime, setPrezime] = useState('');      
  const [korIme, setKorIme]   = useState('');
  const [email, setEmail]     = useState('');      
  const [lozinka, setLozinka] = useState('');
  const [errMsg, setErrMsg]   = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');

    
    const payload = {
      username: korIme,
      password: lozinka,
      
    };

    try {
      await registerService(payload);
      navigate('/login');
    } catch (error) {
      const backendMsg    = error.response?.data?.msg;
      const backendCode   = error.response?.data?.code;
      const backendDetail = error.response?.data?.detail;
      setErrMsg(
        backendMsg ||
        (backendCode ? `${backendCode}: ${backendDetail}` : 'Greška pri registraciji')
      );
    }
  };

  return (
    <div className="container">
      <h2>Registracija</h2>
      <form onSubmit={handleSubmit}>
        

        <label>Korisničko ime</label>
        <input
          value={korIme}
          onChange={e => setKorIme(e.target.value)}
          required
          placeholder="Odaberite korisničko ime"
        />

        <label>Email (opciono)</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder=""
        />

        <label>Lozinka</label>
        <input
          type="password"
          value={lozinka}
          onChange={e => setLozinka(e.target.value)}
          required
          placeholder="Unesite lozinku"
        />

        <button type="submit" className="btn">
          Registruj se
        </button>

        {errMsg && <p className="error">{errMsg}</p>}
      </form>

      {/* Link ka prijavi */}
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        Imate nalog?{' '}
        <Link to="/login" style={{ color: '#0b5bd3', fontWeight: 600 }}>
          Prijavi se
        </Link>
      </div>
    </div>
  );
}
