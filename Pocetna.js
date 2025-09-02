import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Pocetna.css';

export default function Pocetna() {
  const [igraci, setIgraci] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  
  const heroThumbs = [
    "https://rtcg.me/upload//media/2025/5/7/18/35/29/2159649/resize/2159652/5613028_kk-su_ls_599x900",
    "https://publisher-publish.s3.eu-central-1.amazonaws.com/pb-etv/swp/8p72gy/media/2024092623090_09ae7db9eb06b05048eaa0e50da1a0f24a06ec5a2a8350aca884b02fa809a417.webp",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-OmxqiAPa5vhgA4OYjjG3LMF1JKY5MYQjou6bbo8mweecmhoznJDH3t7KkbXPBRrJyUk&usqp=CAU",
    "https://i0.wp.com/reprezentacija.me/wp-content/uploads/2017/09/kk-sutjeska-kosarka.jpg?resize=420%2C280&ssl=1",
    "https://sportklub.n1info.rs/wp-content/uploads/2018/12/kk-sutjeska-130364-750x375.jpeg",
    "https://kksutjeska.com/wp-content/uploads/2022/02/Untitled-6.png"
  ];

  
  const bannerImages = [
    "https://scontent.ftgd4-1.fna.fbcdn.net/v/t39.30808-6/495576896_1267628195370363_6161552600653411561_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=KVf9THUYZnAQ7kNvwE2xtpn&_nc_oc=AdluOiHnJeFYaL0a0REAxOG4ext6BQrZXPRBX02yk2vFFOrT7nqRgBSRjza3gO9F5_E&_nc_zt=23&_nc_ht=scontent.ftgd4-1.fna&_nc_gid=NpfURmYq8ZfFBv8YS0Cecg&oh=00_AfVfhsyrfqK5SAUo5CnlLe0e0kYtyMYL3-4ApeAVgnxEYw&oe=68BBB2BA",
    "https://scontent.ftgd4-1.fna.fbcdn.net/v/t39.30808-6/494186003_1256424516490731_4168653306717204183_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=Q38jsYYket8Q7kNvwHxod_m&_nc_oc=AdmIRO2oilUQOVoBpW1tJPwHrS0pPqx6HAguidQh-hf6xXSWIAjxUBezNZESih9kPVA&_nc_zt=23&_nc_ht=scontent.ftgd4-1.fna&_nc_gid=MuNVOdnArsh_VhIdJQA7aA&oh=00_AfXJ09TrPgBcpKcNy7IX38Sxe_2Z-nZyebyAQjxWVkxJ3Q&oe=68BBA441",
    "https://scontent.ftgd2-1.fna.fbcdn.net/v/t1.6435-9/121962023_1630483670475069_7301598873498745869_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=SmM7gFe6eaEQ7kNvwG_s3-0&_nc_oc=AdlqDkdfc32Fbcm3ArZhWtvn43zWzsYa0IzKgmRDx4DplMpEhh7nMnsKG8p1Rx42NNo&_nc_zt=23&_nc_ht=scontent.ftgd2-1.fna&_nc_gid=1AbMXBep46qDRgcb9jRIoA&oh=00_AfVSl6kNvKwFO3xtqwAJZBcWJHae9l1ynZjGUVJbbZWQMQ&oe=68C735C5",
    "https://scontent.ftgd2-1.fna.fbcdn.net/v/t1.6435-9/42470482_1015594891963953_6665185207781425152_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=mjDB9XbgnwkQ7kNvwG6L_FK&_nc_oc=Adkuw-pt160b5wfS-aNjkHD4Nlo6WWSHFXYyeX3PsFNPFRQaZnXC_hXJSbNQpPaS0go&_nc_zt=23&_nc_ht=scontent.ftgd2-1.fna&_nc_gid=9a2xyHMmYLUCcG6rX4G6wg&oh=00_AfUptbf9vG5ZAlVcWaGwZ6nwYKVuxn9Zjg1gwxTHKAIwfw&oe=68C75C04"
  ];

  const prevBanner = () =>
    setBannerIndex(i => (i === 0 ? bannerImages.length - 1 : i - 1));
  const nextBanner = () =>
    setBannerIndex(i => (i === bannerImages.length - 1 ? 0 : i + 1));

  
  useEffect(() => {
    if (paused) return;
    const id = setInterval(nextBanner, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, bannerIndex]);

  // Učitavanje igrača
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get('http://localhost:4000/players', { headers });
        setIgraci(res.data || []);
      } catch {
        setIgraci([]);
      }
    };
    load();
  }, []);

  const imgSrc = (url) => {
    if (!url) return '';
    const u = String(url).trim();
    return u.startsWith('http') ? u : `http://localhost:4000${u}`;
  };

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-inner">
          <img
            className="hero-logo"
            src="https://scontent.ftgd2-1.fna.fbcdn.net/v/t1.6435-9/70774495_1294087510781355_6403256811918458880_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=CLcj5xAmcLUQ7kNvwGa6wFt&_nc_oc=AdlWTy5F4FzCaBFjWSD25kHiINyCl7dVhUPDc3_jk1xAGE8ulzVDgtcfAiAjAcRdRyU&_nc_zt=23&_nc_ht=scontent.ftgd2-1.fna&_nc_gid=fS_mdDvFz2YE76CNbh_wvw&oh=00_AfUlS4BHJ4JmqXyNEKgCoxhTFiwOmbd2v4LFUek1lcpTXQ&oe=68C765E9"
            alt="Grb kluba"
          />
          <h1 className="hero-title">KK SUTJESKA</h1>
          <p className="hero-subtitle">Snaga. Istrajnost. Pobjeda.</p>

          {/* Male sličice */}
          <div className="hero-thumbs">
            {heroThumbs.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`hero-${i + 1}`}
                className="hero-thumb"
                style={{ animationDelay: `${0.25 + i * 0.25}s` }}
              />
            ))}
          </div>

