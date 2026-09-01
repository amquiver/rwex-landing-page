'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigationStore } from '@/store/navigation';

const faqs = [
  {
    question: 'What types of software does RWEXTECH develop?',
    answer:
      'We build a wide range of digital solutions including web applications, mobile apps, custom enterprise software, e-commerce platforms, content management systems, and cloud-based SaaS products. Each solution is tailored to your specific business needs and goals.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'Project timelines vary based on complexity and scope. A simple website may take 4\u20136 weeks, while a full custom software platform can take 3\u20136 months or more. We provide a detailed timeline and milestone plan during our discovery phase so you always know what to expect.',
  },
  {
    question: 'What is your development process?',
    answer:
      'We follow a structured 6-step process: Discover, Design, Develop, Test, Deploy, and Support. Each phase includes client check-ins and approvals to ensure the final product aligns perfectly with your vision. We use agile methodologies for flexibility and transparency.',
  },
  {
    question: 'Do you provide ongoing support and maintenance?',
    answer:
      'Yes, we offer comprehensive post-launch support including bug fixes, security updates, performance monitoring, feature enhancements, and technical consulting. We have flexible support packages to fit every business size and budget.',
  },
  {
    question: 'How much does a custom software project cost?',
    answer:
      'Cost depends on the project scope, complexity, technology stack, and timeline. We provide detailed, transparent quotes after our initial discovery consultation. We work with businesses of all sizes and can propose phased approaches to match your budget.',
  },
  {
    question: 'Which technologies do you work with?',
    answer:
      'We work with modern technologies including React, Next.js, TypeScript, Node.js, Python, Flutter, React Native, PostgreSQL, and cloud platforms like AWS and Google Cloud. We select the best technology stack for each project based on requirements and long-term scalability.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function FAQSection() {
  const { navigateTo } = useNavigationStore();

  return (
    <section className="bg-light-gray py-20 md:py-24" aria-label="Frequently Asked Questions">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <span className="inline-block text-gold text-sm font-semibold uppercase tracking-wider mb-3">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
              Find answers to common questions about our services, process, and how we can help your business grow.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border-slate-200"
                >
                  <AccordionTrigger className="text-slate-800 text-base font-semibold hover:text-navy hover:no-underline py-5 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigateTo('contact')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                Get in Touch
              </button>
              <button
                onClick={() => navigateTo('faq')}
                className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
              >
                View All FAQs
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
