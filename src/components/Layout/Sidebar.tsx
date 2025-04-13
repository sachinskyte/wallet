import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  LogOut, 
  ShieldAlert,
  Terminal,
  Home,
  FileText,
  List,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

// Props interface for Sidebar component
interface SidebarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  // State for sidebar collapsed mode
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut, profile, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Toggle sidebar expanded/collapsed state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You've been successfully logged out"
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Check if the current user is an admin
  const isAdmin = user?.id === 'admin-id';

  // Dynamic classes based on sidebar state
  const sidebarClasses = `fixed h-full z-30 transition-all duration-300 ease-in-out ${
    isCollapsed ? 'w-20' : 'w-64'
  } ${isMobileMenuOpen ? 'left-0' : '-left-full md:left-0'} bg-cyber-darker border-r border-cyber-teal/20 shadow-lg`;

  return (
    <div className={sidebarClasses}>
      {/* Sidebar header with logo and collapse button */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-cyber-teal/20">
        <div className="flex items-center">
          <ShieldAlert className="h-8 w-8 text-cyber-teal" />
          {!isCollapsed && (
            <span className="ml-2 text-xl font-bold text-white">Sentryl</span>
          )}
        </div>
        
        {/* Desktop collapse button */}
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-full hover:bg-cyber-teal/20 md:block hidden transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-cyber-teal" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-cyber-teal" />
          )}
        </button>
        
        {/* Mobile close button */}
        <button 
          onClick={toggleMobileMenu} 
          className="p-1 rounded-full hover:bg-cyber-teal/20 md:hidden transition-colors"
          aria-label="Close menu"
        >
          <ChevronLeft className="h-5 w-5 text-cyber-teal" />
        </button>
      </div>
      
      {/* User profile section */}
      <div className="p-4">
        <div className="mb-6 flex items-center p-2 rounded-md hover:bg-cyber-light/10 transition-colors">
          <div className="w-10 h-10 rounded-full bg-cyber-teal/20 flex items-center justify-center border border-cyber-teal/30">
            <span className="text-cyber-teal font-bold">{profile?.full_name ? profile.full_name.charAt(0) : user?.email?.charAt(0) || '?'}</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-semibold text-white">{profile?.full_name || user?.email || 'User'}</p>
              <p className="text-xs text-gray-400 capitalize">{isAdmin ? 'Administrator' : 'Security Researcher'}</p>
            </div>
          )}
        </div>
        
        {/* Navigation menu */}
        <nav className="mt-6">
          <ul className="space-y-2">
            {/* Only show relevant navigation for each user type */}
            {isAdmin ? (
              // Admin navigation
              <>
                <NavItem 
                  to="/admin" 
                  icon={<ShieldAlert className="h-5 w-5" />} 
                  text="Admin Dashboard" 
                  isCollapsed={isCollapsed} 
                />
                
                <NavItem 
                  to="/zero-day-dashboard" 
                  icon={<Terminal className="h-5 w-5" />} 
                  text="Zero-Day Dashboard" 
                  isCollapsed={isCollapsed} 
                />
                
                <NavItem 
                  to="/settings" 
                  icon={<Settings className="h-5 w-5" />} 
                  text="Settings" 
                  isCollapsed={isCollapsed} 
                />
              </>
            ) : (
              // Regular user navigation
              <>
                <NavItem 
                  to="/dashboard" 
                  icon={<Home className="h-5 w-5" />} 
                  text="Dashboard" 
                  isCollapsed={isCollapsed} 
                />
                
                <NavItem 
                  to="/submit-report" 
                  icon={<FileText className="h-5 w-5" />} 
                  text="Submit Report" 
                  isCollapsed={isCollapsed} 
                />
                
                <NavItem 
                  to="/my-reports" 
                  icon={<List className="h-5 w-5" />} 
                  text="My Reports" 
                  isCollapsed={isCollapsed} 
                />
                
                <NavItem 
                  to="/bug-bounty" 
                  icon={<DollarSign className="h-5 w-5" />} 
                  text="Bug Bounty" 
                  isCollapsed={isCollapsed} 
                />
                
                <NavItem 
                  to="/settings" 
                  icon={<Settings className="h-5 w-5" />} 
                  text="Settings" 
                  isCollapsed={isCollapsed} 
                />
                
                <NavItem 
                  to="/vulnerabilities" 
                  icon={<AlertTriangle className="h-5 w-5" />} 
                  text="Vulnerabilities" 
                  isCollapsed={isCollapsed} 
                />
              </>
            )}
          </ul>
        </nav>
      </div>
      
      {/* Logout button */}
      <div className="absolute bottom-0 w-full p-4 border-t border-cyber-teal/20">
        <button 
          onClick={handleLogout}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} w-full p-2 rounded hover:bg-cyber-teal/20 text-gray-400 hover:text-white transition-colors`}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2 text-sm">Log Out</span>}
        </button>
      </div>
    </div>
  );
};

// Navigation item component
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, text, isCollapsed }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) => `
          flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} 
          p-2 rounded ${isActive ? 'bg-cyber-teal text-white' : 'text-gray-400 hover:bg-cyber-teal/20 hover:text-white'}
          transition-colors
        `}
        title={text}
      >
        {icon}
        {!isCollapsed && <span className="ml-2 text-sm">{text}</span>}
      </NavLink>
    </li>
  );
};

export default Sidebar;
