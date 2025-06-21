import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be 6 digits" })
    .regex(/^[0-9]+$/, { message: "OTP must contain only digits" }),
});

interface OtpVerificationFormProps {
  mobileNumber: string;
  initialOtp?: string; // For development/testing
  onBack: () => void;
  onSuccess: () => void;
}

export function OtpVerificationForm({ 
  mobileNumber, 
  initialOtp, 
  onBack, 
  onSuccess 
}: OtpVerificationFormProps) {
  const { verifyOtp, login, isLoading, error } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: initialOtp || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setServerError(null);
    
    try {
      const success = await verifyOtp(mobileNumber, values.otp);
      
      if (success) {
        onSuccess();
      } else {
        setServerError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setServerError("Failed to verify OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const result = await login(mobileNumber);
      if (result.success) {
        // Reset countdown
        setCountdown(60);
        setCanResend(false);
        // Auto-fill OTP if provided (development only)
        if (result.otp) {
          form.setValue('otp', result.otp);
        }
      } else {
        setServerError("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-0 mb-4" 
        onClick={onBack}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>
      
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text">
          Verify Your Number
        </h1>
        <p className="text-neutral-600">
          We've sent a 6-digit code to {mobileNumber}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123456" 
                    maxLength={6}
                    className="text-center text-lg" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
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
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm">
        {canResend ? (
          <Button 
            variant="link" 
            onClick={handleResendOtp} 
            disabled={isLoading}
          >
            Resend OTP
          </Button>
        ) : (
          <p className="text-neutral-600">
            Resend OTP in {countdown} seconds
          </p>
        )}
      </div>
    </div>
  );
}