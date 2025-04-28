import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Users, Search } from "lucide-react";

const Hero = () => {
  const [_, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState({
    location: "Lagos, Nigeria",
    dates: "",
    guests: "1"
  });

  const handleSearch = () => {
    // Build query parameters for the listings page
    const queryParams = new URLSearchParams();
    if (searchParams.location && searchParams.location !== "Lagos, Nigeria") {
      queryParams.append("location", searchParams.location);
    }
    if (searchParams.dates) {
      queryParams.append("dates", searchParams.dates);
    }
    if (searchParams.guests && searchParams.guests !== "1") {
      queryParams.append("guests", searchParams.guests);
    }

    // Navigate to listings page with the query parameters
    const queryString = queryParams.toString();
    setLocation(`/listings${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <section className="relative h-[500px] md:h-[650px] african-pattern">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/70"></div>
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">Discover Authentic Stays in Lagos</h1>
            <p className="text-lg md:text-xl mb-8">Book curated, furnished accommodations with verified local hosts for an unforgettable African experience.</p>
            
            {/* Search Widget */}
            <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1">
                  <label className="block text-neutral-dark text-sm font-medium mb-2">Location</label>
                  <div className="relative">
                    <Select 
                      value={searchParams.location}
                      onValueChange={(value) => setSearchParams({...searchParams, location: value})}
                    >
                      <SelectTrigger className="w-full p-3 bg-neutral-light border border-gray-300 rounded-md">
                        <SelectValue placeholder="Lagos, Nigeria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lagos, Nigeria">Lagos, Nigeria</SelectItem>
                        <SelectItem value="lekki">Lekki</SelectItem>
                        <SelectItem value="vi">Victoria Island</SelectItem>
                        <SelectItem value="ikoyi">Ikoyi</SelectItem>
                        <SelectItem value="yaba">Yaba</SelectItem>
                        <SelectItem value="ikeja">Ikeja</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-neutral-dark text-sm font-medium mb-2">Check In - Check Out</label>
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="Add dates" 
                      className="w-full p-3 bg-neutral-light border border-gray-300 rounded-md" 
                      value={searchParams.dates}
                      onChange={(e) => setSearchParams({...searchParams, dates: e.target.value})}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-neutral-dark text-sm font-medium mb-2">Guests</label>
                  <div className="relative">
                    <Select 
                      value={searchParams.guests}
                      onValueChange={(value) => setSearchParams({...searchParams, guests: value})}
                    >
                      <SelectTrigger className="w-full p-3 bg-neutral-light border border-gray-300 rounded-md">
                        <SelectValue placeholder="1 Guest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4+ Guests</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleSearch}
                className="w-full md:w-auto mt-4 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md font-medium transition duration-300"
              >
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
