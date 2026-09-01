'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigationStore } from '@/store/navigation';

interface Project {
  id: string;
  slug: string;
  name: string;
  clientName: string | null;
  category: string;
  coverImage: string | null;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  techStack: string | null;
  clientUrl: string | null;
}

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

function DetailSkeleton() {
  return (
    <main>
      <section className="relative min-h-[50vh] flex items-end">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <Skeleton className="h-8 w-40 mb-6" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <div className="flex gap-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function ProjectDetailPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const { projectSlug, navigateTo } = useNavigationStore();
  const loading = projectSlug !== currentSlug;

  useEffect(() => {
    if (!projectSlug) return;
    fetch(`/api/projects/${projectSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data.data || null);
        setCurrentSlug(projectSlug);
      })
      .catch(() => {
        setProject(null);
        setCurrentSlug(projectSlug);
      });
  }, [projectSlug]);

  if (loading) return <DetailSkeleton />;

  if (!project) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy mb-4">Project Not Found</h2>
          <Button variant="outline" onClick={() => navigateTo('projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </main>
    );
  }

  const techTags = project.technologies
    ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <Image
          src={project.coverImage || '/images/projects-hero.jpg'}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => navigateTo('projects')}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </button>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
          >
            {project.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Badge className="bg-gold text-navy text-sm font-medium border-0">
              {project.category}
            </Badge>
            {project.clientName && (
              <Badge variant="outline" className="border-white/30 text-white text-sm">
                {project.clientName}
              </Badge>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Challenge */}
          {project.challenge && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">The Challenge</h2>
              <div className="text-slate leading-relaxed whitespace-pre-line">
                {project.challenge}
              </div>
            </motion.div>
          )}

          {/* Solution */}
          {project.solution && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">Our Solution</h2>
              <div className="text-slate leading-relaxed whitespace-pre-line">
                {project.solution}
              </div>
            </motion.div>
          )}

          {/* Results */}
          {project.results && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">Results</h2>
              <div className="text-slate leading-relaxed whitespace-pre-line">
                {project.results}
              </div>
            </motion.div>
          )}

          {/* Technologies */}
          {techTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">Technologies Used</h2>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="flex flex-wrap gap-3"
              >
                {techTags.map((tech) => (
                  <motion.span
                    key={tech}
                    variants={itemVariants}
                    className="px-4 py-2 bg-light-gray text-slate text-sm font-medium rounded-lg"
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Visit Website Button */}
          {project.clientUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="pt-4"
            >
              <a
                href={project.clientUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-navy font-semibold px-8 py-3.5 rounded-lg transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Visit Website
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
