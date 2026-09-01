'use client';

import React, { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  LayoutDashboard, FolderOpen, FileText, Quote, Users, Wrench, Mail, Settings,
  Plus, Pencil, Trash2, Eye, EyeOff, LogOut, Menu, ArrowLeft, Search, Upload,
  Loader2, ChevronLeft, ChevronRight, MoreHorizontal, X, Check, ExternalLink,
  Building2, Globe, Monitor, Smartphone, Palette, Send, Phone, MapPin, Instagram,
  Linkedin, Github, Facebook, MessageSquare, Star, Clock, User, Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ==================== TYPES ====================

type Section = 'overview' | 'projects' | 'blog' | 'testimonials' | 'clients' | 'services' | 'contact' | 'settings';

interface NavItem {
  id: Section;
  label: string;
  icon: React.ElementType;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  category: string;
  clientName: string;
  clientUrl: string;
  technologies: string;
  coverImage: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  readingTime: number;
  coverImage: string;
  status: string;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
}

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  photo: string;
  isPublished: boolean;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  logo: string;
  website: string;
  industry: string;
  isVisible: boolean;
  createdAt: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  highlights: string[];
  ctaText: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
}

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  status: string;
  createdAt: string;
}

interface SiteSettings {
  company_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  linkedin: string;
  github: string;
  facebook: string;
  footer_text: string;
}

interface OverviewStats {
  totalProjects: number;
  publishedPosts: number;
  newInquiries: number;
  totalClients: number;
}

// ==================== HELPERS ====================

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function truncate(str: string, len: number): string {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
}

// ==================== API HELPER ====================

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  const json = await res.json();
  // Unwrap pagination so admin code can access data.total directly
  if (json.pagination) {
    return { ...json, ...json.pagination } as T;
  }
  return json as T;
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.url;
}

// ==================== NAV ITEMS ====================

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'testimonials', label: 'Testimonials', icon: Quote },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'contact', label: 'Contact Inquiries', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-orange-100 text-orange-800',
  converted: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const CATEGORY_LABELS: Record<string, string> = {
  web: 'Web App',
  mobile: 'Mobile App',
  'business-systems': 'Business Systems',
  'ui-ux': 'UI/UX Design',
};

const CATEGORIES = ['web', 'mobile', 'business-systems', 'ui-ux'];

const INQUIRY_STATUSES = ['new', 'contacted', 'in-progress', 'converted', 'closed'];

const SETTINGS_KEYS: { key: keyof SiteSettings; label: string; icon: React.ElementType }[] = [
  { key: 'company_name', label: 'Company Name', icon: Building2 },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'phone', label: 'Phone', icon: Phone },
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { key: 'address', label: 'Address', icon: MapPin },
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'github', label: 'GitHub', icon: Github },
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'footer_text', label: 'Footer Text', icon: FileText },
];

// ==================== LOGIN SCREEN ====================

