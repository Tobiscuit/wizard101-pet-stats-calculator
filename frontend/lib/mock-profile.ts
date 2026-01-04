import { UserProfile, Wizard, Pet } from '@/types/firestore';
import { Timestamp } from 'firebase/firestore';

// Mock Timestamp helper
const now = Timestamp.now();

export const MOCK_USER: UserProfile = {
    uid: 'mock-user-123',
    displayName: 'Wolf StormBlade',
    email: 'wolf@wizard101.com',
    photoURL: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Wolf',
    mainWizardId: 'wiz-1',
    theme: 'abyss',
    vouchCount: 42,
    hatchReputation: 800,
    marketReputation: 50,
    analytics: {
        totalHatches: 120,
        empowersEarned: 5000,
        empowersSpent: 1200,
        packsGifted: 5,
        mostHatchedSchool: 'Life', // "Looking for healers"
        favoritePetBody: 'Snappy Gryphon',
        goldSavedEstimate: 4500000, // 4.5m Gold Saved
        topPartner: 'Valdus Wildheart'
    },
    accountStatus: 'active',
    createdAt: now,
    updatedAt: now
};

export const MOCK_WIZARDS: Wizard[] = [
    {
        id: 'wiz-1',
        userId: 'mock-user-123',
        name: 'Wolf StormBlade',
        school: 'Storm',
        level: 170,
        isFriendly: true,
        lookingForGuild: false,
        hatchingSlots: 2,
        maxHatchingSlots: 4,
        isStatsPublic: true,
        bio: 'Hitting level cap! Farming Darkmoor for gear. PM for hatches.',
    },
    {
        id: 'wiz-2',
        userId: 'mock-user-123',
        name: 'Valdus Flame',
        school: 'Fire',
        level: 50,
        isFriendly: false,
        lookingForGuild: true, // Alt looking for guild
        hatchingSlots: 2,
        maxHatchingSlots: 2,
        isStatsPublic: false,
        bio: 'Just started this Fire wiz. Looking for a chill guild.',
    }
];

export const MOCK_PETS: Pet[] = [
    {
        id: 'pet-1',
        userId: 'mock-user-123',
        nickname: 'Sparky',
        body: 'Rain Core',
        school: 'Storm',
        stats: { strength: 255, intellect: 250, agility: 260, will: 260, power: 250 },
        talents: ['Storm-Dealer', 'Storm-Giver', 'Pain-Giver', 'Spell-Proof', 'Spell-Defy'],
        isLendable: true,
        equippedBy: 'wiz-1' 
    },
    {
        id: 'pet-2',
        userId: 'mock-user-123',
        nickname: 'Tank',
        body: 'Ornery Kookaburra',
        school: 'Fire',
        stats: { strength: 255, intellect: 240, agility: 250, will: 260, power: 250 },
        talents: ['Fire-Dealer', 'Fire-Giver', 'Spell-Proof', 'Spell-Defy', 'Mighty'],
        isLendable: true,
        equippedBy: 'wiz-2'
    },
    {
        id: 'pet-3',
        userId: 'mock-user-123',
        nickname: 'Heals 4 Days',
        body: 'Dryad',
        school: 'Life',
        stats: { strength: 250, intellect: 250, agility: 250, will: 250, power: 250 },
        talents: ['Unicorn', 'Fairy Friend', 'Life-Bat', 'Spell-Proof', 'Medic'],
        isLendable: false, // Not lending
    }
];
