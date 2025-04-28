import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Bed, 
  Bath, 
  Users, 
  Star, 
  Home, 
  Map, 
  Calendar as CalendarIcon, 
  Heart, 
  Share2,
  CheckCircle,
  XCircle,
  Coffee,
  Wifi,
  Tv,
  Car,
  UtensilsCrossed,
  Wind,
  AreaChart,
  MessageSquare
} from "lucide-react";
import Logo from "@/components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PropertyDetailProps {}

const PropertyDetail = ({}: PropertyDetailProps) => {
  const { id } = useParams();
  const propertyId = parseInt(id as string);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  // Local state
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Fetch property details
  const { data: property, isLoading } = useQuery({
    queryKey: [`/api/properties/${propertyId}`],
  });
  
  // Book property mutation
  const bookMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking request sent!",
        description: "The host will confirm your booking soon.",
      });
      setIsBookingModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message || "There was an error processing your booking request.",
        variant: "destructive",
      });
    },
  });
  
  // Calculate number of nights and total price
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };
  
  const calculateTotalPrice = () => {
    const nights = calculateNights();
    if (!property || nights === 0) return 0;
    
    return (property.pricePerNight * nights) + (property.cleaningFee || 0);
  };
  
  // Handle booking submission
  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to book this property.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!checkInDate || !checkOutDate) {
      toast({
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }
    
    bookMutation.mutate({
      propertyId,
      checkInDate,
      checkOutDate,
      totalPrice: calculateTotalPrice(),
    });
  };
  
  // Render amenity icon based on name
  const renderAmenityIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('wifi')) return <Wifi className="h-4 w-4" />;
    if (lowerName.includes('tv') || lowerName.includes('television')) return <Tv className="h-4 w-4" />;
    if (lowerName.includes('kitchen') || lowerName.includes('cooking')) return <UtensilsCrossed className="h-4 w-4" />;
    if (lowerName.includes('air') || lowerName.includes('ac')) return <Wind className="h-4 w-4" />;
    if (lowerName.includes('parking')) return <Car className="h-4 w-4" />;
    if (lowerName.includes('workspace')) return <AreaChart className="h-4 w-4" />;
    if (lowerName.includes('coffee')) return <Coffee className="h-4 w-4" />;
    
    return <CheckCircle className="h-4 w-4" />;
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            </div>
            <div>
              <div className="h-80 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Home className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Property not found</h2>
        <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/listings")}>Browse all properties</Button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{property.title} | StayAfrika</title>
        <meta name="description" content={property.description.slice(0, 160)} />
      </Helmet>
      
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Property Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold font-montserrat mb-2">{property.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {property.avgRating && (
                <div className="flex items-center">
                  <Star className="text-accent mr-1 h-4 w-4" />
                  <span className="font-medium">{property.avgRating.toFixed(2)}</span>
                  <span className="mx-1">•</span>
                  <span className="underline">{property.reviews?.length || 0} reviews</span>
                </div>
              )}
              <div className="flex items-center">
                <Map className="mr-1 h-4 w-4" />
                <span>{property.neighborhood}, {property.city}</span>
              </div>
            </div>
          </div>
          
          {/* Property Images */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] md:h-[500px]">
              <div className="relative h-full">
                <img 
                  src={property.images[activeImageIndex] || "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                  alt={property.title}
                  className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full"
                  >
                    <Heart className="h-5 w-5 text-neutral-dark" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full"
                  >
                    <Share2 className="h-5 w-5 text-neutral-dark" />
                  </Button>
                </div>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-2">
                {property.images.slice(1, 5).map((image, index) => (
                  <div 
                    key={index} 
                    className={`relative ${index === 1 ? 'rounded-tr-lg' : ''} ${index === 3 ? 'rounded-br-lg' : ''}`}
                    onClick={() => setActiveImageIndex(index + 1)}
                  >
                    <img 
                      src={image} 
                      alt={`${property.title} - ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Thumbnail navigation for mobile */}
            <div className="flex md:hidden space-x-2 mt-2 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`w-16 h-16 flex-shrink-0 cursor-pointer ${activeImageIndex === index ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img 
                    src={image} 
                    alt={`${property.title} - ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Information */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold font-montserrat">
                    {property.propertyType === 'entire_apartment' 
                      ? `Entire apartment hosted by ${property.host?.firstName || 'Host'}` 
                      : property.propertyType === 'private_room'
                        ? `Private room in ${property.neighborhood}`
                        : `Shared room in ${property.neighborhood}`}
                  </h2>
                  <div className="flex mt-1 text-gray-600">
                    <span className="flex items-center mr-4">
                      <Users className="mr-2 h-4 w-4" /> {property.maxGuests} guests
                    </span>
                    <span className="flex items-center mr-4">
                      <Bed className="mr-2 h-4 w-4" /> {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center">
                      <Bath className="mr-2 h-4 w-4" /> {property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                {property.host && (
                  <Avatar className="h-12 w-12">
                    {property.host.profilePicture ? (
                      <AvatarImage src={property.host.profilePicture} alt={property.host.firstName} />
                    ) : (
                      <AvatarFallback>{property.host.firstName?.[0]}</AvatarFallback>
                    )}
                  </Avatar>
                )}
              </div>
              
              <Separator className="my-6" />
              
              {/* Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{property.propertyType === 'entire_apartment' ? 'Entire home' : 'Private space'}</h3>
                    <p className="text-sm text-gray-600">You'll have the space to yourself</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Enhanced Clean</h3>
                    <p className="text-sm text-gray-600">This host follows our cleaning standards</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Great communication</h3>
                    <p className="text-sm text-gray-600">Quick responses from the host</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold font-montserrat mb-4">About this place</h2>
                <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
              </div>
              
              <Separator className="my-6" />
              
              {/* Amenities */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold font-montserrat mb-4">What this place offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center py-2">
                      {renderAmenityIcon(amenity)}
                      <span className="ml-3">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* House Rules */}
              {property.houseRules && (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold font-montserrat mb-4">House rules</h2>
                    <p className="text-gray-600 whitespace-pre-line">{property.houseRules}</p>
                  </div>
                  <Separator className="my-6" />
                </>
              )}
              
              {/* Reviews */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold font-montserrat mb-4">
                  <div className="flex items-center">
                    <Star className="text-accent mr-2 h-5 w-5" />
                    <span>{property.avgRating?.toFixed(2) || "New"}</span>
                    <span className="mx-1">•</span>
                    <span>{property.reviews?.length || 0} reviews</span>
                  </div>
                </h2>
                
                {property.reviews && property.reviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {property.reviews.slice(0, 4).map((review) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            {review.guest?.profilePicture ? (
                              <AvatarImage src={review.guest.profilePicture} alt={review.guest.firstName} />
                            ) : (
                              <AvatarFallback>{review.guest?.firstName?.[0] || 'G'}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.guest?.firstName || "Guest"}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? 'text-accent fill-accent' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet. Be the first to leave a review!</p>
                )}
                
                {property.reviews && property.reviews.length > 4 && (
                  <Button variant="outline" className="mt-6">
                    Show all {property.reviews.length} reviews
                  </Button>
                )}
              </div>
            </div>
            
            {/* Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-xl font-bold">₦{property.pricePerNight.toLocaleString()}</span>
                      <span className="text-gray-600"> / night</span>
                    </div>
                    {property.avgRating && (
                      <div className="flex items-center">
                        <Star className="text-accent mr-1 h-4 w-4" />
                        <span className="font-medium">{property.avgRating.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Tabs defaultValue="dates" className="mb-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="dates">Dates</TabsTrigger>
                      <TabsTrigger value="guests">Guests</TabsTrigger>
                    </TabsList>
                    <TabsContent value="dates" className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Check-in:</span>
                          <span className="font-medium">
                            {checkInDate 
                              ? checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                              : 'Select date'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Check-out:</span>
                          <span className="font-medium">
                            {checkOutDate 
                              ? checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                              : 'Select date'}
                          </span>
                        </div>
                        <Calendar
                          mode="range"
                          selected={{
                            from: checkInDate,
                            to: checkOutDate
                          }}
                          onSelect={(range) => {
                            setCheckInDate(range?.from);
                            setCheckOutDate(range?.to);
                          }}
                          className="rounded-md border mt-2"
                          disabled={(date) => date < new Date()}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="guests" className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Guests</label>
                          <select 
                            className="w-full p-2 border rounded-md" 
                            value={guests}
                            onChange={(e) => setGuests(parseInt(e.target.value))}
                          >
                            {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((num) => (
                              <option key={num} value={num}>
                                {num} guest{num !== 1 ? 's' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="text-xs text-gray-600">
                          This place has a maximum of {property.maxGuests} guests.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 mb-4" 
                    onClick={() => setIsBookingModalOpen(true)}
                    disabled={!checkInDate || !checkOutDate}
                  >
                    {property.cancellationPolicy === 'flexible' ? 'Instant Book' : 'Request to Book'}
                  </Button>
                  
                  {checkInDate && checkOutDate && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>₦{property.pricePerNight.toLocaleString()} x {calculateNights()} nights</span>
                        <span>₦{(property.pricePerNight * calculateNights()).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span>₦{property.cleaningFee?.toLocaleString() || 0}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₦{calculateTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  
                  {!checkInDate && !checkOutDate && (
                    <p className="text-center text-sm text-gray-600">
                      Select dates to see total price
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Location Section */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold font-montserrat mb-4">Location</h2>
            <p className="text-gray-600 mb-4">{property.neighborhood}, {property.city}</p>
            <div className="h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Map view is available after booking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking confirmation modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Logo size="sm" />
              <span className="ml-2">Confirm your booking</span>
            </DialogTitle>
            <DialogDescription>
              Review the details of your stay
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={property.images[0]} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-sm text-gray-600">{property.neighborhood}, {property.city}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Check-in</h4>
                <p className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  {checkInDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Check-out</h4>
                <p className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  {checkOutDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Guests</h4>
              <p className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                {guests} guest{guests !== 1 ? 's' : ''}
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>₦{property.pricePerNight.toLocaleString()} x {calculateNights()} nights</span>
                <span>₦{(property.pricePerNight * calculateNights()).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>₦{property.cleaningFee?.toLocaleString() || 0}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total (NGN)</span>
                <span>₦{calculateTotalPrice().toLocaleString()}</span>
              </div>
            </div>
            
            <div className="bg-secondary/5 p-4 rounded-lg">
              <p className="text-sm">
                {property.cancellationPolicy === 'flexible' 
                  ? 'Free cancellation before check-in. Cancel before check-in for a full refund.'
                  : property.cancellationPolicy === 'moderate'
                    ? 'Cancel up to 5 days before check-in and get a partial refund.'
                    : 'This reservation is non-refundable.'}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBookingModalOpen(false)}
            >
              Go back
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleBookNow}
              disabled={bookMutation.isPending}
            >
              {bookMutation.isPending 
                ? "Processing..." 
                : property.cancellationPolicy === 'flexible' 
                  ? "Confirm and pay" 
                  : "Request to book"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyDetail;
