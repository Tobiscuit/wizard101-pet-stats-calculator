import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export interface UserProfile {
  id: string;
  wizardName?: string;
  school?: string;
  level?: number;
  bio?: string;
  photoUrl?: string; // For the extracted wizard image
  createdAt?: any;
  updatedAt?: any;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!userId) return null;
  
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() } as UserProfile;
  } else {
    return null;
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  if (!userId) throw new Error("User ID is required");

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Create new profile
    await setDoc(userRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    // Update existing
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }
}
