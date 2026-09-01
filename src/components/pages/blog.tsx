'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigationStore } from '@/store/navigation';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  isFeatured: boolean;
  category: { name: string } | null;
  publishedAt: string;
  readingTime?: number;
}

interface Category {
  id: string;
  name: string;
}

const ITEMS_PER_PAGE = 6;

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
};

function BlogSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <Skeleton className="w-full h-52" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-20 rounded-full" />
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

function FeaturedSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <Skeleton className="w-full h-64 md:h-80" />
      <div className="p-8 space-y-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const { navigateTo } = useNavigationStore();

  useEffect(() => {
    Promise.all([
      fetch('/api/blog').then((r) => r.json()),
      fetch('/api/blog?categories=true').then((r) => r.json()),
    ])
      .then(([postsData, catsData]) => {
        setPosts(postsData.data || []);
        setCategories(catsData.data || []);
      })
      .catch(() => {
        setPosts([]);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const featuredPost = useMemo(() => {
    return posts.find((p) => p.isFeatured);
  }, [posts]);

  const regularPosts = useMemo(() => {
    return posts.filter((p) => !p.isFeatured);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = regularPosts;

    if (activeCategory !== 'All') {
      result = result.filter(
        (p) => p.category?.name.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      );
    }

    return result;
  }, [regularPosts, activeCategory, searchQuery]);

  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const hasMore = visibleCount < filteredPosts.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/blog-hero.jpg"
            alt="Insights & Ideas"
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
            INSIGHTS &amp; IDEAS
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="h-1 w-24 bg-gold mx-auto"
          />
        </div>
      </section>

      {/* Search + Categories + Grid */}
      <section className="bg-light-gray py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate/70" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="pl-11 bg-white border-border/60 focus-visible:ring-gold"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-14"
          >
            <button
              onClick={() => {
                setActiveCategory('All');
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                activeCategory === 'All'
                  ? 'bg-gold text-navy shadow-sm'
                  : 'bg-white text-slate hover:bg-white/80 border border-border'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  activeCategory === cat.name
                    ? 'bg-gold text-navy shadow-sm'
                    : 'bg-white text-slate hover:bg-white/80 border border-border'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>

          {loading ? (
            <>
              <FeaturedSkeleton />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <BlogSkeleton key={i} />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Featured Article */}
              {featuredPost && activeCategory === 'All' && !searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <article
                    className="group bg-white rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer grid grid-cols-1 md:grid-cols-2"
                    onClick={() => navigateTo('blog-detail', featuredPost.slug)}
                  >
                    <div className="relative h-64 md:h-auto min-h-[250px] overflow-hidden">
                      <Image
                        src={featuredPost.coverImage || '/images/blog-hero.jpg'}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge className="absolute top-4 left-4 bg-gold text-navy text-xs font-semibold border-0">
                        Featured
                      </Badge>
                    </div>
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      {featuredPost.category && (
                        <Badge
                          variant="secondary"
                          className="bg-gold/10 text-gold text-xs font-medium border-0 mb-4 w-fit"
                        >
                          {featuredPost.category.name}
                        </Badge>
                      )}
                      <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3 group-hover:text-gold transition-colors duration-300">
                        {featuredPost.title}
                      </h2>
                      <p className="text-slate/70 leading-relaxed mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-slate/70 text-sm mb-6">
                        {featuredPost.publishedAt && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDate(featuredPost.publishedAt)}
                          </span>
                        )}
                        {featuredPost.readingTime && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {featuredPost.readingTime} min read
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold group/link">
                        Read Article
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </motion.div>
              )}

              {/* Articles Grid */}
              {visiblePosts.length > 0 ? (
                <>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.05 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {visiblePosts.map((post) => (
                      <motion.article
                        key={post.id}
                        variants={cardVariants}
                        className="group bg-white rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => navigateTo('blog-detail', post.slug)}
                      >
                        <div className="relative h-52 overflow-hidden">
                          <Image
                            src={post.coverImage || '/images/blog-hero.jpg'}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
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
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-slate/70 text-xs">
                              {post.publishedAt && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(post.publishedAt)}
                                </span>
                              )}
                              {post.readingTime && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {post.readingTime} min
                                </span>
                              )}
                            </div>
                            <span className="inline-flex items-center gap-1 text-gold text-xs font-semibold">
                              Read
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </motion.div>

                  {/* Load More */}
                  {hasMore && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center mt-12"
                    >
                      <button
                        onClick={loadMore}
                        className="px-8 py-3 bg-white border border-border text-slate font-medium rounded-lg hover:border-gold hover:text-gold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        Load More Articles
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-slate/70 text-lg">No articles found matching your criteria.</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
