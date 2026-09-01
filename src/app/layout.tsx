import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const siteUrl = 'https://rwextech.com';
const siteName = 'RWEXTECH';
const siteDescription =
  'RWEXTECH is a leading software development company in Tanzania. We design and develop modern websites, mobile applications, custom software, e-commerce platforms, and digital solutions that help businesses automate operations and grow.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'RWEXTECH — Software Development & Digital Solutions in Tanzania',
    template: '%s | RWEXTECH',
  },
  description: siteDescription,
  keywords: [
    'software development Tanzania',
    'web development Tanzania',
    'mobile app development Tanzania',
    'custom software development',
    'digital solutions Tanzania',
    'UI/UX design Tanzania',
    'e-commerce development',
    'business automation',
    'cloud solutions',
    'ERP development',
    'school management system',
    'accounting software',
    'healthcare software',
    'fintech solutions',
    'React development',
    'Next.js development',
    'Flutter development',
    'Dar es Salaam web developer',
    'Tanzania IT company',
    'RWEXTECH',
  ],
  authors: [{ name: 'RWEXTECH', url: siteUrl }],
  creator: 'RWEXTECH',
  publisher: 'RWEXTECH',
  category: 'technology',
  manifest: '/manifest.json',
  openGraph: {
    title: 'RWEXTECH — Software Development & Digital Solutions in Tanzania',
    description:
      'We build modern websites, mobile apps, custom software, and digital platforms that move businesses forward.',
    url: siteUrl,
    siteName,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RWEXTECH — Software Development & Digital Solutions in Tanzania',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RWEXTECH — Software Development & Digital Solutions',
    description:
      'We build modern websites, mobile apps, custom software, and digital platforms that move businesses forward.',
    images: ['/images/og-image.png'],
    creator: '@rwextech',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0A1931" />
        <meta name="color-scheme" content="light dark" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'RWEXTECH',
              alternateName: 'Rwex Tech Digital Solutions',
              url: siteUrl,
              logo: `${siteUrl}/images/logo.png`,
              description: siteDescription,
              foundingLocation: {
                '@type': 'Place',
                name: 'Dar es Salaam, Tanzania',
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Dar es Salaam',
                addressCountry: 'TZ',
              },
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+255757337929',
                  contactType: 'sales',
                  areaServed: 'TZ',
                  availableLanguage: ['English', 'Swahili'],
                },
                {
                  '@type': 'ContactPoint',
                  telephone: '+255757337929',
                  contactType: 'customer support',
                  areaServed: 'TZ',
                  availableLanguage: ['English', 'Swahili'],
                },
              ],
              sameAs: [
                'https://instagram.com/rwextech',
                'https://linkedin.com/company/rwextech',
                'https://github.com/rwextech',
                'https://facebook.com/rwextech',
              ],
              knowsAbout: [
                'Software Development',
                'Web Development',
                'Mobile App Development',
                'UI/UX Design',
                'Cloud Computing',
                'E-commerce Solutions',
              ],
            }),
          }}
        />

        {/* WebSite Schema with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'RWEXTECH',
              url: siteUrl,
              description: siteDescription,
              publisher: {
                '@type': 'Organization',
                name: 'RWEXTECH',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              serviceType: 'Software Development',
              provider: {
                '@type': 'Organization',
                name: 'RWEXTECH',
                url: siteUrl,
              },
              areaServed: {
                '@type': 'Country',
                name: 'Tanzania',
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Software Development Services',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Web Development',
                      description: 'Custom website and web application development using modern technologies like React, Next.js, and TypeScript.',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Mobile App Development',
                      description: 'Native and cross-platform mobile application development using Flutter and React Native.',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Custom Software Development',
                      description: 'Bespoke software solutions including ERP, CRM, and business management systems.',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'UI/UX Design',
                      description: 'User research, wireframing, prototyping, and visual design for intuitive digital products.',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Cloud & Deployment',
                      description: 'Cloud infrastructure setup, deployment, monitoring, and scalable hosting solutions.',
                    },
                  },
                ],
              },
            }),
          }}
        />

        {/* BreadcrumbList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: siteUrl,
                },
              ],
            }),
          }}
        />

        {/* FAQPage Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What types of software does RWEXTECH develop?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'We build a wide range of digital solutions including web applications, mobile apps, custom enterprise software, e-commerce platforms, content management systems, and cloud-based SaaS products.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How long does a typical project take?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Project timelines vary based on complexity and scope. A simple website may take 4-6 weeks, while a full custom software platform can take 3-6 months or more.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is your development process?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'We follow a structured 6-step process: Discover, Design, Develop, Test, Deploy, and Support with client check-ins at every phase.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do you provide ongoing support and maintenance?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, we offer comprehensive post-launch support including bug fixes, security updates, performance monitoring, feature enhancements, and technical consulting.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How much does a custom software project cost?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Cost depends on project scope, complexity, technology stack, and timeline. We provide detailed quotes after our initial discovery consultation.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Which technologies do you work with?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'We work with modern technologies including React, Next.js, TypeScript, Node.js, Python, Flutter, React Native, PostgreSQL, and cloud platforms like AWS and Google Cloud.',
                  },
                },
              ],
            }),
          }}
        />

        {/* LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'RWEXTECH',
              url: siteUrl,
              telephone: '+255757337929',
              email: 'info@rwextech.com',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Dar es Salaam',
                addressCountry: 'TZ',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: -6.7924,
                longitude: 39.2083,
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:00',
                closes: '18:00',
              },
              priceRange: '$$$',
              image: `${siteUrl}/images/logo.png`,
              description: siteDescription,
            }),
          }}
        />
      </head>
      <body className={`${plusJakarta.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
