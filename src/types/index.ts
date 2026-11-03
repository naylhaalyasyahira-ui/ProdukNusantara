export type UserRole = 'buyer' | 'seller' | 'admin';

export interface Address {
  recipientName: string;
  phoneNumber: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  postalCode: string;
  detailAlamat: string;
  isPrimary?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  role: UserRole;
  avatar: string;
  addresses: Address[];
  storeId?: string;
  createdAt: string;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  slogan: string;
  description: string;
  logo: string;
  banner: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  rating: number;
  totalSold: number;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  nib: string; // Nomor Induk Berusaha
  phoneNumber: string;
  joinedAt: string;
}

export type ProductCategory =
  | 'Makanan'
  | 'Minuman'
  | 'Fashion'
  | 'Kerajinan Tangan'
  | 'Produk Pertanian'
  | 'Kecantikan'
  | 'Peralatan Rumah Tangga'
  | 'Oleh-oleh Khas Daerah';

export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  stock: number;
  sold: number;
  weight: number; // in grams
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  provinsi: string;
  kabupaten: string;
  kecamatan?: string;
  desa?: string;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  storeId: string;
  quantity: number;
  selected: boolean;
  addedAt: string;
}

export interface CourierService {
  code: string;
  name: string;
  service: string;
  cost: number;
  etd: string; // Estimated delivery e.g. "2-3 hari"
}

export type PaymentMethodType = 'qris' | 'virtual_account' | 'ewallet' | 'cod';

export interface PaymentMethod {
  code: string;
  name: string;
  type: PaymentMethodType;
  accountNumber?: string;
  instructions: string;
  iconName: string;
}

export type OrderStatus =
  | 'menunggu_pembayaran'
  | 'diproses'
  | 'dikirim'
  | 'selesai'
  | 'dibatalkan';

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  weight: number;
  storeId: string;
  storeName: string;
}

export interface OrderHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  shippingAddress: Address;
  items: OrderItemSnapshot[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  courier: CourierService;
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid';
  orderStatus: OrderStatus;
  resiNumber?: string;
  history: OrderHistoryItem[];
  createdAt: string;
  paidAt?: string;
  completedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  orderId?: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  comment: string;
  photos?: string[];
  createdAt: string;
}

export interface RegionLocation {
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
