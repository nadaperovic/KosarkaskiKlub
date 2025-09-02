
// src/components/Sponzori.jsx
import React from "react";


 
export default function Sponzori() {
  const sponzori = [
    "https://kksutjeska.com/wp-content/uploads/2022/02/epcg.jpg",
    "https://kksutjeska.com/wp-content/uploads/2022/02/logo-4.png",
    "https://kksutjeska.com/wp-content/uploads/2022/02/goranovic.png",
    "https://kksutjeska.com/wp-content/uploads/2022/11/Logo-novi-2017-dekoriva-co.jpg",
  ];

  return (
    <div style={styles.wrap}>
      <h3 style={styles.title}>Hvala što nas podržavate</h3>

      <div style={styles.viewport}>
        {/* Traka koja se pomjera – duplirana za neprimjetan loop */}
        <div style={styles.track}>
          {[...sponzori, ...sponzori].map((url, idx) => (
            <div key={idx} style={styles.item}>
              <img src={url} alt={`Sponzor ${idx + 1}`} style={styles.logo} />
            </div>
          ))}
        </div>

        {/* Fade maske sa strane */}
        <div style={{ ...styles.fade, ...styles.fadeLeft }} />
        <div style={{ ...styles.fade, ...styles.fadeRight }} />
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

          /* Beskonačna, glatka animacija bez pauze */
          @keyframes sponsorsScroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  wrap: {
    background: "#f9f9f9",
    padding: "30px 0 36px",
    marginTop: "40px",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: 22,
    color: "#222",
    fontSize: "1.6rem",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },
  viewport: {
    position: "relative",
    overflow: "hidden",
  },
  track: {
    display: "flex",
    width: "max-content",
    animation: "sponsorsScroll 22s linear infinite",
    willChange: "transform",
  },
  item: {
    flex: "0 0 auto",
    width: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  logo: {
    height: 70,
    objectFit: "contain",
    background: "#fff",
    padding: 8,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  fade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 60,
    pointerEvents: "none",
  },
  fadeLeft: {
    left: 0,
    background:
      "linear-gradient(to right, rgba(249,249,249,1) 0%, rgba(249,249,249,0) 100%)",
  },
  fadeRight: {
    right: 0,
    background:
      "linear-gradient(to left, rgba(249,249,249,1) 0%, rgba(249,249,249,0) 100%)",
  },
};


