import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OKlubu() {
  const [treneri, setTreneri] = useState([]);

  useEffect(() => {
    fetchTreneri();
  }, []);

  async function fetchTreneri() {
    try {
      const res = await axios.get("http://localhost:4000/treneri");
      setTreneri(res.data);
    } catch (err) {
      console.error("Greška pri učitavanju trenera:", err);
    }
  }

  return (
    <div style={sx.page}>
      {/* O klubu */}
      <section style={sx.sectionCard}>
        <h1 style={sx.title}>O klubu</h1>
        <div style={sx.divider} />
        <p style={sx.text}>
          Sutjeska je košarkaški klub iz Nikšića, osnovan 1948. godine. Takmiči
          se u Prvoj crnogorskoj ligi i ABA2 ligi, a utakmice igra u nikšićkom
          Sportskom centru. Od februara 2025. godine predsjednik kluba je
          Aleksandar Popović, koji je na toj poziciji naslijedio Sašu Miličića.
          Sportski direktor je Zoran Marojević.
        </p>
      </section>

      {/* Istorijat */}
      <section style={sx.sectionCard}>
        <h2 style={{ color: "#fff" }}>Istorijat </h2> 
        <div style={sx.divider} />
        <div style={sx.textBlock}>
          
          <p style={sx.text}>
            Na fudbalskom igralištu FK Sutjeska 1948. godine izgrađeno je prvo
            košarkaško igralište u Nikšiću, a nedugo nakon osnivanja KK
            Sutjeska, Vojislav Jovanović upoznao je mlade Nikšićane sa osnovnim
            elementima košarke. Odmah potom tim je počeo da trenira Vule
            Vulaković, uz pomoć igrača Crvene zvezde Dragana Jakšića. Ujedinjena
            liga počela je 1953. godine, a 1962. Sutjeska je bez poraza osvojila
            titulu prvaka Crne Gore. Tokom istorije klub je nekoliko puta
            mijenjao ime – Partizan, Mladost, Ibon, Nikšić i na kraju ponovo
            Sutjeska.
          </p>
          <p style={sx.text}>
            Pod imenom Ibon, klub je devedesetih godina prošlog vijeka igrao u
            Winston YUBA ligi. U tom takmičenju učestvovao je u sezonama
            1994/1995, 1995/1996. i 1999/2000. U sezoni 2004/2005. igrao je Prvu
            ligu Srbije i Crne Gore.
          </p>
          <p style={sx.text}>
            Najveći uspjeh klub je ostvario 2013. godine, kada je osvojio Kup
            Crne Gore. U finalnom meču u Tivtu, Sutjeska je savladala Budućnost
            64:55.
          </p>
          <p style={sx.text}>
            U sezoni 2014/2015. klub je prvi put igrao u Balkanskoj ligi (BIBL),
            da bi od 2015/2016. Sutjeska prvi put postala član ABA lige. U
            premijernom nastupu u regionalnom takmičenju “plavi” su ostvarili
            devet pobjeda i 17 poraza i ispali iz lige. Sutjeska je do samog
            kraja bila u igri za opstanak, ali je prilika propuštena nakon
            poraza u gostima od Zadra (85:83) u posljednjem kolu. Te sezone je
            klub na svakom meču imao veliku podršku navijača, a utakmice u
            Nikšiću bile su među najposjećenijim u ligi.
          </p>
          <p style={sx.text}>
            Od sezone 2018/2019. Sutjeska je standardni član ABA2 lige. Najbolji
            plasman u ABA2 ligi ostvaren je 2020. godine – Sutjeska je regularni
            dio završila na 4. mjestu, ali je ostala bez prilike da se kroz
            plej-of bori za ulazak u prvu ABA ligu, jer je sezona zbog pandemije
            koronavirusa prekinuta.
          </p>
        </div>
      </section>

      {/* Treneri i osoblje */}
      <section>
        <h2 style={{ ...sx.title, marginTop: 10 }}>Zaposleni u KK SUTJESKA</h2>
        <div style={sx.divider} />
        <div style={sx.grid}>
          {treneri.map((t) => (
            <article key={t.id} style={sx.card}>
              <div style={sx.imgWrap}>
                <img
                  src={`http://localhost:4000${t.slika}`}
                  alt={`${t.ime} ${t.prezime}`}
                  style={sx.img}
                />
              </div>
              <h3 style={sx.name}>
                {t.ime} {t.prezime}
              </h3>
              <p style={sx.role}>{t.uloga}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

const sx = {
  page: {
    padding: "40px 20px",
    maxWidth: 1100,
    margin: "0 auto",
     color: "#fff", 
  },
  sectionCard: {
    background: "linear-gradient(180deg,#0b2a52 0%, #0e3a70 100%)",
    borderRadius: 16,
    padding: "28px 26px",
    color: "#e9f1ff",
    boxShadow: "0 10px 24px rgba(0,0,0,.18)",
    marginBottom: 28,
     color: "#fff", 
  },
  title: {
    textAlign: "center",
    fontWeight: 800,
    letterSpacing: ".02em",
    margin: 0,
  },
  divider: {
    width: 80,
    height: 4,
    borderRadius: 999,
    margin: "12px auto 18px",
    background:
      "linear-gradient(90deg, rgba(255,255,255,.85) 0%, rgba(173,216,230,.9) 100%)",
  },
  textBlock: { display: "grid", gap: 12 },
  text: {
    fontSize: 18,
    lineHeight: 1.75,
    margin: 0,
    textAlign: "justify",
    color: "#fff", 
  },

  // Treneri
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
    gap: 20,
    marginTop: 18,
  },
  card: {
    background: "#ffffff",
    borderRadius: 14,
    boxShadow: "0 6px 18px rgba(0,0,0,.08)",
    padding: 14,
    textAlign: "center",
  },
  imgWrap: {
    width: "100%",
    height: 260,
    background: "#f6f7fb",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "contain", // VAŽNO: cijela slika vidljiva
  },
  name: {
    margin: "12px 0 4px",
    fontSize: 18,
    fontWeight: 700,
    color: "#0b2a52",
  },
  role: { margin: 0, color: "#4f6b8a" },
};
