import React, { useState } from 'react';
import { AlertTriangle, Database, RefreshCw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ConnectionPromptProps {
  handleConnect: (apiUrl: string, blockchainUrl: string, apiKey?: string) => void;
  isLoading: boolean;
  connectionError?: string;
}

const ConnectionPrompt: React.FC<ConnectionPromptProps> = ({ 
  handleConnect, 
  isLoading,
  connectionError 
}) => {
  const [apiUrl, setApiUrl] = useState<string>('http://127.0.0.1:8000/fake-attacks');
  const [blockchainUrl, setBlockchainUrl] = useState<string>('https://sentryl-production.up.railway.app/chain');
  const [apiKey, setApiKey] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConnect(apiUrl, blockchainUrl, apiKey);
  };

  return (
    <div className="cyber-panel p-6">
      <h2 className="text-xl font-bold text-white mb-4">Connection Settings</h2>
      <p className="text-gray-400 mb-6">
        Configure your threat intelligence API and blockchain connections
      </p>
      
      {connectionError && (
        <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-md mb-6 flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{connectionError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-400 mb-1">
            API Key (Optional)
          </label>
          <Input
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your API key"
            className="bg-cyber-darker border-cyber-teal/30 text-white"
          />
        </div>
        
        <div>
          <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-400 mb-1">
            Threat API URL <span className="text-red-400">*</span>
          </label>
          <Input
            id="apiUrl"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://api.example.com/threats"
            required
            className="bg-cyber-darker border-cyber-teal/30 text-white"
          />
        </div>
        
        <div>
          <label htmlFor="blockchainUrl" className="block text-sm font-medium text-gray-400 mb-1">
            Blockchain URL <span className="text-red-400">*</span>
          </label>
          <Input
            id="blockchainUrl"
            value={blockchainUrl}
            onChange={(e) => setBlockchainUrl(e.target.value)}
            placeholder="https://blockchain.example.com/ledger"
            required
            className="bg-cyber-darker border-cyber-teal/30 text-white"
          />
        </div>
        
        <div className="flex justify-between pt-2">
          <Button 
            type="button"
            variant="outline" 
            className="border-cyber-teal/30 hover:bg-cyber-teal/20"
            onClick={() => {
              setApiUrl('');
              setBlockchainUrl('');
              setApiKey('');
            }}
          >
            Reset
          </Button>
          
          <Button 
            type="submit"
            disabled={isLoading || !apiUrl || !blockchainUrl} 
            className="bg-cyber-teal hover:bg-cyber-teal/80 text-white"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Database className="h-4 w-4 mr-2" />
            )}
            Update Connection
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConnectionPrompt;
