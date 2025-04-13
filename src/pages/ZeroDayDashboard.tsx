
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';
import { useZeroDayData } from '@/hooks/useZeroDayData';
import ConnectionPanel from '@/components/ZeroDay/ConnectionPanel';
import ThreatOverview from '@/components/ZeroDay/ThreatOverview';
import SeverityDistribution from '@/components/ZeroDay/SeverityDistribution';
import ThreatAnalysis from '@/components/ZeroDay/ThreatAnalysis';
import LiveAttackFeed from '@/components/ZeroDay/LiveAttackFeed';
import BlockchainLedger from '@/components/ZeroDay/BlockchainLedger';
import ConnectionPrompt from '@/components/ZeroDay/ConnectionPrompt';

const ZeroDayDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use our custom hook for all the data and logic
  const {
    apiConnected,
    blockchainConnected,
    attacks,
    blockchainData,
    threatTrends,
    attackVectors,
    soundEnabled,
    setSoundEnabled,
    isLoading,
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
    apiUrl,
    blockchainUrl,
    apiKey,
    connectionError
  } = useZeroDayData(user);
  
  // Check if user is admin
  useEffect(() => {
    if (user && user.id !== 'admin-id') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [user, navigate, toast]);
  
  return (
    <div className="p-4 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-red-500/20 text-red-300 text-xs font-medium px-2.5 py-0.5 rounded border border-red-500/30">
            Admin Only
          </span>
          <span className="bg-cyber-teal/20 text-cyber-teal text-xs font-medium px-2.5 py-0.5 rounded border border-cyber-teal/30">
            Real-Time
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Shield className="h-6 w-6 text-red-400 mr-2" />
          Zero-Day Threat Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Real-time cybersecurity threat monitoring and blockchain verification
        </p>
      </div>
      
      {/* Show connection settings if connected */}
      {(apiConnected || blockchainConnected) ? (
        <ConnectionPanel 
          apiConnected={apiConnected}
          blockchainConnected={blockchainConnected}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          handleConnect={handleConnect}
          handleDisconnect={handleDisconnect}
          isLoading={isLoading}
          apiUrl={apiUrl}
          blockchainUrl={blockchainUrl}
          apiKey={apiKey}
          connectionError={connectionError}
        />
      ) : (
        <ConnectionPrompt 
          handleConnect={handleConnect} 
          isLoading={isLoading}
          connectionError={connectionError}
        />
      )}
      
      {/* Display data only if connected */}
      {(apiConnected || blockchainConnected) && (
        <>
          <ThreatOverview 
            totalThreats={totalThreats}
            activeThreats={activeThreats}
            mitigatedThreats={mitigatedThreats}
            mitigationRate={mitigationRate}
          />
          
          <SeverityDistribution 
            totalThreats={totalThreats}
            highSeverity={highSeverity}
            mediumSeverity={mediumSeverity}
            lowSeverity={lowSeverity}
            severityData={severityData}
          />
          
          <ThreatAnalysis 
            totalThreats={totalThreats}
            threatTrends={threatTrends}
            attackVectors={attackVectors}
          />
          
          <LiveAttackFeed attacks={attacks} />
        </>
      )}
      
      {/* Blockchain ledger with enhanced visualization */}
      {blockchainConnected && blockchainData && (
        <BlockchainLedger blockchainData={blockchainData} />
      )}
    </div>
  );
};

export default ZeroDayDashboard;
