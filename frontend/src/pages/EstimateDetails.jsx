import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFileText, 
  FiPrinter, 
  FiLayers, 
  FiPieChart, 
  FiDollarSign, 
  FiSliders, 
  FiShoppingBag,
  FiSave,
  FiInfo
} from 'react-icons/fi';
import { calculateConstructionEstimate } from '../utils/constructionCalculator';
import { saveEstimateReport } from '../utils/api';

export default function EstimateDetails() {
  const [buildingData, setBuildingData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [estimate, setEstimate] = useState(null);
  const [activeTab, setActiveTab] = useState('materials');
  const [savedStatus, setSavedStatus] = useState('');

  useEffect(() => {
    const savedBuilding = localStorage.getItem('buildingData');
    let bData = { lengthu: 30, breadth: 40, floors: 1, parking: 150, qualityTier: 'standard' };
    if (savedBuilding) {
      try {
        bData = JSON.parse(savedBuilding);
      } catch (e) {}
    }
    setBuildingData(bData);

    let cart = [];
    const savedCart = localStorage.getItem('constructionCart');
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch (e) {}
    }
    setCartItems(cart);

    const computedEstimate = calculateConstructionEstimate(bData, cart);
    setEstimate(computedEstimate);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEstimate = async () => {
    if (!estimate || !buildingData) return;
    setSavedStatus('Saving...');
    try {
      const res = await saveEstimateReport({
        userEmail: "guest@buildcraft.com",
        lengthu: buildingData.lengthu,
        breadth: buildingData.breadth,
        floors: buildingData.floors,
        parking: buildingData.parking,
        qualityTier: buildingData.qualityTier,
        totalBuiltUpArea: estimate.totalBuiltUpArea,
        totalProjectCost: estimate.totalProjectCost,
        totalMaterialCost: estimate.totalMaterialCost,
        totalLaborCost: estimate.totalLaborCost,
        selectedMaterials: estimate.materialBreakdown
      });
      if (res.success) {
        setSavedStatus('Saved Successfully!');
        setTimeout(() => setSavedStatus(''), 3000);
      } else {
        setSavedStatus('Saved to Local Storage');
        setTimeout(() => setSavedStatus(''), 3000);
      }
    } catch (e) {
      setSavedStatus('Saved locally');
      setTimeout(() => setSavedStatus(''), 3000);
    }
  };

  if (!estimate || !buildingData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center min-h-[80vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-extrabold text-white mb-4">No Project Parameters Found</h2>
        <p className="text-slate-400 mb-6">Please enter your house plot dimensions first to generate your civil report.</p>
        <Link to="/area" className="px-6 py-3 rounded-xl bg-indigo-600 font-bold text-white">
          Go to House Calculator
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[85vh]">
      
      {/* Header & Print Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FiFileText /> Detailed Civil Engineering Report
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            House Construction Estimate Results
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Complete cost breakdown, material quantities, labor allocation, and stage milestone budget.
          </p>
        </div>

        {/* Report Actions */}
        <div className="no-print flex flex-wrap items-center gap-3">
          <button
            onClick={handleSaveEstimate}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center gap-2"
          >
            <FiSave className="text-indigo-400" />
            <span>{savedStatus || 'Save Report'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg transition flex items-center gap-2"
          >
            <FiPrinter />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Project Overview Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 mb-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-2xl">
              🏠
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Project Specifications</h2>
              <p className="text-xs text-slate-400">
                Plot: {buildingData.lengthu} × {buildingData.breadth} ft ({estimate.plotArea.toLocaleString()} sq.ft) • {buildingData.floors} Floor{buildingData.floors > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="no-print flex items-center gap-2">
            <Link
              to="/area"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-indigo-400 border border-slate-800 flex items-center gap-1.5 transition"
            >
              <FiSliders /> Modify Plot
            </Link>
            <Link
              to="/items"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-purple-400 border border-slate-800 flex items-center gap-1.5 transition"
            >
              <FiShoppingBag /> Marketplace ({cartItems.length})
            </Link>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
            <span className="text-xs text-slate-400 font-semibold block">Total Estimated Project Budget</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              ₹{estimate.totalProjectCost.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">₹{estimate.costPerSqFt}/sq.ft built-up</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/20">
            <span className="text-xs text-slate-400 font-semibold block">Material Procurement Cost</span>
            <div className="text-2xl font-extrabold text-indigo-300 mt-1">
              ₹{estimate.totalMaterialCost.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">{cartItems.length > 0 ? `${cartItems.length} supplier items selected` : 'Standard benchmark rates'}</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20">
            <span className="text-xs text-slate-400 font-semibold block">Labor & Contractor Fees</span>
            <div className="text-2xl font-extrabold text-purple-300 mt-1">
              ₹{estimate.totalLaborCost.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">Rate: ₹{estimate.qualityTier.laborRatePerSqFt}/sq.ft ({estimate.qualityTier.name})</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
            <span className="text-xs text-slate-400 font-semibold block">Total Built-Up Slab Area</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {estimate.totalBuiltUpArea.toLocaleString()} <span className="text-xs font-normal text-slate-400">sq.ft</span>
            </div>
            <span className="text-[11px] text-slate-400">Carpet Tiling: {estimate.indoorFlooringArea.toLocaleString()} sq.ft</span>
          </div>

        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="no-print flex items-center gap-2 border-b border-slate-800 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'materials'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FiLayers /> Required Materials Breakdown
        </button>

        <button
          onClick={() => setActiveTab('stages')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'stages'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FiPieChart /> Stage-Wise Financial Milestones
        </button>

        <button
          onClick={() => setActiveTab('labor')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'labor'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FiDollarSign /> Labor & Engineering Allocation
        </button>
      </div>

      {/* TAB 1: Material Breakdown Table */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white">Bill of Quantities (BOQ)</h3>
            <span className="text-xs text-slate-400">Based on IS Code 456 Guidelines</span>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-300 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                    <th className="p-4">Material Category</th>
                    <th className="p-4">Selected Specification</th>
                    <th className="p-4">Est. Quantity</th>
                    <th className="p-4">Unit Rate</th>
                    <th className="p-4">Total Cost</th>
                    <th className="p-4">Pricing Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {estimate.materialBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        {item.category}
                      </td>
                      <td className="p-4 text-slate-300 font-medium">
                        {item.productName}
                      </td>
                      <td className="p-4 font-mono font-bold text-indigo-300">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="p-4 text-slate-300 font-mono">
                        ₹{item.unitPrice.toLocaleString()} / {item.unit}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        ₹{item.totalPrice.toLocaleString()}
                      </td>
                      <td className="p-4 text-xs text-slate-400">
                        {item.isSelectedFromMarketplace ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-semibold">
                            {item.source}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                            Standard Benchmark
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900/90 font-extrabold text-white border-t-2 border-slate-700">
                    <td className="p-4" colSpan="4">Total Material Cost</td>
                    <td className="p-4 font-mono text-emerald-400 text-lg" colSpan="2">
                      ₹{estimate.totalMaterialCost.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Stage-Wise Financial Breakdown */}
      {activeTab === 'stages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white">Construction Stage Milestone Budgeting</h3>
            <span className="text-xs text-slate-400">Standard Civil Workflow Allocation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estimate.stageBreakdown.map((stage, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-xl">
                    {stage.icon}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {stage.percentage}% of Budget
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-white text-base">{stage.name}</h4>
                  <div className="text-2xl font-extrabold text-indigo-400 mt-1">
                    ₹{stage.amount.toLocaleString()}
                  </div>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${stage.percentage}%`, backgroundColor: stage.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Labor & Overhead Breakdown */}
      {activeTab === 'labor' && (
        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-white">Labor, Contractor & Engineering Fees</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Masonry & Structural Labor</span>
              <div className="text-3xl font-extrabold text-purple-400">
                ₹{estimate.totalLaborCost.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">
                Covers skilled masons, bar benders, carpenters, plastering crew, and site supervisors.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Structural Design & Permit Fees</span>
              <div className="text-3xl font-extrabold text-blue-400">
                ₹{estimate.estimatedArchitectFees.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">
                Estimated architectural floor plan drawing, 3D elevation, and municipal plan approval fees.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Finish Grade Tier</span>
              <div className="text-2xl font-extrabold text-white">
                {estimate.qualityTier.name}
              </div>
              <p className="text-xs text-slate-400">
                {estimate.qualityTier.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Notes & Disclaimer */}
      <div className="mt-12 glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-3">
        <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
          <FiInfo className="text-indigo-400" /> Civil Engineering Estimation Notes
        </h4>
        <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1.5 leading-relaxed">
          <li>Material quantities are calculated based on IS 456 thumb rules for residential RCC framed structures.</li>
          <li>Marketplace prices reflect direct distributor listings; where products are unselected, benchmark regional prices are applied.</li>
          <li>Actual project costs may fluctuate based on local soil conditions, foundation depth, and steel market dynamics.</li>
        </ul>
      </div>

    </div>
  );
}
