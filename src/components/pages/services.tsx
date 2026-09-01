'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, Server, Layout, Palette, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigationStore } from '@/store/navigation';

interface ServiceCard {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  cta: string;
}

const services: ServiceCard[] = [
  {
    icon: Globe,
    title: 'Web Development',
    description:
      'Modern, responsive, and high-performance websites and web applications built with cutting-edge technologies for businesses of all sizes.',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Performance', 'Progressive Web Apps'],
    cta: 'Build Your Website',
  },
  {
    icon: Server,
    title: 'Custom Software Solutions',
    description:
      'Tailor-made software systems designed to automate workflows, manage data, and solve complex business challenges efficiently.',
    features: ['Bespoke Systems', 'API Integration', 'Scalable Architecture', 'Database Design'],
    cta: 'Request Custom Solution',
  },
  {
    icon: Layout,
    title: 'UI/UX Design',
    description:
      'User-centered design that balances aesthetics with functionality to create intuitive and engaging digital experiences.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    cta: 'Design Your Product',
  },
  {
    icon: Palette,
    title: 'Graphics Design',
    description:
      'Professional visual design for brands, marketing materials, social media, and print that communicates your identity effectively.',
    features: ['Brand Identity', 'Print Design', 'Social Media Graphics', 'Packaging Design'],
    cta: 'Start Branding',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Discovery',
    description: 'We learn about your business, goals, users, and technical requirements to define the project scope.',
  },
  {
    step: '02',
    title: 'Planning',
    description: 'We create a detailed project plan with milestones, wireframes, and a clear roadmap for execution.',
  },
  {
    step: '03',
    title: 'Development',
    description: 'Our engineers build your solution using agile sprints with regular demos and feedback loops.',
  },
  {
    step: '04',
    title: 'Testing & Launch',
    description: 'Rigorous QA testing, performance optimization, and a smooth deployment to production.',
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ServicesPage() {
  const { navigateTo } = useNavigationStore();

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/our services.jpg"
            alt="Our Services"
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
            OUR SERVICES
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="h-1 w-24 bg-gold mx-auto mb-6"
          />      <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-white/80 text-base md:text-lg max-w-xl mx-auto"
          >
            Elevate your brand and streamline your operations with our comprehensive digital solutions.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
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
              What We Build
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Comprehensive Digital Services
            </h2>
            <p className="text-slate/70 text-base md:text-lg leading-relaxed">
              We combine creativity and technology to deliver solutions that drive real business results.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  variants={cardVariants}
                  className="group bg-white rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>

                  <h3 className="text-navy font-semibold text-xl mb-3">{service.title}</h3>

                  <p className="text-slate/70 text-sm leading-relaxed mb-6 flex-1">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-slate/70 text-sm">
                        <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigateTo('contact')}
                    className="inline-flex items-center gap-2 text-gold text-sm font-semibold group/link focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                  >
                    {service.cta}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Our Process */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-block text-gold text-sm font-semibold uppercase tracking-wider mb-3">
              How We Work
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Our Development Process
            </h2>
            <p className="text-slate/70 text-base md:text-lg leading-relaxed">
              A proven methodology that ensures quality, transparency, and on-time delivery for every project.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {processSteps.map((step) => (
              <motion.div key={step.step} variants={itemVariants} className="text-center">
                <div className="text-5xl font-bold text-gold/15 mb-4">{step.step}</div>
                <h3 className="text-navy font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-slate/70 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className=" py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-muted mb-8 leading-relaxed">
              Tell us about your idea and we&rsquo;ll help you turn it into a powerful digital solution.
            </p>
            <button
              onClick={() => navigateTo('contact')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              Get a Free Quote
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
