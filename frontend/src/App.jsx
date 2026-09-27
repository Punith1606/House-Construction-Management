import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AreaCalculator from './pages/AreaCalculator';
import Marketplace from './pages/Marketplace';
import EstimateDetails from './pages/EstimateDetails';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/area" element={<AreaCalculator />} />
          <Route path="/items" element={<Marketplace />} />
          <Route path="/details" element={<EstimateDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
