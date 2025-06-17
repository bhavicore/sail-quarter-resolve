
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useComplaints } from '@/hooks/useComplaints';

const NewComplaint = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createComplaint } = useComplaints();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('No user found');
      return;
    }

    const complaintData = {
      title: formData.title,
      description: formData.description,
      category: formData.category as any,
      location: formData.location,
    };

    console.log('Submitting complaint:', complaintData);
    createComplaint.mutate(complaintData, {
      onSuccess: () => {
        navigate('/user/dashboard');
      }
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/user/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">New Complaint</h1>
            <p className="text-muted-foreground">Submit a new complaint for your quarter</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Complaint Details</CardTitle>
            <CardDescription>Please fill out all fields to submit your complaint</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Complaint Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Civil Maintenance">Civil Maintenance</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Mess">Mess</SelectItem>
                    <SelectItem value="Guest House">Guest House</SelectItem>
                    <SelectItem value="Admin Block">Admin Block</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Quarter A-101, Room/Area"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed description of the issue..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={createComplaint.isPending}>
                  {createComplaint.isPending ? 'Submitting...' : 'Submit Complaint'}
                </Button>
                <Link to="/user/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewComplaint;
