export type Stats = {
    strength: number;
    intellect: number;
    agility: number;
    will: number;
    power: number;
};

export function calculateTalentValue(talentName: string, stats: Stats): string | null {
    const name = talentName.toLowerCase();
    const { strength, will, power, agility } = stats;

    // Base Calculation Variables
    // Damage/Punch: (2*Str + 2*Will + Power)
    const damageBase = (2 * strength + 2 * will + power);

    // Resist/Ward: (2*Str + 2*Agi + Power)
    const resistBase = (2 * strength + 2 * agility + power);

    // Critical: (2*Agi + 2*Will + Power)
    // const critBase = (2 * agility + 2 * will + power);

    let value = 0;

    // Damage Talents
    if (name.includes("dealer")) {
        value = (damageBase * 3) / 400;
    } else if (name.includes("giver") || name.includes("pain-giver")) {
        value = (damageBase * 1) / 200; // Equivalent to 2/400
    } else if (name.includes("boon") || name.includes("bringer") || name.includes("pain-bringer")) {
        value = (damageBase * 1) / 400;
    }

    // Resist Talents
    else if (name.includes("proof") || name.includes("spell-proof")) {
        value = resistBase / 125; // Equivalent to 3.2/400 roughly? No, Proof is ~10% max. (2*255 + 2*260 + 250)/125 = 10.24
    } else if (name.includes("defy") || name.includes("spell-defying")) {
        value = resistBase / 250; // Half of proof
    }

    // Pierce (simplified)
    else if (name.includes("pierce") || name.includes("armor breaker")) {
        // Breaker is usually around 3-4%
        // Formula is roughly (2*Str + 2*Agi + Power) / 400
        value = resistBase / 400;
    }

    if (value > 0) {
        // Round to nearest integer for display, or 1 decimal if small?
        // W101 usually rounds normally.
        return `${Math.round(value)}%`;
    }

    return null;
}
