import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getPosts } from "@/services/blog-service"
import { Search, PenTool, BookOpen, Heart, MessageSquare } from "lucide-react"
import Link from "next/link"

export default async function ScribePage() {
  const posts = await getPosts()

  return (
    <div className="container py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight">Scribe&apos;s Corner</h1>
            <p className="text-muted-foreground mt-2">Chronicles, guides, and stories from across the Spiral.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
            <Link href="/scribe/new">
                <Button size="lg" className="shadow-lg shadow-primary/20">
                    <PenTool className="w-4 h-4 mr-2" />
                    Write a Scroll
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
            <Link key={post.id} href={`/scribe/${post.slug}`} className="group">
                <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card/50">
                    <CardHeader>
                        <div className="flex gap-2 mb-3">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <CardTitle className="text-2xl font-serif group-hover:text-primary transition-colors leading-tight">
                            {post.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                            {post.excerpt}
                        </p>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${post.author.school === 'Storm' ? 'bg-purple-500' : 'bg-green-500'}`} />
                             <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{post.likes}</span>
                             </div>
                             <div className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>0</span>
                             </div>
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  )
}
