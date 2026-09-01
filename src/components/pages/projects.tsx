'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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

const FILTERS = ['All', 'Web', 'Mobile', 'Business Systems', 'UI/UX'] as const;
type FilterType = (typeof FILTERS)[number];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
};

function ProjectSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <Skeleton className="w-full h-52" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-20 rounded-full" />
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const { navigateTo } = useNavigationStore();

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.data || []);
      })
      .catch(() => {
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((p) => p.category?.toLowerCase().includes(activeFilter.toLowerCase()));
  }, [projects, activeFilter]);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/projects-hero.jpg"
            alt="Our Projects"
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
            OUR PROJECTS
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="h-1 w-24 bg-gold mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-white/80 text-base md:text-lg max-w-xl mx-auto"
          >
            Real products. Real problems. Digital solutions.
          </motion.p>
        </div>
      </section>

      {/* Filter + Grid Section */}
      <section className="bg-light-gray py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-14"
          >
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  activeFilter === filter
                    ? 'bg-gold text-navy shadow-sm'
                    : 'bg-white text-slate hover:bg-white/80 border border-border'
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>

          {/* Project Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectSkeleton key={i} />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => {
                  const techTags = project.technologies
                    ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 4)
                    : [];
                  return (
                    <motion.div
                      key={project.id}
                      variants={cardVariants}
                      layout
                      className="group bg-white rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => navigateTo('project-detail', project.slug)}
                    >
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={project.coverImage || '/images/projects-hero.jpg'}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors duration-300" />
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
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-slate/70 text-lg">No projects found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
