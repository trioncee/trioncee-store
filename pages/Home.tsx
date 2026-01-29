import React from 'react';
import { motion as motionBase, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, ArrowRight, User, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';


const motion = motionBase as any;

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 z-10">
        {/* Mobile Image */}
        <div className="md:hidden absolute inset-0">
          <img
            src="/home-images/Final_Mobile.png"
            alt="Hero Mobile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Desktop Image */}
        <div className="hidden md:block absolute inset-0">
          <img
            src="/home-images/Final_Desktop.png"
            alt="Hero Desktop"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="relative z-20 w-full max-w-[1600px] flex flex-col items-center h-full mx-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="absolute bottom-14 flex flex-col items-center text-center"
        >
          <Link to="/shop" className="group relative inline-flex items-center gap-4 px-6 py-2 bg-white border border-white text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-neutral-100 hover:text-blue-900 hover:border-white transition-all duration-300 rounded-full shadow-none active:scale-95 text-blue-900">
            Shop T-Shirts
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const CollectionPreview = ({ products }: { products: Product[] }) => {
  // Identify generated products by checking if they are NOT in the manually defined list constants (heuristic: ID format)
  // Generated IDs are like "Category-Collection" (e.g. "Hoodies-1")
  // Let's filter for those.
  const collectionProducts = products.filter(p => p.id.includes('-') && (p.category === 'Hoodies' || p.category === 'Oversized' || p.category === 'Printed' || p.category === 'Sweatwear'));

  // Limit to show a nice variety
  const displayProducts = collectionProducts.slice(0, 6);

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-16 px-6 md:px-12 bg-transparent">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.7em] text-blue-200 mb-4 block">New Drops</span>
          <h2 className="text-3xl font-light tracking-tight uppercase text-white">Latest Collections</h2>
          <div className="w-12 h-[1px] bg-blue-400/30 mx-auto mt-6"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {displayProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
            >
              <Link to={`/product/${product.id}`} className="group block">
                <div className="w-[280px] aspect-[3/4] bg-white relative overflow-hidden rounded-sm border border-blue-900/10">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="text-neutral-300" /></div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-blue-900">{product.category}</span>
                    <ArrowRight size={14} className="text-blue-900" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/shop" className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-200 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
            View Complete Series
          </Link>
        </div>
      </div>
    </section>
  );
};

const FeaturedProducts = ({ products }: { products: Product[] }) => (
  <section className="py-16 md:py-24 px-6 md:px-12 bg-transparent">
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div className="max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.7em] text-blue-200 mb-4 block">New Arrivals</span>
        </div>
        <Link to="/shop" className="group flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.5em] hover:opacity-70 transition-all border-b border-blue-400/30 pb-2 text-white">
          View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
        {products.filter(p => !p.id.includes('-')).slice(0, 3).map((product, idx) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 1 }}>
            <Link to={`/product/${product.id}`} className="group block">
              <div className="aspect-[4/5] bg-white overflow-hidden mb-6 relative rounded-sm shadow-sm border border-blue-900/10 flex items-center justify-center">
                {product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-12 group-hover:scale-110 transition-transform duration-[2s] ease-out" />
                ) : (
                  <ShoppingBag size={48} className="text-neutral-300" />
                )}
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-[12px] font-bold tracking-[0.3em] uppercase text-white">{product.name}</h3>
                <div className="flex items-center justify-center md:justify-start gap-5 text-[10px] text-blue-200 uppercase tracking-[0.4em] font-medium">
                  <span>{product.category}</span><span className="w-1 h-1 bg-blue-400 rounded-full"></span><span className="text-white font-bold">₹{product.price}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const TEAM_MEMBERS = [

  {
    name: "Ravindra",
    role: "Founder",
    image: ""
  },
  {
    name: "Munna",
    role: "Founder",
    image: ""
  },
  {
    name: "Naveen",
    role: "Founder",
    image: ""
  },
  {
    name: "Sagar",
    role: "Founder",
    image: ""
  },
  {
    name: "Kalyan",
    role: "Founder",
    image: ""
  }
];

const TeamSection = () => (
  <section className="py-10 md:py-14 px-6 md:px-12 bg-transparent text-white">
    <div className="max-w-[1400px] mx-auto">
      <div className="text-center mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-blue-200 mb-4 block">Our Team</span>
        <h2 className="text-3xl font-light tracking-tight uppercase text-white">People Behind Trioncee</h2>
        <div className="w-12 h-[1px] bg-blue-400/30 mx-auto mt-6"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
        {TEAM_MEMBERS.map((member, idx) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            className="group flex flex-col items-center text-center"
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4 overflow-hidden rounded-full bg-white/10 shadow-sm transition-all duration-500 group-hover:shadow-lg border border-white/20 flex items-center justify-center">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-110"
                />
              ) : (
                <User size={32} className="text-blue-200/50" />
              )}
            </div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-0.5">{member.name}</h3>
            <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-blue-200">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Home = ({ products }: { products: Product[] }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full min-h-screen bg-gradient-to-b from-[#1B4079] to-[#112d5a]"
  >
    <HeroSection />
    <CollectionPreview products={products} />
    <FeaturedProducts products={products} />
    <TeamSection />
  </motion.div>
);

export default Home;