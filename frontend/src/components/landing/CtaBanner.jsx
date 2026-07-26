import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Zap, Sparkles } from 'lucide-react';

export default function CtaBanner() {
  const navigate = useNavigate();

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl p-10 sm:p-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white shadow-2xl overflow-hidden">
          
          {/* Animated Decorative Circle Meshes */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <Activity className="w-8 h-8 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit tracking-tight leading-tight mb-6"
            >
              Ready to Experience Next-Gen Healthcare Management?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-indigo-100 font-jakarta max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Access instant demo accounts for all 6 roles or register a new patient account to test the system in action.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={() => navigate('/auth')}
                className="px-8 py-4 rounded-xl bg-white text-indigo-700 font-bold font-outfit text-base shadow-2xl hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
              >
                <Sparkles size={20} className="text-indigo-600" />
                <span>Launch HMS Portal Now</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
