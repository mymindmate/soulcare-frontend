import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, Mail, Copy, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Founder {
  name: string;
  role: string;
  initials: string;
  gradientFrom: string;
  gradientTo: string;
}

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const [activeFounder, setActiveFounder] = useState<Founder | null>(null);
  
  const founders: Founder[] = [
    {
      name: "Nishant Dutta",
      role: "Founder",
      initials: "ND",
      gradientFrom: "#3b82f6",
      gradientTo: "#2563eb",
    },
    {
      name: "Saksham Mehta",
      role: "Co-Founder",
      initials: "SM",
      gradientFrom: "#8b5cf6",
      gradientTo: "#6d28d9",
    },
    {
      name: "Aranya Singh",
      role: "Fund Raiser",
      initials: "AS",
      gradientFrom: "#ec4899",
      gradientTo: "#be185d",
    },
  ];

  const contactEmail = "spacetrio69420@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text inline-block">Meet Our Team</h2>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          The brilliant minds behind Soul Care, working together to create a platform that helps people manage stress and improve mental wellness.
        </p>
      </div>

      {/* Founders Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {founders.map((founder, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card 
              className={`p-6 cursor-pointer relative overflow-hidden group transition-all ${activeFounder === founder ? 'ring-2 ring-offset-2' : ''}`}
              style={{ borderColor: founder.gradientTo }}
              onClick={() => setActiveFounder(activeFounder === founder ? null : founder)}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${founder.gradientFrom}, ${founder.gradientTo})` }}
              ></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <Avatar className="h-12 w-12 shadow-lg" style={{ background: `linear-gradient(135deg, ${founder.gradientFrom}, ${founder.gradientTo})` }}>
                  <AvatarFallback className="text-white font-medium">{founder.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-heading font-bold text-lg">{founder.name}</h3>
                  <p className="text-sm text-neutral-600">{founder.role}</p>
                </div>
              </div>
              
              <AnimatePresence>
                {activeFounder === founder && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-neutral-200"
                  >
                    <p className="text-sm text-neutral-600">
                      Working tirelessly to create innovative ways to help people manage stress and improve mental wellness through technology.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Contact Email */}
      <Card className="p-6 mt-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <span>Get in Touch</span>
          </h3>
          
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-neutral-600 font-medium">{contactEmail}</span>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 text-sm"
                onClick={copyEmail}
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 text-sm"
                onClick={() => window.open(`mailto:${contactEmail}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                Open Email
              </Button>
            </div>
          </div>
          
          <p className="mt-4 text-sm text-neutral-600">
            We'd love to hear your feedback or answer any questions about Soul Care.
            Our team is dedicated to improving your experience and helping you on your wellness journey.
          </p>
        </div>
      </Card>
      
      {/* Team Story */}
      <div className="mt-12 relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-xl blur-sm"></div>
        <Card className="p-6 relative backdrop-blur-md bg-white/80">
          <h3 className="text-xl font-bold mb-4">Our Story</h3>
          <p className="text-neutral-600">
            Soul Care was born from a shared vision between Nishant, Saksham, and Aranya. 
            They recognized the growing need for accessible mental wellness tools in our increasingly 
            stressful world. Combining their expertise in technology, design, and business, 
            they created Soul Care - a platform dedicated to helping people manage stress 
            and improve their mental wellbeing through interactive and evidence-based approaches.
          </p>
          <p className="text-neutral-600 mt-4">
            The team continues to innovate and expand Soul Care's offerings, 
            driven by a mission to make mental wellness support accessible to everyone.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
