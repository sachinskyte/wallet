
import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Cpu, Wifi } from 'lucide-react';

interface Attack {
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

interface LiveAttackFeedProps {
  attacks: Attack[];
}

const LiveAttackFeed: React.FC<LiveAttackFeedProps> = ({ attacks }) => {
  const [visibleAttacks, setVisibleAttacks] = useState<Attack[]>([]);
  const [recentAttack, setRecentAttack] = useState<Attack | null>(null);
  const [attackCount, setAttackCount] = useState<number>(0);
  
  // Format timestamps
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Calculate time ago
  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const attackTime = new Date(timestamp);
    const diffMs = now.getTime() - attackTime.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffSecs < 60) {
      return `${diffSecs} sec${diffSecs !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return formatTimestamp(timestamp);
    }
  };
  
  // Gradually display attacks with animation
  useEffect(() => {
    if (attacks.length === 0) return;
    
    setAttackCount(attacks.length);
    
    // Sort attacks by timestamp, newest first
    const sortedAttacks = [...attacks].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Set the most recent attack
    setRecentAttack(sortedAttacks[0]);
    
    // Display attacks gradually
    const displayAttacks = async () => {
      let displayed: Attack[] = [];
      
      for (let i = 0; i < sortedAttacks.length; i++) {
        displayed = [...displayed, sortedAttacks[i]];
        setVisibleAttacks([...displayed]);
        
        // Add a small delay between each attack
        if (i < sortedAttacks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    };
    
    displayAttacks();
  }, [attacks]);
  
  return (
    <div className="cyber-panel p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Wifi className="h-5 w-5 mr-2 text-cyber-teal" />
          Live Attack Feed
        </h2>
        
        {/* Real-time indicator */}
        <div className="flex items-center text-xs">
          <div className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-gray-400">LIVE</span>
          <span className="mx-2 text-gray-600">|</span>
          <Clock className="h-3 w-3 mr-1 text-gray-400" />
          <span className="text-gray-400">
            {attackCount} event{attackCount !== 1 ? 's' : ''} detected
          </span>
        </div>
      </div>
      
      {/* Recent attack highlight */}
      {recentAttack && (
        <div className="bg-cyber-dark p-4 rounded-md border border-cyber-teal/30 mb-4 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
              <span className="text-white font-medium">Most Recent Attack</span>
            </div>
            <span className="text-xs text-gray-400">{timeAgo(recentAttack.timestamp)}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-gray-400">Attack Type</span>
              <p className="text-white">{recentAttack.attack_type}</p>
            </div>
            <div>
              <span className="text-xs text-gray-400">Source IP</span>
              <p className="text-white">{recentAttack.ip}</p>
            </div>
            <div>
              <span className="text-xs text-gray-400">Target</span>
              <p className="text-white">{recentAttack.details.url_path}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs ${
              recentAttack.severity === 'High' ? 'bg-red-500/20 text-red-300' : 
              recentAttack.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' : 
              'bg-green-500/20 text-green-300'
            }`}>
              {recentAttack.severity} Severity
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              recentAttack.status === 'Active' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
            }`}>
              {recentAttack.status}
            </span>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-cyber-light/20 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">IP Address</th>
              <th scope="col" className="px-6 py-3">Attack Type</th>
              <th scope="col" className="px-6 py-3">Timestamp</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Severity</th>
              <th scope="col" className="px-6 py-3">Method</th>
            </tr>
          </thead>
          <tbody>
            {visibleAttacks.length > 0 ? (
              visibleAttacks.map((attack, index) => (
                <tr 
                  key={attack.id} 
                  className="border-b border-cyber-teal/10 hover:bg-cyber-light/10 animate-fade-in transition-all" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <td className="px-6 py-4 flex items-center">
                    <Cpu className="h-3 w-3 mr-2 text-cyber-teal" />
                    {attack.ip}
                  </td>
                  <td className="px-6 py-4">{attack.attack_type}</td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{timeAgo(attack.timestamp)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      attack.status === 'Active' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                    }`}>
                      {attack.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      attack.severity === 'High' ? 'bg-red-500/20 text-red-300' : 
                      attack.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' : 
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {attack.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      attack.details.method === 'GET' ? 'bg-blue-500/20 text-blue-300' :
                      attack.details.method === 'POST' ? 'bg-green-500/20 text-green-300' :
                      attack.details.method === 'DELETE' ? 'bg-red-500/20 text-red-300' :
                      'bg-purple-500/20 text-purple-300'
                    }`}>
                      {attack.details.method}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                  No attack data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveAttackFeed;
