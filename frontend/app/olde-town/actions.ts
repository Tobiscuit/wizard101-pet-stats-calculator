'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { ForumThread, ForumCategory } from "@/types/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

// Helper function for server-side session
async function getSession() {
    return await auth.api.getSession({ headers: await headers() });
}

export type CreateThreadInput = {
    title: string;
    content: string;
    category: ForumCategory;
    authorWizardId?: string; // If null, posts as "User" (fallback)
    authorWizardName?: string; // Snapshot
    attachedAsset?: {
        type: 'wizard' | 'pet' | 'item';
        id: string;
        snapshot: any;
    };
    tags: string[];
};

export async function createThread(input: CreateThreadInput) {
    const session = await getSession();
    
    if (!session?.user?.id) {
        return { success: false, error: "You must be logged in to post." };
    }

    const { title, content, category, authorWizardId, authorWizardName, attachedAsset, tags } = input;

    if (!title || !content || !category) {
        return { success: false, error: "Missing required fields." };
    }

    // Basic Validation
    if (title.length > 100) return { success: false, error: "Title is too long (max 100 chars)." };
    if (content.length > 5000) return { success: false, error: "Content is too long (max 5000 chars)." };

    const db = getAdminFirestore();
    
    try {
        const threadRef = db.collection('threads').doc();
        
        const newThread: Partial<ForumThread> = {
            id: threadRef.id,
            authorId: session.user.id,
            authorName: session.user.name || "Unknown Wizard", // Default to NextAuth name
            authorWizardId: authorWizardId || undefined,
            // If a wizard persona is selected, override the display name, otherwise use User name
            // Actually, we usually want to show BOTH or just the Persona. 
            // Let's store the Persona Name separately so UI can decide: "Wolf StormBlade (Jrami)"
            
            category,
            title,
            content,
            attachedAsset,
            tags: tags.slice(0, 5), // Max 5 tags

            viewCount: 0,
            replyCount: 0,
            lastReplyAt: FieldValue.serverTimestamp() as any, // Initial sort
            
            isPinned: false,
            isLocked: false,
            
            createdAt: FieldValue.serverTimestamp() as any,
            updatedAt: FieldValue.serverTimestamp() as any,
        };

        await threadRef.set(newThread);

        revalidatePath('/olde-town');
        revalidatePath(`/olde-town/${category}`);
        
        return { success: true, threadId: threadRef.id };

    } catch (error) {
        console.error("Error creating thread:", error);
        return { success: false, error: "Failed to post thread. Please try again." };
    }
}

export type CreateReplyInput = {
    threadId: string;
    content: string;
    authorWizardId?: string; 
    authorWizardName?: string;
};

export async function createReply(input: CreateReplyInput) {
    const session = await getSession();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const { threadId, content, authorWizardId, authorWizardName } = input;
    if (!content || !threadId) return { success: false, error: "Missing fields" };

    const db = getAdminFirestore();

    try {
        await db.runTransaction(async (t) => {
            const threadRef = db.collection('threads').doc(threadId);
            const postsRef = threadRef.collection('posts').doc();

            // 1. Create Post
            t.set(postsRef, {
                id: postsRef.id,
                threadId,
                authorId: session.user.id,
                authorName: session.user.name || "Wizard",
                authorWizardId: authorWizardId || null,
                authorWizardName: authorWizardName || null,
                content,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
                reactions: {}
            });

            // 2. Update Thread Meta
            t.update(threadRef, {
                replyCount: FieldValue.increment(1),
                lastReplyAt: FieldValue.serverTimestamp(),
                lastReplyAuthorName: authorWizardName || session.user.name || "Wizard"
            });
        });

        revalidatePath(`/olde-town/thread/${threadId}`);
        return { success: true };

    } catch (error) {
        console.error("Error creating reply:", error);
        return { success: false, error: "Failed to reply." };
    }
}

export type ToggleReactionInput = {
    threadId: string;
    postId: string; // If same as threadId, it's the OP (Future proof)
    emoji: string;
};

export async function toggleReaction(input: ToggleReactionInput) {
    const session = await getSession();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const { threadId, postId, emoji } = input;
    const db = getAdminFirestore();
    const userId = session.user.id;

    try {
        await db.runTransaction(async (t) => {
            // Path: threads/{threadId}/posts/{postId}
            // Subcollection: .../posts/{postId}/likes/{userId}
            
            const postRef = db.collection('threads').doc(threadId).collection('posts').doc(postId);
            const likeRef = postRef.collection('likes').doc(userId);

            const likeSnap = await t.get(likeRef);
            const postSnap = await t.get(postRef);

            if (!postSnap.exists) throw new Error("Post not found");
            
            const currentReactions = postSnap.data()?.reactions || {};
            const currentCount = currentReactions[emoji] || 0;

            if (likeSnap.exists) {
                // User already liked? Check if it's the same emoji.
                const existingEmoji = likeSnap.data()?.emoji;
                
                if (existingEmoji === emoji) {
                     // Toggle OFF (Remove like)
                     t.delete(likeRef);
                     t.update(postRef, {
                        [`reactions.${emoji}`]: FieldValue.increment(-1)
                     });
                } else {
                    // Switch Vote (e.g. Heart -> Fire)
                    // 1. Remove old
                    t.delete(likeRef);
                    t.update(postRef, {
                        [`reactions.${existingEmoji}`]: FieldValue.increment(-1)
                    });
                    
                    // 2. Add new
                    t.set(likeRef, { userId, emoji, createdAt: FieldValue.serverTimestamp() });
                    t.update(postRef, {
                        [`reactions.${emoji}`]: FieldValue.increment(1)
                    });
                }
            } else {
                // Toggle ON (Add like)
                t.set(likeRef, { userId, emoji, createdAt: FieldValue.serverTimestamp() });
                t.update(postRef, {
                    [`reactions.${emoji}`]: FieldValue.increment(1)
                });
            }
        });

        revalidatePath(`/olde-town/thread/${threadId}`);
        return { success: true };

    } catch (error) {
        console.error("Error toggling reaction:", error);
        return { success: false, error: "Failed to react." };
    }
}
