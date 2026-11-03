import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  Package,
  PlusCircle,
  Database,
  ArrowLeft,
  KeyRound,
  AlertTriangle,
  BadgeCheck
} from 'lucide-react';

export const SellerLoginPage: React.FC = () => {
  const {
    login,
    setCurrentView,
    setIsRegisterStoreModalOpen,
    openSupabaseModal,
    showToast
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isolationWarning, setIsolationWarning] = useState<string | null>(null);

  // Fill demo seller credentials
  const fillDemoSeller = () => {
    setEmail('laode.arifin@barakatitenun.id');
    setPassword('penjual123');
    setIsolationWarning(null);
    showToast('info', 'Kredensial Penjual Dimuat', 'Email: laode.arifin@barakatitenun.id | Sandi: penjual123');
  };

  // Demo buyer test to showcase isolation rejection
  const fillBuyerAttempt = () => {
    setEmail('siti.rahma@gmail.com');
    setPassword('pembeli123');
    setIsolationWarning(
      'Uji Coba Isolasi: Anda mencoba login dengan akun Pembeli (siti.rahma@gmail.com). Sistem Supabase RLS akan menolak akses akun ini ke portal Penjual.'
    );
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsolationWarning(null);

    if (!email.trim() || !password) {
      showToast('error', 'Form Belum Lengkap', 'Harap isi email penjual dan kata sandi.');
      return;
    }

    // Quick client-side check if someone is clearly trying a buyer email
    if (email.trim().toLowerCase() === 'siti.rahma@gmail.com') {
      setIsolationWarning(
        'AKSES DITOLAK: Akun "Siti Rahma" terdaftar sebagai PEMBELI. Sesuai aturan keamanan Supabase RLS, akun Pembeli tidak diizinkan masuk ke Seller Center. Silakan gunakan Halaman Login Pembeli.'
      );
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ok = login(email, password, 'seller');
      setIsSubmitting(false);
      if (ok) {
        setCurrentView('seller-center');
      } else {
        setIsolationWarning(
          'Autentikasi gagal atau akun tidak memiliki hak akses Penjual UMKM. Pastikan email terdaftar sebagai Mitra UMKM ProdukNusantara.'
        );
      }
    }, 450);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-amber-50/70 via-slate-50 to-emerald-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={openSupabaseModal}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 px-2.5 py-1.5 rounded-lg transition"
              title="Lihat Supabase Row Level Security Schema"
            >
              <Database className="w-3 h-3 text-amber-700" />
              <span>Supabase RLS: Seller Isolated</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Hero / Brand Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-amber-950/90 to-slate-950 text-white p-7 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden border border-amber-500/20">
            {/* Background pattern */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold text-amber-300 mb-6">
                <Store className="w-3.5 h-3.5 text-amber-300" />
                <span>Pusat Penjual Mitra UMKM (Seller Center)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-3 text-white">
                Kembangkan Usaha UMKM Anda ke Pasar Nasional
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Kelola inventaris, terima pesanan otomatis dari pembeli se-Indonesia, dan pantau pertumbuhan omzet toko UMKM Anda dalam satu dashboard terintegrasi.
              </p>

              <div className="space-y-3.5 border-t border-slate-800 pt-5 mb-8">
                <div className="flex items-start gap-2.5 text-xs text-slate-200">
                  <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Dukungan penuh untuk UMKM lokal Sulawesi Tenggara & seluruh 38 provinsi di Indonesia.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-200">
                  <TrendingUp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Laporan omzet penjualan, grafik pertumbuhan pesanan, dan konfirmasi resi kurir otomatis.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Isolasi Supabase RLS: Data toko, harga grosir, dan pesanan pelanggan terlindungi dari pengguna umum.</span>
                </div>
              </div>
            </div>

            {/* Quick Portal Switcher */}
            <div className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs">
              <p className="font-semibold text-amber-200 mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                Bukan Penjual? Beralih ke Portal Lain:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCurrentView('login-buyer')}
                  className="bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-600/60 text-emerald-200 py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Portal Pembeli</span>
                </button>
                <button
                  onClick={() => setCurrentView('login-admin')}
                  className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Portal Admin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Seller Login Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Masuk ke Seller Center</h2>
                <p className="text-xs text-slate-500">Gunakan akun mitra UMKM terdaftar Anda</p>
              </div>
              <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-300">
                Akses Mitra Toko
              </span>
            </div>

            {/* Isolation Warning Banner if triggered */}
            {isolationWarning && (
              <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-red-900 shadow-sm animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-red-800">PERINGATAN ISOLASI KEAMANAN</p>
                  <p className="leading-relaxed">{isolationWarning}</p>
                </div>
              </div>
            )}

            {/* Quick Demo Autofill Banner */}
            <div className="mb-6 bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                    LA
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-950">Akun Demo Mitra Penjual UMKM</p>
                    <p className="text-[11px] text-amber-800 font-mono">laode.arifin@barakatitenun.id &bull; penjual123</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fillDemoSeller}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition shrink-0"
                >
                  Gunakan Akun
                </button>
              </div>

              {/* Security Test button */}
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                <span className="text-amber-800">Uji tolak akun Pembeli (Supabase RLS):</span>
                <button
                  type="button"
                  onClick={fillBuyerAttempt}
                  className="text-red-700 hover:text-red-800 font-semibold underline text-[11px]"
                >
                  Coba login pakai Pembeli (Siti)
                </button>
              </div>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Alamat Email Mitra Toko UMKM
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh: laode.arifin@barakatitenun.id"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kata Sandi Mitra Penjual
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi toko"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Ingat sesi toko di peramban ini</span>
                </label>
                <button
                  type="button"
                  onClick={() => showToast('info', 'Bantuan Sandi Penjual', 'Gunakan kata sandi demo: penjual123')}
                  className="text-amber-700 hover:underline font-semibold"
                >
                  Lupa sandi toko?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4"
              >
                <Store className="w-4 h-4" />
                <span>{isSubmitting ? 'Memverifikasi Akses Seller Center...' : 'Masuk ke Seller Center'}</span>
              </button>
            </form>

            {/* Register New Store CTA */}
            <div className="mt-8 pt-6 border-t border-slate-200 text-center space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                Punya usaha UMKM tetapi belum memiliki toko di ProdukNusantara?
              </p>
              <button
                type="button"
                onClick={() => setIsRegisterStoreModalOpen(true)}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buka Toko UMKM Gratis Sekarang</span>
              </button>
            </div>

            {/* Supabase RLS Policy Note */}
            <div className="mt-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Isolasi Akun Penjual (Supabase RLS)
                </p>
                <p>
                  Sesuai kebijakan PostgreSQL Row Level Security di Supabase, hanya akun dengan{' '}
                  <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono font-bold">role: 'seller'</code>{' '}
                  yang dapat mengakses dashboard ini. Akun pembeli atau umum diblokir secara mutlak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
