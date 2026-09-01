'use client';

import { motion } from 'framer-motion';
import { Globe, Server, Layout, Palette, ArrowRight } from 'lucide-react';
import { useNavigationStore } from '@/store/navigation';

interface ServiceCard {
  icon: React.ElementType;
  title: string;
  description: string;
  highlights: string[];
  cta: string;
}

const services: ServiceCard[] = [
  {
    icon: Globe,
    title: 'Web Development',
    description:
      'Modern, responsive, and high-performance websites and web applications built with cutting-edge technologies for businesses of all sizes.',
    highlights: ['Responsive Design', 'SEO Optimized', 'Fast Performance'],
    cta: 'Build Your Website ',
  },
  {
    icon: Server,
    title: 'Custom Software Solutions',
    description:
      'Tailor-made software systems designed to automate workflows, manage data, and solve complex business challenges efficiently.',
    highlights: ['Bespoke Systems', 'API Integration', 'Scalable Architecture'],
    cta: 'Request Custom Solution ',
  },
  {
    icon: Layout,
    title: 'UI/UX Design',
    description:
      'User-centered design that balances aesthetics with functionality to create intuitive and engaging digital experiences.',
    highlights: ['User Research', 'Wireframing', 'Prototyping'],
    cta: 'Design Your Product ',
  },
  {
    icon: Palette,
    title: 'Graphics Design',
    description:
      'Professional visual design for brands, marketing materials, social media, and print that communicates your identity effectively.',
    highlights: ['Brand Identity', 'Print Design', 'Social Media Graphics'],
    cta: 'Start Branding ',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Services() {
  const { navigateTo } = useNavigationStore();

  return (
    <section className="bg-light-gray py-20 md:py-24" aria-labelledby="services-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 id="services-heading" className="text-3xl md:text-4xl font-bold text-navy mb-4">
            What We Build
          </h2>
          <p className="text-slate text-base md:text-lg leading-relaxed">
            Elevate your brand and streamline your operations with our digital solutions.
            We combine creativity and technology to deliver results that matter.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="group bg-white rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-gold" />
                </div>

                {/* Title */}
                <h3 className="text-navy font-semibold text-lg mb-3">{service.title}</h3>

                {/* Description */}
                <p className="text-slate text-sm leading-relaxed mb-5 flex-1">
                  {service.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2 mb-6">
                  {service.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-slate/70 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => navigateTo('contact')}
                  className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold group/link focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                >
                  {service.cta}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                </button>
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
            onClick={() => navigateTo('services')}
            className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
          >
            Explore All Services
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
