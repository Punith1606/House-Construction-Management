"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProductsPage() {
  const { username } = useParams()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editFormData, setEditFormData] = useState({
    productName: '',
    productCategory: '',
    price: '',
    distributerName: '',
    distributerNumber: '',
    distributerAddress: '',
    profilepic: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [username])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products?username=${username}`)
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username,
          productId 
        }),
      })
      
      if (!response.ok) throw new Error('Failed to delete product')
      
      // Refresh the product list
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product._id)
    setEditFormData({
      productName: product.productName,
      productCategory: product.productCategory,
      price: product.price,
      distributerName: product.distributerName,
      distributerNumber: product.distributerNumber,
      distributerAddress: product.distributerAddress,
      profilepic: product.profilepic || ''
    })
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username,
          productId: editingProduct,
          updatedProduct: editFormData
        }),
      })
      
      if (!response.ok) throw new Error('Failed to update product')
      
      // Reset editing state and refresh products
      setEditingProduct(null)
      await fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const cancelEdit = () => {
    setEditingProduct(null)
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl min-h-[83vh] text-white mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">{username} Products</h1>
        <p>Loading products...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl min-h-[83vh] text-white mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{username} Products</h1>
      
      {products.length === 0 ? (
        <p>No products found for this user</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product, i) => (
            <div key={i} className="border p-4 rounded shadow bg-gray-800 relative">
              {editingProduct === product._id ? (
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium">Category:</label>
                    <input
                      type="text"
                      name="productCategory"
                      value={editFormData.productCategory}
                      onChange={handleEditFormChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Name:</label>
                    <input
                      type="text"
                      name="productName"
                      value={editFormData.productName}
                      onChange={handleEditFormChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Price:</label>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditFormChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Distributor Name:</label>
                    <input
                      type="text"
                      name="distributerName"
                      value={editFormData.distributerName}
                      onChange={handleEditFormChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Contact:</label>
                    <input
                      type="text"
                      name="distributerNumber"
                      value={editFormData.distributerNumber}
                      onChange={handleEditFormChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Address:</label>
                    <input
                      type="text"
                      name="distributerAddress"
                      value={editFormData.distributerAddress}
                      onChange={handleEditFormChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Image URL:</label>
                    <input
                      type="text"
                      name="profilepic"
                      value={editFormData.profilepic}
                      onChange={handleEditFormChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button 
                      type="button" 
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {product.profilepic && (
                    <img 
                      src={product.profilepic} 
                      alt={product.productName} 
                      className="w-full h-48 object-cover mb-3 rounded"
                    />
                  )}
                  <h3 className="font-bold">Category: {product.productCategory}</h3>
                  <h3 className="font-bold">Name: {product.productName}</h3>
                  <p>Price: ₹{product.price}</p>
                  <h3 className="font-medium">Distributor: {product.distributerName}</h3>
                  <p className="text-sm">Contact: {product.distributerNumber}</p>
                  <p className="text-sm">Address: {product.distributerAddress}</p>
                  
                  <div className="flex justify-end space-x-2 mt-3">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}