<div className="hero-cta">
  <a href="/novosti"   className="cta-btn">Novosti</a>
  <a href="/utakmice"  className="cta-btn">Utakmice</a>
  <a href="/prvi-tim"  className="cta-btn">Prvi tim</a>






          </div>
        </div>
        <div className="hero-wave" aria-hidden />
      </section>

      {/* BANNER CAROUSEL */}
      <section className="banner-section">
        <div
          className="banner-frame"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button className="banner-arrow left" onClick={prevBanner} aria-label="Prethodna">&#10094;</button>

          <img
            key={bannerImages[bannerIndex]}
            src={bannerImages[bannerIndex]}
            alt={`Banner ${bannerIndex + 1}`}
            className="banner-img"
          />

          <button className="banner-arrow right" onClick={nextBanner} aria-label="Sljedeća">&#10095;</button>

          <div className="banner-dots">
            {bannerImages.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === bannerIndex ? 'active' : ''}`}
                onClick={() => setBannerIndex(i)}
                aria-label={`Idi na sliku ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* NAŠ TIM – slider */}
      <section className="igraci-section">
        
        <div className="igraci-slider">
          <div className="igraci-track">
            {igraci.map(p => (
              <div className="igrac-card" key={`p-${p.id}`}>
                <div className="igrac-avatar">
                  <img src={imgSrc(p.slika)} alt={p.ime} />
                </div>
                <div className="igrac-name">{p.ime} {p.prezime}</div>
                <div className="igrac-meta">#{p.broj_dresa} — {p.pozicija}</div>
              </div>
            ))}
            {/* duplikat za kontinuirano klizanje */}
            {igraci.map(p => (
              <div className="igrac-card" key={`dup-${p.id}`}>
                <div className="igrac-avatar">
                  <img src={imgSrc(p.slika)} alt={p.ime} />
                </div>
                <div className="igrac-name">{p.ime} {p.prezime}</div>
                <div className="igrac-meta">#{p.broj_dresa} — {p.pozicija}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NAŠI SPONZORI */}
      <section className="sponzori-section">
        <h2 className="section-title">Naši Sponzori</h2>
        <div className="sponzori-logos">
          <img src="https://kksutjeska.com/wp-content/uploads/2022/02/epcg.jpg" alt="EPCG" />
          <img src="https://kksutjeska.com/wp-content/uploads/2022/02/logo-4.png" alt="Logo 4" />
          <img src="https://kksutjeska.com/wp-content/uploads/2022/02/goranovic.png" alt="Goranović" />
          <img src="https://kksutjeska.com/wp-content/uploads/2022/11/Logo-novi-2017-dekoriva-co.jpg" alt="Dekoriva" />
        </div>
      </section>

      {/* LOKACIJA */}
      <section className="lokacija-section">
        <h2 className="section-title">Lokacija</h2>
        <div className="map-frame">
          <iframe
            title="Mapa KK Sutjeska"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2923.6135678805257!2d18.93726007674727!3d42.77555017116168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134dbf573f8f3a15%3A0xd21f3a571e9f1e33!2sSportski%20Centar%20Nik%C5%A1i%C4%87!5e0!3m2!1sen!2s!4v1692181193421!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="map-actions">
          <a
            className="link-btn"
            href="https://www.google.com/maps/place/Sportski+Centar+Nik%C5%A1i%C4%87/@42.7755501,18.9372601,17z"
            target="_blank"
            rel="noreferrer"
          >
            Otvorite u Google mapama
          </a>
        </div>
      </section>

      {/* KONTAKT */}
      <section className="kontakt-section">
       
        <div className="contact-cards">
          <div className="contact-card">
            <div className="cc-title">Telefon</div>
            <div className="cc-value">+382 40 000 000</div>
          </div>
          <div className="contact-card">
            <div className="cc-title">Email</div>
            <a className="cc-value link" href="mailto:info@kksutjeska.com">info@kksutjeska.com</a>
          </div>
          <div className="contact-card">
            <div className="cc-title">Adresa</div>
            <div className="cc-value">Nikšić, Crna Gora</div>
          </div>
          <div className="contact-card">
            <div className="cc-title">Radno vrijeme</div>
            <div className="cc-value">Pon–Pet: 09–17h</div>
          </div>
        </div>

        <div className="kontakt-cta">
   
        </div>
      </section>
    </div>
  );
}


