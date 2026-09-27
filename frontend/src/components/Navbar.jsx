import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const cart = localStorage.getItem('constructionCart');
      if (cart) {
        try { setCartCount(JSON.parse(cart).length); } catch { setCartCount(0); }
      } else setCartCount(0);
    };
    update();
    window.addEventListener('storage', update);
    const id = setInterval(update, 1000);
    return () => { window.removeEventListener('storage', update); clearInterval(id); };
  }, []);

  const links = [
    { name: 'Home',        href: '/' },
    { name: 'Calculator',  href: '/area' },
    { name: 'Materials',   href: '/items' },
    { name: 'My Estimate', href: '/details' },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span style={{ fontSize: 28 }}>🏠</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>
            Construct<span style={{ color: '#6366f1' }}>IQ</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav style={{ display: 'flex', gap: 4 }} className="hidden-mobile">
          {links.map(link => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
                background: isActive(link.href) ? '#6366f1' : 'transparent',
                color: isActive(link.href) ? '#fff' : '#475569',
                position: 'relative',
              }}
            >
              {link.name}
              {link.href === '/items' && cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 6,
                  background: '#ef4444', color: '#fff', borderRadius: '50%',
                  fontSize: 10, fontWeight: 700, width: 16, height: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Add Product button */}
        <Link
          to="/dashboard"
          className="hidden-mobile"
          style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            background: '#f1f5f9', color: '#475569', textDecoration: 'none',
            border: '1px solid #e2e8f0'
          }}
        >
          + Add Product
        </Link>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="show-mobile"
          style={{ background: 'none', border: 'none', fontSize: 26, cursor: 'pointer', color: '#475569' }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {links.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '12px 16px', borderRadius: 8, fontWeight: 600, fontSize: 16,
                textDecoration: 'none',
                background: isActive(link.href) ? '#6366f1' : '#f8fafc',
                color: isActive(link.href) ? '#fff' : '#1e293b',
              }}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            style={{ padding: '12px 16px', borderRadius: 8, fontWeight: 600, fontSize: 16, textDecoration: 'none', background: '#f1f5f9', color: '#475569', marginTop: 4 }}
          >
            + Add Product
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </header>
  );
}
