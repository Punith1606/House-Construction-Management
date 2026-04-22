"use client"
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

// Material calculation factors
const materialFactors = { 
  "Cement": { factor: 0.4, unit: "Bags" },
  "Flooring Tiles": { factor: 1, unit: "Sq ft" },
  "Steel Rebars": { factor: 5, unit: "Kg" },
  "Paint & Primers":{ factor:0.15, unit: "liters" },
  "Gravel & Sand": { factor: 1.25, unit: "Cubic ft" },
  "Bricks/Blocks ": { factor: 10, unit: "Nos" },
  "Wiring & Cables": { factor:1.5, unit: "meters" },
  "Wood": { factor:0.08, unit: "Cubic ft" },
  "Pluming": { factor:0.05, unit: "Points" },

};


export default function Dashboard() {
  const { data: session } = useSession();
  const [productsByCategory, setProductsByCategory] = useState({});
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buildingData, setBuildingData] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState({});
  const router=useRouter()
  
  useEffect(() => {
    // Load building data from localStorage
    const savedData = localStorage.getItem('buildingData');
    if (savedData) {
      setBuildingData(JSON.parse(savedData));
    }

    const fetchAllProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const products = await response.json();
        
        if (!Array.isArray(products)) {
          throw new Error("Invalid data format");
        }

        const organized = products.reduce((acc, product) => {
          const category = product.productCategory || 'Uncategorized';
          if (!acc[category]) acc[category] = [];
          acc[category].push({
            ...product,
            id: product._id || `${category}-${Math.random().toString(36).substr(2, 9)}`,
            ...materialFactors[category] || { factor: 1, unit: "Unit" }
          });
          return acc;
        }, {});
        
        setProductsByCategory(organized);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Calculate quantities when building data or selections change
  useEffect(() => {
    if (buildingData && Object.keys(selectedProducts).length > 0) {
      const plotArea = buildingData.lengthu * buildingData.breadth;
      const parkingArea = buildingData.parking || 0;
      const floors = buildingData.floors || 1;
      
      const groundFloorArea = plotArea - parkingArea;
      const totalBuildingArea = groundFloorArea + (plotArea * (floors - 1));
      
      const updatedCart = cart.map(item => {
        const category = Object.keys(productsByCategory).find(cat => 
          productsByCategory[cat].some(p => p.id === item.id)
        );
        
        if (category) {
          const product = productsByCategory[category].find(p => p.id === item.id);
          const quantity = category === 'Flooring' 
            ? Math.ceil(totalBuildingArea * product.factor)
            : Math.ceil((groundFloorArea * product.factor) + (plotArea * product.factor * (floors - 1)));
          
          return { ...item, quantity };
        }
        return item;
      });
      
      setCart(updatedCart);
    }
  }, [buildingData, selectedProducts]);

  const addToCart = (product, category) => {
    setCart(prev => {
      // Remove any existing product from the same category
      const filteredCart = prev.filter(item => {
        const itemCategory = Object.keys(productsByCategory).find(cat => 
          productsByCategory[cat].some(p => p.id === item.id)
        );
        return itemCategory !== category;
      });
      
      // Calculate quantity
      let quantity = 1;
      if (buildingData) {
        const plotArea = buildingData.lengthu * buildingData.breadth;
        const parkingArea = buildingData.parking || 0;
        const floors = buildingData.floors || 1;
        const groundFloorArea = plotArea - parkingArea;
        const totalBuildingArea = groundFloorArea + (plotArea * (floors - 1));
        
        quantity = category === 'Flooring' 
          ? Math.ceil(totalBuildingArea * product.factor)
          : Math.ceil((groundFloorArea * product.factor) + (plotArea * product.factor * (floors - 1)));
      }
      
      return [...filteredCart, { ...product, quantity }];
    });

    
    
    // Update selected products
    setSelectedProducts(prev => ({
      ...prev,
      [category]: product
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    
    // Remove from selected products if needed
    setSelectedProducts(prev => {
      const newSelected = {...prev};
      Object.keys(newSelected).forEach(category => {
        if (newSelected[category]?.id === productId) {
          delete newSelected[category];
        }
      });
      return newSelected;
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white inline-block"></div>
        <p className="mt-2">Loading marketplace products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <h2 className="text-xl font-bold mb-2">Error Loading Products</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleCheckout = () => {
    // Save cart to localStorage
    localStorage.setItem('constructionCart', JSON.stringify(cart))
    // Redirect to results page
    router.push('/details')
  }

  return (
    <div className="container mx-auto p-4 min-h-[83vh] text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Marketplace Products</h1>
        <div className="relative">
          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <FiShoppingCart className="text-xl" />
          </button>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </div>
      </div>

      {buildingData && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Your Construction Project</h2>
          <p>Plot Size: {buildingData.lengthu} × {buildingData.breadth} ft ({buildingData.lengthu * buildingData.breadth} sq.ft)</p>
          <p>Floors: {buildingData.floors || 1}</p>
          {buildingData.parking && <p>Parking Area: {buildingData.parking} sq.ft</p>}
        </div>
      )}

      {Object.keys(productsByCategory).length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold mt-4">No Products Available</h2>
          <p className="mt-2 text-gray-400">There are currently no products in the marketplace.</p>
          {session?.user?.email && (
            <button className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
              Add Your First Product
            </button>
          )}
        </div>
      ) : (
        <div className="flex gap-8">
          {/* Products Grid */}
          <div className="flex-1 grid gap-8">
            {Object.entries(productsByCategory).map(([category, products]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => {
                    const inCart = cart.some(item => item.id === product.id);
                    const isSelected = selectedProducts[category]?.id === product.id;
                    
                    return (
                      <div 
                        key={product.id} 
                        className={`group relative border rounded-lg bg-gray-800 overflow-hidden transition-all ${
                          isSelected ? 'border-blue-500' : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {/* Product Image with Hover Overlay */}
                        <div className="relative overflow-hidden">
                          {product.profilepic && (
                            <>
                              <img 
                                src={product.profilepic} 
                                alt={product.productName} 
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              {/* Hover Overlay with Details */}
                              <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 overflow-y-auto">
                                <h3 className="font-bold text-lg mb-2">{product.productName}</h3>
                                <p className="text-gray-300 mb-1">Price: ₹{product.price} per {product.unit}</p>
                                {product.description && (
                                  <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                                )}
                                <div className="space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium">Distributor:</span> {product.distributerName}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Contact:</span> {product.distributerNumber}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Address:</span> {product.distributerAddress}
                                  </p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Product Info (Always Visible) */}
                        <div className="p-4">
                          <h3 className="font-bold text-lg truncate">{product.productName}</h3>
                          <p className="text-gray-300">₹{product.price} per {product.unit}</p>
                          <p className="text-sm text-gray-400 mt-1 truncate">
                            Sold by: {product.username || product.userEmail?.split('@')[0]}
                          </p>

                          {/* Quantity display if in cart */}
                          {inCart && (
                            <p className="text-sm text-blue-400 mt-2">
                              Quantity: {cart.find(item => item.id === product.id)?.quantity || 1} {product.unit}
                            </p>
                          )}

                          {/* Add to Cart Button */}
                          {inCart ? (
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="w-full mt-3 py-2 bg-red-600 hover:bg-red-700 rounded"
                            >
                              Remove from Cart
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(product, category)}
                              className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                            >
                              {selectedProducts[category] ? 'Replace Selection' : 'Select for Project'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Cart Sidebar */}
          <div className="hidden lg:block w-80 bg-gray-800 p-4 rounded-lg h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Your Construction Materials ({cart.length})</h2>
            {cart.length === 0 ? (
              <p className="text-gray-400">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {cart.map(item => {
                    const category = Object.keys(productsByCategory).find(cat => 
                      productsByCategory[cat].some(p => p.id === item.id)
                    );
                    const unit = productsByCategory[category]?.find(p => p.id === item.id)?.unit || 'Unit';
                    
                    return (
                      <div key={item.id} className="flex gap-3 border-b border-gray-700 pb-4">
                        <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden">
                          {item.profilepic && (
                            <img src={item.profilepic} alt={item.productName} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.productName}</h3>
                          <p className="text-sm text-gray-400">{item.quantity} {unit}</p>
                          <p className="text-sm">₹{item.price * item.quantity}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span>Total Quantity:</span>
                    <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} units</span>
                  </div>
                  <div className="flex justify-between font-bold mb-4">
                    <span>Total Cost:</span>
                    <span>₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                  </div>
                  <button 
    onClick={handleCheckout}
    className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 rounded"
  >
    Get Material Estimate
  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Cart Footer */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 border-t border-gray-700 lg:hidden">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold">Materials ({cart.length})</span>
              <span className="ml-2">
                ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
              </span>
            </div>
          
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}