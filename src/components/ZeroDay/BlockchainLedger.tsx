
import React, { useEffect, useState } from 'react';
import { AlertTriangle, ChevronRight, Shield } from 'lucide-react';

interface BlockchainBlock {
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

interface BlockchainData {
  chain: BlockchainBlock[];
  length?: number;
}

interface BlockchainLedgerProps {
  blockchainData: BlockchainData | null;
}

const BlockchainLedger: React.FC<BlockchainLedgerProps> = ({ blockchainData }) => {
  const [animateBlocks, setAnimateBlocks] = useState<boolean[]>([]);

  useEffect(() => {
    if (blockchainData && blockchainData.chain) {
      setAnimateBlocks(new Array(blockchainData.chain.length).fill(false));
      
      // Animate blocks with a slight delay between each
      blockchainData.chain.forEach((_, index) => {
        setTimeout(() => {
          setAnimateBlocks(prev => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
        }, index * 150);
      });
    }
  }, [blockchainData]);

  if (!blockchainData) {
    return null;
  }

  return (
    <div className="cyber-panel p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
        <Shield 
          className="h-5 w-5 mr-2 text-cyber-teal" 
          fill="none" 
          stroke="currentColor" 
        />
        Blockchain Verified Ledger
      </h2>
      
      {/* Blockchain Ledger Visualization */}
      {blockchainData.chain.length > 0 ? (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          {blockchainData.chain.map((block, index) => (
            <div 
              key={index} 
              className={`relative ${animateBlocks[index] ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-cyber-darker p-4 rounded-md border border-cyber-teal/30 h-full hover:border-cyber-teal/70 transition-colors">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-xs text-cyber-teal">Block #{index + 1}</span>
                  <span className="text-xs bg-cyber-teal/20 text-cyber-teal px-2 py-0.5 rounded-full">
                    {block.data.type || "transaction"}
                  </span>
                </div>
                <p className="text-sm text-white font-medium mb-2">
                  {block.data.message || block.data.threat || "Blockchain Transaction"}
                </p>
                {block.data.severity && (
                  <span className={`inline-flex px-2 py-0.5 text-xs rounded-full mb-2 ${
                    block.data.severity === 'high' || block.data.severity === 'critical' ? 'bg-red-500/20 text-red-300' : 
                    block.data.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {block.data.severity.charAt(0).toUpperCase() + block.data.severity.slice(1)} Severity
                  </span>
                )}
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-400 truncate" title={block.hash}>
                    <span className="text-gray-500">Hash:</span> {block.hash.substring(0, 10)}...
                  </p>
                  <p className="text-xs text-gray-400 truncate" title={block.previous_hash}>
                    <span className="text-gray-500">Prev:</span> {block.previous_hash.substring(0, 10)}...
                  </p>
                  <p className="text-xs text-gray-400">
                    <span className="text-gray-500">Time:</span> {new Date(block.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              {index < blockchainData.chain.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <ChevronRight className="h-4 w-4 text-cyber-teal" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <AlertTriangle className="h-10 w-10 text-gray-500 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-1">No blockchain data</h3>
          <p className="text-gray-400 text-sm">
            The blockchain has not recorded any events yet
          </p>
        </div>
      )}
    </div>
  );
};

export default BlockchainLedger;
