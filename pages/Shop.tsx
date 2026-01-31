import React, { useMemo } from 'react';
import { motion as motionBase } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Product } from '../types';

const motion = motionBase as any;

interface ShopProps {
  products: Product[];
}

const Shop: React.FC<ShopProps> = ({ products }) => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Extract categories dynamically from the products
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['ALL', ...Array.from(cats)];
  }, [products]);

  const [activeFilter, setActiveFilter] = React.useState('ALL');

  React.useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveFilter(categoryParam);
    } else {
      setActiveFilter('ALL');
    }
  }, [categoryParam, categories]);

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
        <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-8 md:justify-center">
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
                className="group relative w-full md:w-auto"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative overflow-hidden border border-blue-900/10 rounded-sm bg-white p-0 transition-all duration-500 hover:scale-[1.02] hover:border-blue-400 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full aspect-[3/4] object-cover md:h-[400px] md:w-auto md:aspect-auto"
                    />
                    {/* Overlay Info - Desktop */}
                    <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col items-center justify-center text-white">
                      <span className="text-[12px] tracking-[0.2em] uppercase font-bold mb-2">{product.category}</span>
                      <span className="text-[10px] tracking-widest text-blue-200">{product.name}</span>
                      <span className="mt-4 px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest">Shop Now</span>
                    </div>
                  </div>
                  {/* Mobile Info Below */}
                  <div className="md:hidden mt-2 text-center">
                    <h3 className="text-[9px] uppercase font-bold text-white truncate">{product.name}</h3>
                    <p className="text-[8px] text-blue-200">₹{product.price}</p>
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
