import { RiskLevel, VulnerabilityStatus } from '@/data/mockData';

// Generate a random avatar from the 5 available options
export const getRandomAvatar = (): string => {
  const options = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5'];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
};

// Sample bios for demo profiles
const sampleBios = [
  "Security researcher with 5+ years of experience finding vulnerabilities in web applications.",
  "Ethical hacker passionate about helping companies improve their security posture.",
  "Bug bounty hunter with specialization in API security and authentication bypasses.",
  "Cybersecurity professional focused on identifying critical vulnerabilities in financial systems.",
  "Security enthusiast with a knack for discovering critical vulnerabilities in complex systems."
];

// Get a random bio
export const getRandomBio = (): string => {
  const randomIndex = Math.floor(Math.random() * sampleBios.length);
  return sampleBios[randomIndex];
};

// Sample names for demo profiles
const sampleNames = [
  "Alex Morgan",
  "Jamie Chen",
  "Taylor Reed",
  "Jordan Smith",
  "Casey Williams"
];

// Get a random name
export const getRandomName = (): string => {
  const randomIndex = Math.floor(Math.random() * sampleNames.length);
  return sampleNames[randomIndex];
};

// Generate a demo profile with random values
export const generateDemoProfile = () => {
  return {
    id: 'demo-user',
    full_name: getRandomName(),
    bio: getRandomBio(),
    email: 'demo@sentryl.com',
    avatar_url: getRandomAvatar(),
  };
};
