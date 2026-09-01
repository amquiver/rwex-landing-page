'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Send,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const SERVICES = [
  'Web Development',
  'Custom Software',
  'UI/UX Design',
  'Graphics Design',
  'Mobile Development',
  'Other',
];

const contactCards = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+255757337929',
    href: 'tel:+255757337929',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+255757337929',
    href: 'https://wa.me/255757337929',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@rwextech.com',
    href: 'mailto:info@rwextech.com',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Dar es Salaam, Tanzania',
    href: null,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Project details are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Message sent successfully!', {
          description: "We'll get back to you within 24 hours.",
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          message: '',
        });
        setErrors({});
      } else {
        toast.error('Something went wrong', {
          description: 'Please try again or contact us directly.',
        });
      }
    } catch {
      toast.error('Network error', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FormErrors];
        return next;
      });
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/call us.jpg"
            alt="Contact Us"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
          >
            CONTACT US
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="h-1 w-24 bg-gold mx-auto mb-6"
          />        <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-white/80 text-base md:text-lg max-w-xl mx-auto"
          >
            Let&apos;s talk about your next digital project.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-light-gray py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left: Contact Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
                  Let&apos;s Start a Conversation
                </h2>
                <p className="text-slate/70 leading-relaxed mb-10">
                  Whether you have a project in mind or just want to explore possibilities, we&apos;re here to help. Reach out through any channel below.
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="space-y-4"
              >
                {contactCards.map((card) => {
                  const content = (
                    <motion.div
                      key={card.label}
                      variants={itemVariants}
                      className={`flex items-start gap-4 bg-white rounded-xl p-5 border border-border/50 transition-all duration-300 ${
                        card.href ? 'hover:border-gold/50 hover:shadow-sm cursor-pointer' : ''
                      }`}
                    >
                      <div className="w-11 h-11 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        <card.icon className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate/70 uppercase tracking-wider mb-1">
                          {card.label}
                        </p>
                        <p className="text-navy font-medium text-sm sm:text-base">{card.value}</p>
                      </div>
                    </motion.div>
                  );

                  if (card.href) {
                    return (
                      <a key={card.label} href={card.href} target="_blank" rel="noopener noreferrer">
                        {content}
                      </a>
                    );
                  }
                  return <div key={card.label}>{content}</div>;
                })}
              </motion.div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm border border-border/50"
              >
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Row: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate text-sm font-medium">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className="bg-light-gray/50 border-border/60 focus-visible:ring-gold"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="bg-light-gray/50 border-border/60 focus-visible:ring-gold"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Row: Phone + Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate text-sm font-medium">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+255 757 337 929"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="bg-light-gray/50 border-border/60 focus-visible:ring-gold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-slate text-sm font-medium">
                        Company
                      </Label>
                      <Input
                        id="company"
                        placeholder="Your Company"
                        value={formData.company}
                        onChange={(e) => updateField('company', e.target.value)}
                        className="bg-light-gray/50 border-border/60 focus-visible:ring-gold"
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div className="space-y-2">
                    <Label className="text-slate text-sm font-medium">
                      Service Interested In
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(v) => updateField('service', v)}
                    >
                      <SelectTrigger className="bg-light-gray/50 border-border/60 focus:ring-gold">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate text-sm font-medium">
                      Project Details <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project, goals, and timeline..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      className="bg-light-gray/50 border-border/60 focus-visible:ring-gold resize-none"
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-navy font-semibold px-8 py-3.5 rounded-lg transition-colors duration-300 h-auto"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
