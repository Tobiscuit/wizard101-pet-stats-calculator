"use client";

import { useState, useRef, useEffect } from "react";
import { chatWithScribe } from "@/services/scribe-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Scroll, Send, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

type Message = {
    role: "user" | "model";
    parts: string;
};

export default function ScribePage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", parts: "Greetings, young Wizard. I am the Scribe. What knowledge do you seek about the Spiral today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend() {
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: "user", parts: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Send context excluding the very last user message (which is the new prompt)
            // Actually, for simplicity we send the whole history minus the new one as history
            const history = messages.map(m => ({ role: m.role, parts: m.parts }));
            const response = await chatWithScribe(history, userMsg.parts);
            
            const aiMsg: Message = { role: "model", parts: response.text };
            setMessages(prev => [...prev, aiMsg]);
        } catch (e) {
            setMessages(prev => [...prev, { role: "model", parts: "A mystical interference blocked my vision. Please try again." }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container max-w-4xl py-6 h-[calc(100vh-4rem)] flex flex-col animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Scroll className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
                        The Scribe
                        <span className="text-xs px-2 py-0.5 bg-accent-gold text-primary-foreground rounded-full">Gemini 3.0</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">Connected to the Living Web. Ask about drops, cheats, or lore.</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-4 pb-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <Avatar className="w-10 h-10 border-2 border-primary/20">
                                <AvatarImage src="https://api.dicebear.com/9.x/bottts/svg?seed=Scribe" />
                                <AvatarFallback>SC</AvatarFallback>
                            </Avatar>
                        )}
                        
                        <Card className={`max-w-[80%] shadow-md ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>
                            <CardContent className="p-4 text-sm leading-relaxed prose dark:prose-invert">
                                <ReactMarkdown>{msg.parts}</ReactMarkdown>
                            </CardContent>
                        </Card>

                        {msg.role === 'user' && (
                            <Avatar className="w-10 h-10 border-2 border-accent-gold/50">
                                <AvatarImage src="https://api.dicebear.com/9.x/avataaars/svg?seed=Wizard" />
                                <AvatarFallback>ME</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                
                {loading && (
                    <div className="flex gap-4">
                         <Avatar className="w-10 h-10 border-2 border-primary/20">
                            <AvatarFallback><Sparkles className="w-5 h-5 animate-spin" /></AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                            Consulting the archives...
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="mt-4 flex gap-2">
                <Input 
                    placeholder="Ask about the Darkmoor World..." 
                    className="flex-1"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    disabled={loading}
                />
                <Button onClick={handleSend} disabled={loading} size="icon" className="shrink-0 bg-accent-gold hover:bg-accent-gold/90">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
            </div>
        </div>
    );
}
