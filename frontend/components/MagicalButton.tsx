import React from 'react';
import { clsx } from 'clsx';

interface MagicalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export function MagicalButton({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: MagicalButtonProps) {
    const baseStyles = "relative font-serif font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group";

    const variants = {
        primary: "bg-gradient-to-b from-accent-blue to-blue-900 text-white border-2 border-accent-gold/50 hover:border-accent-gold shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] text-shadow-sm",
        secondary: "bg-gradient-to-b from-gray-800 to-black text-accent-gold border-2 border-white/20 hover:border-accent-gold/50 hover:text-white shadow-md",
        danger: "bg-gradient-to-b from-red-900 to-black text-red-100 border-2 border-red-500/30 hover:border-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]",
        ghost: "bg-transparent text-accent-gold hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
    };

    const sizes = {
        sm: "px-3 py-1 text-xs rounded",
        md: "px-6 py-2 text-sm rounded-lg",
        lg: "px-8 py-3 text-base rounded-xl"
    };

    return (
        <button
            className={clsx(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {/* Inner bevel/highlight effect */}
            <div className="absolute inset-0 rounded-[inherit] border-t border-white/20 pointer-events-none" />
            {children}
        </button>
    );
}
