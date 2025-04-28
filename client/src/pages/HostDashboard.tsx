import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AfricanPattern } from "@/components/africanPatterns";
import { 
  User, 
  Home, 
  PlusCircle, 
  Calendar, 
  LineChart, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  Check,
  X,
  Clock,
  Star,
  BarChart3,
  Users
} from "lucide-react";
import { Property, Booking } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const HostDashboard = () => {
  const [, navigate] = useLocation();
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");
  const { toast } = useToast();
  
  // Redirect if not logged in or not a host
  if (!isAuthLoading && !user) {
    navigate("/login");
    return null;
  }
  
  if (!isAuthLoading && user?.role !== "host" && user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }
  
  // Fetch host properties
  const { data: properties, isLoading: isPropertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/host/properties'],
    enabled: !!user,
  });
  
  // Fetch host bookings
  const { data: bookings, isLoading: isBookingsLoading } = useQuery<Booking[]>({
    queryKey: ['/api/host/bookings'],
    enabled: !!user,
  });
  
  // Mutation to update booking status
  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: number, status: string }) => {
      const response = await apiRequest("PUT", `/api/bookings/${bookingId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/host/bookings'] });
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update booking status",
        variant: "destructive",
      });
    },
  });
  
  const handleUpdateBookingStatus = (bookingId: number, status: string) => {
    updateBookingStatusMutation.mutate({ bookingId, status });
  };
  
  const renderBookingStatus = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"><Check className="h-3 w-3" /> Confirmed</Badge>;
      case "canceled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"><X className="h-3 w-3" /> Canceled</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"><Star className="h-3 w-3" /> Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getBookingDateRange = (checkInDate: string, checkOutDate: string) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    return `${checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };
  
  // Calculate dashboard metrics
  const calculateMetrics = () => {
    if (!properties || !bookings) return { totalProperties: 0, activeBookings: 0, pendingBookings: 0, totalEarnings: 0 };
    
    const totalProperties = properties.length;
    const activeBookings = bookings.filter(b => b.status === "confirmed").length;
    const pendingBookings = bookings.filter(b => b.status === "pending").length;
    const totalEarnings = bookings
      .filter(b => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    return { totalProperties, activeBookings, pendingBookings, totalEarnings };
  };
  
  const metrics = calculateMetrics();
  
  return (
    <>
      <Helmet>
        <title>Host Dashboard | StayAfrika</title>
      </Helmet>
      
      <div className="min-h-screen bg-neutral-light">
        <AfricanPattern className="absolute inset-0 pointer-events-none" opacity={0.02} />
        
        <div className="container mx-auto px-4 py-8">
          {/* Dashboard Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold font-montserrat">Host Dashboard</h1>
              <p className="text-gray-600">Manage your properties and bookings</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/host/create-listing">
                <Button className="flex items-center bg-primary hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Property
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Properties</p>
                    <h3 className="text-3xl font-bold text-secondary">{metrics.totalProperties}</h3>
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
                    <p className="text-sm font-medium text-gray-500 mb-1">Active Bookings</p>
                    <h3 className="text-3xl font-bold text-primary">{metrics.activeBookings}</h3>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Pending Requests</p>
                    <h3 className="text-3xl font-bold text-accent">{metrics.pendingBookings}</h3>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-full">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Earnings</p>
                    <h3 className="text-3xl font-bold text-green-600">₦{metrics.totalEarnings.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      {user?.profilePicture ? (
                        <AvatarImage src={user.profilePicture} alt={user.firstName} />
                      ) : (
                        <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{user?.firstName} {user?.lastName}</CardTitle>
                      <CardDescription className="truncate">{user?.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <nav className="space-y-1">
                    <button 
                      className={`flex items-center w-full px-3 py-2 rounded-md text-left ${activeTab === "properties" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                      onClick={() => setActiveTab("properties")}
                    >
                      <Home className="mr-3 h-5 w-5" />
                      <span>My Properties</span>
                    </button>
                    <button 
                      className={`flex items-center w-full px-3 py-2 rounded-md text-left ${activeTab === "bookings" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                      onClick={() => setActiveTab("bookings")}
                    >
                      <Calendar className="mr-3 h-5 w-5" />
                      <span>Bookings</span>
                    </button>
                    <button 
                      className={`flex items-center w-full px-3 py-2 rounded-md text-left ${activeTab === "earnings" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                      onClick={() => setActiveTab("earnings")}
                    >
                      <LineChart className="mr-3 h-5 w-5" />
                      <span>Earnings</span>
                    </button>
                    <button 
                      className={`flex items-center w-full px-3 py-2 rounded-md text-left ${activeTab === "messages" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                      onClick={() => setActiveTab("messages")}
                    >
                      <MessageSquare className="mr-3 h-5 w-5" />
                      <span>Messages</span>
                    </button>
                    <button 
                      className={`flex items-center w-full px-3 py-2 rounded-md text-left ${activeTab === "profile" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="mr-3 h-5 w-5" />
                      <span>Profile</span>
                    </button>
                    <button 
                      className={`flex items-center w-full px-3 py-2 rounded-md text-left ${activeTab === "settings" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="mr-3 h-5 w-5" />
                      <span>Settings</span>
                    </button>
                  </nav>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>Sign out</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Properties Tab */}
                <TabsContent value="properties">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Properties</CardTitle>
                      <CardDescription>Manage your listed properties</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isPropertiesLoading ? (
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                            </div>
                          ))}
                        </div>
                      ) : properties && properties.length > 0 ? (
                        <div className="space-y-4">
                          {properties.map((property) => (
                            <Card key={property.id} className="overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 h-32 md:h-auto">
                                  <img 
                                    src={property.images[0] || "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                                    alt={property.title} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 p-4">
                                  <div className="flex justify-between mb-2">
                                    <h3 className="font-semibold text-lg">{property.title}</h3>
                                    {property.isApproved ? (
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        <Check className="h-3 w-3 mr-1" /> Approved
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                        <Clock className="h-3 w-3 mr-1" /> Pending Approval
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm mb-2">{property.neighborhood}, {property.city}</p>
                                  <div className="flex items-center text-sm text-gray-600 mb-4">
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>Up to {property.maxGuests} guests</span>
                                    <span className="mx-2">•</span>
                                    <span>₦{property.pricePerNight.toLocaleString()}/night</span>
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    <Badge variant={property.isActive ? "outline" : "secondary"} className={property.isActive ? "bg-blue-50 text-blue-700 border-blue-200" : ""}>
                                      {property.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    <div className="space-x-2">
                                      <Button size="sm" variant="outline">
                                        Edit
                                      </Button>
                                      <Link href={`/property/${property.id}`}>
                                        <Button size="sm">
                                          View Details
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
                          <p className="text-gray-600 mb-6">Start adding your properties to get bookings</p>
                          <Link href="/host/create-listing">
                            <Button>Add your first property</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Bookings Tab */}
                <TabsContent value="bookings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Booking Requests</CardTitle>
                      <CardDescription>Manage your property bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TabsList className="mb-6">
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="canceled">Canceled</TabsTrigger>
                      </TabsList>
                      
                      {isBookingsLoading ? (
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                            </div>
                          ))}
                        </div>
                      ) : bookings && bookings.length > 0 ? (
                        <div className="space-y-4">
                          {bookings.map((booking: any) => (
                            <Card key={booking.id} className="overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/4 h-32 md:h-auto">
                                  <img 
                                    src={booking.property?.images?.[0] || "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                                    alt={booking.property?.title || "Property"} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 p-4">
                                  <div className="flex justify-between mb-2">
                                    <h3 className="font-semibold text-lg">{booking.property?.title || "Property Booking"}</h3>
                                    {renderBookingStatus(booking.status)}
                                  </div>
                                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                    <div>
                                      <p className="text-gray-600 text-sm mb-2">
                                        {booking.property?.neighborhood}, {booking.property?.city}
                                      </p>
                                      <div className="flex items-center text-sm text-gray-600 mb-2">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>{getBookingDateRange(booking.checkInDate, booking.checkOutDate)}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600 mb-2">
                                        <Users className="mr-2 h-4 w-4" />
                                        <span>Guest: {booking.guest?.firstName} {booking.guest?.lastName}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-2 md:mt-0">
                                      <p className="font-medium text-lg">₦{booking.totalPrice.toLocaleString()}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-end items-center mt-4 space-x-2">
                                    {booking.status === "pending" && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="border-red-200 text-red-600 hover:bg-red-50"
                                          onClick={() => handleUpdateBookingStatus(booking.id, "canceled")}
                                        >
                                          Decline
                                        </Button>
                                        <Button 
                                          size="sm"
                                          className="bg-green-600 hover:bg-green-700"
                                          onClick={() => handleUpdateBookingStatus(booking.id, "confirmed")}
                                        >
                                          Accept
                                        </Button>
                                      </>
                                    )}
                                    
                                    {booking.status === "confirmed" && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => handleUpdateBookingStatus(booking.id, "completed")}
                                        >
                                          Mark as Completed
                                        </Button>
                                      </>
                                    )}
                                    
                                    <Link href={`/messages/${booking.guest?.id}`}>
                                      <Button size="sm" variant="outline">
                                        <MessageSquare className="h-4 w-4 mr-1" /> Message
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                          <p className="text-gray-600 mb-6">You'll see bookings here once guests reserve your properties</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Earnings Tab */}
                <TabsContent value="earnings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Earnings Dashboard</CardTitle>
                      <CardDescription>Track your income and payouts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-6">
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Earnings</p>
                            <h3 className="text-2xl font-bold">₦{metrics.totalEarnings.toLocaleString()}</h3>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <p className="text-sm font-medium text-gray-500 mb-1">Completed Payouts</p>
                            <h3 className="text-2xl font-bold">₦0</h3>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <p className="text-sm font-medium text-gray-500 mb-1">Pending Payouts</p>
                            <h3 className="text-2xl font-bold">₦{metrics.totalEarnings.toLocaleString()}</h3>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-secondary/5 p-6 rounded-lg">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">Next Payout</h3>
                              <p className="text-gray-600 text-sm">Estimated to arrive in 3-5 business days</p>
                            </div>
                            <Button className="mt-2 md:mt-0">Request Payout</Button>
                          </div>
                          <Separator className="my-4" />
                          <p className="text-gray-600 text-sm mb-2">Account Details:</p>
                          <p className="text-sm mb-1">Bank: {user?.bankName || "Not set"}</p>
                          <p className="text-sm">Account Number: {user?.accountNumber || "Not set"}</p>
                          {!user?.bankName && (
                            <Button variant="outline" size="sm" className="mt-4" onClick={() => setActiveTab("profile")}>
                              Add bank details
                            </Button>
                          )}
                        </div>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base font-medium">Earnings History</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {bookings && bookings.filter(b => b.status === "confirmed" || b.status === "completed").length > 0 ? (
                              <div className="space-y-4">
                                {bookings.filter(b => b.status === "confirmed" || b.status === "completed").map((booking: any) => (
                                  <div key={booking.id} className="flex items-center justify-between py-2 border-b">
                                    <div>
                                      <p className="font-medium">{booking.property?.title}</p>
                                      <p className="text-sm text-gray-600">
                                        Booking #{booking.id} • {getBookingDateRange(booking.checkInDate, booking.checkOutDate)}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">₦{booking.totalPrice.toLocaleString()}</p>
                                      <Badge variant="outline" className={booking.status === "completed" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}>
                                        {booking.status === "completed" ? "Paid" : "Pending"}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <LineChart className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">No earnings history yet</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Messages Tab */}
                <TabsContent value="messages">
                  <Card>
                    <CardHeader>
                      <CardTitle>Messages</CardTitle>
                      <CardDescription>Communicate with your guests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                        <p className="text-gray-600 mb-6">When you receive bookings, you'll be able to message your guests here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Profile Tab */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Host Profile</CardTitle>
                      <CardDescription>Manage your hosting profile and details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex-shrink-0">
                            <Avatar className="h-20 w-20">
                              {user?.profilePicture ? (
                                <AvatarImage src={user.profilePicture} alt={user.firstName} />
                              ) : (
                                <AvatarFallback className="text-lg">{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                              )}
                            </Avatar>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{user?.firstName} {user?.lastName}</h3>
                            <p className="text-gray-600">{user?.email}</p>
                            {user?.isVerified ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-1">
                                <Check className="h-3 w-3 mr-1" /> Verified Host
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mt-1">
                                <Clock className="h-3 w-3 mr-1" /> Verification Pending
                              </Badge>
                            )}
                          </div>
                          <Button variant="outline" size="sm">
                            Edit Profile
                          </Button>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                            <p>{user?.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                            <p>{user?.phoneNumber || "Not provided"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Account Type</h3>
                            <p className="capitalize">{user?.role || "Host"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Host Since</h3>
                            <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently"}</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-2">Host Bio</h3>
                          <p className="text-gray-600">{user?.bio || "No bio provided yet. Tell guests about yourself and your hosting style."}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Edit Bio
                          </Button>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-4">Payment Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-500">Bank Name</p>
                              <p>{user?.bankName || "Not provided"}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-500">Account Number</p>
                              <p>{user?.accountNumber ? "xxxx" + user.accountNumber.slice(-4) : "Not provided"}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Update Payment Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Host Settings</CardTitle>
                      <CardDescription>Manage your hosting preferences and settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">Notifications</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="flex-1">Email notifications for new bookings</label>
                              <input type="checkbox" defaultChecked className="toggle" />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="flex-1">SMS notifications for new bookings</label>
                              <input type="checkbox" defaultChecked className="toggle" />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="flex-1">Instant booking notifications</label>
                              <input type="checkbox" defaultChecked className="toggle" />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="flex-1">Marketing emails</label>
                              <input type="checkbox" className="toggle" />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-2">Booking Preferences</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="flex-1">Allow instant booking</label>
                              <input type="checkbox" defaultChecked className="toggle" />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="flex-1">Require ID verification</label>
                              <input type="checkbox" className="toggle" />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="flex-1">Auto-decline bookings after 24h</label>
                              <input type="checkbox" className="toggle" />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-2">Account</h3>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-between text-left">
                              <span>Change Password</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between text-left">
                              <span>Connected Accounts</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between text-left">
                              <span>Tax Documents</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between text-left">
                              <span>Delete account</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HostDashboard;
