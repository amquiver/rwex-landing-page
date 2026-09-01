'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import useEmblaCarousel from 'embla-carousel-react';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
}

function TestimonialSkeleton() {
  return (
    <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center">
      <Skeleton className="w-10 h-10 mb-6" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-3/4 mb-6" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
  });

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.data || []);
      })
      .catch(() => {
        setTestimonials([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto-play
  useEffect(() => {
    if (!emblaApi || testimonials.length === 0) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi, testimonials.length]);

  return (
    <section className="bg-light-gray py-20 md:py-24" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-navy mb-4">
            What Our Clients Say
          </h2>
          <p className="text-slate text-base md:text-lg leading-relaxed">
            Hear from the businesses we have helped transform through technology.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <TestimonialSkeleton key={i} />
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3"
                  >
                    <div className="bg-white rounded-xl p-8 h-full flex flex-col">
                      {/* Quote icon */}
                      <Quote className="w-8 h-8 text-gold/30 mb-4" />

                      {/* Content */}
                      <p className="text-slate text-sm leading-relaxed flex-1 mb-6">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>

                      {/* Author */}
                      <div className="border-t border-border/50 pt-4">
                        <p className="text-navy font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-slate/70 text-xs mt-0.5">
                          {testimonial.position}{testimonial.company ? `, ${testimonial.company}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={scrollPrev}
                  className="w-10 h-10 rounded-full bg-white border border-border/50 flex items-center justify-center text-slate hover:text-gold hover:border-gold/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={scrollNext}
                  className="w-10 h-10 rounded-full bg-white border border-border/50 flex items-center justify-center text-slate hover:text-gold hover:border-gold/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate/70">Client testimonials coming soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}
