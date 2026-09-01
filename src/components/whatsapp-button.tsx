'use client';

import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function WhatsAppButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href="https://wa.me/255757337929"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          style={{ backgroundColor: '#25D366' }}
          aria-label="Chat with us on WhatsApp"
        >
          {/* WhatsApp SVG Icon */}
          <svg
            viewBox="0 0 32 32"
            className="w-7 h-7 fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.056 9.38L1.058 31.29l6.12-1.96A15.92 15.92 0 0016 32c8.822 0 16-7.178 16-16S24.824 0 16.004 0zm9.31 22.598c-.39 1.1-1.932 2.014-3.168 2.28-.844.18-1.946.324-5.66-1.216-4.752-1.97-7.808-6.818-8.044-7.128-.228-.31-1.928-2.568-1.928-4.896s1.22-3.476 1.654-3.95c.434-.476.948-.596 1.264-.596.316 0 .632.004.908.016.292.014.684-.11 1.07.816.39.948 1.332 3.278 1.448 3.514.118.236.196.512.04.824-.158.316-.236.512-.472.788-.236.276-.496.616-.708.828-.236.236-.482.492-.206.964.274.472 1.222 2.016 2.624 3.266 1.802 1.604 3.324 2.102 3.796 2.338.472.236.748.198 1.022-.118.274-.316 1.184-1.38 1.5-1.852.316-.472.632-.394 1.064-.236.434.158 2.748 1.296 3.22 1.532.472.236.788.354.904.548.118.196.118 1.12-.272 2.222z" />
          </svg>
          {/* Pulse ring */}
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: '#25D366' }}
            animate={{
              scale: [1, 1.4, 1.6],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        </a>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        className="bg-navy text-white text-sm border-navy/50"
      >
        Chat with us
      </TooltipContent>
    </Tooltip>
  );
}
