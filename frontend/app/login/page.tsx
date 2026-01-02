'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { GridPattern } from "@/components/magicui/grid-pattern"
import { MagicCard } from "@/components/magicui/magic-card"
import { MessageCircle, Shield } from 'lucide-react';
import { clsx } from 'clsx';

export default function LoginPage() {
    const handleLogin = (provider: 'discord' | 'google') => {
        signIn(provider, { callbackUrl: '/my-pets' });
    };

    return (
        <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4">
             <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}
                className="stroke-gray-400/20 [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
                strokeDasharray="4 2"
            />
            
            <MagicCard 
                className="w-full max-w-md p-8 border-accent-gold/20 shadow-2xl relative overflow-hidden"
                gradientColor="#FFD700" 
                gradientOpacity={0.1}
            >
                <div className="text-center mb-8 relative z-10">
                     <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground drop-shadow-md mb-2">
                        Identify <span className="text-accent-gold">Yourself</span>
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        To access your Pet Tome and the Hatching Kiosk, you must reveal your identity.
                    </p>
                </div>

                <div className="space-y-4 relative z-10">
                    {/* Discord Button (Recommended) */}
                    <div className="relative group">
                        <div className="absolute -top-3 -right-2 bg-accent-gold/20 text-accent-gold border border-accent-gold/30 text-xs font-bold px-2 py-1 rounded shadow-md z-20">
                            Recommended
                        </div>
                        <button
                            onClick={() => handleLogin('discord')}
                            className={clsx(
                                "w-full flex items-center justify-center gap-3 p-4 rounded-lg transition-all",
                                "bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-white shadow-lg border border-[#5865F2]/50 hover:border-[#5865F2]",
                                "backdrop-blur-sm"
                            )}
                        >
                            <MessageCircle className="w-6 h-6 text-[#5865F2]" />
                            <div className="text-left">
                                <div className="font-bold text-lg text-white">Login with Discord</div>
                                <div className="text-xs text-white/60">Enables direct DMs for Hatching</div>
                            </div>
                        </button>
                    </div>

                    {/* Google Button */}
                    <button
                        onClick={() => handleLogin('google')}
                        className={clsx(
                             "w-full flex items-center justify-center gap-3 p-4 rounded-lg transition-all",
                            "bg-white/5 hover:bg-white/10 text-foreground shadow-md border border-white/10 hover:border-white/20",
                            "backdrop-blur-sm"
                        )}
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <div className="text-left">
                            <div className="font-bold text-lg">Login with Google</div>
                            <div className="text-xs text-muted-foreground">Standard account access</div>
                        </div>
                    </button>
                </div>

                <div className="mt-8 text-center text-sm text-foreground/40 relative z-10 px-4">
                    <p className="italic">
                        "Discord is preferred for the Hatching Kiosk, as it allows other wizards to contact you directly!"
                        <br />
                        - Gamma
                    </p>
                </div>
            </MagicCard>
        </div>
    );
}
