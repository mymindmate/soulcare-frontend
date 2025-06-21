import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-8 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-primary text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                <path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
                <path d="M12 8c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/>
              </svg>
              <h2 className="font-heading font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">Soul Care</h2>
            </div>
            <p className="text-sm max-w-md text-blue-200">
              Your companion for mindfulness and stress management, providing personalized advice and practical resources for students.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-heading font-medium text-white mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-blue-200 hover:text-primary transition-colors duration-300">Home</a></li>
                <li><a href="#" className="text-blue-200 hover:text-primary transition-colors duration-300">Assessment</a></li>
                <li><a href="#" className="text-blue-200 hover:text-primary transition-colors duration-300">AI Advisor</a></li>
                <li><a href="#" className="text-blue-200 hover:text-primary transition-colors duration-300">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-medium text-white mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-blue-200 hover:text-primary transition-colors duration-300">Contact Us</a></li>
                <li><a href="#" className="text-blue-200 hover:text-primary transition-colors duration-300">FAQ</a></li>
                <li><a href="#" className="text-blue-200 hover:text-primary transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="text-blue-200 hover:text-primary transition-colors duration-300">Terms of Use</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-medium text-white mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">Connect</h3>
              <div className="flex space-x-4">
                <a href="https://www.youtube.com/@SoulCare-j4q1s" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-primary transition-colors duration-300" title="YouTube Channel">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                </a>
                <a href="https://x.com/SoulCare1001" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-primary transition-colors duration-300" title="Twitter / X">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
                <a href="#" className="text-blue-200 hover:text-primary transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              </div>
              <div className="mt-3 text-sm text-blue-200">
                <p>Follow us for updates</p>
                <p>and wellness tips!</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-800/50 mt-8 pt-6 text-center text-sm">
          <p className="text-blue-200">&copy; {new Date().getFullYear()} Soul Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
