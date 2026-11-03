/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryGrid } from './components/home/CategoryGrid';
import { RegionalSpotlight } from './components/home/RegionalSpotlight';
import { FeaturedStores } from './components/home/FeaturedStores';
import { ProductSection } from './components/home/ProductSection';
import { CatalogPage } from './components/catalog/CatalogPage';
import { OrderHistoryPage } from './components/orders/OrderHistoryPage';
import { WishlistPage } from './components/catalog/WishlistPage';
import { StoreDetailPage } from './components/store/StoreDetailPage';
import { SellerCenter } from './components/seller/SellerCenter';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProfilePage } from './components/profile/ProfilePage';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { RegisterStoreModal } from './components/seller/RegisterStoreModal';
import { AuthModal } from './components/auth/AuthModal';
import { BuyerLoginPage } from './components/auth/BuyerLoginPage';
import { SellerLoginPage } from './components/auth/SellerLoginPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { SupabaseRlsModal } from './components/modals/SupabaseRlsModal';
import { ChatModal } from './components/common/ChatModal';
import { ToastContainer } from './components/common/ToastContainer';
import {
  Home,
  Grid,
  Heart,
  Package,
  User,
  Store,
  ShieldCheck
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    wishlist,
    orders,
    cart,
    isSupabaseModalOpen,
    setIsSupabaseModalOpen
  } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'selesai' && o.orderStatus !== 'dibatalkan'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 pb-16 md:pb-0">
      {/* Navbar */}
      <Navbar />

      {/* Main View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroBanner />
            <CategoryGrid />
            <RegionalSpotlight />
            <FeaturedStores />
            <ProductSection />
          </>
        )}

        {currentView === 'catalog' && <CatalogPage />}
        {currentView === 'orders' && <OrderHistoryPage />}
        {currentView === 'wishlist' && <WishlistPage />}
        {currentView === 'store-detail' && <StoreDetailPage />}
        {currentView === 'seller-center' && <SellerCenter />}
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'profile' && <ProfilePage />}
        {currentView === 'login-buyer' && <BuyerLoginPage />}
        {currentView === 'login-seller' && <SellerLoginPage />}
        {currentView === 'login-admin' && <AdminLoginPage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <RegisterStoreModal />
      <AuthModal />
      <SupabaseRlsModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
      <ChatModal />
      <ToastContainer />

      {/* Mobile Bottom Navigation Bar (Fixed) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center p-1 rounded-xl transition ${
            currentView === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Beranda</span>
        </button>

        <button
          onClick={() => setCurrentView('catalog')}
          className={`flex flex-col items-center p-1 rounded-xl transition ${
            currentView === 'catalog' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Produk</span>
        </button>

        <button
          onClick={() => setCurrentView('wishlist')}
          className={`flex flex-col items-center p-1 rounded-xl transition relative ${
            currentView === 'wishlist' ? 'text-rose-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute top-0 right-1 bg-rose-600 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Favorit</span>
        </button>

        <button
          onClick={() => setCurrentView('orders')}
          className={`flex flex-col items-center p-1 rounded-xl transition relative ${
            currentView === 'orders' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Package className="w-5 h-5" />
          {activeOrdersCount > 0 && (
            <span className="absolute top-0 right-1 bg-amber-500 text-slate-950 text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {activeOrdersCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Pesanan</span>
        </button>

        <button
          onClick={() => setCurrentView('profile')}
          className={`flex flex-col items-center p-1 rounded-xl transition ${
            currentView === 'profile' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profil</span>
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
