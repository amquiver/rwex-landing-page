'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Github, Facebook, MapPin, Mail, Phone } from 'lucide-react';
import { useNavigationStore } from '@/store/navigation';

type Page = 'home' | 'about' | 'services' | 'solutions' | 'projects' | 'blog' | 'faq' | 'contact';

const companyLinks: { label: string; page: Page }[] = [
  { label: 'About Us', page: 'about' },
  { label: 'Projects', page: 'projects' },
  { label: 'Blog', page: 'blog' },
  { label: 'Contact', page: 'contact' },
];

const serviceLinks = [
  'Web Development',
  'Custom Software',
  'UI/UX Design',
  'Graphics Design',
  'Cloud & Deployment',
];

const resourceLinks: { label: string; page: Page }[] = [
  { label: 'Blog', page: 'blog' },
  { label: 'Case Studies', page: 'projects' },
  { label: 'FAQ', page: 'faq' },
  { label: 'Contact', page: 'contact' },
];

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/rwextech', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/rwextech', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/rwextech', label: 'GitHub' },
  { icon: Facebook, href: 'https://facebook.com/rwextech', label: 'Facebook' },
];

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Footer() {
  const { navigateTo } = useNavigationStore();

  return (
    <footer className="bg-navy" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
        >
          {/* Company Column */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 mb-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
              aria-label="RWEXTECH Home"
            >
              <Image
                src="/images/logo.png"
                alt="RWEXTECH Logo"
                width={3334}
                height={834}
                className="h-9 w-auto"
              />
            </button>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Building digital solutions that move businesses forward.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-muted hover:text-gold hover:bg-white/10 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Services Column */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((label) => (
                <li key={label}>
                  <button
                    onClick={() => navigateTo('services')}
                    className="text-muted text-sm hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Column */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className="text-muted text-sm hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <a
                  href="tel:+255757337929"
                  className="text-muted text-sm hover:text-gold transition-colors duration-200"
                >
                  +255 757 337 929
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <a
                  href="https://wa.me/255757337929"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted text-sm hover:text-gold transition-colors duration-200"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <a
                  href="mailto:info@rwextech.com"
                  className="text-muted text-sm hover:text-gold transition-colors duration-200"
                >
                  info@rwextech.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="text-muted text-sm">
                  Dar es Salaam, Tanzania
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted text-sm">
              © 2026 RWEXTECH. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigateTo('contact')}
                className="text-muted text-sm hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className="text-muted text-sm hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
