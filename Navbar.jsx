import React from 'react';
import { Link } from 'react-router-dom';
import '../Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">LOGO</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Početna</Link></li>
        <li><Link to="/tim">Tim</Link></li>
        <li><Link to="/takmicenja">Takmičenja</Link></li>
        <li><Link to="/multimedija">Multimedija</Link></li>
        <li><Link to="/istorijat">Istorijat</Link></li>
        <li><Link to="/kontakt">Kontakt</Link></li>
      </ul>
    </nav>
  );
}
