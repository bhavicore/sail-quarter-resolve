
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState('All');

  // Mock data - in real app this would come from your Express API
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: 'Water Leakage in Kitchen',
      category: 'Plumbing',
      status: 'Pending',
      date: '2024-01-15',
      location: 'Quarter A-101',
      user: 'John Doe'
    },
    {
      id: 2,
      title: 'Electrical Issue in Bedroom',
      category: 'Electrical',
      status: 'In Progress',
      date: '2024-01-10',
      location: 'Quarter B-205',
      user: 'Jane Smith'
    },
    {
      id: 3,
      title: 'Broken Window',
      category: 'Maintenance',
      status: 'Resolved',
      date: '2024-01-05',
      location: 'Quarter C-301',
      user: 'Bob Johnson'
    },
    {
      id: 4,
      title: 'Air Conditioner Not Working',
      category: 'Electrical',
      status: 'Pending',
      date: '2024-01-12',
      location: 'Quarter A-102',
      user: 'Alice Brown'
    }
  ]);

  const handleLogout = () => {
    toast({ title: 'Success', description: 'Logged out successfully!' });
    navigate('/login');
  };

  const handleStatusUpdate = (complaintId: number, newStatus: string) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, status: newStatus }
        : complaint
    ));
    toast({ title: 'Success', description: `Complaint status updated to ${newStatus}` });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredComplaints = statusFilter === 'All' 
    ? complaints 
    : complaints.filter(complaint => complaint.status === statusFilter);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all SAIL complaints</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Complaints</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Complaints List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>All Complaints</CardTitle>
                <CardDescription>Manage and update complaint statuses</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{complaint.title}</h3>
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {complaint.category} • {complaint.location} • {complaint.date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Submitted by: {complaint.user}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Select
                        value={complaint.status}
                        onValueChange={(value) => handleStatusUpdate(complaint.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
