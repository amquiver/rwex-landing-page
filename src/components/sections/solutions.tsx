'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Building2, ShoppingCart, Heart, DollarSign, Settings, ArrowRight } from 'lucide-react';
import { useNavigationStore } from '@/store/navigation';

interface Solution {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

const solutions: Solution[] = [
  { icon: GraduationCap, title: 'Education', description: 'Learning management & student systems', gradient: 'from-blue-900 to-blue-700' },
  { icon: Building2, title: 'Business Management', description: 'ERP & workflow automation', gradient: 'from-slate-800 to-slate-600' },
  { icon: ShoppingCart, title: 'E-commerce', description: 'Online stores & payment platforms', gradient: 'from-emerald-900 to-emerald-700' },
  { icon: Heart, title: 'Healthcare', description: 'Patient portals & medical records', gradient: 'from-rose-900 to-rose-700' },
  { icon: DollarSign, title: 'Finance', description: 'Accounting & fintech solutions', gradient: 'from-amber-900 to-amber-700' },
  { icon: Settings, title: 'Custom Enterprise Solutions', description: 'Tailored software for any industry', gradient: 'from-navy to-navy/80' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Solutions() {
  const { navigateTo } = useNavigationStore();

  return (
    <section className="bg-white py-20 md:py-24" aria-labelledby="solutions-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 id="solutions-heading" className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Technology Built Around Your Business
          </h2>
          <p className="text-slate text-base md:text-lg leading-relaxed">
            Industry-specific solutions tailored to the unique challenges and workflows of your sector.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.title}
                variants={cardVariants}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer"
                onClick={() => navigateTo('solutions')}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} transition-all duration-500 group-hover:scale-110`} />

                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20 transition-all duration-300 group-hover:bg-gold/20 group-hover:border-gold/40 group-hover:scale-110">
                    <Icon className="w-7 h-7 text-white group-hover:text-gold transition-colors duration-300" />
                  </div>
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1">
                    {solution.title}
                  </h3>
                  <p className="text-white/60 text-xs md:text-sm max-w-[180px] group-hover:text-white/80 transition-colors duration-300">
                    {solution.description}
                  </p>
                  <div className="w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-10 mt-3 rounded-full" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigateTo('solutions')}
            className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
          >
            Explore All Solutions
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
