export interface WizardProfile {
  id: string;
  name: string;
  school: "Fire" | "Ice" | "Storm" | "Myth" | "Life" | "Death" | "Balance";
  level: number;
  avatarUrl?: string;
  badge?: string;
  bio: string;
}

const MOCK_WIZARDS: WizardProfile[] = [
  {
    id: "w1",
    name: "Wolf StormBlade",
    school: "Storm",
    level: 170,
    badge: "PVP Warlord",
    bio: "Hitting hard and fizzling often. Member of The Spiral Hub."
  },
  {
    id: "w2",
    name: "Sarah LifeSong",
    school: "Life",
    level: 160,
    badge: "Master Artisan",
    bio: "Here to keep you alive. jade gear ready."
  },
  {
      id: "w3",
      name: "Valdus Hex",
      school: "Balance",
      level: 50,
      badge: "One in a Million",
      bio: "Leveling up slowly. Looking for questing partners in Dragonspyre."
  },
  {
      id: "w4",
      name: "Jack Frost",
      school: "Ice",
      level: 100,
      badge: "Grandmaster Gardener",
      bio: "Just farming couch potatoes. Don't mind me."
  },
  {
      id: "w5",
      name: "Malorn AshThorn",
      school: "Death",
      level: 170,
      badge: "Hero of Wallaru",
      bio: "Soloing everything. Drain tank build."
  }
];

export async function getWizards(): Promise<WizardProfile[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  return MOCK_WIZARDS;
}
