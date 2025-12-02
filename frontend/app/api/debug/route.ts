import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    const envCheck = {
        hasDiscordId: !!process.env.DISCORD_CLIENT_ID,
        hasDiscordSecret: !!process.env.DISCORD_CLIENT_SECRET,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        serviceAccountLength: process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.length || 0,
    };

    try {
        const db = getAdminFirestore();
        const collections = await db.listCollections();
        const collectionNames = collections.map(c => c.id);

        return NextResponse.json({
            status: 'success',
            message: 'Connected to Firestore!',
            collections: collectionNames,
            env: envCheck
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack,
            env: envCheck
        }, { status: 500 });
    }
}
