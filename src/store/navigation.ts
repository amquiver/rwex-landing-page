import { create } from 'zustand';

type Page = 'home' | 'about' | 'services' | 'solutions' | 'projects' | 'blog' | 'contact' | 'faq' | 'project-detail' | 'blog-detail';

interface NavigationState {
  currentPage: Page;
  previousPage: Page;
  projectSlug: string | null;
  blogSlug: string | null;
  isMobileMenuOpen: boolean;
  isScrolled: boolean;
  setCurrentPage: (page: Page) => void;
  setProjectSlug: (slug: string | null) => void;
  setBlogSlug: (slug: string | null) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setIsScrolled: (scrolled: boolean) => void;
  navigateTo: (page: Page, slug?: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'home',
  previousPage: 'home',
  projectSlug: null,
  blogSlug: null,
  isMobileMenuOpen: false,
  isScrolled: false,
  setCurrentPage: (page) =>
    set((state) => ({ previousPage: state.currentPage, currentPage: page })),
  setProjectSlug: (slug) => set({ projectSlug: slug }),
  setBlogSlug: (slug) => set({ blogSlug: slug }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setIsScrolled: (scrolled) => set({ isScrolled: scrolled }),
  navigateTo: (page, slug) => {
    set((state) => ({
      previousPage: state.currentPage,
      currentPage: page,
      projectSlug: slug ?? null,
      blogSlug: slug ?? null,
      isMobileMenuOpen: false,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
}));
