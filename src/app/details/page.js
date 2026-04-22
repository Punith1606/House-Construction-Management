"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ResultsPage() {
  const [buildingData, setBuildingData] = useState(null)
  const [materials, setMaterials] = useState([])
  const [totalCost, setTotalCost] = useState(0)
  const [activeTab, setActiveTab] = useState('materials')

  useEffect(() => {
    const savedData = localStorage.getItem('buildingData')
    const savedCart = localStorage.getItem('constructionCart')
    
    if (savedData) {
      const data = JSON.parse(savedData)
      setBuildingData(data)
      
      if (savedCart) {
        const cart = JSON.parse(savedCart)
        calculateMaterials(data, cart)
      }
    }
  }, [])

  const calculateMaterials = (data, cart) => {
    const plotArea = data.lengthu * data.breadth
    const parkingArea = data.parking || 0
    const floors = data.floors || 1
    
    const groundFloorArea = plotArea - parkingArea
    const totalBuildingArea = groundFloorArea + (plotArea * (floors - 1))
    
    const calculatedMaterials = cart.map(item => {
      // Calculate quantity based on building type
      let quantity = 0
      if (item.productCategory === "Flooring Tiles") {
        quantity = Math.ceil(totalBuildingArea * (item.factor || 1))
      } else {
        quantity = Math.ceil(
          (groundFloorArea * (item.factor || 1)) + 
          (plotArea * (item.factor || 1) * (floors - 1))
        )
      }
      
      return {
        ...item,
        quantity,
        totalPrice: quantity * item.price
      }
    })
    
    setMaterials(calculatedMaterials)
    
    // Calculate total cost
    const total = calculatedMaterials.reduce((sum, item) => sum + item.totalPrice, 0)
    setTotalCost(total)
  }

  if (!buildingData) {
    return (
      <div className="container mx-auto min-h-[83vh] text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Building Data Found</h2>
          <Link href="/area" className="text-blue-400 hover:underline">
            Go back to calculator
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto min-h-[83vh] text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Construction Estimate Results</h1>
      
      <div className="mb-8 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Project Details</h2>
        <p>Plot Size: {buildingData.lengthu} × {buildingData.breadth} ft ({buildingData.lengthu * buildingData.breadth} sq.ft)</p>
        <p>Floors: {buildingData.floors || 1}</p>
        {buildingData.parking && <p>Parking Area: {buildingData.parking} sq.ft</p>}
      </div>
      
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 ${activeTab === 'materials' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Materials
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'cost' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('cost')}
        >
          Cost Breakdown
        </button>
      </div>
      
      {activeTab === 'materials' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Required Materials</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-3 text-left">Material</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Unit</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((item, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="p-3">{item.productName}</td>
                    <td className="p-3">{item.quantity.toLocaleString()}</td>
                    <td className="p-3">{item.unit || 'Unit'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'cost' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Cost Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-3 text-left">Material</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Unit Price (₹)</th>
                  <th className="p-3 text-left">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((item, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="p-3">{item.productName}</td>
                    <td className="p-3">{item.quantity.toLocaleString()}</td>
                    <td className="p-3">₹{item.price.toLocaleString()}</td>
                    <td className="p-3">₹{item.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-800 font-bold">
                  <td className="p-3" colSpan="3">Total Cost</td>
                  <td className="p-3">₹{totalCost.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg mt-6">
            <h3 className="font-semibold mb-2">Notes</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Prices are based on the selected products from the marketplace</li>
              <li>Actual costs may vary based on location and market conditions</li>
              <li>Consult with contractors for precise estimates</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <Link 
          href="/area" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold inline-block"
        >
          Recalculate
        </Link>
      </div>
    </div>
  )
}