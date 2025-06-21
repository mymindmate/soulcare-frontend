import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

type AuthStep = "login" | "verify" | "profile";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export function Auth() {
  const { isAuthenticated, isProfileComplete, user, updateProfile, logout } = useAuth();
  const [step, setStep] = useState<AuthStep>("login");
  const [mobileNumber, setMobileNumber] = useState("");
  const [initialOtp, setInitialOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      username: "",
    },
  });

  useEffect(() => {
    // If user is authenticated and profile is complete, redirect to home
    if (isAuthenticated && isProfileComplete) {
      setLocation("/");
    } 
    // If user is authenticated but profile is not complete, show profile form
    else if (isAuthenticated && !isProfileComplete && user) {
      setStep("profile");
    }
  }, [isAuthenticated, isProfileComplete, user, setLocation]);

  const handleLoginSuccess = (mobile: string, otp: string) => {
    setMobileNumber(mobile);
    setInitialOtp(otp);
    setStep("verify");
  };

  const handleVerificationSuccess = () => {
    setStep("profile");
  };

  const handleProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await updateProfile(user.id, {
        ...values,
        profileCompleted: true
      });
      
      setIsSubmitting(false);
      
      if (success) {
        setLocation("/dashboard");
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      setIsSubmitting(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleBack = () => {
    if (step === "verify") {
      setStep("login");
    } else if (step === "profile") {
      // For the profile step, we need to log out since the user is already authenticated
      // This will reset the authentication state and redirect back to login
      logout();
      setStep("login");
    }
  };

  const renderProfileForm = () => {
    return (
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text">
            Complete Your Profile
          </h1>
          <p className="text-neutral-600">
            Tell us about yourself to personalize your experience.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleProfileSubmit)} className="space-y-6">
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
                    This will be your display name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <div className="text-sm text-red-500 font-medium">
                {error}
              </div>
            )}
            
            <div className="flex flex-col space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-lg py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="w-full"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Go Back to Login
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">SC</span>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-gray-100">
          {step === "login" && (
            <LoginForm onSuccess={handleLoginSuccess} />
          )}
          
          {step === "verify" && (
            <OtpVerificationForm 
              mobileNumber={mobileNumber}
              initialOtp={initialOtp}
              onBack={handleBack}
              onSuccess={handleVerificationSuccess}
            />
          )}
          
          {step === "profile" && renderProfileForm()}
        </div>
      </div>
    </div>
  );
}

export default Auth;