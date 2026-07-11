import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER } from '../config';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Combos', to: '/combos' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-ivory/90 backdrop-blur-md border-b border-ivory-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="InbaNaturals home">
            <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center shadow-sm group-hover:bg-sage-dark transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 2 C5 2, 2 5.5, 2 9 C2 12.5, 5 16, 9 16 C13 16, 16 12.5, 16 9 C14 9, 9 13, 6 8 C8 6, 13 7, 16 9 C16 5.5, 13 2, 9 2Z" fill="#FAF6EE" fillOpacity="0.9"/>
              </svg>
            </div>
            <span className="font-serif text-xl font-bold text-charcoal tracking-tight">
              Inba<span className="text-sage">Naturals</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-sage border-b-2 border-sage pb-0.5'
                      : 'text-charcoal-light hover:text-charcoal'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-sage text-sage hover:bg-sage hover:text-white transition-all duration-200"
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>

            {/* Cart */}
            <button
              className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-ivory-dark transition-colors cursor-pointer"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} className="text-charcoal" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-ivory-dark transition-colors cursor-pointer"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} className="text-charcoal" />
            </button>
          </div>
        </div>

        {/* Mobile slide-in drawer menu (portal layout style) */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden animate-fade-in" role="dialog" aria-modal="true">
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Side panel */}
            <div className="fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col p-6 animate-slide-in overflow-y-auto">
              {/* Top Row with brand & close action */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-ivory-dark">
                <span className="font-serif text-lg font-bold text-charcoal">
                  Inba<span className="text-sage">Naturals</span>
                </span>
                <div className="flex items-center gap-2">
                  {/* Cart icon in drawer */}
                  <button
                    className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-ivory transition-colors cursor-pointer"
                    aria-label="Shopping cart"
                  >
                    <ShoppingCart size={18} className="text-charcoal" />
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-terracotta text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none">
                      {cartCount}
                    </span>
                  </button>
                  {/* Close button */}
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-9 h-9 rounded-lg hover:bg-ivory flex items-center justify-center text-charcoal transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 space-y-2">
                {navLinks.map(({ label, to }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-sage/10 text-sage'
                          : 'text-charcoal hover:bg-ivory-dark'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>

              {/* Drawer Footer info */}
              <div className="mt-auto pt-6 border-t border-ivory-dark space-y-4">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-sage hover:bg-sage-dark text-white rounded-2xl text-sm font-semibold transition-all duration-300"
                >
                  <MessageCircle size={16} />
                  Chat on WhatsApp
                </a>
                <p className="text-[10px] text-center text-charcoal-light">
                  © {new Date().getFullYear()} InbaNaturals. Handcrafted with 🌿
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
