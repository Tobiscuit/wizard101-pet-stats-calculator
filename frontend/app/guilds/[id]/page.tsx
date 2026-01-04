import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getGuildById } from "@/services/guild-service"
import { Shield, Users, Trophy, MapPin, Swords, Scroll, Sparkles } from "lucide-react"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

const FACTIONS = {
    ravenwood: { label: "Ravenwood", icon: <Scroll className="w-5 h-5" />, color: "text-green-500", bg: "bg-green-500/10" },
    pigswick: { label: "Pigswick", icon: <Swords className="w-5 h-5" />, color: "text-orange-500", bg: "bg-orange-500/10" },
    arcanum: { label: "Arcanum", icon: <Sparkles className="w-5 h-5" />, color: "text-purple-500", bg: "bg-purple-500/10" },
};

export default async function GuildDetailPage({ params }: PageProps) {
  const guild = await getGuildById(params.id)

  if (!guild) {
    notFound()
  }

  const faction = FACTIONS[guild.faction];

  return (
    <div className="container py-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Banner */}
      <div className="relative rounded-xl overflow-hidden bg-muted h-64 flex items-end p-8 border border-border group">
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
         
         {/* Faction Background Effect */}
         <div className={`absolute top-0 right-0 w-64 h-64 ${faction.color} opacity-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2`} />

         <div className="relative z-20 flex flex-col md:flex-row gap-6 items-start md:items-end justify-between w-full">
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Badge variant="outline" className={`${faction.color} ${faction.bg} border-current/20 backdrop-blur-md px-3 py-1 flex items-center gap-2`}>
                        {faction.icon}
                        {faction.label}
                    </Badge>
                    <Badge variant="secondary" className="bg-background/50 backdrop-blur-md">
                        Lvl {guild.level}
                    </Badge>
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground drop-shadow-sm tracking-tight">
                    {guild.name}
                </h1>
            </div>
            <Button size="lg" className="shadow-lg shadow-primary/20 font-semibold min-w-[160px] bg-accent-gold text-primary-foreground hover:bg-accent-gold/90">
                Request to Join
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-serif text-2xl flex items-center gap-2">
                        <Scroll className="w-5 h-5 text-muted-foreground" />
                        About Us
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed text-lg">
                    {guild.description}
                    <div className="mt-8 flex flex-wrap gap-2">
                        {guild.tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">#{tag}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif text-2xl flex items-center gap-2">
                         <Users className="w-5 h-5 text-muted-foreground" />
                        Roster
                    </CardTitle>
                    <CardDescription>
                        {guild.memberCount} active members.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10 text-muted-foreground">
                    <p>Roster viewing is currently restricted to members.</p>
                </CardContent>
            </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <Card className="bg-secondary/10 border-none shadow-inner">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Guild Stats
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Faction</span>
                        <span className={`font-medium ${faction.color}`}>{guild.faction}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Leader</span>
                        <span className="font-medium truncate max-w-[120px]">{guild.leaderId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Established</span>
                        <span className="font-medium">
                            {guild.createdAt?.seconds ? new Date(guild.createdAt.seconds * 1000).getFullYear() : 'Unknown'}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
