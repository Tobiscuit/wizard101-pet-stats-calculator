export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  author: {
    name: string;
    avatar?: string;
    school: string;
  };
  tags: string[];
  publishedAt: string;
  likes: number;
}

const MOCK_POSTS: BlogPost[] = [
  {
    id: "p1",
    slug: "guide-to-novus",
    title: "A Wizard's Guide to Novus",
    excerpt: "Everything you need to know about the abstract world of Novus and its drop rates.",
    content: "# A Wizard's Guide to Novus\n\nNovus is strange. Very strange. Here is what I found...\n\n## The Gear\nIt drops from the final boss.",
    author: {
        name: "Valdus",
        school: "Storm"
    },
    tags: ["Guide", "Novus", "Gear"],
    publishedAt: "2024-03-15",
    likes: 124
  },
  {
      id: "p2",
      slug: "pet-training-secrets",
      title: "How I got 5 Mighty Opals in one day",
      excerpt: "The secret farming spots KingsIsle doesn't want you to know about.",
      content: "It's all about the RNG manipulation...",
      author: {
          name: "PetMaster99",
          school: "Life"
      },
      tags: ["Pets", "Farming"],
      publishedAt: "2024-03-10",
      likes: 89
  }
];

export async function getPosts(): Promise<BlogPost[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_POSTS;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_POSTS.find(p => p.slug === slug);
}
