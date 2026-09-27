import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiSearch, 
  FiCheck, 
  FiTrash2, 
  FiPhone, 
  FiMapPin, 
  FiUser, 
  FiArrowRight, 
  FiRefreshCw, 
  FiInfo,
  FiSliders,
  FiX
} from 'react-icons/fi';
import { calculateConstructionEstimate, MATERIAL_FACTORS } from '../utils/constructionCalculator';
import { fetchMarketplaceProducts } from '../utils/api';

export default function Marketplace() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [buildingData, setBuildingData] = useState(null);
  const [estimateDetails, setEstimateDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  useEffect(() => {
    const savedBuilding = localStorage.getItem('buildingData');
    let bData = { lengthu: 30, breadth: 40, floors: 1, parking: 150, qualityTier: 'standard' };
    if (savedBuilding) {
      try {
        bData = JSON.parse(savedBuilding);
      } catch (e) {}
    }
    setBuildingData(bData);
    setEstimateDetails(calculateConstructionEstimate(bData));

    const savedCart = localStorage.getItem('constructionCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }

    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchMarketplaceProducts();
      setCategories(Object.keys(MATERIAL_FACTORS));
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (buildingData && cart.length > 0) {
      const calc = calculateConstructionEstimate(buildingData, cart);
      const updatedCart = cart.map(cartItem => {
        const matchingMat = calc.materialBreakdown.find(m => m.category.trim() === cartItem.productCategory.trim());
        const quantity = matchingMat ? matchingMat.quantity : 1;
        return {
          ...cartItem,
          quantity,
          calculatedTotalPrice: Math.round(quantity * Number(cartItem.price))
        };
      });

      localStorage.setItem('constructionCart', JSON.stringify(updatedCart));
    }
  }, [buildingData]);

  const handleSelectProduct = (product) => {
    setCart(prev => {
      const filtered = prev.filter(item => item.productCategory.trim() !== product.productCategory.trim());
      
      const calc = calculateConstructionEstimate(buildingData || { lengthu: 30, breadth: 40, floors: 1 }, [...filtered, product]);
      const matchingMat = calc.materialBreakdown.find(m => m.category.trim() === product.productCategory.trim());
      const quantity = matchingMat ? matchingMat.quantity : 1;

      const newItem = {
        ...product,
        quantity,
        calculatedTotalPrice: Math.round(quantity * Number(product.price))
      };

      const newCart = [...filtered, newItem];
      localStorage.setItem('constructionCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleRemoveFromCart = (categoryName) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.productCategory.trim() !== categoryName.trim());
      localStorage.setItem('constructionCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleCheckout = () => {
    localStorage.setItem('constructionCart', JSON.stringify(cart));
    navigate('/details');
  };

  const filteredProducts = products.filter(product => {
    const matchesCat = activeCategory === 'All' || product.productCategory?.trim() === activeCategory.trim();
    const matchesSearch = 
      product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.distributerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productCategory?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartTotalCost = cart.reduce((sum, item) => sum + (item.calculatedTotalPrice || (item.quantity * item.price)), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[85vh]">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FiShoppingCart /> Material Marketplace & Vendor Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Construction Materials
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Choose branded products from local distributors. Quantities are automatically calculated for your project.
          </p>
        </div>

        {/* Project Context Badge */}
        {buildingData && (
          <div className="glass-card p-4 rounded-2xl border border-indigo-500/30 flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">Your Active Project</div>
              <div className="text-sm font-bold text-white">
                {buildingData.lengthu} × {buildingData.breadth} ft ({buildingData.lengthu * buildingData.breadth} sq.ft)
              </div>
              <div className="text-xs text-indigo-400 font-semibold">
                Built-Up: {estimateDetails?.totalBuiltUpArea} sq.ft • {buildingData.floors} Floor{buildingData.floors > 1 ? 's' : ''}
              </div>
            </div>
            <Link
              to="/area"
              className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1 transition"
            >
              <FiSliders /> Edit
            </Link>
          </div>
        )}
      </div>

      {/* Main Layout: Products & Cart Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Products Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Search & Category Tabs */}
          <div className="space-y-4">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials by name, category, or supplier..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-sm"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeCategory === 'All'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter(p => p.productCategory?.trim() === cat.trim()).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      activeCategory === cat
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading / Error States */}
          {isLoading ? (
            <div className="text-center py-16 space-y-3">
              <FiRefreshCw className="animate-spin text-3xl text-indigo-400 mx-auto" />
              <p className="text-slate-400 text-sm">Loading verified supplier products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 p-8 space-y-4">
              <div className="text-4xl">🔍</div>
              <h3 className="text-lg font-bold text-white">No Materials Found</h3>
              <p className="text-slate-400 text-xs">Try selecting another category or clearing your search term.</p>
            </div>
          ) : (
            
            /* Product Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => {
                const categoryKey = product.productCategory?.trim();
                const selectedInCart = cart.find(c => c.productCategory?.trim() === categoryKey);
                const isThisSelected = selectedInCart && (selectedInCart._id === product._id || selectedInCart.productName === product.productName);

                const matFactor = estimateDetails?.materialBreakdown.find(m => m.category.trim() === categoryKey);
                const reqQty = matFactor ? matFactor.quantity : 1;
                const unitName = product.unit || matFactor?.unit || 'Unit';
                const calculatedItemTotal = Math.round(reqQty * Number(product.price));

                return (
                  <div
                    key={product._id || product.productName}
                    className={`glass-card rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${
                      isThisSelected
                        ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Card Top / Image */}
                    <div>
                      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                        {product.profilepic ? (
                          <img
                            src={product.profilepic}
                            alt={product.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl text-slate-700">
                            🏗️
                          </div>
                        )}
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-slate-700">
                          {product.productCategory}
                        </span>

                        {isThisSelected && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-lg flex items-center gap-1">
                            <FiCheck /> Selected for Project
                          </span>
                        )}
                      </div>

                      {/* Product Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-extrabold text-white text-base leading-snug line-clamp-2">
                            {product.productName}
                          </h3>
                          <div className="text-right">
                            <span className="text-lg font-extrabold text-emerald-400">₹{product.price}</span>
                            <span className="text-[11px] text-slate-400 block">/ {unitName}</span>
                          </div>
                        </div>

                        {product.description && (
                          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        )}

                        {/* Distributor snippet */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1 truncate">
                            <FiUser className="text-indigo-400" />
                            {product.distributerName || product.username || 'Verified Supplier'}
                          </span>
                          <button
                            onClick={() => setSelectedProductForModal(product)}
                            className="text-indigo-400 hover:underline text-[11px] font-semibold flex items-center gap-1"
                          >
                            <FiInfo /> Contact Vendor
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Select Action Footer */}
                    <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Project Quantity</div>
                        <div className="text-sm font-bold text-indigo-300">
                          {reqQty.toLocaleString()} {unitName} <span className="text-[11px] font-normal text-slate-400">(₹{calculatedItemTotal.toLocaleString()})</span>
                        </div>
                      </div>

                      {isThisSelected ? (
                        <button
                          onClick={() => handleRemoveFromCart(categoryKey)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 transition"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSelectProduct(product)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md transition hover:scale-105"
                        >
                          {selectedInCart ? 'Replace Selection' : 'Select Material'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Cart & Project Summary Drawer */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-slate-800 space-y-6 sticky top-28">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <FiShoppingCart className="text-indigo-400" />
              Selected Materials ({cart.length})
            </h3>
            <span className="text-xs text-slate-400">Category Selection</span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <p className="text-sm font-semibold">No custom supplier products selected yet.</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Standard benchmark prices will be used for calculation until you choose specific products.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item._id || item.productCategory} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{item.productCategory}</span>
                      <h4 className="text-xs font-bold text-white truncate max-w-[170px]">{item.productName}</h4>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.productCategory)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                    <span className="text-slate-400">
                      {item.quantity.toLocaleString()} {item.unit || 'Unit'} × ₹{item.price}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      ₹{(item.calculatedTotalPrice || (item.quantity * item.price)).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cart Cost Total & Checkout Action */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-semibold">Selected Supplier Cost:</span>
              <span className="text-xl font-extrabold text-emerald-400">
                ₹{cartTotalCost.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-2xl font-extrabold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>View Complete Estimate Report</span>
              <FiArrowRight />
            </button>
          </div>

        </div>

      </div>

      {/* Distributor Detail Modal */}
      {selectedProductForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-slate-700 space-y-4 relative">
            <button
              onClick={() => setSelectedProductForModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
            >
              <FiX className="text-xl" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-2xl">
                🏪
              </div>
              <div>
                <span className="text-xs text-indigo-400 font-bold uppercase">{selectedProductForModal.productCategory}</span>
                <h3 className="text-lg font-bold text-white">{selectedProductForModal.distributerName || 'Verified Supplier'}</h3>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <FiPhone className="text-indigo-400" />
                <div>
                  <div className="text-[11px] text-slate-400">Contact Number</div>
                  <div className="font-semibold text-white">{selectedProductForModal.distributerNumber || '+91 9876543210'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <FiMapPin className="text-indigo-400" />
                <div>
                  <div className="text-[11px] text-slate-400">Distributor Address</div>
                  <div className="font-semibold text-white">{selectedProductForModal.distributerAddress || 'Main Industrial Estate Market'}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400">Product Specification</div>
                <div className="font-semibold text-white">{selectedProductForModal.productName}</div>
                <div className="text-xs text-emerald-400 font-bold mt-1">₹{selectedProductForModal.price} per {selectedProductForModal.unit || 'Unit'}</div>
              </div>
            </div>

            <button
              onClick={() => setSelectedProductForModal(null)}
              className="w-full py-3 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
