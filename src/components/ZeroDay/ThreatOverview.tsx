
import React from 'react';
import { AlertTriangle, Shield, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface ThreatOverviewProps {
  totalThreats: number;
  activeThreats: number;
  mitigatedThreats: number;
  mitigationRate: number;
}

const ThreatOverview: React.FC<ThreatOverviewProps> = ({
  totalThreats,
  activeThreats,
  mitigatedThreats,
  mitigationRate
}) => {
  return (
    <div className="cyber-panel p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
        <Shield className="h-5 w-5 mr-2 text-cyber-teal" />
        Threat Overview
      </h2>
      
      {totalThreats > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-cyber-dark p-4 rounded-md border border-cyber-teal/20 animate-fade-in transition-all hover:border-cyber-teal/50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Total Threats</h3>
                  <p className="text-3xl font-bold text-white">{totalThreats}</p>
                </div>
                <div className="p-2 bg-cyber-teal/10 rounded-lg">
                  <Shield className="h-6 w-6 text-cyber-teal" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">Detected in the past 7 days</div>
            </div>
            
            <div className="bg-cyber-dark p-4 rounded-md border border-red-500/30 animate-fade-in transition-all hover:border-red-500/50" style={{ animationDelay: '100ms' }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Active Threats</h3>
                  <p className="text-3xl font-bold text-red-400">{activeThreats}</p>
                </div>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Zap className="h-6 w-6 text-red-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">Requiring immediate attention</div>
            </div>
            
            <div className="bg-cyber-dark p-4 rounded-md border border-green-500/30 animate-fade-in transition-all hover:border-green-500/50" style={{ animationDelay: '200ms' }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Mitigated Threats</h3>
                  <p className="text-3xl font-bold text-green-400">{mitigatedThreats}</p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">Successfully contained</div>
            </div>
            
            <div className="bg-cyber-dark p-4 rounded-md border border-cyber-teal/20 animate-fade-in transition-all hover:border-cyber-teal/50" style={{ animationDelay: '300ms' }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Mitigation Rate</h3>
                  <p className="text-3xl font-bold text-cyber-teal">{mitigationRate.toFixed(1)}%</p>
                </div>
                <div className="p-2 bg-cyber-teal/10 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-cyber-teal" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">Overall security efficacy</div>
            </div>
          </div>
          
          {/* Mitigation Rate Progress Bar */}
          <div className="bg-cyber-dark p-4 rounded-md border border-cyber-teal/20 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Overall Threat Mitigation Progress</span>
              <span className="text-sm text-cyber-teal">{mitigationRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${mitigationRate}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Critical</span>
              <span>Improving</span>
              <span>Optimal</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <AlertTriangle className="h-10 w-10 text-gray-500 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-1">No threats detected</h3>
          <p className="text-gray-400 text-sm">
            No vulnerability reports or threats have been detected yet
          </p>
        </div>
      )}
    </div>
  );
};

export default ThreatOverview;
