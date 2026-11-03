import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  Store,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  Database,
  ShieldAlert,
  Shield
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authRoleTarget,
    setAuthRoleTarget,
    login,
    register,
    users,
    setCurrentView,
    setIsRegisterStoreModalOpen,
    openSupabaseModal
  } = useApp();

  const [activeRole, setActiveRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const [subMode, setSubMode] = useState<'login' | 'register'>('login');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSupabaseLive = isSupabaseConfigured();

  // Sync activeRole with authRoleTarget when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      const target = authRoleTarget || 'buyer';
      setActiveRole(target);
      setSubMode('login');
      setErrorMessage(null);

      // Pre-fill default test credentials for comfort
      if (target === 'seller') {
        setEmail('laode.arifin@barakatitenun.id');
        setPassword('penjual123');
      } else if (target === 'admin') {
        setEmail('naylhaalyasyahira@gmail.com');
        setPassword('admin123');
      } else {
        setEmail('siti.rahma@gmail.com');
        setPassword('pembeli123');
      }
    }
  }, [isAuthModalOpen, authRoleTarget]);

  if (!isAuthModalOpen) return null;

  const handleRoleTabClick = (role: 'buyer' | 'seller' | 'admin') => {
    setActiveRole(role);
    setAuthRoleTarget(role);
    setSubMode('login');
    setErrorMessage(null);

    if (role === 'seller') {
      setEmail('laode.arifin@barakatitenun.id');
      setPassword('penjual123');
    } else if (role === 'admin') {
      setEmail('naylhaalyasyahira@gmail.com');
      setPassword('admin123');
    } else {
      setEmail('siti.rahma@gmail.com');
      setPassword('pembeli123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Harap masukkan alamat email.');
      return;
    }

    if (subMode === 'login') {
      // Find if email is a buyer trying to breach admin/seller
      const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail.toLowerCase());
      if (existingUser && existingUser.role === 'buyer' && activeRole !== 'buyer') {
        setErrorMessage(
          `AKSES DITOLAK: Akun "${existingUser.name}" (${cleanEmail}) terdaftar sebagai PEMBELI. Sesuai kebijakan isolasi Supabase Auth & RLS, akun Pembeli dilarang keras login ke portal ${
            activeRole === 'admin' ? 'ADMINISTRATOR' : 'PENJUAL UMKM'
          }.`
        );
        return;
      }

      if (existingUser && existingUser.role === 'seller' && activeRole === 'admin') {
        setErrorMessage(
          `AKSES DITOLAK: Akun "${cleanEmail}" terdaftar sebagai Penjual UMKM dan tidak memiliki hak akses administrator.`
        );
        return;
      }

      const success = login(cleanEmail, cleanPassword, activeRole);
      if (success) {
        setIsAuthModalOpen(false);
      }
    } else {
      // Register mode
      if (activeRole === 'seller') {
        setIsAuthModalOpen(false);
        setIsRegisterStoreModalOpen(true);
      } else {
        if (!cleanPassword || cleanPassword.length < 6) {
          setErrorMessage('Kata sandi minimal 6 karakter.');
          return;
        }
        const success = register(
          name || 'Pembeli Baru',
          cleanEmail,
          cleanPassword,
          phone || '0812-3456-7890',
          'buyer'
        );
        if (success) {
          setIsAuthModalOpen(false);
        }
      }
    }
  };

  const handleQuickPresetLogin = (targetEmail: string, targetPass: string, role: 'buyer' | 'seller' | 'admin') => {
    setEmail(targetEmail);
    setPassword(targetPass);
    setErrorMessage(null);
    const success = login(targetEmail, targetPass, role);
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl animate-in zoom-in-95 my-auto border border-slate-200">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
              PN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                  Pintu Masuk Terpisah ProdukNusantara
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Pilih portal sesuai peran Anda (Pembeli, Penjual, atau Admin)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supabase Security Layer Badge */}
        <div className="px-4 py-2 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium text-emerald-200">
              Supabase Auth & Row Level Security (RLS)
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsAuthModalOpen(false);
              openSupabaseModal();
            }}
            className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 transition flex items-center gap-1"
          >
            <Shield className="w-3 h-3" />
            <span>Lihat Skema RLS</span>
          </button>
        </div>

        {/* 3 Dedicated Role Tabs */}
        <div className="p-3 bg-slate-100/70 border-b border-slate-200 grid grid-cols-3 gap-1.5 shrink-0">
          {/* Tab 1: Pembeli */}
          <button
            type="button"
            onClick={() => handleRoleTabClick('buyer')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-xs transition duration-200 ${
              activeRole === 'buyer'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                : 'bg-white hover:bg-emerald-50 text-slate-600 border border-slate-200'
            }`}
          >
            <ShoppingBag className={`w-4 h-4 mb-1 ${activeRole === 'buyer' ? 'text-white' : 'text-emerald-600'}`} />
            <span>Login Pembeli</span>
            <span className={`text-[9px] mt-0.5 ${activeRole === 'buyer' ? 'text-emerald-100' : 'text-slate-400'}`}>
              Belanja & Pesanan
            </span>
          </button>

          {/* Tab 2: Penjual UMKM */}
          <button
            type="button"
            onClick={() => handleRoleTabClick('seller')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-xs transition duration-200 ${
              activeRole === 'seller'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-white hover:bg-amber-50 text-slate-600 border border-slate-200'
            }`}
          >
            <Store className={`w-4 h-4 mb-1 ${activeRole === 'seller' ? 'text-slate-950' : 'text-amber-600'}`} />
            <span>Pusat Penjual</span>
            <span className={`text-[9px] mt-0.5 ${activeRole === 'seller' ? 'text-amber-950' : 'text-slate-400'}`}>
              Mitra Toko UMKM
            </span>
          </button>

          {/* Tab 3: Admin */}
          <button
            type="button"
            onClick={() => handleRoleTabClick('admin')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-xs transition duration-200 ${
              activeRole === 'admin'
                ? 'bg-slate-900 text-white font-bold shadow-md shadow-slate-900/20'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 mb-1 ${activeRole === 'admin' ? 'text-emerald-400' : 'text-purple-600'}`} />
            <span>Portal Admin</span>
            <span className={`text-[9px] mt-0.5 ${activeRole === 'admin' ? 'text-slate-300' : 'text-slate-400'}`}>
              Audit & Verifikasi
            </span>
          </button>
        </div>

        {/* Portal-specific Header Banner */}
        <div className="p-4 sm:p-5 pb-0">
          {activeRole === 'buyer' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-emerald-950">Portal Masuk Pembeli (Konsumen)</h4>
                <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                  Akses katalog produk nusantara, kelola keranjang belanja, dan riwayat pesanan. 
                  <span className="block font-semibold text-emerald-900 mt-0.5">
                    *Akun Pembeli tidak memiliki akses ke kontrol toko UMKM maupun dashboard admin.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setCurrentView('login-buyer');
                    }}
                    className="mt-1.5 text-[11px] font-bold text-emerald-900 hover:text-emerald-950 underline inline-flex items-center gap-1"
                  >
                    Buka Halaman Penuh Login Pembeli &rarr;
                  </button>
                </p>
              </div>
            </div>
          )}

          {activeRole === 'seller' && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-amber-950">Pusat Penjual Mitra UMKM</h4>
                <p className="text-amber-900 text-[11px] mt-0.5 leading-relaxed">
                  Masuk ke <strong>Seller Center</strong> untuk mengunggah produk, atur stok & harga, serta proses pesanan toko Anda.
                  <span className="block font-semibold text-amber-950 mt-0.5">
                    *Akun Pembeli dilarang login ke portal ini tanpa mendaftar sebagai Penjual resmi.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setCurrentView('login-seller');
                    }}
                    className="mt-1.5 text-[11px] font-bold text-amber-950 hover:text-black underline inline-flex items-center gap-1"
                  >
                    Buka Halaman Penuh Login Penjual UMKM &rarr;
                  </button>
                </p>
              </div>
            </div>
          )}

          {activeRole === 'admin' && (
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-purple-950">Portal Administrator Resmi</h4>
                <p className="text-purple-900 text-[11px] mt-0.5 leading-relaxed">
                  Khusus administrator (<strong>naylhaalyasyahira@gmail.com</strong>) untuk memverifikasi toko, moderasi katalog, dan audit platform.
                  <span className="block font-semibold text-red-700 mt-0.5">
                    *Akun Pembeli dan Penjual umum dilarang keras masuk ke portal admin.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setCurrentView('login-admin');
                    }}
                    className="mt-1.5 text-[11px] font-bold text-purple-950 hover:text-black underline inline-flex items-center gap-1"
                  >
                    Buka Halaman Penuh Login Administrator &rarr;
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error Alert Banner if any */}
        {errorMessage && (
          <div className="mx-4 sm:mx-5 mt-3 p-3.5 rounded-xl bg-red-50 border border-red-300 flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-bold text-red-900">Peringatan Keamanan:</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Sub-modes: Masuk / Daftar */}
        {activeRole !== 'admin' && (
          <div className="px-4 sm:px-5 pt-3">
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setSubMode('login');
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-lg transition ${
                  subMode === 'login'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubMode('register');
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-lg transition ${
                  subMode === 'register'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {activeRole === 'seller' ? 'Buka Toko UMKM Baru' : 'Daftar Akun Pembeli'}
              </button>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 flex-1">
          {subMode === 'register' && activeRole === 'buyer' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nama Lengkap Pembeli
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Nama sesuai KTP"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              {activeRole === 'seller'
                ? 'Email Akun Pemilik UMKM'
                : activeRole === 'admin'
                ? 'Email Resmi Administrator'
                : 'Alamat Email Pembeli'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder={
                  activeRole === 'seller'
                    ? 'laode.arifin@barakatitenun.id'
                    : activeRole === 'admin'
                    ? 'naylhaalyasyahira@gmail.com'
                    : 'siti.rahma@gmail.com'
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-slate-700">
                Kata Sandi
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {activeRole === 'admin' ? 'Kredensial: admin123' : activeRole === 'seller' ? 'Kredensial: penjual123' : 'Kredensial: pembeli123'}
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Masukkan kata sandi..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-8 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {subMode === 'register' && activeRole === 'buyer' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nomor Handphone / WhatsApp
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="0812-xxxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 mt-2 ${
              activeRole === 'buyer'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : activeRole === 'seller'
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
            }`}
          >
            <span>
              {subMode === 'login'
                ? `Masuk ke Portal ${
                    activeRole === 'buyer'
                      ? 'Pembeli'
                      : activeRole === 'seller'
                      ? 'Penjual UMKM'
                      : 'Admin'
                  }`
                : activeRole === 'seller'
                ? 'Lanjut Buka Toko UMKM'
                : 'Daftarkan Akun Pembeli'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Login specifically for this selected role */}
        <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-auto bg-slate-50/60">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 pt-3 flex items-center justify-between">
            <span>Uji Coba Cepat ({activeRole.toUpperCase()}):</span>
            <span className="text-[10px] text-emerald-700 font-semibold lowercase">
              terautentikasi aman
            </span>
          </p>

          {activeRole === 'buyer' && (
            <button
              type="button"
              onClick={() => handleQuickPresetLogin('siti.rahma@gmail.com', 'pembeli123', 'buyer')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-emerald-300 hover:bg-emerald-50/70 text-left transition text-xs shadow-2xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                  alt=""
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-emerald-400"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 group-hover:text-emerald-800 transition">
                    Siti Rahmawati (Pembeli)
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    siti.rahma@gmail.com &bull; Pass: pembeli123
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg shrink-0">
                1-Klik Masuk Pembeli &rarr;
              </span>
            </button>
          )}

          {activeRole === 'seller' && (
            <button
              type="button"
              onClick={() => handleQuickPresetLogin('laode.arifin@barakatitenun.id', 'penjual123', 'seller')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-amber-300 hover:bg-amber-50/70 text-left transition text-xs shadow-2xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt=""
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-amber-400"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 group-hover:text-amber-900 transition">
                    La Ode Arifin (Penjual UMKM)
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    laode.arifin@barakatitenun.id &bull; Pass: penjual123
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-950 bg-amber-400 px-2.5 py-1 rounded-lg shrink-0">
                1-Klik Masuk Penjual &rarr;
              </span>
            </button>
          )}

          {activeRole === 'admin' && (
            <button
              type="button"
              onClick={() => handleQuickPresetLogin('naylhaalyasyahira@gmail.com', 'admin123', 'admin')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-300 hover:bg-slate-100 text-left transition text-xs shadow-2xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt=""
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-400"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 group-hover:text-purple-900 transition">
                    Administrator ProdukNusantara
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    naylhaalyasyahira@gmail.com &bull; Pass: admin123
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg shrink-0">
                1-Klik Masuk Admin &rarr;
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
