import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Store, ProductCategory } from '../../types';
import { formatRupiah, formatWeight, formatDate, getOrderStatusInfo } from '../../utils/formatters';
import {
  Store as StoreIcon,
  Plus,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Star,
  Truck,
  CheckCircle2,
  Clock,
  Layers,
  Settings,
  Image as ImageIcon,
  Save,
  MapPin,
  Sparkles
} from 'lucide-react';
import { getAllProvinces, getKabupatenByProvince, getKecamatanByKabupaten, getDesaByKecamatan } from '../../data/indonesiaRegions';
import { CATEGORIES_LIST } from '../../data/initialData';

export const SellerCenter: React.FC = () => {
  const {
    currentStore,
    currentUser,
    openAuthModal,
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateStore,
    setIsRegisterStoreModalOpen,
    setCurrentView,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'produk' | 'pesanan' | 'pengaturan'>('dashboard');

  // Modals for Products
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Resi input modal
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);
  const [inputResi, setInputResi] = useState('');

  // Form State for Adding / Editing Product
  const defaultProductForm = {
    name: '',
    category: 'Makanan' as ProductCategory,
    price: 50000,
    originalPrice: 60000,
    discountPercent: 15,
    stock: 20,
    weight: 350,
    images: ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800'],
    description: '',
    provinsi: currentStore?.provinsi || 'Sulawesi Tenggara',
    kabupaten: currentStore?.kabupaten || 'Kota Kendari',
    kecamatan: currentStore?.kecamatan || 'Kadia',
    desa: currentStore?.desa || 'Bende',
    tags: ['UMKM', 'Produk Lokal']
  };

  const [productForm, setProductForm] = useState(defaultProductForm);
  const [sampleImageChoice, setSampleImageChoice] = useState('');

  // Store Settings Form
  const [storeForm, setStoreForm] = useState({
    name: currentStore?.name || '',
    slogan: currentStore?.slogan || '',
    description: currentStore?.description || '',
    nib: currentStore?.nib || '',
    phoneNumber: currentStore?.phoneNumber || '',
    provinsi: currentStore?.provinsi || 'Sulawesi Tenggara',
    kabupaten: currentStore?.kabupaten || 'Kota Kendari',
    kecamatan: currentStore?.kecamatan || 'Kadia',
    desa: currentStore?.desa || 'Bende',
    logo: currentStore?.logo || '',
    banner: currentStore?.banner || ''
  });

  if (!currentStore || currentUser?.role !== 'seller') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
          <StoreIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Pusat Penjual Mitra UMKM</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Halaman ini khusus untuk pemilik toko UMKM mengelola produk, pesanan, dan keuangan toko. Silakan masuk menggunakan akun Penjual terdaftar atau buka toko baru.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            onClick={() => setCurrentView('login-seller')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
          >
            <StoreIcon className="w-4 h-4" />
            <span>Buka Halaman Login Penjual</span>
          </button>
          <button
            onClick={() => setIsRegisterStoreModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Buka Toko UMKM Baru</span>
          </button>
        </div>
      </div>
    );
  }

  // Filter products for this store
  const sellerProducts = products.filter((p) => p.storeId === currentStore.id);

  // Filter orders containing items for this store
  const sellerOrders = orders.filter((o) =>
    o.items.some((it) => it.storeId === currentStore.id)
  );

  // Analytics calculation
  const totalIncome = sellerOrders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, order) => {
      const storeItems = order.items.filter((it) => it.storeId === currentStore.id);
      return sum + storeItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    }, 0);

  const totalItemsSold = sellerProducts.reduce((sum, p) => sum + p.sold, 0);
  const pendingOrdersCount = sellerOrders.filter((o) => o.orderStatus === 'diproses').length;

  const handleOpenAddProduct = () => {
    setProductForm({
      ...defaultProductForm,
      provinsi: currentStore.provinsi,
      kabupaten: currentStore.kabupaten,
      kecamatan: currentStore.kecamatan,
      desa: currentStore.desa
    });
    setEditingProduct(null);
    setIsAddProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      discountPercent: prod.discountPercent || 0,
      stock: prod.stock,
      weight: prod.weight,
      images: prod.images,
      description: prod.description,
      provinsi: prod.provinsi,
      kabupaten: prod.kabupaten,
      kecamatan: prod.kecamatan || currentStore.kecamatan,
      desa: prod.desa || currentStore.desa,
      tags: prod.tags
    });
    setIsAddProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: productForm.name,
        category: productForm.category,
        price: productForm.price,
        originalPrice: productForm.originalPrice,
        discountPercent: productForm.discountPercent,
        stock: productForm.stock,
        weight: productForm.weight,
        images: productForm.images,
        description: productForm.description,
        tags: productForm.tags
      });
    } else {
      addProduct({
        name: productForm.name,
        slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: productForm.category,
        price: productForm.price,
        originalPrice: productForm.originalPrice,
        discountPercent: productForm.discountPercent,
        stock: productForm.stock,
        weight: productForm.weight,
        images: productForm.images,
        description: productForm.description,
        provinsi: productForm.provinsi,
        kabupaten: productForm.kabupaten,
        kecamatan: productForm.kecamatan,
        desa: productForm.desa,
        tags: productForm.tags
      });
    }

    setIsAddProductModalOpen(false);
  };

  const handleConfirmShipment = () => {
    if (!shippingOrderId || !inputResi.trim()) return;
    updateOrderStatus(
      shippingOrderId,
      'dikirim',
      inputResi.trim(),
      `Paket telah diserahkan ke jasa kurir dengan nomor resi ${inputResi.trim()}`
    );
    setShippingOrderId(null);
    setInputResi('');
  };

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStore(storeForm);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Seller Center Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src={currentStore.logo}
            alt={currentStore.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{currentStore.name}</h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Mitra UMKM Resmi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentStore.slogan}</p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>
                {currentStore.desa}, {currentStore.kecamatan}, {currentStore.kabupaten},{' '}
                {currentStore.provinsi}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddProduct}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Laporan & Ringkasan</span>
        </button>

        <button
          onClick={() => setActiveTab('produk')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'produk'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kelola Produk ({sellerProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pesanan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'pesanan'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pesanan Masuk ({sellerOrders.length})</span>
          {pendingOrdersCount > 0 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingOrdersCount} Baru
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('pengaturan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'pengaturan'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Toko</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD & STATS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-xs font-medium block">Total Pemasukan (Omset)</span>
              <p className="text-xl md:text-2xl font-black text-emerald-700 mt-1">
                {formatRupiah(totalIncome)}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                &bull; Transaksi diverifikasi
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-xs font-medium block">Produk Terjual</span>
              <p className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                {totalItemsSold} Unit
              </p>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Total dari seluruh etalase
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-xs font-medium block">Pesanan Masuk</span>
              <p className="text-xl md:text-2xl font-black text-blue-600 mt-1">
                {sellerOrders.length} Pesanan
              </p>
              <span className="text-[10px] text-amber-600 font-semibold mt-1 block">
                {pendingOrdersCount} perlu dikemas
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-xs font-medium block">Rating Toko</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-xl md:text-2xl font-black text-slate-900">
                  {currentStore.rating}
                </span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Berdasarkan ulasan pembeli
              </span>
            </div>
          </div>

          {/* Quick Info Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 border border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-amber-300">
                Pemberdayaan Digital UMKM ProdukNusantara
              </h3>
              <p className="text-xs text-emerald-100 max-w-xl">
                Toko Anda otomatis terhubung ke sistem logistik Se-Nusantara dan pembayaran sandbox
                otomatis untuk mempermudah transaksi.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('produk')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shrink-0"
            >
              Lihat Daftar Produk
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: KELOLA PRODUK (Tambah / Edit / Hapus) */}
      {activeTab === 'produk' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Produk di Etalase ({sellerProducts.length})
            </h3>
            <button
              onClick={handleOpenAddProduct}
              className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Produk</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Harga</th>
                    <th className="p-3.5">Stok</th>
                    <th className="p-3.5">Terjual</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellerProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                            <span className="text-[10px] text-slate-400">
                              Berat: {formatWeight(p.weight)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-emerald-700">
                        {formatRupiah(p.price)}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`font-semibold ${
                            p.stock <= 5 ? 'text-rose-600' : 'text-slate-800'
                          }`}
                        >
                          {p.stock} unit
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">{p.sold}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Edit Produk"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PESANAN MASUK & STATUS MANAJEMEN */}
      {activeTab === 'pesanan' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Daftar Pesanan Masuk ({sellerOrders.length})
          </h3>

          {sellerOrders.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">
              Belum ada pesanan masuk untuk toko Anda saat ini.
            </p>
          ) : (
            <div className="space-y-3">
              {sellerOrders.map((ord) => {
                const storeItems = ord.items.filter((it) => it.storeId === currentStore.id);
                const statusInfo = getOrderStatusInfo(ord.orderStatus);

                return (
                  <div
                    key={ord.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-2 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900">{ord.id}</span>
                        <span className="text-slate-400 ml-2">{formatDate(ord.createdAt)}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Buyer & Destination */}
                    <div className="text-xs text-slate-600 space-y-0.5">
                      <p>
                        Pembeli: <strong className="text-slate-800">{ord.buyerName}</strong> ({ord.buyerPhone})
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Alamat: {ord.shippingAddress.detailAlamat}, Desa {ord.shippingAddress.desa}, {ord.shippingAddress.kabupaten}
                      </p>
                    </div>

                    {/* Items for this store */}
                    <div className="space-y-1.5 pt-1">
                      {storeItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={item.productImage}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <span>{item.quantity}x {item.productName}</span>
                          </div>
                          <span className="font-bold text-slate-800">
                            {formatRupiah(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Action Controllers */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs">
                        <span className="text-slate-400">Jasa Kurir:</span>{' '}
                        <strong className="text-slate-800">{ord.courier.name}</strong>
                        {ord.resiNumber && (
                          <span className="ml-2 font-mono bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                            Resi: {ord.resiNumber}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {ord.orderStatus === 'menunggu_pembayaran' && (
                          <span className="text-xs text-amber-600 italic">
                            Menunggu konfirmasi bayar pembeli
                          </span>
                        )}

                        {ord.orderStatus === 'diproses' && (
                          <button
                            onClick={() => {
                              setShippingOrderId(ord.id);
                              setInputResi(
                                `${ord.courier.name.slice(0, 3).toUpperCase()}-SULTRA-${Math.floor(
                                  100000 + Math.random() * 900000
                                )}`
                              );
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Kirim Paket & Input Resi</span>
                          </button>
                        )}

                        {ord.orderStatus === 'dikirim' && (
                          <button
                            onClick={() =>
                              updateOrderStatus(
                                ord.id,
                                'selesai',
                                undefined,
                                'Pesanan selesai dikonfirmasi oleh kurir/penjual'
                              )
                            }
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl"
                          >
                            Tandai Paket Selesai
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PENGATURAN TOKO */}
      {activeTab === 'pengaturan' && (
        <form
          onSubmit={handleSaveStoreSettings}
          className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 max-w-2xl shadow-xs"
        >
          <h3 className="font-bold text-sm text-slate-900">Pengaturan Informasi Toko UMKM</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nama Toko UMKM
              </label>
              <input
                type="text"
                value={storeForm.name}
                onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nomor Induk Berusaha (NIB)
              </label>
              <input
                type="text"
                value={storeForm.nib}
                onChange={(e) => setStoreForm({ ...storeForm, nib: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Slogan / Tagline Toko
            </label>
            <input
              type="text"
              value={storeForm.slogan}
              onChange={(e) => setStoreForm({ ...storeForm, slogan: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Deskripsi Profil Toko
            </label>
            <textarea
              rows={3}
              value={storeForm.description}
              onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                URL Logo Toko
              </label>
              <input
                type="text"
                value={storeForm.logo}
                onChange={(e) => setStoreForm({ ...storeForm, logo: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                URL Banner Sampul
              </label>
              <input
                type="text"
                value={storeForm.banner}
                onChange={(e) => setStoreForm({ ...storeForm, banner: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Toko</span>
          </button>
        </form>
      )}

      {/* MODAL: TAMBAH / EDIT PRODUK */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-in zoom-in-95 shadow-2xl my-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {editingProduct ? 'Edit Data Produk UMKM' : 'Tambah Produk Baru ke Etalase'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-800"
              >
                &times;
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Kain Tenun Buton Asli / Kacang Mete Kendari"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Kategori Produk
                </label>
                <select
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value as ProductCategory })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Berat (gram)
                </label>
                <input
                  type="number"
                  required
                  min={10}
                  value={productForm.weight}
                  onChange={(e) =>
                    setProductForm({ ...productForm, weight: parseInt(e.target.value) || 100 })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Harga Jual (Rp)
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: parseInt(e.target.value) || 0 })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Harga Coret (Rp)
                </label>
                <input
                  type="number"
                  value={productForm.originalPrice}
                  onChange={(e) =>
                    setProductForm({ ...productForm, originalPrice: parseInt(e.target.value) || 0 })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Stok Barang
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            {/* Photo Input & Sample Presets */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                URL Foto Produk (atau pilih sampel foto UMKM berkualitas)
              </label>
              <input
                type="text"
                required
                value={productForm.images[0] || ''}
                onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 mb-2"
              />

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { label: 'Tenun Etnik', url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800' },
                  { label: 'Kacang Mete', url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800' },
                  { label: 'Kopi Tolaki', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800' },
                  { label: 'Anyaman Tas', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800' },
                  { label: 'Madu Hutan', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800' }
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setProductForm({ ...productForm, images: [s.url] })}
                    className="text-[10px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 p-1.5 rounded-lg border border-slate-200 shrink-0"
                  >
                    + {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Deskripsi Detail Produk
              </label>
              <textarea
                rows={3}
                required
                placeholder="Jelaskan keaslian bahan, cara pembuatan, cita rasa, atau keunggulan produk UMKM Anda..."
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-xs text-slate-500 px-4 py-2"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition"
              >
                {editingProduct ? 'Simpan Perubahan' : 'Terbitkan Produk'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: INPUT NOMOR RESI PENGIRIMAN */}
      {shippingOrderId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 animate-in zoom-in-95 shadow-xl">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Input Nomor Resi Pengiriman</span>
            </h4>
            <p className="text-xs text-slate-500">
              Masukkan nomor resi ekspedisi untuk memperbarui status pesanan menjadi{' '}
              <strong>"Sedang Dikirim"</strong>.
            </p>

            <input
              type="text"
              required
              placeholder="Contoh: JNE-SULTRA-889912"
              value={inputResi}
              onChange={(e) => setInputResi(e.target.value)}
              className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 uppercase"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShippingOrderId(null)}
                className="text-xs text-slate-500 px-3 py-1.5"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmShipment}
                disabled={!inputResi.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl disabled:opacity-50"
              >
                Konfirmasi Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
