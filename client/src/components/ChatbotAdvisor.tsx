import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, HelpCircle, Settings, Sparkles, Mic, MessageSquarePlus, XCircle, Loader2 } from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import { getRandomResponse, suggestions, advisorPersonalities, AdvisorMode } from "@/lib/chatbotResponses";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import soulcareLogo from "@/assets/images/soulcare-logo.png";

interface Message {
  id: number;
  isUser: boolean;
  text: string;
  thinking?: boolean;
  timestamp: Date;
}

const ChatbotAdvisor = () => {
  const { stressLevel, assessmentCompleted } = useAssessment();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [messageId, setMessageId] = useState(1);
  const [isThinking, setIsThinking] = useState(false);
  const [activeAdvisorMode, setActiveAdvisorMode] = useState<AdvisorMode>("default");
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChatControls, setShowChatControls] = useState(true);
  const [useMarkdown, setUseMarkdown] = useState(true);
  const [autoResponseSpeed, setAutoResponseSpeed] = useState<"fast" | "medium" | "slow">("medium");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  const activeAdvisor = advisorPersonalities[activeAdvisorMode];
  
  // Initialize with greeting when component mounts or advisor mode changes
  useEffect(() => {
    if (messages.length === 0) {
      const initialGreeting = activeAdvisor.greeting || getRandomResponse('greeting', assessmentCompleted ? stressLevel : 'medium');
      setMessages([
        { id: 0, isUser: false, text: initialGreeting, timestamp: new Date() }
      ]);
      setMessageId(1);
    }
  }, [activeAdvisorMode, messages.length, stressLevel, assessmentCompleted]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [inputMessage]);

  // Start thinking animation 
  const startThinking = () => {
    setIsThinking(true);
    // Add thinking bubble
    const thinkingMessage = { id: messageId + 1, isUser: false, text: "", thinking: true, timestamp: new Date() };
    setMessages(prev => [...prev, thinkingMessage]);
    return messageId + 1;
  };

  // Stop thinking animation
  const stopThinking = (thinkingId: number, responseText: string) => {
    setIsThinking(false);
    setMessages(prev => prev.map(msg => 
      msg.id === thinkingId ? { ...msg, text: responseText, thinking: false } : msg
    ));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isThinking) return;

    const trimmedMessage = inputMessage.trim();
    const userMessage = { id: messageId, isUser: true, text: trimmedMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setMessageId(prev => prev + 1);
    setInputMessage("");

    // Store message in backend
    try {
      await apiRequest('POST', '/api/chat/messages', {
        userId: 1, // Default user for now
        isUser: true,
        message: trimmedMessage
      });
    } catch (error) {
      // Silently handle failed message saving
    }

    // Determine response topic based on message content
    let responseTopic = 'general';
    const lowercaseMsg = trimmedMessage.toLowerCase();
    
    if (lowercaseMsg.includes('sleep') || lowercaseMsg.includes('tired') || lowercaseMsg.includes('rest')) {
      responseTopic = 'sleep';
    } else if (lowercaseMsg.includes('time') || lowercaseMsg.includes('schedule') || lowercaseMsg.includes('deadline')) {
      responseTopic = 'time-management';
    } else if (lowercaseMsg.includes('anxiety') || lowercaseMsg.includes('worry') || lowercaseMsg.includes('exam') || lowercaseMsg.includes('test')) {
      responseTopic = 'anxiety';
    } else if (lowercaseMsg.includes('self-care') || lowercaseMsg.includes('overwhelm') || lowercaseMsg.includes('break')) {
      responseTopic = 'self-care';
    }

    // Start thinking animation
    const thinkingId = startThinking();

    // Determine response delay based on settings and message length
    let responseDelay = 1000; // default 1 second
    if (autoResponseSpeed === "fast") responseDelay = 500;
    if (autoResponseSpeed === "slow") responseDelay = 1500 + (trimmedMessage.length * 10);

    // Simulate bot thinking with timeout
    setTimeout(async () => {
      // Format response based on the active advisor personality
      let baseResponse = getRandomResponse(responseTopic, assessmentCompleted ? stressLevel : 'medium');
      let botResponse = baseResponse;
      
      // Transform response completely based on personality mode
      switch(activeAdvisorMode) {
        case "academic":
          // Academic Coach - structured, direct, focused on results
          botResponse = `**Academic Coach:**\n\nAnalyzing your situation: ${baseResponse.split('.')[0]}.\n\n**Key action items:**\n- ${baseResponse.split('.').slice(1).join('.').trim()}\n- Set specific measurable goals for this area\n- Schedule regular review sessions\n\nRemember: Consistent study habits and measurable outcomes are the foundation of academic success.`;
          break;
        case "calming":
          // Comfort Companion - warm, gentle, emotionally supportive
          botResponse = `I hear you're dealing with ${responseTopic === 'sleep' ? 'sleep troubles' : 
            responseTopic === 'time-management' ? 'time pressure' : 
            responseTopic === 'anxiety' ? 'anxiety' : 
            responseTopic === 'self-care' ? 'self-care challenges' : 'some challenges'} right now. That's really hard, and I want you to know it's completely normal to feel overwhelmed.\n\n${baseResponse}\n\nJust remember, you're doing the best you can with what you have right now. Take a deep breath with me - you're going to be okay. 💗`;
          break;
        case "motivational":
          // Motivation Coach - energetic, strong, action-oriented
          botResponse = `**LET'S CRUSH THIS CHALLENGE! 💪**\n\n${baseResponse}\n\nListen, I KNOW you can do this. Every obstacle is just another opportunity to prove how STRONG you really are! Remember why you started, focus on your goals, and NOTHING can stop you!\n\nWhat's your next action step? Let's make it happen TODAY!`;
          break;
        case "mindfulness":
          // Mindfulness Guide - calm, present-focused, contemplative
          botResponse = `*Taking a mindful moment together*\n\nNotice your breath... in... and out.\n\n${baseResponse}\n\nWhatever you're experiencing right now—thoughts, emotions, sensations—try to observe them with gentle curiosity, without judgment. This moment is your life unfolding, exactly as it should be.\n\nBe present with whatever arises. 🧘`;
          break;
        default:
          // Default balanced advisor
          botResponse = baseResponse;
      }
      
      // Stop thinking animation and show response
      stopThinking(thinkingId, botResponse);
      setMessageId(prev => prev + 1);

      // Store bot response in backend
      try {
        await apiRequest('POST', '/api/chat/messages', {
          userId: 1,
          isUser: false,
          message: botResponse
        });
      } catch (error) {
        // Silently handle failed message saving
      }
    }, responseDelay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const changeAdvisorMode = (mode: AdvisorMode) => {
    setActiveAdvisorMode(mode);
    
    // Add mode change notification
    const modeChangeMessage = { 
      id: messageId, 
      isUser: false, 
      text: `*Switching to ${advisorPersonalities[mode].name} mode*\n\n${advisorPersonalities[mode].greeting}`, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, modeChangeMessage]);
    setMessageId(prev => prev + 1);
  };

  const renderMessageText = (text: string) => {
    // If markdown is disabled, return plain text
    if (!useMarkdown) return text;

    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
      .replace(/^- (.+)$/gm, '• $1') // Bullet points
      .split('\n')
      .map((line, i) => <p key={i} className="my-1" dangerouslySetInnerHTML={{ __html: line }} />);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto h-full flex flex-col"
    >
      <Card className="flex flex-col h-full shadow-lg">
        {/* Header with personality selector */}
        <div 
          className="p-3 rounded-t-lg flex items-center justify-between"
          style={{ backgroundColor: activeAdvisor.color }}
        >
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3 bg-gradient-to-r from-indigo-900 to-blue-900 border-2 border-white/30 overflow-hidden p-0">
              <img src={soulcareLogo} alt="SoulCare Advisor" className="h-10 w-10 object-cover" />
            </Avatar>
            <div>
              <h3 className="text-white font-medium">{activeAdvisor.name}</h3>
              <p className="text-xs text-white/80">{activeAdvisor.description}</p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={handleClearChat}
              title="Reset Conversation"
            >
              <XCircle className="h-5 w-5" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">AI Assistant Settings</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="markdown-mode">Enable formatting</Label>
                    <Switch 
                      id="markdown-mode" 
                      checked={useMarkdown} 
                      onCheckedChange={setUseMarkdown} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-suggestions">Show suggestions</Label>
                    <Switch 
                      id="show-suggestions" 
                      checked={showSuggestions} 
                      onCheckedChange={setShowSuggestions} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Response speed</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant={autoResponseSpeed === "fast" ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setAutoResponseSpeed("fast")}
                      >
                        Fast
                      </Button>
                      <Button 
                        variant={autoResponseSpeed === "medium" ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setAutoResponseSpeed("medium")}
                      >
                        Normal
                      </Button>
                      <Button 
                        variant={autoResponseSpeed === "slow" ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setAutoResponseSpeed("slow")}
                      >
                        Slow
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                      onClick={handleClearChat}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Clear conversation
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About AI Wellness Advisor</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <p className="mb-4">Your AI Wellness Advisor offers personalized support for your mental wellbeing with multiple personality modes to match your needs:</p>
                  
                  <div className="space-y-3">
                    {Object.entries(advisorPersonalities).map(([mode, personality]) => (
                      <div key={mode} className="flex items-start">
                        <div className="w-8 h-8 rounded-full mr-2 flex items-center justify-center" style={{ backgroundColor: personality.color }}>
                          <span className="text-white">{personality.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{personality.name}</h4>
                          <p className="text-sm text-muted-foreground">{personality.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Personality Mode Selector */}
        <div className="p-3 border-b">
          <Tabs 
            defaultValue="default" 
            value={activeAdvisorMode}
            onValueChange={(value: string) => changeAdvisorMode(value as AdvisorMode)}
            className="w-full"
          >
            <TabsList className="w-full bg-muted/50 overflow-x-auto">
              {Object.entries(advisorPersonalities).map(([mode, personality]) => (
                <TabsTrigger 
                  key={mode} 
                  value={mode}
                  className="flex-1 data-[state=active]:shadow-sm px-2 min-w-max"
                  style={{ 
                    '--tab-accent': personality.color,
                    color: activeAdvisorMode === mode ? personality.color : undefined 
                  } as React.CSSProperties}
                >
                  <span className="mr-1">{personality.icon}</span>
                  {!isMobile && (
                    <span className="truncate max-w-[80px] inline-block">{personality.name}</span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Chat Messages Area with scroll */}
        <ScrollArea className="flex-grow p-4 overflow-auto">
          <div className="space-y-4 min-h-full">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div 
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div 
                      className={`${message.isUser 
                        ? 'bg-neutral-100 text-neutral-900 rounded-t-lg rounded-bl-lg rounded-br-sm' 
                        : 'text-white rounded-t-lg rounded-br-lg rounded-bl-sm'}
                        ${message.thinking ? 'min-w-12 min-h-8' : 'max-w-[80%]'}
                        px-4 py-3 shadow-sm relative break-words`}
                      style={{ 
                        backgroundColor: message.isUser ? undefined : activeAdvisor.color 
                      }}
                    >
                      {message.thinking ? (
                        <div className="flex items-center justify-center h-6">
                          <div className="dot-typing"></div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="message-content overflow-hidden break-words whitespace-pre-wrap">
                            {renderMessageText(message.text)}
                          </div>
                          <div className="text-[10px] opacity-70 text-right">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Suggestions Area */}
        {showSuggestions && (
          <div className="px-4 py-2 border-t border-neutral-200">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-neutral-100 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{ borderColor: `${activeAdvisor.color}30` }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Chat Input Area */}
        <div className="p-3 border-t border-neutral-200">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-grow min-h-[44px] max-h-36 p-3 rounded-lg resize-none"
              disabled={isThinking}
            />
            <div className="flex gap-2">
              {showVoiceInput && (
                <Button 
                  size="icon"
                  variant="outline"
                  disabled={isThinking}
                  className="flex-shrink-0 rounded-full h-10 w-10"
                >
                  <Mic className="h-5 w-5" />
                </Button>
              )}
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isThinking}
                size="icon"
                className="flex-shrink-0 rounded-full h-10 w-10"
                style={{ backgroundColor: activeAdvisor.color }}
              >
                {isThinking ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* CSS for the typing animation is in a <style> tag in the index.css file */}
    </motion.div>
  );
};

export default ChatbotAdvisor;
