import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../catalog/ProductCard';
import {
  ShieldCheck,
  Star,
  MapPin,
  MessageCircle,
  Phone,
  ArrowLeft,
  Sparkles,
  Award,
  Package
} from 'lucide-react';

export const StoreDetailPage: React.FC = () => {
  const {
    activeStoreDetailId,
    stores,
    products,
    setCurrentView,
    openChatWithStore
  } = useApp();

  const store = stores.find((s) => s.id === activeStoreDetailId) || stores[0];
  const storeProducts = products.filter((p) => p.storeId === store?.id);
  const isSultra = store?.provinsi.toLowerCase().includes('sulawesi tenggara');

  if (!store) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-sm text-slate-500">Toko tidak ditemukan.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-3 text-xs text-emerald-700 font-bold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('home')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </button>

      {/* Store Banner & Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-44 md:h-60 w-full relative bg-slate-900">
          <img
            src={store.banner}
            alt={store.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>

          {isSultra && (
            <span className="absolute top-4 right-4 bg-emerald-900/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-300/40 flex items-center gap-1.5 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Mitra Resmi Sulawesi Tenggara
            </span>
          )}
        </div>

        {/* Profile Info Bar */}
        <div className="p-5 md:p-8 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 md:-mt-16 mb-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">
                    {store.name}
                  </h1>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3" /> Terverifikasi
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{store.slogan}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openChatWithStore(store)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Penjual UMKM</span>
              </button>
            </div>
          </div>

          <p className="text-xs md:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {store.description}
          </p>

          {/* Badges / Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Rating Toko</span>
              <div className="flex items-center gap-1 font-bold text-slate-900 mt-0.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{store.rating} / 5.0</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Total Produk Terjual</span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {store.totalSold} Produk
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Nomor Induk Berusaha (NIB)</span>
              <span className="font-mono font-bold text-emerald-800 mt-0.5 block truncate">
                {store.nib}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Lokasi Sentra</span>
              <span className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{store.kabupaten}, {store.provinsi}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Store Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>Katalog Produk Toko Ini ({storeProducts.length})</span>
          </h2>
        </div>

        {storeProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {storeProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-6">
            Toko ini belum menambahkan produk ke etalasenya.
          </p>
        )}
      </div>
    </div>
  );
};
