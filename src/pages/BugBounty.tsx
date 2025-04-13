import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, ArrowUpDown, ExternalLink } from 'lucide-react';
import { bountyPrograms, BountyProgram } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BugBounty: React.FC = () => {
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | 'all'>('all');
  const [sortBy, setSortBy] = useState<'minBounty' | 'maxBounty' | 'company'>('maxBounty');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [programs, setPrograms] = useState<BountyProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, we would fetch this data from an API
    fetchBountyPrograms();
  }, []);
  
  const fetchBountyPrograms = async () => {
    setLoading(true);
    
    // For demo purposes, we're using the mock data
    // In a real app, this would be an API call to fetch real bug bounty programs
    setTimeout(() => {
      // Add more realistic bug bounty data to the mock data
      const enhancedPrograms = bountyPrograms.map(program => ({
        ...program,
        company: updateCompanyNames(program.company),
        description: updateDescriptions(program.description),
        scope: updateScopes(program.scope),
        minBounty: program.minBounty * 1.5, // Make bounties more realistic
        maxBounty: program.maxBounty * 1.2,
      }));
      
      setPrograms(enhancedPrograms);
      setLoading(false);
    }, 800);
  };
  
  // Helper function to update company names to be more realistic
  const updateCompanyNames = (company: string) => {
    const companyMappings: {[key: string]: string} = {
      "Company Alpha": "Tesla CyberDefense",
      "Company Beta": "Microsoft Security",
      "Company Gamma": "PayPal Bug Hunt",
      "Company Delta": "Google VRP",
      "Company Epsilon": "Shopify Security",
      "Company Zeta": "Cloudflare Security",
    };
    
    return companyMappings[company] || company;
  };
  
  // Helper function to update descriptions to be more realistic
  const updateDescriptions = (description: string) => {
    if (description.includes("Alpha")) 
      return "Find vulnerabilities in our vehicle software systems and API endpoints. Focus on safety-critical components.";
    if (description.includes("Beta")) 
      return "Identify security issues in our cloud services, identity systems, and Office applications.";
    if (description.includes("Gamma")) 
      return "Help secure our payment processing systems and user authentication flows.";
    if (description.includes("Delta")) 
      return "Discover vulnerabilities across our web services, Android, and Chrome platforms.";
    if (description.includes("Epsilon")) 
      return "Report security flaws in our e-commerce platform, storefront APIs, and merchant systems.";
    if (description.includes("Zeta")) 
      return "Find bugs in our CDN, DNS services, and zero-trust security solutions.";
      
    return description;
  };
  
  // Helper function to update scopes to be more relevant
  const updateScopes = (scopes: string[]) => {
    const scopeOptions = [
      "Web Applications", "Mobile Apps", "APIs", "Cloud Infrastructure", 
      "Authentication", "Authorization", "Data Validation", "Encryption",
      "XSS", "CSRF", "SQL Injection", "RCE", "SSRF", "Business Logic"
    ];
    
    // Create a mix of original and new scopes
    return scopes.map((_, index) => {
      // Get a random scope that's different from the current one
      const randomIndex = Math.floor(Math.random() * scopeOptions.length);
      return scopeOptions[randomIndex];
    });
  };
  
  // Handler for sorting columns
  const handleSort = (field: 'minBounty' | 'maxBounty' | 'company') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Filter and sort bounty programs based on user selections
  const filteredPrograms = programs
    .filter(program => 
      program.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(program => activeFilter === 'all' || program.isActive === activeFilter)
    .sort((a, b) => {
      if (sortBy === 'company') {
        return sortDirection === 'asc' 
          ? a.company.localeCompare(b.company)
          : b.company.localeCompare(a.company);
      } else {
        return sortDirection === 'asc' 
          ? a[sortBy] - b[sortBy]
          : b[sortBy] - a[sortBy];
      }
    });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-cyber-teal/20 text-cyber-teal text-xs font-medium px-2.5 py-0.5 rounded border border-cyber-teal/30">
            Bounties
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white flex items-center">
          <DollarSign className="h-6 w-6 text-cyber-teal mr-2" />
          Bug Bounty Programs
        </h1>
        <p className="text-gray-400 mt-2">
          Find active bug bounty programs and earn rewards for your findings
        </p>
      </div>
      
      {/* Search and filter panel */}
      <div className="cyber-panel p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="cyber-input pl-10"
              placeholder="Search bug bounty programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filters and sorting */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Status filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-cyber-teal" />
              <span className="text-gray-400 text-sm">Status:</span>
              <select
                className="cyber-input py-2"
                value={activeFilter === 'all' ? 'all' : activeFilter.toString()}
                onChange={(e) => setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value === 'true')}
              >
                <option value="all">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            
            {/* Sort options */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-cyber-teal" />
              <span className="text-gray-400 text-sm">Sort:</span>
              <select
                className="cyber-input py-2"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value as 'minBounty' | 'maxBounty' | 'company')}
              >
                <option value="maxBounty">Max Reward</option>
                <option value="minBounty">Min Reward</option>
                <option value="company">Company</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="cyber-panel p-6 flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-cyber-teal border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {/* Bounty program cards grid */}
        {!loading && (
          <div className="cyber-panel p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => (
                <BountyProgramCard key={program.id} program={program} />
              ))}
              
              {/* Empty state */}
              {filteredPrograms.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <DollarSign className="h-10 w-10 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-1">No programs found</h3>
                  <p className="text-gray-400 text-sm">
                    No bug bounty programs match your current filters
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for individual bounty program card
interface BountyProgramCardProps {
  program: BountyProgram;
}

const BountyProgramCard: React.FC<BountyProgramCardProps> = ({ program }) => {
  return (
    <div className={`cyber-card ${!program.isActive ? 'opacity-70' : ''} h-full flex flex-col hover:border-cyber-teal/50 transition-all`}>
      <div className="p-5">
        {/* Program header with logo and name */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 flex-shrink-0 rounded bg-cyber-teal/20 flex items-center justify-center overflow-hidden border border-cyber-teal/30">
              <img 
                src={program.logo} 
                alt={program.company} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3">
              <h3 className="font-bold text-white">{program.company}</h3>
              <div className="flex items-center">
                {program.isActive ? (
                  <span className="text-xs text-cyber-green">Active Program</span>
                ) : (
                  <span className="text-xs text-cyber-red">Inactive Program</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Program description */}
        <p className="text-gray-300 text-sm mb-4">{program.description}</p>
        
        {/* Bounty range */}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">Bounty Range:</div>
          <div className="text-lg font-bold text-cyber-yellow">
            ${program.minBounty.toLocaleString()} - ${program.maxBounty.toLocaleString()}
          </div>
        </div>
        
        {/* Scope tags */}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Scope:</div>
          <div className="flex flex-wrap gap-2">
            {program.scope.map((item, index) => (
              <span 
                key={index}
                className="text-xs bg-cyber-teal/10 text-cyber-teal px-2 py-1 rounded border border-cyber-teal/20"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Action button */}
      <div className="mt-auto p-5 pt-0">
        <button 
          className="cyber-button w-full text-sm py-2 flex items-center justify-center" 
          disabled={!program.isActive}
        >
          <span>View Program</span>
          <ExternalLink className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default BugBounty;
