'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useNavigationStore } from '@/store/navigation';

const features = [
  {
    title: 'Built Around Your Needs',
    description: 'We create solutions around your actual business processes.',
  },
  {
    title: 'Modern Technology',
    description: 'We use modern and reliable technologies.',
  },
  {
    title: 'User-Centered Design',
    description: 'We design around real users and business goals.',
  },
  {
    title: 'Scalable Architecture',
    description: 'Solutions are built with future growth in mind.',
  },
  {
    title: 'Reliable Support',
    description: 'We support products beyond launch.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function WhyRwextech() {
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({ threshold: 0.2 });
  const { navigateTo } = useNavigationStore();

  return (
    <section className="bg-white py-20 md:py-24" aria-labelledby="why-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: -40 }}
            animate={imageVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative rounded-2xl overflow-hidden"
          >
            <Image
              src="/images/team.jpg"
              alt="RWEXTECH team"
              width={600}
              height={450}
              className="w-full h-auto object-cover"
            />
            {/* Gold accent corner */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 border-b-4 border-r-4 border-gold/30 rounded-br-2xl" />
          </motion.div>

          {/* Right: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-gold text-xs font-semibold tracking-widest uppercase mb-4">
                WHY RWEXTECH
              </span>
              <h2
                id="why-heading"
                className="text-3xl md:text-4xl font-bold text-navy mb-8"
              >
                Technology With Purpose.
              </h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-6"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="flex gap-4"
                >
                  <CheckCircle className="w-6 h-6 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-navy font-semibold text-base mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-slate/70 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Learn More About Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <button
                onClick={() => navigateTo('about')}
                className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
              >
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
