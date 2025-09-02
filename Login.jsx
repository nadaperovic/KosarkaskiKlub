import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import { Link } from "react-router-dom";

import './Login.css';

export default function Login() {
  const [f, setF] = useState({ username: "", password: "" });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/login", f);
      const token = res.data.token;

      const decoded = jwtDecode(token);

      localStorage.setItem("token", token);

      if (decoded.role === "admin") {
        nav("/admin");
      } else {
        nav("/home");
      }
    } catch (err) {
      alert("Greška pri prijavi");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h2>Prijava</h2>
        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Korisničko ime"
            value={f.username}
            onChange={(e) => setF({ ...f, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Lozinka"
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
            required
          />
          <button type="submit">Prijavi se</button>

       
 </form>

<div style={{ marginTop: 12, textAlign: 'center' }}>
  Nemate nalog?{' '}
  <Link to="/register" style={{ color: '#0b5bd3', fontWeight: 600 }}>
    Registrujte se
  </Link>
</div>

</div>
</div>
  );

}
    