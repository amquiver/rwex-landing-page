'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigationStore } from '@/store/navigation';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  category: { name: string } | null;
  publishedAt: string;
  readingTime?: number;
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

function BlogSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigateTo } = useNavigationStore();

  useEffect(() => {
    fetch('/api/blog?limit=3')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.data || []);
      })
      .catch(() => {
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-20 md:py-24" aria-labelledby="blog-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 id="blog-heading" className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Insights &amp; Ideas
          </h2>
          <p className="text-slate text-base md:text-lg leading-relaxed">
            Thoughts on technology, design, and building great digital products.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {posts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={cardVariants}
                  className="group bg-white rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => navigateTo('blog-detail', post.slug)}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.coverImage || '/images/blog-hero.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {post.category && (
                      <Badge
                        variant="secondary"
                        className="bg-gold text-navy text-xs font-medium border-0 mb-3"
                      >
                        {post.category.name}
                      </Badge>
                    )}

                    <h3 className="text-navy font-semibold text-lg mb-2 group-hover:text-gold transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-slate/70 text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-slate/70 text-xs">
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt)}
                        </span>
                      )}
                      {post.readingTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingTime} min read
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
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
                onClick={() => navigateTo('blog')}
                className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
              >
                View All Articles
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate/70">Blog articles coming soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}
