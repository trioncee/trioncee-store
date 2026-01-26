
import React, { useEffect, useState } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';

const motion = motionBase as any;

// Confetti colors
const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA', '#FF9F43', '#6C5CE7'];

// Generate random confetti pieces
const generateConfetti = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 0.5,
    rotation: Math.random() * 360,
    size: Math.random() * 10 + 6,
    duration: Math.random() * 2 + 2,
  }));
};

const Confetti = () => {
  const [confetti] = useState(() => generateConfetti(60));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: -20,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: '110vh',
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: piece.size,
            height: piece.size * 0.6,
            backgroundColor: piece.color,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
};

const Success = () => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto px-4 py-32 text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle size={40} strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-light tracking-tight mb-4 uppercase"
        >
          Order Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-neutral-500 mb-2"
        >
          Your order has been placed successfully.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-neutral-400 mb-12 max-w-sm mx-auto"
        >
          You will receive order details and tracking information via WhatsApp or Email shortly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/shop" className="px-12 py-4 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Success;
