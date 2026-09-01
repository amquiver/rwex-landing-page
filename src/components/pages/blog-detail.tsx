'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Linkedin,
  Twitter,
  Facebook,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigationStore } from '@/store/navigation';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string | null;
  publishedAt: string;
  readingTime?: number;
  category: { name: string } | null;
}

interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string;
  readingTime?: number;
  category: { name: string } | null;
}

interface TocItem {
  id: string;
  text: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
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
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-40 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-3/4 mb-6" />
          <div className="flex gap-6 mb-8">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="w-full h-80 rounded-xl mb-12" />
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function extractToc(content: string): TocItem[] {
  const headings: TocItem[] = [];
  const regex = /^## (.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ id, text });
  }
  return headings;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function BlogDetailPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [activeTocId, setActiveTocId] = useState<string>('');
  const { blogSlug, navigateTo } = useNavigationStore();
  const loading = blogSlug !== currentSlug;

  const postContent = post?.content ?? '';

  const tocItems = useMemo(() => {
    if (!postContent) return [];
    return extractToc(postContent);
  }, [postContent]);

  useEffect(() => {
    if (!blogSlug) return;

    Promise.all([
      fetch(`/api/blog/${blogSlug}`).then((r) => r.json()),
      fetch(`/api/blog?exclude=${blogSlug}&limit=3`).then((r) => r.json()),
    ])
      .then(([postData, relatedData]) => {
        setPost(postData.data || null);
        setRelatedPosts(relatedData.data || []);
        setCurrentSlug(blogSlug);
      })
      .catch(() => {
        setPost(null);
        setRelatedPosts([]);
        setCurrentSlug(blogSlug);
      });
  }, [blogSlug]);

  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTocId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    const timer = setTimeout(() => {
      tocItems.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [tocItems]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const scrollToHeading = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (loading) return <DetailSkeleton />;

  if (!post) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy mb-4">Article Not Found</h2>
          <button
            onClick={() => navigateTo('blog')}
            className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Article Content */}
      <article className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar: TOC (desktop only) */}
            {tocItems.length > 0 && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="hidden lg:block w-64 shrink-0"
              >
                <div className="sticky top-28">
                  <h4 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">
                    Table of Contents
                  </h4>
                  <nav aria-label="Table of contents">
                    <ul className="space-y-2 border-l-2 border-border pl-4">
                      {tocItems.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToHeading(item.id);
                            }}
                            className={`block text-sm py-1 transition-colors duration-200 focus:outline-none ${
                              activeTocId === item.id
                                ? 'text-gold font-semibold border-l-2 border-gold -ml-[6px] pl-4'
                                : 'text-slate/70 hover:text-navy'
                            }`}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </motion.aside>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0 max-w-3xl">
              {/* Back Link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <button
                  onClick={() => navigateTo('blog')}
                  className="inline-flex items-center gap-2 text-slate/70 hover:text-navy text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </button>
              </motion.div>

              {/* Category Badge */}
              {post.category && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-4"
                >
                  <Badge className="bg-gold text-navy text-xs font-semibold border-0">
                    {post.category.name}
                  </Badge>
                </motion.div>
              )}

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-6 leading-tight"
              >
                {post.title}
              </motion.h1>

              {/* Meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate/70 text-sm mb-8 pb-8 border-b border-border"
              >
                {post.author && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                )}
                {post.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.publishedAt)}
                  </span>
                )}
                {post.readingTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {post.readingTime} min read
                  </span>
                )}
              </motion.div>

              {/* Cover Image */}
              {post.coverImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative rounded-xl overflow-hidden mb-12"
                >
                  <div className="relative h-[300px] sm:h-[400px] md:h-[480px]">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </motion.div>
              )}

              {/* Markdown Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="prose-custom"
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl md:text-4xl font-bold text-navy mt-12 mb-4 first:mt-0">{children}</h1>
                    ),
                    h2: ({ children, id }) => (
                      <h2
                        id={typeof id === 'string' ? id : undefined}
                        className="text-2xl md:text-3xl font-bold text-navy mt-10 mb-4 scroll-mt-28"
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl md:text-2xl font-semibold text-navy mt-8 mb-3">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-slate text-base md:text-lg leading-relaxed mb-6">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-slate text-base md:text-lg leading-relaxed">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-slate text-base md:text-lg leading-relaxed">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-slate leading-relaxed">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gold pl-6 py-2 my-8 bg-light-gray rounded-r-lg">
                        <div className="text-slate italic">{children}</div>
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-navy">{children}</strong>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        className="text-gold hover:text-gold-hover underline underline-offset-4 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="bg-light-gray text-navy px-1.5 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className={`${className} block bg-navy text-white p-6 rounded-xl overflow-x-auto text-sm`}>
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-navy rounded-xl overflow-x-auto my-8">{children}</pre>
                    ),
                    hr: () => (
                      <hr className="my-10 border-border" />
                    ),
                    img: ({ src, alt }) => (
                      <div className="my-8 rounded-xl overflow-hidden">
                        <img src={src} alt={alt || ''} className="w-full h-auto" />
                      </div>
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </motion.div>

              {/* Share Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-12 pt-8 border-t border-border"
              >
                <h4 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">
                  Share This Article
                </h4>
                <div className="flex gap-3">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="w-10 h-10 rounded-lg bg-light-gray hover:bg-[#0077B5] hover:text-white text-slate flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X"
                    className="w-10 h-10 rounded-lg bg-light-gray hover:bg-black hover:text-white text-slate flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className="w-10 h-10 rounded-lg bg-light-gray hover:bg-[#1877F2] hover:text-white text-slate flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-light-gray py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center mb-14"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">Related Articles</h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {relatedPosts.map((rp) => (
                <motion.article
                  key={rp.id}
                  variants={cardVariants}
                  className="group bg-white rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => navigateTo('blog-detail', rp.slug)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={rp.coverImage || '/images/blog-hero.jpg'}
                      alt={rp.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    {rp.category && (
                      <Badge variant="secondary" className="bg-gold/10 text-gold text-xs font-medium border-0 mb-3">
                        {rp.category.name}
                      </Badge>
                    )}
                    <h3 className="text-navy font-semibold text-lg mb-2 group-hover:text-gold transition-colors duration-300 line-clamp-2">
                      {rp.title}
                    </h3>
                    <div className="flex items-center gap-3 text-slate/70 text-xs">
                      {rp.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(rp.publishedAt)}
                        </span>
                      )}
                      {rp.readingTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rp.readingTime} min
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-navy py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Let&apos;s Build Something Together
            </h2>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-8">
              Have a project in mind? We&apos;d love to hear about it. Let&apos;s discuss how we can help bring your vision to life.
            </p>
            <button
              onClick={() => navigateTo('contact')}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-navy font-semibold px-8 py-3.5 rounded-lg transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
