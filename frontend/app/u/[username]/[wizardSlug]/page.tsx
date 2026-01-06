import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { Wizard, UserProfile, Pet } from '@/types/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    ShieldCheck, 
    Flame, 
    Snowflake, 
    Zap, 
    Ghost, 
    Leaf, 
    Scale, 
    Swords, 
    Users,
    Trophy,
    ScrollText
} from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

// --- Types ---
type Props = {
    params: {
        username: string; // e.g. "tobiscuit" (from /@tobiscuit)
        wizardSlug: string; // e.g. "wolf-stormblade"
    }
};

type ProfileData = {
    user: UserProfile;
    wizard: Wizard;
    pets: Pet[];
};

// --- Helpers ---
const SCHOOL_ICONS: Record<string, any> = {
    'Fire': Flame, 'Ice': Snowflake, 'Storm': Zap, 'Myth': Ghost, 
    'Life': Leaf, 'Death': Ghost, 'Balance': Scale
};

const SCHOOL_COLORS: Record<string, string> = {
    'Fire': 'text-red-500 border-red-500/20 bg-red-500/10',
    'Ice': 'text-cyan-500 border-cyan-500/20 bg-cyan-500/10',
    'Storm': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
    'Myth': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10',
    'Life': 'text-green-500 border-green-500/20 bg-green-500/10',
    'Death': 'text-slate-500 border-slate-500/20 bg-slate-500/10',
    'Balance': 'text-orange-500 border-orange-500/20 bg-orange-500/10',
};

// --- Data Fetching ---
async function getProfileData(username: string, wizardSlug: string): Promise<ProfileData | null> {
    const db = getAdminFirestore();
    
    // 1. Find User by Display Name (Username)
    // In a real app, 'username' should be a unique field. standardizing user input.
    // For MVP, we assume displayName is unique enough or we take the first match.
    // Decode URI component because it might be "Wolf%20StormBlade"
    const decodedUsername = decodeURIComponent(username).replace('@', ''); 
    
    const usersSnap = await db.collection('users')
        .where('displayName', '==', decodedUsername)
        .limit(1)
        .get();

    if (usersSnap.empty) {
        console.warn(`User not found: ${decodedUsername}`);
        return null;
    }

    const userDoc = usersSnap.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() } as UserProfile;

    // 2. Find Wizard by Slug (Name)
    // We slugify the input: "wolf-stormblade" -> "Wolf StormBlade" (Reverse is hard, so we scan)
    // Optimization: Store 'slug' on the wizard doc.
    // MVP: Get all wizards for user and match locally.
    const wizardsSnap = await db.collection('wizards')
        .where('userId', '==', user.uid)
        .get();

    const normalizedSlug = decodeURIComponent(wizardSlug).toLowerCase();
    
    const targetWizardDoc = wizardsSnap.docs.find(doc => {
        const w = doc.data() as Wizard;
        const s = w.name.toLowerCase().replace(/\s+/g, '-');
        return s === normalizedSlug;
    });

    if (!targetWizardDoc) {
        console.warn(`Wizard not found for slug: ${normalizedSlug}`);
        return null;
    }

    const wizard = { id: targetWizardDoc.id, ...targetWizardDoc.data() } as Wizard;

    // 3. Get Public Pets (Lendable Only)
    const petsSnap = await db.collection('pets')
        .where('userId', '==', user.uid)
        .where('isLendable', '==', true)
        .get();

    const pets = petsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Pet));

    return { user, wizard, pets };
}

// --- Metadata (SEO) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const data = await getProfileData(params.username, params.wizardSlug);
    if (!data) return { title: 'Wizard Not Found' };

    return {
        title: `${data.wizard.name} | ${data.wizard.school} Level ${data.wizard.level}`,
        description: `Check out the stats and pets of ${data.wizard.name} on The Commons.`,
        openGraph: {
            title: `${data.wizard.name} (${data.wizard.school})`,
            description: `Level ${data.wizard.level} • ${data.pets.length} Public Pets`,
            // images: [`/api/og/wizard/${data.wizard.id}`], // TODO: Implement dynamic OG
        }
    };
}

