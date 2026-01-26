
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Truck, RefreshCw, ShoppingBag } from 'lucide-react';
import { CartItem, Product } from '../types';

const motion = motionBase as any;

interface Props {
  products: Product[];
  addToCart: (item: CartItem) => void;
}

const ProductDetail: React.FC<Props> = ({ products, addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [mainImage, setMainImage] = useState(product?.images[0] || '');

  if (!product) {
    return <div className="p-20 text-center font-light tracking-widest uppercase">Product not found.</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select both a color and a size.");
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity: 1
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-20"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] opacity-40 hover:opacity-100 mb-12 transition-all"
      >
        <ArrowLeft size={14} /> Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Gallery Section */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
          {/* Main Display */}
          <div className="flex-grow aspect-[4/5] bg-neutral-100 overflow-hidden order-1 md:order-2 border border-neutral-200 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {mainImage ? (
                <motion.img
                  key={mainImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <ShoppingBag size={64} className="text-neutral-300" />
              )}
            </AnimatePresence>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex md:flex-col gap-4 order-2 md:order-1">
            {product.images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => img && setMainImage(img)}
                className={`w-20 aspect-square md:w-24 bg-neutral-100 overflow-hidden border transition-all flex items-center justify-center ${mainImage === img ? 'border-neutral-900' : 'border-neutral-200 opacity-60 hover:opacity-100'}`}
              >
                {img ? (
                  <img src={img} className="w-full h-full object-cover" alt={`Angle ${idx + 1}`} />
                ) : (
                  <ShoppingBag size={20} className="text-neutral-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:col-span-5 flex flex-col pt-4">
          <div className="mb-10">
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-neutral-400 mb-2 block">{product.category}</span>
            <h1 className="text-4xl font-light tracking-tight mb-4 uppercase">{product.name}</h1>
            <p className="text-2xl font-medium tracking-tight">₹{product.price}</p>
          </div>

          <div className="space-y-10 border-t border-neutral-100 pt-10">
            {/* Color Selector */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-4">Color: <span className="text-neutral-900 font-bold">{selectedColor || 'Choose One'}</span></p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-5 py-2.5 text-[10px] uppercase tracking-widest border transition-all duration-300 ${selectedColor === color
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-4">Size: <span className="text-neutral-900 font-bold">{selectedSize || 'Select Size'}</span></p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 flex items-center justify-center text-[10px] border transition-all duration-300 ${selectedSize === size
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full py-5 text-[10px] font-bold uppercase tracking-[0.4em] transition-all relative overflow-hidden rounded-sm ${isAdded ? 'bg-green-600 text-white shadow-lg' : 'bg-neutral-900 text-white hover:bg-black'
                  }`}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.span
                      key="added"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                    >
                      Added Successfully
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                    >
                      Add to Shopping Bag
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Description & Static Info */}
            <div className="space-y-6">
              <p className="text-neutral-500 font-light text-sm leading-relaxed">{product.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-50">
                <div className="flex items-center gap-4 text-[10px] text-neutral-400 uppercase tracking-widest font-medium">
                  <div className="p-2 bg-neutral-50 rounded-full"><Truck size={14} /></div>
                  Complementary Shipping
                </div>
                <div className="flex items-center gap-4 text-[10px] text-neutral-400 uppercase tracking-widest font-medium">
                  <div className="p-2 bg-neutral-50 rounded-full"><RefreshCw size={14} /></div>
                  Seamless Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
