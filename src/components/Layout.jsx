import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome, HiOutlineLightningBolt, HiOutlineClock,
  HiOutlineCreditCard, HiOutlineUser, HiOutlineLogout, HiOutlineMenu, HiOutlineX,
  HiOutlineShieldCheck, HiOutlinePhone
} from 'react-icons/hi';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', icon: <HiOutlineHome />, label: 'Dashboard' },
    { to: '/rent', icon: <HiOutlineLightningBolt />, label: 'Rent a Bike' },
    { to: '/rentals', icon: <HiOutlineClock />, label: 'Rental History' },
    { to: '/payments', icon: <HiOutlineCreditCard />, label: 'Payments' },
    { to: '/deposit', icon: <HiOutlineShieldCheck />, label: 'Deposit' },
    { to: '/profile', icon: <HiOutlineUser />, label: 'Profile' },
  ];

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="/logo.jpeg" alt="StartEv" />
        </div>
        
        <div className={`navbar-nav ${navOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setNavOpen(false)}>
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
          
          {/* Mobile Logout inside Nav */}
          <button className="nav-link hide-desktop" onClick={handleLogout} style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <HiOutlineLogout /> <span>Logout</span>
          </button>
        </div>

        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          {/* Helpline */}
          <a href="tel:+919059736069" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
            <HiOutlinePhone size={18} />
            <span className="hide-mobile">+91 9059736069</span>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }} className="hide-mobile">
             <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{user?.name}</span>
             <button onClick={handleLogout} className="btn btn-ghost btn-icon" style={{ color: 'var(--error)', width: 'auto', padding: '0 var(--space-xs)' }} title="Logout">
               <HiOutlineLogout size={20} />
             </button>
          </div>
          <button className="mobile-menu-btn" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
