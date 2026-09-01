'use client';

import { motion } from 'framer-motion';
import { useCounter } from '@/hooks/use-scroll-animation';

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
}

function StatItem({ value, suffix, label }: StatItemProps) {
  const { count, ref } = useCounter(value, 2000);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-gold mb-2">
        {count}{suffix}
      </div>
      <div className="text-slate/70 text-sm md:text-base font-medium">{label}</div>
    </motion.div>
  );
}

const stats: StatItemProps[] = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 40, suffix: '+', label: 'Clients' },
  { value: 60, suffix: '+', label: 'Solutions Built' },
  { value: 5, suffix: '+', label: 'Years of Experience' },
];

export default function TrustStats() {
  return (
    <section className="bg-white py-16 md:py-20" aria-label="Trust statistics">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
