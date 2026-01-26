import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto"
        >
            <div className="max-w-2xl mx-auto text-center mb-16">
                <span className="text-[10px] uppercase tracking-[0.6em] text-neutral-400 mb-4 block">Get in Touch</span>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6 uppercase">Contact Us</h1>
                <div className="w-12 h-[1px] bg-neutral-200 mx-auto"></div>
            </div>

            <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
                <div className="space-y-6 text-center">
                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Contact Details</h3>
                        <p className="text-neutral-500 font-light leading-relaxed max-w-md text-sm">
                            Reach out to us directly through any of the channels below.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-5">
                        {/* Email */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-2">
                                <Mail size={20} />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">Email</h4>
                            <a href="mailto:support@trioncee.com" className="text-lg font-light hover:opacity-70 transition-opacity">
                                support@trioncee.com
                            </a>
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-2">
                                <Phone size={20} />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">Mobile</h4>
                            <a href="tel:+919876543210" className="text-lg font-light hover:opacity-70 transition-opacity">
                                +91 98765 43210
                            </a>
                        </div>

                        {/* Address */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-2">
                                <MapPin size={20} />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">Studio</h4>
                            <p className="text-lg font-light leading-relaxed">
                                123 Fashion Avenue, New York, NY 10012
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Contact;
