import { Shield, Heart, Wallet } from "lucide-react";

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold font-montserrat text-neutral-dark mb-4">Why Choose StayAfrika</h2>
          <p className="text-lg text-gray-600">We're building the best way to discover authentic stays across Africa.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-montserrat mb-3">Verified Listings</h3>
            <p className="text-gray-600">Every property is verified for quality and accuracy. What you see is what you get.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-montserrat mb-3">Local Experience</h3>
            <p className="text-gray-600">Connect with hosts who can provide insights and recommendations for an authentic stay.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-montserrat mb-3">Secure Payments</h3>
            <p className="text-gray-600">Pay securely using local payment methods you trust, with transparent pricing.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
