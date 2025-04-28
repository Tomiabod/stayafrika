import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Map, Compass } from "lucide-react";
import { Link } from "wouter";
import { AfricanPattern } from "@/components/africanPatterns";

export default function NotFound() {
  return (
    <div className="container py-16 max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 -z-10">
          <AfricanPattern opacity={0.1} color="#E57C23" />
        </div>
        
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="pt-16 pb-12 text-center">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-3xl font-semibold text-gray-800 mb-6">
              Page Not Found
            </p>
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
              Oops! It seems the page you're looking for has taken an unexpected journey across the African savanna.
            </p>
            
            <div className="max-w-md mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100">
              <h3 className="text-xl font-medium text-secondary mb-4">Let us guide you back</h3>
              <p className="text-gray-600 mb-4">
                StayAfrika offers much more than just accommodations. Explore our properties, local experiences, or learn about our ownership program.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pb-16">
            <Button asChild size="lg" className="gap-2">
              <Link href="/">
                <Home className="w-5 h-5" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/listings">
                <Map className="w-5 h-5" />
                Browse Properties
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="gap-2">
              <Link href="/experiences">
                <Compass className="w-5 h-5" />
                Discover Experiences
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
