
import React from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

// Casting motion to any to bypass environment-specific type resolution issues with framer-motion props
const motion = motionBase as any;

interface Props {
  cart: CartItem[];
  updateCart: (cart: CartItem[]) => void;
  removeFromCart: (index: number) => void;
}

const Cart: React.FC<Props> = ({ cart, updateCart, removeFromCart }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const changeQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    const newQty = newCart[index].quantity + delta;
    if (newQty < 1) return;
    newCart[index].quantity = newQty;
    updateCart(newCart);
  };

  if (cart.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-32 text-center"
      >
        <ShoppingCart className="mx-auto mb-6 opacity-20" size={64} strokeWidth={1} />
        <h1 className="text-3xl font-light mb-4">Your cart is empty.</h1>
        <p className="text-neutral-500 mb-12">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="px-12 py-4 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors">
          Browse Collection
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 md:px-8 py-16"
    >
      <h1 className="text-4xl font-light tracking-tight mb-16 uppercase">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* List */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence>
            {cart.map((item, idx) => (
              <motion.div 
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-6 pb-8 border-b border-neutral-100"
              >
                <div className="w-24 h-32 md:w-32 md:h-40 bg-neutral-100 flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium uppercase tracking-widest">{item.name}</h3>
                      <button onClick={() => removeFromCart(idx)} className="text-neutral-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wider">Color: {item.selectedColor} | Size: {item.selectedSize}</p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-neutral-200">
                      <button onClick={() => changeQuantity(idx, -1)} className="p-2 hover:bg-neutral-50"><Minus size={14} /></button>
                      <span className="w-10 text-center text-xs font-medium">{item.quantity}</span>
                      <button onClick={() => changeQuantity(idx, 1)} className="p-2 hover:bg-neutral-50"><Plus size={14} /></button>
                    </div>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="bg-neutral-50 p-8 h-fit">
          <h2 className="text-xl font-medium uppercase tracking-widest mb-8">Order Summary</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t border-neutral-200 pt-4 flex justify-between font-medium">
              <span>Estimated Total</span>
              <span>₹{subtotal}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full py-5 bg-neutral-900 text-white text-xs font-medium uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            Checkout <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
