import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-cyber-darker py-24 sm:py-32">
      <div className="absolute inset-0 z-0">
        <div className="grid-background"></div>
        <div className="cyber-glow"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center mb-6">
            <img src="/shield-logo.svg" alt="Sentryl" className="h-20 w-20" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            <span className="text-cyber-teal">SENTRYL</span> Cybersecurity Platform
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Advanced vulnerability management and bug bounty platform for modern organizations.
            Protect your digital assets with cutting-edge security solutions.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/signup"
              className="cyber-button-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <Link
              to="/login"
              className="cyber-button-outline-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute z-10 bottom-0 left-0 w-full h-24 bg-gradient-to-t from-cyber-darker to-transparent"></div>
    </div>
  );
};

export default Hero; 