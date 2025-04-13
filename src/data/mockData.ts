// Mock User Roles
export type UserRole = 'hacker' | 'security' | 'admin';

// Mock User Data
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Morgan',
  email: 'alex@sentryl.com',
  role: 'hacker',
  avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Alex',
};

// Mock Vulnerability Risk Levels
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Mock Vulnerability Status
export type VulnerabilityStatus = 'new' | 'verified' | 'fixed' | 'rejected';

// Mock Vulnerability Data
export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  company: string;
  riskLevel: RiskLevel;
  status: VulnerabilityStatus;
  dateSubmitted: string;
  bounty?: number;
}

export const vulnerabilities: Vulnerability[] = [
  {
    id: 'vuln-1',
    title: 'SQL Injection in Login Form',
    description: 'Found a SQL injection vulnerability in the login form that allows authentication bypass.',
    submittedBy: 'user-1',
    company: 'TechCorp',
    riskLevel: 'critical',
    status: 'verified',
    dateSubmitted: '2023-09-15T10:30:00Z',
    bounty: 5000,
  },
  {
    id: 'vuln-2',
    title: 'Cross-Site Scripting in Profile Page',
    description: 'XSS vulnerability in user profile that allows arbitrary JavaScript execution.',
    submittedBy: 'user-1',
    company: 'SecureBank',
    riskLevel: 'high',
    status: 'new',
    dateSubmitted: '2023-09-18T14:45:00Z',
  },
  {
    id: 'vuln-3',
    title: 'Insecure Direct Object Reference',
    description: 'IDOR vulnerability allows accessing other users\' data by manipulating API endpoints.',
    submittedBy: 'user-3',
    company: 'CloudSystems',
    riskLevel: 'high',
    status: 'fixed',
    dateSubmitted: '2023-09-10T09:15:00Z',
    bounty: 3000,
  },
  {
    id: 'vuln-4',
    title: 'Missing Rate Limiting on API',
    description: 'No rate limiting on authentication API allows brute force attacks.',
    submittedBy: 'user-2',
    company: 'DataSafe',
    riskLevel: 'medium',
    status: 'verified',
    dateSubmitted: '2023-09-14T11:20:00Z',
    bounty: 1000,
  },
  {
    id: 'vuln-5',
    title: 'Sensitive Information in Error Messages',
    description: 'Error messages reveal sensitive system information that could aid attackers.',
    submittedBy: 'user-1',
    company: 'TechCorp',
    riskLevel: 'low',
    status: 'new',
    dateSubmitted: '2023-09-17T16:30:00Z',
  },
  {
    id: 'vuln-6',
    title: 'Insecure Deserialization',
    description: 'Found an insecure deserialization vulnerability that allows code execution.',
    submittedBy: 'user-4',
    company: 'CloudSystems',
    riskLevel: 'critical',
    status: 'new',
    dateSubmitted: '2023-09-19T08:45:00Z',
  },
  {
    id: 'vuln-7',
    title: 'CSRF in Account Settings',
    description: 'Cross-Site Request Forgery vulnerability in account settings allows attackers to change user email.',
    submittedBy: 'user-2',
    company: 'SecureBank',
    riskLevel: 'medium',
    status: 'rejected',
    dateSubmitted: '2023-09-13T13:10:00Z',
  },
];

// Mock Bug Bounty Programs
export interface BountyProgram {
  id: string;
  company: string;
  logo: string;
  description: string;
  minBounty: number;
  maxBounty: number;
  scope: string[];
  isActive: boolean;
}

export const bountyPrograms: BountyProgram[] = [
  {
    id: 'bounty-1',
    company: 'TechCorp',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TechCorp',
    description: 'TechCorp is seeking vulnerabilities in their cloud infrastructure and web applications.',
    minBounty: 500,
    maxBounty: 10000,
    scope: ['Web Applications', 'API Endpoints', 'Mobile Apps'],
    isActive: true,
  },
  {
    id: 'bounty-2',
    company: 'SecureBank',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=SecureBank',
    description: 'Find security issues in SecureBank\'s online banking platform and mobile applications.',
    minBounty: 1000,
    maxBounty: 20000,
    scope: ['Online Banking', 'Mobile Banking App', 'Payment Gateway'],
    isActive: true,
  },
  {
    id: 'bounty-3',
    company: 'CloudSystems',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=CloudSystems',
    description: 'Help us secure our cloud infrastructure services by finding vulnerabilities.',
    minBounty: 750,
    maxBounty: 15000,
    scope: ['Cloud Dashboard', 'API Services', 'Container Security'],
    isActive: true,
  },
  {
    id: 'bounty-4',
    company: 'DataSafe',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=DataSafe',
    description: 'Looking for security issues in our data protection services and backup systems.',
    minBounty: 500,
    maxBounty: 8000,
    scope: ['Web Dashboard', 'Backup Services', 'Data Encryption'],
    isActive: false,
  },
];

// Stats for dashboard
export const dashboardStats = {
  totalVulnerabilities: 243,
  criticalVulnerabilities: 18,
  verifiedVulnerabilities: 156,
  totalBountyPaid: 873500,
  activeBountyPrograms: 27,
};
