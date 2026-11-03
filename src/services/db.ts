import {
  User,
  Store,
  Product,
  CartItem,
  Order,
  Review,
  OrderStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STORES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS
} from '../data/initialData';

const KEYS = {
  USERS: 'produknusantara_users_v1',
  CURRENT_USER_ID: 'produknusantara_current_uid_v1',
  STORES: 'produknusantara_stores_v1',
  PRODUCTS: 'produknusantara_products_v1',
  CART: 'produknusantara_cart_v1',
  ORDERS: 'produknusantara_orders_v1',
  REVIEWS: 'produknusantara_reviews_v1',
  WISHLIST: 'produknusantara_wishlist_v1',
};

type EventType = 'users' | 'stores' | 'products' | 'cart' | 'orders' | 'reviews' | 'wishlist' | 'all';
type Listener = () => void;

class DatabaseService {
  private listeners: Map<EventType, Set<Listener>> = new Map();

  constructor() {
    this.initDatabase();
  }

  public subscribe(event: EventType, listener: Listener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  private notify(event: EventType) {
    this.listeners.get(event)?.forEach((cb) => cb());
    if (event !== 'all') {
      this.listeners.get('all')?.forEach((cb) => cb());
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Storage error:', err);
    }
  }

  public initDatabase(forceReset: boolean = false): void {
    if (forceReset || !localStorage.getItem(KEYS.PRODUCTS)) {
      this.setItem(KEYS.USERS, INITIAL_USERS);
      this.setItem(KEYS.CURRENT_USER_ID, INITIAL_USERS[0].id);
      this.setItem(KEYS.STORES, INITIAL_STORES);
      this.setItem(KEYS.PRODUCTS, INITIAL_PRODUCTS);
      this.setItem(KEYS.REVIEWS, INITIAL_REVIEWS);
      this.setItem(KEYS.CART, []);
      this.setItem(KEYS.ORDERS, [
        {
          id: 'ORD-2025-001',
          buyerId: 'user-buyer-1',
          buyerName: 'Siti Rahmawati',
          buyerPhone: '0812-4567-8901',
          shippingAddress: INITIAL_USERS[0].addresses[0],
          items: [
            {
              productId: 'prod-sultra-01',
              productName: 'Kain Tenun Tradisional Masalili Muna Pewarna Alami',
              productImage: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
              price: 385000,
              quantity: 1,
              weight: 450,
              storeId: 'store-sultra-1',
              storeName: 'Tenun Barakati Muna & Buton'
            }
          ],
          subtotal: 385000,
          shippingCost: 22000,
          discount: 0,
          total: 407000,
          courier: {
            code: 'jne-reg',
            name: 'JNE Express',
            service: 'Reguler (2-3 Hari)',
            cost: 22000,
            etd: '2-3 hari'
          },
          paymentMethod: {
            code: 'qris',
            name: 'QRIS Nusantara (Scan Instan)',
            type: 'qris',
            instructions: 'Sudah dibayar melalui simulasi QRIS',
            iconName: 'QrCode'
          },
          paymentStatus: 'paid',
          orderStatus: 'selesai',
          resiNumber: 'JNE-SULTRA-889921',
          history: [
            { status: 'menunggu_pembayaran', timestamp: '2025-01-20T10:00:00Z', note: 'Pesanan dibuat' },
            { status: 'diproses', timestamp: '2025-01-20T10:05:00Z', note: 'Pembayaran diverifikasi sistem' },
            { status: 'dikirim', timestamp: '2025-01-21T09:30:00Z', note: 'Paket diserahkan ke JNE Muna' },
            { status: 'selesai', timestamp: '2025-01-23T14:15:00Z', note: 'Paket diterima oleh pemesan di Kendari' }
          ],
          createdAt: '2025-01-20T10:00:00Z',
          paidAt: '2025-01-20T10:05:00Z',
          completedAt: '2025-01-23T14:15:00Z'
        }
      ]);
      this.setItem(KEYS.WISHLIST, ['prod-sultra-02', 'prod-sultra-05']);
      this.notify('all');
    }
  }

  // --- Users ---
  public getUsers(): User[] {
    const users = this.getItem<User[]>(KEYS.USERS, []);
    if (!users || users.length === 0) {
      this.setItem(KEYS.USERS, INITIAL_USERS);
      return INITIAL_USERS;
    }
    // Make sure initial users have their passwords and admin account is preserved
    let updated = false;
    INITIAL_USERS.forEach((initU) => {
      const idx = users.findIndex((u) => u.email.toLowerCase() === initU.email.toLowerCase());
      if (idx === -1) {
        users.push(initU);
        updated = true;
      } else if (!users[idx].password) {
        users[idx].password = initU.password;
        updated = true;
      }
    });
    if (updated) {
      this.setItem(KEYS.USERS, users);
    }
    return users;
  }

  public getCurrentUser(): User | null {
    const users = this.getUsers();
    const currentId = this.getItem<string>(KEYS.CURRENT_USER_ID, '');
    const found = users.find((u) => u.id === currentId);
    return found || users[0] || null;
  }

  public setCurrentUserId(id: string): void {
    this.setItem(KEYS.CURRENT_USER_ID, id);
    this.notify('users');
  }

  public saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.setItem(KEYS.USERS, users);
    this.notify('users');
  }

  // --- Stores ---
  public getStores(): Store[] {
    return this.getItem<Store[]>(KEYS.STORES, []);
  }

