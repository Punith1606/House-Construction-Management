import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="no-print" style={{ background: '#1e293b', color: '#94a3b8', marginTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 26 }}>🏠</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                Construct<span style={{ color: '#818cf8' }}>IQ</span>
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>
              Free house construction cost estimator. Get accurate material quantities & connect with suppliers — all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { to: '/area', label: 'House Calculator' },
                { to: '/items', label: 'Material Marketplace' },
                { to: '/details', label: 'View Estimate Report' },
              ].map(l => (
                <Link key={l.to} to={l.to} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color = '#818cf8'}
                  onMouseOut={e => e.target.style.color = '#94a3b8'}
                >{l.label}</Link>
              ))}
            </div>
          </div>

          {/* For Suppliers */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>For Suppliers</h4>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
              Are you a material supplier? List your products and get noticed by homeowners.
            </p>
            <Link to="/dashboard" style={{
              padding: '8px 18px', background: '#6366f1', color: '#fff',
              borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none'
            }}>
              List My Products →
            </Link>
          </div>

        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
          <p>© {new Date().getFullYear()} ConstructIQ. All rights reserved.</p>
          <p>Professional Construction Cost Estimation</p>
        </div>
      </div>
    </footer>
  );
}
