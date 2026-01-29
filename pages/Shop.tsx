import React, { useMemo } from 'react';
import { motion as motionBase } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Product } from '../types';

const motion = motionBase as any;

interface ShopProps {
  products: Product[];
}

const Shop: React.FC<ShopProps> = ({ products }) => {
  // Extract categories dynamically from the products
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['ALL', ...Array.from(cats)];
  }, [products]);

  const [activeFilter, setActiveFilter] = React.useState('ALL');

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'ALL') return products;
    return products.filter(p => p.category === activeFilter);
  }, [products, activeFilter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-gradient-to-b from-[#1B4079] to-[#112d5a] pt-32 pb-24 px-6 md:px-12"
    >
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-12 text-center">
          <span className="text-[10px] uppercase tracking-[0.6em] text-blue-200 mb-4 block">Collection 2026</span>
          <h1 className="text-5xl font-light tracking-tight mb-8 uppercase text-white">The Essential Series</h1>

          {/* Dynamic Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map(filter => (
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

        {/* Flexible Layout for Collections */}
        <div className="flex flex-wrap gap-8 justify-center">
          {filteredProducts.length === 0 ? (
            <div className="text-white text-center py-20 tracking-widest uppercase">No items found</div>
          ) : (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="group relative"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative overflow-hidden border border-blue-900/10 rounded-sm bg-white p-2 transition-transform duration-500 hover:scale-[1.02]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-[400px] w-auto object-contain max-w-[90vw] md:max-w-[400px]"
                    />
                    {/* Overlay Info */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                      <span className="text-[12px] tracking-[0.2em] uppercase font-bold mb-2">{product.category}</span>
                      <span className="text-[10px] tracking-widest text-blue-200">{product.name}</span>
                      <span className="mt-4 px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest">Shop Now</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Shop;
