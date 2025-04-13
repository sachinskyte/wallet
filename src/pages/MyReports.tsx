
import React, { useState, useEffect } from 'react';
import { List, Filter, Search, AlertCircle, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the Report type
type Report = {
  id: string;
  title: string;
  description: string;
  company: string;
  risk_level: string;
  status: string;
  created_at: string;
  bounty?: number;
};

const MyReports: React.FC = () => {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch user reports from Supabase
  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setReports(data || []);
      } catch (error: any) {
        console.error('Error fetching reports:', error);
        toast({
          title: "Failed to load reports",
          description: error.message || "There was an error loading your reports",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, [user, toast]);
  
  // Apply search and status filters to reports
  const filteredReports = reports
    .filter(report => 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.company.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(report => statusFilter === 'all' || report.status === statusFilter);

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-cyber-teal/20 text-cyber-teal text-xs font-medium px-2.5 py-0.5 rounded border border-cyber-teal/30">
            My Reports
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white flex items-center">
          <FileText className="h-6 w-6 text-cyber-teal mr-2" />
          My Vulnerability Reports
        </h1>
        <p className="text-gray-400 mt-2">
          Track and manage all your submitted vulnerability reports
        </p>
      </div>
      
      {/* Reports panel */}
      <div className="cyber-panel p-6 mb-6">
        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-6 gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="cyber-input pl-10"
              placeholder="Search by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-cyber-teal" />
            <span className="text-gray-400 text-sm">Status:</span>
            <select
              className="cyber-input py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="verified">Verified</option>
              <option value="fixed">Fixed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        {/* Reports list */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-cyber-teal border-t-transparent rounded-full"></div>
            </div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            // Empty state
            <div className="text-center py-10">
              <AlertCircle className="h-10 w-10 text-gray-500 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-1">No reports found</h3>
              <p className="text-gray-400 text-sm">
                {reports.length === 0
                  ? "You haven't submitted any reports yet"
                  : "No reports match your current filters"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for individual report card
interface ReportCardProps {
  report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  // Status display configurations
  const statusMap = {
    new: {
      color: "border-cyber-blue/30 bg-cyber-blue/5",
      icon: <Clock className="h-4 w-4 text-cyber-blue" />,
      text: "New - Under Review",
    },
    verified: {
      color: "border-cyber-teal/30 bg-cyber-teal/5",
      icon: <CheckCircle className="h-4 w-4 text-cyber-teal" />,
      text: "Verified",
    },
    fixed: {
      color: "border-cyber-green/30 bg-cyber-green/5",
      icon: <CheckCircle className="h-4 w-4 text-cyber-green" />,
      text: "Fixed",
    },
    rejected: {
      color: "border-cyber-red/30 bg-cyber-red/5",
      icon: <XCircle className="h-4 w-4 text-cyber-red" />,
      text: "Rejected",
    },
  };
  
  // Risk level color mapping
  const riskColorMap = {
    critical: "text-cyber-red",
    high: "text-cyber-orange",
    medium: "text-cyber-yellow",
    low: "text-cyber-blue",
    info: "text-cyber-teal",
  };
  
  const status = report.status as keyof typeof statusMap;
  const { color, icon, text } = statusMap[status] || statusMap.new;
  const riskLevel = report.risk_level as keyof typeof riskColorMap;
  
  return (
    <div className={`p-4 rounded-md ${color} border hover:border-opacity-50 transition-all duration-200`}>
      <div className="flex flex-col md:flex-row justify-between">
        {/* Report title and company */}
        <div className="mb-2 md:mb-0">
          <div className="flex items-center mb-1">
            <h3 className="font-bold text-white">{report.title}</h3>
            <span className="ml-2 text-xs font-medium uppercase rounded bg-cyber-light/30 px-1.5 py-0.5">
              <span className={riskColorMap[riskLevel] || riskColorMap.medium}>
                {report.risk_level}
              </span>
            </span>
          </div>
          <p className="text-gray-400 text-sm">{report.company}</p>
        </div>
        
        {/* Status and date */}
        <div className="flex items-center text-sm">
          <div className="flex items-center mr-4">
            {icon}
            <span className="ml-1">{text}</span>
          </div>
          <div className="text-gray-400">
            {new Date(report.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      {/* Report description */}
      <p className="mt-2 text-gray-300 text-sm line-clamp-2">{report.description}</p>
      
      {/* Bounty amount if present */}
      {report.bounty && (
        <div className="mt-3 flex items-center text-cyber-green">
          <span className="text-sm font-medium">Bounty: ${report.bounty.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default MyReports;
