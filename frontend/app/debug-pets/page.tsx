import { getPets } from '@/app/actions';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function DebugPetsPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    const result = await getPets();

    return (
        <div className="p-8 bg-black text-white font-mono whitespace-pre-wrap">
            <h1>Debug Pets</h1>
            <div>Session User ID: {session?.user?.id}</div>
            <div>Result:</div>
            {JSON.stringify(result, null, 2)}
        </div>
    );
}
