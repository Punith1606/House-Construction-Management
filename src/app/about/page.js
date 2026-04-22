import React from 'react'
import Head from 'next/head'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>About Us - Our Platform</title>
        <meta name="description" content="Learn about our platform, how it works, and our mission to connect users with products" />
      </Head>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">About Our Platform</h1>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Our platform was created with a simple goal: to connect product distributors directly with potential customers in an efficient, transparent, and user-friendly way. We aim to bridge the gap between sellers and buyers, making product discovery and distribution more accessible to everyone.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">For Distributors</h3>
                <p className="text-gray-600">
                  Distributors can create an account and list their products with detailed information including categories, prices, and contact details. Our platform provides a professional showcase for your products with the ability to edit or remove listings at any time.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">For Customers</h3>
                <p className="text-gray-600">
                  Customers can browse products by category or distributor. Each product listing provides comprehensive information including pricing, distributor contacts, and product images. No middlemen - you connect directly with the source.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Secure Platform</h3>
                <p className="text-gray-600">
                  While we facilitate connections, all transactions occur directly between buyers and sellers. We provide the platform but maintain transparency in all interactions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Key Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Direct connection between buyers and sellers</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Comprehensive product listings with images</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Easy-to-use interface for all users</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Product categorization for easy browsing</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Distributor profiles with contact information</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Mobile-responsive design</span>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We envision a world where product distribution is simplified, where small distributors get equal visibility as large corporations, and where customers can easily find exactly what they need from trusted sources.
          </p>
          <p className="text-gray-600 leading-relaxed">
            In the future, we plan to expand our platform to include features like customer reviews, advanced search filters, and analytics for distributors to better understand their market.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Get In Touch</h2>
          <p className="text-gray-600 mb-4">
            Have questions or suggestions? We&apos;sd love to hear from you!
          </p>
          <div className=" flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
           
             <p className="text-gray-600 mb-4">
            Email Us TO:contact@ourplatform
          </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutPage