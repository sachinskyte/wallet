
import React, { useState } from 'react';
import { FileUp, AlertTriangle, CheckCircle2, Globe, Building, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SubmitReport: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [vulnerabilityType, setVulnerabilityType] = useState('');
  const [affectedUrls, setAffectedUrls] = useState('');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a report",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get the user's actual display name from profile or fallback to email
      const submitterName = profile?.full_name || user.email || 'Unknown User';
      
      // Submit the report to Supabase
      const { data, error } = await supabase
        .from('reports')
        .insert({
          title,
          description,
          company,
          website,
          vulnerability_type: vulnerabilityType,
          affected_urls: affectedUrls,
          risk_level: riskLevel,
          user_id: user.id,
          submitter_name: submitterName,
          status: 'new',
        });
      
      if (error) throw error;
      
      toast({
        title: "Report Submitted",
        description: "Your vulnerability report has been submitted successfully",
      });
      
      setIsSuccess(true);
      
      // Reset form after showing success
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setCompany('');
        setWebsite('');
        setVulnerabilityType('');
        setAffectedUrls('');
        setRiskLevel('medium');
        setFiles(null);
        setIsSuccess(false);
        navigate('/my-reports');
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your report",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-cyber-teal/20 text-cyber-teal text-xs font-medium px-2.5 py-0.5 rounded border border-cyber-teal/30">
            New Report
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white flex items-center">
          <AlertTriangle className="h-6 w-6 text-cyber-teal mr-2" />
          Submit Website Vulnerability Report
        </h1>
        <p className="text-gray-400 mt-2">
          Submit detailed information about the website vulnerability you've discovered.
          Be specific and include steps to reproduce.
        </p>
      </div>
      
      <div className="cyber-panel p-6">
        {isSuccess ? (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center p-2 bg-cyber-green/20 rounded-full mb-4">
              <CheckCircle2 className="h-10 w-10 text-cyber-green" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Report Submitted Successfully!</h2>
            <p className="text-gray-400">
              Thank you for your contribution. Our security team will review your report.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Vulnerability Title <span className="text-cyber-red">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="cyber-input"
                placeholder="Give your vulnerability a clear, descriptive title"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                  Affected Company <span className="text-cyber-red">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Building className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="cyber-input pl-10"
                    placeholder="Company or organization name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
                  Website URL <span className="text-cyber-red">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Globe className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="cyber-input pl-10"
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vulnerability-type" className="block text-sm font-medium text-gray-300 mb-1">
                  Vulnerability Type <span className="text-cyber-red">*</span>
                </label>
                <select
                  id="vulnerability-type"
                  value={vulnerabilityType}
                  onChange={(e) => setVulnerabilityType(e.target.value)}
                  className="cyber-input"
                  required
                >
                  <option value="">Select vulnerability type</option>
                  <option value="XSS">Cross-Site Scripting (XSS)</option>
                  <option value="SQLi">SQL Injection</option>
                  <option value="CSRF">Cross-Site Request Forgery (CSRF)</option>
                  <option value="IDOR">Insecure Direct Object Reference (IDOR)</option>
                  <option value="RCE">Remote Code Execution (RCE)</option>
                  <option value="SSRF">Server-Side Request Forgery (SSRF)</option>
                  <option value="Auth">Authentication Bypass</option>
                  <option value="LFI">Local File Inclusion</option>
                  <option value="XXE">XML External Entity (XXE)</option>
                  <option value="BugLogic">Business Logic Vulnerability</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="risk-level" className="block text-sm font-medium text-gray-300 mb-1">
                  Risk Level <span className="text-cyber-red">*</span>
                </label>
                <select
                  id="risk-level"
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value)}
                  className="cyber-input"
                  required
                >
                  <option value="critical">Critical - Severe impact, easy to exploit</option>
                  <option value="high">High - Significant impact or easy to exploit</option>
                  <option value="medium">Medium - Moderate impact and exploitability</option>
                  <option value="low">Low - Limited impact or difficult to exploit</option>
                  <option value="info">Info - Informational findings</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="affected-urls" className="block text-sm font-medium text-gray-300 mb-1">
                Affected URLs
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Link className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="affected-urls"
                  type="text"
                  value={affectedUrls}
                  onChange={(e) => setAffectedUrls(e.target.value)}
                  className="cyber-input pl-10"
                  placeholder="https://example.com/vulnerable-page, https://example.com/another-page"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">If multiple URLs are affected, separate them with commas</p>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Detailed Description <span className="text-cyber-red">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="cyber-input h-40"
                placeholder="Describe the vulnerability in detail. Include steps to reproduce, impact, and any other relevant information."
                required
              />
            </div>
            
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-1">
                Supporting Files
              </label>
              <div className="border border-dashed border-cyber-teal/30 rounded-md p-4 text-center cursor-pointer hover:bg-cyber-teal/5 transition-colors">
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => setFiles(e.target.files)}
                />
                <div className="flex flex-col items-center justify-center py-4">
                  <FileUp className="h-10 w-10 text-cyber-teal/70 mb-2" />
                  <p className="text-sm text-gray-300 mb-1">
                    Drag and drop files here, or click to select files
                  </p>
                  <p className="text-xs text-gray-400">
                    Screenshots, proof of concept files, videos (max 10MB each)
                  </p>
                  {files && files.length > 0 && (
                    <div className="mt-3 text-left w-full">
                      <p className="text-sm text-cyber-teal">Selected files:</p>
                      <ul className="text-xs text-gray-400 list-disc list-inside">
                        {Array.from(files).map((file, i) => (
                          <li key={i}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <label htmlFor="file-upload" className="cyber-button-outline text-sm py-1 px-3 inline-block mt-2">
                  Select Files
                </label>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                className="h-4 w-4 bg-cyber-light border-cyber-teal/30 rounded text-cyber-teal focus:ring-cyber-teal"
                required
              />
              <label htmlFor="agree" className="ml-2 block text-sm text-gray-400">
                I confirm this report is accurate and does not contain any personal or sensitive data.
              </label>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="cyber-button py-2 px-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span>Submit Report</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubmitReport;
