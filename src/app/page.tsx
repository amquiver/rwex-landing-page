'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useNavigationStore } from '@/store/navigation';

import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import WhatsAppButton from '@/components/whatsapp-button';

import Hero from '@/components/sections/hero';
import TrustStats from '@/components/sections/trust-stats';
import Services from '@/components/sections/services';
import Solutions from '@/components/sections/solutions';
import WhyRwextech from '@/components/sections/why-rwextech';
import DevProcess from '@/components/sections/dev-process';
import TechStack from '@/components/sections/tech-stack';
import FeaturedProjects from '@/components/sections/featured-projects';
import Testimonials from '@/components/sections/testimonials';
import BlogPreview from '@/components/sections/blog-preview';
import FinalCTA from '@/components/sections/final-cta';
import FAQSection from '@/components/sections/faq';

import AboutPage from '@/components/pages/about';
import ProjectsPage from '@/components/pages/projects';
import ProjectDetailPage from '@/components/pages/project-detail';
import BlogPage from '@/components/pages/blog';
import BlogDetailPage from '@/components/pages/blog-detail';
import ContactPage from '@/components/pages/contact';
import FAQPage from '@/components/pages/faq';
import ServicesPage from '@/components/pages/services';
import SolutionsPage from '@/components/pages/solutions';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

function HomePage() {
  return (
    <>
      <Hero />
      <TrustStats />
      <Services />
      <Solutions />
      <WhyRwextech />
      <DevProcess />
      <TechStack />
      <FeaturedProjects />
      <Testimonials />
      <BlogPreview />
      <FAQSection />
      <FinalCTA />
    </>
  );
}

export default function Page() {
  const { currentPage } = useNavigationStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'project-detail':
        return <ProjectDetailPage />;
      case 'blog':
        return <BlogPage />;
      case 'blog-detail':
        return <BlogDetailPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FAQPage />;
      case 'services':
        return <ServicesPage />;
      case 'solutions':
        return <SolutionsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
