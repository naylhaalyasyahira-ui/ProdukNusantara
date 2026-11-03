import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Sparkles,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  Layers
} from 'lucide-react';
import {
  getAllProvinces,
  getKabupatenByProvince,
  getKecamatanByKabupaten,
  getDesaByKecamatan
} from '../../data/indonesiaRegions';

export const RegionalSpotlight: React.FC = () => {
  const {
    selectedProvince,
    setSelectedProvince,
    selectedKabupaten,
    setSelectedKabupaten,
    selectedKecamatan,
    setSelectedKecamatan,
    selectedDesa,
    setSelectedDesa,
    setCurrentView,
    products
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

  const handleApplyLocation = () => {
    setCurrentView('catalog');
  };

  const sultraRegions = [
    { name: 'Kabupaten Muna', specialty: 'Sentra Tenun Masalili & Jati', count: 4 },
    { name: 'Kota Kendari', specialty: 'Kacang Mete Super & Madu Hutan', count: 6 },
    { name: 'Kabupaten Buton', specialty: 'Tenun Buton & Kerajinan Kerang', count: 3 },
    { name: 'Kabupaten Wakatobi', specialty: 'Anyaman Serat Laut & Keripik Ikan', count: 3 },
    { name: 'Kabupaten Konawe', specialty: 'Kopi Tolaki & Beras Organik Mekongga', count: 2 },
    { name: 'Kota Baubau', specialty: 'Kasoami, Ikan Asap & Songket Wolio', count: 3 }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-700/50">
        {/* Background Decorative */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pencarian UMKM Berbasis Wilayah</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Jelajahi Produk UMKM Berdasarkan Daerah
              </h2>
              <p className="text-xs md:text-sm text-emerald-200 mt-2 leading-relaxed">
                Filter produk UMKM hingga ke tingkat Desa dan Kelurahan. Temukan kekayaan lokal
                otentik, dengan perhatian istimewa pada keindahan dan cita rasa khas Sulawesi Tenggara.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedProvince('Sulawesi Tenggara');
                  setSelectedKabupaten('Semua');
                  setSelectedKecamatan('Semua');
                  setSelectedDesa('Semua');
                  setCurrentView('catalog');
                }}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
              >
                <span>Lihat Semua Produk Sultra</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive 4-Tier Location Selector */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/15 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
              {/* 1. Provinsi */}
              <div>
                <label className="block text-[11px] font-semibold text-emerald-200 mb-1">
                  1. Pilih Provinsi
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedKabupaten('Semua');
                    setSelectedKecamatan('Semua');
                    setSelectedDesa('Semua');
                  }}
                  className="w-full bg-slate-900/80 border border-emerald-400/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="Semua">Seluruh Indonesia (Semua Provinsi)</option>
                  <option value="Sulawesi Tenggara">⭐ Sulawesi Tenggara (Fokus Lokal)</option>
                  {provinces
                    .filter((p) => p !== 'Sulawesi Tenggara')
                    .map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                </select>
              </div>

              {/* 2. Kabupaten / Kota */}
              <div>
                <label className="block text-[11px] font-semibold text-emerald-200 mb-1">
                  2. Kabupaten / Kota
                </label>
                <select
                  value={selectedKabupaten}
                  disabled={selectedProvince === 'Semua'}
                  onChange={(e) => {
                    setSelectedKabupaten(e.target.value);
                    setSelectedKecamatan('Semua');
                    setSelectedDesa('Semua');
                  }}
                  className="w-full bg-slate-900/80 border border-emerald-400/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
                >
                  <option value="Semua">Semua Kabupaten/Kota</option>
                  {kabupatenList.map((kab) => (
                    <option key={kab.name} value={kab.name}>
                      {kab.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Kecamatan */}
              <div>
                <label className="block text-[11px] font-semibold text-emerald-200 mb-1">
                  3. Kecamatan
                </label>
                <select
                  value={selectedKecamatan}
                  disabled={selectedKabupaten === 'Semua'}
                  onChange={(e) => {
                    setSelectedKecamatan(e.target.value);
                    setSelectedDesa('Semua');
                  }}
                  className="w-full bg-slate-900/80 border border-emerald-400/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
                >
                  <option value="Semua">Semua Kecamatan</option>
                  {kecamatanList.map((kec) => (
                    <option key={kec.name} value={kec.name}>
                      {kec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Desa / Kelurahan */}
              <div>
                <label className="block text-[11px] font-semibold text-emerald-200 mb-1">
                  4. Desa / Kelurahan
                </label>
                <select
                  value={selectedDesa}
                  disabled={selectedKecamatan === 'Semua'}
                  onChange={(e) => setSelectedDesa(e.target.value)}
                  className="w-full bg-slate-900/80 border border-emerald-400/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
                >
                  <option value="Semua">Semua Desa/Kelurahan</option>
                  {desaList.map((desa) => (
                    <option key={desa} value={desa}>
                      {desa}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-emerald-200">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  Lokasi terpilih:{' '}
                  <strong className="text-white">
                    {selectedProvince === 'Semua' ? 'Seluruh Indonesia' : selectedProvince}
                    {selectedKabupaten !== 'Semua' && ` > ${selectedKabupaten}`}
                    {selectedKecamatan !== 'Semua' && ` > ${selectedKecamatan}`}
                    {selectedDesa !== 'Semua' && ` > ${selectedDesa}`}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setSelectedProvince('Semua');
                    setSelectedKabupaten('Semua');
                    setSelectedKecamatan('Semua');
                    setSelectedDesa('Semua');
                  }}
                  className="text-xs text-slate-300 hover:text-white px-3 py-2"
                >
                  Reset Lokasi
                </button>
                <button
                  onClick={handleApplyLocation}
                  className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Search className="w-4 h-4" />
                  <span>Tampilkan Produk Daerah Ini</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Buttons for Sulawesi Tenggara Spotlight */}
          <div>
            <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>Sentra UMKM Unggulan Sulawesi Tenggara:</span>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {sultraRegions.map((reg) => (
                <button
                  key={reg.name}
                  onClick={() => {
                    setSelectedProvince('Sulawesi Tenggara');
                    setSelectedKabupaten(reg.name);
                    setSelectedKecamatan('Semua');
                    setSelectedDesa('Semua');
                    setCurrentView('catalog');
                  }}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/15 text-left transition group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    {reg.name}
                  </p>
                  <p className="text-[10px] text-emerald-200 mt-1 line-clamp-1 leading-snug">
                    {reg.specialty}
                  </p>
                  <span className="inline-block mt-2 text-[10px] bg-emerald-700/60 text-emerald-100 px-2 py-0.5 rounded font-medium">
                    Lihat Produk &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
