import { NavLink } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  const token = localStorage.getItem('token');

  return (
    <header className="nav">
      <nav>
        <NavLink to="/"        end>Početna</NavLink>
        <NavLink to="/vijesti">Vijesti</NavLink>
        <NavLink to="/tim">Tim</NavLink>
        <NavLink to="/kontakt">Kontakt</NavLink>
        {!token
          ? <NavLink to="/login">Prijava</NavLink>
          : <NavLink to="/admin">Admin</NavLink>
        }
      </nav>
    </header>
);
}

