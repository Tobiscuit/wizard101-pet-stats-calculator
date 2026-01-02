import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getWizards } from "@/services/wizard-service"
import { Search, UserPlus, Zap } from "lucide-react"

export default async function WizardsPage() {
  const wizards = await getWizards()

  const getSchoolColor = (school: string) => {
    switch (school) {
        case 'Storm': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
        case 'Fire': return 'text-red-500 bg-red-500/10 border-red-500/20';
        case 'Ice': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        case 'Life': return 'text-green-500 bg-green-500/10 border-green-500/20';
        case 'Death': return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        case 'Myth': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
        case 'Balance': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
        default: return 'text-primary bg-primary/10 border-primary/20';
    }
  }

  return (
    <div className="container py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight">Find a Wizard</h1>
            <p className="text-muted-foreground mt-2">Search the archives for allies, rivals, and friends.</p>
        </div>
        <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search by name or school..." className="pl-9 bg-background" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wizards.map((wizard) => (
            <Card key={wizard.id} className="group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 bg-card/50">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar className="h-12 w-12 border border-border">
                        <AvatarImage src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${wizard.name}`} />
                        <AvatarFallback>{wizard.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-serif leading-none group-hover:text-primary transition-colors">
                            {wizard.name}
                        </CardTitle>
                        <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-widest ${getSchoolColor(wizard.school)}`}>
                            {wizard.school} • Lvl {wizard.level}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] mb-4">
                        {wizard.bio}
                    </p>
                    <div className="flex items-center justify-between">
                         <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            <span>{wizard.badge}</span>
                         </div>
                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary">
                            <UserPlus className="w-4 h-4" />
                         </Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
