'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useNavigationStore } from '@/store/navigation';

type Page = 'home' | 'about' | 'services' | 'solutions' | 'projects' | 'blog' | 'contact' | 'faq';

const navLinks: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About Us', page: 'about' },
  { label: 'Services', page: 'services' },
  { label: 'Solutions', page: 'solutions' },
  { label: 'Projects', page: 'projects' },
  { label: 'Blog', page: 'blog' },
  { label: 'FAQ', page: 'faq' },
  { label: 'Contact', page: 'contact' },
];

export default function Navigation() {
  const { currentPage, isScrolled, isMobileMenuOpen, navigateTo, setMobileMenuOpen, setIsScrolled } =
    useNavigationStore();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, [setIsScrolled]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleNavClick = (page: Page) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-navy/95 backdrop-blur-md shadow-lg shadow-navy/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
            aria-label="RWEXTECH Home"
          >
            <Image
              src="/images/logo.png"
              alt="RWEXTECH Logo"
              width={3334}
              height={834}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    isActive
                      ? 'text-gold'
                      : 'text-white/80 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop CTA + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Desktop Login */}
            <a
              href="/admin/login"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-navy text-sm font-semibold rounded-lg hover:bg-gold-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              Login
            </a>

            {/* Mobile Hamburger */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className="p-2 text-white hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md"
                    aria-label="Open menu"
                    aria-expanded={isMobileMenuOpen}
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-80 bg-navy border-navy/50 p-0"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                      <Image
                        src="/images/logo.png"
                        alt="RWEXTECH Logo"
                        width={3334}
                        height={834}
                        className="h-8 w-auto"
                      />
                      <SheetClose asChild>
                        <button
                          className="p-2 text-white/70 hover:text-white transition-colors rounded-md"
                          aria-label="Close menu"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </SheetClose>
                    </div>

                    {/* Mobile Links */}
                    <div className="flex-1 py-6">
                      <AnimatePresence>
                        {isMobileMenuOpen && (
                          <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={{
                              open: { transition: { staggerChildren: 0.06 } },
                              closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                            }}
                          >
                            {navLinks.map((link) => {
                              const isActive = currentPage === link.page;
                              return (
                                <motion.button
                                  key={link.page}
                                  variants={{
                                    open: { opacity: 1, x: 0 },
                                    closed: { opacity: 0, x: 20 },
                                  }}
                                  onClick={() => handleNavClick(link.page)}
                                  className={`block w-full text-left px-6 py-3.5 text-base font-medium transition-colors ${
                                    isActive
                                      ? 'text-gold bg-white/5'
                                      : 'text-white/80 hover:text-white hover:bg-white/5'
                                  }`}
                                >
                                  {link.label}
                                </motion.button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Mobile Login */}
                    <div className="p-6 border-t border-white/10">
                      <a
                        href="/admin/login"
                        className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-hover transition-colors"
                      >
                        Login
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
