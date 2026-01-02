export interface GuildMember {
  userId: string;
  wizardName: string;
  school: string;
  role: "Leader" | "Officer" | "Member";
  joinedAt: string;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  level: number;
  memberCount: number;
  faction: "Ravenwood" | "Pigswick" | "Arcanum";
  tags: string[];
  members: GuildMember[];
  bannerUrl?: string; // Optional custom banner
}

// "Spun" names of popular W101 communities/guilds
const MOCK_GUILDS: Guild[] = [
  {
    id: "g1",
    name: "The Spiral Hub", // Spin on "Wizard101 Central"
    description: "The nexus of all wizarding knowledge. Guides, forums, and friendships found here.",
    level: 20,
    memberCount: 95,
    faction: "Ravenwood",
    tags: ["Social", "Guides", "All Schools"],
    members: [
        { userId: "u1", wizardName: "Merle's Favorite", school: "Balance", role: "Leader", joinedAt: "2018-09-02" }
    ]
  },
  {
    id: "g2",
    name: "Hatchery Heroes", // Spin on "Pet Central"
    description: "Lending helpful pets to those in need. Max stats for everyone!",
    level: 18,
    memberCount: 82,
    faction: "Arcanum",
    tags: ["Pets", "Hatching", "Helping"],
    members: []
  },
  {
    id: "g3",
    name: "Blades for Hire", // Spin on "Mercenaries101"
    description: "Stuck on a boss? We'll blade you through it. Fast runs, no questions asked.",
    level: 15,
    memberCount: 45,
    faction: "Pigswick",
    tags: ["PVE", "Boss Help", "Speedruns"],
    members: []
  },
  {
      id: "g4",
      name: "Gma's Gang", // Spin on "Gma" / Final Bastion context maybe? Or just generic funny one.
      description: "Old school wizards who remember when Dragonspyre was the level cap.",
      level: 50,
      memberCount: 12,
      faction: "Ravenwood",
      tags: ["Veteran", "Social", "Raids"],
      members: []
  }
];

export async function getGuilds(): Promise<Guild[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_GUILDS;
}

export async function getGuildById(id: string): Promise<Guild | undefined> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_GUILDS.find(g => g.id === id);
}
