import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFAB from './components/WhatsAppFAB';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import CombosPage from './pages/CombosPage';
import FAQPage from './pages/FAQPage';
import BlogListingPage from './pages/BlogListingPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import ReturnsPolicyPage from './pages/ReturnsPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import PageTransition from './components/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/shop" element={<PageTransition><ShopPage /></PageTransition>} />
        <Route path="/combos" element={<PageTransition><CombosPage /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQPage /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><BlogListingPage /></PageTransition>} />
        <Route path="/blog/:id" element={<PageTransition><BlogPostDetailPage /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/testimonials" element={<PageTransition><TestimonialsPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/shipping" element={<PageTransition><ShippingPolicyPage /></PageTransition>} />
        <Route path="/returns" element={<PageTransition><ReturnsPolicyPage /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPolicyPage /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
        <Route path="*" element={
          <PageTransition>
            <div className="min-h-screen flex items-center justify-center text-center px-4">
              <div>
                <p className="text-sage font-medium text-sm uppercase tracking-widest mb-2">404</p>
                <h1 className="font-serif text-5xl text-charcoal mb-3">Page Not Found</h1>
                <p className="text-charcoal-light mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="bg-sage text-white px-6 py-3 rounded-2xl font-medium hover:bg-sage-dark transition-colors">
                  Back to Home
                </a>
              </div>
            </div>
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
          <WhatsAppFAB />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}


