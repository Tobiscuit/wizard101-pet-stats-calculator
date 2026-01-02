"use client"

import { useState } from "react"
import { Upload, Sparkles, AlertCircle, ScanLine, Wand2, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function ScannerPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isScanning, setIsScanning] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<any | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image (PNG, JPG, or WEBP).",
        variant: "destructive",
      })
      return
    }
    setFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setScanResult(null)
  }

  const handleScan = async () => {
    if (!file) return

    setIsScanning(true)
    setScanResult(null)
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const { scanWizardImage } = await import("@/app/actions/scanner")
      const result = await scanWizardImage(formData)

      if (result.success) {
        toast({
            title: "Analysis Complete ✨",
            description: result.mock ? "Simulated Gemini 3.0 Response (Mock)" : "Stats successfully extracted from the ether.",
        })
        setScanResult(result.data)
      } else {
         toast({
            title: "Scan Failed",
            description: result.error,
            variant: "destructive"
        })
      }
    } catch (e) {
        console.error(e)
        toast({
            title: "Error",
            description: "Something went wrong during the scan.",
            variant: "destructive"
        })
    } finally {
        setIsScanning(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8 md:py-12 space-y-8 md:space-y-12 animate-in fade-in zoom-in duration-700">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary tracking-widest font-mono text-[10px] uppercase">
                Project Chronos
            </Badge>
            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 font-mono text-[10px]">
                Gemini 3.0 Preview
            </Badge>
        </div>
        <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight text-foreground drop-shadow-sm">
          Wizard Scanner
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Upload your character sheet. Our temporal vision engine extracts stats, gear, and identity instantly.
        </p>
      </div>

      <div className="grid gap-12">
        {/* Upload Zone */}
        <div 
          className={`relative group p-6 md:p-12 border transition-all duration-500 text-center cursor-pointer rounded-2xl overflow-hidden
            ${dragActive 
                ? "border-primary bg-primary/5 scale-[1.02] shadow-[0_0_40px_-10px_var(--color-primary)]" 
                : "border-border/60 hover:border-primary/40 hover:bg-muted/10"
            }
            ${file ? "border-solid border-primary/20 bg-background" : "border-dashed"}
          `}
        >
            <div 
                className="absolute inset-0 z-10"
                onDragEnter={handleDrag} 
                onDragLeave={handleDrag} 
                onDragOver={handleDrag} 
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            />
            
            <Input 
                id="file-upload"
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleChange}
            />

            {previewUrl ? (
                <div className="relative z-20 flex flex-col items-center w-full">
                    <div className="relative w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-black/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt="Preview" className="object-contain w-full h-full" />
                        
                        {/* Scanning Beam */}
                        {isScanning && (
                            <motion.div 
                                className="absolute inset-x-0 h-1 bg-primary/80 shadow-[0_0_20px_2px_var(--color-primary)] z-30"
                                initial={{ top: "0%" }}
                                animate={{ top: "100%" }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    repeatType: "reverse", 
                                    ease: "linear" 
                                }}
                            />
                        )}
                        
                        {/* Scanning Overlay */}
                        {isScanning && (
                            <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 z-20">
                                <div className="font-mono text-sm tracking-widest text-primary animate-pulse flex items-center gap-2">
                                    <ScanLine className="w-4 h-4" />
                                    ANALYZING VECTOR...
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 mt-8">
                        <Button variant="outline" size="lg" className="h-12" onClick={(e) => {
                            e.stopPropagation()
                            setFile(null)
                            setPreviewUrl(null)
                            setScanResult(null)
                        }}>
                            New Scan
                        </Button>
                        <Button size="lg" className="h-12 px-8 font-semibold shadow-lg shadow-primary/20" onClick={(e) => {
                            e.stopPropagation()
                            handleScan()
                        }} disabled={isScanning}>
                            {isScanning ? (
                                <>Processing...</>
                            ) : (
                                <><Wand2 className="w-4 h-4 mr-2" /> Extract Stats</>
                            )}
                        </Button>
                    </div>

                    {/* Results Area */}
                    {scanResult && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full mt-8 text-left"
                        >
                            <Card className="bg-muted/30 border-primary/20 overflow-hidden">
                                <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                                    <CardTitle className="font-mono text-sm uppercase tracking-wider text-primary flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Extraction Results_v3.0
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="max-h-96 overflow-auto p-6 font-mono text-xs md:text-sm text-foreground/80 whitespace-pre-wrap">
                                        {JSON.stringify(scanResult, null, 2)}
                                    </div>
                                    <div className="p-4 bg-background/50 border-t border-border flex justify-end gap-2">
                                         <Button variant="ghost" size="sm" className="text-muted-foreground">Copy JSON</Button>
                                         <Button variant="secondary" size="sm">Auto-Fill Profile</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            ) : (
                <div className="relative z-0 flex flex-col items-center gap-6 py-12">
                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                        <div className="relative p-6 bg-background rounded-full border border-border shadow-sm">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-serif font-bold text-2xl">Drop screenshot here</h3>
                        <p className="text-sm text-muted-foreground font-mono">.PNG, .JPG, .WEBP accepted</p>
                    </div>
                    <div className="flex gap-2 mt-4 text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-md border border-border/50">
                        <AlertCircle className="w-3 h-3" />
                        <span>Secure Analysis</span>
                    </div>
                </div>
            )}
        </div>

        {/* Instructions */}
        {!previewUrl && (
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { title: "Capture", desc: "Open your character sheet ('C') and take a screenshot." },
                    { title: "Upload", desc: "Drag the image above. Our engine detects stats automatically." },
                    { title: "Verify", desc: "Review the extracted data and save it to your Tome." }
                ].map((step, i) => (
                    <Card key={i} className="bg-background/40 border-border/60 hover:border-primary/20 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-xs font-mono font-bold text-primary/60 uppercase tracking-widest">Step 0{i+1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-serif font-semibold text-lg mb-1">{step.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}
