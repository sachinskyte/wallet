import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, FileText, AlertTriangle, Lock, BarChart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SubmittedReports from '../components/Admin/SubmittedReports';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

const Admin: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('reports');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if the current user is the admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsChecking(false);
        navigate('/login');
        return;
      }

      // Check if user is admin
      if (user.id === 'admin-id') {
        setIsAuthorized(true);
        fetchUsers();
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin area",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
      
      setIsChecking(false);
    };
    
    checkAdminStatus();
  }, [user, navigate, toast]);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      // Convert profiles to user format
      const formattedUsers = (profiles || []).map(profile => ({
        id: profile.id,
        name: profile.full_name || 'Unknown',
        email: profile.email || 'No email',
        role: profile.id === 'admin-id' ? 'admin' : 'user',
        status: 'active',
      }));
      
      setUsers(formattedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Failed to load users",
        description: error.message || "There was an error loading users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <div className="animate-spin h-8 w-8 border-4 border-cyber-teal border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // User is already being redirected
  }

  return (
    <div className="p-4 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-red-500/20 text-red-300 text-xs font-medium px-2.5 py-0.5 rounded border border-red-500/30">
            Admin
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Shield className="h-6 w-6 text-red-400 mr-2" />
          Admin Control Panel
        </h1>
        <p className="text-gray-400 mt-2">
          Manage reports, users, and system settings
        </p>
      </div>
      
      <div className="cyber-panel p-6 mb-6">
        <div className="flex flex-wrap gap-2 mb-6 border-b border-cyber-teal/20 pb-4">
          <button 
            className={`${activeTab === 'reports' ? 'bg-cyber-teal text-white' : 'hover:bg-cyber-teal/20 text-gray-300'} px-4 py-2 rounded-md flex items-center`}
            onClick={() => setActiveTab('reports')}
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>Submitted Reports</span>
          </button>
          <button 
            className={`${activeTab === 'users' ? 'bg-cyber-teal text-white' : 'hover:bg-cyber-teal/20 text-gray-300'} px-4 py-2 rounded-md flex items-center`}
            onClick={() => setActiveTab('users')}
          >
            <Users className="h-4 w-4 mr-2" />
            <span>Users</span>
          </button>
          <button 
            className={`${activeTab === 'security' ? 'bg-cyber-teal text-white' : 'hover:bg-cyber-teal/20 text-gray-300'} px-4 py-2 rounded-md flex items-center`}
            onClick={() => setActiveTab('security')}
          >
            <Lock className="h-4 w-4 mr-2" />
            <span>Security</span>
          </button>
          <button 
            className={`${activeTab === 'analytics' ? 'bg-cyber-teal text-white' : 'hover:bg-cyber-teal/20 text-gray-300'} px-4 py-2 rounded-md flex items-center`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart className="h-4 w-4 mr-2" />
            <span>Analytics</span>
          </button>
        </div>
        
        {activeTab === 'reports' && (
          <SubmittedReports />
        )}
        
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Registered Users</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-cyber-teal border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-cyber-light/20 text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">ID</th>
                      <th scope="col" className="px-6 py-3">Name</th>
                      <th scope="col" className="px-6 py-3">Email</th>
                      <th scope="col" className="px-6 py-3">Role</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-cyber-teal/10">
                        <td className="px-6 py-4">{user.id.substring(0, 8)}</td>
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-red-500/20 text-red-300' : 
                            user.role === 'hacker' ? 'bg-cyber-teal/20 text-cyber-teal' : 
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' ? 'bg-green-500/20 text-green-300' : 
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-cyber-teal hover:text-cyber-cyan mr-2">Edit</button>
                          <button className="text-red-400 hover:text-red-300">Disable</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'security' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Security Settings</h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-cyber-teal/20 rounded-md bg-cyber-dark">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                    <p className="text-gray-400 text-sm">Require 2FA for all admin users</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" checked disabled />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-teal"></div>
                  </label>
                </div>
              </div>
              
              <div className="p-4 border border-cyber-teal/20 rounded-md bg-cyber-dark">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">Email Verification</h3>
                    <p className="text-gray-400 text-sm">Require email verification for new accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-teal"></div>
                  </label>
                </div>
              </div>
              
              <div className="p-4 border border-cyber-teal/20 rounded-md bg-cyber-dark">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">API Rate Limiting</h3>
                    <p className="text-gray-400 text-sm">Set rate limits for API endpoints</p>
                  </div>
                  <button className="cyber-button-outline text-sm">Configure</button>
                </div>
              </div>
              
              <div className="p-4 border border-red-500/20 rounded-md bg-red-950/20">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
                      Emergency Access
                    </h3>
                    <p className="text-gray-400 text-sm">Allow temporary unrestricted access</p>
                  </div>
                  <button className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-3 py-1 rounded text-sm">Enable</button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Platform Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-cyber-light/10 border border-cyber-teal/20 rounded-md">
                <h3 className="text-lg font-medium text-white mb-2">Report Submissions</h3>
                <div className="h-40 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyber-teal">14</p>
                    <p className="text-sm text-gray-400">Reports this month</p>
                    <p className="text-xs text-green-400 mt-1">↑ 23% from last month</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-cyber-light/10 border border-cyber-teal/20 rounded-md">
                <h3 className="text-lg font-medium text-white mb-2">User Growth</h3>
                <div className="h-40 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyber-teal">7</p>
                    <p className="text-sm text-gray-400">New users this month</p>
                    <p className="text-xs text-green-400 mt-1">↑ 16% from last month</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-cyber-light/10 border border-cyber-teal/20 rounded-md">
                <h3 className="text-lg font-medium text-white mb-2">Critical Vulnerabilities</h3>
                <div className="h-40 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">3</p>
                    <p className="text-sm text-gray-400">Critical reports pending</p>
                    <p className="text-xs text-yellow-400 mt-1">Requires immediate attention</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-cyber-light/10 border border-cyber-teal/20 rounded-md">
                <h3 className="text-lg font-medium text-white mb-2">Total Payouts</h3>
                <div className="h-40 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyber-teal">$3,750</p>
                    <p className="text-sm text-gray-400">Paid to researchers</p>
                    <p className="text-xs text-green-400 mt-1">5 bounties awarded</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
