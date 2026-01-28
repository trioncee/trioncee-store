
import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';

const motion = motionBase as any;

interface ShopProps {
  products: Product[];
}

const FILTERS = ['ALL', 'hoodies', 'TShirts', 'Oversized', 'Sweat Wear'];

const Shop: React.FC<ShopProps> = ({ products }) => {
  const [activeFilter, setActiveFilter] = React.useState('ALL');

  const filteredProducts = products.filter(product => {
    if (activeFilter === 'ALL') return true;
    const cat = product.category.toLowerCase();

    if (activeFilter === 'TShirts') {
      // enhanced matching for T-Shirts including current data types
      return cat.includes('t-shirt') ||
        cat.includes('regular fit') ||
        cat.includes('boxy') ||
        cat.includes('premium') ||
        cat.includes('athletic') ||
        cat.includes('half hands') ||
        cat.includes('full hands');
    }

    return cat.includes(activeFilter.toLowerCase());
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-gradient-to-b from-[#1B4079] to-[#112d5a] pt-32 pb-24 px-6 md:px-12"
    >
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-16 text-center">
          <span className="text-[10px] uppercase tracking-[0.6em] text-blue-200 mb-4 block">Collection 2026</span>
          <h1 className="text-5xl font-light tracking-tight mb-8 uppercase text-white">The Essential Series</h1>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border rounded-full ${activeFilter === filter
                  ? 'bg-white text-blue-900 border-white'
                  : 'bg-transparent text-blue-200 border-blue-400/30 hover:border-white hover:text-white'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="w-12 h-[1px] bg-blue-400/30 mx-auto"></div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to={`/product/${product.id}`} className="group block">
                <div className="aspect-[3/4] bg-white overflow-hidden mb-8 relative border border-blue-900/10 flex items-center justify-center rounded-sm">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                    />
                  ) : (
                    <ShoppingBag size={48} className="text-neutral-300" />
                  )}
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase text-white">{product.name}</h3>
                  <div className="flex justify-center items-center gap-4 text-[10px] text-blue-200 uppercase tracking-widest">
                    <span>{product.category}</span>
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    <span className="font-bold text-white">₹{product.price}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Shop;
