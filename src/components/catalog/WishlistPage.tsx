import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, setCurrentView } = useApp();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Produk Favorit Saya</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar produk UMKM yang Anda sukai dan ingin dibeli kemudian
          </p>
        </div>

        <button
          onClick={() => setCurrentView('catalog')}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
        >
          <span>Eksplor Produk Lainnya</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoriteProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Belum Ada Produk Favorit</h3>
          <p className="text-xs text-slate-400">
            Klik ikon hati pada produk UMKM nusantara untuk menyimpannya di sini.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="mt-2 bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-sm"
          >
            Mulai Cari Produk
          </button>
        </div>
      )}
    </div>
  );
};
