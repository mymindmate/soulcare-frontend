import React, { useState, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { Loader2, Upload, X, Camera, CalendarIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  dateOfBirth: z.date().optional(),
  address: z.string().optional().or(z.literal("")),
  hobbies: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  profileImage: z.string().optional().or(z.literal(""))
});

export default function ProfileEdit() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    user?.profileImage || null
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
      address: user?.address || "",
      hobbies: user?.hobbies || "",
      bio: user?.bio || "",
      profileImage: user?.profileImage || ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    console.log("Submitting profile update:", values);
    
    try {
      // Format the date to ISO string for the API
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? 
          values.dateOfBirth.toISOString().split('T')[0] : 
          undefined
      };
      
      const success = await updateProfile(user.id, formattedValues);
      
      setIsLoading(false);
      
      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated!",
        });
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update your profile. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image less than 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfileImagePreview(result);
      form.setValue("profileImage", result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearProfileImage = () => {
    setProfileImagePreview(null);
    form.setValue("profileImage", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleBack = () => {
    setLocation("/dashboard");
  };

  if (!user) {
    return <div>Please log in to edit your profile.</div>;
  }

  return (
    <div className="container max-w-3xl py-10 relative mx-auto">
      {/* Background animated elements */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-24 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="flex flex-col gap-6 relative z-10 items-center text-center">
        <div className="flex items-center justify-between w-full">
          <div className="mx-auto">
            <Button
              variant="outline"
              onClick={handleBack}
              className="mb-2 transition-all duration-300 hover:shadow-md hover:scale-105 bg-white/80 backdrop-blur-sm border-indigo-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4 text-indigo-600" />
              <span className="text-indigo-700">Back to Dashboard</span>
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text animate-shimmer bg-[length:400%_100%]">Edit Your Profile</h1>
            <p className="text-indigo-600/80 font-medium">
              Customize your personal information and preferences
            </p>
          </div>
        </div>
        
        <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-70"></div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile Photo Card */}
            <Card className="overflow-hidden border-0 shadow-xl shadow-indigo-100/50 bg-white/80 backdrop-blur-sm relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-80"></div>
              <CardHeader className="relative">
                <CardTitle className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-indigo-500" />
                  <span>Profile Photo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-2 border-primary/20">
                      <AvatarImage src={profileImagePreview || undefined} alt="Profile" />
                      <AvatarFallback className="text-4xl font-light">
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {profileImagePreview && (
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon"
                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                        onClick={clearProfileImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleProfilePictureUpload}
                            />
                            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={triggerFileInput}
                                className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 hover:text-indigo-800 hover:shadow-md transition-all duration-300"
                              >
                                <Upload className="mr-2 h-4 w-4 text-indigo-500" />
                                Upload Photo
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => toast({
                                  title: "Coming soon",
                                  description: "This feature will be available soon!"
                                })}
                                className="border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 text-pink-700 hover:text-pink-800 hover:shadow-md transition-all duration-300"
                              >
                                <Camera className="mr-2 h-4 w-4 text-pink-500" />
                                Take Photo
                              </Button>
                            </div>
                          </>
                        </FormControl>
                        <FormDescription>
                          Upload a profile picture. Max size 5MB.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Basic Information Card */}
            <Card className="overflow-hidden border-0 shadow-xl shadow-blue-100/50 bg-white/80 backdrop-blur-sm relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-80"></div>
              <CardHeader className="relative">
                <CardTitle className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} className="border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 shadow-sm" />
                        </FormControl>
                        <FormDescription>
                          Your public display name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="johndoe@example.com" 
                            {...field} 
                            value={field.value || ""}
                            className="border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
                          />
                        </FormControl>
                        <FormDescription>
                          Your contact email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 shadow-sm transition-all duration-300 hover:bg-indigo-50/50",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Information Card */}
            <Card className="overflow-hidden border-0 shadow-xl shadow-purple-100/50 bg-white/80 backdrop-blur-sm relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 opacity-80"></div>
              <CardHeader className="relative">
                <CardTitle className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-5 0v-15A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 8A2.5 2.5 0 0 1 17 10.5v9a2.5 2.5 0 0 1-5 0v-9A2.5 2.5 0 0 1 14.5 8Z"/><path d="M3 10l2 2.25L7 10"/><path d="M21 10l-2 2.25L17 10"/></svg>
                  <span>Additional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="123 Main St, City, State, Country" 
                          className="resize-none border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 shadow-sm" 
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Your physical address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hobbies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hobbies</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Reading, traveling, cooking, etc." 
                          className="resize-none border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 shadow-sm" 
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        What do you enjoy doing in your free time?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself..." 
                          className="resize-none border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 shadow-sm" 
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        A short description about yourself
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-lg opacity-70 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-tilt blur-md group-hover:blur-xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-300 via-teal-400 to-green-300 bg-[length:400%_100%] rounded-lg opacity-50 group-hover:opacity-70 blur-lg animate-shimmer"></div>
              <Button 
                type="submit" 
                className="relative w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-xl py-6 px-10 font-bold shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transform hover:scale-102 transition-all duration-300 border border-emerald-600/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    <span className="relative">
                      <span className="absolute -inset-2 rounded-lg bg-white/10 blur animate-pulse opacity-70"></span>
                      <span>Saving Profile...</span>
                    </span>
                  </>
                ) : (
                  <span className="flex items-center gap-2 relative">
                    <span className="absolute -inset-2 rounded-lg bg-white/10 blur animate-pulse opacity-70"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    <span>Save Profile</span>
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}