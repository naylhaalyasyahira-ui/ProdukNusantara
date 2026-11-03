import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Store,
  Sparkles,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Building2
} from 'lucide-react';
import {
  getAllProvinces,
  getKabupatenByProvince,
  getKecamatanByKabupaten,
  getDesaByKecamatan
} from '../../data/indonesiaRegions';
import { CATEGORIES_LIST } from '../../data/initialData';

export const RegisterStoreModal: React.FC = () => {
  const {
    isRegisterStoreModalOpen,
    setIsRegisterStoreModalOpen,
    registerStore,
    currentUser,
    setIsAuthModalOpen
  } = useApp();

  const provinces = getAllProvinces();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    slogan: '',
    description: '',
    nib: '9120' + Math.floor(100000000 + Math.random() * 900000000),
    phoneNumber: currentUser?.phoneNumber || '0821-4455-6677',
    provinsi: 'Sulawesi Tenggara',
    kabupaten: 'Kota Kendari',
    kecamatan: 'Kadia',
    desa: 'Bende',
    logo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80'
  });

  if (!isRegisterStoreModalOpen) return null;

  const kabupatenList = getKabupatenByProvince(form.provinsi);
  const kecamatanList = getKecamatanByKabupaten(form.provinsi, form.kabupaten);
  const desaList = getDesaByKecamatan(form.provinsi, form.kabupaten, form.kecamatan);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsRegisterStoreModalOpen(false);
      setIsAuthModalOpen(true);
      return;
    }

    registerStore({
      name: form.name,
      slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      slogan: form.slogan,
      description: form.description,
      logo: form.logo,
      banner: form.banner,
      provinsi: form.provinsi,
      kabupaten: form.kabupaten,
      kecamatan: form.kecamatan,
      desa: form.desa,
      nib: form.nib,
      phoneNumber: form.phoneNumber
    });

    setIsRegisterStoreModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-5 animate-in zoom-in-95 shadow-2xl my-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Pendaftaran Toko Mitra UMKM</h3>
              <p className="text-[11px] text-slate-500">
                Buka toko resmi di platform ProdukNusantara gratis tanpa biaya
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsRegisterStoreModalOpen(false)}
            className="text-slate-400 hover:text-slate-800 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            UMKM dari seluruh 38 provinsi di Indonesia dapat bergabung. Usaha mikro dari Sulawesi
            Tenggara mendapatkan prioritas penayangan di halaman utama.
          </p>
        </div>

        {/* Store Name & NIB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Nama Toko UMKM *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Galeri Tenun Tolaki / Mete Kendari"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Nomor Induk Berusaha (NIB) *
            </label>
            <input
              type="text"
              required
              value={form.nib}
              onChange={(e) => setForm({ ...form, nib: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
            />
          </div>
        </div>

        {/* Slogan & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Slogan Singkat Toko
            </label>
            <input
              type="text"
              placeholder="Karya Asli Pengrajin Lokal"
              value={form.slogan}
              onChange={(e) => setForm({ ...form, slogan: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              No. WhatsApp Penjual *
            </label>
            <input
              type="text"
              required
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        {/* Regional Location */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Lokasi Tempat Usaha / Sentra Produksi
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Provinsi</label>
              <select
                value={form.provinsi}
                onChange={(e) => {
                  const prov = e.target.value;
                  const kabs = getKabupatenByProvince(prov);
                  const firstKab = kabs[0]?.name || '';
                  const kecs = getKecamatanByKabupaten(prov, firstKab);
                  const firstKec = kecs[0]?.name || '';
                  const desas = getDesaByKecamatan(prov, firstKab, firstKec);
                  setForm({
                    ...form,
                    provinsi: prov,
                    kabupaten: firstKab,
                    kecamatan: firstKec,
                    desa: desas[0] || ''
                  });
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Kabupaten / Kota</label>
              <select
                value={form.kabupaten}
                onChange={(e) => {
                  const kab = e.target.value;
                  const kecs = getKecamatanByKabupaten(form.provinsi, kab);
                  const firstKec = kecs[0]?.name || '';
                  const desas = getDesaByKecamatan(form.provinsi, kab, firstKec);
                  setForm({
                    ...form,
                    kabupaten: kab,
                    kecamatan: firstKec,
                    desa: desas[0] || ''
                  });
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {kabupatenList.map((k) => (
                  <option key={k.name} value={k.name}>
                    {k.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Kecamatan</label>
              <select
                value={form.kecamatan}
                onChange={(e) => {
                  const kec = e.target.value;
                  const desas = getDesaByKecamatan(form.provinsi, form.kabupaten, kec);
                  setForm({
                    ...form,
                    kecamatan: kec,
                    desa: desas[0] || ''
                  });
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {kecamatanList.map((kc) => (
                  <option key={kc.name} value={kc.name}>
                    {kc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Desa / Kelurahan</label>
              <select
                value={form.desa}
                onChange={(e) => setForm({ ...form, desa: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {desaList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Ceritakan Tentang Usaha Anda
          </label>
          <textarea
            rows={2}
            required
            placeholder="Jelaskan sejarah usaha, produk yang dihasilkan, atau kearifan lokal yang diangkat..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsRegisterStoreModalOpen(false)}
            className="text-xs text-slate-500 px-4 py-2"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Daftarkan Toko Saya</span>
          </button>
        </div>
      </form>
    </div>
  );
};
