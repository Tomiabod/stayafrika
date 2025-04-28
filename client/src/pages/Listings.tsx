import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { AfricanPattern } from "@/components/africanPatterns";
import { Search, MapPin, Users, Home, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Listings = () => {
  const [_, params] = useLocation();
  const urlParams = new URLSearchParams(params);
  
  // Parse URL parameters
  const initialFilters = {
    location: urlParams.get("location") || "",
    neighborhood: urlParams.get("neighborhood") || "",
    propertyType: urlParams.get("propertyType") || "",
    guests: urlParams.get("guests") ? parseInt(urlParams.get("guests") as string) : 1,
    priceRange: [0, 100000] as [number, number],
    bedrooms: urlParams.get("bedrooms") ? parseInt(urlParams.get("bedrooms") as string) : 0,
  };
  
  const [filters, setFilters] = useState(initialFilters);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Build query string from filters
  const buildQueryString = () => {
    const queryParams = new URLSearchParams();
    
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.neighborhood) queryParams.append("neighborhood", filters.neighborhood);
    if (filters.propertyType) queryParams.append("propertyType", filters.propertyType);
    if (filters.guests > 1) queryParams.append("guests", filters.guests.toString());
    if (filters.priceRange[0] > 0) queryParams.append("minPrice", filters.priceRange[0].toString());
    if (filters.priceRange[1] < 100000) queryParams.append("maxPrice", filters.priceRange[1].toString());
    if (filters.bedrooms > 0) queryParams.append("bedrooms", filters.bedrooms.toString());
    
    return queryParams.toString();
  };
  
  // Fetch properties based on filters
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: [`/api/properties?${buildQueryString()}`],
  });
  
  // Update active filters for display
  useEffect(() => {
    const newActiveFilters: string[] = [];
    
    if (filters.location) newActiveFilters.push(`Location: ${filters.location}`);
    if (filters.neighborhood) newActiveFilters.push(`Neighborhood: ${filters.neighborhood}`);
    if (filters.propertyType) {
      const typeLabel = filters.propertyType === "entire_apartment" 
        ? "Entire apartment" 
        : filters.propertyType === "private_room" 
          ? "Private room" 
          : "Shared space";
      newActiveFilters.push(`Type: ${typeLabel}`);
    }
    if (filters.guests > 1) newActiveFilters.push(`Guests: ${filters.guests}+`);
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) {
      newActiveFilters.push(`Price: ₦${filters.priceRange[0].toLocaleString()} - ₦${filters.priceRange[1].toLocaleString()}`);
    }
    if (filters.bedrooms > 0) newActiveFilters.push(`Bedrooms: ${filters.bedrooms}+`);
    
    setActiveFilters(newActiveFilters);
  }, [filters]);
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      location: "",
      neighborhood: "",
      propertyType: "",
      guests: 1,
      priceRange: [0, 100000],
      bedrooms: 0,
    });
  };
  
  // Remove a specific filter
  const removeFilter = (filter: string) => {
    const key = filter.split(":")[0].trim().toLowerCase();
    
    switch (key) {
      case "location":
        setFilters({ ...filters, location: "" });
        break;
      case "neighborhood":
        setFilters({ ...filters, neighborhood: "" });
        break;
      case "type":
        setFilters({ ...filters, propertyType: "" });
        break;
      case "guests":
        setFilters({ ...filters, guests: 1 });
        break;
      case "price":
        setFilters({ ...filters, priceRange: [0, 100000] });
        break;
      case "bedrooms":
        setFilters({ ...filters, bedrooms: 0 });
        break;
      default:
        break;
    }
  };
  
  // Create placeholder properties for loading state
  const placeholderProperties = Array(6).fill(null).map((_, i) => ({
    id: i,
    title: "Loading...",
    neighborhood: "Loading...",
    pricePerNight: 0,
    images: [],
    rating: 0,
    reviewCount: 0,
    propertyType: "entire_apartment" as any,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0
  }));
  
  return (
    <>
      <Helmet>
        <title>Explore Stays | StayAfrika</title>
        <meta name="description" content="Find your perfect stay in Lagos. Browse verified properties with local hosts." />
      </Helmet>
      
      <div className="bg-neutral-light min-h-screen">
        <div className="pt-8 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold font-montserrat mb-8">Find your perfect stay</h1>
            
            {/* Filters Section */}
            <div className="mb-8">
              <Card className="mb-4">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <div className="relative">
                        <Input
                          value={filters.location}
                          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                          placeholder="Lagos, Nigeria"
                          className="pl-10"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Property Type</label>
                      <Select
                        value={filters.propertyType}
                        onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any type</SelectItem>
                          <SelectItem value="entire_apartment">Entire apartment</SelectItem>
                          <SelectItem value="private_room">Private room</SelectItem>
                          <SelectItem value="shared_space">Shared space</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Guests</label>
                      <div className="relative">
                        <Select
                          value={filters.guests.toString()}
                          onValueChange={(value) => setFilters({ ...filters, guests: parseInt(value) })}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="1 Guest" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Guest</SelectItem>
                            <SelectItem value="2">2 Guests</SelectItem>
                            <SelectItem value="3">3 Guests</SelectItem>
                            <SelectItem value="4">4 Guests</SelectItem>
                            <SelectItem value="5">5+ Guests</SelectItem>
                          </SelectContent>
                        </Select>
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Neighborhood</label>
                      <Select
                        value={filters.neighborhood}
                        onValueChange={(value) => setFilters({ ...filters, neighborhood: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any area</SelectItem>
                          <SelectItem value="lekki">Lekki</SelectItem>
                          <SelectItem value="vi">Victoria Island</SelectItem>
                          <SelectItem value="ikoyi">Ikoyi</SelectItem>
                          <SelectItem value="yaba">Yaba</SelectItem>
                          <SelectItem value="ikeja">Ikeja</SelectItem>
                          <SelectItem value="surulere">Surulere</SelectItem>
                          <SelectItem value="ajah">Ajah</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Price Range (₦)</label>
                        <span className="text-sm text-gray-500">
                          ₦{filters.priceRange[0].toLocaleString()} - ₦{filters.priceRange[1].toLocaleString()}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
                        max={100000}
                        step={5000}
                        onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                        className="my-4"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bedrooms</label>
                      <Select
                        value={filters.bedrooms.toString()}
                        onValueChange={(value) => setFilters({ ...filters, bedrooms: parseInt(value) })}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Any number" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Any number</SelectItem>
                          <SelectItem value="1">1+ bedroom</SelectItem>
                          <SelectItem value="2">2+ bedrooms</SelectItem>
                          <SelectItem value="3">3+ bedrooms</SelectItem>
                          <SelectItem value="4">4+ bedrooms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="text-gray-600"
                    >
                      Clear all filters
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Search className="mr-2 h-4 w-4" /> Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Active filters */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeFilters.map((filter) => (
                    <Badge 
                      key={filter} 
                      variant="secondary"
                      className="px-3 py-1 flex items-center gap-1"
                    >
                      {filter}
                      <button onClick={() => removeFilter(filter)}>
                        <X className="h-3 w-3 ml-1" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Results */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold font-montserrat">
                  {isLoading 
                    ? "Finding properties..." 
                    : properties?.length 
                      ? `${properties.length} properties found` 
                      : "No properties found"}
                </h2>
                <Select defaultValue="recommended">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading
                  ? placeholderProperties.map((property) => (
                      <PropertyCard key={property.id} property={property as any} isLoading={true} />
                    ))
                  : properties && properties.length > 0
                    ? properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))
                    : (
                      <div className="col-span-3 py-12 text-center">
                        <Home className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                        <Button onClick={resetFilters} variant="outline">Clear all filters</Button>
                      </div>
                    )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Listings;
