import React from 'react';
import { Spellbook } from '@/components/Spellbook';

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen p-4 md:p-8 font-sans">
            <Spellbook title="Privacy Policy">
                <div className="space-y-6 text-white/80 leading-relaxed">
                    <p className="text-sm text-white/50">Last Updated: December 2025</p>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-accent-gold mb-2">1. Introduction</h2>
                        <p>
                            Welcome to the Wizard101 Pet Stats Calculator ("we," "our," or "us"). We are committed to protecting your privacy.
                            This Privacy Policy explains how we collect, use, and safeguard your information when you visit our application.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-accent-gold mb-2">2. Information We Collect</h2>
                        <p className="mb-2">We collect the minimum amount of information necessary to provide our services:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Google Account Information:</strong> When you log in using Google OAuth, we receive your email address, name, and profile picture. We use this solely to create your user account and identify your saved pets.</li>
                            <li><strong>Pet Data:</strong> We store the pet statistics, talents, and images you upload or input into the calculator.</li>
                            <li><strong>Usage Data:</strong> We may collect anonymous usage data (e.g., "Last Seen" timestamps) to improve the marketplace experience.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-accent-gold mb-2">3. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>To provide and maintain the Service (e.g., saving your pets).</li>
                            <li>To facilitate the Marketplace features (e.g., showing your username to other players for hatching).</li>
                            <li>To authenticate your identity via Google.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-accent-gold mb-2">4. Data Sharing</h2>
                        <p>
                            We do <strong>not</strong> sell, trade, or rent your personal identification information to others.
                            Your pet listings in the Marketplace are public to other users of the app, but your email address is never publicly displayed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-accent-gold mb-2">5. Third-Party Services</h2>
                        <p>
                            We use <strong>Google Firebase</strong> for hosting, authentication, and database services.
                            Please review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">Google's Privacy Policy</a> for more information on how they handle data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-accent-gold mb-2">6. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us via the application support channels.
                        </p>
                    </section>
                </div>
            </Spellbook>
        </main>
    );
}
