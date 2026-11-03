import React from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  Star,
  MapPin,
  Heart,
  ShoppingCart,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, toggleWishlist, isWishlisted } = useApp();

  const isFavorited = isWishlisted(product.id);
  const isSultra = product.provinsi.toLowerCase().includes('sulawesi tenggara');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden cursor-pointer group relative"
    >
      {/* Thumbnail & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Simpan ke favorit"
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition shadow-sm z-10 ${
            isFavorited
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {isSultra && (
            <span className="inline-flex items-center gap-1 bg-emerald-800 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-emerald-600">
              <Sparkles className="w-3 h-3 text-amber-300" /> Sultra Asli
            </span>
          )}

          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Diskon {product.discountPercent}%
            </span>
          )}
        </div>

        {/* Stock warning if low */}
        {product.stock <= 5 && (
          <div className="absolute bottom-2 left-2 bg-amber-500/90 backdrop-blur-sm text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded">
            Sisa {product.stock}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Store & Location */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 gap-1">
            <span className="truncate font-medium text-slate-600 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{product.storeName}</span>
            </span>
            <span className="shrink-0 flex items-center gap-0.5 text-slate-400 text-[10px]">
              <MapPin className="w-2.5 h-2.5 text-emerald-500" />
              <span>{product.kabupaten.replace('Kabupaten ', 'Kab. ')}</span>
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-xs md:text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm md:text-base font-extrabold text-emerald-700">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Footer: Rating, Sold & Add to cart button */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-600">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <span className="font-bold text-slate-800">{product.rating}</span>
            <span className="text-slate-400 text-[10px]">({product.sold} terjual)</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white transition shadow-2xs border border-emerald-200"
            title="Tambah ke Keranjang"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
