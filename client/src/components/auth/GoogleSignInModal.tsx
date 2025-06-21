import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleSignInModal({ isOpen, onClose }: GoogleSignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  
  const handleContinue = () => {
    if (step === "email" && email.trim() !== "") {
      setStep("password");
    } else if (step === "password") {
      // Handle Google sign-in logic here
      onClose();
    }
  };
  
  const handleCreateAccount = () => {
    // Handle account creation logic
    // For now, just close the modal
    onClose();
  };

  const resetAndClose = () => {
    setEmail("");
    setPassword("");
    setStep("email");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign in with Google</DialogTitle>
          <DialogDescription>Use your Google Account to sign in</DialogDescription>
        </DialogHeader>
        <div className="w-full max-w-md mx-auto p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <FaGoogle className="text-4xl text-blue-500" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-1">Sign in with Google</h2>
            <p className="text-gray-600 text-sm">Use your Google Account</p>
          </div>
          
          {step === "email" ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Email or phone</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Email or phone"
                />
              </div>
              
              <div className="text-blue-600 text-sm">
                <a href="#" className="hover:text-blue-800">Forgot email?</a>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Not your computer? Use Guest mode to sign in privately.</p>
                <a href="#" className="text-blue-600 hover:text-blue-800">Learn more about using Guest mode</a>
              </div>
              
              <div className="flex justify-between items-center mt-8">
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:bg-blue-50" 
                  onClick={handleCreateAccount}
                >
                  Create account
                </Button>
                
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={handleContinue}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Enter your password</label>
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Password"
                />
              </div>
              
              <div className="text-blue-600 text-sm">
                <a href="#" className="hover:text-blue-800">Forgot password?</a>
              </div>
              
              <div className="flex justify-between items-center mt-8">
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:bg-blue-50" 
                  onClick={() => setStep("email")}
                >
                  Back
                </Button>
                
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={handleContinue}
                >
                  Sign in
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
