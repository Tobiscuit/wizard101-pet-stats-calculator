import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getGuildById } from "@/services/guild-service"
import { Shield, Users, Trophy, MapPin, Swords, Scroll } from "lucide-react"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function GuildDetailPage({ params }: PageProps) {
  const guild = await getGuildById(params.id)

  if (!guild) {
    notFound()
  }

  return (
    <div className="container py-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Banner */}
      <div className="relative rounded-xl overflow-hidden bg-muted h-48 md:h-64 flex items-end p-6 border border-border">
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
         <div className="relative z-20 flex flex-col md:flex-row gap-4 items-start md:items-end justify-between w-full">
            <div>
                <div className="flex gap-2 mb-2">
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 backdrop-blur-md">
                        Level {guild.level} Guild
                    </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground drop-shadow-md">
                    {guild.name}
                </h1>
            </div>
            <Button size="lg" className="shadow-lg shadow-primary/20 font-semibold">
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
                <CardContent className="text-muted-foreground leading-relaxed">
                    {guild.description}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {guild.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="px-3 py-1">#{tag}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif text-2xl flex items-center gap-2">
                         <Swords className="w-5 h-5 text-muted-foreground" />
                        Active Roster
                    </CardTitle>
                    <CardDescription>Only displaying officers and leaders.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {guild.members.length > 0 ? guild.members.map(member => (
                        <div key={member.userId} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${member.wizardName}`} />
                                    <AvatarFallback>{member.wizardName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{member.wizardName}</div>
                                    <div className="text-xs text-muted-foreground">{member.school} • {member.joinedAt}</div>
                                </div>
                            </div>
                            <Badge variant={member.role === 'Leader' ? "default" : "outline"}>
                                {member.role}
                            </Badge>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-muted-foreground italic">
                            Roster is hidden or empty.
                        </div>
                    )}
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
                        <span className="font-medium">{guild.faction}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                         <span className="text-muted-foreground">Members</span>
                         <span className="font-medium">{guild.memberCount} / 100</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Established</span>
                        <span className="font-medium">2023</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Activity</span>
                        <span className="text-green-500 font-medium flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            High
                        </span>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Office Hours</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Mostly active during EST evenings and weekend raids.
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
