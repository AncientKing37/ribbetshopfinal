import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      navigate('/');
    }
  }, [user, navigate, toast]);
  
  return (
    <Layout title="Login">
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <img 
            src="/uploads/common-bg.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cyber-blue-dark/70 via-cyber-blue-dark/50 to-cyber-blue-dark/70 backdrop-blur-sm"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 py-16 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md px-4">
            <AuthForm type="login" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
