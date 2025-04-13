
import React, { useState, useEffect } from 'react';
import { Activity, LineChart, BarChart3, Network, RefreshCcw } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ThreatAnalysisProps {
  totalThreats: number;
  threatTrends: any[];
  attackVectors: any[];
}

const ThreatAnalysis: React.FC<ThreatAnalysisProps> = ({
  totalThreats,
  threatTrends,
  attackVectors
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'vectors'>('trends');
  const [animateCharts, setAnimateCharts] = useState(false);

  // Trigger animation when data changes
  useEffect(() => {
    setAnimateCharts(false);
    const timer = setTimeout(() => setAnimateCharts(true), 100);
    return () => clearTimeout(timer);
  }, [threatTrends, attackVectors]);

  if (totalThreats === 0) {
    return null;
  }

  // Custom styles and colors for charts
  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#14b8a6', '#3b82f6'];

  // Generate random data for the heatmap visualization
  const generateHeatmapData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const times = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    return times.map(time => {
      const result: any = {
        time
      };
      days.forEach(day => {
        // Higher values in working hours, lower in nights and weekends
        let baseValue = 0;
        if (time === '08:00' || time === '12:00' || time === '16:00') {
          baseValue = Math.random() * 10 + 5;
        } else {
          baseValue = Math.random() * 5;
        }
        if (day === 'Sat' || day === 'Sun') {
          baseValue = baseValue * 0.6;
        }
        result[day] = Math.floor(baseValue);
      });
      return result;
    });
  };

  const heatmapData = generateHeatmapData();

  return (
    <div className="cyber-panel p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Activity className="h-5 w-5 mr-2 text-cyber-teal" />
          Threat Analysis
          <span className="ml-2 bg-red-500/20 text-red-300 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
            <span className="h-2 w-2 bg-red-400 rounded-full mr-1 animate-pulse"></span>
            LIVE
          </span>
        </h2>
      </div>
      
      {/* Tabs for switching between visualizations */}
      <div className="flex space-x-2 mb-4 border-b border-cyber-teal/20">
        <button className={`px-4 py-2 ${activeTab === 'trends' ? 'border-b-2 border-cyber-teal text-cyber-teal' : 'text-gray-400'}`} onClick={() => setActiveTab('trends')}>
          <LineChart className="h-4 w-4 inline mr-2" />
          Threat Trends
        </button>
        <button className={`px-4 py-2 ${activeTab === 'vectors' ? 'border-b-2 border-cyber-teal text-cyber-teal' : 'text-gray-400'}`} onClick={() => setActiveTab('vectors')}>
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Attack Vectors
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {activeTab === 'trends' ? (
          <>
            {/* Threat trends over time */}
            <div className="bg-cyber-dark p-4 rounded-md border border-cyber-teal/20">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <LineChart className="h-4 w-4 mr-2 text-cyber-teal" />
                Threat Trends (Last 7 Days)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={threatTrends} margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0
                  }}>
                    <defs>
                      <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <Tooltip contentStyle={{
                      backgroundColor: '#1f2937',
                      borderColor: '#065f46'
                    }} formatter={(value: number) => [value, 'Threats']} />
                    <Area type="monotone" dataKey="high" name="High Severity" stroke="#ef4444" fillOpacity={1} fill="url(#colorHigh)" animationDuration={animateCharts ? 1000 : 0} />
                    <Area type="monotone" dataKey="medium" name="Medium Severity" stroke="#f59e0b" fillOpacity={1} fill="url(#colorMedium)" animationDuration={animateCharts ? 1500 : 0} />
                    <Area type="monotone" dataKey="low" name="Low Severity" stroke="#10b981" fillOpacity={1} fill="url(#colorLow)" animationDuration={animateCharts ? 2000 : 0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Time of day heatmap */}
            <div className="bg-cyber-dark p-4 rounded-md border border-cyber-teal/20">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-cyber-teal" />
                Attack Time Patterns
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={heatmapData} margin={{
                    top: 10,
                    right: 30,
                    left: 50,
                    bottom: 0
                  }}>
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="time" type="category" stroke="#6b7280" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <Tooltip contentStyle={{
                      backgroundColor: '#1f2937',
                      borderColor: '#065f46'
                    }} />
                    <Bar dataKey="Mon" fill="#14b8a6" stackId="stack" animationDuration={animateCharts ? 1000 : 0} />
                    <Bar dataKey="Tue" fill="#0ea5e9" stackId="stack" animationDuration={animateCharts ? 1200 : 0} />
                    <Bar dataKey="Wed" fill="#8b5cf6" stackId="stack" animationDuration={animateCharts ? 1400 : 0} />
                    <Bar dataKey="Thu" fill="#ec4899" stackId="stack" animationDuration={animateCharts ? 1600 : 0} />
                    <Bar dataKey="Fri" fill="#f59e0b" stackId="stack" animationDuration={animateCharts ? 1800 : 0} />
                    <Bar dataKey="Sat" fill="#84cc16" stackId="stack" animationDuration={animateCharts ? 2000 : 0} />
                    <Bar dataKey="Sun" fill="#ef4444" stackId="stack" animationDuration={animateCharts ? 2200 : 0} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Attack vector distribution */}
            <div className="bg-cyber-dark p-4 rounded-md border border-cyber-teal/20">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-cyber-teal" />
                Attack Vector Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attackVectors} margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 40
                  }}>
                    <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={70} />
                    <YAxis stroke="#6b7280" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <Tooltip contentStyle={{
                      backgroundColor: '#1f2937',
                      borderColor: '#065f46'
                    }} />
                    <Bar dataKey="value" fill="#14b8a6" animationDuration={animateCharts ? 2000 : 0} label={{
                      position: 'top',
                      fill: '#9ca3af',
                      fontSize: 10
                    }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Attack vector pie chart */}
            <div className="bg-cyber-dark p-4 rounded-md border border-cyber-teal/20">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Network className="h-4 w-4 mr-2 text-cyber-teal" />
                Proportional Attack Types
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0
                  }}>
                    <Pie 
                      data={attackVectors} 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={80} 
                      dataKey="value" 
                      nameKey="name" 
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
                      labelLine={false} 
                      animationDuration={animateCharts ? 1500 : 0} 
                      animationBegin={animateCharts ? 200 : 0}
                    >
                      {attackVectors.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{
                      backgroundColor: '#1f2937',
                      borderColor: '#065f46'
                    }} />
                    <Legend layout="vertical" verticalAlign="bottom" align="center" wrapperStyle={{
                      paddingTop: '10px'
                    }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ThreatAnalysis;
