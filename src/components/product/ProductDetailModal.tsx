import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatWeight, formatDate } from '../../utils/formatters';
import {
  X,
  Star,
  MapPin,
  Heart,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Sparkles,
  MessageCircle,
  Share2,
  Check,
  Plus,
  Minus,
  Store as StoreIcon,
  Send
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    stores,
    openStoreDetail,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setIsCheckoutOpen,
    reviews,
    addReview,
    currentUser,
    openChatWithStore,
    showToast
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'ulasan' | 'pengiriman'>('deskripsi');

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedProduct) return null;

  const store = stores.find((s) => s.id === selectedProduct.storeId);
  const isFavorited = isWishlisted(selectedProduct.id);
  const productReviews = reviews.filter((r) => r.productId === selectedProduct.id);
  const isSultra = selectedProduct.provinsi.toLowerCase().includes('sulawesi tenggara');

  const handleAddToCart = () => {
    addToCart(selectedProduct.id, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct.id, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    showToast('info', 'Tautan Disalin', 'Tautan produk berhasil disalin ke clipboard Anda.');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingReview(true);
    addReview(selectedProduct.id, newRating, newComment);
    setNewComment('');
    setIsSubmittingReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 my-auto">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Kategori:</span>
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {selectedProduct.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 transition"
              title="Bagikan Produk"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 md:p-7 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Column */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center"
                />

                {isSultra && (
                  <span className="absolute top-3 left-3 bg-emerald-900 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-600 flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Khas Sulawesi Tenggara
                  </span>
                )}

                {selectedProduct.discountPercent && selectedProduct.discountPercent > 0 && (
                  <span className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                    Hemat {selectedProduct.discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                        activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Store mini preview box */}
              {store && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-xs text-slate-900 truncate">{store.name}</p>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{store.kabupaten}, {store.provinsi}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openChatWithStore(store)}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition"
                      title="Chat dengan UMKM"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        openStoreDetail(store.id);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
                    >
                      Kunjungi
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Info & Buying Column */}
            <div className="flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                  {selectedProduct.name}
                </h2>

                {/* Rating & Sold count */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{selectedProduct.rating}</span>
                  </div>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-slate-600 font-medium">
                    {productReviews.length} Ulasan
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-slate-600 font-medium">
                    {selectedProduct.sold} Terjual
                  </span>
                </div>

                {/* Price */}
                <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100 flex items-baseline gap-3">
                  <span className="text-2xl md:text-3xl font-extrabold text-emerald-800">
                    {formatRupiah(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatRupiah(selectedProduct.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Specs Pill Summary */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Berat Produk</span>
                    <span className="font-bold text-slate-800">{formatWeight(selectedProduct.weight)}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Stok Tersedia</span>
                    <span className={`font-bold ${selectedProduct.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {selectedProduct.stock > 0 ? `${selectedProduct.stock} unit` : 'Habis'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2">
                    <span className="text-slate-400 text-[10px] block">Pengiriman Dari</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{selectedProduct.kabupaten}, {selectedProduct.provinsi}</span>
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700">Jumlah Beli:</span>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1 bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-1 rounded-lg text-slate-600 hover:bg-white disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                      disabled={quantity >= selectedProduct.stock}
                      className="p-1 rounded-lg text-slate-600 hover:bg-white disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={selectedProduct.stock <= 0}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm border border-emerald-300 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Tambah ke Keranjang</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`p-3 rounded-xl border transition ${
                      isFavorited ? 'bg-rose-50 border-rose-300 text-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Simpan Favorit"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={selectedProduct.stock <= 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition disabled:opacity-50"
                >
                  Beli Sekarang Langsung
                </button>
              </div>
            </div>
          </div>

          {/* Tabs: Deskripsi / Ulasan / Pengiriman */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center gap-4 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab('deskripsi')}
                className={`text-xs sm:text-sm font-bold pb-2 transition relative ${
                  activeTab === 'deskripsi'
                    ? 'text-emerald-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Deskripsi Lengkap
                {activeTab === 'deskripsi' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('ulasan')}
                className={`text-xs sm:text-sm font-bold pb-2 transition relative ${
                  activeTab === 'ulasan'
                    ? 'text-emerald-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Ulasan Pembeli ({productReviews.length})
                {activeTab === 'ulasan' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('pengiriman')}
                className={`text-xs sm:text-sm font-bold pb-2 transition relative ${
                  activeTab === 'pengiriman'
                    ? 'text-emerald-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Estimasi Pengiriman
                {activeTab === 'pengiriman' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"></span>
                )}
              </button>
            </div>

            {/* Tab: Deskripsi */}
            {activeTab === 'deskripsi' && (
              <div className="pt-4 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
                <p>{selectedProduct.description}</p>
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-900 block mb-1.5">Tag & Kata Kunci:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.tags.map((t) => (
                      <span key={t} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Ulasan */}
            {activeTab === 'ulasan' && (
              <div className="pt-4 space-y-6">
                {/* Form Tambah Ulasan */}
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3"
                >
                  <h4 className="text-xs font-bold text-emerald-950">Beri Ulasan Produk Ini</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-600 mr-2">Pilih Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="text-amber-400 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${newRating >= star ? 'fill-amber-400' : 'text-slate-300'}`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Bagikan pengalaman Anda tentang kualitas dan keaslian produk ini..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 text-xs p-2.5 rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingReview || !newComment.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim</span>
                    </button>
                  </div>
                </form>

                {/* Review List */}
                <div className="space-y-4">
                  {productReviews.length > 0 ? (
                    productReviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 rounded-2xl bg-white border border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img
                              src={rev.buyerAvatar}
                              alt={rev.buyerName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{rev.buyerName}</p>
                              <div className="flex items-center gap-0.5 text-amber-400">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400">{formatDate(rev.createdAt)}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-4">
                      Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan ulasan!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Pengiriman */}
            {activeTab === 'pengiriman' && (
              <div className="pt-4 space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <Truck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">Kurir Mitra Terintegrasi</p>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                      Pengiriman dilayani oleh JNE (Reguler/YES), SiCepat, Pos Indonesia, dan J&T Express langsung dari lokasi toko ({selectedProduct.kabupaten}, {selectedProduct.provinsi}) ke seluruh wilayah Indonesia.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
