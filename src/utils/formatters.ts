import { OrderStatus } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1).replace('.0', '')} kg`;
  }
  return `${grams} gr`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getOrderStatusInfo(status: OrderStatus): {
  label: string;
  color: string;
  bg: string;
  border: string;
  step: number;
} {
  switch (status) {
    case 'menunggu_pembayaran':
      return {
        label: 'Menunggu Pembayaran',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        step: 1
      };
    case 'diproses':
      return {
        label: 'Diproses Penjual',
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        step: 2
      };
    case 'dikirim':
      return {
        label: 'Sedang Dikirim',
        color: 'text-purple-700',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        step: 3
      };
    case 'selesai':
      return {
        label: 'Pesanan Selesai',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        step: 4
      };
    case 'dibatalkan':
      return {
        label: 'Dibatalkan',
        color: 'text-rose-700',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        step: 0
      };
    default:
      return {
        label: status,
        color: 'text-slate-700',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        step: 1
      };
  }
}
