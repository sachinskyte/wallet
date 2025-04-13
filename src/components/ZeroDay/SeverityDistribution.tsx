
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertTriangle, BarChart2 } from 'lucide-react';

interface SeverityDistributionProps {
  totalThreats: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  severityData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const SeverityDistribution: React.FC<SeverityDistributionProps> = ({
  totalThreats,
  highSeverity,
  mediumSeverity,
  lowSeverity,
  severityData
}) => {
  const [animateChart, setAnimateChart] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateChart(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (totalThreats === 0) {
    return null;
  }
  
  const formattedSeverityData = severityData.map(item => ({
    ...item,
    percentage: totalThreats > 0 ? ((item.value / totalThreats) * 100).toFixed(1) + '%' : '0%'
  }));
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <div className="cyber-panel p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
        <BarChart2 className="h-5 w-5 mr-2 text-cyber-teal" />
        Severity Distribution
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cyber-dark p-4 rounded-md border border-cyber-teal/20 h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedSeverityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={animateChart ? 0 : 9999}
                animationDuration={1500}
              >
                {formattedSeverityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#065f46' }}
              />
              <Legend 
                formatter={(value: string) => <span className="text-gray-300">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-6">
          {/* High severity card */}
          <div className="bg-cyber-dark p-4 rounded-md border border-red-500/30 flex items-center animate-fade-in">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mr-4">
              <span className="text-red-400 text-xl font-bold">H</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-1">High Severity</h3>
              <div className="flex justify-between items-center">
                <span className="text-red-400 text-2xl font-bold">{highSeverity}</span>
                <span className="text-gray-400 text-sm">
                  {totalThreats > 0 ? ((highSeverity / totalThreats) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-red-500 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${totalThreats > 0 ? (highSeverity / totalThreats) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Medium severity card */}
          <div className="bg-cyber-dark p-4 rounded-md border border-yellow-500/30 flex items-center animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center mr-4">
              <span className="text-yellow-400 text-xl font-bold">M</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-1">Medium Severity</h3>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400 text-2xl font-bold">{mediumSeverity}</span>
                <span className="text-gray-400 text-sm">
                  {totalThreats > 0 ? ((mediumSeverity / totalThreats) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-yellow-500 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${totalThreats > 0 ? (mediumSeverity / totalThreats) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Low severity card */}
          <div className="bg-cyber-dark p-4 rounded-md border border-green-500/30 flex items-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mr-4">
              <span className="text-green-400 text-xl font-bold">L</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-1">Low Severity</h3>
              <div className="flex justify-between items-center">
                <span className="text-green-400 text-2xl font-bold">{lowSeverity}</span>
                <span className="text-gray-400 text-sm">
                  {totalThreats > 0 ? ((lowSeverity / totalThreats) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${totalThreats > 0 ? (lowSeverity / totalThreats) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeverityDistribution;
