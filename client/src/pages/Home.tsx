import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StressAssessment from "@/components/StressAssessment";
import StressResults from "@/components/StressResults";
import ChatbotAdvisor from "@/components/ChatbotAdvisor";
import Resources from "@/components/Resources";
import WellnessArcade from "@/components/WellnessArcade";
import Contact from "@/components/Contact";
import MentalHealthAdvisories from "@/components/MentalHealthAdvisories";
import { useAssessment } from "@/context/AssessmentContext";
import { useAuth } from "@/context/AuthContext";

type TabType = "assessment" | "chatbot" | "resources" | "games" | "contact" | "advisories";

const Home = () => {
  const [activeTab, setActiveTab] = useState<TabType>("assessment");
  const { assessmentCompleted } = useAssessment();
  const { user, isAuthenticated, isProfileComplete } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect to auth page if not authenticated or profile not complete
  useEffect(() => {
    if (!isAuthenticated || !isProfileComplete) {
      setLocation("/auth");
    }
  }, [isAuthenticated, isProfileComplete, setLocation]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text">Welcome to Soul Care</h1>
          <p className="text-center text-neutral-600 mb-8">Your companion for mindfulness and stress management</p>
        
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-10 max-w-5xl mx-auto flex-wrap">
            <button 
              className={`relative w-full sm:w-auto px-6 py-4 rounded-xl font-heading font-medium transition-all duration-300 overflow-hidden group ${
                activeTab === "assessment" 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-200" 
                  : "bg-white text-neutral-700 hover:bg-neutral-50 shadow-md hover:shadow-xl"
              }`}
              onClick={() => handleTabChange("assessment")}
            >
              <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 group-hover:scale-100 group-hover:bg-white/10 rounded-xl"></div>
              <div className="relative flex items-center justify-center gap-2">
                <span className="text-lg">{activeTab === "assessment" ? "📊" : "📝"}</span>
                <span>Stress Assessment</span>
              </div>
            </button>

            <button 
              className={`relative w-full sm:w-auto px-6 py-4 rounded-xl font-heading font-medium transition-all duration-300 overflow-hidden group ${  
                activeTab === "games" 
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-200" 
                  : "bg-white text-neutral-700 hover:bg-neutral-50 shadow-md hover:shadow-xl"
              }`}
              onClick={() => handleTabChange("games")}
            >
              <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 group-hover:scale-100 group-hover:bg-white/10 rounded-xl"></div>
              <div className="relative flex items-center justify-center gap-2">
                <span className="text-lg">{activeTab === "games" ? "🎮" : "🎯"}</span>
                <span>Wellness Games</span>
              </div>
            </button>

            <button 
              className={`relative w-full sm:w-auto px-6 py-4 rounded-xl font-heading font-medium transition-all duration-300 overflow-hidden group ${  
                activeTab === "chatbot" 
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-blue-200" 
                  : "bg-white text-neutral-700 hover:bg-neutral-50 shadow-md hover:shadow-xl"
              }`}
              onClick={() => handleTabChange("chatbot")}
            >
              <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 group-hover:scale-100 group-hover:bg-white/10 rounded-xl"></div>
              <div className="relative flex items-center justify-center gap-2">
                <span className="text-lg">{activeTab === "chatbot" ? "🤖" : "💬"}</span>
                <span>AI Advisor</span>
              </div>
            </button>

            <button 
              className={`relative w-full sm:w-auto px-6 py-4 rounded-xl font-heading font-medium transition-all duration-300 overflow-hidden group ${  
                activeTab === "resources" 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-200" 
                  : "bg-white text-neutral-700 hover:bg-neutral-50 shadow-md hover:shadow-xl"
              }`}
              onClick={() => handleTabChange("resources")}
            >
              <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 group-hover:scale-100 group-hover:bg-white/10 rounded-xl"></div>
              <div className="relative flex items-center justify-center gap-2">
                <span className="text-lg">{activeTab === "resources" ? "📚" : "📋"}</span>
                <span>Resources</span>
              </div>
            </button>
            
            <button 
              className={`relative w-full sm:w-auto px-6 py-4 rounded-xl font-heading font-medium transition-all duration-300 overflow-hidden group ${  
                activeTab === "advisories" 
                  ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-lg shadow-violet-200" 
                  : "bg-white text-neutral-700 hover:bg-neutral-50 shadow-md hover:shadow-xl"
              }`}
              onClick={() => handleTabChange("advisories")}
            >
              <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 group-hover:scale-100 group-hover:bg-white/10 rounded-xl"></div>
              <div className="relative flex items-center justify-center gap-2">
                <span className="text-lg">{activeTab === "advisories" ? "🧠" : "💭"}</span>
                <span>Mental Health</span>
              </div>
            </button>

            <button 
              className={`relative w-full sm:w-auto px-6 py-4 rounded-xl font-heading font-medium transition-all duration-300 overflow-hidden group ${  
                activeTab === "contact" 
                  ? "bg-gradient-to-r from-green-600 to-teal-500 text-white shadow-lg shadow-green-200" 
                  : "bg-white text-neutral-700 hover:bg-neutral-50 shadow-md hover:shadow-xl"
              }`}
              onClick={() => handleTabChange("contact")}
            >
              <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 group-hover:scale-100 group-hover:bg-white/10 rounded-xl"></div>
              <div className="relative flex items-center justify-center gap-2">
                <span className="text-lg">{activeTab === "contact" ? "👥" : "📞"}</span>
                <span>Contact Us</span>
              </div>
            </button>
          </div>
          
          {/* Content Sections */}
          <div className="bg-white/80 rounded-xl shadow-lg p-6 backdrop-blur-sm card-hover-effect">
            {activeTab === "assessment" && (
              assessmentCompleted ? <StressResults onTabChange={handleTabChange} /> : <StressAssessment />
            )}
            
            {activeTab === "games" && <WellnessArcade />}
            
            {activeTab === "chatbot" && <ChatbotAdvisor />}
            
            {activeTab === "resources" && <Resources />}
            
            {activeTab === "advisories" && <MentalHealthAdvisories />}
            
            {activeTab === "contact" && <Contact />}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
