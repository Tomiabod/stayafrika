import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Compass, Users, Map, Star, Camera, Coffee } from "lucide-react";
import { KentePattern } from "./africanPatterns";

const LocalExperiences = () => {
  const experienceTypes = [
    {
      icon: <Map className="h-10 w-10 text-accent" />,
      title: "City Tours",
      description: "Explore hidden gems and iconic landmarks with knowledgeable local guides."
    },
    {
      icon: <Coffee className="h-10 w-10 text-accent" />,
      title: "Food & Culture",
      description: "Taste authentic local cuisine and immerse yourself in cultural experiences."
    },
    {
      icon: <Camera className="h-10 w-10 text-accent" />,
      title: "Photography",
      description: "Capture stunning moments with guided photo walks through scenic locations."
    },
    {
      icon: <Users className="h-10 w-10 text-accent" />,
      title: "Community Connect",
      description: "Engage with local communities through meaningful activities and exchanges."
    }
  ];

  return (
    <section className="py-16 bg-neutral-light relative overflow-hidden">
      <div className="absolute left-0 top-0 w-1/3 h-full opacity-10">
        <KentePattern color="#F8B400" />
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Compass className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-secondary">
            Local Experiences with Tour Guides
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Enhance your stay with authentic local experiences led by StayAfrika's vetted tour guides. From city explorations to cultural immersions, make memories that last a lifetime.
          </p>
          <div className="max-w-md mx-auto">
            <Button asChild size="lg" variant="secondary" className="w-full bg-accent text-white hover:bg-accent/90">
              <Link href="/experiences">
                Browse All Experiences
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experienceTypes.map((experience, index) => (
            <Card key={index} className="border border-amber-100 group hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {experience.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-300">
                  {experience.title}
                </h3>
                <p className="text-gray-600">{experience.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/90 backdrop-blur-sm border border-amber-100">
            <CardContent className="p-6">
              <div className="mb-4">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Top-Rated Guides</h3>
              <p className="text-gray-600">
                All our guides are carefully selected, trained, and consistently rated 4.8+ stars by guests.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-amber-100">
            <CardContent className="p-6">
              <div className="mb-4">
                <Map className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
              <p className="text-gray-600">
                Our guides offer insider knowledge and authentic perspectives on the cities they call home.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-amber-100">
            <CardContent className="p-6">
              <div className="mb-4">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
              <p className="text-gray-600">
                By booking experiences, you directly support local economies and community development initiatives.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LocalExperiences;