function LoginScreen({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await apiFetch<{ user: { id: string; email: string } }>('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      onLogin(email.trim());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            RWEX<span className="text-gold">TECH</span>
          </h1>
          <p className="text-muted">Admin Dashboard</p>
        </div>
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-white/80">Email Address</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@rwextech.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-muted focus-visible:ring-gold"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold h-11"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ==================== SIDEBAR NAV ====================

function SidebarNav({
  activeSection,
  onNavigate,
  onLogout,
  onBack,
}: {
  activeSection: Section;
  onNavigate: (s: Section) => void;
  onLogout: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-navy text-white">
      <div className="p-4">
        <h2 className="text-xl font-bold">
          RWEX<span className="text-gold">TECH</span>
        </h2>
        <p className="text-xs text-muted mt-0.5">Admin Panel</p>
      </div>
      <Separator className="bg-white/10" />
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-gold/15 text-gold'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>
      <Separator className="bg-white/10" />
      <div className="p-2 space-y-0.5">
        <button
          onClick={onBack}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors text-left"
        >
          <ExternalLink className="size-4" />
          <span>Back to Website</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
        >
          <LogOut className="size-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

// ==================== OVERVIEW SECTION ====================

function OverviewSection({ onNavigate }: { onNavigate: (s: Section) => void }) {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsData, blogData, inquiriesData, clientsData] = await Promise.all([
        apiFetch<{ data: Project[]; total: number }>('/api/admin/projects?limit=1').catch(() => ({ data: [], total: 0 })),
        apiFetch<{ data: BlogPost[]; total: number }>('/api/admin/blog?limit=1&status=published').catch(() => ({ data: [], total: 0 })),
        apiFetch<{ data: ContactInquiry[]; total: number }>('/api/admin/contact?limit=1&status=new').catch(() => ({ data: [], total: 0 })),
        apiFetch<{ data: Client[]; total: number }>('/api/admin/clients?limit=1').catch(() => ({ data: [], total: 0 })),
      ]);
      setStats({
        totalProjects: projectsData.total,
        publishedPosts: blogData.total,
        newInquiries: inquiriesData.total,
        totalClients: clientsData.total,
      });
      const recentData = await apiFetch<{ data: ContactInquiry[]; total: number }>('/api/admin/contact?limit=5').catch(() => ({ data: [], total: 0 }));
      setRecentInquiries(recentData.data);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const statCards = [
    { label: 'Total Projects', value: stats?.totalProjects ?? 0, icon: FolderOpen, nav: 'projects' as Section },
    { label: 'Published Posts', value: stats?.publishedPosts ?? 0, icon: FileText, nav: 'blog' as Section },
    { label: 'New Inquiries', value: stats?.newInquiries ?? 0, icon: Mail, nav: 'contact' as Section },
    { label: 'Total Clients', value: stats?.totalClients ?? 0, icon: Users, nav: 'clients' as Section },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard Overview</h1>
          <p className="text-muted text-sm mt-1">Welcome back! Here is what is happening.</p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm" className="gap-2">
          <Clock className="size-4" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.label}
                className="cursor-pointer hover:shadow-md transition-shadow border-transparent"
                onClick={() => onNavigate(card.nav)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted font-medium">{card.label}</p>
                      <p className="text-3xl font-bold text-gold mt-1">{card.value}</p>
                    </div>
                    <div className="size-12 rounded-xl bg-navy/5 flex items-center justify-center">
                      <Icon className="size-6 text-navy" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-navy text-lg">Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentInquiries.length === 0 ? (
            <p className="text-muted text-sm py-8 text-center">No inquiries yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInquiries.map((inq) => (
                    <TableRow key={inq.id}>
                      <TableCell className="font-medium">{inq.name}</TableCell>
                      <TableCell className="text-muted">{inq.email}</TableCell>
                      <TableCell>{inq.service || '—'}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inq.status] || 'bg-gray-100 text-gray-800'}`}>
                          {inq.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted text-sm">{formatDate(inq.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {NAV_ITEMS.filter((i) => i.id !== 'overview').slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 border-dashed hover:border-gold hover:bg-gold/5 transition-colors"
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="size-5 text-navy" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

// ==================== PROJECTS SECTION ====================

const DEFAULT_PROJECT: Omit<Project, 'id' | 'createdAt'> = {
  title: '', slug: '', description: '', challenge: '', solution: '', results: '',
  category: 'web', clientName: '', clientUrl: '', technologies: '',
  coverImage: '', isFeatured: false, isPublished: false,
};

function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(DEFAULT_PROJECT);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) params.set('search', search);
      const data = await apiFetch<{ data: Project[]; total: number; page: number; limit: number }>(`/api/admin/projects?${params}`);
      setProjects(data.data);
      setTotalPages(Math.max(1, Math.ceil(data.total / data.limit)));
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(DEFAULT_PROJECT);
    setDialogOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({
      title: p.title, slug: p.slug, description: p.description || '',
      challenge: p.challenge || '', solution: p.solution || '', results: p.results || '',
      category: p.category, clientName: p.clientName || '', clientUrl: p.clientUrl || '',
      technologies: p.technologies || '', coverImage: p.coverImage || '',
      isFeatured: p.isFeatured, isPublished: p.isPublished,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || generateSlug(form.title) };
      if (editingId) {
        await apiFetch(`/api/admin/projects/${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        toast.success('Project updated!');
      } else {
        await apiFetch('/api/admin/projects', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        toast.success('Project created!');
      }
      setDialogOpen(false);
      loadProjects();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiFetch(`/api/admin/projects/${deleteId}`, { method: 'DELETE' });
      toast.success('Project deleted');
      setDeleteOpen(false);
      setDeleteId(null);
      loadProjects();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm((f) => ({ ...f, coverImage: url }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const updateField = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((f) => {
      const updated = { ...f, [key]: value };
      if (key === 'title' && !editingId) {
        updated.slug = generateSlug(value as string);
      }
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Projects</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <Input placeholder="Search projects..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 w-64" />
          </div>
          <Button onClick={handleOpenCreate} className="bg-gold hover:bg-gold/90 text-navy font-semibold gap-2">
            <Plus className="size-4" /> Add Project
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden lg:table-cell">Client</TableHead>
                    <TableHead className="hidden sm:table-cell">Featured</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted">No projects found</TableCell></TableRow>
                  ) : projects.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell className="hidden md:table-cell"><Badge variant="outline">{CATEGORY_LABELS[p.category] || p.category}</Badge></TableCell>
                      <TableCell className="hidden lg:table-cell text-muted">{p.clientName || '—'}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {p.isFeatured ? <Badge className="bg-gold text-navy">Featured</Badge> : <span className="text-muted text-sm">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.isPublished ? 'default' : 'secondary'} className={p.isPublished ? 'bg-green-100 text-green-800' : ''}>
                          {p.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted text-sm">{formatDate(p.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(p)}><Pencil className="size-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setDeleteId(p.id); setDeleteOpen(true); }} variant="destructive"><Trash2 className="size-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="size-4" /></Button>
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="size-4" /></Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy">{editingId ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogDescription>Fill in the project details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Project title" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="auto-generated-slug" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Brief description" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Challenge</Label>
              <Textarea value={form.challenge} onChange={(e) => updateField('challenge', e.target.value)} placeholder="The challenge faced" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Solution</Label>
              <Textarea value={form.solution} onChange={(e) => updateField('solution', e.target.value)} placeholder="The solution provided" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Results</Label>
              <Textarea value={form.results} onChange={(e) => updateField('results', e.target.value)} placeholder="Results achieved" rows={3} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => updateField('category', v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Technologies</Label>
                <Input value={form.technologies} onChange={(e) => updateField('technologies', e.target.value)} placeholder="React, Node.js, ..." />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input value={form.clientName} onChange={(e) => updateField('clientName', e.target.value)} placeholder="Client company" />
              </div>
              <div className="space-y-2">
                <Label>Client URL</Label>
                <Input value={form.clientUrl} onChange={(e) => updateField('clientUrl', e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="flex gap-2">
                <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                {uploading && <Loader2 className="size-5 animate-spin text-muted self-center" />}
              </div>
              {form.coverImage && (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border mt-2">
                  <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  <button onClick={() => updateField('coverImage', '')} className="absolute top-1 right-1 size-5 bg-black/60 rounded-full flex items-center justify-center">
                    <X className="size-3 text-white" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.isFeatured} onCheckedChange={(v) => updateField('isFeatured', v)} />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.isPublished} onCheckedChange={(v) => updateField('isPublished', v)} />
                <Label>Published</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold/90 text-navy font-semibold">
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}{editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">Delete Project</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ==================== BLOG SECTION ====================

const DEFAULT_BLOG: Omit<BlogPost, 'id' | 'createdAt'> = {
  title: '', slug: '', excerpt: '', content: '', author: '', readingTime: 5,
  coverImage: '', status: 'draft', isFeatured: false, seoTitle: '', seoDescription: '',
};

function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(DEFAULT_BLOG);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) params.set('search', search);
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      const data = await apiFetch<{ data: BlogPost[]; total: number; page: number; limit: number }>(`/api/admin/blog?${params}`);
      setPosts(data.data);
      setTotalPages(Math.max(1, Math.ceil(data.total / data.limit)));
    } catch {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(DEFAULT_BLOG);
    setDialogOpen(true);
  };

  const handleOpenEdit = (p: BlogPost) => {
    setEditingId(p.id);
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt || '', content: p.content || '',
      author: p.author || '', readingTime: p.readingTime || 5, coverImage: p.coverImage || '',
      status: p.status, isFeatured: p.isFeatured, seoTitle: p.seoTitle || '', seoDescription: p.seoDescription || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || generateSlug(form.title) };
      if (editingId) {
        await apiFetch(`/api/admin/blog/${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        toast.success('Post updated!');
      } else {
        await apiFetch('/api/admin/blog', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        toast.success('Post created!');
      }
      setDialogOpen(false);
      loadPosts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiFetch(`/api/admin/blog/${deleteId}`, { method: 'DELETE' });
      toast.success('Post deleted');
      setDeleteOpen(false);
      setDeleteId(null);
      loadPosts();
    } catch { toast.error('Delete failed'); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm((f) => ({ ...f, coverImage: url }));
      toast.success('Image uploaded!');
    } catch { toast.error('Upload failed'); } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const updateField = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((f) => {
      const updated = { ...f, [key]: value };
      if (key === 'title' && !editingId) updated.slug = generateSlug(value as string);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Blog Posts</h1>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <Input placeholder="Search posts..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 w-56" />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-32"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleOpenCreate} className="bg-gold hover:bg-gold/90 text-navy font-semibold gap-2">
            <Plus className="size-4" /> Add Post
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Author</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted">No posts found</TableCell></TableRow>
                  ) : posts.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {p.isFeatured && <Star className="size-3.5 text-gold fill-gold" />}
                          <span className="font-medium">{p.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.status === 'published' ? 'default' : 'secondary'} className={p.status === 'published' ? 'bg-green-100 text-green-800' : ''}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted">{p.author || '—'}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted text-sm">{formatDate(p.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(p)}><Pencil className="size-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setDeleteId(p.id); setDeleteOpen(true); }} variant="destructive"><Trash2 className="size-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="size-4" /></Button>
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="size-4" /></Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy">{editingId ? 'Edit Post' : 'Add Post'}</DialogTitle>
            <DialogDescription>Fill in the blog post details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Post title" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="auto-generated-slug" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => updateField('excerpt', e.target.value)} placeholder="Brief excerpt" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => updateField('content', e.target.value)} placeholder="Write your article content here... (Markdown supported)" rows={12} className="min-h-[200px] font-mono text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Author</Label>
                <Input value={form.author} onChange={(e) => updateField('author', e.target.value)} placeholder="Author name" />
              </div>
              <div className="space-y-2">
                <Label>Reading Time (min)</Label>
                <Input type="number" min={1} value={form.readingTime} onChange={(e) => updateField('readingTime', parseInt(e.target.value) || 1)} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => updateField('status', v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="flex gap-2">
                <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                {uploading && <Loader2 className="size-5 animate-spin text-muted self-center" />}
              </div>
              {form.coverImage && (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border mt-2">
                  <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  <button onClick={() => updateField('coverImage', '')} className="absolute top-1 right-1 size-5 bg-black/60 rounded-full flex items-center justify-center">
                    <X className="size-3 text-white" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isFeatured} onCheckedChange={(v) => updateField('isFeatured', v)} />
              <Label>Featured</Label>
            </div>
            <Separator />
            <p className="text-sm font-medium text-navy">SEO</p>
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input value={form.seoTitle} onChange={(e) => updateField('seoTitle', e.target.value)} placeholder="Meta title for SEO" />
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea value={form.seoDescription} onChange={(e) => updateField('seoDescription', e.target.value)} placeholder="Meta description for SEO" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold/90 text-navy font-semibold">
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}{editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">Delete Post</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ==================== TESTIMONIALS SECTION ====================

const DEFAULT_TESTIMONIAL: Omit<Testimonial, 'id' | 'createdAt'> = {
  name: '', position: '', company: '', content: '', photo: '', isPublished: false,
};

function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(DEFAULT_TESTIMONIAL);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ data: Testimonial[] }>('/api/admin/testimonials');
      setItems(data.data);
    } catch { toast.error('Failed to load testimonials'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleOpenCreate = () => { setEditingId(null); setForm(DEFAULT_TESTIMONIAL); setDialogOpen(true); };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({ name: t.name, position: t.position || '', company: t.company || '', content: t.content, photo: t.photo || '', isPublished: t.isPublished });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.content.trim()) { toast.error('Name and content are required'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await apiFetch(`/api/admin/testimonials/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        toast.success('Testimonial updated!');
      } else {
        await apiFetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        toast.success('Testimonial created!');
      }
      setDialogOpen(false);
      load();
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Save failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiFetch(`/api/admin/testimonials/${deleteId}`, { method: 'DELETE' });
      toast.success('Testimonial deleted');
      setDeleteOpen(false); setDeleteId(null); load();
    } catch { toast.error('Delete failed'); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { const url = await uploadFile(file); setForm((f) => ({ ...f, photo: url })); toast.success('Photo uploaded!'); }
    catch { toast.error('Upload failed'); } finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Testimonials</h1>
        <Button onClick={handleOpenCreate} className="bg-gold hover:bg-gold/90 text-navy font-semibold gap-2">
          <Plus className="size-4" /> Add Testimonial
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Company</TableHead>
                    <TableHead className="hidden md:table-cell">Content</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted">No testimonials yet</TableCell></TableRow>
                  ) : items.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted">{t.company || '—'}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted max-w-xs truncate">{truncate(t.content, 60)}</TableCell>
                      <TableCell>
                        <Badge variant={t.isPublished ? 'default' : 'secondary'} className={t.isPublished ? 'bg-green-100 text-green-800' : ''}>
                          {t.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(t)}><Pencil className="size-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setDeleteId(t.id); setDeleteOpen(true); }} variant="destructive"><Trash2 className="size-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Position</Label><Input value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Company</Label><Input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Content *</Label><Textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={4} /></div>
            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex gap-2">
                <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                {uploading && <Loader2 className="size-5 animate-spin text-muted self-center" />}
              </div>
              {form.photo && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border mt-2">
                  <img src={form.photo} alt="Photo" className="w-full h-full object-cover" />
                  <button onClick={() => setForm((f) => ({ ...f, photo: '' }))} className="absolute top-0 right-0 size-4 bg-black/60 rounded-full flex items-center justify-center">
                    <X className="size-2.5 text-white" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isPublished} onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v }))} />
              <Label>Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold/90 text-navy font-semibold">
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}{editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-navy">Delete Testimonial</DialogTitle><DialogDescription>Are you sure? This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ==================== CLIENTS SECTION ====================

const DEFAULT_CLIENT: Omit<Client, 'id' | 'createdAt'> = {
  name: '', logo: '', website: '', industry: '', isVisible: false,
};

function ClientsSection() {
  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(DEFAULT_CLIENT);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const data = await apiFetch<{ data: Client[] }>('/api/admin/clients'); setItems(data.data); }
    catch { toast.error('Failed to load clients'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleOpenCreate = () => { setEditingId(null); setForm(DEFAULT_CLIENT); setDialogOpen(true); };
  const handleOpenEdit = (c: Client) => {
    setEditingId(c.id);
    setForm({ name: c.name, logo: c.logo || '', website: c.website || '', industry: c.industry || '', isVisible: c.isVisible });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await apiFetch(`/api/admin/clients/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        toast.success('Client updated!');
      } else {
        await apiFetch('/api/admin/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        toast.success('Client created!');
      }
      setDialogOpen(false); load();
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Save failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await apiFetch(`/api/admin/clients/${deleteId}`, { method: 'DELETE' }); toast.success('Client deleted'); setDeleteOpen(false); setDeleteId(null); load(); }
    catch { toast.error('Delete failed'); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const url = await uploadFile(file); setForm((f) => ({ ...f, logo: url })); toast.success('Logo uploaded!'); }
    catch { toast.error('Upload failed'); } finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Clients</h1>
        <Button onClick={handleOpenCreate} className="bg-gold hover:bg-gold/90 text-navy font-semibold gap-2">
          <Plus className="size-4" /> Add Client
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Industry</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted">No clients yet</TableCell></TableRow>
                  ) : items.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted">{c.industry || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={c.isVisible ? 'default' : 'secondary'} className={c.isVisible ? 'bg-green-100 text-green-800' : ''}>
                          {c.isVisible ? 'Visible' : 'Hidden'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(c)}><Pencil className="size-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setDeleteId(c.id); setDeleteOpen(true); }} variant="destructive"><Trash2 className="size-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="text-navy">{editingId ? 'Edit Client' : 'Add Client'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex gap-2">
                <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                {uploading && <Loader2 className="size-5 animate-spin text-muted self-center" />}
              </div>
              {form.logo && (
                <div className="relative w-24 h-16 rounded-lg overflow-hidden border mt-2 bg-light-gray p-2">
                  <img src={form.logo} alt="Logo" className="w-full h-full object-contain" />
                  <button onClick={() => setForm((f) => ({ ...f, logo: '' }))} className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="size-3 text-white" />
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2"><Label>Website</Label><Input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://..." /></div>
            <div className="space-y-2"><Label>Industry</Label><Input value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} /></div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isVisible} onCheckedChange={(v) => setForm((f) => ({ ...f, isVisible: v }))} />
              <Label>Visible</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold/90 text-navy font-semibold">
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}{editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-navy">Delete Client</DialogTitle><DialogDescription>Are you sure? This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ==================== SERVICES SECTION ====================

const DEFAULT_SERVICE: Omit<Service, 'id' | 'createdAt'> = {
  title: '', slug: '', description: '', icon: 'Globe', highlights: [],
  ctaText: '', sortOrder: 0, isPublished: false,
};

function ServicesSection() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(DEFAULT_SERVICE);
  const [highlightsText, setHighlightsText] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const data = await apiFetch<{ data: Service[] }>('/api/admin/services'); setItems(data.data); }
    catch { toast.error('Failed to load services'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(DEFAULT_SERVICE);
    setHighlightsText('');
    setDialogOpen(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingId(s.id);
    setForm({
      title: s.title, slug: s.slug, description: s.description || '', icon: s.icon || 'Globe',
      highlights: s.highlights || [], ctaText: s.ctaText || '', sortOrder: s.sortOrder || 0, isPublished: s.isPublished,
    });
    setHighlightsText((s.highlights || []).join('\n'));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || generateSlug(form.title),
        highlights: highlightsText.split('\n').map((h) => h.trim()).filter(Boolean),
      };
      if (editingId) {
        await apiFetch(`/api/admin/services/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        toast.success('Service updated!');
      } else {
        await apiFetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        toast.success('Service created!');
      }
      setDialogOpen(false); load();
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Save failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await apiFetch(`/api/admin/services/${deleteId}`, { method: 'DELETE' }); toast.success('Service deleted'); setDeleteOpen(false); setDeleteId(null); load(); }
    catch { toast.error('Delete failed'); }
  };

  const ICON_OPTIONS = ['Globe', 'Smartphone', 'Monitor', 'Palette', 'Wrench', 'Code', 'Database', 'Shield', 'Zap', 'Settings', 'Layers', 'Cpu'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Services</h1>
        <Button onClick={handleOpenCreate} className="bg-gold hover:bg-gold/90 text-navy font-semibold gap-2">
          <Plus className="size-4" /> Add Service
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Icon</TableHead>
                    <TableHead className="hidden md:table-cell">Sort Order</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted">No services yet</TableCell></TableRow>
                  ) : items.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.title}</TableCell>
                      <TableCell className="hidden sm:table-cell"><code className="text-xs bg-light-gray px-2 py-1 rounded">{s.icon}</code></TableCell>
                      <TableCell className="hidden md:table-cell text-muted">{s.sortOrder}</TableCell>
                      <TableCell>
                        <Badge variant={s.isPublished ? 'default' : 'secondary'} className={s.isPublished ? 'bg-green-100 text-green-800' : ''}>
                          {s.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(s)}><Pencil className="size-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setDeleteId(s.id); setDeleteOpen(true); }} variant="destructive"><Trash2 className="size-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-navy">{editingId ? 'Edit Service' : 'Add Service'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select value={form.icon} onValueChange={(v) => setForm((f) => ({ ...f, icon: v }))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((icon) => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} /></div>
            </div>
            <div className="space-y-2">
              <Label>Highlights (one per line)</Label>
              <Textarea value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} placeholder={"Highlight 1\nHighlight 2\nHighlight 3"} rows={4} />
            </div>
            <div className="space-y-2"><Label>CTA Text</Label><Input value={form.ctaText} onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))} placeholder="Learn More" /></div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isPublished} onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v }))} />
              <Label>Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold/90 text-navy font-semibold">
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}{editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-navy">Delete Service</DialogTitle><DialogDescription>Are you sure? This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ==================== CONTACT INQUIRIES SECTION ====================

function ContactSection() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewOpen, setViewOpen] = useState(false);
  const [viewInquiry, setViewInquiry] = useState<ContactInquiry | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      const data = await apiFetch<{ data: ContactInquiry[]; total: number; page: number; limit: number }>(`/api/admin/contact?${params}`);
      setInquiries(data.data);
      setTotalPages(Math.max(1, Math.ceil(data.total / data.limit)));
    } catch { toast.error('Failed to load inquiries'); } finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingStatus(id);
    try {
      await apiFetch(`/api/admin/contact/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
      });
      toast.success(`Status updated to ${status}`);
      load();
    } catch { toast.error('Status update failed'); } finally { setUpdatingStatus(null); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiFetch(`/api/admin/contact/${deleteId}`, { method: 'DELETE' });
      toast.success('Inquiry deleted'); setDeleteOpen(false); setDeleteId(null); load();
    } catch { toast.error('Delete failed'); }
  };

  const handleView = (inq: ContactInquiry) => { setViewInquiry(inq); setViewOpen(true); };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Contact Inquiries</h1>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {INQUIRY_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s.replace('-', ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden lg:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted">No inquiries found</TableCell></TableRow>
                  ) : inquiries.map((inq) => (
                    <TableRow key={inq.id}>
                      <TableCell className="font-medium">{inq.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted">{inq.email}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted">{inq.phone || '—'}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted">{inq.service || '—'}</TableCell>
                      <TableCell>
                        {updatingStatus === inq.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${STATUS_COLORS[inq.status] || 'bg-gray-100 text-gray-800'}`}>
                                {inq.status.replace('-', ' ')}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              {INQUIRY_STATUSES.map((s) => (
                                <DropdownMenuItem key={s} onClick={() => handleStatusChange(inq.id, s)}>
                                  {inq.status === s && <Check className="size-4 mr-1" />}
                                  <span className="capitalize">{s.replace('-', ' ')}</span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted text-sm">{formatDate(inq.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(inq)}><Eye className="size-4 mr-2" /> View</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setDeleteId(inq.id); setDeleteOpen(true); }} variant="destructive"><Trash2 className="size-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="size-4" /></Button>
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="size-4" /></Button>
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy">Inquiry Details</DialogTitle>
          </DialogHeader>
          {viewInquiry && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted">Name</p><p className="font-medium text-sm">{viewInquiry.name}</p></div>
                <div><p className="text-xs text-muted">Email</p><p className="font-medium text-sm">{viewInquiry.email}</p></div>
                <div><p className="text-xs text-muted">Phone</p><p className="font-medium text-sm">{viewInquiry.phone || '—'}</p></div>
                <div><p className="text-xs text-muted">Company</p><p className="font-medium text-sm">{viewInquiry.company || '—'}</p></div>
                <div><p className="text-xs text-muted">Service</p><p className="font-medium text-sm">{viewInquiry.service || '—'}</p></div>
                <div><p className="text-xs text-muted">Budget</p><p className="font-medium text-sm">{viewInquiry.budget || '—'}</p></div>
                <div><p className="text-xs text-muted">Status</p>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[viewInquiry.status] || ''}`}>
                    {viewInquiry.status.replace('-', ' ')}
                  </span>
                </div>
                <div><p className="text-xs text-muted">Date</p><p className="font-medium text-sm">{formatDate(viewInquiry.createdAt)}</p></div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted mb-1">Message</p>
                <p className="text-sm whitespace-pre-wrap bg-light-gray p-4 rounded-lg">{viewInquiry.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-navy">Delete Inquiry</DialogTitle><DialogDescription>Are you sure? This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ==================== SETTINGS SECTION ====================

function SettingsSection() {
  const [form, setForm] = useState<SiteSettings>({
    company_name: '', email: '', phone: '', whatsapp: '', address: '',
    instagram: '', linkedin: '', github: '', facebook: '', footer_text: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Record<string, string>>('/api/admin/settings');
      setForm((prev) => ({ ...prev, ...data }));
    } catch { toast.error('Failed to load settings'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsArray = Object.entries(form).map(([key, value]) => ({ key, value }));
      await apiFetch('/api/admin/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settingsArray),
      });
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save settings'); } finally { setSaving(false); }
  };

  const updateField = (key: keyof SiteSettings, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-navy">Site Settings</h1>
        <Card><CardContent className="p-6 space-y-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Site Settings</h1>
          <p className="text-muted text-sm mt-1">Manage your website configuration.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold/90 text-navy font-semibold gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Save Settings
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6">
            {SETTINGS_KEYS.map(({ key, label, icon: Icon }) => (
              <div key={key} className="space-y-1.5">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="size-4 text-muted" /> {label}
                </Label>
                {key === 'footer_text' || key === 'address' ? (
                  <Textarea
                    value={form[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    rows={key === 'address' ? 2 : 3}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                ) : (
                  <Input
                    value={form[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                    type={key === 'email' ? 'email' : 'text'}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== AUTH STORE ====================

let authListeners: (() => void)[] = [];
let serverAuthState: boolean | null = null; // null = loading

function subscribeAuth(cb: () => void) {
  authListeners = [...authListeners, cb];
  return () => { authListeners = authListeners.filter((l) => l !== cb); };
}
function getAuthSnapshot() {
  return serverAuthState ?? false;
}
function getAuthServerSnapshot() {
  return false;
}
function setAuthValue(val: boolean) {
  serverAuthState = val;
  authListeners.forEach((l) => l());
}

async function checkServerSession(): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/auth');
    return res.ok;
  } catch {
    return false;
  }
}

function noopSubscribe() { return () => {}; }

// ==================== MAIN ADMIN PAGE ====================

export default function AdminPage() {
  const router = useRouter();
  const isAuthenticated = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check session cookie with server on mount
  useEffect(() => {
    if (mounted && serverAuthState === null) {
      checkServerSession().then((valid) => {
        setAuthValue(valid);
      });
    }
  }, [mounted]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch { /* ignore */ }
    setAuthValue(false);
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  const handleNavigate = (section: Section) => {
    setActiveSection(section);
    setMobileOpen(false);
  };

  useEffect(() => {
    // Only redirect when server check is complete (not null) and failed
    if (mounted && serverAuthState !== null && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [mounted, isAuthenticated, router, serverAuthState]);

  // Show loading while checking session
  if (!mounted || serverAuthState === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
        <Loader2 className="size-8 animate-spin text-navy" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
        <Loader2 className="size-8 animate-spin text-navy" />
      </div>
    );
  }

  const currentNav = NAV_ITEMS.find((n) => n.id === activeSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection onNavigate={handleNavigate} />;
      case 'projects': return <ProjectsSection />;
      case 'blog': return <BlogSection />;
      case 'testimonials': return <TestimonialsSection />;
      case 'clients': return <ClientsSection />;
      case 'services': return <ServicesSection />;
      case 'contact': return <ContactSection />;
      case 'settings': return <SettingsSection />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-light-gray">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0">
        <div className="sticky top-0 h-screen w-full">
          <SidebarNav activeSection={activeSection} onNavigate={handleNavigate} onLogout={handleLogout} onBack={() => window.location.href = '/'} />
        </div>
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <button className="lg:hidden fixed top-4 left-4 z-40 size-10 bg-navy text-white rounded-lg flex items-center justify-center shadow-md" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav activeSection={activeSection} onNavigate={handleNavigate} onLogout={handleLogout} onBack={() => window.location.href = '/'} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="font-medium">Dashboard</span>
              <ChevronRight className="size-3.5" />
              <span className="font-medium text-navy">{currentNav?.label}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}