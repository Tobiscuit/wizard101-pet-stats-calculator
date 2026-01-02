import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getGuilds } from "@/services/guild-service"
import { Search, Users, Shield, MapPin } from "lucide-react"
import Link from "next/link"

export default async function GuildsPage() {
  const guilds = await getGuilds()

  return (
    <div className="container py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight">Guild Directory</h1>
            <p className="text-muted-foreground mt-2">Find your fellowship in the spiral.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
            <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search guilds..." className="pl-9 bg-background" />
            </div>
            <Button>Create Guild</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guilds.map((guild) => (
            <Link key={guild.id} href={`/guilds/${guild.id}`} className="group">
                <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                             <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
                                Lvl {guild.level}
                             </Badge>
                             <div className={`
                                px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest
                                ${guild.faction === 'Ravenwood' ? 'bg-indigo-500/10 text-indigo-500' : ''}
                                ${guild.faction === 'Pigswick' ? 'bg-orange-500/10 text-orange-500' : ''}
                                ${guild.faction === 'Arcanum' ? 'bg-violet-500/10 text-violet-500' : ''}
                             `}>
                                {guild.faction}
                             </div>
                        </div>
                        <CardTitle className="text-xl font-serif group-hover:text-primary transition-colors">
                            {guild.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                            {guild.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {guild.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs font-normal opacity-80">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="text-muted-foreground text-sm flex gap-4 border-t pt-4">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{guild.memberCount} Members</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            <span>{guild.faction}</span>
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  )
}