  public getStore(id: string): Store | undefined {
    return this.getStores().find((s) => s.id === id);
  }

  public getStoreByOwner(ownerId: string): Store | undefined {
    return this.getStores().find((s) => s.ownerId === ownerId);
  }

  public saveStore(store: Store): void {
    const stores = this.getStores();
    const index = stores.findIndex((s) => s.id === store.id);
    if (index >= 0) {
      stores[index] = store;
    } else {
      stores.push(store);
    }
    this.setItem(KEYS.STORES, stores);

    // Also update user's storeId if applicable
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === store.ownerId);
    if (userIndex >= 0) {
      users[userIndex].storeId = store.id;
      users[userIndex].role = 'seller';
      this.setItem(KEYS.USERS, users);
    }

    this.notify('stores');
    this.notify('users');
  }

  public updateStoreStatus(storeId: string, status: 'approved' | 'rejected'): void {
    const stores = this.getStores();
    const index = stores.findIndex((s) => s.id === storeId);
    if (index >= 0) {
      stores[index].status = status;
      if (status === 'approved') {
        stores[index].isVerified = true;
      }
      this.setItem(KEYS.STORES, stores);
      this.notify('stores');
    }
  }

  // --- Products ---
  public getProducts(): Product[] {
    return this.getItem<Product[]>(KEYS.PRODUCTS, []);
  }

  public getProduct(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  public saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    this.setItem(KEYS.PRODUCTS, products);
    this.notify('products');
  }

  public deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.setItem(KEYS.PRODUCTS, products);
    this.notify('products');
  }

  // --- Cart ---
  public getCart(): CartItem[] {
    return this.getItem<CartItem[]>(KEYS.CART, []);
  }

  public addToCart(productId: string, quantity: number = 1): void {
    const product = this.getProduct(productId);
    if (!product) return;

    const cart = this.getCart();
    const existing = cart.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId,
        storeId: product.storeId,
        quantity,
        selected: true,
        addedAt: new Date().toISOString()
      });
    }
    this.setItem(KEYS.CART, cart);
    this.notify('cart');
  }

  public updateCartItem(itemId: string, quantity: number, selected?: boolean): void {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter((i) => i.id !== itemId);
    } else {
      const item = cart.find((i) => i.id === itemId);
      if (item) {
        item.quantity = quantity;
        if (selected !== undefined) {
          item.selected = selected;
        }
      }
    }
    this.setItem(KEYS.CART, cart);
    this.notify('cart');
  }

  public removeCartItem(itemId: string): void {
    const cart = this.getCart().filter((i) => i.id !== itemId);
    this.setItem(KEYS.CART, cart);
    this.notify('cart');
  }

  public clearCart(): void {
    this.setItem(KEYS.CART, []);
    this.notify('cart');
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return this.getItem<Order[]>(KEYS.ORDERS, []);
  }

  public getOrder(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  }

  public saveOrder(order: Order): void {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.unshift(order);
    }
    this.setItem(KEYS.ORDERS, orders);

    // Update product stock and sold count
    const products = this.getProducts();
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        prod.sold += item.quantity;
      }
    });
    this.setItem(KEYS.PRODUCTS, products);

    // Update store sold count
    const stores = this.getStores();
    order.items.forEach((item) => {
      const store = stores.find((s) => s.id === item.storeId);
      if (store) {
        store.totalSold += item.quantity;
      }
    });
    this.setItem(KEYS.STORES, stores);

    this.notify('orders');
    this.notify('products');
    this.notify('stores');
  }

  public updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    resiNumber?: string,
    note?: string
  ): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      if (resiNumber) {
        order.resiNumber = resiNumber;
      }
      if (status === 'selesai') {
        order.completedAt = new Date().toISOString();
      }
      if (!order.history) order.history = [];
      order.history.push({
        status,
        timestamp: new Date().toISOString(),
        note: note || `Status pesanan diperbarui menjadi ${status}`
      });
      this.setItem(KEYS.ORDERS, orders);
      this.notify('orders');
    }
  }

  // --- Reviews ---
  public getReviews(productId?: string): Review[] {
    const all = this.getItem<Review[]>(KEYS.REVIEWS, []);
    return productId ? all.filter((r) => r.productId === productId) : all;
  }

  public saveReview(review: Review): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    this.setItem(KEYS.REVIEWS, reviews);

    // Recalculate product rating
    const productReviews = reviews.filter((r) => r.productId === review.productId);
    const avg =
      productReviews.reduce((sum, r) => sum + r.rating, 0) / (productReviews.length || 1);
    const products = this.getProducts();
    const prod = products.find((p) => p.id === review.productId);
    if (prod) {
      prod.rating = parseFloat(avg.toFixed(1));
      prod.reviewCount = productReviews.length;
      this.setItem(KEYS.PRODUCTS, products);
    }

    this.notify('reviews');
    this.notify('products');
  }

  // --- Wishlist ---
  public getWishlist(): string[] {
    return this.getItem<string[]>(KEYS.WISHLIST, []);
  }

  public toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    const idx = list.indexOf(productId);
    let added = false;
    if (idx >= 0) {
      list.splice(idx, 1);
      added = false;
    } else {
      list.push(productId);
      added = true;
    }
    this.setItem(KEYS.WISHLIST, list);
    this.notify('wishlist');
    return added;
  }
}

export const dbService = new DatabaseService();
