import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AfricanPattern } from "@/components/africanPatterns";
import { 
  User, 
  Calendar, 
  CreditCard, 
  Home, 
  Star, 
  MessageSquare, 
  Settings, 
  LogOut,
  Clock,
  Check,
  X,
  ChevronRight,
  AlertTriangle
} from "lucide-react";

const Dashboard = () => {
  const [, navigate] = useLocation();
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  
  // Redirect if not logged in or is a host
  if (!isAuthLoading && !user) {
    navigate("/login");
    return null;
  }
  
  if (!isAuthLoading && user?.role === "host") {
    navigate("/host/dashboard");
    return null;
  }
  
  // Fetch user bookings
  const { data: bookings, isLoading: isBookingsLoading } = useQuery({
    queryKey: ['/api/bookings'],
    enabled: !!user,
  });
  
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
  
  return (
    <>
      <Helmet>
        <title>Guest Dashboard | StayAfrika</title>
      </Helmet>
      
      <div className="min-h-screen bg-neutral-light">
        <AfricanPattern className="absolute inset-0 pointer-events-none" opacity={0.02} />
        
        <div className="container mx-auto px-4 py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-montserrat">Guest Dashboard</h1>
            <p className="text-gray-600">Manage your stays and account details</p>
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
                      className={`flex items-center w-full px-3 py-2 rounded-md text-left ${activeTab === "bookings" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                      onClick={() => setActiveTab("bookings")}
                    >
                      <Calendar className="mr-3 h-5 w-5" />
                      <span>My Bookings</span>
                    </button>
                    <button 
                      className={`flex items-center w-full px-3 py-2 rounded-md text-left ${activeTab === "favorites" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                      onClick={() => setActiveTab("favorites")}
                    >
                      <Star className="mr-3 h-5 w-5" />
                      <span>Saved Stays</span>
                    </button>
                    <button 
                      className={`flex items-center w-full px-3 py-2 rounded-md text-left ${activeTab === "payments" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                      onClick={() => setActiveTab("payments")}
                    >
                      <CreditCard className="mr-3 h-5 w-5" />
                      <span>Payment Methods</span>
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
              
              {!user?.phoneNumber && (
                <Card className="mt-4 border-amber-200 bg-amber-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-amber-900">Complete your profile</h3>
                        <p className="text-sm text-amber-700 mb-4">Add your phone number for booking confirmations and important updates.</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-amber-300 text-amber-700 hover:bg-amber-100"
                          onClick={() => setActiveTab("profile")}
                        >
                          Update profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Bookings Tab */}
                <TabsContent value="bookings">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Bookings</CardTitle>
                      <CardDescription>View and manage your upcoming and past stays</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TabsList className="mb-6">
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="past">Past</TabsTrigger>
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
                                <div className="w-full md:w-1/3 h-32 md:h-auto">
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
                                  <p className="text-gray-600 text-sm mb-2">{booking.property?.neighborhood}, {booking.property?.city}</p>
                                  <div className="flex items-center text-sm text-gray-600 mb-4">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>{getBookingDateRange(booking.checkInDate, booking.checkOutDate)}</span>
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    <p className="font-medium">₦{booking.totalPrice.toLocaleString()}</p>
                                    <div className="space-x-2">
                                      {booking.status === "confirmed" && (
                                        <Link href={`/messages/${booking.property?.hostId}`}>
                                          <Button size="sm" variant="outline">
                                            Message Host
                                          </Button>
                                        </Link>
                                      )}
                                      <Link href={`/property/${booking.property?.id}`}>
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
                          <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                          <p className="text-gray-600 mb-6">Start exploring and book your first stay with StayAfrika</p>
                          <Link href="/listings">
                            <Button>Find a place to stay</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Favorites Tab */}
                <TabsContent value="favorites">
                  <Card>
                    <CardHeader>
                      <CardTitle>Saved Stays</CardTitle>
                      <CardDescription>Properties you've saved for later</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No saved stays yet</h3>
                        <p className="text-gray-600 mb-6">Save properties you like while browsing to find them here</p>
                        <Link href="/listings">
                          <Button>Explore properties</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Payments Tab */}
                <TabsContent value="payments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Manage your payment options</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No payment methods</h3>
                        <p className="text-gray-600 mb-6">Add a payment method to make your bookings easier</p>
                        <Button>Add payment method</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Messages Tab */}
                <TabsContent value="messages">
                  <Card>
                    <CardHeader>
                      <CardTitle>Messages</CardTitle>
                      <CardDescription>Communicate with your hosts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                        <p className="text-gray-600 mb-6">When you book a stay, you'll be able to message your host here</p>
                        <Link href="/listings">
                          <Button>Find a place to stay</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Profile Tab */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Manage your personal details</CardDescription>
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
                                <Check className="h-3 w-3 mr-1" /> Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mt-1">
                                <AlertTriangle className="h-3 w-3 mr-1" /> Not verified
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
                            <p className="capitalize">{user?.role || "Guest"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Member Since</h3>
                            <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently"}</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-2">Bio</h3>
                          <p className="text-gray-600">{user?.bio || "No bio provided yet."}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Edit Bio
                          </Button>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-2">Account Actions</h3>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-between">
                              <span>Change Password</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between">
                              <span>Verify Phone Number</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Link href="/become-host">
                              <Button variant="outline" className="w-full justify-between">
                                <span>Become a Host</span>
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your preferences and account settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">Notifications</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="flex-1">Email notifications</label>
                              <input type="checkbox" defaultChecked className="toggle" />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="flex-1">SMS notifications</label>
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
                          <h3 className="font-medium mb-2">Privacy</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="flex-1">Show profile to hosts</label>
                              <input type="checkbox" defaultChecked className="toggle" />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="flex-1">Share booking history</label>
                              <input type="checkbox" className="toggle" />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-2">Account</h3>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-between text-left">
                              <span>Download my data</span>
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

export default Dashboard;
