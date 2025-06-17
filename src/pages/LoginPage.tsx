
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user } = useAuth();
  const { profile } = useProfile();

  // Redirect if already logged in
  useEffect(() => {
    if (user && profile) {
      console.log('User logged in, redirecting...', { user: user.email, role: profile.role });
      if (profile.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Attempting login for:', email);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error details:', {
          message: error.message,
          code: error.code,
          status: error.status,
          name: error.name
        });
        
        let errorMessage = 'Login failed';
        
        if (error.code === 'email_not_confirmed') {
          errorMessage = 'Email not confirmed. Please check your email and click the confirmation link, or contact support if email confirmation is disabled.';
        } else if (error.code === 'invalid_credentials') {
          errorMessage = 'Invalid email or password';
        } else {
          errorMessage = error.message || 'An error occurred during login';
        }
        
        toast({ 
          title: 'Login Error', 
          description: errorMessage, 
          variant: 'destructive' 
        });
      } else {
        console.log('Login successful for:', email);
        toast({ title: 'Success', description: 'Login successful!' });
        // Navigation will be handled by the useEffect above
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast({ 
        title: 'Error', 
        description: 'An unexpected error occurred during login', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8fafc', fontFamily: "'Roboto', sans-serif" }}>
      {/* SAIL Header */}
      <nav className="px-4 py-3 shadow-sm" style={{ backgroundColor: '#1f4e79' }}>
        <div className="max-w-7xl mx-auto flex items-center">
          <img 
            src="/lovable-uploads/c236ff4f-87eb-4f83-8c08-9de98c14bf84.png" 
            alt="SAIL Logo" 
            className="h-8 mr-3"
          />
          <span className="text-white text-xl font-bold">SAIL CMS</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/c236ff4f-87eb-4f83-8c08-9de98c14bf84.png" 
                alt="SAIL Logo" 
                className="h-16"
              />
            </div>
            <CardTitle className="text-2xl font-bold" style={{ color: '#1f4e79' }}>
              SAIL Portal Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Complaint Management System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 text-white font-medium" 
                disabled={isLoading}
                style={{ backgroundColor: '#1f4e79' }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium hover:underline" style={{ color: '#1f4e79' }}>
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SAIL Footer */}
      <footer className="py-4 text-center" style={{ backgroundColor: '#1f4e79', color: 'white' }}>
        <p>© 2025 Steel Authority of India Limited</p>
      </footer>
    </div>
  );
};

export default LoginPage;
