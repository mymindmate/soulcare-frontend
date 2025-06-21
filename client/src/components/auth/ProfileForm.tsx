import { useState, useRef, ChangeEvent } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CalendarIcon, Upload, Camera, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name is too long" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username is too long" })
    .regex(/^[a-z0-9_\.]+$/, { message: "Username can only contain lowercase letters, numbers, dots and underscores" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional()
    .or(z.literal('')),
  dateOfBirth: z.date({
    required_error: "Please select your date of birth",
  }),
  profileImage: z.string().optional(),
  address: z.string().max(200, { message: "Address is too long" }).optional(),
  hobbies: z.string().max(200, { message: "Hobbies list is too long" }).optional(),
  bio: z.string().max(500, { message: "Bio is too long" }).optional(),
});

interface ProfileFormProps {
  onComplete: () => void;
}

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const { user, updateProfile, isLoading, error } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date(1990, 0, 1),
      profileImage: user?.profileImage || "",
      address: user?.address || "",
      hobbies: user?.hobbies || "",
      bio: user?.bio || ""
    },
  });

  const handleProfilePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      form.setError("profileImage", { 
        message: "File size should be less than 5MB" 
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      form.setError("profileImage", { 
        message: "Please upload an image file" 
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      setProfileImagePreview(imageDataUrl);
      form.setValue("profileImage", imageDataUrl);
    };

    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearProfileImage = () => {
    setProfileImagePreview(null);
    form.setValue("profileImage", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setServerError(null);
    
    // Debug form values
    console.log("Submitting form with values:", values);
    
    try {
      // Convert date to string format for the API
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth.toISOString().split('T')[0],
        profileCompleted: true,
      };
      
      console.log("Sending profile update with formatted values:", formattedValues);
      
      const success = await updateProfile(user.id, formattedValues);
      
      if (success) {
        console.log("Profile update successful");
        onComplete();
      } else {
        console.error("Profile update returned false");
        setServerError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  if (!user) {
    return <div>User not found. Please login again.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text">
          Complete Your Profile
        </h1>
        <p className="text-neutral-600">
          Tell us about yourself to personalize your experience.
        </p>
      </div>
      
      <Tabs defaultValue="basicInfo" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basicInfo">Basic Info</TabsTrigger>
          <TabsTrigger value="photo">Profile Photo</TabsTrigger>
          <TabsTrigger value="details">Additional Details</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <TabsContent value="basicInfo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your public display name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
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
                            />
                          </FormControl>
                          <FormDescription>
                            Your contact email
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
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
                                  "w-full pl-3 text-left font-normal",
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

                  <div className="flex justify-between pt-4">
                    <span></span>
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab("photo")}
                      className="ml-auto"
                    >
                      Next: Profile Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-32 h-32 border-2 border-primary/20">
                        <AvatarImage src={profileImagePreview || undefined} alt="Profile" />
                        <AvatarFallback className="text-4xl font-light">
                          {form.getValues().name?.charAt(0) || user?.name?.charAt(0) || "U"}
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
                              <div className="flex flex-col space-y-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full"
                                  onClick={triggerFileInput}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload Photo
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => alert("Feature coming soon!")}
                                >
                                  <Camera className="mr-2 h-4 w-4" />
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

                    <div className="flex justify-between w-full pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveTab("basicInfo")}
                      >
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab("details")}
                      >
                        Next: Additional Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="123 Main St, City, State, Country" 
                            className="resize-none" 
                            {...field} 
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
                        <FormLabel>Hobbies & Interests</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Reading, painting, hiking, cooking..." 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Share your interests with others
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
                        <FormLabel>About Me</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us a little about yourself..." 
                            className="resize-none min-h-24" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A short description of yourself
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-4" />
                  
                  {(serverError || error) && (
                    <div className="text-sm text-red-500 font-medium">
                      {serverError || error}
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab("photo")}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Complete Profile"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Global submit button that appears on all tabs */}
            <div className="mt-8 flex justify-center">
              {(serverError || error) && (
                <div className="text-sm text-red-500 font-medium mb-4 text-center">
                  {serverError || error}
                </div>
              )}
              <Button 
                type="submit" 
                size="lg"
                disabled={isLoading}
                className="w-full max-w-md bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}