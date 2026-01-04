"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getGuilds, createGuild } from "@/services/guild-service";
import { Guild } from "@/types/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Users, Shield, Plus, Sword, Sparkles, Scroll } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const FACTIONS = {
    ravenwood: { label: "Ravenwood", icon: <Scroll className="w-4 h-4 mr-2" />, color: "text-green-500" },
    pigswick: { label: "Pigswick", icon: <Sword className="w-4 h-4 mr-2" />, color: "text-orange-500" },
    arcanum: { label: "Arcanum", icon: <Sparkles className="w-4 h-4 mr-2" />, color: "text-purple-500" },
};

export default function GuildsPage() {
    const { data: session } = useSession();
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    // Create Form State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newFaction, setNewFaction] = useState<"ravenwood" | "pigswick" | "arcanum">("ravenwood");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadGuilds();
    }, [activeTab]);

    async function loadGuilds() {
        setLoading(true);
        try {
            const data = await getGuilds(activeTab === "all" ? undefined : activeTab);
            setGuilds(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate() {
        if (!session?.user?.id || !newName) return;
        setCreating(true);
        try {
            await createGuild(session.user.id, {
                name: newName,
                description: newDesc,
                faction: newFaction,
                tags: [] // TODO: Add Tag Input
            });
            setIsCreateOpen(false);
            loadGuilds(); // Refresh
        } catch (err) {
            console.error(err);
            alert("Failed to create guild");
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="container py-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold">Guild Directory</h1>
                    <p className="text-muted-foreground">Find your faction. Join the cause.</p>
                </div>
                
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-accent-gold text-primary-foreground hover:bg-accent-gold/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Register Guild
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Register New Guild</DialogTitle>
                            <DialogDescription>
                                Establish your order. Choose your faction wisely.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Guild Name</Label>
                                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. The Spiral Keepers" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Faction</Label>
                                <Select value={newFaction} onValueChange={(v: any) => setNewFaction(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ravenwood">Ravenwood (Social/Questing)</SelectItem>
                                        <SelectItem value="pigswick">Pigswick (PVP/Competitive)</SelectItem>
                                        <SelectItem value="arcanum">Arcanum (Raids/Meta)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="What is your guild about?" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={creating}>
                                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Guild"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="ravenwood" className="data-[state=active]:text-green-500">Ravenwood</TabsTrigger>
                    <TabsTrigger value="pigswick" className="data-[state=active]:text-orange-500">Pigswick</TabsTrigger>
                    <TabsTrigger value="arcanum" className="data-[state=active]:text-purple-500">Arcanum</TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        // Skeletons
                        Array.from({ length: 3 }).map((_, i) => (
                            <Card key={i} className="opacity-50">
                                <CardHeader className="space-y-2">
                                    <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                                </CardHeader>
                                <CardContent>
                                    <div className="h-20 bg-muted rounded animate-pulse" />
                                </CardContent>
                            </Card>
                        ))
                    ) : guilds.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-muted-foreground">
                            <Shield className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No guilds found in this faction yet.</p>
                        </div>
                    ) : (
                        guilds.map((guild) => (
                            <Card key={guild.id} className="group hover:border-accent-gold/50 transition-colors">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl">{guild.name}</CardTitle>
                                            <div className={`flex items-center text-xs font-bold uppercase tracking-wider ${FACTIONS[guild.faction].color}`}>
                                                {FACTIONS[guild.faction].icon}
                                                {FACTIONS[guild.faction].label}
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="bg-accent/10">
                                            Lvl {guild.level}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {guild.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {guild.tags?.map(tag => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between text-sm text-muted-foreground border-t bg-muted/5 p-4">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-2" />
                                        {guild.memberCount} Members
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 hover:text-accent-gold">
                                        View Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </Tabs>
        </div>
    );
}