// --- Page Component ---
export default async function PublicWizardProfile({ params }: Props) {
    const data = await getProfileData(params.username, params.wizardSlug);

    if (!data) {
        notFound();
    }

    const { user, wizard, pets } = data;
    const SchoolIcon = SCHOOL_ICONS[wizard.school] || Zap;
    const colorClass = SCHOOL_COLORS[wizard.school] || 'text-slate-500 border-slate-500/20 bg-slate-500/10';

    return (
        <div className="container mx-auto max-w-5xl py-12 px-4 space-y-8 animate-in fade-in duration-700">
            
            {/* Header: Identity Card */}
            <div className="relative overflow-hidden rounded-3xl border bg-card text-card-foreground shadow-2xl">
                 {/* Background Glow */}
                 <div className={clsx("absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-transparent via-transparent to-current opacity-10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none", colorClass.split(' ')[0])} />

                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
                    
                    {/* Avatar / School Icon */}
                    <div className={clsx("w-32 h-32 md:w-40 md:h-40 rounded-3xl flex items-center justify-center shadow-inner border-4 bg-background", colorClass)}>
                         <SchoolIcon className="w-16 h-16 md:w-20 md:h-20 opacity-80" />
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="border-opacity-50 text-muted-foreground">
                                @{user.displayName}
                            </Badge>
                            {wizard.lookingForGuild && (
                                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">LFG</Badge>
                            )}
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                            {wizard.name}
                        </h1>
                        
                        <div className="flex flex-wrap gap-4 text-lg text-muted-foreground items-center">
                            <span className={clsx("font-bold", colorClass.split(' ')[0])}>
                                Level {wizard.level} {wizard.school}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                            <span className="italic">"{wizard.bio || 'A mysterious wizard.'}"</span>
                        </div>
                    </div>

                    {/* Trust / Reputation Small */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border shadow-sm">
                            <span className="text-xs uppercase text-muted-foreground">Trust</span>
                            <div className="flex items-center gap-1 font-bold">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                {user.hatchReputation + user.marketReputation + user.vouchCount}
                            </div>
                        </div>
                         <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border shadow-sm">
                            <span className="text-xs uppercase text-muted-foreground">Hatches</span>
                            <div className="flex items-center gap-1 font-bold">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                {user.analytics?.totalHatches || 0}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Stats & Gear */}
                <div className="space-y-8">
                    {/* Verified Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Swords className="w-5 h-5 text-accent-gold" />
                                Verified Stats
                            </CardTitle>
                            <CardDescription>
                                Validated via Screenshot Scan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {wizard.verifiedStats ? (
                                <div className="grid grid-cols-2 gap-4">
                                     <StatItem label="Damage" value={`${wizard.verifiedStats.damage}%`} />
                                     <StatItem label="Resist" value={`${wizard.verifiedStats.resist}%`} />
                                     <StatItem label="Accuracy" value={`${wizard.verifiedStats.accuracy}%`} />
                                     <StatItem label="Pierce" value={`${wizard.verifiedStats.pierce}%`} />
                                     <StatItem label="Power Pip" value={`${wizard.verifiedStats.powerPip}%`} />
                                     <StatItem label="Archmastery" value={`${wizard.verifiedStats.archmastery}`} />
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                                    No verified stats yet.
                                </div>
                            )}
                            <div className="text-xs text-center text-muted-foreground pt-2">
                                Last Verified: {wizard.lastVerifiedAt ? new Date(wizard.lastVerifiedAt.seconds * 1000).toLocaleDateString() : 'Never'}
                            </div>
                        </CardContent>
                    </Card>

                     {/* Badges / Guild */}
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Affiliations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 border rounded-lg bg-muted/10 flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-xl">
                                    🏰
                                </div>
                                <div>
                                    <p className="font-bold">No Guild</p>
                                    <p className="text-xs text-muted-foreground">This wizard is a Ronin.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Pet Tome */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                         <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                            <ScrollText className="w-6 h-6 text-accent-gold" />
                            Public Tome
                        </h2>
                        <Badge variant="outline">{pets.length} Pets Available</Badge>
                    </div>

                    {pets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/5 text-muted-foreground">
                            <Ghost className="w-12 h-12 mb-4 opacity-20" />
                            <p>No public pets listed.</p>
                        </div>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pets.map(pet => (
                                <Link href={`/marketplace/pet/${pet.id}`} key={pet.id}>
                                    <Card className="hover:border-accent-gold/50 transition-colors cursor-pointer group h-full">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg group-hover:text-accent-gold transition-colors">
                                                    {pet.nickname}
                                                </CardTitle>
                                                <Badge variant="secondary" className="text-xs">{pet.school}</Badge>
                                            </div>
                                            <CardDescription>{pet.body}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-1">
                                                 {pet.talents.slice(0, 5).map((t, i) => (
                                                    <span key={i} className="text-xs px-1.5 py-0.5 bg-primary/5 text-primary rounded border border-primary/10">
                                                        {t}
                                                    </span>
                                                 ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col p-2 bg-muted/10 rounded border border-border/50">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
            <span className="font-mono text-lg font-bold">{value}</span>
        </div>
    );
}
