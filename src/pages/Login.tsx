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
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/uploads/bg1.png" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        {/* Content */}
        <div className="relative z-10 w-full max-w-md px-4 py-20 mx-auto">
          <AuthForm type="login" />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
