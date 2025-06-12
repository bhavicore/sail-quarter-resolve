
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@sail.com' && password === 'admin123') {
        toast({ title: 'Success', description: 'Admin login successful!' });
        navigate('/admin/dashboard');
      } else if (email && password) {
        toast({ title: 'Success', description: 'User login successful!' });
        navigate('/user/dashboard');
      } else {
        toast({ title: 'Error', description: 'Invalid credentials', variant: 'destructive' });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8fafc' }}>
      {/* SAIL Header */}
      <nav className="px-4 py-3 shadow-sm" style={{ backgroundColor: '#1f4e79' }}>
        <div className="max-w-7xl mx-auto flex items-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/SAIL_India_Logo.svg/768px-SAIL_India_Logo.svg.png" 
            alt="SAIL Logo" 
            className="h-8 mr-3"
          />
          <span className="text-white text-xl font-semibold">SAIL CMS</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/SAIL_India_Logo.svg/768px-SAIL_India_Logo.svg.png" 
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
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Demo credentials:</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Admin:</strong> admin@sail.com / admin123</p>
                <p><strong>User:</strong> any email / any password</p>
              </div>
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
