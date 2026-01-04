import { db } from "@/lib/firebase";
import { doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Wizard, MercenaryProfile } from "@/types/firestore";

export type VerifiedStatsInput = {
    damage: number;
    resist: number;
    pierce: number;
    accuracy: number;
    school: string;
};

// 1. Universal Verification (For any Wizard)
export async function saveVerifiedStats(
    uid: string,
    wizardId: string,
    stats: VerifiedStatsInput,
    isPublic: boolean
) {
    if (!uid || !wizardId) throw new Error("Missing UID or WizardID");

    const wizardRef = doc(db, "users", uid, "wizards", wizardId);
    
    await updateDoc(wizardRef, {
        verifiedStats: stats,
        lastVerifiedAt: serverTimestamp(),
        isStatsPublic: isPublic
    });
}

// 2. Enable Mercenary Listing (Optional)
export async function toggleMercenaryListing(
    uid: string, 
    wizardId: string, 
    enabled: boolean,
    pricePerRun: string = "Negotiable"
) {
    const mercRef = doc(db, "mercenaries", wizardId);
    
    if (enabled) {
        // Create/Update Listing
        const listing: MercenaryProfile = {
            wizardId,
            userId: uid,
            badges: {}, // Preserve existing if merge? (TODO)
            totalRuns: 0,
            pricePerRun,
            enabled: true
        };
        // Use setDoc with merge to preserve badges/runs if re-enabling
        await setDoc(mercRef, listing, { merge: true });
    } else {
        // Disable Listing
        await updateDoc(mercRef, { enabled: false });
    }
}
