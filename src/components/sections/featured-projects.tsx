'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigationStore } from '@/store/navigation';

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  coverImage: string | null;
  technologies: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

function ProjectSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigateTo } = useNavigationStore();

  useEffect(() => {
    fetch('/api/projects?featured=true')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.data || []);
      })
      .catch(() => {
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-20 md:py-24" aria-labelledby="projects-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 id="projects-heading" className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Selected Work
          </h2>
          <p className="text-slate text-base md:text-lg leading-relaxed">
            A showcase of projects where strategy, design, and engineering come together.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.slice(0, 4).map((project) => {
              const techTags = project.technologies
                ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 3)
                : [];
              return (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  className="group bg-white rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => navigateTo('project-detail', project.slug)}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.coverImage || '/images/projects-hero.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <Badge
                      variant="secondary"
                      className="bg-gold/10 text-gold text-xs font-medium border-0 mb-3"
                    >
                      {project.category}
                    </Badge>
                    <h3 className="text-navy font-semibold text-lg mb-2 group-hover:text-gold transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-slate/70 text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Tags */}
                    {techTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {techTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 bg-light-gray text-slate/70 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <span className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold group/link">
                      View Case Study
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          {/* View All */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigateTo('projects')}
              className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate/70">Featured projects coming soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}
