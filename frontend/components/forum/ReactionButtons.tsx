'use client';

import { useState } from 'react';
import { toggleReaction } from '@/app/olde-town/actions';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    threadId: string;
    postId: string;
    initialReactions?: { [key: string]: number };
};

const EMOJIS = [
    { icon: '❤️', label: 'Love' },
    { icon: '🔥', label: 'Fire' },
    { icon: '✨', label: 'Magic' },
    { icon: '💀', label: 'Dead' },
];

export function ReactionButtons({ threadId, postId, initialReactions }: Props) {
    const [reactions, setReactions] = useState(initialReactions || {});
    // We track "optimistic click" locally just to prevent rapid spam, 
    // real "Am I active?" state requires fetching user data which we skip for MVP
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleReact = async (emoji: string) => {
        setIsLoading(emoji);
        
        // Optimistic Update (Guessing toggle ON for now, tough without user state)
        // Ideally we assume +1 if we don't know. 
        // For accurate UI, we should just wait for revalidatePath from server.
        // But let's try to be responsive.
        
        const prevCount = reactions[emoji] || 0;
        setReactions(prev => ({
            ...prev,
            [emoji]: prevCount + 1
        }));

        const result = await toggleReaction({
            threadId,
            postId,
            emoji
        });

        if (!result.success) {
            // Revert on failure
             setReactions(prev => ({
                ...prev,
                [emoji]: prevCount
            }));
            toast.error("Failed to react");
        }
        
        // Success: The server revalidates the page, so the *real* count will flow in via props shortly.
        // We clear loading.
        setIsLoading(null);
    };

    return (
        <div className="flex items-center gap-1 mt-2">
            {EMOJIS.map(({ icon }) => {
                const count = reactions[icon] || 0;
                return (
                    <Button 
                        key={icon}
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleReact(icon)}
                        disabled={!!isLoading}
                        className={cn(
                            "h-7 px-2 text-xs flex gap-1 items-center hover:bg-muted/50 rounded-full border border-transparent hover:border-border/40 transition-all",
                            count > 0 && "text-foreground font-medium opacity-100",
                            count === 0 && "text-muted-foreground opacity-70 grayscale hover:grayscale-0"
                        )}
                        title="Sign in to react" // Todo: Check Auth
                    >
                        <span className={isLoading === icon ? "animate-pulse" : ""}>{icon}</span>
                        {count > 0 && <span>{count}</span>}
                    </Button>
                );
            })}
        </div>
    );
}
