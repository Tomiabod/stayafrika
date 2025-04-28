import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const neighborhoods = [
  {
    id: 1,
    name: "Lekki",
    description: "Luxury waterfront living",
    image: "https://images.unsplash.com/photo-1596005554384-d293674c91d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    slug: "lekki"
  },
  {
    id: 2,
    name: "Victoria Island",
    description: "Business & entertainment hub",
    image: "https://images.unsplash.com/photo-1518477419798-8f312e39954b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    slug: "vi"
  },
  {
    id: 3,
    name: "Ikoyi",
    description: "Upscale residential area",
    image: "https://images.unsplash.com/photo-1580334155347-8c2c12ee1534?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    slug: "ikoyi"
  },
  {
    id: 4,
    name: "Yaba",
    description: "Tech hub & student living",
    image: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    slug: "yaba"
  }
];

const PopularNeighborhoods = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold font-montserrat text-neutral-dark">Popular Neighborhoods</h2>
            <p className="text-lg text-gray-600 mt-2">Explore Lagos' most sought-after locations</p>
          </div>
          <Link href="/listings?view=neighborhoods">
            <a className="hidden md:flex items-center text-primary hover:underline">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {neighborhoods.map((neighborhood) => (
            <Link key={neighborhood.id} href={`/listings?neighborhood=${neighborhood.slug}`}>
              <a className="group relative h-64 rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl block">
                <img 
                  src={neighborhood.image} 
                  alt={neighborhood.name} 
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-xl font-bold font-montserrat">{neighborhood.name}</h3>
                    <p className="text-sm opacity-90">{neighborhood.description}</p>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 text-center md:hidden">
          <Link href="/listings?view=neighborhoods">
            <a className="inline-flex items-center text-primary hover:underline">
              View all neighborhoods <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularNeighborhoods;
