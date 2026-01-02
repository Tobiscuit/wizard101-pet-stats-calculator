import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getPostBySlug } from "@/services/blog-service"
import { Calendar, Heart, Share2, CornerUpLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Same simple renderer as editor (shared logic in real app)
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-serif font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-serif font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>
        if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:text-primary">{line.replace('- ', '')}</li>
        if (line === '') return <br key={i} />
        return <p key={i} className="mb-4 leading-relaxed text-lg">{line}</p>
    })
  }

  return (
    <div className="container max-w-3xl py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link href="/scribe">
        <Button variant="ghost" className="pl-0 gap-2 text-muted-foreground hover:text-primary">
            <CornerUpLeft className="w-4 h-4" />
            Back to Library
        </Button>
      </Link>

      <div className="space-y-4 text-center">
        <div className="flex justify-center gap-2">
            {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="px-3 py-1 font-mono uppercase text-xs tracking-widest">
                    {tag}
                </Badge>
            ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">{post.title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{post.excerpt}</p>
      </div>

      <div className="flex items-center justify-between border-y border-border py-4">
        <div className="flex items-center gap-3">
             <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary">{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
                <div className="font-semibold">{post.author.name}</div>
                <div className="text-muted-foreground">{post.publishedAt} • 5 min read</div>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
                <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="w-4 h-4" />
            </Button>
        </div>
      </div>

      <article className="prose dark:prose-invert max-w-none font-serif">
         {renderContent(post.content)}
      </article>

      <div className="border-t border-border mt-12 pt-8 text-center">
         <h3 className="text-lg font-semibold mb-2">Enjoyed this scroll?</h3>
         <p className="text-muted-foreground mb-4">Join the discussion in the guild hall.</p>
         <Button>Join Community</Button>
      </div>
    </div>
  )
}
