import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Store,
  Tag,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    products,
    stores,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    removeFromCart,
    clearCart,
    setIsCheckoutOpen,
    showToast
  } = useApp();

  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);

  if (!isCartOpen) return null;

  // Enrich cart items with product details
  const enrichedItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as (typeof cart[0] & { product: typeof products[0] })[];

  // Group by store
  const storeGroups = enrichedItems.reduce((acc, item) => {
    const storeId = item.product.storeId;
    if (!acc[storeId]) {
      acc[storeId] = {
        store: stores.find((s) => s.id === storeId) || {
          id: storeId,
          name: item.product.storeName,
          kabupaten: item.product.kabupaten
        },
        items: []
      };
    }
    acc[storeId].items.push(item);
    return acc;
  }, {} as Record<string, { store: any; items: typeof enrichedItems }>);

  const subtotal = enrichedItems.reduce(
    (sum, it) => sum + it.product.price * it.quantity,
    0
  );

  const discountAmount = appliedVoucher ? appliedVoucher.discount : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = voucherCode.trim().toUpperCase();
    if (clean === 'NUSANTARA' || clean === 'SULTRAHEBAT' || clean === 'BANGGALOKAL') {
      const disc = Math.round(subtotal * 0.15); // 15% discount
      setAppliedVoucher({ code: clean, discount: disc });
      showToast('success', 'Kupon Berhasil Digunakan!', `Hemat ${formatRupiah(disc)} untuk pesanan ini.`);
    } else {
      showToast('error', 'Kupon Tidak Valid', 'Coba gunakan kode: NUSANTARA atau SULTRAHEBAT');
    }
  };

  const handleProceedToCheckout = () => {
    if (enrichedItems.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Keranjang Belanja ({enrichedItems.length} Produk)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {enrichedItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3 h-3" /> Kosongkan
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {enrichedItems.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-sm text-slate-900">Keranjang Masih Kosong</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Temukan aneka kerajinan, tenun, dan makanan khas Nusantara dari UMKM lokal pilihan.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-sm"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            Object.values(storeGroups).map((group) => (
              <div
                key={group.store.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
              >
                {/* Store Header */}
                <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{group.store.name}</span>
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-[10px] text-slate-400">{group.store.kabupaten}</span>
                </div>

                {/* Items from this store */}
                <div className="divide-y divide-slate-100 p-3 space-y-3">
                  {group.items.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-900 line-clamp-1 leading-snug">
                            {item.product.name}
                          </p>
                          <p className="text-xs font-extrabold text-emerald-700 mt-0.5">
                            {formatRupiah(item.product.price)}
                          </p>
                        </div>

                        {/* Quantity controller & Delete */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                            <button
                              onClick={() => updateCartQty(item.id, item.quantity - 1)}
                              className="p-1 rounded text-slate-600 hover:bg-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(item.id, item.quantity + 1)}
                              className="p-1 rounded text-slate-600 hover:bg-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {enrichedItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-3 shrink-0">
            {/* Voucher input */}
            <form onSubmit={handleApplyVoucher} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Kode Promo (e.g. NUSANTARA)"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="w-full text-xs uppercase pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
              >
                Gunakan
              </button>
            </form>

            {appliedVoucher && (
              <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-100/70 p-2 rounded-xl">
                <span>Diskon Kupon ({appliedVoucher.code}):</span>
                <span className="font-bold">-{formatRupiah(appliedVoucher.discount)}</span>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-1 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal Produk:</span>
                <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Estimasi:</span>
                <span className="text-emerald-700">{formatRupiah(total)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
