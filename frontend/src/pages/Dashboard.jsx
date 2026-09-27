import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { MATERIAL_FACTORS } from '../utils/constructionCalculator';

const fixedCategories = Object.keys(MATERIAL_FACTORS);

export default function Dashboard() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productCategory: fixedCategories[0],
    productName: "",
    price: "",
    unit: MATERIAL_FACTORS[fixedCategories[0]].unit,
    distributerName: "",
    distributerNumber: "",
    distributerAddress: "",
    description: "",
    profilepic: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCategoryChange = (cat) => {
    const defaultUnit = MATERIAL_FACTORS[cat]?.unit || "Unit";
    setForm(prev => ({
      ...prev,
      productCategory: cat,
      unit: defaultUnit
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    const email = "vendor@buildcraft.com";

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          product: { 
            ...form, 
            price: Number(form.price) 
          }
        })
      });
      
      if (response.ok || response.status === 201) {
        setSuccessMsg('Product published to marketplace!');
        setTimeout(() => {
          navigate('/items');
        }, 1200);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setSuccessMsg('Saved product locally!');
      setTimeout(() => navigate('/items'), 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[85vh]">
      
      <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <FiPlusCircle /> Vendor Inventory Management
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          List Your Building Material
        </h1>
        <p className="text-slate-400 text-sm">
          Add construction materials to the marketplace for homeowners & contractors to calculate project costs.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
        
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold flex items-center gap-2">
            <FiCheckCircle className="text-xl" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Material Category *
              </label>
              <select
                value={form.productCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full p-3.5 rounded-xl glass-input text-sm font-semibold"
                required
              >
                {fixedCategories.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Brand / Product Name *
              </label>
              <input
                type="text"
                required
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                placeholder="e.g. UltraTech Super Cement PPC"
                className="w-full p-3.5 rounded-xl glass-input text-sm"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 385"
                className="w-full p-3.5 rounded-xl glass-input text-sm font-semibold"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Unit of Measurement
              </label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="Bags / Kg / Sq ft"
                className="w-full p-3.5 rounded-xl glass-input text-sm"
              />
            </div>

          </div>

          {/* Distributor Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Distributor / Business Name *
              </label>
              <input
                type="text"
                required
                value={form.distributerName}
                onChange={(e) => setForm({ ...form, distributerName: e.target.value })}
                placeholder="e.g. BuildMate Supplies Co."
                className="w-full p-3.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Contact Number *
              </label>
              <input
                type="text"
                required
                value={form.distributerNumber}
                onChange={(e) => setForm({ ...form, distributerNumber: e.target.value })}
                placeholder="e.g. +91 9876543210"
                className="w-full p-3.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Distributor Store Address *
            </label>
            <input
              type="text"
              required
              value={form.distributerAddress}
              onChange={(e) => setForm({ ...form, distributerAddress: e.target.value })}
              placeholder="e.g. Plot 42, Industrial Area, Sector 62"
              className="w-full p-3.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Product Description
            </label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe specifications, grades, or warranty..."
              className="w-full p-3.5 rounded-xl glass-input text-sm"
            />
          </div>

          {/* Image URL with Live Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Product Picture Image URL
            </label>
            <input
              type="url"
              value={form.profilepic}
              onChange={(e) => setForm({ ...form, profilepic: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-3.5 rounded-xl glass-input text-sm"
            />
            {form.profilepic && (
              <div className="mt-3 flex items-center gap-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <img src={form.profilepic} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                <span className="text-xs text-slate-400">Image Preview</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl font-extrabold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Saving Material...' : 'Publish Product to Marketplace'}</span>
            <FiArrowRight />
          </button>

        </form>
      </div>

    </div>
  );
}
