import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login    from './pages/Login';
import Register from './pages/Register';   
import Admin    from './components/Admin/Admin';
import Players from './pages/Players';
import Pocetna from './Pocetna';
import Kontakt from './pages/Kontakt';
import Header from './components/Header'; 
import OKlubu from './pages/OKlubu';
import Utakmice from './pages/Utakmice';
import Sponzori from './components/Sponzori';
import Novosti from './pages/Novosti';
import Galerija from './pages/Galerija';  
import SiteSearch from './pages/SiteSearch';











//import 
export default function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
     <Header />
      <Routes> 
        <Route path="/pretraga" element={<SiteSearch />} />
<Route path="/novosti" element={<Novosti />} />
        <Route path="/utakmice" element={<Utakmice />} />
         <Route path="/galerija" element={<Galerija />} />
        <Route path="/oklubu" element={<OKlubu />} />
        <Route path="/"    element={<Pocetna />} />
        <Route path="/home"    element={<Pocetna />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} /> 
      <Route path="/players" element={<Players />} /> 
       
        <Route
          path="/admin"
          element={ token ? <Admin /> : <Navigate to="/login" replace /> }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Sponzori />
    </BrowserRouter>
  );
}

