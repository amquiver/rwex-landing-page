'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Smartphone, Cloud, Shield } from 'lucide-react';
import { useNavigationStore } from '@/store/navigation';
import { useMouseParallax } from '@/hooks/use-scroll-animation';

const floatingCards = [
  {
    label: 'Web Applications',
    icon: Globe,
    x: '-8%',
    y: '5%',
    delay: 0,
    bg: 'bg-gold',
    text: 'text-navy',
    shape: 'rounded-xl',
  },
  {
    label: 'Mobile Apps',
    icon: Smartphone,
    x: '78%',
    y: '0%',
    delay: 0.15,
    bg: 'bg-white',
    text: 'text-navy',
    shape: 'rounded-full',
  },
  {
    label: 'Cloud Solutions',
    icon: Cloud,
    x: '82%',
    y: '68%',
    delay: 0.3,
    bg: 'bg-white',
    text: 'text-navy',
    shape: 'rounded-xl',
  },
  {
    label: 'Secure Systems',
    icon: Shield,
    x: '-10%',
    y: '72%',
    delay: 0.45,
    bg: 'bg-navy',
    text: 'text-gold',
    shape: 'rounded-xl',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Hero() {
  const { navigateTo } = useNavigationStore();
  const { ref, x, y } = useMouseParallax(0.015);

  return (
    <section
      className="relative bg-navy min-h-[calc(100vh-5rem)] flex items-center overflow-hidden"
      aria-label="Hero"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              We Build Digital Solutions That Move Businesses Forward.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-muted text-base md:text-lg leading-relaxed mb-8 max-w-lg"
            >
              RWEXTECH designs and develops modern websites, mobile applications,
              custom software, and digital platforms that turn business challenges
              into scalable digital solutions.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigateTo('contact')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-hover transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                Start a Project
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('projects')}
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white font-semibold rounded-lg hover:bg-white/5 hover:border-white/40 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                Explore Our Work
              </button>
            </motion.div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="relative hidden lg:block"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
              <Image
                src="/images/hero-illustration.jpg"
                alt="Digital solutions illustration"
                width={560}
                height={420}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Floating cards */}
            {floatingCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.8 + card.delay,
                    ease: 'easeOut',
                  }}
                  className="absolute"
                  style={{
                    left: card.x,
                    top: card.y,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 3 + card.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: card.delay,
                    }}
                    className={`${card.bg} ${card.shape} px-4 py-2.5 shadow-lg shadow-navy/30 flex items-center gap-2.5`}
                  >
                    <Icon className={`w-4 h-4 ${card.text}`} />
                    <span className={`${card.text} text-xs font-semibold whitespace-nowrap`}>
                      {card.label}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
