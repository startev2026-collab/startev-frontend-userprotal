import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome, HiOutlineLightningBolt, HiOutlineClock,
  HiOutlineCreditCard, HiOutlineUser, HiOutlineLogout, HiOutlineMenu, HiOutlineX,
  HiOutlineShieldCheck, HiOutlinePhone, HiOutlineMail
} from 'react-icons/hi';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [showSupportBox, setShowSupportBox] = useState(false);

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

        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', position: 'relative' }}>
          {/* Helpline Button */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowSupportBox(!showSupportBox)}
              className="btn btn-ghost"
              style={{
                color: 'var(--primary)',
                background: 'rgba(56, 142, 60, 0.08)',
                border: '1px solid rgba(56, 142, 60, 0.2)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: 'var(--space-sm) var(--space-md)',
                height: '40px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title="Helpline & Support"
            >
              <HiOutlinePhone size={18} />
              <span className="hide-mobile" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Helpline</span>
            </button>

            {showSupportBox && (
              <>
                {/* Click outside overlay to close */}
                <div 
                  onClick={() => setShowSupportBox(false)} 
                  style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 999,
                    background: 'transparent'
                  }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    width: '260px',
                    padding: 'var(--space-md)',
                    zIndex: 1000,
                    animation: 'fadeIn 0.15s ease',
                  }}
                >
                  <h4 style={{ 
                    fontSize: 'var(--font-size-sm)', 
                    fontWeight: 700, 
                    color: 'var(--text-primary)', 
                    marginBottom: 'var(--space-sm)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: 'var(--space-xs)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <HiOutlinePhone style={{ color: 'var(--primary)' }} /> START EV Support
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <a 
                      href="tel:+917671861942" 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--space-sm)', 
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-primary)',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-glow)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                    >
                      <HiOutlinePhone style={{ color: 'var(--primary)', flexShrink: 0 }} size={18} />
                      <div>
                        <span style={{ fontSize: '10px', display: 'block', color: 'var(--text-muted)' }}>Call Helpline</span>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>+91 7671861942</span>
                      </div>
                    </a>
                    <a 
                      href="mailto:supportstartev@gmail.com" 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--space-sm)', 
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-primary)',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-glow)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                    >
                      <HiOutlineMail style={{ color: 'var(--primary)', flexShrink: 0 }} size={18} />
                      <div>
                        <span style={{ fontSize: '10px', display: 'block', color: 'var(--text-muted)' }}>Email Support</span>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>supportstartev@gmail.com</span>
                      </div>
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>

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
