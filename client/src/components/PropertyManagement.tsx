import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Building, Globe, BarChart, Wallet, Shield } from "lucide-react";
import { ZigzagPattern } from "./africanPatterns";

const PropertyManagement = () => {
  const benefits = [
    {
      icon: <Building className="h-10 w-10 text-primary" />,
      title: "Remote Property Ownership",
      description: "Own property in African cities without the hassle of managing it yourself. Perfect for diaspora investors.",
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "Global Investment",
      description: "Invest in high-growth African real estate markets from anywhere in the world.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: "Rental Income",
      description: "Generate passive income through our professional management of your property on the StayAfrika platform.",
    },
    {
      icon: <Wallet className="h-10 w-10 text-primary" />,
      title: "Financing Options",
      description: "Flexible payment plans and financing options to make property ownership accessible.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Secure Investment",
      description: "All properties are vetted and managed by our professional team with legal protections for owners.",
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
        <ZigzagPattern color="#E57C23" />
      </div>
      
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-secondary">
            Property Management + Ownership Program
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            StayAfrika is not just a vacation rental platform. We offer a complete solution for property ownership and management, with special programs for diaspora clients.
          </p>
          <div className="max-w-md mx-auto">
            <Button asChild size="lg" className="w-full">
              <Link href="/ownership-program">
                Learn More About Ownership
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border border-amber-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                <ZigzagPattern color="#E57C23" />
              </div>
              <CardContent className="p-6">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-secondary text-white p-8 rounded-xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h3 className="text-2xl font-semibold mb-2">Ready to own property in Africa?</h3>
              <p className="text-secondary-foreground">
                Schedule a consultation with our investment advisors to explore options tailored to your needs.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="whitespace-nowrap">
              <Link href="/schedule-consultation">
                Schedule Consultation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyManagement;