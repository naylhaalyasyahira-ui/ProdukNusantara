import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import {
  SlidersHorizontal,
  X,
  Search,
  Sparkles,
  MapPin,
  Tag,
  ArrowUpDown
} from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const {
    products,
    stores,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedProvince,
    setSelectedProvince,
    selectedKabupaten,
    setSelectedKabupaten,
    selectedKecamatan,
    setSelectedKecamatan,
    selectedDesa,
    setSelectedDesa,
    priceRange,
    sortBy,
    setSortBy,
    filterVerifiedOnly,
    resetFilters
  } = useApp();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter pipeline
  let filtered = products.filter((prod) => {
    // 1. Keyword search (product name, description, tags, store name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchStore = prod.storeName.toLowerCase().includes(q);
      const matchTags = prod.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchStore && !matchTags) return false;
    }

    // 2. Category
    if (selectedCategory !== 'Semua' && prod.category !== selectedCategory) {
      return false;
    }

    // 3. Province
    if (
      selectedProvince !== 'Semua' &&
      prod.provinsi.toLowerCase() !== selectedProvince.toLowerCase()
    ) {
      return false;
    }

    // 4. Kabupaten
    if (
      selectedKabupaten !== 'Semua' &&
      !prod.kabupaten.toLowerCase().includes(selectedKabupaten.toLowerCase())
    ) {
      return false;
    }

    // 5. Price range
    if (prod.price < priceRange[0] || prod.price > priceRange[1]) {
      return false;
    }

    // 6. Verified only
    if (filterVerifiedOnly) {
      const st = stores.find((s) => s.id === prod.storeId);
      if (!st?.isVerified) return false;
    }

    return true;
  });

  // Sorting pipeline
  if (sortBy === 'terlaris') {
    filtered.sort((a, b) => b.sold - a.sold);
  } else if (sortBy === 'terbaru') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === 'harga_terendah') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'harga_tertinggi') {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    // terpopuler: rating & sold
    filtered.sort((a, b) => b.rating * b.sold - a.rating * a.sold);
  }

  const activeFiltersCount =
    (selectedCategory !== 'Semua' ? 1 : 0) +
    (selectedProvince !== 'Semua' ? 1 : 0) +
    (selectedKabupaten !== 'Semua' ? 1 : 0) +
    (filterVerifiedOnly ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Bar with Title & Search Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Katalog Produk UMKM</span>
            {selectedProvince !== 'Semua' && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {selectedProvince}
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Menampilkan <strong className="text-slate-800">{filtered.length}</strong> produk buatan
            tangan dan karya asli pengrajin Indonesia
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 bg-white border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filter ({activeFiltersCount})</span>
          </button>

          <div className="flex items-center gap-2 text-xs bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 hidden sm:inline">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="terpopuler">Paling Populer</option>
              <option value="terlaris">Terlaris</option>
              <option value="terbaru">Produk Terbaru</option>
              <option value="harga_terendah">Harga Terendah</option>
              <option value="harga_tertinggi">Harga Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <span className="text-xs text-slate-400">Filter Aktif:</span>

          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
              <span>"{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== 'Semua' && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
              <Tag className="w-3 h-3 text-emerald-600" />
              <span>{selectedCategory}</span>
              <button onClick={() => setSelectedCategory('Semua')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedProvince !== 'Semua' && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-xs px-2.5 py-1 rounded-full border border-amber-200 font-medium">
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>{selectedProvince}</span>
              <button
                onClick={() => {
                  setSelectedProvince('Semua');
                  setSelectedKabupaten('Semua');
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedKabupaten !== 'Semua' && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-medium">
              <span>{selectedKabupaten}</span>
              <button onClick={() => setSelectedKabupaten('Semua')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs text-rose-600 hover:underline font-semibold ml-1"
          >
            Hapus Semua
          </button>
        </div>
      )}

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block md:col-span-1">
          <div className="sticky top-20">
            <ProductFilters />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="md:col-span-3 lg:col-span-4">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Produk Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Tidak ada produk UMKM yang cocok dengan filter atau kata kunci yang Anda masukkan.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end md:hidden">
          <div className="w-4/5 max-w-sm bg-white h-full overflow-y-auto p-4 flex flex-col justify-between animate-in slide-in-from-right">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <span className="font-bold text-sm text-slate-900">Filter Pencarian</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilters onCloseMobile={() => setIsMobileFilterOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
