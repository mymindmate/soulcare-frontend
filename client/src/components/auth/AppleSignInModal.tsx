import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FaApple } from "react-icons/fa";

interface AppleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppleSignInModal({ isOpen, onClose }: AppleSignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  
  const handleContinue = () => {
    if (step === "email" && email.trim() !== "") {
      setStep("password");
    } else if (step === "password") {
      // Handle Apple sign-in logic here
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
          <DialogTitle>Sign in with Apple</DialogTitle>
          <DialogDescription>Use your Apple ID to sign in</DialogDescription>
        </DialogHeader>
        <div className="w-full max-w-md mx-auto p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <FaApple className="text-4xl text-black" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-1">Sign in with Apple</h2>
            <p className="text-gray-600 text-sm">Use your Apple ID</p>
          </div>
          
          {step === "email" ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Apple ID</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                  placeholder="example@icloud.com"
                />
              </div>
              
              <div className="text-blue-600 text-sm">
                <a href="#" className="hover:text-blue-800">Forgot Apple ID?</a>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Your Apple ID information is used to enable Apple services on this app.</p>
              </div>
              
              <div className="flex justify-between items-center mt-8">
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:bg-blue-50" 
                  onClick={handleCreateAccount}
                >
                  Create Apple ID
                </Button>
                
                <Button 
                  className="bg-black hover:bg-gray-800 text-white" 
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
                  className="border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
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
                  className="bg-black hover:bg-gray-800 text-white" 
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
