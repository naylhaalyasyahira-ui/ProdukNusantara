import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Truck,
  HeartHandshake,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setSelectedProvince, setCurrentView, setIsRegisterStoreModalOpen } =
    useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-20 md:pb-12 border-t border-slate-800">
      {/* Assurances Banner */}
      <div className="max-w-7xl mx-auto px-4 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Produk UMKM Terverifikasi</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Setiap mitra UMKM diaudit dan memiliki izin usaha (NIB) serta produk asli buatan tangan Indonesia.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Fokus Kearifan Lokal Nusantara</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pemberdayaan khusus tenun Muna & Buton, mete Kendari, kopi Tolaki Sulawesi Tenggara serta 38 provinsi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Pengiriman Aman & Terlacak</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Didukung kurir terpercaya JNE, SiCepat, Pos Indonesia, dan J&T Express dengan simulasi nomor resi real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-lg">
                PN
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Produk<span className="text-emerald-400">Nusantara</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Platform marketplace modern UMKM Indonesia yang menghubungkan pengrajin, petani lokal,
              dan pelaku usaha mikro dengan pasar nasional. Bangga Buatan Indonesia!
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pusat UMKM Bumi Anoa, Jl. Ahmad Yani No. 88, Kota Kendari, Sulawesi Tenggara</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>kontak@produknusantara.id</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>(0401) 312-8899 / 0811-4000-8899</span>
              </p>
            </div>
          </div>

          {/* Kategori Populer */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Kategori UMKM
            </h5>
            <ul className="space-y-2 text-xs">
              {['Makanan', 'Fashion', 'Kerajinan Tangan', 'Minuman', 'Oleh-oleh Khas Daerah', 'Produk Pertanian'].map(
                (cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentView('catalog');
                      }}
                      className="hover:text-emerald-400 transition"
                    >
                      {cat}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Wilayah Unggulan */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Wilayah Unggulan
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setSelectedProvince('Sulawesi Tenggara');
                    setCurrentView('catalog');
                  }}
                  className="text-amber-300 font-semibold hover:text-amber-200 transition flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" /> Sulawesi Tenggara
                </button>
              </li>
              {['Jawa Barat', 'DI Yogyakarta', 'Jawa Tengah', 'Bali', 'Sumatera Barat', 'Sulawesi Selatan'].map(
                (prov) => (
                  <li key={prov}>
                    <button
                      onClick={() => {
                        setSelectedProvince(prov);
                        setCurrentView('catalog');
                      }}
                      className="hover:text-emerald-400 transition"
                    >
                      {prov}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Penjual & Bantuan */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Untuk Pelaku Usaha
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setIsRegisterStoreModalOpen(true)}
                  className="text-emerald-400 font-medium hover:underline flex items-center gap-1"
                >
                  <span>Daftar Toko UMKM Baru</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('seller-center')}
                  className="hover:text-emerald-400 transition"
                >
                  Panduan Pusat Penjual
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="hover:text-emerald-400 transition"
                >
                  Verifikasi Toko & Sertifikasi NIB
                </button>
              </li>
              <li>
                <span className="text-slate-500">Syarat & Kebijakan UMKM</span>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <p className="text-[11px] font-bold text-amber-300">Pemberitahuan Sandbox</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                Sistem pembayaran saat ini beroperasi dalam mode simulasi terverifikasi untuk perlindungan konsumen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} ProdukNusantara. Dilindungi Hak Cipta. Karya Anak Bangsa.</p>
        <div className="flex items-center gap-4">
          <span>Bangga Berbelanja Produk Lokal</span>
          <span>&bull;</span>
          <span className="text-emerald-400 font-semibold">Bumi Anoa, Sulawesi Tenggara</span>
        </div>
      </div>
    </footer>
  );
};
