import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AfricanPattern } from "@/components/africanPatterns";
import { 
  User, 
  Home, 
  Users, 
  MessageSquare, 
  Clock, 
  Check, 
  X, 
  LogOut, 
  BarChart3, 
  Settings, 
  BellRing, 
  LayoutDashboard,
  Shield
} from "lucide-react";
import { Property, User as UserType, Waitlist } from "@shared/schema";

const AdminDashboard = () => {
  const [, navigate] = useLocation();
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  
  // Redirect if not logged in or not an admin
  if (!isAuthLoading && !user) {
    navigate("/login");
    return null;
  }
  
  if (!isAuthLoading && user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }
  
  // Fetch properties awaiting approval
  const { data: pendingProperties, isLoading: isPropertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties?isApproved=false'],
    enabled: !!user,
  });
  
  // Fetch users
  const { data: users, isLoading: isUsersLoading } = useQuery<UserType[]>({
    queryKey: ['/api/admin/users'],
    enabled: !!user,
  });
  
  // Fetch waitlist entries
  const { data: waitlist, isLoading: isWaitlistLoading } = useQuery<Waitlist[]>({
    queryKey: ['/api/waitlist'],
    enabled: !!user,
  });
  
  // Mutation to approve property
  const approvePropertyMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      const response = await apiRequest("PUT", `/api/properties/${propertyId}/approve`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Success",
        description: "Property approved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve property",
        variant: "destructive",
      });
    },
  });
  
  const handleApproveProperty = (propertyId: number) => {
    approvePropertyMutation.mutate(propertyId);
  };
  
  // Calculate dashboard metrics
  const calculateMetrics = () => {
    if (!pendingProperties || !users || !waitlist) {
      return {
        pendingProperties: 0,
        totalUsers: 0,
        totalHosts: 0,
        totalWaitlist: 0
      };
    }
    
    const totalUsers = users.length;
    const totalHosts = users.filter(u => u.role === "host").length;
    const totalWaitlist = waitlist.length;
    
    return {
      pendingProperties: pendingProperties.length,
      totalUsers,
      totalHosts,
      totalWaitlist
    };
  };
  
  const metrics = calculateMetrics();
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | StayAfrika</title>
      </Helmet>
      
      <div className="min-h-screen bg-neutral-light">
        <AfricanPattern className="absolute inset-0 pointer-events-none" opacity={0.02} />
        
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="hidden md:flex md:w-64 bg-secondary text-white flex-col">
            <div className="p-6 border-b border-secondary-700">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-accent" />
                <h2 className="text-xl font-bold font-montserrat">Admin Panel</h2>
              </div>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
              <button 
                className={`flex items-center w-full px-3 py-2 rounded-md text-left text-sm ${activeTab === "dashboard" ? "bg-white/10" : "hover:bg-white/5"}`}
                onClick={() => setActiveTab("dashboard")}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                <span>Dashboard</span>
              </button>
              <button 
                className={`flex items-center w-full px-3 py-2 rounded-md text-left text-sm ${activeTab === "properties" ? "bg-white/10" : "hover:bg-white/5"}`}
                onClick={() => setActiveTab("properties")}
              >
                <Home className="mr-3 h-5 w-5" />
                <span>Properties</span>
              </button>
              <button 
                className={`flex items-center w-full px-3 py-2 rounded-md text-left text-sm ${activeTab === "users" ? "bg-white/10" : "hover:bg-white/5"}`}
                onClick={() => setActiveTab("users")}
              >
                <Users className="mr-3 h-5 w-5" />
                <span>Users</span>
              </button>
              <button 
                className={`flex items-center w-full px-3 py-2 rounded-md text-left text-sm ${activeTab === "waitlist" ? "bg-white/10" : "hover:bg-white/5"}`}
                onClick={() => setActiveTab("waitlist")}
              >
                <BellRing className="mr-3 h-5 w-5" />
                <span>Waitlist</span>
              </button>
              <button 
                className={`flex items-center w-full px-3 py-2 rounded-md text-left text-sm ${activeTab === "reports" ? "bg-white/10" : "hover:bg-white/5"}`}
                onClick={() => setActiveTab("reports")}
              >
                <BarChart3 className="mr-3 h-5 w-5" />
                <span>Reports</span>
              </button>
              <button 
                className={`flex items-center w-full px-3 py-2 rounded-md text-left text-sm ${activeTab === "messages" ? "bg-white/10" : "hover:bg-white/5"}`}
                onClick={() => setActiveTab("messages")}
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                <span>Support Messages</span>
              </button>
              <button 
                className={`flex items-center w-full px-3 py-2 rounded-md text-left text-sm ${activeTab === "settings" ? "bg-white/10" : "hover:bg-white/5"}`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-3 h-5 w-5" />
                <span>Settings</span>
              </button>
            </nav>
            
            <div className="p-4 border-t border-secondary-700">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="h-8 w-8">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt={user.firstName} />
                  ) : (
                    <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-white/70">Administrator</p>
                </div>
              </div>
              <Button
                variant="secondary"
                className="w-full justify-start text-white bg-white/10 hover:bg-white/20"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </aside>
          
          {/* Mobile Header */}
          <div className="md:hidden bg-secondary text-white p-4 fixed top-0 left-0 right-0 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold font-montserrat">Admin Panel</h2>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="text-white">
                  <Settings className="h-5 w-5" />
                </Button>
                <Avatar className="h-8 w-8">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt={user.firstName} />
                  ) : (
                    <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>
          </div>
          
          {/* Mobile Nav */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-10">
            <div className="flex justify-around">
              <button 
                className={`flex flex-col items-center justify-center p-2 flex-1 ${activeTab === "dashboard" ? "text-primary" : "text-gray-600"}`}
                onClick={() => setActiveTab("dashboard")}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="text-xs mt-1">Dashboard</span>
              </button>
              <button 
                className={`flex flex-col items-center justify-center p-2 flex-1 ${activeTab === "properties" ? "text-primary" : "text-gray-600"}`}
                onClick={() => setActiveTab("properties")}
              >
                <Home className="h-5 w-5" />
                <span className="text-xs mt-1">Properties</span>
              </button>
              <button 
                className={`flex flex-col items-center justify-center p-2 flex-1 ${activeTab === "users" ? "text-primary" : "text-gray-600"}`}
                onClick={() => setActiveTab("users")}
              >
                <Users className="h-5 w-5" />
                <span className="text-xs mt-1">Users</span>
              </button>
              <button 
                className={`flex flex-col items-center justify-center p-2 flex-1 ${activeTab === "more" ? "text-primary" : "text-gray-600"}`}
                onClick={() => setActiveTab("more")}
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs mt-1">More</span>
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 md:pt-6 pb-20 md:pb-8 mt-14 md:mt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold font-montserrat">Dashboard Overview</h1>
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Pending Properties</p>
                          <h3 className="text-3xl font-bold text-secondary">{metrics.pendingProperties}</h3>
                        </div>
                        <div className="p-3 bg-secondary/10 rounded-full">
                          <Home className="h-6 w-6 text-secondary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                          <h3 className="text-3xl font-bold text-primary">{metrics.totalUsers}</h3>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Host Accounts</p>
                          <h3 className="text-3xl font-bold text-accent">{metrics.totalHosts}</h3>
                        </div>
                        <div className="p-3 bg-accent/10 rounded-full">
                          <User className="h-6 w-6 text-accent" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Waitlist Signups</p>
                          <h3 className="text-3xl font-bold text-green-600">{metrics.totalWaitlist}</h3>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                          <BellRing className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Approvals</CardTitle>
                      <CardDescription>Properties awaiting review</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isPropertiesLoading ? (
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
                            </div>
                          ))}
                        </div>
                      ) : pendingProperties && pendingProperties.length > 0 ? (
                        <div className="space-y-4">
                          {pendingProperties.slice(0, 3).map((property) => (
                            <div key={property.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                <img 
                                  src={property.images[0] || "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                                  alt={property.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{property.title}</h4>
                                <p className="text-xs text-gray-500">{property.neighborhood}, {property.city}</p>
                                <div className="flex items-center mt-1 text-xs">
                                  <Clock className="h-3 w-3 text-amber-500 mr-1" />
                                  <span>Submitted {new Date(property.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApproveProperty(property.id)}
                                  disabled={approvePropertyMutation.isPending}
                                >
                                  <Check className="h-4 w-4 mr-1" /> Approve
                                </Button>
                              </div>
                            </div>
                          ))}
                          {pendingProperties.length > 3 && (
                            <Button 
                              variant="outline" 
                              className="w-full mt-2"
                              onClick={() => setActiveTab("properties")}
                            >
                              View All ({pendingProperties.length})
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Check className="h-10 w-10 text-green-500 mx-auto mb-2" />
                          <p className="text-gray-600">No pending properties to approve</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Waitlist Signups</CardTitle>
                      <CardDescription>People interested in StayAfrika</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isWaitlistLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
                            </div>
                          ))}
                        </div>
                      ) : waitlist && waitlist.length > 0 ? (
                        <div className="space-y-3">
                          {waitlist.slice(0, 5).map((entry) => (
                            <div key={entry.id} className="flex items-center space-x-3 py-2 border-b">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{entry.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{entry.fullName}</p>
                                <p className="text-xs text-gray-500">{entry.email}</p>
                              </div>
                              <div className="flex-shrink-0">
                                <Badge>{entry.city}</Badge>
                              </div>
                            </div>
                          ))}
                          {waitlist.length > 5 && (
                            <Button 
                              variant="outline" 
                              className="w-full mt-2"
                              onClick={() => setActiveTab("waitlist")}
                            >
                              View All ({waitlist.length})
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <BellRing className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">No waitlist signups yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Properties Tab */}
              <TabsContent value="properties" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold font-montserrat">Property Management</h1>
                  <div className="flex space-x-2">
                    <Button variant="outline">Export</Button>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Property Approvals</CardTitle>
                    <CardDescription>Manage property listings awaiting approval</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TabsList className="mb-6">
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="approved">Approved</TabsTrigger>
                      <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                    
                    {isPropertiesLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                          </div>
                        ))}
                      </div>
                    ) : pendingProperties && pendingProperties.length > 0 ? (
                      <div className="space-y-4">
                        {pendingProperties.map((property) => (
                          <Card key={property.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="w-full md:w-1/4 h-40 md:h-auto">
                                <img 
                                  src={property.images[0] || "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                                  alt={property.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">{property.title}</h3>
                                    <p className="text-gray-600 text-sm">{property.neighborhood}, {property.city}</p>
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className="bg-amber-50 text-amber-700 border-amber-200 h-fit flex items-center"
                                  >
                                    <Clock className="h-3 w-3 mr-1" /> Pending
                                  </Badge>
                                </div>
                                
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Home className="mr-2 h-4 w-4" />
                                    <span>
                                      {property.propertyType === 'entire_apartment' 
                                        ? 'Entire Apartment' 
                                        : property.propertyType === 'private_room' 
                                          ? 'Private Room' 
                                          : 'Shared Space'}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>Up to {property.maxGuests} guests • {property.bedrooms} bedroom(s) • {property.bathrooms} bathroom(s)</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Host ID: {property.hostId}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {property.amenities.slice(0, 5).map((amenity, index) => (
                                    <Badge key={index} variant="outline" className="bg-gray-50">
                                      {amenity}
                                    </Badge>
                                  ))}
                                  {property.amenities.length > 5 && (
                                    <Badge variant="outline" className="bg-gray-50">
                                      +{property.amenities.length - 5} more
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                                  <div>
                                    <span className="font-medium">₦{property.pricePerNight.toLocaleString()}/night</span>
                                  </div>
                                  <div className="space-x-2">
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4 mr-1" /> Reject
                                    </Button>
                                    <Button 
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => handleApproveProperty(property.id)}
                                      disabled={approvePropertyMutation.isPending}
                                    >
                                      <Check className="h-4 w-4 mr-1" /> Approve
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No pending approvals</h3>
                        <p className="text-gray-600">All properties have been reviewed</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold font-montserrat">User Management</h1>
                  <div className="flex space-x-2">
                    <Button variant="outline">Export</Button>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage user accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TabsList className="mb-6">
                      <TabsTrigger value="all">All Users</TabsTrigger>
                      <TabsTrigger value="guests">Guests</TabsTrigger>
                      <TabsTrigger value="hosts">Hosts</TabsTrigger>
                      <TabsTrigger value="admins">Admins</TabsTrigger>
                    </TabsList>
                    
                    {isUsersLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
                          </div>
                        ))}
                      </div>
                    ) : users && users.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                              <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <Avatar>
                                        {user.profilePicture ? (
                                          <AvatarImage src={user.profilePicture} alt={user.firstName} />
                                        ) : (
                                          <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                        )}
                                      </Avatar>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {user.firstName} {user.lastName}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        ID: {user.id}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{user.email}</div>
                                  <div className="text-sm text-gray-500">{user.phoneNumber || "No phone"}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge className={
                                    user.role === "admin" 
                                      ? "bg-purple-100 text-purple-800 border-purple-200" 
                                      : user.role === "host"
                                        ? "bg-blue-100 text-blue-800 border-blue-200"
                                        : "bg-green-100 text-green-800 border-green-200"
                                  }>
                                    {user.role === "admin" ? "Admin" : user.role === "host" ? "Host" : "Guest"}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge variant="outline" className={user.isVerified ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                                    {user.isVerified ? "Verified" : "Unverified"}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button variant="ghost" size="sm">Edit</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No users found</h3>
                        <p className="text-gray-600">There are no users in the database</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Waitlist Tab */}
              <TabsContent value="waitlist" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold font-montserrat">Waitlist Management</h1>
                  <div className="flex space-x-2">
                    <Button variant="outline">Export CSV</Button>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Waitlist Signups</CardTitle>
                    <CardDescription>Users who have signed up for the waitlist</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isWaitlistLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
                          </div>
                        ))}
                      </div>
                    ) : waitlist && waitlist.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                City
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Newsletter
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {waitlist.map((entry) => (
                              <tr key={entry.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{entry.fullName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{entry.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge variant="outline">{entry.city}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {entry.subscribeToNewsletter ? (
                                    <Check className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <X className="h-5 w-5 text-red-500" />
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(entry.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button variant="ghost" size="sm">Send Email</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BellRing className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No waitlist entries</h3>
                        <p className="text-gray-600">There are no users on the waitlist yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Other Tabs (placeholder content) */}
              <TabsContent value="reports" className="space-y-6">
                <h1 className="text-2xl font-bold font-montserrat">Reports & Analytics</h1>
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Metrics</CardTitle>
                    <CardDescription>Key performance indicators and growth metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Reports Coming Soon</h3>
                      <p className="text-gray-600">Analytics dashboard is under development</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="messages" className="space-y-6">
                <h1 className="text-2xl font-bold font-montserrat">Support Messages</h1>
                <Card>
                  <CardHeader>
                    <CardTitle>User Support</CardTitle>
                    <CardDescription>Messages from users requiring assistance</CardDescription>
                  </CardHeader>
                  <CardContent className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Support Messages</h3>
                      <p className="text-gray-600">Support inbox is empty</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <h1 className="text-2xl font-bold font-montserrat">Platform Settings</h1>
                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>Manage global platform settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Site Settings</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="flex-1">Maintenance Mode</label>
                            <input type="checkbox" className="toggle" />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="flex-1">Allow New Registrations</label>
                            <input type="checkbox" defaultChecked className="toggle" />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="flex-1">Auto-approve Properties</label>
                            <input type="checkbox" className="toggle" />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium mb-2">Notification Settings</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="flex-1">Email Notifications</label>
                            <input type="checkbox" defaultChecked className="toggle" />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="flex-1">Admin Alerts</label>
                            <input type="checkbox" defaultChecked className="toggle" />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium mb-2">Commission Settings</h3>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <label className="text-sm font-medium">Platform Fee (%)</label>
                            <input type="number" defaultValue="10" min="0" max="100" className="mt-1 block w-full p-2 border rounded-md" />
                          </div>
                          <div className="flex-1">
                            <label className="text-sm font-medium">Host Payout Delay (days)</label>
                            <input type="number" defaultValue="1" min="0" className="mt-1 block w-full p-2 border rounded-md" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>Save Settings</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
