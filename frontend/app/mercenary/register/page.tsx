"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { scanMercenaryScreenshots, ScanResult } from "@/services/scanner-service";
import { saveVerifiedStats, toggleMercenaryListing } from "@/services/verification-service";
import { useProfile } from "@/hooks/use-profile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, CheckCircle2, Shield, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function MercenaryRegisterPage() {
    const { data: session } = useSession();
    const { wizards } = useProfile();
    const router = useRouter();

    const [scanning, setScanning] = useState(false);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [progress, setProgress] = useState(0);

    // Form State
    const [isPublic, setIsPublic] = useState(true);
    const [isMercenary, setIsMercenary] = useState(false);

    const handleUpload = async (e: React.FormEvent) => {
        // ... (Same as before)
        e.preventDefault();
        setScanning(true);
        setProgress(10);
        const interval = setInterval(() => { setProgress(prev => Math.min(prev + 10, 90)); }, 300);
        try {
            const formData = new FormData();
            const scanResult = await scanMercenaryScreenshots(formData);
            setResult(scanResult);
            setProgress(100);
        } finally {
            clearInterval(interval);
            setScanning(false);
        }
    };

    const handleConfirm = async () => {
        if (!result?.data || !session?.user?.id) return;
        if (wizards.length === 0) {
            alert("You need to create a Wizard first!");
            return;
        }
        
        const targetWizard = wizards[0];

        try {
            setSaving(true);
            
            // 1. Save Verified Stats to Wizard
            await saveVerifiedStats(
                session.user.id,
                targetWizard.id,
                result.data as any,
                isPublic
            );

            // 2. (Optional) List as Mercenary
            if (isMercenary) {
                await toggleMercenaryListing(session.user.id, targetWizard.id, true);
            }

            router.push('/profile');
        } catch (err) {
            console.error(err);
            alert("Failed to save verification.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container max-w-2xl py-12 animate-in fade-in duration-500">
            <div className="text-center mb-10 space-y-4">
                <Badge variant="outline" className="border-purple-500/50 text-purple-500 bg-purple-500/10 mb-4 px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-2" />
                    Powered by Gemini 3.0
                </Badge>
                <h1 className="text-4xl font-serif font-bold">Wizard Verification</h1>
                <p className="text-muted-foreground">
                    Verify your stats to earn the 
                    <span className="text-accent-gold font-bold"> Verified Badge </span> 
                    and optionally list yourself as a Mercenary.
                </p>
            </div>

            {!result ? (
                <Card className="border-dashed border-2 relative overflow-hidden group">
                    <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                            <Upload className="w-10 h-10 text-accent-gold" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Upload Screenshots</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                                Please upload your <span className="font-bold">Character Sheet</span> and <span className="font-bold">Advanced Stats</span>.
                            </p>
                        </div>
                        
                        <form onSubmit={handleUpload} className="w-full max-w-sm space-y-4 mt-4">
                             <Input type="file" multiple className="cursor-pointer file:text-accent-gold" />
                             {scanning ? (
                                <div className="space-y-2">
                                    <Progress value={progress} className="h-2" />
                                    <p className="text-xs text-muted-foreground animate-pulse">Analyzing pixels...</p>
                                </div>
                             ) : (
                                <Button type="submit" size="lg" className="w-full bg-accent-gold text-primary-foreground hover:bg-accent-gold/90">Start Scan</Button>
                             )}
                        </form>
                    </CardContent>
                    {scanning && <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 shadow-[0_0_20px_purple] animate-[scan_2s_ease-in-out_infinite]" />}
                </Card>
            ) : (
                <Card className="border-accent-gold/50 bg-accent/5 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            Stats Verified
                        </CardTitle>
                        <CardDescription>Gemini has extracted the following data.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-background border flex flex-col items-center">
                                <span className="text-muted-foreground text-xs uppercase tracking-wider">Damage</span>
                                <span className="text-3xl font-bold font-mono text-red-500">{result.data?.damage}%</span>
                            </div>
                            <div className="p-4 rounded-lg bg-background border flex flex-col items-center">
                                <span className="text-muted-foreground text-xs uppercase tracking-wider">Resist</span>
                                <span className="text-3xl font-bold font-mono text-blue-500">{result.data?.resist}%</span>
                            </div>
                            <div className="p-4 rounded-lg bg-background border flex flex-col items-center">
                                <span className="text-muted-foreground text-xs uppercase tracking-wider">Pierce</span>
                                <span className="text-3xl font-bold font-mono text-yellow-500">{result.data?.pierce}%</span>
                            </div>
                             <div className="p-4 rounded-lg bg-background border flex flex-col items-center">
                                <span className="text-muted-foreground text-xs uppercase tracking-wider">School</span>
                                <span className="text-3xl font-bold font-serif">{result.data?.school}</span>
                            </div>
                         </div>
                         
                         {/* Options */}
                         <div className="space-y-4 p-4 rounded-lg bg-background/50 border">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="public-stats" className="flex flex-col">
                                    <span>Make Stats Public</span>
                                    <span className="font-normal text-xs text-muted-foreground">Showverified stats on your profile card.</span>
                                </Label>
                                <Switch id="public-stats" checked={isPublic} onCheckedChange={setIsPublic} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="mercenary" checked={isMercenary} onCheckedChange={(c) => setIsMercenary(!!c)} />
                                <Label htmlFor="mercenary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    List me as a Mercenary for Hire
                                </Label>
                            </div>
                         </div>

                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setResult(null)} disabled={saving}>Retry</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleConfirm} disabled={saving}>
                             {saving ? "Saving..." : "Confirm & Save"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
