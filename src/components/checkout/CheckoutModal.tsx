import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Address,
  CourierService,
  PaymentMethod
} from '../../types';
import { AVAILABLE_COURIERS, PAYMENT_METHODS } from '../../data/initialData';
import { formatRupiah, formatWeight } from '../../utils/formatters';
import {
  X,
  MapPin,
  Truck,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  getAllProvinces,
  getKabupatenByProvince,
  getKecamatanByKabupaten,
  getDesaByKecamatan
} from '../../data/indonesiaRegions';

export const CheckoutModal: React.FC = () => {
  const {
    currentUser,
    cart,
    products,
    isCheckoutOpen,
    setIsCheckoutOpen,
    createOrder,
    setCurrentView,
    showToast
  } = useApp();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Address State
  const defaultAddress: Address = currentUser?.addresses?.[0] || {
    recipientName: currentUser?.name || 'Siti Rahmawati',
    phoneNumber: currentUser?.phoneNumber || '0812-4567-8901',
    provinsi: 'Sulawesi Tenggara',
    kabupaten: 'Kota Kendari',
    kecamatan: 'Kambu',
    desa: 'Kambu',
    postalCode: '93231',
    detailAlamat: 'Jl. H.E.A Mokodompit No. 42 (Dekat Kampus UHO)',
    isPrimary: true
  };

  const [shippingAddress, setShippingAddress] = useState<Address>(defaultAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Couriers & Payment
  const [selectedCourier, setSelectedCourier] = useState<CourierService>(AVAILABLE_COURIERS[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);

  // Simulation interaction
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [copiedVA, setCopiedVA] = useState(false);

  if (!isCheckoutOpen) return null;

  // Enrich cart items
  const enrichedItems = cart
    .map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      return prod ? { ...item, product: prod } : null;
    })
    .filter(Boolean) as (typeof cart[0] & { product: typeof products[0] })[];

  const subtotal = enrichedItems.reduce(
    (sum, it) => sum + it.product.price * it.quantity,
    0
  );
  const totalWeight = enrichedItems.reduce(
    (sum, it) => sum + it.product.weight * it.quantity,
    0
  );

  // Calculate dynamic shipping cost based on weight multiplier
  const weightMultiplier = Math.max(1, Math.ceil(totalWeight / 1000));
  const shippingCost = selectedCourier.cost * weightMultiplier;
  const totalAmount = subtotal + shippingCost;

  // Regional lists for address editor
  const provinces = getAllProvinces();
  const kabupatenList = getKabupatenByProvince(shippingAddress.provinsi);
  const kecamatanList = getKecamatanByKabupaten(
    shippingAddress.provinsi,
    shippingAddress.kabupaten
  );
  const desaList = getDesaByKecamatan(
    shippingAddress.provinsi,
    shippingAddress.kabupaten,
    shippingAddress.kecamatan
  );

  const handleCopyVA = () => {
    if (selectedPayment.accountNumber) {
      navigator.clipboard?.writeText(selectedPayment.accountNumber.replace(/-/g, ''));
      setCopiedVA(true);
      setTimeout(() => setCopiedVA(false), 2000);
      showToast('info', 'Nomor VA Disalin', 'Nomor Virtual Account telah disalin ke papan klip.');
    }
  };

  const handleFinishCheckout = () => {
    setIsSimulatingPayment(true);

    setTimeout(() => {
      createOrder({
        items: cart,
        shippingAddress,
        courier: { ...selectedCourier, cost: shippingCost },
        paymentMethod: selectedPayment
      });

      setIsSimulatingPayment(false);
      setIsCheckoutOpen(false);
      setCurrentView('orders');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
          <div>
            <h3 className="font-bold text-base text-slate-900">Checkout Pesanan UMKM</h3>
            <p className="text-xs text-slate-500">Konfirmasi alamat, kurir, dan pembayaran simulasi</p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper indicator */}
        <div className="px-6 py-2.5 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between text-xs">
          <button
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-1.5 font-bold ${
              activeStep === 1 ? 'text-emerald-800' : 'text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Alamat</span>
          </button>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <button
            onClick={() => setActiveStep(2)}
            className={`flex items-center gap-1.5 font-bold ${
              activeStep === 2 ? 'text-emerald-800' : 'text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Kurir Ekspedisi</span>
          </button>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <button
            onClick={() => setActiveStep(3)}
            className={`flex items-center gap-1.5 font-bold ${
              activeStep === 3 ? 'text-emerald-800' : 'text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Metode Bayar</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Alamat Pengiriman */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Alamat Pengiriman Tujuan</span>
                </h4>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs text-emerald-700 font-semibold hover:underline"
                >
                  {isEditingAddress ? 'Gunakan Alamat Ini' : 'Ubah Alamat'}
                </button>
              </div>

              {!isEditingAddress ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-slate-900">
                      {shippingAddress.recipientName} ({shippingAddress.phoneNumber})
                    </p>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Alamat Utama
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {shippingAddress.detailAlamat}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Desa {shippingAddress.desa}, Kec. {shippingAddress.kecamatan},{' '}
                    {shippingAddress.kabupaten}, {shippingAddress.provinsi} -{' '}
                    {shippingAddress.postalCode}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Nama Penerima
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.recipientName}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, recipientName: e.target.value })
                        }
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Nomor Handphone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.phoneNumber}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })
                        }
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Provinsi
                      </label>
                      <select
                        value={shippingAddress.provinsi}
                        onChange={(e) => {
                          const prov = e.target.value;
                          const kabs = getKabupatenByProvince(prov);
                          const firstKab = kabs[0]?.name || '';
                          const kecs = getKecamatanByKabupaten(prov, firstKab);
                          const firstKec = kecs[0]?.name || '';
                          const desas = getDesaByKecamatan(prov, firstKab, firstKec);
                          setShippingAddress({
                            ...shippingAddress,
                            provinsi: prov,
                            kabupaten: firstKab,
                            kecamatan: firstKec,
                            desa: desas[0] || ''
                          });
                        }}
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      >
                        {provinces.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Kabupaten / Kota
                      </label>
                      <select
                        value={shippingAddress.kabupaten}
                        onChange={(e) => {
                          const kab = e.target.value;
                          const kecs = getKecamatanByKabupaten(shippingAddress.provinsi, kab);
                          const firstKec = kecs[0]?.name || '';
                          const desas = getDesaByKecamatan(
                            shippingAddress.provinsi,
                            kab,
                            firstKec
                          );
                          setShippingAddress({
                            ...shippingAddress,
                            kabupaten: kab,
                            kecamatan: firstKec,
                            desa: desas[0] || ''
                          });
                        }}
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      >
                        {kabupatenList.map((k) => (
                          <option key={k.name} value={k.name}>
                            {k.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Kecamatan
                      </label>
                      <select
                        value={shippingAddress.kecamatan}
                        onChange={(e) => {
                          const kec = e.target.value;
                          const desas = getDesaByKecamatan(
                            shippingAddress.provinsi,
                            shippingAddress.kabupaten,
                            kec
                          );
                          setShippingAddress({
                            ...shippingAddress,
                            kecamatan: kec,
                            desa: desas[0] || ''
                          });
                        }}
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      >
                        {kecamatanList.map((kc) => (
                          <option key={kc.name} value={kc.name}>
                            {kc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Desa / Kelurahan
                      </label>
                      <select
                        value={shippingAddress.desa}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, desa: e.target.value })
                        }
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      >
                        {desaList.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                        }
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Alamat Lengkap (Nama Jalan, No. Rumah, Patokan)
                    </label>
                    <textarea
                      rows={2}
                      value={shippingAddress.detailAlamat}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, detailAlamat: e.target.value })
                      }
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <button
                    onClick={() => setIsEditingAddress(false)}
                    className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Simpan Alamat Ini
                  </button>
                </div>
              )}

              {/* Order Items Preview */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Ringkasan Barang ({enrichedItems.length} Produk &bull; {formatWeight(totalWeight)}):
                </span>
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {enrichedItems.map((it) => (
                    <div key={it.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={it.product.images[0]}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-[240px]">
                            {it.product.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {it.quantity}x &middot; {it.product.storeName}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-800 shrink-0">
                        {formatRupiah(it.product.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setActiveStep(2)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition"
                >
                  <span>Lanjut Pilih Kurir</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Pilih Kurir */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Pilih Jasa Ekspedisi Pengiriman</span>
              </h4>

              <div className="space-y-2.5">
                {AVAILABLE_COURIERS.map((c) => {
                  const isSelected = selectedCourier.code === c.code;
                  const calculatedCost = c.cost * weightMultiplier;

                  return (
                    <label
                      key={c.code}
                      onClick={() => setSelectedCourier(c)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="courier"
                          checked={isSelected}
                          onChange={() => setSelectedCourier(c)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{c.name}</p>
                          <p className="text-[11px] text-slate-500">
                            Layanan {c.service} &middot; Estimasi {c.etd}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-700">
                          {formatRupiah(calculatedCost)}
                        </span>
                        {weightMultiplier > 1 && (
                          <span className="block text-[10px] text-slate-400">
                            (Berat {formatWeight(totalWeight)})
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => setActiveStep(1)}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  &larr; Kembali ke Alamat
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Metode Pembayaran (SIMULASI TRANSPARAN) */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Pilih Metode Pembayaran</span>
                </h4>

                {/* Sandbox Notice Banner - Clear & Honest as required */}
                <div className="mt-2 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Mode Simulasi Pembayaran Sandbox</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Aplikasi ini menggunakan simulasi pembayaran resmi untuk marketplace UMKM.
                    Transaksi ini <strong>tidak akan memotong saldo nyata</strong> dari rekening Anda,
                    namun pesanan akan langsung tercatat dan dapat diproses oleh penjual.
                  </p>
                </div>
              </div>

              {/* Payment Methods List */}
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedPayment.code === method.code;

                  return (
                    <label
                      key={method.code}
                      onClick={() => setSelectedPayment(method)}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={isSelected}
                        onChange={() => setSelectedPayment(method)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 mt-0.5"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900">{method.name}</p>
                          {method.type === 'qris' && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                              Konfirmasi Instan
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{method.instructions}</p>

                        {/* Interactive simulation element if VA is selected */}
                        {isSelected && method.accountNumber && (
                          <div className="mt-2.5 p-2 rounded-xl bg-white border border-emerald-300 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 block">No. Virtual Account:</span>
                              <span className="font-mono text-xs font-bold text-emerald-900">
                                {method.accountNumber}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyVA}
                              className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold p-1"
                            >
                              {copiedVA ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedVA ? 'Tersalin' : 'Salin'}</span>
                            </button>
                          </div>
                        )}

                        {/* Interactive simulation element if QRIS is selected */}
                        {isSelected && method.type === 'qris' && (
                          <div className="mt-2.5 p-3 rounded-xl bg-white border border-emerald-300 flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-900 p-1.5 rounded-lg shrink-0 flex items-center justify-center">
                              <QrCode className="w-full h-full text-white" />
                            </div>
                            <div className="text-[11px] text-slate-600 space-y-0.5">
                              <p className="font-bold text-slate-900">QRIS Standar Bank Indonesia</p>
                              <p className="text-slate-500 text-[10px]">
                                Berlaku untuk semua aplikasi m-Banking & dompet digital di Indonesia.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Price Breakdown Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal Belanja:</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim ({selectedCourier.name}):</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Tagihan:</span>
                  <span className="text-emerald-700">{formatRupiah(totalAmount)}</span>
                </div>
              </div>

              {/* Confirm & Process Button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setActiveStep(2)}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  &larr; Kembali ke Kurir
                </button>

                <button
                  onClick={handleFinishCheckout}
                  disabled={isSimulatingPayment}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isSimulatingPayment ? (
                    <span>Memproses Transaksi...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Bayar Sekarang ({formatRupiah(totalAmount)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
