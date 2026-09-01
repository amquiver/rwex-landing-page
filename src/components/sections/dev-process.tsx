'use client';

import { motion } from 'framer-motion';
import { Search, PenTool, Code, ShieldCheck, Rocket, HeadphonesIcon } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

const steps = [
  { icon: Search, title: 'Discover', description: 'We understand your goals, audience, and challenges to define the right approach.' },
  { icon: PenTool, title: 'Design', description: 'We create wireframes, prototypes, and visual designs that align with your brand.' },
  { icon: Code, title: 'Develop', description: 'We build your solution using modern, reliable technologies and best practices.' },
  { icon: ShieldCheck, title: 'Test', description: 'We rigorously test every feature to ensure quality and reliability.' },
  { icon: Rocket, title: 'Deploy', description: 'We deploy to production with proper infrastructure and monitoring in place.' },
  { icon: HeadphonesIcon, title: 'Support', description: 'We provide ongoing support and maintenance to keep your product running smoothly.' },
];

export default function DevProcess() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section className="bg-navy py-20 md:py-24" aria-labelledby="process-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 id="process-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
            From Idea to Impact
          </h2>
          <p className="text-muted text-base md:text-lg leading-relaxed">
            A structured, transparent process that transforms your vision into a high-quality digital product.
          </p>
        </motion.div>

        {/* Desktop: Horizontal Timeline */}
        <div ref={ref} className="hidden md:block">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/10">
              <motion.div
                className="h-full bg-gold rounded-full"
                initial={{ width: '0%' }}
                animate={isVisible ? { width: '100%' } : { width: '0%' }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-6 gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.15 }}
                    className="relative flex flex-col items-center text-center"
                  >
                    {/* Circle */}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-navy border-2 border-gold flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    {/* Number */}
                    <span className="text-gold text-xs font-bold mb-2">0{index + 1}</span>
                    {/* Title */}
                    <h3 className="text-white font-semibold text-sm mb-2">{step.title}</h3>
                    {/* Description */}
                    <p className="text-muted text-xs leading-relaxed">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden">
          <div className="relative pl-8">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/10">
              <motion.div
                className="w-full bg-gold rounded-full"
                initial={{ height: '0%' }}
                animate={isVisible ? { height: '100%' } : { height: '0%' }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
              />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="relative pb-10 last:pb-0"
                >
                  {/* Circle */}
                  <div className="absolute -left-8 top-0 w-7 h-7 rounded-full bg-navy border-2 border-gold flex items-center justify-center z-10">
                    <Icon className="w-3.5 h-3.5 text-gold" />
                  </div>
                  {/* Content */}
                  <div>
                    <span className="text-gold text-xs font-bold">0{index + 1}</span>
                    <h3 className="text-white font-semibold text-base mt-1 mb-2">{step.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
