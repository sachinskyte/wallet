
import React, { useState } from 'react';
import { Database, RefreshCw, Volume2, VolumeX, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ConnectionPanelProps {
  apiConnected: boolean;
  blockchainConnected: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  handleConnect: (apiUrl: string, blockchainUrl: string, apiKey?: string) => void;
  isLoading: boolean;
  apiUrl: string;
  blockchainUrl: string;
  apiKey?: string;
  connectionError?: string;
  handleDisconnect: () => void;
}

const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  apiConnected,
  blockchainConnected,
  soundEnabled,
  setSoundEnabled,
  handleConnect,
  isLoading,
  apiUrl,
  blockchainUrl,
  apiKey,
  connectionError,
  handleDisconnect
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editApiUrl, setEditApiUrl] = useState<string>(apiUrl);
  const [editBlockchainUrl, setEditBlockchainUrl] = useState<string>(blockchainUrl);
  const [editApiKey, setEditApiKey] = useState<string>(apiKey || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConnect(editApiUrl, editBlockchainUrl, editApiKey);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditApiUrl(apiUrl);
    setEditBlockchainUrl(blockchainUrl);
    setEditApiKey(apiKey || '');
    setIsEditing(false);
  };

  return (
    <div className="cyber-panel p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white">Connection Settings</h2>
      
      {connectionError && !isEditing && (
        <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-md mb-6 flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{connectionError}</p>
        </div>
      )}
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-400 mb-1">
              API Key (Optional)
            </label>
            <Input
              id="apiKey"
              value={editApiKey}
              onChange={(e) => setEditApiKey(e.target.value)}
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
              value={editApiUrl}
              onChange={(e) => setEditApiUrl(e.target.value)}
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
              value={editBlockchainUrl}
              onChange={(e) => setEditBlockchainUrl(e.target.value)}
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
              onClick={handleCancel}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              disabled={isLoading || !editApiUrl || !editBlockchainUrl} 
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
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col space-y-2 w-full md:w-auto">
              <div className="flex space-x-2">
                <div className={`text-xs px-3 py-1 rounded-full flex items-center ${
                  apiConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  <span className={`h-2 w-2 rounded-full mr-2 ${
                    apiConnected ? 'bg-green-400' : 'bg-red-400'
                  }`}></span>
                  AI System {apiConnected ? 'Connected' : 'Disconnected'}
                </div>
                
                <div className={`text-xs px-3 py-1 rounded-full flex items-center ${
                  blockchainConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  <span className={`h-2 w-2 rounded-full mr-2 ${
                    blockchainConnected ? 'bg-green-400' : 'bg-red-400'
                  }`}></span>
                  Blockchain {blockchainConnected ? 'Connected' : 'Disconnected'}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 w-full md:w-auto">
              {(apiConnected || blockchainConnected) ? (
                <Button 
                  onClick={handleDisconnect} 
                  variant="destructive"
                  className="w-full md:w-auto"
                >
                  Disconnect
                </Button>
              ) : null}
              
              <Button 
                onClick={() => setIsEditing(true)} 
                className="w-full md:w-auto bg-cyber-teal hover:bg-cyber-teal/80 text-white"
              >
                Edit Connection Settings
              </Button>
              
              <Button 
                onClick={() => setSoundEnabled(!soundEnabled)} 
                variant="outline"
                className="border-cyber-teal/30 hover:bg-cyber-teal/20"
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-cyber-teal" />
                ) : (
                  <VolumeX className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
          
          {(apiConnected || blockchainConnected) && (
            <div className="space-y-2 bg-cyber-darker p-4 rounded-md border border-cyber-teal/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {apiKey && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">API Key</p>
                    <p className="text-sm text-gray-300">••••••••{apiKey.slice(-4)}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">API URL</p>
                  <p className="text-sm text-gray-300 truncate" title={apiUrl}>{apiUrl}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Blockchain URL</p>
                  <p className="text-sm text-gray-300 truncate" title={blockchainUrl}>{blockchainUrl}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionPanel;
