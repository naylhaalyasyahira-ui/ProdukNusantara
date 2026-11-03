import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  RotateCcw,
  Sparkles,
  MapPin,
  Tag,
  Star,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import {
  getAllProvinces,
  getKabupatenByProvince,
  getKecamatanByKabupaten,
  getDesaByKecamatan
} from '../../data/indonesiaRegions';
import { CATEGORIES_LIST } from '../../data/initialData';
import { formatRupiah } from '../../utils/formatters';

interface ProductFiltersProps {
  onCloseMobile?: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onCloseMobile }) => {
  const {
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
    setPriceRange,
    filterSultraOnly,
    setFilterSultraOnly,
    filterVerifiedOnly,
    setFilterVerifiedOnly,
    resetFilters
  } = useApp();

  const provinces = getAllProvinces();
  const kabupatenList =
    selectedProvince !== 'Semua' ? getKabupatenByProvince(selectedProvince) : [];
  const kecamatanList =
    selectedProvince !== 'Semua' && selectedKabupaten !== 'Semua'
      ? getKecamatanByKabupaten(selectedProvince, selectedKabupaten)
      : [];
  const desaList =
    selectedProvince !== 'Semua' &&
    selectedKabupaten !== 'Semua' &&
    selectedKecamatan !== 'Semua'
      ? getDesaByKecamatan(selectedProvince, selectedKabupaten, selectedKecamatan)
      : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-emerald-600" />
          <span>Filter Produk UMKM</span>
        </h3>
        <button
          onClick={resetFilters}
          className="text-[11px] text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sultra Quick Highlight Switch */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedProvince === 'Sulawesi Tenggara'}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedProvince('Sulawesi Tenggara');
              } else {
                setSelectedProvince('Semua');
              }
              setSelectedKabupaten('Semua');
              setSelectedKecamatan('Semua');
              setSelectedDesa('Semua');
            }}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
          />
          <div className="text-left">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Khusus Sulawesi Tenggara
            </span>
            <p className="text-[10px] text-slate-500">Muna, Kendari, Buton, Wakatobi & Kolaka</p>
          </div>
        </label>
      </div>

      {/* Kategori */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Kategori
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('Semua')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
              selectedCategory === 'Semua'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Semua Kategori
          </button>
          {CATEGORIES_LIST.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCategory(c.name)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                selectedCategory === c.name
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Wilayah / Lokasi Hierarki */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Lokasi Daerah</span>
        </h4>

        {/* 1. Provinsi */}
        <div>
          <label className="block text-[11px] text-slate-500 mb-1">Provinsi</label>
          <select
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedKabupaten('Semua');
              setSelectedKecamatan('Semua');
              setSelectedDesa('Semua');
            }}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
          >
            <option value="Semua">Semua Provinsi (Seluruh Indonesia)</option>
            <option value="Sulawesi Tenggara">⭐ Sulawesi Tenggara (Sultra)</option>
            {provinces
              .filter((p) => p !== 'Sulawesi Tenggara')
              .map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
          </select>
        </div>

        {/* 2. Kabupaten */}
        {selectedProvince !== 'Semua' && (
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Kabupaten / Kota</label>
            <select
              value={selectedKabupaten}
              onChange={(e) => {
                setSelectedKabupaten(e.target.value);
                setSelectedKecamatan('Semua');
                setSelectedDesa('Semua');
              }}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
            >
              <option value="Semua">Semua Kabupaten/Kota</option>
              {kabupatenList.map((k) => (
                <option key={k.name} value={k.name}>
                  {k.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 3. Kecamatan */}
        {selectedKabupaten !== 'Semua' && (
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Kecamatan</label>
            <select
              value={selectedKecamatan}
              onChange={(e) => {
                setSelectedKecamatan(e.target.value);
                setSelectedDesa('Semua');
              }}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
            >
              <option value="Semua">Semua Kecamatan</option>
              {kecamatanList.map((kc) => (
                <option key={kc.name} value={kc.name}>
                  {kc.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 4. Desa */}
        {selectedKecamatan !== 'Semua' && (
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Desa / Kelurahan</label>
            <select
              value={selectedDesa}
              onChange={(e) => setSelectedDesa(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
            >
              <option value="Semua">Semua Desa/Kelurahan</option>
              {desaList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Rentang Harga */}
      <div className="pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Rentang Harga
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <input
              type="number"
              placeholder="Min"
              value={priceRange[0] || ''}
              onChange={(e) =>
                setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
              }
              className="w-1/2 p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs"
            />
            <span className="text-slate-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange[1] || ''}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000])
              }
              className="w-1/2 p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => setPriceRange([0, 50000])}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
            >
              &lt; 50 rb
            </button>
            <button
              onClick={() => setPriceRange([50000, 150000])}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
            >
              50rb - 150rb
            </button>
            <button
              onClick={() => setPriceRange([150000, 500000])}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
            >
              150rb - 500rb
            </button>
          </div>
        </div>
      </div>

      {/* Verifikasi Toko Toggle */}
      <div className="pt-3 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filterVerifiedOnly}
            onChange={(e) => setFilterVerifiedOnly(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-xs text-slate-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hanya UMKM Terverifikasi</span>
          </span>
        </label>
      </div>

      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs md:hidden"
        >
          Terapkan Filter
        </button>
      )}
    </div>
  );
};
