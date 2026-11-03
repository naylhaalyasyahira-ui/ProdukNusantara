import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  Store,
  Database,
  ArrowLeft,
  KeyRound,
  AlertOctagon,
  FileCode,
  CheckCircle2,
  Server
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const {
    login,
    setCurrentView,
    openSupabaseModal,
    showToast
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);

  // Fill demo admin credentials
  const fillDemoAdmin = () => {
    setEmail('naylhaalyasyahira@gmail.com');
    setPassword('admin123');
    setSecurityAlert(null);
    showToast('info', 'Kredensial Administrator Dimuat', 'Email: naylhaalyasyahira@gmail.com | Sandi: admin123');
  };

  // Test buyer rejection
  const fillTestBuyer = () => {
    setEmail('siti.rahma@gmail.com');
    setPassword('pembeli123');
    setSecurityAlert(
      'Uji Coba Keamanan: Anda memasukkan akun Pembeli. Supabase RLS akan menolak hak akses admin secara instan!'
    );
  };

  // Test seller rejection
  const fillTestSeller = () => {
    setEmail('laode.arifin@barakatitenun.id');
    setPassword('penjual123');
    setSecurityAlert(
      'Uji Coba Keamanan: Anda memasukkan akun Penjual UMKM. Akses Administrator hanya terbatas untuk Super Admin terotorisasi.'
    );
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityAlert(null);

    const clean = email.trim().toLowerCase();
    if (!clean || !password) {
      showToast('error', 'Form Belum Lengkap', 'Email dan kata sandi administrator wajib diisi.');
      return;
    }

    if (clean !== 'naylhaalyasyahira@gmail.com') {
      setSecurityAlert(
        `AKSES DITOLAK: Akun "${clean}" tidak terdaftar dalam otorisasi Super Administrator. Sesuai kebijakan Supabase Row Level Security, akun umum atau penjual dilarang keras mengakses panel kendali utama.`
      );
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ok = login(email, password, 'admin');
      setIsSubmitting(false);
      if (ok) {
        setCurrentView('admin');
      } else {
        setSecurityAlert(
          'Akses ditolak: Verifikasi kredensial gagal. Harap periksa email dan kata sandi otorisasi Administrator.'
        );
      }
    }, 450);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 backdrop-blur-sm border border-slate-700/80 px-3 py-1.5 rounded-lg shadow-xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={openSupabaseModal}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 px-3 py-1.5 rounded-lg transition"
              title="Lihat Supabase Row Level Security Schema"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase RLS Schema (SQL)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Security Hero / Audit Info */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-7 sm:p-8 rounded-3xl shadow-2xl flex flex-col justify-between relative overflow-hidden border border-purple-500/30">
            {/* Background pattern */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-purple-950/80 border border-purple-500/50 px-3 py-1 rounded-full text-xs font-bold text-purple-300 mb-6">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pusat Otorisasi & Audit Administrator</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-3 text-white">
                Sistem Kontrol & Tata Kelola Marketplace
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Panel verifikasi legalitas UMKM, kurasi katalog daerah se-Indonesia, dan audit transaksi nasional ProdukNusantara.
              </p>

              <div className="space-y-3.5 border-t border-slate-800 pt-5 mb-8">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Verifikasi toko UMKM baru, validasi NIB, dan persetujuan kemitraan daerah.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Pengawasan katalog produk, moderasi konten, dan penanganan sengketa pembeli-penjual.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Pendaftaran publik dinonaktifkan: Akun administrator hanya diotorisasi oleh sistem pusat.</span>
                </div>
              </div>
            </div>

            {/* Quick Portal Switcher */}
            <div className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs">
              <p className="font-semibold text-purple-200 mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                Bukan Administrator? Masuk ke Portal Lain:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCurrentView('login-buyer')}
                  className="bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-200 py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Portal Pembeli</span>
                </button>
                <button
                  onClick={() => setCurrentView('login-seller')}
                  className="bg-amber-950/60 hover:bg-amber-900 border border-amber-700/60 text-amber-200 py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Portal Penjual</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Admin Login Form */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">Otorisasi Administrator</h2>
                <p className="text-xs text-slate-400">Masukkan kredensial Super Admin terdaftar</p>
              </div>
              <span className="bg-purple-950 text-purple-300 border border-purple-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Server className="w-3 h-3 text-emerald-400" />
                <span>Admin Tier 1</span>
              </span>
            </div>

            {/* Security Alert if triggered */}
            {securityAlert && (
              <div className="mb-6 bg-red-950/90 border-2 border-red-500/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-red-100 shadow-md animate-pulse">
                <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-red-300">SECURITY AUDIT VIOLATION</p>
                  <p className="leading-relaxed">{securityAlert}</p>
                </div>
              </div>
            )}

            {/* Quick Demo Autofill Banner */}
            <div className="mb-6 bg-slate-800/80 border border-purple-500/30 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    NA
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Kredensial Super Administrator</p>
                    <p className="text-[11px] text-purple-300 font-mono">naylhaalyasyahira@gmail.com &bull; admin123</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition shrink-0"
                >
                  Gunakan Akun
                </button>
              </div>

              {/* Security Test Rejection triggers */}
              <div className="pt-2 border-t border-slate-700 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="text-slate-400">Uji pencegahan akses (Supabase RLS):</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={fillTestBuyer}
                    className="text-red-400 hover:text-red-300 underline font-medium text-[11px]"
                  >
                    Tolak Akun Pembeli
                  </button>
                  <span className="text-slate-600">&bull;</span>
                  <button
                    type="button"
                    onClick={fillTestSeller}
                    className="text-amber-400 hover:text-amber-300 underline font-medium text-[11px]"
                  >
                    Tolak Akun Penjual
                  </button>
                </div>
              </div>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Alamat Email Administrator
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naylhaalyasyahira@gmail.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Kata Sandi Administrator
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi otorisasi"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-purple-600 focus:ring-purple-500 bg-slate-800 border-slate-700"
                  />
                  <span>Audit logging aktif untuk sesi ini</span>
                </label>
                <button
                  type="button"
                  onClick={() => showToast('info', 'Kredensial Super Admin', 'Email: naylhaalyasyahira@gmail.com | Sandi: admin123')}
                  className="text-purple-400 hover:underline font-semibold"
                >
                  Bantuan otorisasi?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-4"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Memvalidasi Izin Akses Administrator...' : 'Otorisasi & Masuk ke Dashboard Admin'}</span>
              </button>
            </form>

            {/* Supabase RLS Policy Note */}
            <div className="mt-8 pt-5 border-t border-slate-800">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-[11px] text-slate-400 space-y-1.5">
                <p className="font-bold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Aturan Supabase Row Level Security (RLS)
                </p>
                <p className="leading-relaxed">
                  Semua tabel inti (<code className="text-purple-300">stores</code>, <code className="text-purple-300">products</code>, <code className="text-purple-300">users</code>) dilindungi kebijakan RLS PostgreSQL. Kebijakan <code className="text-emerald-300 font-mono">auth.jwt() -&gt;&gt; 'role' = 'admin'</code> menjamin bahwa akun pembeli maupun penjual tidak dapat membaca atau memodifikasi tabel sistem.
                </p>
                <button
                  onClick={openSupabaseModal}
                  className="text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1 mt-1"
                >
                  <FileCode className="w-3 h-3" />
                  <span>Buka Editor Salin Skema SQL Supabase RLS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
