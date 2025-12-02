import NextAuth from "next-auth";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: FirestoreAdapter(getAdminFirestore()),
    session: { strategy: "jwt" }, // Force JWT for Edge compatibility if needed, but Adapter usually implies database. 
    // Wait, if we use Adapter, we can't run fully on Edge for session strategy 'database'.
    // But middleware only needs to verify the session token (JWT).
    // If we use database sessions, middleware can't verify them without database access.
    // Let's stick to the default strategy but ensure middleware uses authConfig which DOESN'T have the adapter.
});
