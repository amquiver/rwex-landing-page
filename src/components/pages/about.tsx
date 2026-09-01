'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import {
  Target,
  Eye,
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  BookOpen,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
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

const values = [
  { icon: Sparkles, label: 'Innovation', description: 'We embrace new ideas and technologies to deliver cutting-edge solutions.' },
  { icon: ShieldCheck, label: 'Integrity', description: 'We build trust through transparency, honesty, and ethical practices.' },
  { icon: Award, label: 'Quality', description: 'We deliver work that meets the highest standards of excellence.' },
  { icon: Users, label: 'Customer Focus', description: 'Our clients’ success is our success — we put them first in everything.' },
  { icon: BookOpen, label: 'Continuous Learning', description: 'We invest in our team’s growth to stay ahead of the curve.' },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <main>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src="/images/team.jpg"
            alt="RWEXTECH Team"
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
          >
            ABOUT US
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="h-1 w-24 bg-gold mx-auto"
          />
           <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-white/80 text-base md:text-lg max-w-xl mx-auto"
          >we craft high-impact software, web applications, and digital tools designed to elevate your brand and streamline your core operations.</motion.p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="bg-white py-20 md:py-28" aria-labelledby="who-heading">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            <h2 id="who-heading" className="text-3xl md:text-4xl font-bold text-navy mb-6">
              Who We Are
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-6 text-slate text-base md:text-lg leading-relaxed"
          >
            <motion.p variants={itemVariants}>
              RWEXTECH is a software development company based in Dar es Salaam, Tanzania, dedicated to building practical, high-quality digital solutions for businesses and organizations across Africa and beyond. We believe that great technology should be accessible, reliable, and purpose-driven.
            </motion.p>
            <motion.p variants={itemVariants}>
              Founded with a passion for solving real-world problems through code, our team brings together diverse expertise in web development, mobile applications, UI/UX design, and custom enterprise software. We work closely with our clients to understand their unique challenges and deliver solutions that make a measurable difference.
            </motion.p>
            <motion.p variants={itemVariants}>
              From startups looking to build their first MVP to established enterprises seeking digital transformation, RWEXTECH is the technology partner that turns ideas into impactful products. We combine modern tools, agile practices, and a deep commitment to quality to deliver results that exceed expectations.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision / Values Section */}
      <section className="bg-light-gray py-20 md:py-28" aria-labelledby="mission-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <h2 id="mission-heading" className="text-3xl md:text-4xl font-bold text-navy mb-4">
              What Drives Us
            </h2>
            <p className="text-slate/70 text-base md:text-lg max-w-2xl mx-auto">
              Our mission, vision, and core values shape every project we take on and every relationship we build.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Mission Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Our Mission</h3>
              <p className="text-slate leading-relaxed">
                To create practical technology that solves real-world problems. We exist to bridge the gap between complex challenges and elegant digital solutions.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Our Vision</h3>
              <p className="text-slate leading-relaxed">
                To become a trusted technology partner for businesses and organizations. We envision a future where every business in Africa has access to world-class software.
              </p>
            </motion.div>

            {/* Values Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Our Values</h3>
              <ul className="space-y-3">
                {values.map((v) => (
                  <li key={v.label} className="flex items-start gap-3">
                    <v.icon className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-navy text-sm">{v.label}</span>
                      <span className="text-slate text-sm"> — {v.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Photo Section */}
      <section className="bg-white py-20 md:py-28" aria-labelledby="team-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 id="team-heading" className="text-3xl md:text-4xl font-bold text-navy mb-4">
                The People Behind RWEXTECH
              </h2>
              <p className="text-slate/70 text-base md:text-lg max-w-2xl mx-auto">
                A talented team of developers, designers, and strategists united by a shared passion for technology and impact.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
                <Image
                  src="/images/team-aboutus.jpg"
                  alt="RWEXTECH Team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
