import React, { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

// Global Components
import FloatingCartButton from '@/components/FloatingCartButton';
import FloatingCartPanel from '@/components/FloatingCartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';

// Public Pages
import HomePage from '@/pages/HomePage';
import QuienesSomosPage from '@/pages/QuienesSomosPage';
import VentaPage from '@/pages/VentaPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import ReproductoresPage from '@/pages/ReproductoresPage';
import ReproductorDetailPage from '@/pages/ReproductorDetailPage';
import VientresPage from '@/pages/VientresPage';
import VientrDetailPage from '@/pages/VientrDetailPage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import FAQPage from '@/pages/FAQPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import AccountPage from '@/pages/AccountPage';
import LegalPage from '@/pages/LegalPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProfile from '@/pages/admin/AdminProfile';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminVientres from '@/pages/admin/AdminVientres';
import AdminReproductores from '@/pages/admin/AdminReproductores';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminBlogEditor from '@/pages/admin/AdminBlogEditor';
import AdminCategorias from '@/pages/admin/AdminCategorias';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/quienes-somos" element={<QuienesSomosPage />} />
            
            {/* Reproductores Routes */}
            <Route path="/reproductores" element={<ReproductoresPage />} />
            <Route path="/reproductor/:id" element={<ReproductorDetailPage />} />
            
            {/* Vientres Routes */}
            <Route path="/vientres" element={<VientresPage />} />
            <Route path="/vientres/:id" element={<VientrDetailPage />} />
            
            {/* Products/Venta Routes */}
            <Route path="/venta" element={<VentaPage />} />
            <Route path="/venta/:id" element={<ProductDetailPage />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            
            {/* Info Pages */}
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/legal" element={<LegalPage />} />
            
            {/* Shopping Cart Routes */}
            <Route path="/carrito" element={<CartPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute requireAuth={true}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* User Account - Protected (requires authentication) */}
            <Route 
              path="/cuenta" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <AccountPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes - Protected (requires admin role) */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/perfil" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/pedidos" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminOrders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/ventas" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/vientres" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminVientres />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reproductores" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminReproductores />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/categorias" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminCategorias />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blog" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminBlog />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blog/nuevo" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminBlogEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blog/:id/editar" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminBlogEditor />
                </ProtectedRoute>
              } 
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
          {/* Global UI Components */}
          <FloatingCartButton onClick={() => setIsCartOpen(true)} />
          <FloatingCartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <WhatsAppButton />
          
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
