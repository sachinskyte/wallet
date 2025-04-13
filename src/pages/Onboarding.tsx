
import React from 'react';
import OnboardingForm from '../components/Auth/OnboardingForm';

const Onboarding: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-cyber-dark">
      <OnboardingForm />
    </div>
  );
};

export default Onboarding;
