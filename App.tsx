import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as motionBase } from 'framer-motion';
import { ShoppingCart, Menu, X, Instagram } from 'lucide-react';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { BRAND_NAME } from './constants';
import { CartItem, Product } from './types';
import { PRODUCTS } from './constants';
import { generateProductsFromCollections } from './utils/productAdapter';

const motion = motionBase as any;

const Logo = ({ className = "h-12" }: { className?: string }) => (
  <div className={`flex items-center ${className}`}>
    <img
      src="/home-images/Final_logo.png"
      alt="TRIONCEE FASHION"
      className="h-full w-auto object-contain"
    />
  </div>
);

const Navigation = ({ cartCount }: { cartCount: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled
      ? 'bg-white/40 backdrop-blur-2xl border-b border-neutral-100/50 h-16'
      : 'bg-transparent h-24'
      }`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
        <Link to="/" className="hover:opacity-70 transition-all flex-shrink-0">
          <Logo className={scrolled ? "h-14" : "h-20"} />
        </Link>

        <div className={`hidden md:flex items-center gap-10 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors duration-500 ${scrolled ? 'text-neutral-800' : 'text-neutral-700'
          }`}>
          <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          <Link to="/contact" className="hover:text-black transition-colors">Contact</Link>
          <Link to="/cart" className="relative text-neutral-900 group pl-4">
            <ShoppingCart size={20} strokeWidth={1.2} className="group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-neutral-900 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-neutral-900">
            <ShoppingCart size={22} strokeWidth={1.2} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-neutral-900 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsOpen(true)} className="p-2 text-neutral-900">
            <Menu size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <Logo className="h-8" />
                <button onClick={() => setIsOpen(false)}><X size={24} /></button>
              </div>
              <div className="flex flex-col gap-10 text-3xl font-light tracking-tight">
                <Link to="/shop">Shop Collection</Link>
                <Link to="/">Our Story</Link>
                <Link to="/">Contact Us</Link>
                <Link to="/cart">My Cart ({cartCount})</Link>
              </div>
              <div className="mt-auto flex gap-6 opacity-40">
                <Instagram size={20} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="py-6 px-6 border-t border-blue-400/30 bg-gradient-to-b from-[#1B4079] to-[#112d5a]">
    <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
      <Logo className="h-10 mb-2 invert" />
      <p className="text-blue-200 font-light text-xs uppercase tracking-[0.4em] mb-3">Built for Everyday Style</p>

      {/* Footer Links - REMOVED per user request */}

      <a href="#" className="p-2 border border-blue-400/30 rounded-full hover:bg-white/10 transition-all hover:scale-110 mb-3 text-white">
        <Instagram size={16} />
      </a>

      <p className="text-[8px] text-blue-300 font-light tracking-[0.4em] uppercase">
        &copy; {new Date().getFullYear()} {BRAND_NAME} Studios. All rights reserved.
      </p>
    </div>
  </footer>
);

const App = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // ...

  useEffect(() => {
    const savedCart = localStorage.getItem('iconic_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    // Combine static products and generated products
    const generatedProducts = generateProductsFromCollections();
    // Prioritize generated products so they appear in Home "New Arrivals"
    const allProducts = [...generatedProducts, ...PRODUCTS];

    // We prefer fresh generation + constants over localStorage for products to ensure new folders appear
    // But if we want to support admin updates we need to be careful.
    // For now, let's prioritize the file system + constants.

    setProducts(allProducts);
    localStorage.setItem('iconic_products', JSON.stringify(allProducts));
  }, []);

  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('iconic_products', JSON.stringify(newProducts));
  };

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('iconic_cart', JSON.stringify(newCart));
  };

  const addToCart = (item: CartItem) => {
    const existingIndex = cart.findIndex(
      (c) => c.id === item.id && c.selectedSize === item.selectedSize && c.selectedColor === item.selectedColor
    );

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += item.quantity;
      updateCart(newCart);
    } else {
      updateCart([...cart, item]);
    }
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const clearCart = () => updateCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col text-neutral-900 selection:bg-neutral-900 selection:text-white">
        <Navigation cartCount={cartCount} />

        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home products={products} />} />
              <Route path="/shop" element={<Shop products={products} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin products={products} updateProducts={updateProducts} />} />
              <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
              <Route path="/cart" element={<Cart cart={cart} updateCart={updateCart} removeFromCart={removeFromCart} />} />
              <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
              <Route path="/success" element={<Success />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;