'use client';

import { useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { updateLastSeen } from '@/app/actions';

export function usePresence() {
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user) return;

        // Update immediately on mount
        updateLastSeen();

        // Update every 5 minutes
        const interval = setInterval(() => {
            updateLastSeen();
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [session]);
}
