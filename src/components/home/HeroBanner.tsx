import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  Award,
  ArrowRight
} from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'Sorotan Daerah Istimewa',
    title: 'Pesona UMKM Sulawesi Tenggara',
    subtitle: 'Keagungan Tenun Masalili & Buton, Gurihnya Mete Kendari, dan Keharuman Kopi Tolaki',
    desc: 'Dukung ribuan pengrajin dan petani lokal Bumi Anoa yang melestarikan warisan leluhur menjadi produk bernilai ekspor.',
    ctaText: 'Jelajahi Produk Sultra',
    action: 'sultra',
    bgGradient: 'from-emerald-950 via-emerald-900 to-teal-950',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=1000&auto=format&fit=crop&q=80',
    badge: 'Produk Unggulan Sultra'
  },
  {
    id: 2,
    tag: 'Bangga Buatan Indonesia',
    title: 'Pemberdayaan UMKM Mandiri Se-Nusantara',
    subtitle: 'Dari Sabang sampai Merauke, Temukan Karya Otentik Pengrajin Lokal',
    desc: 'Platform terlengkap menghubungkan pembeli dengan pelaku usaha mikro di 38 provinsi tanpa perantara.',
    ctaText: 'Buka Katalog Lengkap',
    action: 'catalog',
    bgGradient: 'from-slate-950 via-emerald-950 to-emerald-900',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&auto=format&fit=crop&q=80',
    badge: '100% Produk Asli'
  },
  {
    id: 3,
    tag: 'Buka Toko Gratis',
    title: 'Daftarkan UMKM Anda Sekarang!',
    subtitle: 'Jangkau Jutaan Pembeli di Seluruh Indonesia dengan Sistem Modern',
    desc: 'Mudah digunakan, gratis pendaftaran, kelola stok dan pesanan langsung dari HP maupun laptop Anda.',
    ctaText: 'Buka Toko UMKM',
    action: 'register-store',
    bgGradient: 'from-emerald-900 via-teal-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000&auto=format&fit=crop&q=80',
    badge: 'Dukungan UMKM'
  }
];

export const HeroBanner: React.FC = () => {
  const { setCurrentView, setSelectedProvince, setIsRegisterStoreModalOpen } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  const handleCta = (action: string) => {
    if (action === 'sultra') {
      setSelectedProvince('Sulawesi Tenggara');
      setCurrentView('catalog');
    } else if (action === 'register-store') {
      setIsRegisterStoreModalOpen(true);
    } else {
      setCurrentView('catalog');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-6">
      {/* Banner Container */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-emerald-800/20">
        <div
          className={`relative min-h-[360px] md:min-h-[420px] bg-gradient-to-r ${slide.bgGradient} text-white flex items-center transition-all duration-700`}
        >
          {/* Subtle Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <div className="relative z-10 w-full px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Text Side */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-amber-300 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{slide.tag}</span>
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold leading-tight text-white tracking-tight">
                {slide.title}
              </h1>

              <p className="text-sm md:text-base font-medium text-emerald-200 leading-snug">
                {slide.subtitle}
              </p>

              <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed hidden sm:block">
                {slide.desc}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleCta(slide.action)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setSelectedProvince('Sulawesi Tenggara');
                    setCurrentView('catalog');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-xl text-xs md:text-sm transition backdrop-blur-sm border border-white/20 flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Eksplor UMKM Sultra</span>
                </button>
              </div>
            </div>

            {/* Visual Side */}
            <div className="md:col-span-5 hidden md:block">
              <div className="relative mx-auto max-w-sm">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 opacity-30 blur-lg animate-pulse"></div>
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl bg-slate-800">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-64 lg:h-72 object-cover object-center transform hover:scale-105 transition duration-500"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      {slide.badge}
                    </span>
                    <span className="text-[11px] text-slate-300">ProdukNusantara</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition border border-white/10"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition border border-white/10"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trust & Stats Bar */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-2xl border border-emerald-100/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">100% Terverifikasi</p>
            <p className="text-[11px] text-slate-500">Izin NIB & Audit UMKM</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-emerald-100/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Spesial Sultra</p>
            <p className="text-[11px] text-slate-500">Karya Etnik Bumi Anoa</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-emerald-100/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">38 Provinsi</p>
            <p className="text-[11px] text-slate-500">Jangkauan Seluruh Indonesia</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-emerald-100/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Belanja Langsung</p>
            <p className="text-[11px] text-slate-500">Dari Pengrajin Pertama</p>
          </div>
        </div>
      </div>
    </div>
  );
};
