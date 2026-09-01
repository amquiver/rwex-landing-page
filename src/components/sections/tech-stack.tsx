'use client';

import { motion } from 'framer-motion';

const technologies = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript',
  'React', 'Next.js', 'Node.js', 'PHP',
  'Python', 'PostgreSQL', 'MySQL', 'Git',
  'GitHub', 'Figma', 'Docker',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export default function TechStack() {
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="tech-heading"
      style={{
        backgroundImage: 'url(/images/cta-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy/90" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 id="tech-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powered by Modern Technology
          </h2>
          <p className="text-muted text-base md:text-lg leading-relaxed">
            We leverage a robust stack of proven technologies to build reliable, scalable, and performant solutions.
          </p>
        </motion.div>

        {/* Tech Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-3xl mx-auto"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="group px-5 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 hover:border-gold/40 hover:bg-white/15 transition-all duration-300 cursor-default"
            >
              <span className="text-white/80 text-sm font-medium group-hover:text-gold transition-colors duration-300">
                {tech}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
