
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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const backendUrl = import.meta.env.VITE_BACKEND_BASEURL;
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey || razorpayKey === 'YOUR_RAZORPAY_KEY_ID_HERE') {
      alert("Razorpay Key ID is not configured. Please check your .env file.");
      setIsProcessing(false);
      return;
    }

    try {
      // Prepare notes data
      const itemNames = cart.map(item => item.name).join(', ');
      const sizes = cart.map(item => item.selectedSize).join(', ');
      const colors = cart.map(item => item.selectedColor).join(', ');

      // 1. Create Order
      const orderResponse = await fetch(`${backendUrl}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          notes: {
            item_name: itemNames,
            size: sizes,
            colour: colors,
            address: formData.address,
            pincode: formData.pincode
          }
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: BRAND_NAME,
        description: "Purchase from Trioncee Fashion",
        order_id: orderData.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#1a1a1a"
        },
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyResponse = await fetch(`${backendUrl}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.status === 'success') {
              // 4. Success
              clearCart();
              navigate('/success');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (verifyError) {
            console.error('Verification Error:', verifyError);
            alert('Payment verification failed due to a network error.');
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();

    } catch (error) {
      console.error('Order Creation Error:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24"
    >
      <h1 className="text-4xl font-light tracking-tight mb-10 uppercase text-center">Checkout</h1>

      <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
            className={`w-full py-6 text-[10px] font-bold uppercase tracking-[0.5em] transition-all rounded-sm shadow-xl ${isProcessing ? 'bg-neutral-400 cursor-not-allowed' : 'bg-neutral-900 text-white hover:bg-black active:scale-[0.98]'
              }`}
          >
            {isProcessing ? 'Processing Payment...' : 'Complete Purchase'}
          </button>

          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-[9px] text-neutral-400 text-center uppercase tracking-[0.3em]">
              Secured Checkout by Razorpay
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
