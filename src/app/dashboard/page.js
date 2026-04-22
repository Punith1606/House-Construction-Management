"use client"
import React from 'react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const fixedCategories = [ "Cement", "Steel Rebars", "Bricks/Blocks", "Flooring Tiles", "Paint & Primers","Gravel & Sand", "Wiring & Cables", "Switches & Sockets","Wood","Plumbing"];

export default function Page() {
  const [form, setForm] = useState({
    productCategory: fixedCategories[0], // Default to first category
    productName: "",
    price: "",
    distributerName:"",
    distributerNumber:"",
    distributerAddress:"",
    description:"",
    profilepic: ""
  });
  
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          product: { 
            ...form, 
            price: Number(form.price) 
          }
        })
      });
      
      if (response.ok) {
        const hello= session?.user?.email?.split("@")[0]||""
        router.push(`/${hello}/products`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <div className='container mx-auto py-5 px-6 '>
                <h1 className='text-center text-white my-5 text-3xl font-bold'>Add Your Product</h1>

                <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
                    
        <div className="mb-4 text-white">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
          <select
            value={form.productCategory}
            onChange={(e) => setForm({...form, productCategory: e.target.value})}
           className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {fixedCategories.map(productCategory => (
              <option key={productCategory} value={productCategory}>
                {productCategory}
              </option>
            ))}
          </select>
        </div>
                    <div className="my-2">
                        <label htmlFor="productName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
                        <input required value={form.productName} onChange={(e) => setForm({...form, productName: e.target.value})} type="text" name='productName' id="productName" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="my-2">
                        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Price</label>
                        <input required value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} type="text" name='price' id="price" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="my-2">
                        <label htmlFor="distributerName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Distributer Name</label>
                        <input required value={form.distributerName} onChange={(e) => setForm({...form, distributerName: e.target.value})} type="text" name='distributerName' id="distributerName" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="my-2">
                        <label htmlFor="distributerNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Distributer Number</label>
                        <input required value={form.distributerNumber} onChange={(e) => setForm({...form, distributerNumber: e.target.value})} type="text" name='distributerNumber' id="distributerNumber" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="my-2">
                        <label htmlFor="distributerAddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Distributer Address</label>
                        <input required value={form.distributerAddress} onChange={(e) => setForm({...form, distributerAddress: e.target.value})} type="text" name='distributerAddress' id="distributerAddress" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="my-2">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                        <input required value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} type="text" name='description' id="description" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="my-2">
                        <label htmlFor="profilepic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Picture</label>
                        <input required value={form.profilepic} onChange={(e) => setForm({...form, profilepic: e.target.value})} type="text" name='profilepic' id="profilepic" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>

                    {/* Submit Button  */}
                    <div className="my-6">
                        <button type="submit" className="block w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-blue-500 focus:ring-4 focus:outline-none   dark:focus:ring-blue-800 font-medium text-sm">Save</button>
                    </div>
                </form>


            </div>
  )
}

