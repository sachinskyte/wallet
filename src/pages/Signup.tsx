
import React from 'react';
import SignupForm from '../components/Auth/SignupForm';

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-cyber-dark">
      <SignupForm />
    </div>
  );
};

export default Signup;
