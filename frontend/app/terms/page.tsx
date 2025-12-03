import React from 'react';
import { Spellbook } from '@/components/Spellbook';

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen p-4 md:p-8 font-sans">
            <Spellbook title="Terms of Service">
                <div className="space-y-6 text-white/80 leading-relaxed">
                    <p className="text-sm text-white/50">Last Updated: December 2025</p>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-accent-gold mb-2">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using the Wizard101 Pet Stats Calculator ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-accent-gold mb-2">2. Fan Project Disclaimer</h2>
                        <p>
                            This Service is a fan-made tool created for the Wizard101 community. It is <strong>not</strong> affiliated with, endorsed, sponsored, or specifically approved by KingsIsle Entertainment. Wizard101 and all associated characters, names, and indicia are trademarks of KingsIsle Entertainment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-accent-gold mb-2">3. User Conduct</h2>
                        <p>
                            You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the service.
                            Specifically regarding the Marketplace:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>You agree to provide accurate information about your pets.</li>
                            <li>You agree not to use the platform to scam or deceive other players.</li>
                            <li>We reserve the right to remove listings or ban users who violate these community standards.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-accent-gold mb-2">4. Disclaimer of Warranties</h2>
                        <p>
                            The Service is provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, regarding the operation of the Service or the information, content, or materials included on it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-accent-gold mb-2">5. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-accent-gold mb-2">6. Contact</h2>
                        <p>
                            For any questions regarding these Terms, please contact us via the application support channels.
                        </p>
                    </section>
                </div>
            </Spellbook>
        </main>
    );
}
