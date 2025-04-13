
import React from 'react';
import StatCards from '../components/Dashboard/StatCards';
import VulnerabilityFeed from '../components/Dashboard/VulnerabilityFeed';
import RecentSubmissions from '../components/Dashboard/RecentSubmissions';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileUp, Shield, Bell, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Import the RiskLevel type from VulnerabilityFeed to ensure consistency
import { RiskLevel, VulnerabilityStatus } from '../components/Dashboard/VulnerabilityFeed';

// Dashboard page component - no longer needs MainLayout wrapper since App.tsx handles it
const Dashboard: React.FC = () => {
  const { profile, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get the correct user display name
  const displayName = profile?.full_name || user?.email || 'User';

  // Helper function to validate risk level
  const validateRiskLevel = (risk: string): RiskLevel => {
    const validRiskLevels: RiskLevel[] = ['critical', 'high', 'medium', 'low', 'info'];
    return validRiskLevels.includes(risk as RiskLevel) 
      ? (risk as RiskLevel) 
      : 'medium';
  };

  // Helper function to validate status
  const validateStatus = (status: string): VulnerabilityStatus => {
    const validStatuses: VulnerabilityStatus[] = ['new', 'verified', 'fixed', 'rejected'];
    return validStatuses.includes(status as VulnerabilityStatus) 
      ? (status as VulnerabilityStatus) 
      : 'new';
  };

  // Fetch recent reports for the feed using React Query for automatic re-fetching
  const { data: recentReports = [], isLoading: isLoadingReports } = useQuery({
    queryKey: ['recentReports'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching recent reports:', error);
        toast({
          title: "Error fetching reports",
          description: error.message,
          variant: "destructive"
        });
        throw new Error(error.message);
      }
      
      // Transform the data to match expected types
      return (data || []).map(report => ({
        id: report.id,
        title: report.title,
        company: report.company,
        risk_level: validateRiskLevel(report.risk_level),
        status: validateStatus(report.status),
        submitter_name: report.submitter_name,
        created_at: report.created_at,
        description: report.description
      }));
    },
    enabled: !!user, // Only run query if user is logged in
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Subscribe to real-time report updates
  React.useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('dashboard-reports')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reports' 
      }, () => {
        // Just trigger a refetch when data changes
        console.info('Report change detected, refreshing data...');
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Fetch user's personal reports count and bounties
  const { data: userStats = { reportsCount: 0, totalBounty: 0 }, isLoading: isLoadingUserStats } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user) return { reportsCount: 0, totalBounty: 0 };
      
      try {
        // Get reports count for this user
        const { data: userReports, error: countError } = await supabase
          .from('reports')
          .select('id, bounty')
          .eq('user_id', user.id);
          
        if (countError) throw countError;
        
        // Calculate total bounty for this user
        const totalBounty = userReports
          ? userReports.reduce((sum, report) => sum + (Number(report.bounty) || 0), 0)
          : 0;
        
        return { 
          reportsCount: userReports?.length || 0,
          totalBounty
        };
      } catch (error: any) {
        console.error('Error fetching user stats:', error);
        return { reportsCount: 0, totalBounty: 0 };
      }
    },
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
  });
  
  return (
    <div className="p-4 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-white">Security Dashboard</h1>
      
      {!isLoading && (
        <div className="cyber-panel p-4 mb-6">
          <h2 className="text-xl text-white mb-2">
            Welcome, <span className="text-cyber-teal">{displayName}</span>!
          </h2>
          <p className="text-gray-300 mb-4">
            Your personal security dashboard is ready. Track vulnerabilities and manage your reports from here.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              className="bg-cyber-teal hover:bg-cyber-teal/80 text-white"
              onClick={() => navigate('/submit-report')}
            >
              <FileUp className="mr-2 h-4 w-4" />
              Submit New Report
            </Button>
            
            <Button 
              variant="outline"
              className="border-cyber-teal text-cyber-teal hover:bg-cyber-teal/10"
              onClick={() => navigate('/my-reports')}
            >
              <Shield className="mr-2 h-4 w-4" />
              My Reports
            </Button>
            
            <Button 
              variant="ghost"
              className="text-cyber-teal hover:bg-cyber-teal/10"
              onClick={() => navigate('/settings')}
            >
              <Bell className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      )}
      
      {/* Quick stats for vulnerability overview */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Vulnerability Overview</h3>
        <StatCards />
      </div>
      
      {/* User personal stats */}
      {user && !isLoadingUserStats && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-cyber-light/20 rounded-md border border-cyber-teal/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Your Reports</p>
                  <p className="text-2xl font-bold text-white">{userStats.reportsCount}</p>
                </div>
                <Shield className="h-8 w-8 text-cyber-teal/60" />
              </div>
            </div>
            
            <div className="p-4 bg-cyber-light/20 rounded-md border border-cyber-teal/20">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-400">Your Earned Bounties</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Bounties awarded for your verified reports</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-2xl font-bold text-white">${userStats.totalBounty.toLocaleString()}</p>
                </div>
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-cyber-teal/20 text-cyber-teal font-bold">$</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Grid layout for dashboard sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Latest reports from the user */}
        <div className="lg:col-span-1">
          <RecentSubmissions />
        </div>
        
        {/* Recent vulnerability feed spanning 2 columns */}
        <div className="lg:col-span-2">
          <VulnerabilityFeed reports={recentReports} isLoading={isLoadingReports} />
        </div>
      </div>
      
      {/* Security tips section */}
      <div className="cyber-panel p-4 border-cyber-teal/30">
        <h3 className="text-lg font-semibold text-white mb-2">Security Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div className="p-3 bg-cyber-light/30 rounded-md border border-cyber-teal/10">
            <h4 className="text-cyber-teal text-sm font-medium mb-1">Documentation Matters</h4>
            <p className="text-xs">Detailed vulnerability reports with clear steps to reproduce increase chances of verification and bounties.</p>
          </div>
          <div className="p-3 bg-cyber-light/30 rounded-md border border-cyber-teal/10">
            <h4 className="text-cyber-teal text-sm font-medium mb-1">Responsible Disclosure</h4>
            <p className="text-xs">Always follow company disclosure policies and wait for fixes before publicly sharing details.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
