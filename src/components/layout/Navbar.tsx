import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  ShoppingCart,
  Heart,
  Store,
  ShieldCheck,
  User,
  ChevronDown,
  MapPin,
  Menu,
  X,
  Package,
  Layers,
  Sparkles,
  RefreshCw,
  LogOut,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { getAllProvinces } from '../../data/indonesiaRegions';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    users,
    switchUser,
    logout,
    currentStore,
    cart,
    wishlist,
    orders,
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedProvince,
    setSelectedProvince,
    setIsCartOpen,
    setIsAuthModalOpen,
    openAuthModal,
    openSupabaseModal,
    setIsRegisterStoreModalOpen,
    resetDemoData
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, it) => sum + it.quantity, 0);
  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'selesai' && o.orderStatus !== 'dibatalkan'
  ).length;

  const provinces = getAllProvinces();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('catalog');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 shadow-sm">
      {/* Top Notification Bar / Quick Utility */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar">
            <span className="inline-flex items-center gap-1 bg-emerald-800/80 text-amber-200 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-amber-300/30">
              <Sparkles className="w-3 h-3 text-amber-300" /> Sorotan Daerah
            </span>
            <span className="truncate">
              Bumi Anoa: Temukan produk unggulan UMKM Sulawesi Tenggara & seluruh Nusantara!
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Direct Links for Separated Portals */}
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <button
                onClick={() => setCurrentView('login-buyer')}
                className="hover:text-amber-200 text-emerald-200 px-2 py-0.5 rounded transition flex items-center gap-1 font-medium"
              >
                <span>🛒 Halaman Login Pembeli</span>
              </button>
              <span className="text-emerald-700/60">&bull;</span>
              <button
                onClick={() => {
                  if (currentUser?.role === 'seller') {
                    setCurrentView('seller-center');
                  } else {
                    setCurrentView('login-seller');
                  }
                }}
                className="hover:text-amber-200 text-amber-300 px-2 py-0.5 rounded transition flex items-center gap-1 font-semibold"
              >
                <span>🏪 Halaman Login Penjual</span>
              </button>
              <span className="text-emerald-700/60">&bull;</span>
              <button
                onClick={() => {
                  if (currentUser?.role === 'admin') {
                    setCurrentView('admin');
                  } else {
                    setCurrentView('login-admin');
                  }
                }}
                className="hover:text-white text-emerald-300 px-2 py-0.5 rounded transition flex items-center gap-1 font-medium"
              >
                <span>🛡️ Halaman Login Admin</span>
              </button>
              <span className="text-emerald-700/60">&bull;</span>
              <button
                onClick={openSupabaseModal}
                className="hover:text-white text-emerald-300 hover:bg-emerald-800/60 bg-emerald-900/60 border border-emerald-700/60 px-2 py-0.5 rounded text-[11px] transition flex items-center gap-1 font-semibold"
                title="Lihat Aturan Supabase Row Level Security (RLS)"
              >
                <span>🔐 Supabase RLS</span>
              </button>
            </div>

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded-md text-xs transition border border-emerald-700/60"
              >
                <span>Peran:</span>
                <span className="font-bold text-amber-300 capitalize">
                  {currentUser?.role === 'buyer'
                    ? 'Pembeli'
                    : currentUser?.role === 'seller'
                    ? 'Penjual UMKM'
                    : 'Admin'}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isRoleDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-68 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Pintu Masuk Terpisah Akun
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Ganti login atau uji coba peran:
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-1 mb-2 pb-2 border-b border-slate-100">
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        setCurrentView('login-buyer');
                      }}
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold text-center"
                    >
                      🛒 Hlm. Pembeli
                    </button>
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        setCurrentView('login-seller');
                      }}
                      className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-[10px] font-bold text-center"
                    >
                      🏪 Hlm. Penjual
                    </button>
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        setCurrentView('login-admin');
                      }}
                      className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-lg text-[10px] font-bold text-center"
                    >
                      🛡️ Hlm. Admin
                    </button>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-semibold px-1">Pilih Akun Terdaftar:</p>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setIsRoleDropdownOpen(false);
                          if (currentUser?.id === u.id) {
                            return;
                          }
                          setCurrentView(
                            u.role === 'buyer'
                              ? 'login-buyer'
                              : u.role === 'seller'
                              ? 'login-seller'
                              : 'login-admin'
                          );
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition ${
                          currentUser?.id === u.id
                            ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover border border-emerald-300 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{u.name}</p>
                          <p className="text-[10px] text-slate-500 capitalize">
                            {u.role === 'buyer'
                              ? 'Pembeli (Siti Rahmawati)'
                              : u.role === 'seller'
                              ? 'Penjual Sultra (La Ode Arifin)'
                              : 'Admin (naylhaalyasyahira@gmail.com)'}
                          </p>
                        </div>
                        {currentUser?.id === u.id ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Aktif
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium group-hover:text-slate-600">
                            Masuk &rarr;
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1.5 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        resetDemoData();
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-emerald-700 py-1 rounded transition"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset Database Demo
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedProvince('Sulawesi Tenggara');
                setCurrentView('catalog');
              }}
              className="hidden sm:inline-flex items-center gap-1 text-emerald-200 hover:text-white transition"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Sulawesi Tenggara</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          {/* Brand Logo */}
          <button
            onClick={() => {
              setCurrentView('home');
            }}
            className="flex items-center gap-2.5 text-left group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-700/20 text-white font-black text-xl tracking-tighter group-hover:scale-105 transition">
              PN
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-emerald-950 tracking-tight">
                  Produk<span className="text-emerald-600">Nusantara</span>
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300">
                  UMKM
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
                Karya Asli Indonesia &middot; Sulawesi Tenggara
              </p>
            </div>
          </button>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative hidden md:flex items-center"
          >
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Cari tenun muna, kacang mete kendari, kopi tolaki, kerajinan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-50 border border-emerald-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition shadow-sm"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Quick Location Selector */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center gap-1.5 text-xs text-slate-700 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 px-3 py-2 rounded-xl transition"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <div className="text-left leading-tight">
                <p className="text-[10px] text-slate-500">Kirim Ke Daerah:</p>
                <p className="font-semibold text-emerald-900 truncate max-w-[130px]">
                  {selectedProvince === 'Semua' ? 'Seluruh Indonesia' : selectedProvince}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLocationDropdownOpen && (
              <div
                className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 max-h-80 overflow-y-auto"
                onMouseLeave={() => setIsLocationDropdownOpen(false)}
              >
                <p className="text-[11px] font-bold text-slate-500 px-2 py-1 uppercase">
                  Pilih Wilayah Indonesia
                </p>
                <button
                  onClick={() => {
                    setSelectedProvince('Semua');
                    setIsLocationDropdownOpen(false);
                    setCurrentView('catalog');
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition ${
                    selectedProvince === 'Semua'
                      ? 'bg-emerald-600 text-white font-medium'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Seluruh Indonesia (Semua Provinsi)
                </button>
                <button
                  onClick={() => {
                    setSelectedProvince('Sulawesi Tenggara');
                    setIsLocationDropdownOpen(false);
                    setCurrentView('catalog');
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs font-semibold mt-1 transition ${
                    selectedProvince === 'Sulawesi Tenggara'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  🌟 Sulawesi Tenggara (Bumi Anoa)
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                {provinces
                  .filter((p) => p !== 'Sulawesi Tenggara')
                  .map((prov) => (
                    <button
                      key={prov}
                      onClick={() => {
                        setSelectedProvince(prov);
                        setIsLocationDropdownOpen(false);
                        setCurrentView('catalog');
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition ${
                        selectedProvince === 'prov'
                          ? 'bg-emerald-600 text-white font-medium'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Wishlist */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className={`p-2 rounded-xl transition relative ${
                currentView === 'wishlist'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Daftar Favorit"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition relative"
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Pesanan Saya */}
            <button
              onClick={() => setCurrentView('orders')}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition ${
                currentView === 'orders'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Pesanan</span>
              {activeOrdersCount > 0 && (
                <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* Seller Center or Buka Toko Button */}
            {currentUser?.role === 'seller' ? (
              <button
                onClick={() => setCurrentView('seller-center')}
                className={`hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition ${
                  currentView === 'seller-center'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Store className="w-4 h-4 text-emerald-600" />
                <span>Toko Saya</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('login-seller')}
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-sm"
              >
                <Store className="w-4 h-4" />
                <span>Pusat Penjual</span>
              </button>
            )}

            {/* Admin Center Button */}
            {currentUser?.role === 'admin' ? (
              <button
                onClick={() => setCurrentView('admin')}
                className={`hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition ${
                  currentView === 'admin'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Admin UMKM</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('login-admin')}
                className="hidden xl:flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                title="Buka Portal Administrator"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Portal Admin</span>
              </button>
            )}

            {/* Profile Avatar / Auth Dropdown */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-slate-200 hover:border-emerald-400 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-1" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('login-buyer')}
                  className="flex items-center gap-1 text-xs font-semibold bg-emerald-600 text-white px-3 py-2 rounded-xl hover:bg-emerald-700 transition"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk</span>
                </button>
              )}

              {isProfileDropdownOpen && currentUser && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="font-semibold text-xs text-slate-900 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                      {currentUser.role === 'buyer'
                        ? 'Pembeli Terverifikasi'
                        : currentUser.role === 'seller'
                        ? 'Penjual UMKM'
                        : 'Admin Marketplace'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView('profile');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profil & Pengaturan Akun</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('orders');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>Riwayat & Status Pesanan</span>
                  </button>

                  {currentStore ? (
                    <button
                      onClick={() => {
                        setCurrentView('seller-center');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-emerald-800 hover:bg-emerald-50 transition"
                    >
                      <Store className="w-4 h-4 text-emerald-600" />
                      <span>Dashboard Toko UMKM</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsRegisterStoreModalOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-amber-800 hover:bg-amber-50 transition"
                    >
                      <Store className="w-4 h-4 text-amber-600" />
                      <span>Daftar Jadi Penjual UMKM</span>
                    </button>
                  )}

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setCurrentView('admin');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-purple-800 hover:bg-purple-50 transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      <span>Panel Admin ProdukNusantara</span>
                    </button>
                  )}

                  <div className="border-t border-slate-100 my-1 pt-1">
                    <p className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                      Halaman Login Terpisah:
                    </p>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setCurrentView('login-buyer');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-emerald-800 hover:bg-emerald-50 transition"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Halaman Login Pembeli</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setCurrentView('login-seller');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-amber-800 hover:bg-amber-50 transition"
                    >
                      <Store className="w-3.5 h-3.5 text-amber-600" />
                      <span>Halaman Login Penjual</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setCurrentView('login-admin');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-purple-800 hover:bg-purple-50 transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>Halaman Login Admin</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 my-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar Sesi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <form onSubmit={handleSearchSubmit} className="mt-2.5 md:hidden">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder="Cari produk UMKM nusantara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-xs bg-slate-50 border border-emerald-200 rounded-xl focus:bg-white focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 bg-emerald-600 text-white text-[11px] font-semibold px-3 py-1 rounded-lg"
            >
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-600">Wilayah Pilihan:</span>
            <button
              onClick={() => {
                setSelectedProvince('Sulawesi Tenggara');
                setIsMobileMenuOpen(false);
                setCurrentView('catalog');
              }}
              className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
            >
              Sulawesi Tenggara
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setCurrentView('catalog');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Semua Produk</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('orders');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800"
            >
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Pesanan Saya</span>
            </button>
          </div>

          {/* Dedicated Portal Buttons for Mobile */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Halaman Login Terpisah:
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setCurrentView('login-buyer');
                }}
                className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-bold text-center border border-emerald-200"
              >
                🛒 Pembeli
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (currentUser?.role === 'seller') {
                    setCurrentView('seller-center');
                  } else {
                    setCurrentView('login-seller');
                  }
                }}
                className="p-2 rounded-xl bg-amber-50 text-amber-900 text-[11px] font-bold text-center border border-amber-200"
              >
                🏪 Penjual
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (currentUser?.role === 'admin') {
                    setCurrentView('admin');
                  } else {
                    setCurrentView('login-admin');
                  }
                }}
                className="p-2 rounded-xl bg-purple-50 text-purple-900 text-[11px] font-bold text-center border border-purple-200"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentView('profile');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800 border border-slate-200 hover:bg-slate-100"
          >
            <User className="w-4 h-4 text-slate-600" />
            <span>Profil Pengguna & Pengaturan</span>
          </button>
        </div>
      )}
    </header>
  );
};
