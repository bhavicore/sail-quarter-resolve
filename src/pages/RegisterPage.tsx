
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({ title: 'Success', description: 'Account created successfully!' });
      navigate('/login');
      setIsLoading(false);
    }, 1000);
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
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Register for SAIL Complaint System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium hover:underline" style={{ color: '#1f4e79' }}>
                  Sign in here
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

export default RegisterPage;
