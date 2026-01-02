"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { getUserProfile, updateUserProfile } from "@/services/profile-service"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Wand2 } from "lucide-react"

const profileFormSchema = z.object({
  wizardName: z
    .string()
    .min(2, {
      message: "Wizard name must be at least 2 characters.",
    })
    .max(30, {
      message: "Wizard name must not be longer than 30 characters.",
    }),
  school: z.string().min(1, {
    message: "Please select your school.",
  }),
  level: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 170, {
    message: "Level must be between 1 and 170.",
  }),
  bio: z.string().max(160).min(4),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Default values for the form
const defaultValues: Partial<ProfileFormValues> = {
  bio: "Just another wizard exploring the Spiral.",
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  useEffect(() => {
    async function fetchProfile() {
      if (session?.user?.id) { // Use ID from session if available, or email as fallback mapping
         // Note: NextAuth default session might not have ID easily, usually we rely on email or need to customize session callback.
         // For now assuming email-based ID or using the extracted ID. 
         // Actually, let's use email as ID for simplicity if uid is missing, or warn.
         const uid = session.user.email; // Simplified for now
         if (uid) {
             const profile = await getUserProfile(uid);
             if (profile) {
                 form.reset({
                     wizardName: profile.wizardName || "",
                     school: profile.school || "",
                     level: profile.level?.toString() || "",
                     bio: profile.bio || "",
                 });
             }
         }
      }
    }
    fetchProfile();
  }, [session, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!session?.user?.email) return;
    try {
        await updateUserProfile(session.user.email, {
            wizardName: data.wizardName,
            school: data.school,
            level: parseInt(data.level),
            bio: data.bio,
        });
        toast({
            title: "Profile Updated",
            description: "Your wizard stats have been saved to the Tome.",
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to save profile. Please try again.",
            variant: "destructive",
        });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you in the Tome.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
            <Wand2 className="w-4 h-4" />
            Auto-Fill with Scan
        </Button>
      </div>
      <Separator />
      
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="w-full md:w-1/3 h-fit">
            <CardHeader>
                <CardTitle>Your Wizard</CardTitle>
                <CardDescription>Main Avatar</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                 <Avatar className="h-32 w-32 rounded-xl border-4 shadow-sm">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="text-4xl">
                        {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User />}
                    </AvatarFallback>
                 </Avatar>
                 <Button variant="ghost" className="w-full">Change Photo</Button>
            </CardContent>
        </Card>

        <Card className="w-full md:w-2/3">
            <CardHeader>
                <CardTitle>Wizard Details</CardTitle>
                <CardDescription>Update your stats and bio.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="wizardName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Wizard Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Merle Ambrose" {...field} />
                            </FormControl>
                            <FormDescription>
                            Your in-game character name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="school"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>School</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a school" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="fire">Fire</SelectItem>
                                    <SelectItem value="ice">Ice</SelectItem>
                                    <SelectItem value="storm">Storm</SelectItem>
                                    <SelectItem value="life">Life</SelectItem>
                                    <SelectItem value="death">Death</SelectItem>
                                    <SelectItem value="myth">Myth</SelectItem>
                                    <SelectItem value="balance">Balance</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Level</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="170" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="Tell us about your wizarding journey..."
                                className="resize-none"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit">Update Profile</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
