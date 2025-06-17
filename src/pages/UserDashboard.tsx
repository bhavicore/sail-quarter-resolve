import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, LogOut, Edit, Trash2, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useComplaints } from '@/hooks/useComplaints';
import { useProfile } from '@/hooks/useProfile';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile } = useProfile();
  const { userComplaints, isLoading } = useComplaints();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Navigate anyway since local state is cleared
      navigate('/login');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate stats
  const stats = {
    total: userComplaints.length,
    pending: userComplaints.filter(c => c.status === 'Pending').length,
    inProgress: userComplaints.filter(c => c.status === 'In Progress').length,
    resolved: userComplaints.filter(c => c.status === 'Resolved').length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc', fontFamily: "'Roboto', sans-serif" }}>
      {/* SAIL Header */}
      <nav className="px-4 py-3 shadow-sm" style={{ backgroundColor: '#1f4e79' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/c236ff4f-87eb-4f83-8c08-9de98c14bf84.png" 
              alt="SAIL Logo" 
              className="h-8 mr-3"
            />
            <span className="text-white text-xl font-bold">SAIL CMS</span>
          </div>
          <div className="flex gap-3">
            <Link to="/user/new-complaint">
              <Button className="bg-white text-gray-800 hover:bg-gray-100">
                <Plus className="h-4 w-4 mr-2" />
                New Complaint
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="bg-white text-gray-800 border-white hover:bg-gray-100">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name || user?.email}!</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                  <p className="text-gray-600 text-sm">Total Complaints</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                  <p className="text-gray-600 text-sm">Pending</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
                  <p className="text-gray-600 text-sm">In Progress</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
                  <p className="text-gray-600 text-sm">Resolved</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>My Complaints</CardTitle>
            <CardDescription>Track the status of your submitted complaints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userComplaints.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No complaints submitted yet.</p>
                  <Link to="/user/new-complaint">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Your First Complaint
                    </Button>
                  </Link>
                </div>
              ) : (
                userComplaints.map((complaint) => (
                  <div key={complaint.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{complaint.title}</h3>
                          <Badge className={`${getStatusColor(complaint.status)} border`}>
                            {complaint.status}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-2">{complaint.description}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p><strong>Category:</strong> {complaint.category}</p>
                          <p><strong>Location:</strong> {complaint.location}</p>
                          <p><strong>Date:</strong> {new Date(complaint.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {complaint.status === 'Pending' && (
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm" className="hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SAIL Footer */}
      <footer className="mt-12 py-6 text-center" style={{ backgroundColor: '#1f4e79', color: 'white' }}>
        <p>© 2025 Steel Authority of India Limited</p>
      </footer>
    </div>
  );
};

export default UserDashboard;
