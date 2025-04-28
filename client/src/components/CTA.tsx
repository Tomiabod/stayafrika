import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1528277342758-f1d7613953a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Lagos Skyline" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/80"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6">Ready to Experience the Best of African Hospitality?</h2>
          <p className="text-lg mb-8">Find your perfect stay in Lagos or start hosting with StayAfrika today.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listings">
              <Button size="lg" className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-medium text-lg">
                Find a Stay
              </Button>
            </Link>
            <Link href="/become-host">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-3 bg-transparent hover:bg-white/10 text-white border border-white rounded-full font-medium text-lg"
              >
                Become a Host
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
