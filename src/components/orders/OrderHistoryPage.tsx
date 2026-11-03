import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatDate, getOrderStatusInfo } from '../../utils/formatters';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Star,
  Copy,
  Receipt,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const { orders, currentUser, payOrder, updateOrderStatus, setSelectedProduct, products, setCurrentView } =
    useApp();

  const [activeTab, setActiveTab] = useState<string>('semua');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Filter orders for currentUser (or show demo orders if in demo mode)
  const userOrders = currentUser
    ? orders.filter((o) => o.buyerId === currentUser.id || o.buyerId === 'guest')
    : orders;

  const filteredOrders = userOrders.filter((o) => {
    if (activeTab === 'semua') return true;
    return o.orderStatus === activeTab;
  });

  const handleSimulatePayment = (orderId: string) => {
    payOrder(orderId);
  };

  const handleConfirmReceived = (orderId: string) => {
    updateOrderStatus(orderId, 'selesai', undefined, 'Pesanan telah diterima oleh pembeli');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>Riwayat & Lacak Pesanan</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau status pengiriman paket produk UMKM dan konfirmasi pesanan
          </p>
        </div>

        <button
          onClick={() => setCurrentView('catalog')}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-4 py-2 rounded-xl border border-emerald-200 transition"
        >
          + Belanja Produk Lagi
        </button>
      </div>

      {/* Tabs by Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar border-b border-slate-200">
        {[
          { key: 'semua', label: 'Semua Pesanan' },
          { key: 'menunggu_pembayaran', label: 'Menunggu Bayar' },
          { key: 'diproses', label: 'Diproses' },
          { key: 'dikirim', label: 'Sedang Dikirim' },
          { key: 'selesai', label: 'Selesai' }
        ].map((tab) => {
          const count = userOrders.filter(
            (o) => tab.key === 'semua' || o.orderStatus === tab.key
          ).length;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.key ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-6 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Belum Ada Pesanan</h3>
          <p className="text-xs text-slate-400">
            Anda belum memiliki pesanan di tab status ini. Silakan belanja produk UMKM favorit Anda!
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="mt-2 bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition"
          >
            Eksplor Produk Nusantara
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = getOrderStatusInfo(order.orderStatus);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition"
              >
                {/* Header Card */}
                <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{order.id}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-slate-500">{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="p-4 divide-y divide-slate-100 space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate">
                            {item.productName}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {item.quantity} barang &times; {formatRupiah(item.price)}
                          </p>
                          <span className="inline-block text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded font-medium mt-1">
                            Toko: {item.storeName}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-xs text-slate-900">
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Timeline / Shipping preview */}
                <div className="px-4 py-3 bg-emerald-50/30 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Kurir: <strong className="text-slate-800">{order.courier.name}</strong> ({order.courier.service})
                    </span>
                    {order.resiNumber && (
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                        Resi: {order.resiNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">Total Pesanan:</span>
                    <span className="text-sm font-extrabold text-emerald-700">
                      {formatRupiah(order.total)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedOrderDetails(order)}
                    className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Lihat Rincian & Lacak Paket</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {order.orderStatus === 'menunggu_pembayaran' && (
                      <button
                        onClick={() => handleSimulatePayment(order.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
                      >
                        Simulasi Bayar Sekarang
                      </button>
                    )}

                    {order.orderStatus === 'dikirim' && (
                      <button
                        onClick={() => handleConfirmReceived(order.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Konfirmasi Terima Barang</span>
                      </button>
                    )}

                    {order.orderStatus === 'selesai' && (
                      <button
                        onClick={() => {
                          const firstProd = products.find((p) => p.id === order.items[0]?.productId);
                          if (firstProd) setSelectedProduct(firstProd);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Beri Ulasan Produk</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail & Tracking Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                Detail Transaksi: {selectedOrderDetails.id}
              </h3>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-slate-400 hover:text-slate-800"
              >
                &times;
              </button>
            </div>

            {/* Tracking Stepper */}
            <div>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Status Pelacakan Pengiriman
              </p>
              <div className="space-y-3 pl-2 border-l-2 border-emerald-500">
                {selectedOrderDetails.history?.map((step, idx) => (
                  <div key={idx} className="relative pl-4">
                    <span className="absolute -left-[13px] top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow-xs"></span>
                    <p className="text-xs font-bold text-slate-800">
                      {step.status.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{step.note}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {formatDate(step.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">Alamat Pengiriman:</p>
              <p className="text-slate-700">
                {selectedOrderDetails.shippingAddress.recipientName} (
                {selectedOrderDetails.shippingAddress.phoneNumber})
              </p>
              <p className="text-slate-500 text-[11px]">
                {selectedOrderDetails.shippingAddress.detailAlamat}, Desa{' '}
                {selectedOrderDetails.shippingAddress.desa}, Kec.{' '}
                {selectedOrderDetails.shippingAddress.kecamatan},{' '}
                {selectedOrderDetails.shippingAddress.kabupaten},{' '}
                {selectedOrderDetails.shippingAddress.provinsi}
              </p>
            </div>

            {/* Payment & courier info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Metode Pembayaran</span>
                <span className="font-bold text-slate-800">
                  {selectedOrderDetails.paymentMethod.name}
                </span>
                <span
                  className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.2 rounded ${
                    selectedOrderDetails.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedOrderDetails.paymentStatus === 'paid' ? 'Lunas (Sandbox)' : 'Belum Dibayar'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Jasa Kurir</span>
                <span className="font-bold text-slate-800">
                  {selectedOrderDetails.courier.name}
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  Resi: {selectedOrderDetails.resiNumber || 'Sedang Diproses'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="w-full bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
