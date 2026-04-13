'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  PawPrint,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Shield,
  Moon,
  Sun,
  Sparkles,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(pathname);

  if (isAuthPage) return null;

  const navLinks = user
    ? user.role === 'admin'
      ? [
          { href: '/admin-dashboard', label: 'Dashboard' },
          { href: '/admin/users', label: 'Users' },
          { href: '/admin/pets', label: 'Pets' },
          { href: '/admin/trainers', label: 'Trainers' },
        ]
      : user.role === 'owner'
        ? [
            { href: '/owner-dashboard', label: 'Dashboard' },
            { href: '/pets', label: 'My Pets' },
            { href: '/trainers', label: 'Find Care' },
            { href: '/bookings', label: 'Bookings' },
          ]
        : user.role === 'caregiver'
          ? [
              { href: '/caregiver-dashboard', label: 'Dashboard' },
              { href: '/assigned-pets', label: 'Assigned' },
              { href: '/schedule', label: 'Schedule' },
            ]
          : user.role === 'trainer'
            ? [
                { href: '/trainer-dashboard', label: 'Dashboard' },
                { href: '/assigned-pets', label: 'Clients' },
                { href: '/schedule', label: 'Programs' },
              ]
            : [{ href: '/services', label: 'Services' }]
    : [
        { href: '/services', label: 'Services' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/about', label: 'About' },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 glass-effect shadow-medium backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-medium group-hover:shadow-large group-hover:scale-105 transition-all duration-300 glow-primary">
            <PawPrint className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-heading font-bold text-primary group-hover:text-primary/80 transition-all duration-300">
              PetCare
            </span>
            <span className="text-xs text-muted-foreground font-body font-medium">
              Professional Pet Services
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-xl px-4 py-2.5 text-sm font-body font-medium transition-all duration-300 hover-lift tracking-tight',
                pathname === link.href
                  ? 'bg-primary text-white shadow-medium glow-primary'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-primary hover:shadow-soft',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover-scale rounded-xl shadow-soft border border-border/30"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
            </Button>
          )}
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.fullName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col gap-1 p-2">
                    <p className="text-sm font-body font-medium">{user.fullName}</p>
                    <p className="text-xs font-body text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-muted-foreground md:flex"
                asChild
              >
                <Link href="/apply">
                  <Shield className="mr-1 h-4 w-4" />
                  Become a Caregiver
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-body font-medium transition-colors tracking-tight',
                  pathname === link.href
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-body font-medium text-muted-foreground hover:bg-secondary hover:text-foreground tracking-tight"
              >
                <Shield className="h-4 w-4" />
                Become a Caregiver
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
