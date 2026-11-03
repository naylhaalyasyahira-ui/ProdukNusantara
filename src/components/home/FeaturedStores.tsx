import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Star,
  MapPin,
  ShoppingBag,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const FeaturedStores: React.FC = () => {
  const { stores, openStoreDetail, products } = useApp();

  const verifiedStores = stores.filter((s) => s.isVerified && s.status === 'approved');

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Mitra Toko UMKM Pilihan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelaku usaha mikro & kecil binaan dengan legalitas usaha dan reputasi terpercaya
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {verifiedStores.map((store) => {
          const storeProducts = products.filter((p) => p.storeId === store.id);
          const isSultra = store.provinsi.toLowerCase().includes('sulawesi tenggara');

          return (
            <div
              key={store.id}
              onClick={() => openStoreDetail(store.id)}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              {/* Header Banner */}
              <div className="h-24 w-full relative bg-slate-100 overflow-hidden">
                <img
                  src={store.banner}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>

                {isSultra && (
                  <span className="absolute top-2.5 right-2.5 bg-emerald-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300/30 flex items-center gap-1 backdrop-blur-xs">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Sultra
                  </span>
                )}
              </div>

              {/* Store Info */}
              <div className="p-4 pt-0 relative flex-1 flex flex-col justify-between">
                <div>
                  {/* Floating Logo */}
                  <div className="relative -mt-8 mb-2 flex items-end justify-between">
                    <div className="relative">
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md bg-white"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-slate-800">{store.rating}</span>
                      <span className="text-slate-400 text-[10px]">({store.totalSold} terjual)</span>
                    </div>
                  </div>

                  {/* Title & Slogan */}
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition flex items-center gap-1">
                    <span>{store.name}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{store.slogan}</p>

                  {/* Location badge */}
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-2">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {store.kabupaten}, {store.provinsi}
                    </span>
                  </p>
                </div>

                {/* Footer preview items & button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    <strong className="text-slate-800 font-bold">{storeProducts.length}</strong> Produk
                    Tersedia
                  </span>

                  <span className="font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Kunjungi Toko</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
