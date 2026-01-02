// DEPRECATED: This Navbar is being fast-tracked for retirement in favor of AppSidebar.
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { clsx } from 'clsx';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Calculator', href: '/' },
        { name: 'My Pets', href: '/my-pets' },
        { name: 'Marketplace', href: '/marketplace' },
    ];

    return (
        <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">📖</span>
                            <span className="font-serif font-bold text-xl text-accent-gold tracking-wide">Pet Tome</span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        'px-3 py-2 rounded-md text-sm font-medium transition-colors relative',
                                        pathname === item.href
                                            ? 'text-accent-gold'
                                            : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
                                    )}
                                >
                                    {item.name}
                                    {pathname === item.href && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-gold shadow-[0_0_10px_var(--accent-gold)]" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Auth Buttons (Desktop) */}
                    <div className="hidden md:block">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                                    {session.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || 'User'}
                                            className="w-8 h-8 rounded-full border border-border"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                    <span className="hidden lg:inline-block">{session.user?.name}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => signOut()}
                                    className="text-foreground/50 hover:text-destructive hover:bg-destructive/10"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </Button>
                            </div>
                        ) : (
                            <Button asChild variant="default" size="sm" className="font-serif tracking-wide bg-primary/90 hover:bg-primary">
                                <Link href="/login">
                                    Sign In
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-in slide-in-from-top-5 duration-300">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={clsx(
                                    'block px-3 py-2 rounded-md text-base font-medium',
                                    pathname === item.href
                                        ? 'bg-primary/20 text-accent-gold'
                                        : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="border-t border-border my-2 pt-2">
                            {session ? (
                                <>
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        {session.user?.image && (
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name || 'User'}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        )}
                                        <span className="text-foreground">{session.user?.name}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => signOut()}
                                    >
                                        <LogOut className="mr-2 w-4 h-4" />
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Button className="w-full font-serif" variant="default">
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
