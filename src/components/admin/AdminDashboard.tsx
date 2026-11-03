import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  Store,
  Package,
  Layers,
  MapPin,
  TrendingUp,
  Award,
  Sparkles,
  Search,
  Trash2,
  Check
} from 'lucide-react';
import { formatRupiah, formatDate } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    openAuthModal,
    stores,
    products,
    users,
    orders,
    approveStore,
    rejectStore,
    updateProduct,
    deleteProduct,
    setCurrentView,
    openSupabaseModal,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verifikasi' | 'produk' | 'pengguna' | 'sebaran'>('verifikasi');
  const [searchTerm, setSearchTerm] = useState('');

  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto border border-purple-200 shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Akses Khusus Administrator</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Panel pengawasan ini hanya dapat diakses oleh akun Administrator ProdukNusantara. Silakan masuk melalui Portal Admin resmi.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => setCurrentView('login-admin')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Buka Halaman Login Admin</span>
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="text-xs text-slate-500 hover:text-slate-800 py-1"
          >
            Kembali ke Beranda Belanja
          </button>
        </div>
      </div>
    );
  }

  // Stats
  const totalStores = stores.length;
  const verifiedStores = stores.filter((s) => s.isVerified).length;
  const pendingStores = stores.filter((s) => s.status === 'pending');
  const totalProducts = products.length;
  const totalOrdersAmount = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  // Region distribution
  const sultraStoresCount = stores.filter((s) =>
    s.provinsi.toLowerCase().includes('sulawesi tenggara')
  ).length;
  const outsideSultraStoresCount = totalStores - sultraStoresCount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight">
                Panel Administrator ProdukNusantara
              </h1>
              <span className="bg-emerald-800 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-600">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Pusat audit, verifikasi legalitas NIB, moderasi produk, dan pemantauan UMKM 38 provinsi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={openSupabaseModal}
            className="bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-emerald-400/30 transition flex items-center gap-1.5 shadow-sm"
          >
            <span>🔐 Skema Supabase RLS</span>
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition"
          >
            Lihat Tampilan Toko
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs block">Toko Terverifikasi</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {verifiedStores} <span className="text-xs text-slate-400 font-normal">/ {totalStores} Toko</span>
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            {sultraStoresCount} dari Sulawesi Tenggara
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs block">Total Produk Etalase</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{totalProducts}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Tersedia di 8 Kategori</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs block">Volume Transaksi UMKM</span>
          <p className="text-2xl font-black text-blue-700 mt-1">
            {formatRupiah(totalOrdersAmount)}
          </p>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 block">
            {orders.length} Transaksi Tercatat
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs block">Pengguna Terdaftar</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{users.length} Akun</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Pembeli & Pelaku Usaha</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('verifikasi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'verifikasi'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Verifikasi Toko UMKM ({stores.length})</span>
          {pendingStores.length > 0 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingStores.length} Baru
            </span>
          )}
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
          <span>Moderasi Produk ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pengguna')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'pengguna'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola Pengguna ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sebaran')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'sebaran'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Sebaran Daerah</span>
        </button>
      </div>

      {/* TAB 1: VERIFIKASI TOKO */}
      {activeTab === 'verifikasi' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Nama Toko & Slogan</th>
                    <th className="p-3.5">Nomor NIB</th>
                    <th className="p-3.5">Lokasi Sentra</th>
                    <th className="p-3.5">Kontak</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stores.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.logo}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{s.name}</p>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{s.slogan}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] font-semibold text-emerald-800">
                        {s.nib}
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-slate-800">{s.kabupaten}</span>
                        <span className="block text-[10px] text-slate-400">{s.provinsi}</span>
                      </td>
                      <td className="p-3.5 text-slate-700">{s.phoneNumber}</td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            s.isVerified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.isVerified ? 'Terverifikasi' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!s.isVerified ? (
                            <button
                              onClick={() => approveStore(s.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition"
                            >
                              Verifikasi
                            </button>
                          ) : (
                            <button
                              onClick={() => rejectStore(s.id)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition"
                            >
                              Cabut Izin
                            </button>
                          )}
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

      {/* TAB 2: MODERASI PRODUK */}
      {activeTab === 'produk' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Produk</th>
                    <th className="p-3.5">Toko Penjual</th>
                    <th className="p-3.5">Harga</th>
                    <th className="p-3.5">Asal Daerah</th>
                    <th className="p-3.5">Unggulan Home</th>
                    <th className="p-3.5 text-right">Moderasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <p className="font-semibold text-slate-900 max-w-xs line-clamp-1">
                            {p.name}
                          </p>
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">{p.storeName}</td>
                      <td className="p-3.5 font-bold text-emerald-700">{formatRupiah(p.price)}</td>
                      <td className="p-3.5 text-slate-500">
                        {p.kabupaten}, {p.provinsi}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => {
                            updateProduct(p.id, { isFeatured: !p.isFeatured });
                            showToast(
                              'info',
                              'Status Unggulan Diubah',
                              `Produk ${p.name} ${!p.isFeatured ? 'dijadikan' : 'dilepas dari'} produk unggulan.`
                            );
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition ${
                            p.isFeatured
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {p.isFeatured ? '⭐ Unggulan' : 'Standar'}
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                          title="Hapus Produk Pelanggaran"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PENGGUNA */}
      {activeTab === 'pengguna' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Nama & Avatar</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">No. Telepon</th>
                    <th className="p-3.5">Peran</th>
                    <th className="p-3.5">Tanggal Terdaftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <span className="font-bold text-slate-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-700">{u.email}</td>
                      <td className="p-3.5 text-slate-600">{u.phoneNumber}</td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'seller'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SEBARAN DAERAH */}
      {activeTab === 'sebaran' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Distribusi Mitra Sulawesi Tenggara</span>
              </h3>
              <p className="text-xs text-slate-500">
                Sulawesi Tenggara memiliki perhatian khusus dengan jumlah mitra UMKM terbanyak di platform:
              </p>

              <div className="space-y-2.5">
                {[
                  { kab: 'Kabupaten Muna (Sentra Tenun)', count: 4, pct: 40 },
                  { kab: 'Kota Kendari (Mete & Madu)', count: 3, pct: 30 },
                  { kab: 'Kabupaten Konawe (Kopi Mekongga)', count: 2, pct: 20 },
                  { kab: 'Kabupaten Wakatobi (Anyaman Serat)', count: 2, pct: 20 },
                  { kab: 'Kota Baubau (Kasoami & Buton)', count: 2, pct: 20 }
                ].map((item) => (
                  <div key={item.kab} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{item.kab}</span>
                      <span className="text-emerald-700 font-bold">{item.count} UMKM</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${item.pct * 2}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Cakupan Nasional Se-Indonesia</span>
              </h3>
              <p className="text-xs text-slate-500">
                Jangkauan provinsi aktif terhubung ke ekosistem logistik & pembayaran ProdukNusantara:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center">
                  <span className="font-bold text-emerald-950">Sulawesi Tenggara</span>
                  <span className="font-bold text-emerald-700">{sultraStoresCount} Toko Aktif</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span className="font-medium text-slate-800">Jawa Barat & Bandung</span>
                  <span className="font-bold text-slate-700">1 Toko Aktif</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span className="font-medium text-slate-800">DI Yogyakarta & Sentra Bakpia</span>
                  <span className="font-bold text-slate-700">1 Toko Aktif</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span className="font-medium text-slate-800">Provinsi Lainnya (Jawa Tengah, Bali, NTT)</span>
                  <span className="text-slate-500">Kemitraan Terbuka</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
