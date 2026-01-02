import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMarketplaceListings } from "@/services/marketplace-mock"
import { Search, ShoppingBag, Coins, Filter, Tag } from "lucide-react"
import Link from "next/link"

export default async function MarketplacePage() {
  const listings = await getMarketplaceListings()

  return (
    <div className="container py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight">Bazaar 2.0</h1>
            <p className="text-muted-foreground mt-2">Trade pets, treasure cards, and services safely.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
            <Button size="lg" className="shadow-lg shadow-primary/20">
                <Tag className="w-4 h-4 mr-2" />
                Sell Item
            </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
             <TabsList className="bg-muted/50 border border-border w-full flex-wrap h-auto p-1">
                <TabsTrigger value="all" className="flex-1">All Items</TabsTrigger>
                <TabsTrigger value="pets" className="flex-1">Pets</TabsTrigger>
                <TabsTrigger value="tc" className="flex-1">TCs</TabsTrigger>
                <TabsTrigger value="services" className="flex-1">Services</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search listings..." className="pl-9 bg-background" />
            </div>
        </div>

        <TabsContent value="all" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {listings.map((item) => (
                    <Card key={item.id} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden bg-card/50">
                        <div className="aspect-square bg-muted/20 relative flex items-center justify-center p-4">
                            {/* Placeholder for Item Image */}
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <ShoppingBag className="w-8 h-8 text-primary/60" />
                            </div>
                            <Badge className="absolute top-2 right-2 bg-background/80 hover:bg-background border-border text-foreground backdrop-blur-md font-mono text-xs">
                                {item.postedAt}
                            </Badge>
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider mb-2">
                                    {item.category}
                                </Badge>
                            </div>
                            <CardTitle className="text-lg font-serif leading-tight group-hover:text-primary transition-colors">
                                {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                                {item.description}
                            </p>
                        </CardContent>
                        <CardFooter className="pt-4 border-t bg-muted/20 flex justify-between items-center">
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                                <Coins className="w-4 h-4 text-yellow-500" />
                                <span>{item.price}</span>
                                <span className="text-xs text-muted-foreground uppercase">{item.currency}</span>
                            </div>
                             <div className="text-xs text-muted-foreground">
                                by {item.sellerName}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
