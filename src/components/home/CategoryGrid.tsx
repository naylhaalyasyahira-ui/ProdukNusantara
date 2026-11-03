import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Utensils,
  Coffee,
  Shirt,
  Sparkles,
  Wheat,
  Heart,
  Home,
  Gift,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES_LIST } from '../../data/initialData';

const ICON_MAP: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="w-6 h-6" />,
  Coffee: <Coffee className="w-6 h-6" />,
  Shirt: <Shirt className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Wheat: <Wheat className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Home: <Home className="w-6 h-6" />,
  Gift: <Gift className="w-6 h-6" />
};

export const CategoryGrid: React.FC = () => {
  const { setSelectedCategory, setCurrentView, selectedCategory, products } = useApp();

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentView('catalog');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Kategori Produk UMKM</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilihan produk unggulan nusantara berdasarkan kelompok usaha mikro & kecil
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('Semua');
            setCurrentView('catalog');
          }}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group transition"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const liveProductCount = products.filter((p) => p.category === cat.name).length;

          return (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex flex-col items-center text-center p-3.5 rounded-2xl border transition-all duration-200 group relative ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 -translate-y-1'
                  : 'bg-white hover:bg-emerald-50/50 text-slate-700 border-slate-200/80 hover:border-emerald-300 hover:shadow-sm hover:-translate-y-0.5'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${
                  isSelected
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-100/70 text-emerald-800 group-hover:bg-emerald-200'
                }`}
              >
                {ICON_MAP[cat.icon]}
              </div>

              <span className="text-xs font-bold leading-tight line-clamp-1">{cat.name}</span>
              <span
                className={`text-[10px] mt-1 ${
                  isSelected ? 'text-emerald-100' : 'text-slate-400'
                }`}
              >
                {liveProductCount} Produk
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
