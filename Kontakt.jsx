import React from 'react';

export default function Kontakt() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '0',
      backgroundColor: '#fff',
      color: '#333',
      minHeight: '100vh'
    }}>
   


      <div style={{
        textAlign: 'center',
       padding: '20px 20px 10px 20px',
marginTop:'10px',
        fontSize: '28px',
        fontWeight: 'normal',
        font:'inherit',
        color:'gray'
        
        
      }}>
        
        Za sve informacije, pišite nam 
        
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0',
        padding: '40px 40px 40px 40px'
      }}>

        {/* Lijeva strana - Info */}
        <div style={{
          flex: 1,
          minWidth: '300px',
          padding: '20px 30px'
        }}>
          <p><strong>📍 ADRESA:</strong><br />Njegoševa 66, 81400 Nikšić, Crna Gora</p>
          <p><strong>📞 TELEFON:</strong><br />+382 68 155 570</p>
          <p><strong>📠 FAKS:</strong><br />+382 00 000 000</p>
          <p><strong>📧 EMAIL:</strong><br />sutjeskaniksickk@gmail.com</p>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2894.236968357125!2d18.9392522!3d42.7763884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134c3294dbeff43f%3A0x7b51a87de44a76b7!2z0J3Rg9Cx0LjRmNCwIDY2LCDQodC10YDQvdCwLCDQvNCw0YDQvdC-0L_RgNCw0L3QsCA4MTQwMA!5e0!3m2!1ssr!2sme!4v1691429354973!5m2!1ssr!2sme"
            width="100%"
            height="250"
            style={{ border: 0, marginTop: '20px', borderRadius: '8px' }}
            allowFullScreen=""
            loading="lazy"
            title="Mapa"
          ></iframe>
        </div>

        {/* Desna strana - Forma */}
        <div style={{
          flex: 1,
          minWidth: '300px',
          padding: '20px 30px'
        }}>
          <h3 style={{ color: '#0044cc' }}></h3>
          <form style={{ marginTop: '30px' }}>
            <input type="text" placeholder="Vaše ime" style={inputStyle} />
            <input type="email" placeholder="Vaš email" style={inputStyle} />
            <input type="text" placeholder="Broj telefona" style={inputStyle} />
            <input type="text" placeholder="Naziv firme (opciono)" style={inputStyle} />
            <textarea placeholder="Poruka" style={{ ...inputStyle, height: '100px' }}></textarea>
            <button type="submit" style={buttonStyle}>Pošalji</button>
          </form>
        </div>
      </div>

      {/* Donji dio */}
      <div style={{
        marginTop: '50px',
        backgroundColor: '#0044cc',
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>KK SUTJESKA</span>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  margin: '10px 0',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '14px',
  boxSizing: 'border-box'
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#0044cc',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '10px'
};



