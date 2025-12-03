'use client';

import React, { useState } from 'react';
import { MessageCircle, Save, X } from 'lucide-react';

interface DiscordUsernameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (username: string) => void;
}

export function DiscordUsernameModal({ isOpen, onClose, onSubmit }: DiscordUsernameModalProps) {
    const [username, setUsername] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onSubmit(username.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a2e] border-2 border-accent-gold rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#5865F2]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#5865F2]/30">
                            <MessageCircle className="w-8 h-8 text-[#5865F2]" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-white mb-2">
                            Discord Username Required
                        </h3>
                        <p className="text-sm text-white/70">
                            To list pets in the Kiosk, other wizards need a way to contact you. Since you are not logged in with Discord, please enter your username.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">
                                Discord Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. gamma_wizard#1234"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#5865F2] transition-colors"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!username.trim()}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                Save & List
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
