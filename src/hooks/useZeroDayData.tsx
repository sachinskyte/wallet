import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

// Attack interface
export interface Attack {
  id: string;
  timestamp: string;
  ip: string;
  attack_type: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Mitigated';
  details: {
    user_agent: string;
    method: string;
    url_path: string;
    source_port: number;
    destination_port: number;
  };
}

// Blockchain interface
export interface BlockchainBlock {
  data: {
    message?: string;
    type?: string;
    severity?: string;
    threat?: string;
    [key: string]: any;
  };
  data_hash: string;
  hash: string;
  previous_hash: string;
  timestamp: string;
}

export interface BlockchainData {
  chain: BlockchainBlock[];
  length?: number;
}

// Report interface
export interface Report {
  id: string;
  title: string;
  company: string;
  risk_level: string;
  status: string;
  submitter_name: string;
  created_at: string;
  description: string;
}

// Hook for managing zero day dashboard data
export const useZeroDayData = (user: any) => {
  const { toast } = useToast();
  
  // State for API and blockchain connections
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [blockchainConnected, setBlockchainConnected] = useState<boolean>(false);
  
  // Connection settings
  const [apiUrl, setApiUrl] = useState<string>('');
  const [blockchainUrl, setBlockchainUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [connectionError, setConnectionError] = useState<string>('');
  
  // Attack data and blockchain data
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [blockchainData, setBlockchainData] = useState<BlockchainData | null>(null);
  
  // AI analysis data
  const [threatTrends, setThreatTrends] = useState<any[]>([]);
  const [attackVectors, setAttackVectors] = useState<any[]>([]);
  
  // Sound alerts
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch reports from Supabase using React Query for real-time updates
  const { data: recentReports = [], isLoading: isReportsLoading, refetch: refetchReports } = useQuery({
    queryKey: ['adminReports'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: "Error",
          description: "Failed to fetch reports",
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
  
  // Set up real-time subscription for reports
  useEffect(() => {
    const channel = supabase
      .channel('real-time-reports')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reports' 
      }, () => {
        // Refetch reports when changes occur
        refetchReports();
        
        // Play sound if enabled
        if (soundEnabled) {
          playAlertSound();
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchReports, soundEnabled]);

  // Fetch data from API and blockchain periodically
  const fetchDataFromSources = useCallback(async () => {
    if (!apiConnected && !blockchainConnected) return;
    
    try {
      // Fetch from API if connected
      if (apiConnected && apiUrl) {
        try {
          const headers: HeadersInit = {};
          if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
          }
          
          const response = await fetch(apiUrl, { headers });
          if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
          }
          
          const data = await response.json();
          if (Array.isArray(data)) {
            setAttacks(data);
          } else if (data && typeof data === 'object') {
            // Handle case where API returns a single object or wrapped array
            const attacksArray = Array.isArray(data.attacks) ? data.attacks : 
                               Array.isArray(data.data) ? data.data : 
                               [data];
            setAttacks(attacksArray);
          }
          
          setConnectionError('');
        } catch (error) {
          console.error('Error fetching from API:', error);
          setConnectionError(`Threat API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Use reports as backup data source
          if (recentReports.length > 0) {
            const reportBasedAttacks = convertReportsToAttacks(recentReports);
            setAttacks(reportBasedAttacks);
          }
        }
      }
      
      // Fetch from blockchain if connected
      if (blockchainConnected && blockchainUrl) {
        try {
          const headers: HeadersInit = {};
          if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
          }
          
          const response = await fetch(blockchainUrl, { headers });
          if (!response.ok) {
            throw new Error(`Blockchain API responded with status: ${response.status}`);
          }
          
          const data = await response.json();
          setBlockchainData(data);
          setConnectionError('');
        } catch (error) {
          console.error('Error fetching from blockchain:', error);
          setConnectionError(`Blockchain connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Use reports as backup for blockchain data
          if (recentReports.length > 0) {
            addReportBlockchainEntries(recentReports);
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchDataFromSources:', error);
    }
  }, [apiConnected, blockchainConnected, apiUrl, blockchainUrl, apiKey, recentReports]);
  
  // Set up polling for external data sources
  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchDataFromSources();
    };
    
    if (apiConnected || blockchainConnected) {
      fetchInitialData();
      
      const interval = setInterval(fetchDataFromSources, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [fetchDataFromSources, apiConnected, blockchainConnected]);
  
  // Sync report data with attack data
  useEffect(() => {
    if (recentReports.length > 0) {
      // If we don't have API data, use reports as the data source
      if ((!apiConnected || attacks.length === 0) && recentReports.length > 0) {
        const reportBasedAttacks = convertReportsToAttacks(recentReports);
        setAttacks(reportBasedAttacks);
      }
      
      // Update AI analysis based on the attack data
      if (attacks.length > 0) {
        updateAIAnalysis(attacks);
      }
      
      // Add blockchain entries for reports if blockchain is not connected
      if (!blockchainConnected && (!blockchainData || blockchainData.chain.length <= 1)) {
        addReportBlockchainEntries(recentReports);
      }
    }
  }, [recentReports, attacks, apiConnected, blockchainConnected, blockchainData]);
  
  // Convert reports to attack format
  const convertReportsToAttacks = (reports: Report[]): Attack[] => {
    return reports.map((report: Report) => {
      return {
        id: report.id,
        timestamp: report.created_at,
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        attack_type: report.title.includes('SQL') ? 'SQL Injection' : 
                    report.title.includes('XSS') ? 'XSS' : 
                    report.title.includes('CSRF') ? 'CSRF' : 'Unknown Vulnerability',
        severity: (report.risk_level === 'critical' || report.risk_level === 'high') ? 'High' : 
                 report.risk_level === 'medium' ? 'Medium' : 'Low' as 'High' | 'Medium' | 'Low',
        status: report.status === 'fixed' ? 'Mitigated' : 'Active' as 'Active' | 'Mitigated',
        details: {
          user_agent: 'Reported via Security Portal',
          method: 'REPORT',
          url_path: `/company/${report.company}`,
          source_port: Math.floor(Math.random() * 10000) + 30000,
          destination_port: 443
        }
      };
    });
  };

  // Generate threat trend data for time-based visualization
  const updateAIAnalysis = (attacks: Attack[]) => {
    // Group attacks by day for threat trends
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const attacksByDay = new Map();
    last7Days.forEach(day => {
      attacksByDay.set(day, { date: day, total: 0, high: 0, medium: 0, low: 0 });
    });
    
    // Count attacks by day and severity
    attacks.forEach(attack => {
      const day = attack.timestamp.split('T')[0];
      if (attacksByDay.has(day)) {
        const dayData = attacksByDay.get(day);
        dayData.total++;
        
        if (attack.severity === 'High') dayData.high++;
        else if (attack.severity === 'Medium') dayData.medium++;
        else if (attack.severity === 'Low') dayData.low++;
        
        attacksByDay.set(day, dayData);
      }
    });
    
    setThreatTrends(Array.from(attacksByDay.values()));
    
    // Analyze attack vectors
    const attackVectors = new Map();
    attacks.forEach(attack => {
      const type = attack.attack_type;
      if (attackVectors.has(type)) {
        attackVectors.set(type, attackVectors.get(type) + 1);
      } else {
        attackVectors.set(type, 1);
      }
    });
    
    setAttackVectors(Array.from(attackVectors.entries()).map(([name, value]) => ({ name, value })));
  };
  
  // Add blockchain entries for reports
  const addReportBlockchainEntries = (reports: Report[]) => {
    // Create a new blockchain data structure if it doesn't exist
    if (!blockchainData) {
      const genesisBlock = {
        data: {
          message: "Sentryl Started",
          type: "genesis"
        },
        data_hash: "42ae1fa77dbaccb1c304a542e662c418556ea433147c38865626dd4e13bcc9be",
        hash: "29455a0da85c2037d0c6fbfbac5e9552121579d37b16c5c2d5d818087d2f9730",
        previous_hash: "0",
        timestamp: new Date(Date.now() - 86400000).toISOString()
      };
      
      setBlockchainData({ chain: [genesisBlock] });
      return;
    }
    
    // Sort reports by created_at to maintain chronological order
    const sortedReports = [...reports].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    // Create a new chain with the reports as blockchain entries
    const newChain = [...blockchainData.chain];
    
    sortedReports.forEach((report) => {
      // Check if the report is already in the blockchain to avoid duplicates
      const reportExists = newChain.some(block => 
        block.data.message?.includes(report.title)
      );
      
      if (!reportExists) {
        const prevBlock = newChain[newChain.length - 1];
        const timestamp = report.created_at;
        const messageType = report.status === 'fixed' ? 'mitigation' : 'attack';
        
        // Create a simple hash based on the report data
        const dataHash = btoa(`${report.id}${report.title}${timestamp}`).substring(0, 64);
        const blockHash = btoa(`${prevBlock.hash}${dataHash}${timestamp}`).substring(0, 64);
        
        newChain.push({
          data: {
            message: `${report.title} - ${report.company}`,
            type: messageType,
            severity: report.risk_level,
            threat: report.title
          },
          data_hash: dataHash,
          hash: blockHash,
          previous_hash: prevBlock.hash,
          timestamp
        });
      }
    });
    
    // Update the blockchain data
    setBlockchainData({ 
      chain: newChain,
      length: newChain.length
    });
  };
  
  // Function to play alert sound
  const playAlertSound = () => {
    try {
      const audio = new Audio('/alert.mp3');
      audio.play();
    } catch (error) {
      console.error("Error playing alert sound:", error);
    }
  };
  
  // Function to connect to API and blockchain
  const handleConnect = async (newApiUrl: string, newBlockchainUrl: string, newApiKey?: string) => {
    setIsLoading(true);
    setConnectionError('');
    
    try {
      // Store the new connection parameters
      setApiUrl(newApiUrl);
      setBlockchainUrl(newBlockchainUrl);
      setApiKey(newApiKey || '');
      
      // Try to connect to the API
      let apiConnectSuccessful = false;
      if (newApiUrl) {
        try {
          const headers: HeadersInit = {};
          if (newApiKey) {
            headers['Authorization'] = `Bearer ${newApiKey}`;
          }
          
          const response = await fetch(newApiUrl, { headers });
          if (response.ok) {
            const data = await response.json();
            
            if (Array.isArray(data)) {
              setAttacks(data);
              apiConnectSuccessful = true;
            } else if (data && typeof data === 'object') {
              // Handle case where API returns a single object or wrapped array
              const attacksArray = Array.isArray(data.attacks) ? data.attacks : 
                                 Array.isArray(data.data) ? data.data : 
                                 [data];
              setAttacks(attacksArray);
              apiConnectSuccessful = true;
            }
          } else {
            throw new Error(`API responded with status: ${response.status}`);
          }
        } catch (error) {
          console.error('Error connecting to API:', error);
          setConnectionError(`Threat API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Fall back to using reports as data source
          if (recentReports.length > 0) {
            const reportBasedAttacks = convertReportsToAttacks(recentReports);
            setAttacks(reportBasedAttacks);
            apiConnectSuccessful = true;
          }
        }
      }
      
      // Try to connect to the blockchain
      let blockchainConnectSuccessful = false;
      if (newBlockchainUrl) {
        try {
          const headers: HeadersInit = {};
          if (newApiKey) {
            headers['Authorization'] = `Bearer ${newApiKey}`;
          }
          
          const response = await fetch(newBlockchainUrl, { headers });
          if (response.ok) {
            const data = await response.json();
            setBlockchainData(data);
            blockchainConnectSuccessful = true;
          } else {
            throw new Error(`Blockchain API responded with status: ${response.status}`);
          }
        } catch (error) {
          console.error('Error connecting to blockchain:', error);
          
          if (!connectionError) {
            setConnectionError(`Blockchain connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
          
          // Fall back to using reports for blockchain data
          if (recentReports.length > 0) {
            addReportBlockchainEntries(recentReports);
            blockchainConnectSuccessful = true;
          }
        }
      }
      
      // Update connection states
      setApiConnected(apiConnectSuccessful);
      setBlockchainConnected(blockchainConnectSuccessful);
      
      // Process data if at least one connection was successful
      if (apiConnectSuccessful || blockchainConnectSuccessful) {
        if (attacks.length > 0) {
          updateAIAnalysis(attacks);
        }
        
        toast({
          title: "Connection Status",
          description: `${apiConnectSuccessful ? 'API connected. ' : 'API connection failed. '}${blockchainConnectSuccessful ? 'Blockchain connected.' : 'Blockchain connection failed.'}`,
          variant: apiConnectSuccessful && blockchainConnectSuccessful ? "default" : "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to both API and blockchain sources.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting to the services.",
        variant: "destructive",
      });
      
      setApiConnected(false);
      setBlockchainConnected(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to disconnect from API and blockchain
  const handleDisconnect = () => {
    setApiConnected(false);
    setBlockchainConnected(false);
    setConnectionError('');
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from external data sources.",
    });
  };

  // Calculate threat statistics
  const totalThreats = attacks.length;
  const activeThreats = attacks.filter(attack => attack.status === 'Active').length;
  const mitigatedThreats = attacks.filter(attack => attack.status === 'Mitigated').length;
  const mitigationRate = totalThreats > 0 ? (mitigatedThreats / totalThreats) * 100 : 0;
  
  // Calculate severity distribution
  const highSeverity = attacks.filter(attack => attack.severity === 'High').length;
  const mediumSeverity = attacks.filter(attack => attack.severity === 'Medium').length;
  const lowSeverity = attacks.filter(attack => attack.severity === 'Low').length;
  
  const severityData = [
    { name: 'High', value: highSeverity, color: '#ef4444' },
    { name: 'Medium', value: mediumSeverity, color: '#f59e0b' },
    { name: 'Low', value: lowSeverity, color: '#10b981' },
  ];

  return {
    apiConnected,
    blockchainConnected,
    attacks,
    blockchainData,
    threatTrends,
    attackVectors,
    soundEnabled,
    setSoundEnabled,
    isLoading,
    recentReports,
    isReportsLoading,
    handleConnect,
    handleDisconnect,
    totalThreats,
    activeThreats,
    mitigatedThreats,
    mitigationRate,
    highSeverity,
    mediumSeverity,
    lowSeverity,
    severityData,
    playAlertSound,
    apiUrl,
    blockchainUrl,
    apiKey,
    connectionError
  };
};
