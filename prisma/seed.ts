import { db } from '../src/lib/db';
import { hashPassword } from '../src/lib/auth';

async function seed() {
  // Services
  const services = [
    {
      title: 'Web Development',
      slug: 'web-development',
      description: 'Modern, responsive websites and scalable web applications built for high performance, dynamic content management, and search engine visibility.',
      icon: 'Globe',
      highlights: JSON.stringify(['Responsive website development', 'High-performance web applications', 'SEO & speed optimization']),
      ctaText: 'Build Your Website',
      sortOrder: 1,
      isPublished: true,
    },
    {
      title: 'Custom Software Solutions',
      slug: 'custom-software-solutions',
      description: 'Tailored enterprise software, administrative portals, and automated business platforms designed around your specific operational workflows.',
      icon: 'Server',
      highlights: JSON.stringify(['Tailored business management systems', 'Database architecture & result portals', 'API integration & process automation']),
      ctaText: 'Request Custom Solution',
      sortOrder: 2,
      isPublished: true,
    },
    {
      title: 'UI/UX Design',
      slug: 'ui-ux-design',
      description: 'Intuitive, user-centered digital interfaces crafted through wireframing, interactive prototyping, and system refactoring to maximize engagement.',
      icon: 'Layout',
      highlights: JSON.stringify(['User-centered web & mobile interfaces', 'Interactive prototyping & wireframing', 'Legacy interface & product redesign']),
      ctaText: 'Design Your Product',
      sortOrder: 3,
      isPublished: true,
    },
    {
      title: 'Graphics Design',
      slug: 'graphics-design',
      description: 'Professional visual identities, marketing assets, and brand design elements crafted to project authority, trust, and creative excellence.',
      icon: 'Palette',
      highlights: JSON.stringify(['Corporate identity & logo design', 'Marketing collateral & digital assets', 'Custom visual branding systems']),
      ctaText: 'Start Branding',
      sortOrder: 4,
      isPublished: true,
    },
  ];

  for (const service of services) {
    await db.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log('✅ Services seeded');

  // Projects
  const projects = [
    {
      title: 'EduTrack School Management System',
      slug: 'edutrack-school-management',
      description: 'A comprehensive school management platform handling student enrollment, academic records, fee management, and parent-teacher communication.',
      challenge: 'The school was managing 2,000+ students with spreadsheets and paper records, leading to data loss, delayed report generation, and poor parent communication.',
      solution: 'We built a centralized web-based platform with role-based dashboards for administrators, teachers, students, and parents. Features include automated grade calculation, fee tracking, attendance management, and SMS notifications.',
      results: 'Reduced administrative workload by 60%, eliminated paper-based records, improved parent engagement by 45%, and enabled real-time academic reporting.',
      category: 'business-systems',
      clientName: 'Dar es Salaam International Academy',
      technologies: 'React, Next.js, Node.js, PostgreSQL, Tailwind CSS',
      coverImage: '/images/projects-hero.jpg',
      isFeatured: true,
      isPublished: true,
    },
    {
      title: 'FreshMart E-Commerce Platform',
      slug: 'freshmart-ecommerce',
      description: 'A modern e-commerce platform for a grocery chain with real-time inventory management, delivery tracking, and integrated payment processing.',
      challenge: 'The client needed to transition from in-store only to omnichannel sales while managing perishable inventory across multiple locations.',
      solution: 'We developed a full-stack e-commerce application with real-time inventory sync, location-based delivery zones, M-Pesa integration, and an admin dashboard for order and inventory management.',
      results: 'Increased online sales by 300% in the first 6 months, reduced inventory waste by 25%, and achieved a 4.5-star customer satisfaction rating.',
      category: 'web',
      clientName: 'FreshMart Tanzania',
      technologies: 'Next.js, TypeScript, Prisma, Stripe, Tailwind CSS',
      coverImage: '/images/projects-hero.jpg',
      isFeatured: true,
      isPublished: true,
    },
    {
      title: 'MedConnect Health Portal',
      slug: 'medconnect-health-portal',
      description: 'A patient management and telemedicine platform connecting healthcare providers with patients for consultations, appointment scheduling, and medical records.',
      challenge: 'Healthcare facilities struggled with fragmented patient records, manual appointment scheduling, and no remote consultation capability.',
      solution: 'Built a HIPAA-compliant health portal with electronic health records, video consultation, automated appointment reminders, and pharmacy integration.',
      results: 'Enabled 500+ remote consultations monthly, reduced no-show rates by 40%, and digitized 15,000+ patient records.',
      category: 'web',
      clientName: 'MedConnect Health Services',
      technologies: 'React, Node.js, PostgreSQL, WebRTC, Docker',
      coverImage: '/images/projects-hero.jpg',
      isFeatured: true,
      isPublished: true,
    },
    {
      title: 'AgriYield Farm Analytics App',
      slug: 'agriyield-farm-analytics',
      description: 'A mobile application providing smallholder farmers with crop analytics, weather forecasts, market pricing, and farming best practices.',
      challenge: 'Smallholder farmers lacked access to real-time market data, weather information, and agricultural best practices, limiting their productivity and income.',
      solution: 'Developed a mobile-first progressive web app with offline capability, push notifications for weather alerts, market price tracking, and a knowledge base of farming techniques.',
      results: 'Reached 10,000+ farmers in 6 months, improved crop yield by 20% for active users, and connected farmers to 50+ new market channels.',
      category: 'mobile',
      clientName: 'AgriTech Foundation',
      technologies: 'React Native, Node.js, MongoDB, Push Notifications',
      coverImage: '/images/projects-hero.jpg',
      isFeatured: false,
      isPublished: true,
    },
    {
      title: 'FinanceFlow Accounting System',
      slug: 'financeflow-accounting',
      description: 'A cloud-based accounting and financial management system for SMEs with automated invoicing, expense tracking, and financial reporting.',
      challenge: 'Growing businesses were using multiple disconnected tools for invoicing, expense tracking, and reporting, leading to financial blind spots.',
      solution: 'Created an integrated financial platform with automated invoice generation, bank reconciliation, multi-currency support, and customizable financial dashboards.',
      results: 'Reduced month-end closing time by 70%, improved cash flow visibility by 90%, and onboarded 200+ businesses in the first year.',
      category: 'business-systems',
      clientName: 'SME Finance Solutions',
      technologies: 'Next.js, TypeScript, PostgreSQL, Prisma, Chart.js',
      coverImage: '/images/projects-hero.jpg',
      isFeatured: true,
      isPublished: true,
    },
    {
      title: 'TravelEase Booking Platform',
      slug: 'travelease-booking',
      description: 'A comprehensive travel booking platform for a tour operator with itinerary management, online payments, and customer review system.',
      challenge: 'The tour operator managed bookings manually through WhatsApp and email, causing double-bookings, delayed confirmations, and poor customer experience.',
      solution: 'Built a full-featured booking platform with real-time availability, automated confirmation emails, secure online payments, and a customer review and rating system.',
      results: 'Eliminated double-bookings, reduced booking confirmation time from hours to seconds, and increased online bookings by 250%.',
      category: 'web',
      clientName: 'Safari Adventures Tanzania',
      technologies: 'React, Node.js, PostgreSQL, Stripe, Tailwind CSS',
      coverImage: '/images/projects-hero.jpg',
      isFeatured: false,
      isPublished: true,
    },
  ];

  for (const project of projects) {
    await db.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
  console.log('✅ Projects seeded');

  // Testimonials
  const testimonials = [
    {
      name: 'James Mwangi',
      position: 'Director',
      company: 'Dar es Salaam International Academy',
      content: 'RWEXTECH transformed how we manage our school. The system they built has eliminated months of manual work and our teachers can now focus on what matters most — educating students. Their team was professional, responsive, and truly understood our needs.',
      isPublished: true,
    },
    {
      name: 'Sarah Kimaro',
      position: 'CEO',
      company: 'FreshMart Tanzania',
      content: 'Moving our business online seemed daunting until we partnered with RWEXTECH. They delivered a beautiful, functional e-commerce platform that tripled our online sales. The ongoing support has been exceptional.',
      isPublished: true,
    },
    {
      name: 'Dr. Ahmed Hassan',
      position: 'Medical Director',
      company: 'MedConnect Health Services',
      content: 'The telemedicine platform RWEXTECH built for us has been a game-changer, especially during peak periods. Our patients can now consult with doctors remotely, and the system manages everything from scheduling to records seamlessly.',
      isPublished: true,
    },
    {
      name: 'Grace Mwakyusa',
      position: 'Operations Manager',
      company: 'Safari Adventures Tanzania',
      content: 'Before RWEXTECH, we were drowning in manual bookings. Now everything is automated — from availability checks to payment processing. Our customers love the booking experience and so do we.',
      isPublished: true,
    },
  ];

  for (const testimonial of testimonials) {
    await db.testimonial.create({ data: testimonial });
  }
  console.log('✅ Testimonials seeded');

  // Blog Categories
  const categories = [
    { name: 'Software Development', slug: 'software-development' },
    { name: 'Business Technology', slug: 'business-technology' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Mobile Development', slug: 'mobile-development' },
    { name: 'UI/UX', slug: 'ui-ux' },
    { name: 'AI & Automation', slug: 'ai-automation' },
    { name: 'Cybersecurity', slug: 'cybersecurity' },
    { name: 'Digital Transformation', slug: 'digital-transformation' },
  ];

  for (const cat of categories) {
    await db.blogCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Blog categories seeded');

  // Blog Tags
  const tags = [
    { name: 'React', slug: 'react' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'UI/UX Design', slug: 'ui-ux-design' },
    { name: 'Mobile Apps', slug: 'mobile-apps' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'DevOps', slug: 'devops' },
    { name: 'Startups', slug: 'startups' },
    { name: 'Tanzania Tech', slug: 'tanzania-tech' },
  ];

  for (const tag of tags) {
    await db.blogTag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
  }
  console.log('✅ Blog tags seeded');

  // Blog Posts
  const blogPosts = [
    {
      title: 'Why Every Tanzanian Business Needs a Professional Website in 2026',
      slug: 'why-every-tanzanian-business-needs-professional-website',
      excerpt: 'In an increasingly digital world, your website is often the first impression potential customers have of your business. Here is why investing in a professional website is no longer optional.',
      content: `# Why Every Tanzanian Business Needs a Professional Website in 2026

The digital landscape in Tanzania is evolving rapidly. With increasing internet penetration and mobile device adoption, having a professional online presence has shifted from being a luxury to a necessity.

## The Digital Shift in Tanzania

Tanzania has seen remarkable growth in digital adoption. With over 30 million internet users and growing, businesses that fail to establish an online presence risk being invisible to a significant portion of their potential market.

## First Impressions Matter

Your website is often the first point of contact between your business and potential customers. A professionally designed website communicates credibility, trustworthiness, and attention to detail.

## Key Benefits

- **24/7 Availability**: Your website works around the clock, even when your physical location is closed
- **Reach**: Expand your market beyond geographical boundaries
- **Credibility**: A professional website builds trust with potential customers
- **Marketing**: Cost-effective marketing channel compared to traditional methods
- **Data**: Gain insights into customer behavior and preferences

## What Makes a Professional Website?

A professional website goes beyond just looking good. It needs to be fast, mobile-responsive, accessible, search-engine optimized, and designed with clear conversion paths.

## Getting Started

The journey to a professional web presence starts with understanding your business goals, your target audience, and the unique value you offer. At RWEXTECH, we help businesses navigate this journey with custom solutions tailored to their specific needs.

*Ready to establish your digital presence? Let us help you build something remarkable.*`,
      author: 'RWEXTECH Team',
      readingTime: 5,
      status: 'published',
      isFeatured: true,
      seoTitle: 'Why Every Tanzanian Business Needs a Website in 2026',
      seoDescription: 'Discover why having a professional website is essential for Tanzanian businesses in 2026. Learn about the benefits and how to get started.',
    },
    {
      title: 'Choosing the Right Technology Stack for Your Business Application',
      slug: 'choosing-right-technology-stack-business-application',
      excerpt: 'The technology stack you choose can make or break your project. Here is a practical guide to selecting the right technologies for your business application.',
      content: `# Choosing the Right Technology Stack for Your Business Application

One of the most critical decisions in software development is choosing the right technology stack. This decision affects everything from development speed to long-term maintainability.

## What is a Technology Stack?

A technology stack is the combination of programming languages, frameworks, libraries, and tools used to build and run an application.

## Factors to Consider

### 1. Project Requirements
Start with understanding what you are building. A simple marketing website has very different requirements from a real-time analytics dashboard.

### 2. Team Expertise
The best technology is one your team can work with effectively. Consider the learning curve and available talent pool.

### 3. Scalability
Think about where your business will be in 3-5 years. Choose technologies that can grow with you.

### 4. Community and Support
Technologies with active communities offer better documentation, more third-party libraries, and easier problem-solving.

### 5. Performance Requirements
Some applications require real-time processing, while others need to handle large amounts of data. Match the technology to your performance needs.

## Our Recommended Stacks

**For Web Applications**: React/Next.js + Node.js + PostgreSQL
**For Mobile Apps**: React Native + Node.js
**For E-commerce**: Next.js + Prisma + Stripe
**For Business Systems**: Next.js + TypeScript + PostgreSQL

## Conclusion

There is no one-size-fits-all answer. The right stack depends on your specific needs, budget, timeline, and long-term goals. At RWEXTECH, we help businesses make informed technology decisions that serve them well into the future.`,
      author: 'RWEXTECH Team',
      readingTime: 6,
      status: 'published',
      isFeatured: true,
      seoTitle: 'How to Choose the Right Technology Stack',
      seoDescription: 'A practical guide to selecting the right technology stack for your business application. Learn key factors to consider.',
    },
    {
      title: 'The Real Cost of Custom Software Development in Tanzania',
      slug: 'real-cost-custom-software-development-tanzania',
      excerpt: 'Understanding software development costs helps you plan better and make smarter investments. Here is a transparent breakdown of what goes into custom software pricing.',
      content: `# The Real Cost of Custom Software Development in Tanzania

One of the most common questions we receive is about the cost of custom software development. While every project is unique, understanding the factors that influence cost can help you plan effectively.

## What Drives Software Development Costs?

### 1. Scope and Complexity
The more features and complexity your project requires, the higher the cost. A simple website will cost significantly less than a full business management system.

### 2. Design Requirements
Custom UI/UX design, animations, and responsive layouts add to the development time and cost.

### 3. Technology Choices
Some technologies require more specialized expertise, which can affect pricing.

### 4. Timeline
Faster delivery often requires more resources, which increases the cost.

### 5. Ongoing Maintenance
Software is not a one-time investment. Budget for ongoing maintenance, updates, and support.

## Typical Price Ranges

- **Simple Website**: TZS 2M - 8M
- **Web Application**: TZS 8M - 30M
- **Mobile App**: TZS 10M - 40M
- **Business System**: TZS 15M - 50M+

*Note: These are indicative ranges and actual costs depend on specific requirements.*

## Investment vs. Cost

Think of software development as an investment rather than a cost. A well-built system can save your business time, reduce errors, improve customer experience, and generate revenue for years to come.

## How We Work

At RWEXTECH, we provide transparent pricing, detailed project plans, and regular progress updates. We work with businesses of all sizes to deliver solutions that fit their budget while meeting their needs.`,
      author: 'RWEXTECH Team',
      readingTime: 7,
      status: 'published',
      isFeatured: false,
      seoTitle: 'Custom Software Development Cost in Tanzania',
      seoDescription: 'Understand the real cost of custom software development in Tanzania. Transparent breakdown of pricing factors.',
    },
  ];

  for (const post of blogPosts) {
    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log('✅ Blog posts seeded');

  // Site Settings
  const settings = [
    { key: 'company_name', value: 'RWEXTECH' },
    { key: 'email', value: 'info@rwextech.com' },
    { key: 'phone', value: '+255757337929' },
    { key: 'whatsapp', value: '255757337929' },
    { key: 'address', value: 'Dar es Salaam, Tanzania' },
    { key: 'instagram', value: 'https://instagram.com/rwextech' },
    { key: 'linkedin', value: 'https://linkedin.com/company/rwextech' },
    { key: 'github', value: 'https://github.com/rwextech' },
    { key: 'facebook', value: 'https://facebook.com/rwextech' },
    { key: 'footer_text', value: 'Building digital solutions that move businesses forward.' },
  ];

  for (const setting of settings) {
    await db.siteSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }
  console.log('✅ Site settings seeded');

  // Clients
  const clients = [
    { name: 'Dar es Salaam International Academy', industry: 'Education', isVisible: true },
    { name: 'FreshMart Tanzania', industry: 'E-commerce', isVisible: true },
    { name: 'MedConnect Health Services', industry: 'Healthcare', isVisible: true },
    { name: 'Safari Adventures Tanzania', industry: 'Tourism', isVisible: true },
    { name: 'SME Finance Solutions', industry: 'Finance', isVisible: true },
    { name: 'AgriTech Foundation', industry: 'Agriculture', isVisible: true },
  ];

  for (const client of clients) {
    await db.client.create({ data: client });
  }
  console.log('✅ Clients seeded');

  // Admin user (password hashed with bcrypt)
  const adminPassword = await hashPassword('Admin@2025'); // CHANGE IN PRODUCTION
  await db.user.upsert({
    where: { email: 'admin@rwextech.com' },
    update: {},
    create: {
      email: 'admin@rwextech.com',
      name: 'RWEXTECH Admin',
      role: 'admin',
      password: adminPassword,
    },
  });
  console.log('✅ Admin user seeded');

  console.log('\n🎉 All data seeded successfully!');
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0));
