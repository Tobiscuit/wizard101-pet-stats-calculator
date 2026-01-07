import { Pet } from '@/types/firestore';
import { calculateTalentValue } from '@/lib/talent-formulas';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Sword, Shield, Crosshair, CircleDashed, Sparkles, BicepsFlexed, Dna,
    Gem, ScrollText
} from 'lucide-react';
import { clsx } from 'clsx';

type Props = {
    pet: Pet;
    className?: string;
};

// Mock Data for "Item Cards" (Cards the pet body gives)
function getItemCards(body: string) {
    const b = body.toLowerCase();
    if (b.includes('rain core')) return ['Supercharge', 'Stormblade'];
    if (b.includes('ghulture')) return ['Deathblade', 'Feint'];
    if (b.includes('gryphon')) return ['Balanceblade', 'Feint'];
    if (b.includes('frillasaur')) return ['Fireblade', 'Fuel'];
    return ['Blade (Generic)']; // Fallback
}

// --- Helpers ---
const TALENT_TYPES = [
    { keywords: ['dealer', 'giver', 'boon', 'bringer', 'pain'], icon: Sword, color: 'bg-red-500/10 text-red-500 border-red-500/20' },
    { keywords: ['proof', 'defy', 'ward', 'block'], icon: Shield, color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
    { keywords: ['sniper', 'sharp', 'shot', 'accuracy'], icon: Crosshair, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    { keywords: ['pierce', 'breaker'], icon: Sword, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' }, 
    { keywords: ['pip', 'plenty'], icon: CircleDashed, color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    { keywords: ['mighty', 'thinking', 'relentless'], icon: BicepsFlexed, color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
    { keywords: ['may cast', 'healing'], icon: Sparkles, color: 'bg-green-500/10 text-green-500 border-green-500/20' }
];

function getTalentMetadata(name: string) {
    const lower = name.toLowerCase();
    const match = TALENT_TYPES.find(t => t.keywords.some(k => lower.includes(k)));
    return match || { icon: Dna, color: 'bg-muted text-muted-foreground border-border/50' };
}

export function PetCard({ pet, className }: Props) {
    const displayTalents = pet.talents.slice(0, 6);
    const itemCards = getItemCards(pet.body);
    const isSocketed = Math.random() > 0.5; // Mock socket status

    // Calculate Progress for Stats (assuming max 255/260 usually)
    const getStatPercent = (val: number, max: number = 255) => Math.min(100, (val / max) * 100);

    return (
        <Card className={clsx(
            "relative group overflow-hidden transition-all duration-300",
            "shadow-sm hover:shadow-md border bg-card text-card-foreground",
            className
        )}>
             {/* "Listed" Badge (Top Right) */}
             <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-500">
                <Badge variant="outline" className="bg-background/50 backdrop-blur-sm shadow-sm select-none">
                    Listed
                </Badge>
            </div>

            <CardContent className="p-6 flex flex-col h-full gap-6">
                
                {/* 1. Header: Identity */}
                <div>
                     <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors font-serif">
                        {pet.nickname.toUpperCase()}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                         <Badge variant="secondary" className="rounded-sm px-1.5 py-0 text-[10px] uppercase font-bold text-muted-foreground bg-muted border-border">
                            {pet.school || "Balance"}
                        </Badge>
                        <Badge variant="secondary" className="rounded-sm px-1.5 py-0 text-[10px] uppercase font-bold text-muted-foreground bg-muted border-border">
                            Mega
                        </Badge>
                        <span className="text-xs italic text-muted-foreground">
                            {pet.body}
                        </span>
                    </div>
                </div>

                {/* 2. Talents Grid (with Values) */}
                <div className="grid grid-cols-2 gap-2">
                    {displayTalents.map((talent, i) => {
                        const { icon: Icon, color } = getTalentMetadata(talent);
                        const valueStr = pet.stats ? calculateTalentValue(talent, pet.stats) : null;
                        
                        return (
                            <div key={i} className={clsx(
                                "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-semibold border transition-colors select-none",
                                color
                            )}>
                                <Icon className="w-3.5 h-3.5 opacity-70 shrink-0" />
                                <div className="flex flex-col leading-none">
                                    <span className="uppercase tracking-wide text-[10px] opacity-80">{talent}</span>
                                    {valueStr && <span className="font-bold text-sm">{valueStr}</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>

                 {/* 3. Core Stats Block (The "Expansion") */}
                 {pet.stats && (
                    <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Core Stats</span>
                             <span className="text-[10px] text-muted-foreground/50 font-mono">2.0</span>
                        </div>
                        <div className="space-y-1.5">
                            {[
                                { label: 'STR', val: pet.stats.strength, max: 255 },
                                { label: 'INT', val: pet.stats.intellect, max: 250 },
                                { label: 'AGI', val: pet.stats.agility, max: 260 },
                                { label: 'WIL', val: pet.stats.will, max: 260 },
                                { label: 'POW', val: pet.stats.power, max: 250 },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-center gap-2 text-[10px]">
                                    <span className="w-6 font-bold text-muted-foreground">{stat.label}</span>
                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary/60 rounded-full" 
                                            style={{ width: `${getStatPercent(stat.val, stat.max)}%` }}
                                        />
                                    </div>
                                    <span className="w-8 text-right font-mono text-muted-foreground">{stat.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}

                {/* 4. Footer: Item Cards */}
                <div className="mt-auto border-t pt-3 flex items-center justify-between text-muted-foreground text-xs">
                    <div className="flex items-center gap-1.5">
                       <span className="uppercase tracking-widest text-[10px] font-bold opacity-60">Gives</span>
                        <div className="flex -space-x-1">
                            {itemCards.map((card, i) => (
                                <div key={i} className="px-1.5 py-0.5 bg-background border rounded text-[10px] shadow-sm z-10 hover:z-20" title={card}>
                                    {card}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Socket */}
                    <div className="flex items-center gap-2" title="Jewel Socket">
                         <div className={clsx(
                             "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                             isSocketed ? "bg-accent-gold/20 border-accent-gold text-accent-gold" : "border-border border-dashed text-muted-foreground"
                         )}>
                             <Gem className="w-2.5 h-2.5" />
                         </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
