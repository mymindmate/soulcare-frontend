import { useState, useCallback } from "react";
import { Menu, LogOut, BarChart2 } from "lucide-react";
import { useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getRandomQuote, type WellnessQuote } from "@/lib/wellnessQuotes";
import { chimeSound } from "@/lib/audioData";
import QuotePopup from "@/components/QuotePopup";
import soulcareLogo from "@/assets/images/soulcare-logo.png";

type TabType = "assessment" | "chatbot" | "resources" | "games" | "contact" | "advisories";

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const { logout, user } = useAuth();
  const [, setLocation] = useLocation();
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<WellnessQuote>(getRandomQuote());

  const handleLogout = () => {
    logout();
    setLocation("/auth");
  };

  const playSound = useCallback(() => {
    try {
      // Create a new audio element with the base64 sound
      const audio = new Audio(chimeSound);
      audio.volume = 0.3; // Set volume to 30%
      audio.play().catch(error => {
        console.error("Audio play failed:", error);
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);

  const handleTitleClick = useCallback(() => {
    // Get a new random quote
    setCurrentQuote(getRandomQuote());
    // Play the sound
    playSound();
    // Show the quote
    setShowQuote(true);
  }, [playSound]);

  return (
    <>
      <header className="bg-gradient-to-r from-indigo-100/80 via-white/90 to-purple-100/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-indigo-200/50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={handleTitleClick}>
            <div className="relative group animate-float">
              {/* Animated background */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full opacity-75 blur-md group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 rounded-full opacity-40 group-hover:opacity-70 blur-sm animate-rainbow-bg"></div>
              
              {/* Logo Container */}
              <div className="relative bg-gradient-to-r from-indigo-900 to-blue-900 rounded-full p-1.5 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center overflow-hidden shadow-xl border-2 border-indigo-200/30">
                <img 
                  src={soulcareLogo} 
                  alt="SoulCare Logo" 
                  className="w-full h-full object-cover rounded-full transform hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 -inset-full h-full w-1/3 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-30" 
                    style={{animation: "shine 6s ease-in-out infinite"}}
                  ></div>
                </div>
              </div>
            </div>
            <div className="relative group overflow-visible mx-4">
              {/* Floating container with animation */}
              <div className="animate-float">
                {/* Outer glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-60 animate-rainbow-bg"></div>
                
                {/* Title container with glass effect */}
                <div className="relative px-8 py-3 bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl border border-indigo-100/50 mx-2">
                  {/* Main title with multiple animations */}
                  <h1 className="font-heading font-extrabold text-3xl md:text-4xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-rainbow-bg animate-letterspace animate-glow-pulse tracking-wide py-1">
                    Soul Care
                  </h1>
                  
                  {/* Moving shine effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div 
                      className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-30" 
                      style={{animation: "shine 5s ease-in-out infinite"}}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Floating sparkle elements */}
              <div className="absolute top-0 right-2 h-2 w-2 bg-indigo-400 rounded-full blur-[1px] animate-pulse"></div>
              <div className="absolute bottom-1 right-10 h-2 w-2 bg-pink-400 rounded-full blur-[1px] animate-pulse animation-delay-700"></div>
              <div className="absolute bottom-3 left-8 h-1.5 w-1.5 bg-indigo-300 rounded-full blur-[1px] animate-pulse animation-delay-1500"></div>
              <div className="absolute top-2 left-3 h-2.5 w-2.5 bg-purple-300 rounded-full blur-[1px] animate-pulse animation-delay-2000"></div>
              <div className="absolute -bottom-1 left-16 h-2 w-2 bg-blue-300 rounded-full blur-[1px] animate-pulse animation-delay-3000"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <a href="https://www.youtube.com/@SoulCare-j4q1s" target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-1.5 rounded-full shadow-sm shadow-red-100 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-medium hover:shadow-md hover:shadow-red-200 transition-all duration-300 transform hover:scale-105" title="YouTube Channel">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M2.5 17a24.12 24.12 0 0 1 0-10a2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                YouTube
              </a>
              <a href="https://x.com/SoulCare1001" target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-1.5 rounded-full shadow-sm shadow-blue-100 bg-gradient-to-br from-blue-400 to-blue-500 text-white text-xs font-medium hover:shadow-md hover:shadow-blue-200 transition-all duration-300 transform hover:scale-105" title="Twitter / X">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                Twitter
              </a>
            </div>
            
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-600">
                  {user.name || user.username || user.mobileNumber}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-neutral-600 hover:text-primary"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
            
            <nav>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="lg:hidden text-neutral-600 hover:text-primary">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col gap-4 mt-8">
                    <a 
                      href="#" 
                      className="text-neutral-600 hover:text-primary font-heading font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        onTabChange("assessment");
                      }}
                    >
                      Home
                    </a>
                    <a 
                      href="#" 
                      className="text-neutral-600 hover:text-primary font-heading font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        onTabChange("resources");
                      }}
                    >
                      Resources
                    </a>
                    <a 
                      href="#" 
                      className="text-neutral-600 hover:text-primary font-heading font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        onTabChange("advisories");
                      }}
                    >
                      Mental Health Advisories
                    </a>
                    <a 
                      href="#" 
                      className="text-neutral-600 hover:text-primary font-heading font-medium flex items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setLocation("/dashboard");
                      }}
                    >
                      <BarChart2 className="h-4 w-4" />
                      Stress Report
                    </a>
                    
                    {user && (
                    <div className="relative group my-3">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-lg opacity-50 group-hover:opacity-100 transition duration-500 blur-sm group-hover:blur-md"></div>
                      <a 
                        href="#" 
                        className="relative rounded-lg block px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 transform hover:scale-105 transition-all duration-300 border border-emerald-500/20 flex items-center justify-center"
                        onClick={(e) => {
                          e.preventDefault();
                          playSound();
                          setLocation("/profile/edit");
                        }}
                      >
                        <span className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          <span className="font-semibold tracking-wide">Edit Your Profile</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </span>
                      </a>
                    </div>
                    )}

                    <a 
                      href="#" 
                      className="text-neutral-600 hover:text-primary font-heading font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        onTabChange("contact");
                      }}
                    >
                      Contact
                    </a>
                    
                    <div className="pt-4 mt-2 border-t border-gray-100">
                      <h3 className="text-sm font-medium text-neutral-500 mb-3">Follow Us</h3>
                      <div className="flex flex-col gap-2">
                        <a 
                          href="https://www.youtube.com/@SoulCare-j4q1s" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center px-3 py-2 rounded-lg shadow-sm shadow-red-100 bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-medium hover:shadow-md hover:shadow-red-200 transition-all duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M2.5 17a24.12 24.12 0 0 1 0-10a2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10a2 2 0 0 1-1.4 1.4a49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                          <span>Follow on YouTube</span>
                        </a>
                        <a 
                          href="https://x.com/SoulCare1001" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center px-3 py-2 rounded-lg shadow-sm shadow-blue-100 bg-gradient-to-br from-blue-400 to-blue-500 text-white text-sm font-medium hover:shadow-md hover:shadow-blue-200 transition-all duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                          <span>Follow on Twitter</span>
                        </a>
                      </div>
                    </div>
                    
                    {user && (
                      <a 
                        href="#" 
                        className="text-neutral-600 hover:text-primary font-heading font-medium flex items-center gap-2 mt-4"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLogout();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </a>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
              
              <ul className="hidden lg:flex space-x-2 font-heading text-sm font-medium">
                <li className="relative group">
                  <div className={`absolute -inset-1 rounded-lg opacity-50 group-hover:opacity-100 transition duration-500 blur-sm group-hover:blur-md ${activeTab === "assessment" ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500" : "bg-gradient-to-r from-indigo-300 via-purple-300 to-violet-300 opacity-0 group-hover:opacity-70"}`}></div>
                  <a 
                    href="#" 
                    className={`relative rounded-lg block px-4 py-2 transition-all duration-300 border border-transparent ${activeTab === "assessment" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/40" : "text-neutral-700 hover:text-indigo-700 hover:shadow-md hover:shadow-indigo-100/50 group-hover:scale-105"}`}
                    onClick={(e) => {
                      e.preventDefault();
                      playSound();
                      onTabChange("assessment");
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      <span className="font-medium">Home</span>
                    </span>
                  </a>
                </li>
                <li className="relative group">
                  <div className={`absolute -inset-1 rounded-lg opacity-50 group-hover:opacity-100 transition duration-500 blur-sm group-hover:blur-md ${activeTab === "resources" ? "bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500" : "bg-gradient-to-r from-blue-300 via-cyan-300 to-sky-300 opacity-0 group-hover:opacity-70"}`}></div>
                  <a 
                    href="#" 
                    className={`relative rounded-lg block px-4 py-2 transition-all duration-300 border border-transparent ${activeTab === "resources" ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md shadow-blue-500/25 border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40" : "text-neutral-700 hover:text-blue-700 hover:shadow-md hover:shadow-blue-100/50 group-hover:scale-105"}`}
                    onClick={(e) => {
                      e.preventDefault();
                      playSound();
                      onTabChange("resources");
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                      <span className="font-medium">Resources</span>
                    </span>
                  </a>
                </li>
                <li className="relative group">
                  <div className={`absolute -inset-1 rounded-lg opacity-50 group-hover:opacity-100 transition duration-500 blur-sm group-hover:blur-md ${activeTab === "advisories" ? "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-500" : "bg-gradient-to-r from-purple-300 via-fuchsia-300 to-violet-300 opacity-0 group-hover:opacity-70"}`}></div>
                  <a 
                    href="#" 
                    className={`relative rounded-lg block px-4 py-2 transition-all duration-300 border border-transparent ${activeTab === "advisories" ? "bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-md shadow-purple-500/25 border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/40" : "text-neutral-700 hover:text-purple-700 hover:shadow-md hover:shadow-purple-100/50 group-hover:scale-105"}`}
                    onClick={(e) => {
                      e.preventDefault();
                      playSound();
                      onTabChange("advisories");
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
                      <span className="font-medium">Mental Health</span>
                    </span>
                  </a>
                </li>
                <li className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 rounded-lg opacity-50 group-hover:opacity-100 transition duration-500 blur-sm group-hover:blur-md"></div>
                  <a 
                    href="#" 
                    className="relative rounded-lg block px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/40 transform hover:scale-105 transition-all duration-300 border border-amber-500/20"
                    onClick={(e) => {
                      e.preventDefault();
                      playSound();
                      setLocation("/dashboard");
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <BarChart2 className="h-4 w-4" />
                      <span className="font-medium">Stress Report</span>
                    </span>
                  </a>
                </li>
                
                {user && (
                <li className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-lg opacity-50 group-hover:opacity-100 transition duration-500 blur-sm group-hover:blur-md"></div>
                  <a 
                    href="#" 
                    className="relative rounded-lg block px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 transform hover:scale-105 transition-all duration-300 border border-emerald-500/20"
                    onClick={(e) => {
                      e.preventDefault();
                      playSound();
                      setLocation("/profile/edit");
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <span className="font-semibold tracking-wide">Profile</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </span>
                  </a>
                </li>
                )}

                <li className="relative group">
                  <div className={`absolute -inset-1 rounded-lg opacity-50 group-hover:opacity-100 transition duration-500 blur-sm group-hover:blur-md ${activeTab === "contact" ? "bg-gradient-to-r from-rose-500 via-pink-500 to-red-500" : "bg-gradient-to-r from-rose-300 via-pink-300 to-red-300 opacity-0 group-hover:opacity-70"}`}></div>
                  <a 
                    href="#" 
                    className={`relative rounded-lg block px-4 py-2 transition-all duration-300 border border-transparent ${activeTab === "contact" ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/25 border-rose-500/20 hover:shadow-lg hover:shadow-rose-500/40" : "text-neutral-700 hover:text-rose-700 hover:shadow-md hover:shadow-rose-100/50 group-hover:scale-105"}`}
                    onClick={(e) => {
                      e.preventDefault();
                      playSound();
                      onTabChange("contact");
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
                      <span className="font-medium">Contact</span>
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Quote popup */}
      <QuotePopup 
        quote={currentQuote} 
        isVisible={showQuote} 
        onClose={() => setShowQuote(false)} 
      />
    </>
  );
};

export default Header;