import { ImageResponse } from 'next/og';
import { getListing } from '@/app/actions';

// Using nodejs runtime because we need firebase-admin
export const runtime = 'nodejs';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
    const { success, listing } = await getListing(params.id);
    const pet = listing as any;

    if (!success || !pet) {
        return new ImageResponse(
            (
                <div style={{ background: '#0a0a12', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    Listing Not Found
                </div>
            ),
            { ...size }
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #0a0a12, #1a1a2e)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row', // Side by side layout
                    fontFamily: 'serif',
                    border: '20px solid #ffd700',
                    position: 'relative',
                }}
            >
                {/* Decorative Background Elements */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 50% 50%, #ffd700 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Left Side: Pet Info */}
                <div style={{ flex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '2px solid rgba(255,215,0,0.3)' }}>
                    <div style={{ fontSize: 32, color: '#ffd700', marginBottom: 10, opacity: 0.8 }}>{pet.petType}</div>
                    <h1 style={{ fontSize: 80, color: 'white', margin: 0, lineHeight: 1.1, textShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                        {pet.petNickname || pet.petType}
                    </h1>

                    <div style={{ display: 'flex', gap: '20px', marginTop: 40 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', minWidth: '180px' }}>
                            <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)' }}>Damage</span>
                            <span style={{ fontSize: 48, color: '#60a5fa', fontWeight: 'bold' }}>{pet.calculatedDamage}%</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', minWidth: '180px' }}>
                            <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)' }}>Resist</span>
                            <span style={{ fontSize: 48, color: '#60a5fa', fontWeight: 'bold' }}>{pet.calculatedResist}%</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Talents */}
                <div style={{ flex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <h2 style={{ fontSize: 40, color: '#ffd700', marginBottom: 30, borderBottom: '2px solid #ffd700', paddingBottom: '10px', display: 'inline-block' }}>
                        Manifested Talents
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {pet.talents.slice(0, 5).map((talent: string, i: number) => (
                            <div key={i} style={{ fontSize: 32, color: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '12px', height: '12px', background: '#ffd700', borderRadius: '50%' }} />
                                {talent}
                            </div>
                        ))}
                        {pet.talents.length > 5 && (
                            <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)', marginTop: 10, fontStyle: 'italic' }}>
                                +{pet.talents.length - 5} more...
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)' }}>Available on</span>
                        <span style={{ fontSize: 32, color: '#ffd700', fontWeight: 'bold' }}>Pet Tome</span>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
