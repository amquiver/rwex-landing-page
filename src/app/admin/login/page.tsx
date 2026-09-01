'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }

      // Session cookie is set by the server via HTTP-only Set-Cookie header
      router.push('/admin');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Top bar with back link */}
      <div className="p-4 sm:p-6">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </button>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 mb-5">
              <Image
                src="/images/logo.png"
                alt="RWEXTECH Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Admin Login
            </h1>
            <p className="text-white/50 text-sm">
              Sign in to manage your website content
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 backdrop-blur-sm"
          >
            {/* Email field */}
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-white/80"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="admin@rwextech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:border-gold transition-colors"
                required
                autoComplete="email"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-white/80"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 pr-11 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:border-gold transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full h-11 bg-gold hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed text-navy font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-8">
            RWEXTECH Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}
