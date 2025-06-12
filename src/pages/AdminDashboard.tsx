
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { LogOut, Filter, Search, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('All');

  // Mock data with realistic Indian PSU context
  const [complaints] = useState([
    {
      id: 1,
      title: 'Water Supply Disruption in Kitchen',
      category: 'Plumbing',
      status: 'Pending',
      date: '2025-01-15',
      location: 'Quarter Type-III A-101',
      user: 'Rajesh Kumar',
      description: 'Water taps in kitchen not working since morning'
    },
    {
      id: 2,
      title: 'Power Socket Issue in Study Room',
      category: 'Electrical',
      status: 'In Progress',
      date: '2025-01-10',
      location: 'Quarter Type-II B-205',
      user: 'Priya Sharma',
      description: 'Power socket near study table not functioning properly'
    },
    {
      id: 3,
      title: 'Window Glass Repair Required',
      category: 'Civil Maintenance',
      status: 'Resolved',
      date: '2025-01-05',
      location: 'Quarter Type-IV C-301',
      user: 'Anjali Das',
      description: 'Living room window glass panel cracked due to weather'
    },
    {
      id: 4,
      title: 'AC Not Cooling Properly',
      category: 'Electrical',
      status: 'Pending',
      date: '2025-01-12',
      location: 'Guest House Room 102',
      user: 'Ravi Iyer',
      description: 'Air conditioning unit not providing adequate cooling'
    },
    {
      id: 5,
      title: 'Bathroom Drainage Issue',
      category: 'Plumbing',
      status: 'In Progress',
      date: '2025-01-08',
      location: 'Quarter Type-I D-401',
      user: 'Suresh Patel',
      description: 'Bathroom drain blocked causing water overflow'
    },
    {
      id: 6,
      title: 'Food Quality Complaint',
      category: 'Mess',
      status: 'Pending',
      date: '2025-01-14',
      location: 'Main Mess Hall',
      user: 'Kavita Singh',
      description: 'Food served at lunch was not properly cooked'
    },
    {
      id: 7,
      title: 'Office AC Temperature Control',
      category: 'Electrical',
      status: 'Resolved',
      date: '2025-01-03',
      location: 'Admin Block - 3rd Floor',
      user: 'Amit Gupta',
      description: 'Central AC temperature control not working in office area'
    },
    {
      id: 8,
      title: 'Guest Room Cleaning Issue',
      category: 'Guest House',
      status: 'In Progress',
      date: '2025-01-11',
      location: 'Guest House Room 205',
      user: 'Deepak Verma',
      description: 'Room not properly cleaned and maintained'
    }
  ]);

  const handleLogout = () => {
    toast({ title: 'Success', description: 'Logged out successfully!' });
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Analytics calculations
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    
    const categoryStats = complaints.reduce((acc, complaint) => {
      acc[complaint.category] = (acc[complaint.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, pending, inProgress, resolved, categoryStats };
  }, [complaints]);

  // Filtering logic
  const filteredComplaints = useMemo(() => {
    return complaints
      .filter(complaint => {
        const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
        const matchesCategory = categoryFilter === 'All' || complaint.category === categoryFilter;
        const matchesSearch = searchTerm === '' || 
          complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesStatus && matchesCategory && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [complaints, statusFilter, categoryFilter, searchTerm]);

  // Chart data
  const statusChartData = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [stats.pending, stats.inProgress, stats.resolved],
        backgroundColor: ['#fbbf24', '#3b82f6', '#10b981'],
        borderColor: ['#f59e0b', '#2563eb', '#059669'],
        borderWidth: 2,
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(stats.categoryStats),
    datasets: [
      {
        label: 'Complaints by Category',
        data: Object.values(stats.categoryStats),
        backgroundColor: '#1f4e79',
        borderColor: '#1e40af',
        borderWidth: 1,
      },
    ],
  };

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
          <Button variant="outline" onClick={handleLogout} className="bg-white text-gray-800 border-white hover:bg-gray-100">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage SAIL Quarter & Facility Complaints</p>
        </div>

        {/* Stats Cards */}
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Complaints by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Doughnut 
                  data={statusChartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} 
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Complaints by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar 
                  data={categoryChartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Civil Maintenance">Civil Maintenance</SelectItem>
                    <SelectItem value="Mess">Mess</SelectItem>
                    <SelectItem value="Guest House">Guest House</SelectItem>
                    <SelectItem value="Admin Block">Admin Block</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStatusFilter('All');
                    setCategoryFilter('All');
                    setSearchTerm('');
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <Card>
          <CardHeader>
            <CardTitle>All Complaints ({filteredComplaints.length})</CardTitle>
            <CardDescription>Manage and update complaint statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
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
                        <p><strong>Date:</strong> {complaint.date}</p>
                        <p><strong>Submitted by:</strong> {complaint.user}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Select
                        value={complaint.status}
                        onValueChange={(value) => {
                          toast({ title: 'Success', description: `Complaint status updated to ${value}` });
                        }}
                      >
                        <SelectTrigger className="w-36">
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

      {/* SAIL Footer */}
      <footer className="mt-12 py-6 text-center" style={{ backgroundColor: '#1f4e79', color: 'white' }}>
        <p>© 2025 Steel Authority of India Limited</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
