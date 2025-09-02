import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Admin from './components/Admin/Admin';
import Players from './pages/Players';
import Header from './components/Header'; //  nalazi u src/components/
import OKlubu from './pages/OKlubu';
import Sponzori from './components/Sponzori';
import Galerija from './pages/Galerija';  



export default function App() {
  const tokenExists = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
    <Header />
      <Routes>
      
        <Route path="/oklubu" element={<OKlubu />} />
         <Route path="/galerija" element={<Galerija />} />
        <Route path="/" element={tokenExists ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />} />
        <Route path="/players" element={<Players />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={tokenExists ? <Admin /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Sponzori />
    </BrowserRouter>
  );
}

