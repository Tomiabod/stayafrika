import { Link } from "wouter";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Property } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyCardProps {
  property: Property & { 
    // Additional properties that might be added by the API
    avgRating?: number;
    reviewCount?: number;
  };
  isLoading?: boolean;
}

const PropertyCard = ({ property, isLoading = false }: PropertyCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-md">
        <div className="relative">
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-end">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Extract location parts
  const locationParts = property.neighborhood ? `${property.neighborhood}, ${property.city}` : property.city;
  
  // Property features to display as tags
  const features = [
    property.propertyType === 'entire_apartment' ? `${property.bedrooms} bedroom${property.bedrooms !== 1 ? 's' : ''}` : (
      property.propertyType === 'private_room' ? 'Private room' : 'Shared space'
    ),
    ...property.amenities?.slice(0, 3) || []
  ];
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 h-64">
          <img 
            src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
        </div>
        {property.cancellationPolicy === 'flexible' && (
          <div className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
            INSTANT BOOK
          </div>
        )}
        <button className="absolute top-3 right-3 text-gray-100 hover:text-primary transition">
          <Heart className="w-5 h-5 drop-shadow-md" />
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold font-montserrat">{property.title}</h3>
            <p className="text-gray-600">{locationParts}</p>
          </div>
          {property.avgRating ? (
            <div className="flex items-center bg-secondary/10 rounded-full px-2 py-1">
              <Star className="text-accent text-sm w-4 h-4" />
              <span className="ml-1 text-sm font-medium">{property.avgRating.toFixed(2)}</span>
            </div>
          ) : null}
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100 text-xs">
              {feature}
            </Badge>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-lg font-bold text-neutral-dark">₦{property.pricePerNight.toLocaleString()}</span>
              <span className="text-gray-600 text-sm">/ night</span>
            </div>
            <Link href={`/property/${property.id}`}>
              <a className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium">
                View details
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
