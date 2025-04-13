
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, AlertCircle, ExternalLink } from 'lucide-react';

type ReportSubmission = {
  id: string;
  title: string;
  company: string;
  website?: string | null;
  vulnerability_type?: string | null;
  affected_urls?: string | null;
  risk_level: string;
  status: string;
  created_at: string;
};

const RecentSubmissions: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isAdmin = user?.id === 'admin-id';

  const { data: recentSubmissions = [], isLoading } = useQuery({
    queryKey: ['userRecentSubmissions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('id, title, company, website, vulnerability_type, affected_urls, risk_level, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        
        return data || [];
      } catch (error: any) {
        console.error('Error fetching recent submissions:', error);
        toast({
          title: "Failed to load recent submissions",
          description: error.message || "There was an error loading your recent submissions",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!user,
    refetchInterval: 10000,
  });

  const viewReportDetails = (reportId: string) => {
    if (isAdmin) {
      navigate(`/admin/report/${reportId}`);
    } else {
      navigate(`/my-reports/${reportId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-cyber-light/20 rounded-md border border-cyber-teal/20 animate-pulse">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Submissions</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-cyber-light/30 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recentSubmissions.length === 0) {
    return (
      <div className="p-4 bg-cyber-light/20 rounded-md border border-cyber-teal/20">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Submissions</h3>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <AlertCircle className="h-10 w-10 text-cyber-teal/50 mb-2" />
          <p className="text-gray-400">No reports submitted yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Your recent vulnerability reports will appear here
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-4 bg-cyber-light/20 rounded-md border border-cyber-teal/20 h-full">
      <h3 className="text-lg font-semibold text-white mb-3">Recent Submissions</h3>
      <div className="space-y-3">
        {recentSubmissions.map((report) => (
          <div 
            key={report.id} 
            className="p-3 bg-cyber-light/30 rounded-md border border-cyber-teal/10 flex items-start animate-fadeIn hover:bg-cyber-light/40 cursor-pointer transition-colors"
            onClick={() => viewReportDetails(report.id)}
          >
            <div className="bg-cyber-teal/20 p-2 rounded-md mr-3">
              <FileText className="h-5 w-5 text-cyber-teal" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">{report.title}</h4>
              <p className="text-xs text-gray-400 truncate">{report.company}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${getRiskLevelColor(report.risk_level)}`}>
                  {report.risk_level.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(report.created_at)}
                </span>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
              report.status === 'new' ? 'bg-blue-500/20 text-blue-300' :
              report.status === 'verified' ? 'bg-yellow-500/20 text-yellow-300' :
              report.status === 'fixed' ? 'bg-green-500/20 text-green-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              {report.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSubmissions;
