
import React from 'react';
import LoginForm from '../components/Auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-cyber-dark">
      <LoginForm />
    </div>
  );
};

export default Login;
