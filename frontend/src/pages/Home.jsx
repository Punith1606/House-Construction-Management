import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateConstructionEstimate } from '../utils/constructionCalculator';

export default function Home() {
  const [calc, setCalc] = useState({ lengthu: 30, breadth: 40, floors: 2, qualityTier: 'standard' });
  const result = calculateConstructionEstimate(calc);

  return (
    <div>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#fff', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.18)', borderRadius: 20, padding: '6px 18px', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            🏗️ Free · Instant · Accurate
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 18px' }}>
            Plan Your House Construction Budget
          </h1>
          <p style={{ fontSize: 18, opacity: 0.9, lineHeight: 1.7, margin: '0 0 36px' }}>
            Enter your plot size and get the estimated cost, materials needed, and stage-wise budget — in seconds.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link to="/area" style={{
              padding: '16px 36px', background: '#fff', color: '#6366f1',
              borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}>
              Start Calculator →
            </Link>
            <Link to="/items" style={{
              padding: '16px 36px', background: 'rgba(255,255,255,0.15)', color: '#fff',
              borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)'
            }}>
              Browse Materials
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>How It Works</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 16, marginBottom: 48 }}>3 simple steps to get your full construction estimate</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {[
            { step: '1', icon: '📐', title: 'Enter Plot Details', desc: 'Type your plot length, breadth, number of floors, and quality level.' },
            { step: '2', icon: '🧱', title: 'Choose Your Materials', desc: 'Browse real supplier products and pick the brands you prefer.' },
            { step: '3', icon: '📋', title: 'Get Your Report', desc: 'See your full cost estimate, material list, and stage-wise budget breakdown.' },
          ].map(item => (
            <div key={item.step} className="ci-card" style={{ padding: 28, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, background: '#ede9fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 26 }}>
                {item.icon}
              </div>
              <div style={{ width: 24, height: 24, background: '#6366f1', borderRadius: '50%', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-36px auto 12px auto', position: 'relative', top: -8 }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: '0 0 10px' }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUICK ESTIMATOR ── */}
      <section style={{ background: '#f1f5f9', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>Try the Quick Estimator</h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 15, marginBottom: 40 }}>Drag the sliders to see your estimate update instantly</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>

            {/* Controls */}
            <div className="ci-card" style={{ padding: 28 }}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#1e293b', marginBottom: 8, fontSize: 15 }}>
                  <span>Plot Length</span>
                  <span style={{ color: '#6366f1' }}>{calc.lengthu} ft</span>
                </label>
                <input type="range" min="15" max="100" value={calc.lengthu}
                  onChange={e => setCalc({ ...calc, lengthu: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#6366f1' }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#1e293b', marginBottom: 8, fontSize: 15 }}>
                  <span>Plot Breadth</span>
                  <span style={{ color: '#6366f1' }}>{calc.breadth} ft</span>
                </label>
                <input type="range" min="15" max="100" value={calc.breadth}
                  onChange={e => setCalc({ ...calc, breadth: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#6366f1' }} />
              </div>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#1e293b', marginBottom: 8, fontSize: 15 }}>
                  <span>Number of Floors</span>
                  <span style={{ color: '#6366f1' }}>{calc.floors}</span>
                </label>
                <input type="range" min="1" max="5" value={calc.floors}
                  onChange={e => setCalc({ ...calc, floors: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#6366f1' }} />
              </div>
            </div>

            {/* Results */}
            <div className="ci-card" style={{ padding: 28 }}>
              <div style={{ textAlign: 'center', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Estimated Total Budget</div>
                <div style={{ fontSize: 40, fontWeight: 900, color: '#6366f1' }}>₹{result.totalProjectCost.toLocaleString()}</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>for {result.totalBuiltUpArea.toLocaleString()} sq.ft built-up area</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'Cement', value: `${result.materialBreakdown.find(m => m.category === 'Cement')?.quantity.toLocaleString()} Bags`, color: '#6366f1' },
                  { label: 'Steel', value: `${result.materialBreakdown.find(m => m.category === 'Steel Rebars')?.quantity.toLocaleString()} Kg`, color: '#8b5cf6' },
                  { label: 'Bricks', value: `${result.materialBreakdown.find(m => m.category === 'Bricks/Blocks')?.quantity.toLocaleString()} Nos`, color: '#f59e0b' },
                  { label: 'Flooring', value: `${result.materialBreakdown.find(m => m.category === 'Flooring Tiles')?.quantity.toLocaleString()} Sq.ft`, color: '#10b981' },
                ].map(item => (
                  <div key={item.label} style={{ background: '#f8fafc', borderRadius: 10, padding: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <Link to={`/area?length=${calc.lengthu}&breadth=${calc.breadth}&floors=${calc.floors}`}
                style={{ display: 'block', textAlign: 'center', padding: '14px', background: '#6366f1', color: '#fff', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
                Get Full Detailed Report →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 48 }}>Why Use ConstructIQ?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {[
            { icon: '📊', title: 'Accurate Estimates', desc: 'Based on standard civil engineering norms for Indian residential construction.' },
            { icon: '💸', title: 'Stage-wise Budget', desc: 'See how much to spend at each stage — Foundation, Walls, Flooring, Finishing.' },
            { icon: '🛒', title: 'Real Supplier Prices', desc: 'Compare prices from local cement, steel, tile, and paint distributors.' },
            { icon: '📄', title: 'Print Your Report', desc: 'Download or print a complete cost report to share with your contractor.' },
          ].map(f => (
            <div key={f.title} className="ci-card" style={{ padding: 24 }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', margin: '0 0 10px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VIDEO ── */}
      <section style={{ background: '#f1f5f9', padding: '72px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>Watch: How House Construction Works</h2>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Learn about construction stages, material planning, and budgeting</p>
          <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              src="https://www.youtube.com/embed/ojuUnfqnUI0?si=wMUv4DG3ia6Wt4zn"
              title="House Construction Guide"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', color: '#fff' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 16px' }}>Ready to start planning?</h2>
          <p style={{ fontSize: 16, opacity: 0.9, margin: '0 0 32px' }}>Enter your plot size and get a complete cost report in under a minute.</p>
          <Link to="/area" style={{
            padding: '18px 48px', background: '#fff', color: '#6366f1',
            borderRadius: 12, fontSize: 18, fontWeight: 800, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            Get My Free Estimate →
          </Link>
        </div>
      </section>

    </div>
  );
}
