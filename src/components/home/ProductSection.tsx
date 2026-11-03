import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../catalog/ProductCard';
import {
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  ArrowRight
} from 'lucide-react';

export const ProductSection: React.FC = () => {
  const { products, setCurrentView, setSelectedProvince } = useApp();
  const [activeTab, setActiveTab] = useState<'rekomendasi' | 'terlaris' | 'terbaru' | 'sultra'>('rekomendasi');

  let filtered = [...products];
  if (activeTab === 'terlaris') {
    filtered.sort((a, b) => b.sold - a.sold);
  } else if (activeTab === 'terbaru') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (activeTab === 'sultra') {
    filtered = filtered.filter((p) => p.provinsi.toLowerCase().includes('sulawesi tenggara'));
  } else {
    // rekomendasi: featured first
    filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Koleksi Produk UMKM Nusantara</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Diproduksi langsung oleh tangan terampil UMKM Indonesia
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('rekomendasi')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
              activeTab === 'rekomendasi'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rekomendasi</span>
          </button>

          <button
            onClick={() => setActiveTab('terlaris')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
              activeTab === 'terlaris'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Produk Terlaris</span>
          </button>

          <button
            onClick={() => setActiveTab('terbaru')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
              activeTab === 'terbaru'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Produk Terbaru</span>
          </button>

          <button
            onClick={() => setActiveTab('sultra')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
              activeTab === 'sultra'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>Khusus Sultra</span>
          </button>
        </div>
      </div>

      {/* Grid of Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            if (activeTab === 'sultra') {
              setSelectedProvince('Sulawesi Tenggara');
            }
            setCurrentView('catalog');
          }}
          className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs md:text-sm px-6 py-3 rounded-xl border border-emerald-300 shadow-xs hover:border-emerald-500 transition"
        >
          <span>Buka Katalog Lengkap ({products.length} Produk)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
