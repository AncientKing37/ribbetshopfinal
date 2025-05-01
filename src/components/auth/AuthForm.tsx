import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface AuthFormProps {
  type: 'login' | 'register';
}

// Login form schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be at most 20 characters'),
  email: z.string().email('Please enter a valid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  // Initialize the appropriate form based on the auth type
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const handleEmailAuth = async (values: LoginFormValues | RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      if (type === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (error) throw error;
        
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        
        navigate('/');
      } else {
        // Registration with additional profile data
        const registerValues = values as RegisterFormValues;
        
        const { error: signUpError, data } = await supabase.auth.signUp({
          email: registerValues.email,
          password: registerValues.password,
          options: {
            data: {
              username: registerValues.username,
              full_name: registerValues.fullName,
            },
          },
        });
        
        if (signUpError) throw signUpError;

        // Ensure profile is created with all fields
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              username: registerValues.username,
              email: registerValues.email,
              full_name: registerValues.fullName,
              credits: 0,
            });

          if (profileError) throw profileError;
        }
        
        toast({
          title: 'Account created!',
          description: 'Your account has been created successfully.',
        });
        
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: 'Authentication error',
        description: error.message || 'An error occurred during authentication',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'twitter' | 'discord') => {
    setSocialLoading(provider);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      setSocialLoading(null);
      toast({
        title: 'Authentication error',
        description: error.message || `Error signing in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
        variant: 'destructive',
      });
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsResettingPassword(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for the password reset link.',
      });
      
      setShowResetPasswordDialog(false);
    } catch (error: any) {
      toast({
        title: 'Password reset failed',
        description: error.message || 'An error occurred while sending the reset password email.',
        variant: 'destructive',
      });
    } finally {
      setIsResettingPassword(false);
    }
  };
  
  const activeForm = type === 'login' ? loginForm : registerForm;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="cyber-card p-6 md:p-8 bg-cyber-blue-dark/90 backdrop-blur-md border border-cyber-purple/20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold cyber-neon-text mb-2">
            {type === 'login' ? 'Login' : 'Create Account'}
          </h1>
          <p className="text-gray-400">
            {type === 'login' 
              ? 'Welcome back! Log in to access your account.' 
              : 'Join RIBBETSHOP and start gifting Fortnite items!'}
          </p>
        </div>
        
        <Form {...activeForm}>
          <form onSubmit={activeForm.handleSubmit(handleEmailAuth)} className="space-y-4">
            {type === 'register' && (
              <>
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Pick a username"
                            className="cyber-input pl-10"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Your full name"
                            className="cyber-input pl-10"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={activeForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        className="cyber-input pl-10"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={activeForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="cyber-input pl-10"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === 'register' && (
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="cyber-input pl-10" 
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {type === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-cyber-purple hover:underline"
                  onClick={() => setShowResetPasswordDialog(true)}
                >
                  Forgot Password?
                </button>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="cyber-button w-full py-5 bg-cyber-purple hover:bg-opacity-80"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {type === 'login' ? 'Logging in...' : 'Creating account...'}
                </div>
              ) : (
                type === 'login' ? 'Login' : 'Create Account'
              )}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-cyber-purple/30"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-cyber-blue-dark px-2 text-gray-400">or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="cyber-button border-cyber-purple/30"
              onClick={() => handleSocialAuth('google')}
              disabled={!!socialLoading}
            >
              {socialLoading === 'google' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26499 14.2949C5.02499 13.5699 4.88499 12.7999 4.88499 11.9999C4.88499 11.1999 5.01999 10.4299 5.26499 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26499 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
              )}
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="cyber-button border-cyber-purple/30"
              onClick={() => handleSocialAuth('twitter')}
              disabled={!!socialLoading}
            >
              {socialLoading === 'twitter' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              )}
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="cyber-button border-cyber-purple/30"
              onClick={() => handleSocialAuth('discord')}
              disabled={!!socialLoading}
            >
              {socialLoading === 'discord' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107a13.94 13.94 0 0 0 1.226 1.993a.076.076 0 0 0 .084.029c1.961-.607 3.95-1.522 6.001-3.03a.077.077 0 0 0 .032-.057c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z" />
                </svg>
              )}
            </Button>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm">
          {type === 'login' ? (
            <>
              Don't have an account?{' '}
              <Link to="/register" className="text-cyber-purple hover:underline">
                Register here
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="text-cyber-purple hover:underline">
                Login here
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent className="cyber-card">
          <DialogHeader>
            <DialogTitle className="cyber-neon-text">Reset Password</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <Input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="cyber-input w-full"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={() => setShowResetPasswordDialog(false)}
                className="cyber-button"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleResetPassword}
                disabled={isResettingPassword}
                className="cyber-button bg-cyber-purple hover:bg-opacity-80"
              >
                {isResettingPassword ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AuthForm;
