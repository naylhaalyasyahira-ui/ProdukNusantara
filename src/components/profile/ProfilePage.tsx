import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Save,
  LogOut,
  Package,
  Store,
  ShieldCheck,
  RefreshCw,
  Plus
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    logout,
    orders,
    setCurrentView,
    users,
    switchUser,
    openAuthModal,
    openSupabaseModal,
    resetDemoData,
    currentStore
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phoneNumber: currentUser?.phoneNumber || '',
    avatar: currentUser?.avatar || ''
  });

  if (!currentUser) return null;

  const userOrders = orders.filter((o) => o.buyerId === currentUser.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: form.name,
      phoneNumber: form.phoneNumber,
      avatar: form.avatar
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Profil Pengguna
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola informasi data diri, alamat pengiriman, dan riwayat belanja Anda
          </p>
        </div>

        <button
          onClick={logout}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-rose-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Sesi</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full capitalize">
                  {currentUser.role === 'buyer'
                    ? 'Pembeli'
                    : currentUser.role === 'seller'
                    ? 'Penjual UMKM'
                    : 'Admin'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
              <p className="text-xs text-slate-600 font-medium mt-1">{currentUser.phoneNumber}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Batal Edit' : 'Ubah Data Diri'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="py-4 border-b border-slate-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                URL Foto Profil
              </label>
              <input
                type="text"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </form>
        )}

        {/* Addresses */}
        <div className="pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Daftar Alamat Pengiriman</span>
            </h3>
          </div>

          <div className="space-y-2">
            {currentUser.addresses?.map((addr, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{addr.recipientName}</span>
                  {addr.isPrimary && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Utama
                    </span>
                  )}
                </div>
                <p className="text-slate-600">{addr.detailAlamat}</p>
                <p className="text-slate-400 text-[11px]">
                  Desa {addr.desa}, Kec. {addr.kecamatan}, {addr.kabupaten}, {addr.provinsi} (
                  {addr.postalCode}) &bull; {addr.phoneNumber}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History Summary */}
        <div className="pt-6 border-t border-slate-100 space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Riwayat Transaksi Belanja ({userOrders.length})</span>
            </h3>

            <button
              onClick={() => setCurrentView('orders')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Buka Semua Pesanan &rarr;
            </button>
          </div>

          {userOrders.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {userOrders.slice(0, 3).map((ord) => (
                <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{ord.id}</span>
                    <span className="text-slate-400 ml-2">{formatDate(ord.createdAt)}</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {ord.items.length} Barang &bull; {ord.courier.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700">{formatRupiah(ord.total)}</span>
                    <span className="block text-[10px] text-slate-500 capitalize">
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Belum ada riwayat transaksi.</p>
          )}
        </div>
      </div>

      {/* Role Security & Portal Switcher Quick Box */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300">
              Peralihan Portal Akun Terisolasi (Supabase RBAC)
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Setiap portal memerlukan autentikasi terpisah. Akun Pembeli dilarang login ke akun Admin/Penjual:
            </p>
          </div>
          <button
            onClick={openSupabaseModal}
            className="text-[11px] bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-xl border border-emerald-400/30 transition self-start sm:self-auto flex items-center gap-1.5 shrink-0"
          >
            <span>🔐 Lihat Skema Supabase RLS</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                if (currentUser.id === u.id) return;
                setCurrentView(
                  u.role === 'buyer'
                    ? 'login-buyer'
                    : u.role === 'seller'
                    ? 'login-seller'
                    : 'login-admin'
                );
              }}
              className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                currentUser.id === u.id
                  ? 'bg-emerald-800/80 border-amber-300 text-white shadow-xs'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
              }`}
            >
              <img
                src={u.avatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate">{u.name}</p>
                <p className="text-[10px] text-amber-200 capitalize">
                  {u.role === 'buyer'
                    ? 'Pembeli (Katalog)'
                    : u.role === 'seller'
                    ? 'Penjual UMKM'
                    : 'Administrator'}
                </p>
              </div>
              {currentUser.id === u.id ? (
                <span className="text-[10px] font-bold text-amber-300 bg-emerald-900/80 px-2 py-0.5 rounded-full">
                  Aktif
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 group-hover:text-white">
                  Masuk &rarr;
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={resetDemoData}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Seluruh Data ke Semula</span>
          </button>
        </div>
      </div>
    </div>
  );
};
