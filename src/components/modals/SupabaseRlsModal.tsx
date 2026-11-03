import React, { useState } from 'react';
import {
  X,
  Shield,
  Database,
  Lock,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Code
} from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_RLS_SQL_SCHEMA } from '../../lib/supabase';

interface SupabaseRlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseRlsModal: React.FC<SupabaseRlsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const isConfigured = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_RLS_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Arsitektur Supabase & Row Level Security (RLS)</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isConfigured 
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30'
                    : 'bg-amber-500/30 text-amber-300 border border-amber-400/30'
                }`}>
                  {isConfigured ? 'Supabase Terhubung' : 'Engine Keamanan RLS Aktif'}
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Isolasi Mutlak: Mencegah Akun Pembeli Mengakses Akun Admin Maupun Penjual UMKM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-emerald-900">
                Prinsip Keamanan Role-Based Access Control (RBAC):
              </p>
              <p className="text-emerald-800 leading-relaxed">
                Setiap pengguna terdaftar memiliki <strong className="font-semibold text-emerald-950">role mutlak ('buyer', 'seller', 'admin')</strong>. 
                Sistem secara ketat menolak autentikasi dan memblokir upaya akses jika akun berstatus <code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono text-[11px]">buyer</code> mencoba login ke portal Penjual atau Admin.
              </p>
            </div>
          </div>

          {/* Three Tier Isolation Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                🛒 Akun Pembeli (Buyer)
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                Hanya memiliki hak baca katalog, kelola keranjang belanja sendiri, dan riwayat pesanan pribadi. 
                <strong className="text-red-700 block mt-1">Dilarang akses Admin & Seller Center.</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                🏪 Penjual UMKM (Seller)
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                Hanya memiliki hak mengelola toko sendiri, stok produk, dan pesanan masuk tokonya. 
                <strong className="text-red-700 block mt-1">Tidak dapat mengakses panel Admin.</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50">
              <div className="flex items-center gap-1.5 font-bold text-xs text-purple-900 mb-1">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                🛡️ Administrator (Admin)
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                Pemegang kendali sistem: verifikasi NIB/toko UMKM, kelola akun, dan moderasi. 
                <strong className="text-purple-900 block mt-1">Tidak dapat didaftarkan bebas oleh publik.</strong>
              </p>
            </div>
          </div>

          {/* SQL Schema for Supabase */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-800">
                  SQL Schema & RLS Script (Siap di-copy ke Supabase SQL Editor):
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin SQL Schema</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <pre className="p-4 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-56 leading-relaxed">
                {SUPABASE_RLS_SQL_SCHEMA}
              </pre>
            </div>
          </div>

          {/* How to connect real Supabase project */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              Menghubungkan ke Project Supabase Live:
            </h4>
            <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside leading-relaxed">
              <li>Buat project baru di dashboard <span className="font-semibold text-slate-800">supabase.com</span>.</li>
              <li>Buka menu <span className="font-semibold text-slate-800">SQL Editor</span> dan jalankan query SQL di atas.</li>
              <li>Salin <code className="bg-slate-200 text-slate-900 px-1 py-0.5 rounded font-mono text-[10px]">Project URL</code> dan <code className="bg-slate-200 text-slate-900 px-1 py-0.5 rounded font-mono text-[10px]">Anon Public Key</code> ke file <code className="bg-slate-200 text-slate-900 px-1 py-0.5 rounded font-mono text-[10px]">.env</code> (<code className="font-mono text-[10px]">VITE_SUPABASE_URL</code> & <code className="font-mono text-[10px]">VITE_SUPABASE_ANON_KEY</code>).</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            ProdukNusantara Protected Security Layer
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
