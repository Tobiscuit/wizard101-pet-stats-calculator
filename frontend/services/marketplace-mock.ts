// This file is a MOCK data provider for the Marketplace.
// To "disintegrate" this mock data, simply delete this file and point the interface to your real DB.

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  currency: "Empower TC" | "Gems" | "Gold";
  category: "Pets" | "Treasure Cards" | "Reagents" | "Housing";
  postedAt: string;
  imageUrl?: string;
}

export const MOCK_LISTINGS: MarketplaceListing[] = [
  {
    id: "m1",
    sellerId: "u2",
    sellerName: "StormCaller99",
    title: "Triple Double Rain Core",
    description: "Max stats (255) Rain Core with Triple Storm Damage and Double Universal Resist. Jewel socket ready.",
    price: 50,
    currency: "Empower TC",
    category: "Pets",
    postedAt: "2h ago",
    imageUrl: "/mock-pet-storm.png" 
  },
  {
    id: "m2",
    sellerId: "u3",
    sellerName: "LifeWizardSarah",
    title: "99x Pigsie Treasure Cards",
    description: "Selling bulk Pigsies. Great for crafting the spell or healing.",
    price: 1200,
    currency: "Empower TC",
    category: "Treasure Cards",
    postedAt: "5m ago"
  },
  {
    id: "m3",
    sellerId: "u4",
    sellerName: "CraftingGod",
    title: "10x Dragoon Reagents Bundle",
    description: "Alchemical Extract and Salts. Save yourself the grind.",
    price: 300,
    currency: "Gems",
    category: "Reagents",
    postedAt: "1d ago"
  },
  {
      id: "m4",
      sellerId: "u5",
      sellerName: "DecorDiva",
      title: "Rare Celestian Furniture Set",
      description: "Full set including the floating pillars and starry wallpapers.",
      price: 25000,
      currency: "Gold",
      category: "Housing",
      postedAt: "30m ago"
  }
];

export async function getMarketplaceListings(): Promise<MarketplaceListing[]> {
  // Mock API Delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return MOCK_LISTINGS;
}

export async function getListingById(id: string): Promise<MarketplaceListing | undefined> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_LISTINGS.find(l => l.id === id);
}
