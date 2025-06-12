
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, LogOut, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data - in real app this would come from your Express API
  const [complaints] = useState([
    {
      id: 1,
      title: 'Water Leakage in Kitchen',
      category: 'Plumbing',
      status: 'Pending',
      date: '2024-01-15',
      location: 'Quarter A-101'
    },
    {
      id: 2,
      title: 'Electrical Issue in Bedroom',
      category: 'Electrical',
      status: 'In Progress',
      date: '2024-01-10',
      location: 'Quarter A-101'
    },
    {
      id: 3,
      title: 'Broken Window',
      category: 'Maintenance',
      status: 'Resolved',
      date: '2024-01-05',
      location: 'Quarter A-101'
    }
  ]);

  const handleLogout = () => {
    toast({ title: 'Success', description: 'Logged out successfully!' });
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">User Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Manage your complaints here.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/user/new-complaint">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Complaint
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>My Complaints</CardTitle>
              <CardDescription>Track the status of your submitted complaints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{complaint.title}</h3>
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {complaint.category} • {complaint.location} • {complaint.date}
                      </p>
                    </div>
                    {complaint.status === 'Pending' && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
