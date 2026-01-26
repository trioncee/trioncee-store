
import React, { useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BRAND_NAME } from '../constants';
import { CartItem } from '../types';

const motion = motionBase as any;

interface Props {
  cart: CartItem[];
  clearCart: () => void;
}

const Checkout: React.FC<Props> = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulating a "Demo Successful Order" process
    // In a real scenario, this would trigger Razorpay or a backend API
    setTimeout(() => {
      console.log("Demo Payment Successful for order:", formData);
      clearCart();
      setIsProcessing(false);
      navigate('/success');
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24"
    >
      <h1 className="text-4xl font-light tracking-tight mb-10 uppercase text-center">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Info */}
        <div className="space-y-6">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-400 border-b border-neutral-100 pb-3">Shipping Information</h2>
          <div className="space-y-4">
            <div className="relative">
              <input
                required
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-300 placeholder:uppercase placeholder:tracking-widest placeholder:text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-300 placeholder:uppercase placeholder:tracking-widest placeholder:text-xs"
              />
              <input
                required
                type="tel"
                name="phone"
                placeholder="Contact Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-300 placeholder:uppercase placeholder:tracking-widest placeholder:text-xs"
              />
            </div>
            <textarea
              required
              name="address"
              placeholder="Full Delivery Address"
              rows={3}
              value={formData.address}
              onChange={handleInputChange as any}
              className="w-full bg-transparent border-b border-neutral-200 py-4 text-sm focus:border-neutral-900 outline-none transition-all resize-none placeholder:text-neutral-300 placeholder:uppercase placeholder:tracking-widest"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-300 placeholder:uppercase placeholder:tracking-widest placeholder:text-xs"
              />
              <input
                required
                type="text"
                name="pincode"
                placeholder="Zip / Pin"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-300 placeholder:uppercase placeholder:tracking-widest placeholder:text-xs"
              />
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-neutral-50 p-6 md:p-10 h-fit rounded-sm shadow-sm">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-400 mb-6">Purchase Summary</h2>
          <div className="space-y-4 mb-6">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm border-b border-neutral-100 pb-4">
                <div className="flex flex-col">
                  <span className="font-semibold uppercase tracking-widest text-[10px]">{item.name}</span>
                  <span className="text-[9px] text-neutral-400 uppercase">Size {item.selectedSize} • Qty {item.quantity}</span>
                </div>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between text-xs text-neutral-400 uppercase tracking-widest pt-4">
              <span>Standard Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-xl uppercase tracking-tighter pt-4 border-t border-neutral-200">
              <span>Grand Total</span>
              <span>₹{total}</span>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-6 text-[10px] font-bold uppercase tracking-[0.5em] transition-all rounded-sm shadow-xl ${
              isProcessing ? 'bg-neutral-400 cursor-not-allowed' : 'bg-neutral-900 text-white hover:bg-black active:scale-[0.98]'
            }`}
          >
            {isProcessing ? 'Verifying Transaction...' : 'Complete Purchase'}
          </button>
          
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-[9px] text-neutral-400 text-center uppercase tracking-[0.3em]">
              Secured Demo Checkout for {BRAND_NAME}
            </p>
            <div className="flex gap-4 opacity-30 grayscale contrast-150">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-3" alt="Paypal" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-3" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-3" alt="Mastercard" />
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default Checkout;
