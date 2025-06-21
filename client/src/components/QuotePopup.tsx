import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WellnessQuote } from "@/lib/wellnessQuotes";

interface QuotePopupProps {
  quote: WellnessQuote;
  isVisible: boolean;
  onClose: () => void;
}

const QuotePopup = ({ quote, isVisible, onClose }: QuotePopupProps) => {
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    if (isVisible && !audioPlayed) {
      // Create and play audio
      const audio = new Audio("/assets/chime.mp3");
      audio.volume = 0.3;
      audio.play().catch(error => {
        console.error("Audio play failed:", error);
      });
      setAudioPlayed(true);
    }

    if (!isVisible) {
      setAudioPlayed(false);
    }

    // Auto-close after 5 seconds
    let timer: number;
    if (isVisible) {
      timer = window.setTimeout(() => {
        onClose();
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, onClose, audioPlayed]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-full"
        >
          <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Gradient top border */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
            
            <div className="p-5 sm:p-6">
              <div className="text-center">
                <div className="text-base sm:text-lg font-medium text-neutral-800 mb-3 leading-relaxed break-words whitespace-normal mx-auto px-1">
                  "{quote.text}"
                </div>
                <div className="text-sm text-neutral-600 italic">
                  — {quote.author}
                </div>
              </div>
              
              <div className="absolute -z-10 inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M95,50.5c0,24.6-20.4,44.5-45.5,44.5S4,75.1,4,50.5S24.4,6,49.5,6S95,25.9,95,50.5z" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4,50.5c0,0,20.4,24.6,45.5,0s45.5,0,45.5,0" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuotePopup;
