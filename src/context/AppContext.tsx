import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode
} from 'react';
import {
  User,
  Store,
  Product,
  CartItem,
  Order,
  Review,
  ToastMessage,
  OrderStatus,
  CourierService,
  PaymentMethod,
  Address
} from '../types';
import { dbService } from '../services/db';

interface AppContextType {
  // User & Auth
  currentUser: User | null;
  users: User[];
  currentStore: Store | null;
  login: (email: string, password?: string, expectedRole?: 'buyer' | 'seller' | 'admin') => boolean;
  register: (name: string, email: string, password?: string, phone?: string, role?: 'buyer' | 'seller') => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updated: Partial<User>) => void;

  // Data
  products: Product[];
  stores: Store[];
  cart: CartItem[];
  orders: Order[];
  reviews: Review[];
  wishlist: string[];

  // Store Management
  registerStore: (data: Omit<Store, 'id' | 'ownerId' | 'rating' | 'totalSold' | 'isVerified' | 'status' | 'joinedAt'>) => void;
  updateStore: (data: Partial<Store>) => void;
  approveStore: (storeId: string) => void;
  rejectStore: (storeId: string) => void;

  // Product Management
  addProduct: (data: Omit<Product, 'id' | 'storeId' | 'storeName' | 'rating' | 'reviewCount' | 'sold' | 'createdAt'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart & Wishlist
  addToCart: (productId: string, qty?: number) => void;
  updateCartQty: (itemId: string, qty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Order Management
  createOrder: (params: {
    items: CartItem[];
    shippingAddress: Address;
    courier: CourierService;
    paymentMethod: PaymentMethod;
    discount?: number;
  }) => Order;
  payOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, resiNumber?: string, note?: string) => void;

  // Reviews
  addReview: (productId: string, rating: number, comment: string, photos?: string[]) => void;

  // Filters & Navigation
  currentView: 'home' | 'catalog' | 'orders' | 'wishlist' | 'seller-center' | 'admin' | 'profile' | 'store-detail' | 'login-buyer' | 'login-seller' | 'login-admin';
  setCurrentView: (view: 'home' | 'catalog' | 'orders' | 'wishlist' | 'seller-center' | 'admin' | 'profile' | 'store-detail' | 'login-buyer' | 'login-seller' | 'login-admin') => void;
  activeStoreDetailId: string | null;
  openStoreDetail: (storeId: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedProvince: string;
  setSelectedProvince: (prov: string) => void;
  selectedKabupaten: string;
  setSelectedKabupaten: (kab: string) => void;
  selectedKecamatan: string;
  setSelectedKecamatan: (kec: string) => void;
  selectedDesa: string;
  setSelectedDesa: (desa: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'terpopuler' | 'terlaris' | 'terbaru' | 'harga_terendah' | 'harga_tertinggi';
  setSortBy: (sort: 'terpopuler' | 'terlaris' | 'terbaru' | 'harga_terendah' | 'harga_tertinggi') => void;
  filterSultraOnly: boolean;
  setFilterSultraOnly: (val: boolean) => void;
  filterVerifiedOnly: boolean;
  setFilterVerifiedOnly: (val: boolean) => void;
  resetFilters: () => void;

  // Modals
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authRoleTarget: 'buyer' | 'seller' | 'admin';
  setAuthRoleTarget: (role: 'buyer' | 'seller' | 'admin') => void;
  openAuthModal: (role?: 'buyer' | 'seller' | 'admin') => void;
  isRegisterStoreModalOpen: boolean;
  setIsRegisterStoreModalOpen: (open: boolean) => void;
  isChatModalOpen: boolean;
  setIsChatModalOpen: (open: boolean) => void;
  chatStoreTarget: Store | null;
  openChatWithStore: (store: Store) => void;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  openSupabaseModal: () => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  removeToast: (id: string) => void;

  // Reset demo
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // DB state
  const [currentUser, setCurrentUser] = useState<User | null>(() => dbService.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => dbService.getUsers());
  const [products, setProducts] = useState<Product[]>(() => dbService.getProducts());
  const [stores, setStores] = useState<Store[]>(() => dbService.getStores());
  const [cart, setCart] = useState<CartItem[]>(() => dbService.getCart());
  const [orders, setOrders] = useState<Order[]>(() => dbService.getOrders());
  const [reviews, setReviews] = useState<Review[]>(() => dbService.getReviews());
  const [wishlist, setWishlist] = useState<string[]>(() => dbService.getWishlist());

  // Views & Navigation
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'orders' | 'wishlist' | 'seller-center' | 'admin' | 'profile' | 'store-detail' | 'login-buyer' | 'login-seller' | 'login-admin'>('home');
  const [activeStoreDetailId, setActiveStoreDetailId] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedProvince, setSelectedProvince] = useState('Semua');
  const [selectedKabupaten, setSelectedKabupaten] = useState('Semua');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua');
  const [selectedDesa, setSelectedDesa] = useState('Semua');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortBy, setSortBy] = useState<'terpopuler' | 'terlaris' | 'terbaru' | 'harga_terendah' | 'harga_tertinggi'>('terpopuler');
  const [filterSultraOnly, setFilterSultraOnly] = useState(false);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRoleTarget, setAuthRoleTarget] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const [isRegisterStoreModalOpen, setIsRegisterStoreModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatStoreTarget, setChatStoreTarget] = useState<Store | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const openAuthModal = (role: 'buyer' | 'seller' | 'admin' = 'buyer') => {
    setAuthRoleTarget(role);
    setIsAuthModalOpen(true);
  };

  const openSupabaseModal = () => {
    setIsSupabaseModalOpen(true);
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync with DB subscriptions
  useEffect(() => {
    const unsubs = [
      dbService.subscribe('users', () => {
        setUsers(dbService.getUsers());
        setCurrentUser(dbService.getCurrentUser());
      }),
      dbService.subscribe('stores', () => {
        setStores(dbService.getStores());
      }),
      dbService.subscribe('products', () => {
        setProducts(dbService.getProducts());
      }),
      dbService.subscribe('cart', () => {
        setCart(dbService.getCart());
      }),
      dbService.subscribe('orders', () => {
        setOrders(dbService.getOrders());
      }),
      dbService.subscribe('reviews', () => {
        setReviews(dbService.getReviews());
      }),
      dbService.subscribe('wishlist', () => {
        setWishlist(dbService.getWishlist());
      })
    ];
    return () => unsubs.forEach((unsub) => unsub());
  }, []);

  // Compute current user's store
  const currentStore = currentUser?.storeId
    ? stores.find((s) => s.id === currentUser.storeId) || null
    : null;

  // Auth functions with strict Supabase Role-Based Access Control (RBAC)
  const login = (
    email: string,
    password?: string,
    expectedRole?: 'buyer' | 'seller' | 'admin'
  ): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      if (expectedRole === 'admin') {
        showToast(
          'error',
          'Akses Administrator Ditolak',
          `Akun ${email} tidak terdaftar dalam otorisasi Admin. Akses ditolak demi keamanan.`
        );
        return false;
      }
      showToast(
        'error',
        'Akun Belum Terdaftar',
        `Email ${email} tidak ditemukan. Silakan lakukan pendaftaran akun terlebih dahulu.`
      );
      return false;
    }

    // 1. STRICT ISOLATION: PEMBELI CANNOT ACCESS SELLER OR ADMIN
    if (found.role === 'buyer' && expectedRole && expectedRole !== 'buyer') {
      showToast(
        'error',
        'Akses Ditolak (Isolasi Supabase RLS)',
        `Akun "${found.name}" berstatus PEMBELI. Sesuai aturan keamanan data, akun Pembeli dilarang keras login ke portal ${
          expectedRole === 'admin' ? 'ADMINISTRATOR' : 'PENJUAL UMKM'
        }.`
      );
      return false;
    }

    // 2. STRICT ISOLATION: SELLER CANNOT ACCESS ADMIN
    if (found.role === 'seller' && expectedRole === 'admin') {
      showToast(
        'error',
        'Akses Ditolak',
        `Akun Penjual UMKM tidak memiliki hak akses administrator.`
      );
      return false;
    }

    // 3. MISMATCHED ROLE CHECK
    if (expectedRole && found.role !== expectedRole) {
      showToast(
        'error',
        'Portal Tidak Sesuai',
        `Akun ini terdaftar sebagai ${found.role.toUpperCase()}. Silakan gunakan portal ${found.role.toUpperCase()} untuk masuk.`
      );
      return false;
    }

    // 4. PASSWORD AUTHENTICATION CHECK
    if (found.password) {
      if (!password) {
        showToast('error', 'Kata Sandi Diperlukan', 'Harap masukkan kata sandi akun.');
        return false;
      }
      if (password !== found.password) {
        showToast('error', 'Kata Sandi Salah', 'Kata sandi yang Anda masukkan tidak sesuai.');
        return false;
      }
    }

    // SUCCESSFUL AUTHENTICATION
    dbService.setCurrentUserId(found.id);
    showToast(
      'success',
      'Autentikasi Berhasil',
      `Selamat datang kembali, ${found.name}! Masuk sebagai [${found.role.toUpperCase()}].`
    );

    if (found.role === 'seller') {
      setCurrentView('seller-center');
    } else if (found.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('home');
    }
    return true;
  };

  const register = (
    name: string,
    email: string,
    password?: string,
    phone?: string,
    role: 'buyer' | 'seller' = 'buyer'
  ): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      showToast('error', 'Email Sudah Terdaftar', `Email ${cleanEmail} sudah digunakan. Silakan langsung login.`);
      return false;
    }

    // Strict security: Public registration can NEVER create an admin account
    const sanitizedRole: 'buyer' | 'seller' = role === 'seller' ? 'seller' : 'buyer';
    const chosenPassword = password?.trim() || 'Nusantara123!';
    const chosenPhone = phone?.trim() || '0812-3456-7890';

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      password: chosenPassword,
      phoneNumber: chosenPhone,
      role: sanitizedRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      addresses: [
        {
          recipientName: name.trim() || cleanEmail.split('@')[0],
          phoneNumber: chosenPhone,
          provinsi: 'Sulawesi Tenggara',
          kabupaten: 'Kota Kendari',
          kecamatan: 'Kadia',
          desa: 'Bende',
          postalCode: '93117',
          detailAlamat: 'Jl. Ahmad Yani No. 10',
          isPrimary: true
        }
      ],
      createdAt: new Date().toISOString()
    };

    dbService.saveUser(newUser);
    dbService.setCurrentUserId(newUser.id);
    showToast(
      'success',
      'Pendaftaran Berhasil',
      `Akun ${newUser.name} berhasil dibuat sebagai ${sanitizedRole.toUpperCase()}.`
    );

    if (sanitizedRole === 'seller') {
      setCurrentView('seller-center');
    } else {
      setCurrentView('home');
    }
    return true;
  };

  const logout = () => {
    const defaultUser = users.find((u) => u.role === 'buyer') || users[0];
    if (defaultUser) {
      dbService.setCurrentUserId(defaultUser.id);
    }
    setCurrentView('home');
    showToast('info', 'Keluar Akun', 'Anda telah keluar dan kembali ke sesi belanja umum.');
  };

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      dbService.setCurrentUserId(user.id);
      showToast('info', 'Beralih Akun', `Aktif sebagai ${user.name} (${user.role.toUpperCase()})`);
    }
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const merged: User = { ...currentUser, ...updated };
    dbService.saveUser(merged);
    showToast('success', 'Profil Diperbarui', 'Data profil Anda telah berhasil disimpan.');
  };

  // Store actions
  const registerStore = (data: Omit<Store, 'id' | 'ownerId' | 'rating' | 'totalSold' | 'isVerified' | 'status' | 'joinedAt'>) => {
    if (!currentUser) return;
    const newStore: Store = {
      ...data,
      id: `store-${Date.now()}`,
      ownerId: currentUser.id,
      rating: 5.0,
      totalSold: 0,
      isVerified: true, // auto-verified in demo
      status: 'approved',
      joinedAt: new Date().toISOString()
    };
    dbService.saveStore(newStore);
    showToast('success', 'Toko UMKM Berhasil Terdaftar', `Selamat! Toko "${newStore.name}" kini telah aktif dan terverifikasi.`);
    setCurrentView('seller-center');
  };

  const updateStore = (data: Partial<Store>) => {
    if (!currentStore) return;
    const merged: Store = { ...currentStore, ...data };
    dbService.saveStore(merged);
    showToast('success', 'Toko Diperbarui', 'Informasi toko berhasil disimpan.');
  };

  const approveStore = (storeId: string) => {
    dbService.updateStoreStatus(storeId, 'approved');
    showToast('success', 'Toko Diverifikasi', 'Toko UMKM telah disetujui dan memperoleh lencana Terverifikasi.');
  };

  const rejectStore = (storeId: string) => {
    dbService.updateStoreStatus(storeId, 'rejected');
    showToast('info', 'Pendaftaran Toko Ditolak', 'Status pendaftaran toko telah diperbarui.');
  };

  // Product actions
  const addProduct = (data: Omit<Product, 'id' | 'storeId' | 'storeName' | 'rating' | 'reviewCount' | 'sold' | 'createdAt'>) => {
    if (!currentStore) {
      showToast('error', 'Gagal Menambah Produk', 'Anda harus memiliki toko UMKM aktif terlebih dahulu.');
      return;
    }
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      storeId: currentStore.id,
      storeName: currentStore.name,
      rating: 5.0,
      reviewCount: 0,
      sold: 0,
      createdAt: new Date().toISOString()
    };
    dbService.saveProduct(newProduct);
    showToast('success', 'Produk Ditambahkan', `Produk "${newProduct.name}" berhasil dipublikasikan.`);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    const existing = dbService.getProduct(id);
    if (!existing) return;
    const updated: Product = { ...existing, ...data };
    dbService.saveProduct(updated);
    showToast('success', 'Produk Diperbarui', `Perubahan pada "${updated.name}" berhasil disimpan.`);
  };

  const deleteProduct = (id: string) => {
    const p = dbService.getProduct(id);
    dbService.deleteProduct(id);
    showToast('info', 'Produk Dihapus', `Produk ${p?.name || ''} telah dihapus.`);
  };

  // Cart & Wishlist
  const addToCart = (productId: string, qty: number = 1) => {
    const product = dbService.getProduct(productId);
    if (!product) return;
    dbService.addToCart(productId, qty);
    showToast('success', 'Masuk Keranjang', `${qty}x ${product.name} telah ditambahkan ke keranjang.`);
  };

  const updateCartQty = (itemId: string, qty: number) => {
    dbService.updateCartItem(itemId, qty);
  };

  const removeFromCart = (itemId: string) => {
    dbService.removeCartItem(itemId);
    showToast('info', 'Dihapus dari Keranjang', 'Item telah dihapus.');
  };

  const clearCart = () => {
    dbService.clearCart();
  };

  const toggleWishlist = (productId: string) => {
    const added = dbService.toggleWishlist(productId);
    const prod = dbService.getProduct(productId);
    if (added) {
      showToast('success', 'Disimpan ke Favorit', `${prod?.name || 'Produk'} ditambahkan ke daftar keinginan.`);
    } else {
      showToast('info', 'Dihapus dari Favorit', `${prod?.name || 'Produk'} dihapus dari favorit.`);
    }
  };

  const isWishlisted = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Orders
  const createOrder = ({
    items,
    shippingAddress,
    courier,
    paymentMethod,
    discount = 0
  }: {
    items: CartItem[];
    shippingAddress: Address;
    courier: CourierService;
    paymentMethod: PaymentMethod;
    discount?: number;
  }): Order => {
    const snapshotItems = items.map((cartItem) => {
      const prod = products.find((p) => p.id === cartItem.productId)!;
      return {
        productId: prod.id,
        productName: prod.name,
        productImage: prod.images[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
        price: prod.price,
        quantity: cartItem.quantity,
        weight: prod.weight,
        storeId: prod.storeId,
        storeName: prod.storeName
      };
    });

    const subtotal = snapshotItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const total = Math.max(0, subtotal + courier.cost - discount);

    const isInstantPayment = paymentMethod.type === 'qris';

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      buyerId: currentUser?.id || 'guest',
      buyerName: shippingAddress.recipientName,
      buyerPhone: shippingAddress.phoneNumber,
      shippingAddress,
      items: snapshotItems,
      subtotal,
      shippingCost: courier.cost,
      discount,
      total,
      courier,
      paymentMethod,
      paymentStatus: isInstantPayment ? 'paid' : 'unpaid',
      orderStatus: isInstantPayment ? 'diproses' : 'menunggu_pembayaran',
      history: [
        {
          status: 'menunggu_pembayaran',
          timestamp: new Date().toISOString(),
          note: 'Pesanan dibuat oleh pembeli'
        },
        ...(isInstantPayment
          ? [
              {
                status: 'diproses' as OrderStatus,
                timestamp: new Date().toISOString(),
                note: 'Simulasi QRIS berhasil dikonfirmasi otomatis'
              }
            ]
          : [])
      ],
      createdAt: new Date().toISOString(),
      ...(isInstantPayment ? { paidAt: new Date().toISOString() } : {})
    };

    dbService.saveOrder(newOrder);

    // Remove ordered items from cart
    items.forEach((item) => dbService.removeCartItem(item.id));

    showToast('success', 'Pesanan Berhasil Dibuat!', `Nomor Transaksi: ${newOrder.id}`);
    return newOrder;
  };

  const payOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    order.paymentStatus = 'paid';
    order.paidAt = new Date().toISOString();
    order.orderStatus = 'diproses';
    order.history.push({
      status: 'diproses',
      timestamp: new Date().toISOString(),
      note: 'Simulasi pembayaran diverifikasi sistem (Sandbox)'
    });
    dbService.saveOrder(order);
    showToast('success', 'Pembayaran Terverifikasi!', 'Pesanan segera diproses oleh UMKM penjual.');
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    resiNumber?: string,
    note?: string
  ) => {
    dbService.updateOrderStatus(orderId, status, resiNumber, note);
    showToast('info', 'Status Pesanan Diperbarui', `Status saat ini: ${status.replace('_', ' ').toUpperCase()}`);
  };

  // Reviews
  const addReview = (productId: string, rating: number, comment: string, photos: string[] = []) => {
    if (!currentUser) return;
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      rating,
      comment,
      photos,
      createdAt: new Date().toISOString()
    };
    dbService.saveReview(newReview);
    showToast('success', 'Ulasan Terkirim!', 'Terima kasih telah mendukung produk UMKM Indonesia.');
  };

  const openStoreDetail = (storeId: string) => {
    setActiveStoreDetailId(storeId);
    setCurrentView('store-detail');
  };

  const openChatWithStore = (store: Store) => {
    setChatStoreTarget(store);
    setIsChatModalOpen(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSelectedProvince('Semua');
    setSelectedKabupaten('Semua');
    setSelectedKecamatan('Semua');
    setSelectedDesa('Semua');
    setPriceRange([0, 1000000]);
    setSortBy('terpopuler');
    setFilterSultraOnly(false);
    setFilterVerifiedOnly(false);
  };

  const resetDemoData = () => {
    dbService.initDatabase(true);
    showToast('info', 'Database Direset', 'Data telah dikembalikan ke kondisi awal demonstrasi.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        currentStore,
        login,
        register,
        logout,
        switchUser,
        updateProfile,

        products,
        stores,
        cart,
        orders,
        reviews,
        wishlist,

        registerStore,
        updateStore,
        approveStore,
        rejectStore,

        addProduct,
        updateProduct,
        deleteProduct,

        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,

        createOrder,
        payOrder,
        updateOrderStatus,

        addReview,

        currentView,
        setCurrentView,
        activeStoreDetailId,
        openStoreDetail,

        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProvince,
        setSelectedProvince,
        selectedKabupaten,
        setSelectedKabupaten,
        selectedKecamatan,
        setSelectedKecamatan,
        selectedDesa,
        setSelectedDesa,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        filterSultraOnly,
        setFilterSultraOnly,
        filterVerifiedOnly,
        setFilterVerifiedOnly,
        resetFilters,

        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authRoleTarget,
        setAuthRoleTarget,
        openAuthModal,
        isRegisterStoreModalOpen,
        setIsRegisterStoreModalOpen,
        isChatModalOpen,
        setIsChatModalOpen,
        chatStoreTarget,
        openChatWithStore,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        openSupabaseModal,

        toasts,
        showToast,
        removeToast,

        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
