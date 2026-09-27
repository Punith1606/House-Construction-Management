import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { calculateConstructionEstimate, QUALITY_TIERS } from '../utils/constructionCalculator';

const TIER_INFO = {
  economy:  { label: '🟢 Economy',  subtitle: 'Basic finishes, local materials',   color: '#10b981' },
  standard: { label: '🔵 Standard', subtitle: 'Mid-range brands, good quality',    color: '#6366f1' },
  premium:  { label: '🟣 Premium',  subtitle: 'High-end finishes & materials',     color: '#8b5cf6' },
};

export default function AreaCalculator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({ lengthu: 30, breadth: 40, floors: 1, parking: 0, qualityTier: 'standard' });

  useEffect(() => {
    const lenParam = searchParams.get('length');
    const breadthParam = searchParams.get('breadth');
    const floorsParam = searchParams.get('floors');
    if (lenParam || breadthParam || floorsParam) {
      setForm(prev => ({
        ...prev,
        lengthu: Number(lenParam) || prev.lengthu,
        breadth: Number(breadthParam) || prev.breadth,
        floors: Number(floorsParam) || prev.floors
      }));
    } else {
      const saved = localStorage.getItem('buildingData');
      if (saved) {
        try {
          const p = JSON.parse(saved);
          setForm({ lengthu: Number(p.lengthu)||30, breadth: Number(p.breadth)||40, floors: Number(p.floors)||1, parking: Number(p.parking)||0, qualityTier: p.qualityTier||'standard' });
        } catch {}
      }
    }
  }, [searchParams]);

  const estimate = calculateConstructionEstimate(form);

  const handleSubmit = (e, target = '/items') => {
    e.preventDefault();
    if (!form.lengthu || !form.breadth || form.lengthu <= 0 || form.breadth <= 0) {
      alert('Please enter valid plot dimensions');
      return;
    }
    localStorage.setItem('buildingData', JSON.stringify({ ...form, lengthu: Number(form.lengthu), breadth: Number(form.breadth), floors: Number(form.floors), parking: Number(form.parking) }));
    navigate(target);
  };

  const inp = (label, name, placeholder, hint) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: 15 }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 13, marginLeft: 8 }}>{hint}</span>}
      </label>
      <input
        type="number" name={name} value={form[name]}
        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        placeholder={placeholder}
        className="ci-input"
        min="0"
      />
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>

      {/* Page Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#1e293b', margin: '0 0 8px' }}>🏠 House Construction Calculator</h1>
        <p style={{ color: '#64748b', fontSize: 16, margin: 0 }}>Fill in the details below to get your complete cost estimate.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>

        {/* ── LEFT: FORM ── */}
        <div>
          <form onSubmit={e => handleSubmit(e, '/items')}>

            {/* Section 1: Plot Size */}
            <div className="ci-card" style={{ padding: 28, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, background: '#6366f1', borderRadius: '50%', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>1</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Plot Size</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: 15 }}>Length (in feet)</label>
                  <input type="number" name="lengthu" value={form.lengthu} min="10" max="500"
                    onChange={e => setForm(p => ({ ...p, lengthu: e.target.value }))}
                    className="ci-input" placeholder="e.g. 30" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: 15 }}>Breadth (in feet)</label>
                  <input type="number" name="breadth" value={form.breadth} min="10" max="500"
                    onChange={e => setForm(p => ({ ...p, breadth: e.target.value }))}
                    className="ci-input" placeholder="e.g. 40" required />
                </div>
              </div>
              {form.lengthu > 0 && form.breadth > 0 && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#ede9fe', borderRadius: 8, fontSize: 14, color: '#6366f1', fontWeight: 600 }}>
                  📐 Plot Area = {(form.lengthu * form.breadth).toLocaleString()} sq.ft
                </div>
              )}
            </div>

            {/* Section 2: Floors */}
            <div className="ci-card" style={{ padding: 28, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, background: '#6366f1', borderRadius: '50%', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>2</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Number of Floors</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button type="button" key={n} onClick={() => setForm(p => ({ ...p, floors: n }))}
                    style={{
                      padding: '12px 4px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', border: 'none',
                      background: Number(form.floors) === n ? '#6366f1' : '#f1f5f9',
                      color: Number(form.floors) === n ? '#fff' : '#475569',
                    }}>
                    {n}
                    <div style={{ fontSize: 11, fontWeight: 400, marginTop: 2, opacity: 0.8 }}>
                      {n === 1 ? 'Ground' : `G + ${n - 1}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Quality */}
            <div className="ci-card" style={{ padding: 28, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, background: '#6366f1', borderRadius: '50%', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>3</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Construction Quality</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(TIER_INFO).map(([key, t]) => (
                  <div key={key} onClick={() => setForm(p => ({ ...p, qualityTier: key }))}
                    style={{
                      padding: '14px 18px', borderRadius: 10, cursor: 'pointer',
                      border: `2px solid ${form.qualityTier === key ? t.color : '#e2e8f0'}`,
                      background: form.qualityTier === key ? `${t.color}10` : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{t.label}</div>
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{t.subtitle}</div>
                    </div>
                    {form.qualityTier === key && <span style={{ color: t.color, fontSize: 20 }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Parking (optional) */}
            <div className="ci-card" style={{ padding: 28, marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, background: '#94a3b8', borderRadius: '50%', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>4</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Parking Area <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 400 }}>(optional)</span></h2>
              </div>
              <input type="number" name="parking" value={form.parking} min="0"
                onChange={e => setForm(p => ({ ...p, parking: e.target.value }))}
                className="ci-input" placeholder="e.g. 150 sq.ft" />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button type="submit"
                style={{ flex: 1, minWidth: 200, padding: '16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                Browse Materials & Get Price →
              </button>
              <button type="button" onClick={e => handleSubmit(e, '/details')}
                style={{ padding: '16px 24px', background: '#f1f5f9', color: '#475569', border: '2px solid #e2e8f0', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                View Estimate Now
              </button>
            </div>
          </form>
        </div>

        {/* ── RIGHT: LIVE SUMMARY ── */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div className="ci-card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', margin: '0 0 20px', paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              📋 Live Summary
            </h3>

            {/* Total Cost */}
            <div style={{ textAlign: 'center', marginBottom: 24, padding: '20px', background: '#ede9fe', borderRadius: 12 }}>
              <div style={{ fontSize: 13, color: '#7c3aed', fontWeight: 600, marginBottom: 4 }}>Estimated Total Cost</div>
              <div style={{ fontSize: 38, fontWeight: 900, color: '#6366f1' }}>₹{estimate.totalProjectCost.toLocaleString()}</div>
              <div style={{ fontSize: 13, color: '#8b5cf6', marginTop: 4 }}>
                ₹{estimate.costPerSqFt}/sq.ft · {estimate.totalBuiltUpArea.toLocaleString()} sq.ft
              </div>
            </div>

            {/* Cost split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 14, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Material Cost</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#15803d' }}>₹{estimate.totalMaterialCost.toLocaleString()}</div>
              </div>
              <div style={{ background: '#faf5ff', borderRadius: 10, padding: 14, border: '1px solid #e9d5ff' }}>
                <div style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600 }}>Labour Cost</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#6d28d9' }}>₹{estimate.totalLaborCost.toLocaleString()}</div>
              </div>
            </div>

            {/* Material list */}
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Materials Required
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {estimate.materialBreakdown.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: 14, color: '#374151' }}>{m.icon} {m.category}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#6366f1' }}>{m.quantity.toLocaleString()} {m.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
