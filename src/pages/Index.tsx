import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldAlert, Terminal, ChevronRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row items-center p-6 md:p-12">
        <div className="flex-1 space-y-6 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold text-cyber-teal">
            Sentryl
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
            The premier platform for ethical hackers and security teams to collaborate on finding and fixing vulnerabilities.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/login" className="cyber-button">
              Get Started
              <ChevronRight size={18} />
            </Link>
            <Link to="/dashboard" className="cyber-button-outline">
              Explore Dashboard
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="cyber-panel w-full max-w-md p-6 rounded-lg">
            <div className="flex justify-center mb-6">
              <ShieldAlert size={64} className="text-cyber-teal" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Secure the Digital Frontier</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Shield className="mr-2 text-cyber-teal shrink-0 mt-1" size={18} />
                <span>Submit vulnerabilities and earn bounties</span>
              </li>
              <li className="flex items-start">
                <Shield className="mr-2 text-cyber-teal shrink-0 mt-1" size={18} />
                <span>Collaborate with security teams worldwide</span>
              </li>
              <li className="flex items-start">
                <Shield className="mr-2 text-cyber-teal shrink-0 mt-1" size={18} />
                <span>Track your findings and reputation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-cyber-darker py-12 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="cyber-card p-6">
            <Terminal size={40} className="text-cyber-teal mb-4" />
            <h3 className="text-xl font-bold mb-2">Vulnerability Reporting</h3>
            <p className="text-gray-300">Submit detailed vulnerability reports with supporting evidence and severity ratings.</p>
          </div>
          
          <div className="cyber-card p-6">
            <ShieldAlert size={40} className="text-cyber-teal mb-4" />
            <h3 className="text-xl font-bold mb-2">Bug Bounty Program</h3>
            <p className="text-gray-300">Participate in bug bounty programs from leading organizations and earn rewards.</p>
          </div>
          
          <div className="cyber-card p-6">
            <Shield size={40} className="text-cyber-teal mb-4" />
            <h3 className="text-xl font-bold mb-2">Security Dashboard</h3>
            <p className="text-gray-300">Track vulnerabilities, monitor patch status, and analyze security metrics.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-cyber-light py-12 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Join the Sentryl Network?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Create an account today and start contributing to a more secure digital ecosystem.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/signup" className="cyber-button">
            Create Account
          </Link>
          <Link to="/bug-bounty" className="cyber-button-outline">
            View Bounties
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-cyber-darker py-6 px-6 text-center">
        <p className="text-gray-400">© 2023 Sentryl. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
