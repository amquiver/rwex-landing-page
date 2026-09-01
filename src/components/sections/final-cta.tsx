'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigationStore } from '@/store/navigation';
import { useParallax } from '@/hooks/use-scroll-animation';

export default function FinalCTA() {
  const { navigateTo } = useNavigationStore();
  const { ref: bgRef, offset } = useParallax(0.15);

  return (
    <section
      ref={bgRef}
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="cta-heading"
      style={{
        backgroundImage: 'url(/images/cta-mainbg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Navy Overlay */}
      <div className="absolute inset-0 bg-navy/80" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Have an Idea? Let&rsquo;s Build It.
          </h2>
          <p className="text-muted text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Whether you&rsquo;re starting from scratch or scaling an existing product, our team is
            ready to turn your vision into reality.
          </p>
          <button
            onClick={() => navigateTo('contact')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-hover transition-colors duration-300 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            Start a Project
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
