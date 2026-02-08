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

/**
 * Ensure Razorpay SDK is loaded
 */
const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout: React.FC<Props> = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (formData.phone.length < 10) newErrors.phone = 'Invalid phone number';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    const backendUrl = import.meta.env.VITE_BACKEND_BASEURL;
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!backendUrl || !razorpayKey) {
      alert('Payment configuration missing');
      setIsProcessing(false);
      return;
    }

    try {
      /** 1️⃣ Load Razorpay SDK */
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        alert('Failed to load Razorpay. Please try again.');
        setIsProcessing(false);
        return;
      }

      /** 2️⃣ Prepare notes */
      const itemNames = cart.map(i => i.name).join(', ');
      const sizes = cart.map(i => i.selectedSize).join(', ');
      const colours = cart.map(i => i.selectedColor).join(', ');

      /** 3️⃣ Create order */
      const orderResponse = await fetch(`${backendUrl}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          notes: {
            item_name: itemNames,
            size: sizes,
            colour: colours,
            address: `${formData.name} - ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
            pincode: formData.pincode
          }
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Order creation failed');
      }

      const orderData = await orderResponse.json();
      console.log('📦 Order Created:', orderData);

      /** 4️⃣ Open Razorpay */
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: BRAND_NAME,
        description: 'Purchase from Trioncee Fashion',
        order_id: orderData.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: '#1a1a1a' },

        handler: async function (response: any) {
          console.log('✅ Razorpay Payment Success:', response);

          try {
            const verificationPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shipping_details: {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: parseInt(formData.pincode), // Ensure number
                verified_total: total,
                items: cart.map(item => ({
                  name: item.name,
                  quantity: item.quantity,
                  selling_price: item.price
                }))
              }
            };

            console.log('🔄 Verifying Payment with Backend...', JSON.stringify(verificationPayload, null, 2));

            const verifyRes = await fetch(`${backendUrl}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(verificationPayload)
            });

            const verifyData = await verifyRes.json();
            console.log('📩 Verification Response:', verifyData);

            if (verifyData.status === 'success') {
              console.log('🎉 Payment Verified Successfully!');
              clearCart();
              setIsProcessing(false);
              navigate('/success');
            } else {
              console.error('❌ Verification Failed:', verifyData);
              alert('Payment verification failed');
              setIsProcessing(false);
            }
          } catch (err) {
            console.error('🚨 Verification Error:', err);
            alert('Verification failed');
            setIsProcessing(false);
          }
        },

        modal: {
          ondismiss: () => setIsProcessing(false)
        }
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', (res: any) => {
        alert(res.error.description);
        setIsProcessing(false);
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Failed to initiate payment');
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
      <h1 className="text-4xl font-light tracking-tight mb-10 uppercase text-center">
        Checkout
      </h1>

      <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* SHIPPING */}
        <div className="space-y-4">
          {['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'].map((field) => (
            <div key={field} className="group">
              <div className="relative">
                <input
                  name={field}
                  placeholder=" "
                  value={(formData as any)[field]}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (errors[field as keyof typeof errors]) {
                      setErrors({ ...errors, [field]: '' });
                    }
                  }}
                  className={`input peer ${errors[field as keyof typeof errors] ? '!border-red-500' : ''}`}
                />
                <label className="absolute left-6 top-3 text-[10px] uppercase tracking-widest text-neutral-400 transition-all 
                                  peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-neutral-400 
                                  peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-neutral-600 peer-focus:opacity-100
                                  peer-[&:not(:placeholder-shown)]:opacity-0 peer-[&:not(:placeholder-shown)]:invisible pointer-events-none">
                  {field === 'pincode' ? 'Pin Code' : field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-red-500">*</span>
                </label>
              </div>
              {errors[field as keyof typeof errors] && (
                <span className="text-[10px] text-red-500 font-medium tracking-wide mt-1 block pl-4 uppercase">
                  {errors[field as keyof typeof errors]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="bg-neutral-50 p-8 rounded shadow">
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between mb-2 text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div className="flex justify-between font-bold text-lg mt-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            disabled={isProcessing}
            className="w-full mt-8 py-4 bg-black text-white uppercase tracking-widest disabled:bg-gray-400"
          >
            {isProcessing ? 'Processing...' : 'Complete Purchase'}
          </button>
        </div>

      </form>
    </motion.div>
  );
};

export default Checkout;
