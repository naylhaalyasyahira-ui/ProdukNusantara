import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Store,
  CheckCircle2,
  Database,
  ArrowLeft,
  KeyRound
} from 'lucide-react';

export const BuyerLoginPage: React.FC = () => {
  const {
    login,
    register,
    setCurrentView,
    openSupabaseModal,
    showToast
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('Sulawesi Tenggara');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fill demo buyer credentials
  const fillDemoBuyer = () => {
    setEmail('siti.rahma@gmail.com');
    setPassword('pembeli123');
    showToast('info', 'Kredensial Demo Dimuat', 'Email: siti.rahma@gmail.com | Sandi: pembeli123');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast('error', 'Form Belum Lengkap', 'Harap isi email dan kata sandi Anda.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ok = login(email, password, 'buyer');
      setIsSubmitting(false);
      if (ok) {
        setCurrentView('home');
      }
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      showToast('error', 'Form Belum Lengkap', 'Nama, email, dan kata sandi wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ok = register(name, email, password, phone, 'buyer');
      setIsSubmitting(false);
      if (ok) {
        setCurrentView('home');
      }
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-white/80 backdrop-blur-sm border border-emerald-200/80 px-3 py-1.5 rounded-lg shadow-xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={openSupabaseModal}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 px-2.5 py-1.5 rounded-lg transition"
              title="Lihat Supabase Row Level Security Schema"
            >
              <Database className="w-3 h-3 text-emerald-700" />
              <span>Supabase RLS Active</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Hero / Brand Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-7 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-700/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-700/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-6">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                <span>Portal Khusus Pembeli & Konsumen</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-3">
                Jelajahi Produk Unggulan UMKM Seluruh Indonesia
              </h1>
              <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Dukung perajin, petani, dan pelaku UMKM lokal Nusantara. Dapatkan produk asli dengan jaminan keamanan transaksi dan pengiriman terpercaya.
              </p>

              <div className="space-y-3.5 border-t border-emerald-700/60 pt-5 mb-8">
                <div className="flex items-start gap-2.5 text-xs text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Katalog lengkap makanan khas, kain tenun khas Sultra, kopi nusantara, & kerajinan etnik.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Pengiriman langsung dari lokasi pengrajin di berbagai kabupaten dan desa.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Isolasi keamanan data: Data akun dan riwayat belanja terlindungi via Supabase RLS.</span>
                </div>
              </div>
            </div>

            {/* Quick Portal Switcher */}
            <div className="relative z-10 bg-emerald-900/80 border border-emerald-700/80 rounded-2xl p-4 text-xs">
              <p className="font-semibold text-amber-200 mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                Bukan Pembeli? Masuk ke Portal Lain:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCurrentView('login-seller')}
                  className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Portal Penjual</span>
                </button>
                <button
                  onClick={() => setCurrentView('login-admin')}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-600 text-slate-200 py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Portal Admin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Login / Register Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition ${
                  mode === 'login'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Masuk Akun Pembeli
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition ${
                  mode === 'register'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Daftar Pembeli Baru
              </button>
            </div>

            {/* Quick Demo Autofill Banner */}
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  SR
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950">Akun Uji Coba Pembeli</p>
                  <p className="text-[11px] text-emerald-700 font-mono">siti.rahma@gmail.com &bull; pembeli123</p>
                </div>
              </div>
              <button
                type="button"
                onClick={fillDemoBuyer}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition shrink-0"
              >
                Gunakan Akun
              </button>
            </div>

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Alamat Email Pembeli
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh: siti.rahma@gmail.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi akun pembeli"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
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
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Ingat saya di perangkat ini</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('info', 'Reset Kata Sandi', 'Untuk demo, silakan gunakan kata sandi: pembeli123')}
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    Lupa sandi?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isSubmitting ? 'Memverifikasi Akun...' : 'Masuk ke Akun Pembeli'}</span>
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Pembeli *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkap sesuai KTP"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Email Aktif *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="emailanda@gmail.com"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Buat Kata Sandi *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                      className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0812xxxxxxxx"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kota / Kabupaten Domisili
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Kota Kendari / Kolaka / lainnya"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Mendaftarkan Akun...' : 'Daftar Akun Pembeli'}</span>
                </button>
              </form>
            )}

            {/* Supabase RLS Policy Note */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Keamanan Akses Pembeli (Supabase RLS)
                </p>
                <p>
                  Akun Pembeli berstatus peran <code className="bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded font-mono font-bold">role: 'buyer'</code>.
                  Sistem keamanan database secara otomatis menolak dan memblokir upaya login ke portal Penjual UMKM atau Administrator menggunakan akun ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
