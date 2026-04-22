"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EstimatePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    lengthu: '',
    breadth: '',
    floors: '1',
    parking: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.lengthu || !form.breadth) {
      alert("Please enter plot dimensions")
      return
    }
    
    // Save to localStorage
    localStorage.setItem('buildingData', JSON.stringify(form))
    router.push('/items')
  }

  return (
    <div className="container mx-auto min-h-[83vh] text-white p-4">
      <h1 className="text-3xl font-bold mb-8">House Construction Calculator</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-6">
          <label className="block mb-2 text-lg">Plot Dimensions (in feet)</label>
          <div className="flex gap-4">
            <input
              type="number"
              name="lengthu"
              value={form.lengthu}
              onChange={handleChange}
              placeholder="Length"
              className="w-full p-3 bg-gray-800 rounded"
              required
            />
            <input
              type="number"
              name="breadth"
              value={form.breadth}
              onChange={handleChange}
              placeholder="Breadth"
              className="w-full p-3 bg-gray-800 rounded"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-lg">Number of Floors</label>
          <select
            name="floors"
            value={form.floors}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Floor{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label className="block mb-2 text-lg">Parking Area (sq. ft)</label>
          <input
            type="number"
            name="parking"
            value={form.parking}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full p-3 bg-gray-800 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
        >
          Calculate Materials
        </button>
      </form>
    </div>
  )
}