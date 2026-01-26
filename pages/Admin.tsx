import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';

interface AdminProps {
    products: Product[];
    updateProducts: (products: Product[]) => void;
}

const Admin: React.FC<AdminProps> = ({ products, updateProducts }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Login Handler
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin@123') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid Password');
        }
    };

    // CRUD Operations
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const updated = products.filter(p => p.id !== id);
            updateProducts(updated);
        }
    };

    const handleSave = (product: Product) => {
        if (isAdding) {
            updateProducts([...products, product]);
            setIsAdding(false);
        } else {
            const updated = products.map(p => p.id === product.id ? product : p);
            updateProducts(updated);
            setEditingProduct(null);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-neutral-50 px-6">
                <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
                    <h1 className="text-xl font-bold uppercase tracking-widest text-center mb-6">Admin Login</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full border-b border-neutral-300 py-2 mb-6 focus:outline-none focus:border-black transition-colors"
                    />
                    <button type="submit" className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800">
                        Access Dashboard
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.6em] text-neutral-400 mb-2 block">Dashboard</span>
                    <h1 className="text-3xl font-light tracking-tight uppercase">Product Management</h1>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-800 transition-colors"
                >
                    <Plus size={14} /> Add Product
                </button>
            </div>

            {(editingProduct || isAdding) && (
                <ProductForm
                    product={editingProduct || emptyProduct}
                    onSave={handleSave}
                    onCancel={() => {
                        setEditingProduct(null);
                        setIsAdding(false);
                    }}
                />
            )}

            <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-6 p-4 bg-white border border-neutral-100 rounded-lg hover:shadow-md transition-shadow"
                    >
                        <div className="w-16 h-20 bg-neutral-100 flex-shrink-0">
                            {product.images[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />}
                        </div>

                        <div className="flex-grow min-w-0">
                            <h3 className="text-sm font-bold uppercase tracking-wide truncate">{product.name}</h3>
                            <p className="text-xs text-neutral-400 uppercase tracking-wider">₹{product.price} | {product.category}</p>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => setEditingProduct(product)} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-600 transition-colors">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const emptyProduct: Product = {
    id: '',
    name: '',
    price: 0,
    description: '',
    images: [''],
    category: '',
    colors: [],
    sizes: []
};

const ProductForm = ({ product, onSave, onCancel }: { product: Product, onSave: (p: Product) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<Product>(product.id ? product : { ...product, id: Date.now().toString() });

    // Local state for array inputs to allow typing commas freely
    const [imagesStr, setImagesStr] = useState(product.images.join(', '));
    const [colorsStr, setColorsStr] = useState(product.colors.join(', '));
    const [sizesStr, setSizesStr] = useState(product.sizes.join(', '));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value
        }));
    };

    const CATEGORIES = ['Woodies', 'TShirts', 'Oversized', 'Sweat Wear'];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-widest">{product.id ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onCancel}><X size={24} /></button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full border-b border-neutral-200 py-2 focus:outline-none focus:border-black" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Price</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border-b border-neutral-200 py-2 focus:outline-none focus:border-black" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full border-b border-neutral-200 py-2 focus:outline-none focus:border-black resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Category</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full border-b border-neutral-200 py-2 focus:outline-none focus:border-black bg-transparent appearance-none"
                                >
                                    <option value="" disabled>Select Category</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    {/* Fallback for existing categories not in the list */}
                                    {!CATEGORIES.includes(formData.category) && formData.category && (
                                        <option value={formData.category}>{formData.category}</option>
                                    )}
                                </select>
                                <div className="absolute right-0 top-3 pointer-events-none">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="#A3A3A3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Images (Comma separated URLs)</label>
                            <input
                                value={imagesStr}
                                onChange={(e) => setImagesStr(e.target.value)}
                                className="w-full border-b border-neutral-200 py-2 focus:outline-none focus:border-black"
                                placeholder="url1, url2..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Colors (Comma separated)</label>
                            <input
                                value={colorsStr}
                                onChange={(e) => setColorsStr(e.target.value)}
                                className="w-full border-b border-neutral-200 py-2 focus:outline-none focus:border-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Sizes (Comma separated)</label>
                            <input
                                value={sizesStr}
                                onChange={(e) => setSizesStr(e.target.value)}
                                className="w-full border-b border-neutral-200 py-2 focus:outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button onClick={handleSave} className="w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800">
                            Save Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
