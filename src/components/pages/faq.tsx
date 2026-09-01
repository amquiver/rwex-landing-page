'use client';

import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, MessageSquare, Clock, Shield, CreditCard, Code, Headphones } from 'lucide-react';
import { useNavigationStore } from '@/store/navigation';

const faqCategories = [
  {
    title: 'Services & Capabilities',
    icon: Code,
    faqs: [
      {
        question: 'What types of software does RWEXTECH develop?',
        answer:
          'We build a wide range of digital solutions including web applications, mobile apps, custom enterprise software, e-commerce platforms, content management systems, and cloud-based SaaS products. Each solution is tailored to your specific business needs and goals.',
      },
      {
        question: 'Which industries do you serve?',
        answer:
          'We work across multiple industries including education, business management, e-commerce, healthcare, finance, and custom enterprise solutions. Our experience across sectors allows us to bring best practices and innovative approaches to every project.',
      },
      {
        question: 'Do you offer UI/UX design services?',
        answer:
          'Yes! Our team includes dedicated UI/UX designers who create intuitive, user-centered interfaces. We handle everything from user research and wireframing to visual design and interactive prototyping, ensuring your product looks great and is easy to use.',
      },
      {
        question: 'Can you work with our existing tech stack?',
        answer:
          'Absolutely. We have experience with a wide range of technologies and frameworks. Whether you need us to extend an existing application, migrate to new technology, or build something entirely new, we adapt to your technical requirements.',
      },
    ],
  },
  {
    title: 'Process & Timeline',
    icon: Clock,
    faqs: [
      {
        question: 'How long does a typical project take?',
        answer:
          'Project timelines vary based on complexity and scope. A simple website may take 4–6 weeks, while a full custom software platform can take 3–6 months or more. We provide a detailed timeline and milestone plan during our discovery phase so you always know what to expect.',
      },
      {
        question: 'What is your development process?',
        answer:
          'We follow a structured 6-step process: Discover, Design, Develop, Test, Deploy, and Support. Each phase includes client check-ins and approvals to ensure the final product aligns perfectly with your vision. We use agile methodologies for flexibility and transparency.',
      },
      {
        question: 'How do you handle project communication?',
        answer:
          'We assign a dedicated project manager to every engagement. You\'ll receive regular progress updates, have access to a project dashboard, and can schedule check-in calls at any time. We believe transparent communication is the foundation of successful projects.',
      },
      {
        question: 'Will I be able to provide feedback during development?',
        answer:
          'Absolutely. We build feedback loops into every phase. You\'ll review designs before development begins, test features at each milestone, and have the opportunity to request adjustments throughout the process. Your input shapes the final product.',
      },
    ],
  },
  {
    title: 'Pricing & Payment',
    icon: CreditCard,
    faqs: [
      {
        question: 'How much does a custom software project cost?',
        answer:
          'Cost depends on the project scope, complexity, technology stack, and timeline. We provide detailed, transparent quotes after our initial discovery consultation. We work with businesses of all sizes and can propose phased approaches to match your budget.',
      },
      {
        question: 'What payment structures do you offer?',
        answer:
          'We offer flexible payment structures including project-based pricing, milestone-based payments, and monthly retainer arrangements for ongoing work. We discuss and agree on the payment plan that works best for both parties before starting.',
      },
      {
        question: 'Do you charge for initial consultations?',
        answer:
          'No, our initial consultation is completely free. We take the time to understand your needs, discuss potential approaches, and provide a preliminary scope and estimate. There\'s no obligation to proceed.',
      },
    ],
  },
  {
    title: 'Support & Security',
    icon: Shield,
    faqs: [
      {
        question: 'Do you provide ongoing support and maintenance?',
        answer:
          'Yes, we offer comprehensive post-launch support including bug fixes, security updates, performance monitoring, feature enhancements, and technical consulting. We have flexible support packages to fit every business size and budget.',
      },
      {
        question: 'How do you handle data security?',
        answer:
          'Security is built into every layer of our development process. We follow industry best practices including encrypted data transmission, secure authentication, regular security audits, and compliance with data protection regulations. Your data safety is our priority.',
      },
      {
        question: 'What happens if something breaks after launch?',
        answer:
          'Our support packages include guaranteed response times for critical issues. We also provide a warranty period after launch where any bugs or issues are fixed at no additional cost. We stand behind the quality of our work.',
      },
      {
        question: 'Do you provide hosting and deployment services?',
        answer:
          'Yes, we offer complete deployment and hosting management. We set up your application on reliable cloud infrastructure, configure monitoring and backups, and handle scaling as your user base grows. We can also work with your existing hosting provider if preferred.',
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function FAQPage() {
  const { navigateTo } = useNavigationStore();

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-navy pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
              Frequently Asked Questions
            </h1>
            <p className="text-muted text-base md:text-lg leading-relaxed">
              Everything you need to know about working with RWEXTECH. Can&rsquo;t find the answer you&rsquo;re looking for? Reach out to our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="bg-light-gray py-20 md:py-24" aria-label="FAQ Categories">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-16">
          {faqCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
            >
              <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  {category.title}
                </h2>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.title}-${index}`}
                      className="bg-white rounded-lg mb-2 border border-slate-100 px-6"
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="bg-navy py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-7 h-7 text-gold" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted mb-8 leading-relaxed">
              Our team is ready to help. Whether you have a specific question about our services or want to discuss your project idea, we&rsquo;d love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigateTo('contact')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                <MessageSquare className="w-4 h-4" />
                Contact Us
              </button>
              <a
                href="https://wa.me/255757337929"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white font-semibold rounded-lg hover:bg-white/5 hover:border-white/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                Chat on WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
