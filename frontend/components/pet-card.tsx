import { Pet, UserProfile } from '@/types/firestore';
import { calculateTalentValue } from '@/lib/talent-formulas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Sword, 
    Shield, 
    Crosshair, 
    Zap, 
    CircleDashed, 
    Sparkles, 
    Brain, 
    BicepsFlexed, 
    Wind, 
    Scroll,
    Dna
} from 'lucide-react';
import { clsx } from 'clsx';

type Props = {
    pet: Pet;
    className?: string;
};

// --- Helpers ---
const TALENT_TYPES = [
    { keywords: ['dealer', 'giver', 'boon', 'bringer', 'pain'], icon: Sword, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
    { keywords: ['proof', 'defy', 'ward', 'block'], icon: Shield, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
    { keywords: ['sniper', 'sharp', 'shot', 'accuracy'], icon: Crosshair, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { keywords: ['pierce', 'breaker'], icon: Sword, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' }, // Pierce uses sword but yellow
    { keywords: ['pip', 'plenty'], icon: CircleDashed, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
    { keywords: ['mighty', 'thinking', 'relentless', 'brilliant', 'powerful', 'cautious'], icon: BicepsFlexed, color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' }, // Stat boosters
    { keywords: ['may cast', 'healing', 'sprite', 'unicorn', 'fairy'], icon: Sparkles, color: 'text-green-500 bg-green-500/10 border-green-500/20' }
];

function getTalentMetadata(name: string) {
    const lower = name.toLowerCase();
    const match = TALENT_TYPES.find(t => t.keywords.some(k => lower.includes(k)));
    
    if (match) return match;
    
    return { icon: Dna, color: 'text-muted-foreground bg-muted/10 border-border/50' };
}

export function PetCard({ pet, className }: Props) {
    const displayTalents = pet.talents.slice(0, 6); // Max 6 usually

    return (
        <Card className={clsx("hover:border-accent-gold/50 transition-colors h-full flex flex-col group overflow-hidden", className)}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-lg group-hover:text-accent-gold transition-colors font-serif tracking-tight">
                            {pet.nickname}
                        </CardTitle>
                        <CardDescription className="font-medium text-xs uppercase tracking-wider block">
                            {pet.body}
                        </CardDescription>
                    </div>
                    {pet.school && (
                         <Badge variant="secondary" className="text-xs">{pet.school}</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                {/* Talent Grid */}
                <div className="flex flex-wrap gap-2">
                    {displayTalents.map((talent, i) => {
                        const { icon: Icon, color } = getTalentMetadata(talent);
                        const valueStr = pet.stats ? calculateTalentValue(talent, pet.stats) : null;

                        return (
                            <div 
                                key={i} 
                                className={clsx(
                                    "px-2 py-1.5 rounded-md border flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105 cursor-help",
                                    color
                                )}
                                title={valueStr ? `Calculated Value: ${valueStr}` : "Utility Talent"}
                            >
                                <Icon className="w-3.5 h-3.5 opacity-70" />
                                <span>{talent}</span>
                                {valueStr && (
                                    <span className="ml-1 opacity-90 bg-background/50 px-1 rounded text-[10px]">
                                        {valueStr.replace('%', '')}%
                                    </span>
                                )}
                            </div>
                        );
                    })}
                    {pet.talents.length > 5 && (
                         <span className="text-xs text-muted-foreground self-center px-1">
                            +{pet.talents.length - 6} more
                         </span>
                    )}
                </div>

                {/* Stat Bar (Micro) */}
                {pet.stats && (
                    <div className="mt-4 pt-3 border-t flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">
                        <span>STR {pet.stats.strength}</span>
                        <span>WIL {pet.stats.will}</span>
                        <span>POW {pet.stats.power}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
