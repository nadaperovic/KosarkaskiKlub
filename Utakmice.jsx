// src/pages/Utakmice.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Utakmice() {
  
  const utakmice = [
    {
      datum: "8. 10. 2025.",
      vrijeme: "18:00",
      tim1: "https://kksutjeska.com/wp-content/uploads/2022/11/download-22.png",
      tim2: "https://kksutjeska.com/wp-content/uploads/2022/11/37.png",
    },
    {
      datum: "22. 10. 2025.",
      vrijeme: "20:00",
      tim1: "https://kksutjeska.com/wp-content/uploads/2022/11/37.png",
      tim2: "https://kksutjeska.com/wp-content/uploads/2023/10/MZT.jpg",
    },
    {
      datum: "11. 11. 2025.",
      vrijeme: "18:00",
      tim1: "https://kksutjeska.com/wp-content/uploads/2025/07/download.png",
      tim2: "https://kksutjeska.com/wp-content/uploads/2022/11/37.png",
    },
    {
      datum: "9. 12. 2025.",
      vrijeme: "18:00",
      tim1: "https://kksutjeska.com/wp-content/uploads/2022/11/37.png",
      tim2: "https://kksutjeska.com/wp-content/uploads/2023/01/70.png",
    },
  ];

  // ----------------- TABELA: STATE + FETCH -----------------
  const [tabela, setTabela] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchTabela = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await axios.get("http://localhost:4000/tabela");
      // backend već sortira, ali za svaki slučaj:
      const rows = (res.data || []).sort((a, b) =>
        a.pozicija === b.pozicija ? b.poeni - a.poeni : a.pozicija - b.pozicija
      );
      setTabela(rows);
    } catch (e) {
      setErr("Greška pri učitavanju tabele.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabela();
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #052c7a, #021234)",
        color: "#fff",
        minHeight: "100vh",
        padding: "32px 16px",
      }}
    >
      {/* NASLOV */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: 40,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        MEČEVI NLB ABA2 LIGA
      </h1>

      {/* LISTA MEČEVA */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {utakmice.map((u, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              gap: 32,
              padding: "16px 12px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              marginBottom: 24,
            }}
          >
            <div style={{ textAlign: "right" }}>
              <img
                src={u.tim1}
                alt="Tim 1"
                style={{ height: 96, objectFit: "contain" }}
              />
            </div>

            <div style={{ textAlign: "center", lineHeight: 1.4 }}>
              <div style={{ fontWeight: 700 }}>{u.datum}</div>
              <div style={{ opacity: 0.9 }}>{u.vrijeme}</div>
            </div>

            <div style={{ textAlign: "left" }}>
              <img
                src={u.tim2}
                alt="Tim 2"
                style={{ height: 96, objectFit: "contain" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* RAZDJELNIK */}
      <div
        style={{
          maxWidth: 1000,
          margin: "48px auto 24px",
          height: 1,
          background: "rgba(255,255,255,0.1)",
        }}
      />

      {/* NASLOV TABELE */}
      <h2
        style={{
          textAlign: "center",
          marginBottom: 20,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        PRVA A MCKL-TABELA 
      </h2>

      {/* TABELA – PRIKAZ IZ BAZE */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "90px 1fr 90px",
              padding: "14px 16px",
              fontWeight: 700,
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ textAlign: "center" }}>Poz.</div>
            <div>Klub</div>
            <div style={{ textAlign: "center" }}>Poeni</div>
          </div>

          {loading ? (
            <div style={{ padding: 16, textAlign: "center" }}>Učitavanje…</div>
          ) : err ? (
            <div style={{ padding: 16, textAlign: "center", color: "#ffb3b3" }}>
              {err}
            </div>
          ) : tabela.length === 0 ? (
            <div style={{ padding: 16, textAlign: "center" }}>
              Nema podataka u tabeli.
            </div>
          ) : (
            tabela.map((row) => (
              <div
                key={row.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr 90px",
                  padding: "12px 16px",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "center", opacity: 0.9 }}>
                  {row.pozicija}
                </div>
                <div style={{ fontWeight: 600 }}>{row.klub}</div>
                <div style={{ textAlign: "center", fontWeight: 700 }}>
                  {row.poeni}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
