import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { Guild } from "@/types/firestore";

export async function getGuilds(faction?: string): Promise<Guild[]> {
    const guildsRef = collection(db, "guilds");
    let q = query(guildsRef, orderBy("memberCount", "desc"));

    if (faction && faction !== 'all') {
        q = query(guildsRef, where("faction", "==", faction), orderBy("memberCount", "desc"));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Guild);
}

export async function getGuildById(id: string): Promise<Guild | null> {
    const docRef = doc(db, "guilds", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
        return snap.data() as Guild;
    }
    return null;
}

export async function createGuild(uid: string, data: Omit<Guild, 'id' | 'leaderId' | 'createdAt' | 'updatedAt' | 'memberCount' | 'level'>) {
    // 1. Generate ID (Auto-ID or Slug)
    const guildRef = doc(collection(db, "guilds"));
    
    // 2. Construct Guild Object
    const newGuild: Guild = {
        id: guildRef.id,
        leaderId: uid,
        name: data.name,
        description: data.description,
        faction: data.faction,
        level: 1,
        tags: data.tags,
        memberCount: 1,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp
    };

    // 3. Save
    await setDoc(guildRef, newGuild);
    return newGuild;
}
