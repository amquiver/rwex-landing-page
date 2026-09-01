'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, ShoppingCart, Heart, DollarSign, Settings, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigationStore } from '@/store/navigation';

interface Solution {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  gradient: string;
}

const solutions: Solution[] = [
  {
    icon: GraduationCap,
    title: 'Education',
    description: 'Comprehensive learning management systems and student portals that streamline academic operations.',
    features: ['Student Management', 'Online Learning', 'Grade Tracking', 'Parent Portals'],
    gradient: 'from-blue-900 to-blue-700',
  },
  {
    icon: Building2,
    title: 'Business Management',
    description: 'ERP systems and workflow automation tools that optimize operations and boost productivity.',
    features: ['ERP Systems', 'Workflow Automation', 'Inventory Management', 'Reporting Dashboards'],
    gradient: 'from-slate-800 to-slate-600',
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce',
    description: 'Full-featured online stores and payment platforms that drive sales and enhance customer experience.',
    features: ['Online Stores', 'Payment Integration', 'Order Management', 'Analytics'],
    gradient: 'from-emerald-900 to-emerald-700',
  },
  {
    icon: Heart,
    title: 'Healthcare',
    description: 'Patient management and telemedicine platforms connecting healthcare providers with patients seamlessly.',
    features: ['Patient Portals', 'Medical Records', 'Appointment Scheduling', 'Telemedicine'],
    gradient: 'from-rose-900 to-rose-700',
  },
  {
    icon: DollarSign,
    title: 'Finance',
    description: 'Accounting software and fintech solutions that ensure accuracy, compliance, and real-time insights.',
    features: ['Accounting Systems', 'Invoicing', 'Financial Reports', 'Tax Compliance'],
    gradient: 'from-amber-900 to-amber-700',
  },
  {
    icon: Settings,
    title: 'Custom Enterprise',
    description: 'Tailored software solutions for any industry, built from the ground up to match your exact needs.',
    features: ['Bespoke Development', 'System Integration', 'Data Migration', 'Ongoing Support'],
    gradient: 'from-[#0A1931] to-[#1a2941]',
  },
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function SolutionsPage() {
  const { navigateTo } = useNavigationStore();

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/cta-bg.jpg"
            alt="Our Solutions"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
          >
            OUR SOLUTIONS
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="h-1 w-24 bg-gold mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-white/80 text-base md:text-lg max-w-xl mx-auto"
          >
            Industry-specific technology solutions tailored to the unique challenges and workflows of your sector.
          </motion.p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="bg-light-gray py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-block text-gold text-sm font-semibold uppercase tracking-wider mb-3">
              Industries We Serve
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Technology Built Around Your Business
            </h2>
            <p className="text-slate/70 text-base md:text-lg leading-relaxed">
              We bring deep domain understanding to every project, ensuring our solutions fit naturally into how your business operates.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {solutions.map((solution) => {
              const Icon = solution.icon;
              return (
                <motion.div
                  key={solution.title}
                  variants={cardVariants}
                  className="group bg-white rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  {/* Gradient header */}
                  <div className={`relative h-44 bg-gradient-to-br ${solution.gradient} flex items-center justify-center`} style={{}}>
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }} />
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-all duration-300 group-hover:bg-gold/20 group-hover:border-gold/40 group-hover:scale-110">
                      <Icon className="w-8 h-8 text-white group-hover:text-gold transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-navy font-semibold text-lg mb-2">{solution.title}</h3>
                    <p className="text-slate/70 text-sm leading-relaxed mb-5">{solution.description}</p>
                    <ul className="space-y-2.5">
                      {solution.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-slate/70 text-sm">
                          <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Why Custom Solutions */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-gold text-sm font-semibold uppercase tracking-wider mb-3">
                Why Go Custom
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Off-the-Shelf Doesn&rsquo;t Always Fit
              </h2>
              <p className="text-slate/70 text-base leading-relaxed mb-6">
                Every business is unique. Generic software often forces you to change how you work to fit the tool. We believe technology should adapt to your business, not the other way around.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Designed specifically for your workflows',
                  'Scales with your business growth',
                  'Full ownership and control of your data',
                  'Seamless integration with existing tools',
                  'Ongoing support and evolution',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                    <span className="text-slate/70 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigateTo('contact')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                Discuss Your Needs
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-navy/10">
                <Image
                  src="/images/team.jpg"
                  alt="Our team building custom solutions"
                  width={560}
                  height={420}
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Don&rsquo;t See Your Industry?
            </h2>
            <p className="text-muted mb-8 leading-relaxed">
              We build solutions for any industry. Tell us about your specific needs and we&rsquo;ll design a system that fits perfectly.
            </p>
            <button
              onClick={() => navigateTo('contact')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              Let&rsquo;s Talk
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
