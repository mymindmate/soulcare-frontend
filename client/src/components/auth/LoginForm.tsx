import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { FaApple, FaGoogle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { GoogleSignInModal } from "./GoogleSignInModal";
import { AppleSignInModal } from "./AppleSignInModal";

const formSchema = z.object({
  mobileNumber: z
    .string()
    .regex(/^\+91[0-9]{10}$/, { message: "Mobile number must be exactly 10 digits after +91" }),
});

interface LoginFormProps {
  onSuccess: (mobileNumber: string, otp: string) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading, error } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [appleModalOpen, setAppleModalOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobileNumber: "+91",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setServerError(null);
    
    try {
      const result = await login(values.mobileNumber);
      
      if (result.success && result.otp) {
        onSuccess(values.mobileNumber, result.otp);
      } else {
        setServerError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setServerError("An unexpected error occurred. Please try again.");
    }
  };
  
  const handleGoogleSignIn = () => {
    setGoogleModalOpen(true);
  };
  
  const handleAppleSignIn = () => {
    setAppleModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text">
          Welcome to Soul Care
        </h1>
        <p className="text-neutral-600">
          Enter your mobile number to sign in or create an account.
        </p>
      </div>
      
      <div className="flex gap-4 mb-6">
        <Button 
          type="button"
          onClick={handleGoogleSignIn}
          className="flex-1 bg-white text-black border border-gray-300 hover:bg-gray-100 hover:text-black shadow-sm"
        >
          <FaGoogle className="mr-2 text-red-500" />
          <span className="whitespace-nowrap">Google</span>
        </Button>
        <Button 
          type="button"
          onClick={handleAppleSignIn}
          className="flex-1 bg-black text-white hover:bg-gray-800 shadow-sm"
        >
          <FaApple className="mr-2" />
          <span className="whitespace-nowrap">Apple</span>
        </Button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or continue with</span>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                      +91
                    </div>
                    <Input 
                      className="rounded-l-none" 
                      placeholder="10 digit number" 
                      {...field} 
                      value={field.value}
                      onChange={(e) => {
                        // Ensure +91 prefix is always there
                        const value = e.target.value;
                        if (!value.startsWith("+91")) {
                          // If user tries to delete the prefix, keep it
                          field.onChange("+91" + value.replace(/^\+91/, ""));
                        } else {
                          // Normal change
                          field.onChange(value);
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
                <p className="text-xs text-neutral-500 mt-1">
                  Enter a 10-digit mobile number after +91
                </p>
              </FormItem>
            )}
          />
          
          {(serverError || error) && (
            <div className="text-sm text-red-500 font-medium">
              {serverError || error}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Continue with Phone"
            )}
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm text-neutral-600">
        We'll send you a one-time password to verify your mobile number.
      </div>
      
      {/* Google Sign In Modal */}
      <GoogleSignInModal 
        isOpen={googleModalOpen} 
        onClose={() => setGoogleModalOpen(false)} 
      />
      
      {/* Apple Sign In Modal */}
      <AppleSignInModal 
        isOpen={appleModalOpen} 
        onClose={() => setAppleModalOpen(false)} 
      />
    </div>
  );
}