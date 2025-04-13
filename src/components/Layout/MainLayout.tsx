
import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // State for mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Toggle function for mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-cyber-dark">
      {/* Pass required props to Sidebar */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      
      {/* Main content area with mobile menu button */}
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300 p-4">
        <div className="md:hidden mb-4">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-md bg-cyber-teal/20 text-cyber-teal hover:bg-cyber-teal/30"
          >
            ☰ Menu
          </button>
        </div>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
