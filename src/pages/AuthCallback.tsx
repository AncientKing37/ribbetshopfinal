
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Exchange the auth code for a session
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error processing authentication callback:', error.message);
        navigate('/login?error=Authentication%20failed');
      } else {
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-blue-dark">
      <div className="cyber-card p-6 md:p-8 max-w-sm mx-auto text-center">
        <Loader2 size={40} className="animate-spin mx-auto text-cyber-purple mb-4" />
        <h2 className="text-xl font-semibold cyber-neon-text mb-2">Processing Login</h2>
        <p className="text-gray-400">Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
