import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Show welcome toast and redirect if user is logged in
  useEffect(() => {
    if (user) {
      toast({
        title: "Account created",
        description: "Welcome! Your account has been created successfully.",
      });
      navigate('/');
    }
  }, [user, navigate, toast]);
  
  return (
    <Layout title="Register">
      <div className="relative min-h-[calc(100vh-200px)]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/uploads/common-bg.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-cyber-blue-dark/80 backdrop-blur-sm"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 py-16 flex items-center justify-center">
          <AuthForm type="register" />
        </div>
      </div>
    </Layout>
  );
};

export default Register;
