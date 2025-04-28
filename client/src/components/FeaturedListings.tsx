import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Property } from "@shared/schema";

const FeaturedListings = () => {
  const [filter, setFilter] = useState<string>("all");
  
  // Query for featured properties
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties?featured=true'],
  });
  
  // Filter properties based on selected category
  const filteredProperties = properties ? properties.filter(property => {
    if (filter === "all") return true;
    if (filter === "entire_homes" && property.propertyType === "entire_apartment") return true;
    if (filter === "private_rooms" && property.propertyType === "private_room") return true;
    if (filter === "luxury" && property.pricePerNight > 50000) return true;
    if (filter === "for_families" && property.maxGuests >= 4) return true;
    return false;
  }) : [];
  
  // Define placeholder properties for loading state
  const placeholderProperties = Array(3).fill(null).map((_, i) => ({
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
    <section className="py-16 bg-neutral-light african-pattern">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold font-montserrat text-neutral-dark">Featured Stays</h2>
            <p className="text-lg text-gray-600 mt-2">Handpicked spaces you'll love</p>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-2 overflow-x-auto pb-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              className="rounded-full text-sm" 
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={filter === "entire_homes" ? "default" : "outline"} 
              className="rounded-full text-sm whitespace-nowrap" 
              onClick={() => setFilter("entire_homes")}
            >
              Entire homes
            </Button>
            <Button 
              variant={filter === "private_rooms" ? "default" : "outline"} 
              className="rounded-full text-sm whitespace-nowrap" 
              onClick={() => setFilter("private_rooms")}
            >
              Private rooms
            </Button>
            <Button 
              variant={filter === "luxury" ? "default" : "outline"} 
              className="rounded-full text-sm" 
              onClick={() => setFilter("luxury")}
            >
              Luxury
            </Button>
            <Button 
              variant={filter === "for_families" ? "default" : "outline"} 
              className="rounded-full text-sm whitespace-nowrap" 
              onClick={() => setFilter("for_families")}
            >
              For families
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading 
            ? placeholderProperties.map((property) => (
                <PropertyCard key={property.id} property={property as any} isLoading={true} />
              ))
            : filteredProperties.slice(0, 3).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
          }
        </div>
        
        <div className="text-center mt-12">
          <Link href="/listings">
            <a className="inline-flex items-center justify-center bg-white border border-primary text-primary hover:bg-primary hover:text-white transition duration-300 font-medium px-6 py-3 rounded-full">
              Explore all stays <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
