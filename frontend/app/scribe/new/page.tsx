"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, Link as LinkIcon, List, Eye, Code, Save, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function NewScrollPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handlePublish = async () => {
    toast({
        title: "Publishing Scroll...",
        description: "Your wisdom is being inscribed into the archives.",
    })
    // Mock Delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast({
        title: "Published!",
        description: "Your scroll is now live.",
    })
    router.push("/scribe")
  }

  // Simple Markdown Preview Renderer (Mock)
  const renderPreview = (text: string) => {
    if (!text) return <p className="text-muted-foreground italic">Start writing to see the preview...</p>
    
    return text.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-serif font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-serif font-bold mt-3 mb-2">{line.replace('## ', '')}</h2>
        if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.replace('- ', '')}</li>
        if (line === '') return <br key={i} />
        return <p key={i} className="mb-2 leading-relaxed">{line}</p>
    })
  }

  return (
    <div className="container max-w-5xl py-8 space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
             <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider font-mono">
                <span className="text-primary">Draft</span>
                <span>/</span>
                <span>New Article</span>
             </div>
             <Input 
                placeholder="Enter a Magical Title..." 
                className="text-4xl font-serif font-bold border-none shadow-none px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/40 bg-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
             />
         </div>
         <div className="flex gap-2">
            <Button variant="ghost">Save Draft</Button>
            <Button onClick={handlePublish} className="shadow-lg shadow-primary/20">
                <Send className="w-4 h-4 mr-2" />
                Publish
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-250px)] min-h-[500px]">
        {/* Editor Pane */}
        <div className="flex flex-col gap-2 h-full">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md border border-border">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background"><Bold className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background"><Italic className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background"><LinkIcon className="w-4 h-4" /></Button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background"><List className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background"><Code className="w-4 h-4" /></Button>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">Markdown Supported</Badge>
            </div>
            <Textarea 
                placeholder="Tell your story..." 
                className="flex-1 resize-none font-mono text-sm leading-relaxed p-6 bg-card/50 border-border/50 focus-visible:ring-primary/20"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>

        {/* Live Preview Pane */}
        <div className="hidden lg:flex flex-col gap-2 h-full">
            <div className="flex items-center justify-between px-1 h-10">
                 <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live Preview
                 </span>
            </div>
            <div className="flex-1 rounded-md border border-border/50 bg-card p-8 prose dark:prose-invert max-w-none overflow-auto custom-scrollbar">
                {title && <h1 className="text-4xl font-serif font-bold mb-6">{title}</h1>}
                {renderPreview(content)}
            </div>
        </div>
      </div>
    </div>
  )
}
