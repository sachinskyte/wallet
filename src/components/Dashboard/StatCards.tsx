
import React from 'react';
import { AlertCircle, CheckCircle, Activity, DollarSign, Target } from 'lucide-react';
import { dashboardStats } from '../../data/mockData';

const StatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      <StatCard 
        title="Total Vulnerabilities" 
        value={dashboardStats.totalVulnerabilities} 
        icon={<Activity className="h-6 w-6 text-cyber-blue" />}
        color="blue"
      />
      <StatCard 
        title="Critical Issues" 
        value={dashboardStats.criticalVulnerabilities} 
        icon={<AlertCircle className="h-6 w-6 text-cyber-red" />}
        color="red"
      />
      <StatCard 
        title="Verified Issues" 
        value={dashboardStats.verifiedVulnerabilities} 
        icon={<CheckCircle className="h-6 w-6 text-cyber-green" />}
        color="green"
      />
      <StatCard 
        title="Total Bounty Paid" 
        value={`$${dashboardStats.totalBountyPaid.toLocaleString()}`} 
        icon={<DollarSign className="h-6 w-6 text-cyber-yellow" />}
        color="yellow"
      />
      <StatCard 
        title="Active Programs" 
        value={dashboardStats.activeBountyPrograms} 
        icon={<Target className="h-6 w-6 text-cyber-orange" />}
        color="orange"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'green' | 'yellow' | 'orange' | 'teal' | 'cyan';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: 'border-cyber-blue/30 bg-cyber-blue/5',
    red: 'border-cyber-red/30 bg-cyber-red/5',
    green: 'border-cyber-green/30 bg-cyber-green/5',
    yellow: 'border-cyber-yellow/30 bg-cyber-yellow/5',
    orange: 'border-cyber-orange/30 bg-cyber-orange/5',
    teal: 'border-cyber-teal/30 bg-cyber-teal/5',
    cyan: 'border-cyber-cyan/30 bg-cyber-cyan/5',
  };

  return (
    <div className={`cyber-card ${colorMap[color]} p-4 animate-float`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
};

export default StatCards;
