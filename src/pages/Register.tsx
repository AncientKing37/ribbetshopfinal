import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { OptimizedImage } from '@/components/ui/optimized-image';

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
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src="/uploads/register-bg.webp" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-md px-4">
          <AuthForm type="register" />
        </div>
      </div>
    </Layout>
  );
};

export default Register;
